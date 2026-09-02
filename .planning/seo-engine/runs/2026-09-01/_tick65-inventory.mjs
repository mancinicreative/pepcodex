import fs from "fs";

const locked = new Set([
  "5-amino-1mq-vs-liraglutide.mdx",
  "5-amino-1mq-vs-ct-388.mdx",
  "5-amino-1mq-vs-aod-9604.mdx",
  "5-amino-1mq-vs-cagrisema.mdx",
  "5-amino-1mq-vs-cagrilintide.mdx",
  "5-amino-1mq-vs-semaglutide.mdx",
  "5-amino-1mq-vs-amycretin.mdx",
  "5-amino-1mq-vs-maritide.mdx",
]);

const files = fs
  .readdirSync("src/content/comparisons")
  .filter((f) => /^(5-amino-1mq-vs-|aod-9604-vs-)/.test(f))
  .sort();

for (const f of files) {
  const raw = fs.readFileSync(`src/content/comparisons/${f}`, "utf8");
  const lu = (raw.match(/lastUpdated:\s*['"]?([0-9-T:.Z]+)/) || [])[1] || "?";
  const census =
    /has [A-Za-z-]+(?: [A-Za-z-]+)? evidence \(\d+ sources\)/.test(raw) ||
    /\|\s*\*\*Total Sources\*\*/.test(raw) ||
    /\d+ human studies compared to/.test(raw);
  const consult = /Consult a healthcare/.test(raw);
  const inventPct = /~ ?\d+%/.test(raw);
  const flag = locked.has(f) ? "LOCKED" : census ? "LEFTOVER" : "unlocked-clean";
  console.log([f, lu, flag, consult ? "CONSULT" : "-", inventPct ? "TILDE-PCT" : "-", raw.length].join("\t"));
}

const ticks = ["TICK60", "TICK61", "TICK62", "TICK63", "TICK64", "TICK65"];
for (const t of ticks) {
  console.log(t, fs.existsSync(`.planning/seo-engine/runs/2026-09-01/${t}.md`));
}
console.log(
  "related",
  [
    "5-amino-1mq-vs-tirzepatide.mdx",
    "5-amino-1mq-vs-semaglutide.mdx",
    "tirzepatide-vs-semaglutide.mdx",
    "../peptides/5-amino-1mq.mdx",
    "../peptides/tirzepatide.mdx",
  ]
    .map((p) => `${p}=${fs.existsSync("src/content/comparisons/" + p) || fs.existsSync("src/content/peptides/" + p.replace("../peptides/", ""))}`)
    .join(" ")
);
