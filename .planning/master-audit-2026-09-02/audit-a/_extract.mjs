import fs from 'node:fs';
import path from 'node:path';

function fm(file) {
  const t = fs.readFileSync(file, 'utf8');
  const m = t.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? m[1] : '';
}
function grab(yml, key) {
  const re = new RegExp('^' + key + ':\\s*(.*)$', 'm');
  const m = yml.match(re);
  return m ? m[1].trim() : null;
}

const slugs = [
  'semaglutide','tirzepatide','retatrutide','bpc-157','tb-500','tesamorelin','semax','epithalon','melanotan-ii','pt-141','orforglipron','cagrilintide','liraglutide','mk-677','ipamorelin','ghk-cu','thymosin-alpha-1','ss-31','mots-c','sermorelin'
];
for (const s of slugs) {
  const f = 'src/content/peptides/' + s + '.mdx';
  if (!fs.existsSync(f)) { console.log('MISSING', s); continue; }
  const y = fm(f);
  const body = fs.readFileSync(f, 'utf8').split(/^---\r?\n[\s\S]*?\r?\n---/)[1] || '';
  console.log('\n==== ' + s + ' ====');
  console.log('name:', grab(y, 'name'));
  console.log('evidence:', grab(y, 'evidenceStrength'));
  const reg = y.match(/regulatoryStatus:[\s\S]*?status:\s*(\S+)/);
  console.log('reg:', reg ? reg[1] : 'NONE');
  console.log('summary:', (grab(y, 'summary') || '').slice(0, 280));
  console.log('metaTitle:', grab(y, 'metaTitle'));
  console.log('metaDesc:', (grab(y, 'metaDescription') || '').slice(0, 220));
  console.log('hasFaqs:', /faqs:/.test(y));
  console.log('hasTimeline:', /timeline:/.test(y));
  console.log('hasQuality:', /qualityChecklist:/.test(y));
  console.log('hasScoring:', /scoring:/.test(y));
  const pmids = [...y.matchAll(/pmid:\s*['\"]?(\d{7,8})/g)].map(m => m[1]);
  console.log('frontmatter_pmids:', pmids.length, pmids.slice(0, 8).join(','));
  const boxed = y.match(/boxedWarning[\s\S]{0,250}/);
  if (boxed) console.log('boxed:', boxed[0].slice(0, 200));
  const thyroid = (y + body).match(/thyroid|medullary|MTC|MEN 2|boxed/gi);
  console.log('thyroid_or_boxed_hits:', thyroid ? thyroid.length : 0, thyroid ? [...new Set(thyroid.map(x=>x.toLowerCase()))].join(',') : '');
  console.log('body_len:', body.length);
}
