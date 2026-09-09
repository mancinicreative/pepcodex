import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';

// Use the compiler paired with this Astro runtime, not an unrelated hoisted version.
const require = createRequire(import.meta.url);
const astroRequire = createRequire(require.resolve('astro/package.json'));
const { transform } = await import(pathToFileURL(astroRequire.resolve('@astrojs/compiler')).href);

const out = path.resolve('.planning/growth-program/runs/2026-09-05-growth/implementation');
await fs.mkdir(out, { recursive: true });
const source = await fs.readFile('src/components/AffiliateReadingTool.astro', 'utf8');
const compiled = await transform(source, { filename: 'src/components/AffiliateReadingTool.astro', internalURL: 'astro/compiler-runtime', resultScopedSlot: true, resolvePath: specifier => specifier });
assert.equal(compiled.diagnostics.filter(d => d.severity === 1).length, 0);
// Container tests render server markup; CSS is saved separately, not run through Vite.
const configUrl = pathToFileURL(path.resolve('src/config/affiliate-pilot.mjs')).href;
const code = compiled.code.replace(/^import .*\?astro&type=style.*;\r?\n/gm, '').replaceAll('../config/affiliate-pilot.mjs', configUrl);
const realFile = path.join(out, 'component-real.mjs');
await fs.writeFile(realFile, code);
const container = await AstroContainer.create();
const actual = (await import(pathToFileURL(realFile).href)).default;
const target = 'https://www.pepcodex.com/guide/how-to-read-peptide-research';
const realHtml = await container.renderToString(actual, { request: new Request(target) });
assert.doesNotMatch(realHtml, /<a\b|data-growth-pilot|<script\b/);
await fs.writeFile(path.join(out, 'disabled-component.html'), realHtml);

// Synthetic approval fixture is isolated to this temporary compiled module.
// example.com is deliberately not an accepted partner destination.
const fixture = { enabled: true, referralUrl: 'https://example.com/referral?campaign=generic', approvedOrigin: 'https://example.com', approvals: { pageReview: true, productTest: true, partnerTerms: true, privacyAndMeasurement: true, release: true } };
const fixtureFile = path.join(out, 'component-fixture.mjs');
const fixtureCode = code.replace('approvedPilotUrl(affiliatePilot)', `approvedPilotUrl(${JSON.stringify(fixture)})`);
await fs.writeFile(fixtureFile, fixtureCode);
const demo = (await import(pathToFileURL(fixtureFile).href)).default;
const html = await container.renderToString(demo, { request: new Request(target) });
assert.equal((html.match(/<a\b/g) ?? []).length, 1);
assert.match(html, /rel="sponsored noreferrer"/);
assert.match(html, /referrerpolicy="no-referrer"/);
assert.ok(html.indexOf('PepCodex may earn a commission') < html.search(/<a\s/));
assert.match(html, /without buying anything/);
const wrongPage = await container.renderToString(demo, { request: new Request('https://www.pepcodex.com/guide/another-guide') });
assert.doesNotMatch(wrongPage, /<a\b|data-growth-pilot/);
await fs.writeFile(path.join(out, 'enabled-fixture-component.html'), html);
await fs.writeFile(path.join(out, 'component.css'), compiled.css.join('\n'));
const result = { checkedAt: new Date().toISOString(), compilerErrors: 0, realConfig: 'NO_LINK_NO_MODULE_NO_SCRIPT', syntheticApprovedFixture: 'ONE_DISCLOSED_QUALIFIED_LINK', wrongPage: 'NO_MODULE', scope: 'Standalone Astro server rendering; no full build, browser layout, transport or production acceptance' };
await fs.writeFile(path.join(out, 'render-validation.json'), JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
