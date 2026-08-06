/**
 * Canonical PubMed search primitives.
 *
 * THE RULE THIS MODULE EXISTS TO ENFORCE: never OR several quoted aliases into one query.
 *
 * PubMed silently drops the quotation marks when a quoted phrase has no match and falls back to
 * splitting it into loose terms. On its own that is survivable. Inside an OR it compounds
 * catastrophically, and it does so without any signal in the response — you get a large, confident,
 * entirely wrong number. Two observed cases from this repo:
 *
 *   - Six na-selank-amidate aliases returning 0, 0, 0, 2, 2 and 0 individually returned 28,694
 *     when ORed into a single query.
 *   - A "bronchogen" scan returned 60 papers on OX40-OX40L signalling, daptomycin pneumonia and
 *     phage-antibiotic synergy, none of which mention the compound.
 *
 * Three separate scripts had independently written the same OR-join, which is why this is a shared
 * module rather than three fixes. Querying one alias at a time costs more calls and removes the
 * failure mode entirely: a per-alias count cannot be inflated by its neighbours, and a degrading
 * alias is visible rather than smeared across a total.
 */

const UA = { 'User-Agent': 'PepCodex-verify/1.0 (mailto:admin@pepcodex.com)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const EUTILS = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';

/** NCBI asks for <= 3 req/s without a key; 380ms keeps us under it with margin. */
export const NCBI_DELAY = 380;

async function fetchT(url, ms = 30000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try { return await fetch(url, { headers: UA, signal: ctrl.signal }); }
  finally { clearTimeout(t); }
}

/**
 * Count records for ONE quoted phrase. Returns null on transport failure — never 0, because
 * "the registry did not answer" and "the registry answered nothing" demand opposite responses and
 * conflating them is how an outage turns into a false "this compound does not exist".
 */
export async function countPhrase(phrase, { filter = '' } = {}) {
  const term = `"${phrase}"${filter ? ` AND ${filter}` : ''}`;
  try {
    const r = await fetchT(`${EUTILS}/esearch.fcgi?db=pubmed&retmode=json&retmax=0&term=${encodeURIComponent(term)}`);
    if (!r.ok) return null;
    return Number((await r.json()).esearchresult?.count ?? 0);
  } catch { return null; }
}

/**
 * Count each alias separately. Returns { perAlias, best, anyFailed }.
 * `best` is the highest-scoring single alias — the right summary for "is this named at all",
 * whereas summing would double-count the same paper found under several spellings.
 */
export async function countPerAlias(aliases, opts = {}) {
  const perAlias = [];
  let anyFailed = false;
  for (const a of [...new Set(aliases)].filter(Boolean)) {
    const hits = await countPhrase(a, opts);
    if (hits === null) anyFailed = true; else perAlias.push({ alias: a, hits });
    await sleep(NCBI_DELAY);
  }
  const best = perAlias.reduce((m, x) => (x.hits > m.hits ? x : m), { alias: null, hits: 0 });
  return { perAlias, best, anyFailed };
}

/**
 * Retrieve PMIDs for each alias separately and union them.
 *
 * `truncated` reports any alias whose result set was capped, because a cap that is not reported
 * reads as completeness — the quiet version of a false claim.
 */
export async function searchPerAlias(aliases, { retmax = 200, sort = 'relevance', filter = '', primary = null, generosity = 10, floor = 15 } = {}) {
  const perAlias = [];
  const truncated = [];
  const idsByAlias = {};
  let anyFailed = false;
  const list = [...new Set(aliases)].filter(Boolean);
  for (const a of list) {
    const term = `"${a}"${filter ? ` AND ${filter}` : ''}`;
    try {
      const r = await fetchT(`${EUTILS}/esearch.fcgi?db=pubmed&retmode=json&retmax=${retmax}&sort=${sort}&term=${encodeURIComponent(term)}`);
      if (!r.ok) { anyFailed = true; continue; }
      const j = (await r.json()).esearchresult || {};
      const got = j.idlist || [];
      const total = Number(j.count || 0);
      idsByAlias[a] = got;
      perAlias.push({ alias: a, retrieved: got.length, total });
      if (total > retmax) truncated.push({ alias: a, retrieved: retmax, total });
    } catch { anyFailed = true; }
    await sleep(NCBI_DELAY);
  }

  /* SELF-CALIBRATING GENERICITY TEST.
   *
   * A blocklist of anatomical words cannot be complete, and relying on one repeats the mistake that
   * caused most of the defects in this repo: an enumerated list drifts the moment someone adds a
   * term it does not contain. It did. The vocabulary held "gastric" and "stomach" but not
   * "intestinal", so chonluten's alias "Intestinal peptide" sailed through and returned 29 papers
   * about vasoactive intestinal peptide, NDNF interneurons and Lactobacillus.
   *
   * So ask the data instead of a list. An alias that names the SAME compound as the primary name
   * cannot return wildly more records than the primary name does — if it returns 29 where the
   * primary returns 0, it is naming a category, not this compound. This needs no vocabulary, and it
   * catches words nobody thought to enumerate.
   *
   * Only applied when a primary name is supplied and did not itself fail, and only above an
   * absolute floor so that small honest differences between spellings are left alone.
   */
  const suspectGeneric = [];
  if (primary) {
    const base = perAlias.find((x) => x.alias === primary);
    if (base) {
      const limit = Math.max(base.total * generosity, floor);
      for (const x of perAlias) {
        if (x.alias === primary) continue;
        if (x.total > limit) {
          suspectGeneric.push({ alias: x.alias, total: x.total, primaryTotal: base.total,
            reason: `returns ${x.total} records where the primary name "${primary}" returns ${base.total}; it is naming a category, not this compound` });
          delete idsByAlias[x.alias];
        }
      }
    }
  }

  const ids = new Set();
  for (const arr of Object.values(idsByAlias)) arr.forEach((i) => ids.add(i));
  return { ids: [...ids], idsByAlias, perAlias, truncated, suspectGeneric, anyFailed };
}

/** Fetch title/abstract/metadata for PMIDs, in batches. Missing ids simply do not appear. */
export async function fetchRecords(pmids, { batch = 100 } = {}) {
  const out = {};
  for (let k = 0; k < pmids.length; k += batch) {
    try {
      const r = await fetchT(`${EUTILS}/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=${pmids.slice(k, k + batch).join(',')}`);
      if (r.ok) {
        const xml = await r.text();
        for (const c of xml.split(/<PubmedArticle[ >]/).slice(1)) {
          const pm = (c.match(/<PMID[^>]*>(\d+)<\/PMID>/) || [])[1];
          if (!pm) continue;
          out[pm] = {
            blob: c.replace(/<[^>]+>/g, ' '),
            title: ((c.match(/<ArticleTitle[^>]*>([\s\S]*?)<\/ArticleTitle>/) || [])[1] || '').replace(/<[^>]+>/g, '').trim(),
            year: (c.match(/<PubDate>[\s\S]*?<Year>(\d{4})<\/Year>/) || [])[1] || '',
            journal: ((c.match(/<Title>([\s\S]*?)<\/Title>/) || [])[1] || '').replace(/<[^>]+>/g, '').trim(),
            ptypes: [...c.matchAll(/<PublicationType[^>]*>([\s\S]*?)<\/PublicationType>/g)].map((m) => m[1]),
          };
        }
      }
    } catch { /* batch lost; callers treat absence as unknown, not as absence of the paper */ }
    await sleep(NCBI_DELAY);
  }
  return out;
}
