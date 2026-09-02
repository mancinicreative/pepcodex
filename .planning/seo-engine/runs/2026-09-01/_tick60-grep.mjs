import fs from "fs";

const raw = fs.readFileSync("src/content/comparisons/5-amino-1mq-vs-ct-388.mdx", "utf8");
const body = raw.replace(/^---[\s\S]*?---/, "");

const checks = [
  ["census FAQ sources", /has [A-Za-z-]+(?: [A-Za-z-]+)? evidence \(\d+ sources\)/],
  ["Total Sources row", /\|\s*\*\*Total Sources\*\*/],
  ["Consult footer", /Consult a healthcare/],
  ["Who Might", /Who Might/],
  ["body dosing", /\b(dosing|inject|protocol)\b/i],
  ["body dose word", /\bdose\b/i],
  ["unescaped P<", /P</],
  ["$1,000", /\$1,000/],
  ["trailing-slash href", /\]\(\/[^)]+\/\)/],
  ["22.7", /22\.7/],
  ["15.7", /15\.7/],
  ["23–25.5", /23[–-]25\.5/],
  ["invented ~ percent", /~\d/],
];

for (const [name, re] of checks) {
  const hit = re.test(body);
  console.log((hit ? "HIT" : "ok "), name);
}

console.log("hrefs:");
for (const m of raw.matchAll(/\]\(([^)]+)\)/g)) console.log(" ", m[1]);
