// Judge fetch round 3: retry 41113119 after rate limit.
await new Promise(r => setTimeout(r, 3000));
const r = await fetch('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=41113119&rettype=abstract&retmode=text', { headers: { 'User-Agent': 'pepcodex-judge/1.0' } });
console.log(JSON.stringify({ status: r.status, text: await r.text() }, null, 2));
