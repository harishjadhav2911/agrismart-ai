const fs = require("fs");
let code = fs.readFileSync("scripts/generate-maharashtra-geo-2026.js", "utf-8");

// Pune: 10 -> 13
code = code.replace(
  'id: "pune",\n    code: "PUN",\n    name: "Pune",\n    nameMr: "पुणे",\n    nameHi: "पुणे",\n    division: "Paschim Maharashtra",\n    divisionMr: "पश्चिम महाराष्ट्र",\n    divisionHi: "पश्चिम महाराष्ट्र",\n    totalTalukas: 14,\n    status2026: "partially_declared", // 10 out of 14 talukas\n    declaredCount2026: 10,',
  'id: "pune",\n    code: "PUN",\n    name: "Pune",\n    nameMr: "पुणे",\n    nameHi: "पुणे",\n    division: "Paschim Maharashtra",\n    divisionMr: "पश्चिम महाराष्ट्र",\n    divisionHi: "पश्चिम महाराष्ट्र",\n    totalTalukas: 14,\n    status2026: "partially_declared", // 13 out of 14 talukas\n    declaredCount2026: 13,'
);

// Add missing Pune talukas
code = code.replace(
  '{ name: "Junnar", nameMr: "जुन्नर", nameHi: "जुन्नर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" }\n    ],',
  '{ name: "Junnar", nameMr: "जुन्नर", nameHi: "जुन्नर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },\n      { name: "Maval", nameMr: "मावळ", nameHi: "मावल", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },\n      { name: "Mulshi", nameMr: "मुळशी", nameHi: "मुलशी", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },\n      { name: "Haveli", nameMr: "हवेली", nameHi: "हवेली", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" }\n    ],'
);

// Satara: 8 -> 10
code = code.replace(
  'id: "satara",\n    code: "SAT",\n    name: "Satara",\n    nameMr: "सातारा",\n    nameHi: "सातारा",\n    division: "Paschim Maharashtra",\n    divisionMr: "पश्चिम महाराष्ट्र",\n    divisionHi: "पश्चिम महाराष्ट्र",\n    totalTalukas: 11,\n    status2026: "partially_declared", // 8 out of 11 talukas\n    declaredCount2026: 8,',
  'id: "satara",\n    code: "SAT",\n    name: "Satara",\n    nameMr: "सातारा",\n    nameHi: "सातारा",\n    division: "Paschim Maharashtra",\n    divisionMr: "पश्चिम महाराष्ट्र",\n    divisionHi: "पश्चिम महाराष्ट्र",\n    totalTalukas: 11,\n    status2026: "partially_declared", // 10 out of 11 talukas\n    declaredCount2026: 10,'
);

// Add missing Satara talukas
code = code.replace(
  '{ name: "Patan", nameMr: "पाटण", nameHi: "पाटन", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" }\n    ],',
  '{ name: "Patan", nameMr: "पाटण", nameHi: "पाटन", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },\n      { name: "Jaoli", nameMr: "जावळी", nameHi: "जावली", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },\n      { name: "Satara", nameMr: "सातारा", nameHi: "सातारा", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" }\n    ],'
);

// Palghar: 3 -> 5
code = code.replace(
  'id: "palghar",\n    code: "PAL",\n    name: "Palghar",\n    nameMr: "पालघर",\n    nameHi: "पालघर",\n    division: "Konkan",\n    divisionMr: "कोकण",\n    divisionHi: "कोंकण",\n    totalTalukas: 8,\n    status2026: "partially_declared", // 3 out of 8 talukas\n    declaredCount2026: 3,',
  'id: "palghar",\n    code: "PAL",\n    name: "Palghar",\n    nameMr: "पालघर",\n    nameHi: "पालघर",\n    division: "Konkan",\n    divisionMr: "कोकण",\n    divisionHi: "कोंकण",\n    totalTalukas: 8,\n    status2026: "partially_declared", // 5 out of 8 talukas\n    declaredCount2026: 5,'
);

// Add missing Palghar talukas
code = code.replace(
  '{ name: "Vada", nameMr: "वाडा", nameHi: "वाडा", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" }\n    ],',
  '{ name: "Vada", nameMr: "वाडा", nameHi: "वाडा", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },\n      { name: "Vikramgad", nameMr: "विक्रमगड", nameHi: "विक्रमगढ़", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },\n      { name: "Jawhar", nameMr: "जव्हार", nameHi: "जव्हार", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" }\n    ],'
);

fs.writeFileSync("scripts/generate-maharashtra-geo-2026.js", code);
console.log("Successfully adjusted counts in scripts/generate-maharashtra-geo-2026.js");
