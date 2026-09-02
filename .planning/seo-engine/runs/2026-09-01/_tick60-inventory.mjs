import fs from "fs";

const files = fs
  .readdirSync("src/content/comparisons")
  .filter((f) => /^(5-amino-1mq-vs-|aod-9604-vs-)/.test(f));

for (const f of files) {
  const raw = fs.readFileSync(`src/content/comparisons/${f}`, "utf8");
  const lu = (raw.match(/lastUpdated:\s*['"]?([0-9-]+)/) || [])[1] || "?";
  const census =
    /has [A-Za-z-]+(?: [A-Za-z-]+)? evidence \(\d+ sources\)/.test(raw) ||
    /Which has more clinical evidence/.test(raw) ||
    /\|\s*\*\*Total Sources\*\*/.test(raw);
  const consult = /Consult/.test(raw);
  console.log([f, lu, census ? "CENSUS" : "clean", consult ? "CONSULT" : "-", raw.length].join("\t"));
}

console.log("TICK59", fs.existsSync(".planning/seo-engine/runs/2026-09-01/TICK59.md"));
console.log("TICK58", fs.existsSync(".planning/seo-engine/runs/2026-09-01/TICK58.md"));
