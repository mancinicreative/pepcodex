/**
 * Check that the NUMBERS in a dossier's claims actually appear in the paper being cited.
 *
 * This is the fabrication class that survives every identifier check. A citation can resolve, point
 * at the right drug, and carry the right author and year — while the effect size bolted onto it was
 * invented. That is exactly how "22.7% weight loss" was once attributed to a paper reporting 20.4%.
 * No gate on this site has ever tested it.
 *
 * Method: pull each cited paper's title+abstract from PubMed, extract the quantities asserted in our
 * `finding` text (percentages, sample sizes, doses, durations, absolute changes), and check whether
 * each appears in the source. Numbers are compared with tolerance for formatting (1,961 == 1961;
 * 14.9 == 14.90) and a percentage is accepted if the bare number appears.
 *
 * DELIBERATELY A REVIEW QUEUE, NOT A BUILD GATE. An abstract is a summary: a real figure often lives
 * only in the full text, tables, or supplement, so "not in the abstract" means "a human should look",
 * not "fabricated". Treating this as build-breaking would train everyone to ignore it.
 *
 * Usage: node scripts/verify-quantitative-claims.mjs [--min-missing 2]
 * Output: .planning/citation-audit/quantitative-claims.json + QUANTITATIVE-REVIEW.md
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const args = process.argv.slice(2);
const MIN_MISSING = args.includes('--min-missing') ? Number(args[args.indexOf('--min-missing') + 1]) : 1;
const DIR = 'src/content/peptides';
const OUT = '.planning/citation-audit';
const UA = { 'User-Agent': 'PepCodex-quant/1.0 (mailto:admin@pepcodex.com)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function fetchT(url, ms = 30000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try { return await fetch(url, { headers: UA, signal: ctrl.signal }); }
  finally { clearTimeout(t); }
}

// --- collect claims that assert a quantity ---
const records = [];
for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith('.mdx'))) {
  const d = matter(fs.readFileSync(path.join(DIR, f), 'utf-8')).data;
  (function walk(n) {
    if (n == null || typeof n !== 'object') return;
    if (Array.isArray(n)) return n.forEach(walk);
    if (n.pmid && /^\d{6,9}$/.test(String(n.pmid)) && n.finding && /\d/.test(String(n.finding))) {
      records.push({ file: f, pmid: String(n.pmid), study: n.study || '', finding: String(n.finding) });
    }
    Object.values(n).forEach(walk);
  })(d);
}
const ids = [...new Set(records.map((r) => r.pmid))];
console.log(`Quantitative claims: ${records.length} findings citing ${ids.length} unique papers`);

// --- fetch title + abstract ---
const abs = {};
let incomplete = false;
for (let i = 0; i < ids.length; i += 100) {
  const batch = ids.slice(i, i + 100);
  try {
    const res = await fetchT(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=${batch.join(',')}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    // split per article, map PMID -> concatenated title+abstract text
    for (const chunk of xml.split(/<PubmedArticle[ >]/).slice(1)) {
      const pm = (chunk.match(/<PMID[^>]*>(\d+)<\/PMID>/) || [])[1];
      if (!pm) continue;
      const title = (chunk.match(/<ArticleTitle[^>]*>([\s\S]*?)<\/ArticleTitle>/) || [])[1] || '';
      const texts = [...chunk.matchAll(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/g)].map((m) => m[1]).join(' ');
      abs[pm] = `${title} ${texts}`
        .replace(/<[^>]+>/g, ' ')
        // The Lancet/NEJM house style writes decimals with a MIDDLE DOT — "hazard ratio 0·56" —
        // which arrives here as &#xb7; or U+00B7 and defeats a \d\.\d regex, so a perfectly correct
        // derived percentage (44% from HR 0·56) gets reported as unsupported.
        .replace(/&#x?b7;|&middot;|·/gi, '.')
        .replace(/&[a-z]+;/gi, ' ')
        .replace(/\s+/g, ' ');
    }
  } catch (e) { incomplete = true; console.error(`WARN batch ${i / 100 + 1}: ${e.message}`); }
  await sleep(400);
  process.stdout.write(`\r  fetched ${Math.min(i + 100, ids.length)}/${ids.length}`);
}
console.log('');

// --- extract the quantities a claim asserts ---
// Skip things that are not empirical quantities: years, PMIDs, phase numbers, receptor names.
const numbersIn = (text) => {
  const out = new Set();
  const cleaned = String(text)
    .replace(/\b(19|20)\d{2}\b/g, ' ')            // years
    .replace(/\bphase\s*[0-9/ab]+/gi, ' ')        // phase 3, phase 2b
    // Any token that mixes letters and digits is a NAME, not a measurement: MK-677, SHLP-6, MMP-9,
    // 22Rv1, NIT-1, LY3298176, POL7080, SOM230, SS-31, BPC-157. Extracting "677" from MK-677 and
    // then reporting it "not found in the source" is pure noise, and noise gets a queue ignored.
    .replace(/\b[A-Za-z]+[-–]?\d+[A-Za-z0-9-]*\b/g, ' ')
    .replace(/\b\d+[A-Za-z]+[A-Za-z0-9-]*\b/g, ' ');
  for (const m of cleaned.matchAll(/(\d[\d,]*\.?\d*)\s*(%|percent|mg|kg|µg|mcg|ug|weeks?|months?|days?|years?|patients?|participants?|subjects?)?/gi)) {
    const raw = m[1].replace(/,/g, '');
    const v = Number(raw);
    if (!Number.isFinite(v)) continue;
    if (v === 0 || v === 1 || v === 2 || v === 3) continue;  // ordinals/arm counts, too noisy
    out.add(raw.replace(/\.0+$/, ''));
  }
  return [...out];
};

// Abstracts routinely spell numbers out — selank's "62 patients" appears as "Sixty-two patients",
// so a digits-only comparison reports a true claim as missing.
const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = { 20: 'twenty', 30: 'thirty', 40: 'forty', 50: 'fifty', 60: 'sixty', 70: 'seventy', 80: 'eighty', 90: 'ninety' };
const spelled = (n) => {
  if (!Number.isInteger(n) || n < 0 || n > 99) return null;
  if (n < 20) return ONES[n];
  const t = Math.floor(n / 10) * 10, o = n % 10;
  return o ? `${TENS[t]}-${ONES[o]}` : TENS[t];
};

const inSource = (num, src) => {
  const n = Number(num);
  const variants = new Set([num, String(n), n.toFixed(1), n.toFixed(2),
    n.toLocaleString('en-US'), String(Math.round(n))]);
  const w = spelled(n);
  if (w) variants.add(w);
  const lower = src.toLowerCase();
  for (const v of variants) {
    if (!v) continue;
    if (/^[a-z-]+$/.test(v)) { if (lower.includes(v)) return true; continue; }
    if (new RegExp(`(?<![\\d.])${v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\d])`).test(src)) return true;
  }
  return false;
};

// A relative risk reduction is normally reported by the paper as a ratio and by us as a percentage:
// SUSTAIN-6 states "hazard ratio, 0.74" and we say "26% reduction"; KEYNOTE-942 states HR 0.56 and
// we say "44%". Both are correct. Accept a percentage that equals (1 - ratio) x 100 for any
// hazard/odds/risk ratio present in the source, or the ratio expressed as a percentage.
const ratiosIn = (src) => [...src.matchAll(/(?:hazard|odds|risk|rate)\s*ratio[^0-9]{0,45}(\d\.\d{1,3})/gi)]
  .map((m) => Number(m[1])).filter(Number.isFinite);

// Writers round, and a rounded figure is still a correct citation: pasireotide's "~62-78%" is an
// honest rendering of the paper's -61.9% and -77.5%. Accept a claimed value that sits within
// rounding distance of any number actually present in the source.
const roundsTo = (num, src) => {
  const n = Number(num);
  if (!Number.isFinite(n)) return false;
  const tol = n >= 100 ? Math.max(1, n * 0.01) : 1.0;
  for (const m of String(src).matchAll(/\d[\d,]*\.?\d*/g)) {
    const v = Number(m[0].replace(/,/g, ''));
    if (Number.isFinite(v) && Math.abs(v - n) <= tol) return true;
  }
  return false;
};

