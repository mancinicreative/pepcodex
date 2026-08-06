/**
 * Canonical matching primitives for every verification check.
 *
 * WHY THIS FILE EXISTS: during the 2026-07-24/25 sweep the same matching decision was implemented
 * separately in eight scripts, and each carried its own bugs — one folded diacritics, another did
 * not; one allowed parentheses in DOIs, another truncated them. Fixing a matcher in one place left
 * the others wrong. Every check now imports from here, and `verification/fixtures.json` asserts
 * these functions against the real false positives and false negatives observed in that sweep.
 *
 * Each exported matcher documents the failure mode it exists to prevent. If you change one, run
 * `npm run verify:graph` — the self-test stage will fail before any corpus check runs.
 */

// ---------------------------------------------------------------------------
// Text normalisation
// ---------------------------------------------------------------------------

/**
 * Fold to a comparable form. NFD strips combining accents (Jetté -> Jette) but does NOT decompose
 * standalone letters, so ø/æ/ß/ł need explicit transliteration — "Vilsbøll" vs a stored "Vilsboll"
 * was reported as a fabricated citation until this was added.
 */
export const fold = (s) => String(s || '')
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/ø/gi, 'o').replace(/æ/gi, 'ae').replace(/œ/gi, 'oe')
  .replace(/ß/g, 'ss').replace(/đ/gi, 'd').replace(/ł/gi, 'l')
  .replace(/ð/gi, 'd').replace(/þ/gi, 'th')
  .toLowerCase();

export const words = (s) => fold(s).replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter((w) => w.length > 3);

/** Symmetric overlap — "are these the same document". */
export const jaccard = (a, b) => {
  const A = new Set(words(a)), B = new Set(words(b));
  if (!A.size || !B.size) return 0;
  let i = 0; for (const w of A) if (B.has(w)) i++;
  return i / (A.size + B.size - i);
};

/** Asymmetric — "is `needle`'s content present in `hay`" (a citation string contains its title). */
export const containment = (needle, hay) => {
  const A = new Set(words(needle)), B = new Set(words(hay));
  if (!A.size || !B.size) return 0;
  let i = 0; for (const w of A) if (B.has(w)) i++;
  return i / A.size;
};

/**
 * Publishing boilerplate carries similarity that means nothing. "Trends in Peptide Drug Development"
 * vs "Trends in Antiviral Drug Development" shares 3 of 4 words while the ONE distinguishing word
 * differs — that was a Wiley book's front matter cited as a peptide article. Compare on content
 * words only.
 */
const BOILERPLATE = new Set(['trends', 'novel', 'approaches', 'approach', 'development', 'treatment',
  'review', 'study', 'studies', 'update', 'current', 'clinical', 'therapy', 'therapeutic',
  'analysis', 'effects', 'effect', 'role', 'evaluation', 'assessment', 'overview', 'advances']);
export const contentWords = (s) => words(s).filter((w) => !BOILERPLATE.has(w));

/**
 * Is the stored string a formatted CITATION rather than a title? Many records store
 * "Dhillo WS, et al. J Clin Endocrinol Metab 2005;90(12):6609-6615" with no title at all — a real
 * landmark kisspeptin paper. Title comparison cannot judge those; author+year must.
 */
