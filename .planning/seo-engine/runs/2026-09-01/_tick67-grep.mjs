import fs from "fs";

const p = "src/content/comparisons/aod-9604-vs-cagrilintide.mdx";
const raw = fs.readFileSync(p, "utf8");
const checks = [
  ["Total Sources", /Total Sources/],
  ["12 total sources", /12 total sources/],
  ["27 human", /27 human/],
  ["34 sources", /34 sources/],
  ["Phase 3 validated", /Phase 3 validated/],
  ["Consult", /\bConsult\b/],
  ["Who Might", /Who Might/],
  ["dosing", /\bdosing\b/i],
  ["inject", /\binject/i],
  ["protocol", /\bprotocol\b/i],
  ["unescaped P<", /P</],
  ["$1,000", /\$1,000/],
  ["trailing-slash href", /href="[^"]+\/"/],
  ["can be combined FAQ", /Can AOD-9604 and Cagrilintide be combined/],
];
for (const [label, re] of checks) {
  const n = (raw.match(re) || []).length;
  console.log(`${n}\t${label}`);
}
const crlf = (raw.match(/\r\n/g) || []).length;
const lfOnly = (raw.match(/(?<!\r)\n/g) || []).length;
console.log(`CRLF=${crlf} LF-only=${lfOnly}`);
