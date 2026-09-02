import fs from 'node:fs';
import path from 'node:path';

const clinicDir = 'src/content/clinics';
const cityDir = 'src/content/cities';

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return { error: 'no frontmatter' };
  const yaml = m[1];
  const obj = {};
  let key = null;
  let list = null;
  const lines = yaml.split(/\r?\n/);
  for (const line of lines) {
    if (/^\s+- /.test(line) && list) {
      list.push(line.replace(/^\s+-\s*/, '').replace(/^['"]|['"]$/g, ''));
      continue;
    }
    const km = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (km) {
      key = km[1];
      const val = km[2];
      if (val === '' || val === '|' || val === '>') {
        list = [];
        obj[key] = list;
      } else if (val === '[]') {
        obj[key] = [];
        list = null;
      } else {
        list = null;
        let v = val;
        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
          v = v.slice(1, -1);
        }
        if (v === 'true') obj[key] = true;
        else if (v === 'false') obj[key] = false;
        else if (/^-?\d+$/.test(v)) obj[key] = Number(v);
        else obj[key] = v;
      }
    }
  }
  return obj;
}

const clinics = fs.readdirSync(clinicDir).filter((f) => f.endsWith('.mdx')).sort().map((f) => {
  const raw = fs.readFileSync(path.join(clinicDir, f), 'utf8');
  const data = parseFrontmatter(raw);
  const body = raw.replace(/^---[\s\S]*?---/, '').trim();
  return { file: f, bodyLen: body.length, bodyPreview: body.slice(0, 240), keys: Object.keys(data), data };
});

const cities = fs.readdirSync(cityDir).filter((f) => f.endsWith('.mdx')).sort().map((f) => {
  const raw = fs.readFileSync(path.join(cityDir, f), 'utf8');
  const data = parseFrontmatter(raw);
  const body = raw.replace(/^---[\s\S]*?---/, '').trim();
  return { file: f, bodyLen: body.length, bodyPreview: body.slice(0, 400), keys: Object.keys(data), data };
});

const out = { clinicCount: clinics.length, cityCount: cities.length, clinics, cities };
fs.writeFileSync('.planning/master-audit-2026-09-02/audit-c/_extracted.json', JSON.stringify(out, null, 2));
console.log('clinics', clinics.length, 'cities', cities.length);
console.log('clinic bodies nonempty', clinics.filter((c) => c.bodyLen > 0).length);
console.log('city bodies nonempty', cities.filter((c) => c.bodyLen > 0).length);
console.log('example.com websites', clinics.filter((c) => String(c.data.website || '').includes('example.com')).length);
console.log('555 phones', clinics.filter((c) => String(c.data.phone || '').includes('555')).length);
console.log('verified true', clinics.filter((c) => c.data.verifiedListing === true).length);
console.log('featured true', clinics.filter((c) => c.data.featured === true).map((c) => c.data.name));
console.log('states raw unique', [...new Set(clinics.map((c) => c.data.state))].sort());
console.log('missing address', clinics.filter((c) => !c.data.address).map((c) => c.file));
console.log('missing phone', clinics.filter((c) => !c.data.phone).map((c) => c.file));
console.log('missing website', clinics.filter((c) => !c.data.website).map((c) => c.file));
console.log('city content lengths', cities.map((c) => ({ f: c.file, n: (c.data.content || '').length, pop: c.data.population })));
