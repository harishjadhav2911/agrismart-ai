const fs = require("fs");
const readline = require("readline");

async function findSvg() {
  const transcriptPath = "C:\\Users\\HARISH\\.gemini\\antigravity-ide\\brain\\d827b91c-aaa3-4720-a8f9-40b73abb6b8e\\.system_generated\\logs\\transcript_full.jsonl";
  const fileStream = fs.createReadStream(transcriptPath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    if (line.includes("chhatrapati-sambhajinagar") && line.includes("svgPath") && line.includes("M240")) {
      console.log("Found line with SVG coordinates, length:", line.length);
      // Let's extract the raw code content
      fs.writeFileSync("scripts/found_line.txt", line);
      console.log("Saved found_line.txt");
      break;
    }
  }
}
findSvg();
