import fs from "fs";

const dest = "src/content/comparisons/5-amino-1mq-vs-vk2735.mdx";
const raw = fs.readFileSync(dest, "utf8");
const lines = raw.split(/\r?\n/);

const patterns = [
  ["Total Sources", /Total Sources/i],
  ["Human Studies census", /Human Studies/],
  ["Preclinical Studies census", /Preclinical Studies/],
  ["11 sources", /11 sources/],
  ["5 sources", /5 sources/],
  ["Consult footer", /Consult a healthcare/i],
  ["Who Might", /Who Might/i],
  ["be combined", /be combined/i],
  ["dosing", /\bdosing\b/i],
  ["dose word", /\bdose\b/i],
  ["inject", /\binject/i],
  ["protocol", /\bprotocol\b/i],
  ["unescaped P<", /P</],
  ["$1,000", /\$1,000/],
  ["trailing-slash href", /href="[^"]+\/"/],
  ["compare trailing slash", /\/compare\/[^)\s]+\/(?!\S)/],
];

console.log("file", dest, "lines", lines.length);
for (const [name, re] of patterns) {
  const hits = [];
  lines.forEach((line, i) => {
    if (re.test(line)) hits.push({ n: i + 1, line: line.trim().slice(0, 160) });
  });
  console.log(`\n=== ${name} hits=${hits.length} ===`);
  for (const h of hits) console.log(h.n + ":", h.line);
}