const derivable = (num, src) => {
  const n = Number(num);
  if (roundsTo(num, src)) return true;
  if (!Number.isFinite(n) || n <= 0 || n >= 100) return false;
  for (const hr of ratiosIn(src)) {
    if (Math.abs((1 - hr) * 100 - n) <= 1.5) return true;   // 26% from HR 0.74
    if (Math.abs(hr * 100 - n) <= 1.5) return true;          // 74% from HR 0.74
  }
  return false;
};

const findings = [];
let checked = 0, noAbs = 0;
for (const r of records) {
  const src = abs[r.pmid];
  if (!src || src.trim().length < 40) { noAbs++; continue; }
  checked++;
  const nums = numbersIn(r.finding);
  if (!nums.length) continue;
  const missing = nums.filter((n) => !inSource(n, src) && !derivable(n, src));
  if (missing.length >= MIN_MISSING) {
    findings.push({ ...r, numbersAsserted: nums, notFoundInSource: missing,
      ratio: +(missing.length / nums.length).toFixed(2), sourcePreview: src.slice(0, 200) });
  }
}

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'quantitative-claims.json'), JSON.stringify(findings, null, 2));

// rank: a claim where NONE of its numbers appear is far more suspicious than one where a single
// secondary figure is missing.
findings.sort((a, b) => b.ratio - a.ratio || b.notFoundInSource.length - a.notFoundInSource.length);
const total = findings.filter((f) => f.ratio === 1).length;
console.log(`\nchecked ${checked} claims (${noAbs} papers had no usable abstract)`);
console.log(`flagged ${findings.length}; of those ${total} have NO asserted number present in the source`);

const L = [`# Quantitative Claim Review — ${new Date().toISOString().slice(0, 10)}`, '',
  'Numbers asserted in a dossier claim that do not appear in the cited paper\'s title/abstract.',
  '**This is a review queue, not proof of fabrication** — real figures often live only in the full',
  'text, tables, or supplement. Ranked worst-first: `ratio 1.00` means not one asserted number',
  'appears in the source, which is the pattern worth looking at first.', '',
  `Checked ${checked} claims · flagged ${findings.length} · ${total} with ratio 1.00`, ''];
for (const f of findings.slice(0, 80)) {
  L.push(`### ${f.file} — PMID ${f.pmid} (ratio ${f.ratio})`);
  L.push(`- study: ${f.study}`);
  L.push(`- claim: ${f.finding}`);
  L.push(`- asserted: ${f.numbersAsserted.join(', ')}`);
  L.push(`- **not in source: ${f.notFoundInSource.join(', ')}**`);
  L.push(`- source: ${f.sourcePreview}…`);
  L.push('');
}
fs.writeFileSync(path.join(OUT, 'QUANTITATIVE-REVIEW.md'), L.join('\n'));
console.log(`\nWrote ${OUT}/QUANTITATIVE-REVIEW.md`);
if (incomplete) console.error('WARN: some PubMed batches failed — coverage partial.');
