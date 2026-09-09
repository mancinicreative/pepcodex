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
   * Treat count imbalance as a quarantine signal for semantic review. A genuine development code
   * can be more common than a newer primary name, so the ratio alone does not establish identity.
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
            reason: `returns ${x.total} records where the primary name "${primary}" returns ${base.total}; quarantined for identity review, not proof of a wrong alias` });
          delete idsByAlias[x.alias];
        }
      }
    }
  }

  const ids = new Set();
  for (const arr of Object.values(idsByAlias)) arr.forEach((i) => ids.add(i));
  return { ids: [...ids], idsByAlias, perAlias, truncated, suspectGeneric, anyFailed };
}

/** Complete bounded surveillance search. Injectable transport also records raw responses in the CLI.
 * PubMed supports CRDT (record creation) and LR (completed record revision), not a publication-date
 * proxy. Queries exceeding PubMed's 10,000 UID limit are explicitly incomplete, never quiet zeros.
 */
export async function searchSurveillance({ alias, field, from, to, request, pageSize = 200 }) {
  if (!['crdt', 'lr'].includes(field)) throw new Error(`Unsupported surveillance date field: ${field}`);
  if (/["\[\]]/.test(alias)) throw new Error('Alias contains query syntax; identity review required');
  const term = `"${alias}" AND ("${from.replaceAll('-', '/')}"[${field}] : "${to.replaceAll('-', '/')}"[${field}])`;
  const ids = new Set(), pages = [];
  let total = null, error = null;
  try {
    do {
      const start = ids.size;
      const url = new URL(`${EUTILS}/esearch.fcgi`);
      Object.entries({ db: 'pubmed', retmode: 'json', retmax: pageSize, retstart: start, sort: 'pub date', term }).forEach(([k,v]) => url.searchParams.set(k, String(v)));
      const j = await request(url.href, 'json');
      const r = j.esearchresult;
      if (!r || !/^\d+$/.test(String(r.count)) || !Array.isArray(r.idlist) || j.error || r.ERROR) throw new Error('Invalid ESearch response');
      const count = Number(r.count);
      pages.push({ start, count, retrieved: r.idlist.length, queryTranslation: r.querytranslation ?? null, warnings: r.warninglist ?? null, errors: r.errorlist ?? null });
      if (total !== null && count !== total) throw new Error('Search count changed during pagination; repeat bounded window');
      total = count;
      if (r.errorlist && Object.values(r.errorlist).some(x => Array.isArray(x) ? x.length : Boolean(x))) throw new Error('ESearch query translation error; review raw response');
      for (const id of r.idlist) {
        if (!/^\d{1,9}$/.test(String(id))) throw new Error('Malformed PMID in ESearch');
        ids.add(String(id));
      }
      if (ids.size >= total) break;
      if (ids.size === start) throw new Error('ESearch pagination stalled or omitted records');
      if (ids.size >= 10000 || start + pageSize >= 10000) throw new Error('PubMed 10,000 UID cap; partition this window before claiming coverage');
    } while (true);
  } catch (e) { error = e.message; }
  return { alias, field, term, from, to, ids: [...ids], total, pages, complete: !error && ids.size === total, error };
}

const xmlText = (s = '') => s.replace(/<[^>]*>/g, ' ').replace(/&#(x[0-9a-f]+|\d+);/gi, (_, n) => String.fromCodePoint(n[0].toLowerCase() === 'x' ? parseInt(n.slice(1), 16) : Number(n))).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const element = (s, tag) => (s.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`)) || [])[1] || '';

// Direct-child scope prevents book editors or authors of nested references from being assigned
// to a chapter. Ignore comments/CDATA and quoted angle brackets while tracking element depth.
function directChildren(source, tag) {
  const found = [];
  let depth = 0, current = null;
  for (const m of source.matchAll(/<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<\?[\s\S]*?\?>|<((?:[^>"']|"[^"]*"|'[^']*')+)>/g)) {
    if (!m[1] || m[1].startsWith('!')) continue;
    const token = m[1].trim(), closing = token.startsWith('/');
    const name = (token.match(/^\/?([\w:.-]+)/) || [])[1];
    if (closing) {
      depth--;
      if (depth === 0 && current && name === tag) {
        found.push({ openTag: current.openTag, inner: source.slice(current.start, m.index) }); current = null;
      }
    } else if (!token.endsWith('/')) {
      if (depth === 0 && name === tag) current = { openTag: token, start: m.index + m[0].length };
      depth++;
    }
  }
  return found;
}

/** Parse each fetched article independently, including correction/retraction relationships.
 * Missing or unsupported records remain missing, allowing the caller to fail coverage explicitly.
 */
export function parseSurveillanceRecords(xml) {
  if (!/<PubmedArticleSet(?:\s|>)/.test(xml) || !/<\/PubmedArticleSet>/.test(xml)) throw new Error('Incomplete PubMed XML document');
  const records = {};
  for (const match of xml.matchAll(/<(PubmedArticle|PubmedBookArticle)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/g)) {
    const book = match[1] === 'PubmedBookArticle';
    const c = match[2], citation = element(c, book ? 'BookDocument' : 'MedlineCitation'), article = book ? citation : element(citation, 'Article');
    const pmid = xmlText(element(citation, 'PMID'));
    if (!/^\d{1,9}$/.test(pmid) || !article || !xmlText(element(article, 'ArticleTitle'))) continue;
    const relationships = [...citation.matchAll(/<CommentsCorrections\s+([^>]*)>([\s\S]*?)<\/CommentsCorrections>/g)].map(m => ({
      type: (m[1].match(/RefType=["']([^"']+)/) || [])[1] || 'UNKNOWN',
      pmid: xmlText(element(m[2], 'PMID')) || null, note: xmlText(element(m[2], 'Note')), refSource: xmlText(element(m[2], 'RefSource')),
    })).sort((a,b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
    const date = book ? element(citation, 'ContributionDate') : element(article, 'PubDate');
    const authorLists = directChildren(article, 'AuthorList');
    const authorList = book ? authorLists.find(list => {
      const type = (list.openTag.match(/\bType=["']([^"']+)["']/i) || [])[1];
      return !type || type.toLowerCase() === 'authors';
    }) : authorLists[0];
    const author = directChildren(authorList?.inner || '', 'Author')[0]?.inner || '';
    const firstAuthor = xmlText(element(author, 'CollectiveName')) || [xmlText(element(author, 'LastName')), xmlText(element(author, 'Initials'))].filter(Boolean).join(' ');
    const ownIds = element(element(c, book ? 'PubmedBookData' : 'PubmedData'), 'ArticleIdList');
    records[pmid] = { pmid, recordType: match[1], title: xmlText(element(article, 'ArticleTitle')), abstract: xmlText(element(article, 'Abstract')),
      abstractAvailable: Boolean(element(article, 'Abstract')), journal: book ? '' : xmlText(element(element(article, 'Journal'), 'Title')),
      bookTitle: book ? xmlText(element(element(citation, 'Book'), 'BookTitle')) : null,
      publicationDates: { issueDate: book ? null : xmlText(date), electronicDate: book ? null : xmlText(element(article, 'ArticleDate')),
        bookEditionDate: book ? xmlText(element(element(citation, 'Book'), 'PubDate')) : null, contributionDate: book ? xmlText(date) : null },
      pubdate: xmlText(date), firstAuthor, firstAuthorStatus: firstAuthor ? 'present' : 'unknown',
      doi: xmlText((ownIds.match(/<ArticleId\s+IdType=["']doi["'][^>]*>([\s\S]*?)<\/ArticleId>/i) || [])[1]) || null,
      pubTypes: [...article.matchAll(/<PublicationType[^>]*>([\s\S]*?)<\/PublicationType>/g)].map(m => xmlText(m[1])).sort(), relationships,
      revised: xmlText(element(citation, 'DateRevised')),
    };
  }
  return records;
}

export async function fetchSurveillanceRecords(ids, { request, batch = 100 } = {}) {
  const records = {}, failures = [];
  const unique = [...new Set(ids)];
  for (let k = 0; k < unique.length; k += batch) {
    const slice = unique.slice(k, k + batch);
    try {
      const xml = await request(`${EUTILS}/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=${slice.join(',')}`, 'text');
      Object.assign(records, parseSurveillanceRecords(xml));
      const missing = slice.filter(id => !records[id]);
      if (missing.length) {
        const unsupported = [...xml.matchAll(/<PubmedBookArticle(?:\s[^>]*)?>([\s\S]*?)<\/PubmedBookArticle>/g)]
          .map(m => xmlText(element(element(m[1], 'BookDocument'), 'PMID'))).filter(id => missing.includes(id));
        failures.push({ requested: slice, missing, unsupported,
          error: unsupported.length ? 'UNSUPPORTED_OR_MALFORMED_RECORD: PubmedBookArticle; inspect retained raw XML' : 'Missing PubMed records in successful HTTP response' });
      }
    } catch (e) { failures.push({ requested: slice, missing: slice, error: e.message }); }
  }
  return { records, failures, complete: failures.length === 0 && unique.every(id => records[id]) };
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
