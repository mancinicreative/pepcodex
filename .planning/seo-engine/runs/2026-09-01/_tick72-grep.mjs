import fs from "fs";

const raw = fs.readFileSync("src/content/comparisons/5-amino-1mq-vs-orforglipron.mdx", "utf8");
const checks = [
  ["census Low evidence (11", /Low evidence \(11 sources\)/],
  ["census 28 human studies", /28 human studies compared to/],
  ["Total Sources table", /\|\s*\*\*Total Sources\*\*/],
  ["Human Studies table", /\|\s*\*\*Human Studies\*\*/],
  ["Preclinical Studies table", /\|\s*\*\*Preclinical Studies\*\*/],
  ["Phase 3 validated", /Phase 3 validated/],
  ["considered compatible", /considered compatible/],
  ["Consult footer", /Consult a healthcare/],
  ["Who Might", /Who Might/],
  ["dosing", /\bdosing\b/i],
  ["dose", /\bdose\b/i],
  ["inject", /\binject/i],
  ["protocol", /\bprotocol\b/i],
  ["unescaped P<", /P<(?!\/)/],
  ["$1,000", /\$1,000/],
  ["trailing-slash href", /\]\(\/[^)]+\/\)/],
  ["invented Phase 3 5-amino claim", /5-Amino-1MQ.{0,40}Phase 3/],
  ["census 11 total sources", /11 total sources/],
  ["37 total sources", /37 total sources/],
];

for (const [name, re] of checks) {
  const m = raw.match(re);
  console.log((m ? "HIT" : "0") + "\t" + name + (m ? "\t" + JSON.stringify(m[0]) : ""));
}

const crlf = (raw.match(/\r\n/g) || []).length;
const lfOnly = (raw.match(/(?<!\r)\n/g) || []).length;
console.log("CRLF", crlf, "LF-only", lfOnly);
