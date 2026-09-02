import fs from "fs";

const dest = "src/content/comparisons/aod-9604-vs-ct-388.mdx";
const raw = fs.readFileSync(dest, "utf8");
const patterns = [
  ["census 12 sources", /12 sources/i],
  ["6 human", /6 human/],
  ["6 each", /6 each/],
  ["Total Sources", /Total Sources/],
  ["Consult", /Consult/],
  ["Who Might", /Who Might/],
  ["dosing", /\bdosing\b/i],
  ["inject", /\binject/i],
  ["protocol", /\bprotocol\b/i],
  ["unescaped P<", /P<(?!\/)/],
  ["$1,000", /\$1,000/],
  ["truncated $2.", /\$2\./],
  ["trailing-slash href", /href="[^"]+\/"/],
  ["combination unknown", /unknown without clinical data/],
  ["invented ~ percent leftover", /~[0-9]/],
];
for (const [name, re] of patterns) {
  const m = raw.match(re);
  console.log((m ? "HIT " : "0   ") + name + (m ? " => " + JSON.stringify(m[0]) : ""));
}
const crlf = (raw.match(/\r\n/g) || []).length;
const lfOnly = (raw.match(/(?<!\r)\n/g) || []).length;
console.log("CRLF", crlf, "LF-only", lfOnly);
