import fs from "fs";

const locked = new Set([
  "5-amino-1mq-vs-aod-9604.mdx",
  "5-amino-1mq-vs-cagrisema.mdx",
  "5-amino-1mq-vs-cagrilintide.mdx",
  "5-amino-1mq-vs-ct-388.mdx",
  "5-amino-1mq-vs-semaglutide.mdx",
  "5-amino-1mq-vs-amycretin.mdx",
]);

const files = fs
  .readdirSync("src/content/comparisons")
  .filter((f) => /^(5-amino-1mq-vs-|aod-9604-vs-)/.test(f))
  .sort();

for (const f of files) {
  const raw = fs.readFileSync(`src/content/comparisons/${f}`, "utf8");
  const lu = (raw.match(/lastUpdated:\s*['"]?([0-9-]+)/) || [])[1] || "?";
  const census =
    /has [A-Za-z-]+(?: [A-Za-z-]+)? evidence \(\d+ sources\)/.test(raw) ||
    /\|\s*\*\*Total Sources\*\*/.test(raw) ||
    /\d+ human studies compared to/.test(raw);
  const consult = /Consult a healthcare/.test(raw);
  const flag = locked.has(f) ? "LOCKED" : census ? "LEFTOVER" : "unlocked-clean";
  console.log([f, lu, flag, consult ? "CONSULT" : "-", raw.length].join("\t"));
}

console.log("TICK60", fs.existsSync(".planning/seo-engine/runs/2026-09-01/TICK60.md"));
console.log("TICK61", fs.existsSync(".planning/seo-engine/runs/2026-09-01/TICK61.md"));
console.log("TICK62", fs.existsSync(".planning/seo-engine/runs/2026-09-01/TICK62.md"));
console.log("aod-9604-vs count", files.filter((f) => f.startsWith("aod-9604-vs-")).length);
