import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolveConditionReference } from '../src/lib/condition-reference.mjs';

test('condition references keep PMID and resolve DOI, NCT, and FDA source to their actual records', () => {
  assert.deepEqual(resolveConditionReference('40756949'), {
    kind: 'pmid', href: 'https://pubmed.ncbi.nlm.nih.gov/40756949/', source: '40756949',
  });
  assert.deepEqual(resolveConditionReference('10.4021/jem157w'), {
    kind: 'doi', href: 'https://doi.org/10.4021/jem157w', source: '10.4021/jem157w',
  });
  assert.equal(resolveConditionReference('10.1016/S2213-8587(26)00125-7')?.href,
    'https://doi.org/10.1016/S2213-8587(26)00125-7');
  assert.deepEqual(resolveConditionReference('nct06358950'), {
    kind: 'nct', href: 'https://clinicaltrials.gov/study/NCT06358950', source: 'NCT06358950',
  });
  assert.deepEqual(resolveConditionReference('https://www.fda.gov/media/193343/download'), {
    kind: 'source', href: 'https://www.fda.gov/media/193343/download', source: 'FDA source',
  });
});

test('condition references reject unsupported, malformed, and unsafe destinations', () => {
  for (const raw of [
    'N/A', 'a paper title', '10.4021/', '10.4021/jem157w#fragment', '10.4021/a/../b',
    'javascript:alert(1)', 'http://www.fda.gov/media/193343/download',
    'https://www.fda.gov@evil.example.com/media/193343/download',
    'https://localhost/media/193343/download',
    'https://127.0.0.1/media/193343/download',
    'https://www.fda.gov/media/193343/download\n<script>',
  ]) assert.equal(resolveConditionReference(raw), null, raw);
});

test('unknown public HTTPS sources display their actual host', () => {
  const source = resolveConditionReference('https://pubmed.ncbi.nlm.nih.gov/40756949/');
  assert.equal(source?.kind, 'source');
  assert.equal(source?.source, 'pubmed.ncbi.nlm.nih.gov');
});
