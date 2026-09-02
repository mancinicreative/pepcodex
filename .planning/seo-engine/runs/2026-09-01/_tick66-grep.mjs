import fs from "fs";

const dest = "src/content/comparisons/aod-9604-vs-orforglipron.mdx";
const raw = fs.readFileSync(dest, "utf8");
const patterns = [
  ["census 12 sources", /12 sources/i],
  ["census 37 sources", /37 sources/i],
  ["28 human", /28 human/],
  ["0 human", /0 human/],
  ["Total Sources", /Total Sources/],
  ["Consult", /Consult/],
  ["Who Might", /Who Might/],
  ["dosing", /\bdosing\b/i],
  ["inject", /\binject/i],
  ["protocol", /\bprotocol\b/i],
  ["unescaped P<", /P<(?!\/)/],
  ["$1,000", /\$1,000/],
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
