import fs from "fs";

const dest = "src/content/comparisons/aod-9604-vs-cagrisema.mdx";
const raw = fs.readFileSync(dest, "utf8");
const patterns = [
  ["census 12 sources", /12 sources/i],
  ["census 14 sources", /14 sources/i],
  ["6 human", /6 human/],
  ["0 human", /0 human/],
  ["Total Sources", /Total Sources/],
  ["Consult", /Consult/],
  ["Who Might", /Who Might/],
  ["dosing", /\bdosing\b/i],
  ["dose", /\bdose\b/i],
  ["inject", /\binject/i],
  ["protocol", /\bprotocol\b/i],
  ["unescaped P<", /P<(?!\/)/],
  ["$1,000", /\$1,000/],
  ["trailing-slash href", /\(\/[^)\s]+\/\)/],
  ["combination unknown", /unknown without clinical data/],
  ["invented ~ percent leftover", /~[0-9]/],
  ["Phase 3 validated", /Phase 3 validated/],
];
for (const [name, re] of patterns) {
  const m = raw.match(re);
  console.log((m ? "HIT " : "0   ") + name + (m ? " => " + JSON.stringify(m[0]) : ""));
}
const crlf = (raw.match(/\r\n/g) || []).length;
const lfOnly = (raw.match(/(?<!\r)\n/g) || []).length;
console.log("CRLF", crlf, "LF-only", lfOnly);
const hrefs = [...raw.matchAll(/\]\((\/[^)]+)\)/g)].map((m) => m[1]);
console.log("hrefs", JSON.stringify(hrefs));
