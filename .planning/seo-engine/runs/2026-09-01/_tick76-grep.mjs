import fs from "fs";

const dest = "src/content/comparisons/5-amino-1mq-vs-survodutide.mdx";
const raw = fs.readFileSync(dest, "utf8");
const patterns = [
  ["census 11 sources", /11 sources/i],
  ["34 sources", /34 sources/],
  ["30 human", /30 human/],
  ["Total Sources", /Total Sources/],
  ["Consult", /Consult/],
  ["Who Might", /Who Might/],
  ["dosing", /\bdosing\b/i],
  ["dose", /\bdose\b/i],
  ["inject", /\binject/i],
  ["protocol", /\bprotocol\b/i],
  ["unescaped P<", /P<(?!\/)/],
  ["$1,000", /\$1,000/],
  ["trailing-slash href", /href="[^"]+\/"/],
  ["combination unknown", /unknown without clinical data/],
  ["invented ~ percent leftover", /~[0-9]/],
  ["banned 18.7", /18\.7/],
  ["banned 19.5", /19\.5/],
];
for (const [name, re] of patterns) {
  const m = raw.match(re);
  console.log((m ? "HIT " : "0   ") + name + (m ? " => " + JSON.stringify(m[0]) : ""));
}
const crlf = (raw.match(/\r\n/g) || []).length;
const lfOnly = (raw.match(/(?<!\r)\n/g) || []).length;
console.log("CRLF", crlf, "LF-only", lfOnly);
