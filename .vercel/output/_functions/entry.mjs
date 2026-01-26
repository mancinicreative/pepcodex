import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_Cm4eEi20.mjs';
import { manifest } from './manifest_CcJtZhOb.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/about.astro.mjs');
const _page3 = () => import('./pages/advertising-policy.astro.mjs');
const _page4 = () => import('./pages/api/peptide-search.json.astro.mjs');
const _page5 = () => import('./pages/api/subscribe.astro.mjs');
const _page6 = () => import('./pages/blog/_slug_.astro.mjs');
const _page7 = () => import('./pages/blog.astro.mjs');
const _page8 = () => import('./pages/category/hormonal.astro.mjs');
const _page9 = () => import('./pages/category/metabolic.astro.mjs');
const _page10 = () => import('./pages/category/repair-recovery.astro.mjs');
const _page11 = () => import('./pages/compare.astro.mjs');
const _page12 = () => import('./pages/compare/_---slug_.astro.mjs');
const _page13 = () => import('./pages/editorial-policy.astro.mjs');
const _page14 = () => import('./pages/glossary.astro.mjs');
const _page15 = () => import('./pages/glossary/_---slug_.astro.mjs');
const _page16 = () => import('./pages/guide.astro.mjs');
const _page17 = () => import('./pages/guide/_---slug_.astro.mjs');
const _page18 = () => import('./pages/methodology.astro.mjs');
const _page19 = () => import('./pages/newsletter.astro.mjs');
const _page20 = () => import('./pages/peptides/_slug_.astro.mjs');
const _page21 = () => import('./pages/peptides.astro.mjs');
const _page22 = () => import('./pages/safety.astro.mjs');
const _page23 = () => import('./pages/safety/_---slug_.astro.mjs');
const _page24 = () => import('./pages/trials.astro.mjs');
const _page25 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/about.astro", _page2],
    ["src/pages/advertising-policy.astro", _page3],
    ["src/pages/api/peptide-search.json.ts", _page4],
    ["src/pages/api/subscribe.ts", _page5],
    ["src/pages/blog/[slug].astro", _page6],
    ["src/pages/blog/index.astro", _page7],
    ["src/pages/category/hormonal.astro", _page8],
    ["src/pages/category/metabolic.astro", _page9],
    ["src/pages/category/repair-recovery.astro", _page10],
    ["src/pages/compare/index.astro", _page11],
    ["src/pages/compare/[...slug].astro", _page12],
    ["src/pages/editorial-policy.astro", _page13],
    ["src/pages/glossary/index.astro", _page14],
    ["src/pages/glossary/[...slug].astro", _page15],
    ["src/pages/guide/index.astro", _page16],
    ["src/pages/guide/[...slug].astro", _page17],
    ["src/pages/methodology.astro", _page18],
    ["src/pages/newsletter.astro", _page19],
    ["src/pages/peptides/[slug].astro", _page20],
    ["src/pages/peptides/index.astro", _page21],
    ["src/pages/safety/index.astro", _page22],
    ["src/pages/safety/[...slug].astro", _page23],
    ["src/pages/trials/index.astro", _page24],
    ["src/pages/index.astro", _page25]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "178df362-c50b-412c-96dc-0759fbd6b16b",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
