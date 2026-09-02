import fs from "fs";

const file = "src/content/comparisons/5-amino-1mq-vs-liraglutide.mdx";
const text = fs.readFileSync(file, "utf8");

const checks = [
  ["census 11 sources", /11 sources/i],
  ["census 18 sources", /18 sources/i],
  ["12 human", /12 human/i],
  ["11 total sources", /11 total sources/i],
  ["Consult a", /Consult a/],
  ["Who Might", /Who Might/],
  ["dosing", /\bdosing\b/i],
  ["inject", /\binject/i],
  ["protocol", /\bprotocol\b/i],
  ["dose", /\bdose\b/i],
  ["unescaped P<", /P<0/],
  ["$1,000", /\$1,000/],
  ["trailing-slash href", /href="[^"]+\/"/],
  ["invented 8.0%", /8\.0%/],
  ["invented ~8%", /~8%/],
  ["subcutaneous", /subcutaneous/i],
  ["Consult leftover", /Consult a healthcare/],
];

for (const [label, re] of checks) {
  const m = text.match(re);
  console.log((m ? "HIT " : "0   ") + label + (m ? " => " + JSON.stringify(m[0]) : ""));
}
