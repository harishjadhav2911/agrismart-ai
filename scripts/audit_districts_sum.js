const fs = require("fs");
const content = fs.readFileSync("scripts/generate-maharashtra-geo-2026.js", "utf-8");

const matches = Array.from(content.matchAll(/id:\s*"([^"]+)"[\s\S]*?name:\s*"([^"]+)"[\s\S]*?totalTalukas:\s*(\d+)[\s\S]*?declaredCount2026:\s*(\d+)/g));
console.log("Count of districts in config:", matches.length);

let sum2026 = 0;
for (const m of matches) {
  const declared = parseInt(m[4], 10);
  sum2026 += declared;
  console.log(`${m[1].padEnd(28)} Total: ${m[3].padStart(2)} | Declared 2026: ${m[4].padStart(2)}`);
}
console.log("--------------------------------------------------");
console.log("Total 2026 Declared Sum:", sum2026);
