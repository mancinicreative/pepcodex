import fs from "fs";
const file = "src/content/comparisons/5-amino-1mq-vs-pemvidutide.mdx";
const text = fs.readFileSync(file, "utf8");
const checks = [
  ["census 11 sources", /11 sources/i],
  ["census 10 sources", /10 sources/i],
  ["3 human", /3 human/i],
  ["11 total sources", /11 total sources/i],
  ["showing 15", /showing 15/i],
  ["Consult a", /Consult a/],
  ["Who Might", /Who Might/],
  ["dosing", /\bdosing\b/i],
  ["inject", /\binject/i],
  ["protocol", /\bprotocol\b/i],
  ["dose", /\bdose\b/i],
  ["unescaped P<", /P<0/],
  ["$1,000", /\$1,000/],
  ["trailing-slash href", /href="[^"]+\/"/],
  ["Phase 3 validated", /Phase 3 validated/],
  ["MOMENTUM percent", /MOMENTUM[^\n]{0,80}\d+\s*%/],
];
for (const [label, re] of checks) {
  const m = text.match(re);
  console.log((m ? "HIT " : "0   ") + label + (m ? " => " + JSON.stringify(m[0]) : ""));
}