export const looksLikeBareCitation = (s) => {
  const t = String(s || '');
  return /^[A-Z][a-zA-Z'’\-]+\s+[A-Z]{1,3}\b/.test(t)          // starts with surname + initials
    && /\b(19|20)\d{2}\b/.test(t)                               // carries a year
    && (/;\s*\d+/.test(t) || /:\s*\d+[-–]\d+/.test(t) || /\(\d+\)/.test(t)); // volume/issue/pages
};

/** Non-Latin titles (Russian originals) cannot be string-compared to an English translation. */
export const scriptsDiffer = (a, b) => {
  const nonLatin = (s) => /[Ѐ-ӿͰ-Ͽ一-鿿぀-ヿ]/.test(String(s || ''));
  return nonLatin(a) !== nonLatin(b);
};

/**
 * Do two titles describe the same document?
 *
 * Returns TRUE ("agrees") whenever the comparison cannot be made honestly — a bare citation, a
 * different script — because a check that cannot judge must not condemn. Those cases are covered by
 * the author+year test instead.
 *
 * The threshold is on CONTENT words: publishing boilerplate ("Trends in ... Drug Development")
 * carries enough similarity to mask a completely different subject, which is how a Wiley book's
 * front matter came to be cited as a peptide article.
 */
export const titlesAgree = (stored, real, { threshold = 0.6 } = {}) => {
  if (!stored || !real) return true;
  if (looksLikeBareCitation(stored)) return true;
  if (scriptsDiffer(stored, real)) return true;
  const A = new Set(contentWords(stored)), B = new Set(contentWords(real));
  if (!A.size || !B.size) return jaccard(stored, real) >= 0.35;
  let i = 0; for (const w of A) if (B.has(w)) i++;
  return i / Math.min(A.size, B.size) >= threshold;
};

// ---------------------------------------------------------------------------
// Identifiers
// ---------------------------------------------------------------------------

/**
 * DOI suffixes legitimately contain parentheses (Elsevier/Lancet: 10.1016/S0140-6736(21)01324-6).
 * A `[^)]+` capture truncated 47 real DOIs here and, worse, hid a RETRACTED paper from the
 * retraction gate. Capture through parens, then strip only UNBALANCED trailing ones, which is what
 * prose like "(see 10.1234/abc)" produces.
 */
export const DOI_CHARS = /10\.\d{4,9}\/[^\s"'\]]+/;
export const trimDoi = (s) => {
  let d = String(s || '').replace(/[.,;]+$/, '');
  const count = (str, ch) => str.split(ch).length - 1;
  while (d.endsWith(')') && count(d, '(') < count(d, ')')) d = d.slice(0, -1);
  return d;
};
export const extractDoi = (s) => {
  const m = String(s || '').match(DOI_CHARS);
  return m ? trimDoi(m[0]) : null;
};

/**
 * A trial family shares its stem by design, so the stem carries almost no identifying information:
 * "REDEFINE CVOT" matched REDEFINE 3, and both SYNCHRONIZE-1 and SYNCHRONIZE-CVOT matched
 * SYNCHRONIZE-2 — three different trials, three confident wrong answers. Require exact equality
 * after stripping registry decoration (™, spacing, punctuation).
 */
export const flattenAcronym = (s) => String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
export const acronymsAgree = (stored, candidate) =>
  !!flattenAcronym(stored) && flattenAcronym(stored) === flattenAcronym(candidate);

// ---------------------------------------------------------------------------
// Authorship
// ---------------------------------------------------------------------------

/** Does a stored label actually look like a person? Surname + initials. */
export const looksLikeAuthor = (s) => /^[A-Z][a-zA-Z'’\-]+(\s+[a-z]{2,3})?\s+[A-Z]{1,3}\b/.test(String(s || '').trim());

/**
 * Surnames of two characters are real (Ng, Wu, Lu, El). A `length > 2` guard condemned four correct
 * citations. Collective authorship ("... Study Group") never matches a person-shaped label, so the
 * test only applies when the stored label looks like a person.
 */
export const authorAgrees = (storedLabel, pubmedAuthors) => {
  if (!looksLikeAuthor(storedLabel)) return true;           // not an author field — nothing to test
  const surname = (String(storedLabel).match(/^([A-Z][a-zA-Z'’\-]+)/) || [])[1] || '';
  if (surname.length < 2) return true;
  return fold(pubmedAuthors).includes(fold(surname));
};

/**
 * A year must be a standalone token. Without the lookarounds, "TAK-861-2001" (a protocol code)
 * yields 2001 and every oveporexton citation is accused of a 24-year error.
 */
export const extractYear = (s) => (String(s || '').match(/(?<![-\d/])((?:19|20)\d{2})(?![-\d/])/) || [])[0] || null;
export const yearsAgree = (storedLabel, realYear, tolerance = 1) => {
  const y = extractYear(storedLabel);
  if (!y || !realYear) return true;
  return Math.abs(Number(y) - Number(realYear)) <= tolerance;
};

// ---------------------------------------------------------------------------
// Drug / relevance
// ---------------------------------------------------------------------------

export const wordBoundaryHit = (needle, hay) =>
  new RegExp(`(?<![a-z0-9])${String(needle).replace(/[.*+?^${}()|[\]\\-]/g, '\\$&')}(?![a-z0-9])`, 'i')
    .test(String(hay));

/**
 * A trial belongs to a peptide if the registry names it or any known alias — including development
 * codes. Matching on the dossier's public aliases alone produced 26 bogus "wrong drug" hits: every
 * tb-500 Thymosin beta-4 trial, TAK-448 (a real kisspeptin analog), GHRH(1-44) for tesamorelin, and
 * NCT03856047, the genuine cagrilintide Phase 2 that CT.gov lists under code NNC0174-0833.
 */
export const drugMatches = (aliases, registryText) => {
  const hay = String(registryText || '').toLowerCase();
  return (aliases || []).some((a) => String(a).length >= 4 && hay.includes(String(a).toLowerCase()));
};

/**
 * Literature relevance. Two failure modes, both observed:
 *  1. PubMed degrades an unmatched quoted phrase into loose term matching and returns a large,
 *     confident, unrelated set ("bronchogen" -> OX40-OX40L signalling, daptomycin pneumonia).
 *  2. Short aliases are acronym collisions: NASA (N-Acetyl Selank Amidate) matched a maser and a
 *     Mars paper; AED (Cardiogen) matched defibrillators; EDL (Ovagen) a leg muscle; P21 the
 *     p21/CDKN1A gene.
 * So: a long name/alias on a word boundary, OR a short one plus domain context.
 */
const CONTEXT = /\b(peptide|tripeptide|dipeptide|oligopeptide|bioregulator|amino acid|analog|analogue|agonist)\b/i;
export const isRelevant = (names, text) => {
  const all = [...new Set((names || []).map((n) => String(n).toLowerCase()).filter(Boolean))];
  const strong = all.filter((a) => a.length >= 6);
  const weak = all.filter((a) => a.length >= 3 && a.length < 6);
  if (strong.some((a) => wordBoundaryHit(a, text))) return true;
  return weak.some((a) => wordBoundaryHit(a, text)) && CONTEXT.test(text);
};

// ---------------------------------------------------------------------------
// Quantities
// ---------------------------------------------------------------------------

const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = { 20: 'twenty', 30: 'thirty', 40: 'forty', 50: 'fifty', 60: 'sixty', 70: 'seventy', 80: 'eighty', 90: 'ninety' };
const spelled = (n) => {
  if (!Number.isInteger(n) || n < 0 || n > 99) return null;
  if (n < 20) return ONES[n];
  const t = Math.floor(n / 10) * 10, o = n % 10;
  return o ? `${TENS[t]}-${ONES[o]}` : TENS[t];
};

/** Lancet/NEJM write decimals with a MIDDLE DOT ("hazard ratio 0·56"), defeating \d\.\d. */
export const normaliseSource = (s) => String(s || '')
  .replace(/&#x?b7;|&middot;|·/gi, '.')
  .replace(/\s+/g, ' ');

/**
 * Quantities a claim asserts. Any token mixing letters and digits is a NAME, not a measurement:
 * MK-677, SHLP-6, MMP-9, 22Rv1, LY3298176. Extracting "677" from MK-677 and reporting it missing
 * is pure noise, and a noisy queue gets ignored.
 */
export const assertedNumbers = (text) => {
  const cleaned = String(text || '')
    .replace(/\b(19|20)\d{2}\b/g, ' ')
    .replace(/\bphase\s*[0-9/ab]+/gi, ' ')
    .replace(/\b[A-Za-z]+[-–]?\d+[A-Za-z0-9-]*\b/g, ' ')
    .replace(/\b\d+[A-Za-z]+[A-Za-z0-9-]*\b/g, ' ');
  const out = new Set();
  for (const m of cleaned.matchAll(/(\d[\d,]*\.?\d*)/g)) {
    const v = Number(m[1].replace(/,/g, ''));
    if (!Number.isFinite(v) || v <= 3) continue;
    out.add(m[1].replace(/,/g, '').replace(/\.0+$/, ''));
  }
  return [...out];
};

const ratiosIn = (src) => [...normaliseSource(src).matchAll(/(?:hazard|odds|risk|rate)\s*ratio[^0-9]{0,45}(\d\.\d{1,3})/gi)]
  .map((m) => Number(m[1])).filter(Number.isFinite);

/**
 * Is a claimed number supported by the source? Accepts: literal presence, spelled-out form
 * ("Sixty-two"), rounding ("~62-78%" for -61.9/-77.5), and relative-risk derivation
 * ("26% reduction" from "hazard ratio, 0.74"). All four were real false positives.
 */
export const numberSupported = (num, source) => {
  const src = normaliseSource(source);
  const n = Number(num);
  if (!Number.isFinite(n)) return false;

  const variants = new Set([String(num), String(n), n.toFixed(1), n.toFixed(2), String(Math.round(n)), n.toLocaleString('en-US')]);
  const w = spelled(n);
  if (w) variants.add(w);
  const lower = src.toLowerCase();
  for (const v of variants) {
    if (!v) continue;
    if (/^[a-z-]+$/.test(v)) { if (lower.includes(v)) return true; continue; }
    if (new RegExp(`(?<![\\d.])${v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\d])`).test(src)) return true;
  }
  // rounding tolerance against any number present
  const tol = n >= 100 ? Math.max(1, n * 0.01) : 1.0;
  for (const m of src.matchAll(/\d[\d,]*\.?\d*/g)) {
    const v = Number(m[0].replace(/,/g, ''));
    if (Number.isFinite(v) && Math.abs(v - n) <= tol) return true;
  }
  // relative risk reduction stated as a ratio
  if (n > 0 && n < 100) for (const hr of ratiosIn(src)) {
    if (Math.abs((1 - hr) * 100 - n) <= 1.5) return true;
    if (Math.abs(hr * 100 - n) <= 1.5) return true;
  }
  return false;
};

// ---------------------------------------------------------------------------
// Authoring safety
// ---------------------------------------------------------------------------

/** MDX parses `<` before a digit as a JSX tag — "P<0.001" failed the build with 0 pages emitted. */
export const hasUnsafeMdxLt = (body) => /<(?=\d)/.test(String(body || ''));

/** An unquoted YAML scalar containing ": " is read as a nested mapping and fails the parse. */
export const hasUnsafeYamlScalar = (line) =>
  /^(title|metaTitle|metaDescription|excerpt):\s+(?!["'|>])(.*:\s.*)$/.test(String(line || ''));
