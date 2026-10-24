const fs = require("fs");

const content = fs.readFileSync("scripts/found_line.txt", "utf-8");
const parsedJson = JSON.parse(content);
const code = parsedJson.tool_calls[0].args.CodeContent;

// Let's split by district objects in MAHARASHTRA_DISTRICTS_DATA
const districtBlocks = code.split(/\{\s*id:\s*"/).slice(1);
console.log("Found district blocks:", districtBlocks.length);

const svgMap = {};
for (const block of districtBlocks) {
  const idMatch = block.match(/^([^"]+)"/);
  const svgMatch = block.match(/svgPath:\s*"([^"]+)"/);
  const labelXMatch = block.match(/labelX:\s*(\d+)/);
  const labelYMatch = block.match(/labelY:\s*(\d+)/);

  if (idMatch && svgMatch && labelXMatch && labelYMatch) {
    svgMap[idMatch[1]] = {
      svgPath: svgMatch[1],
      labelX: parseInt(labelXMatch[1], 10),
      labelY: parseInt(labelYMatch[1], 10)
    };
  } else {
    console.log("Failed matching block for ID:", idMatch ? idMatch[1] : "unknown");
  }
}

console.log("Parsed districts count:", Object.keys(svgMap).length);
fs.writeFileSync("scripts/original_svg_map.json", JSON.stringify(svgMap, null, 2));
