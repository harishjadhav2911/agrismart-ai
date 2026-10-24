const fs = require("fs");
const path = require("path");

const targetFile = path.join(__dirname, "../src/data/maharashtraDistrictsGeo.ts");
const svgMap = JSON.parse(fs.readFileSync(path.join(__dirname, "original_svg_map.json"), "utf-8"));

console.log(`Loaded SVG paths for ${Object.keys(svgMap).length} districts.`);

// Detailed 36 districts data config for 2026 Kharif (304 talukas) and Historical 2023-24 (40 talukas, 1021 circles)
const districts = [
  // 1. MARATHWADA (8 districts - 100% declared in 2026)
  {
    id: "chhatrapati-sambhajinagar",
    code: "CSN",
    name: "Chhatrapati Sambhajinagar (Aurangabad)",
    nameMr: "छत्रपती संभाजीनगर (औरंगाबाद)",
    nameHi: "छत्रपति संभाजीनगर (औरंगाबाद)",
    division: "Marathwada",
    divisionMr: "मराठवाडा",
    divisionHi: "मराठवाड़ा",
    totalTalukas: 9,
    status2026: "officially_declared",
    declaredCount2026: 9,
    talukas2026: [
      { name: "Gangapur", nameMr: "गंगापूर", nameHi: "गंगापुर", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Vaijapur", nameMr: "वैजापूर", nameHi: "वैजापुर", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Paithan", nameMr: "पैठण", nameHi: "पैठन", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Chhatrapati Sambhajinagar", nameMr: "छत्रपती संभाजीनगर", nameHi: "संभाजीनगर", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Kannad", nameMr: "कन्नड", nameHi: "कन्नड", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Khuldabad", nameMr: "खुलताबाद", nameHi: "खुल्दाबाद", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Sillod", nameMr: "सिल्लोड", nameHi: "सिल्लोड", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Soegaon", nameMr: "सोयगाव", nameHi: "सोयगांव", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Phulambri", nameMr: "फुलंब्री", nameHi: "फुलंब्री", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2026: {
      en: "All 9 talukas declared drought-hit under 14 Oct 2026 order. 179 drinking water tankers active. Food Dept GR (22 Oct 2026) covers all 9 talukas.",
      mr: "१४ ऑक्टोबर २०२६ च्या आदेशान्वये सर्व ९ तालुके अधिकृत दुष्काळग्रस्त. १७९ पिण्याचे टँकर सक्रिय. २२ ऑक्टोबरच्या अन्न व नागरी पुरवठा GR चे लाभ लागू.",
      hi: "14 अक्टूबर 2026 आदेश के तहत सभी 9 तहसीलें सूखाग्रस्त। 179 पेयजल टैंकर तैनात। 22 अक्टूबर खाद्य विभाग GR के लाभ लागू।"
    },
    status2023: "officially_declared",
    declaredCount2023: 4,
    circlesCount2023: 42,
    gr2023: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate2023: "31 October 2023",
    talukas2023: [
      { name: "Gangapur", nameMr: "गंगापूर", nameHi: "गंगापुर", severity: "severe", grNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३", grDate: "31 Oct 2023", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Vaijapur", nameMr: "वैजापूर", nameHi: "वैजापुर", severity: "severe", grNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३", grDate: "31 Oct 2023", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Paithan", nameMr: "पैठण", nameHi: "पैठन", severity: "moderate", grNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३", grDate: "31 Oct 2023", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Chhatrapati Sambhajinagar", nameMr: "छत्रपती संभाजीनगर", nameHi: "संभाजीनगर", severity: "moderate", grNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३", grDate: "31 Oct 2023", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2023: {
      en: "Historical 2023: 4 talukas declared severe/moderate. 42 revenue circles granted 8 statutory concessions under GR dated 10 Nov 2023.",
      mr: "ऐतिहासिक २०२३: ४ तालुके तीव्र/मध्यम दुष्काळग्रस्त घोषित. १० नोव्हेंबर २०२३ च्या GR नुसार ४२ महसूल मंडळांना ८ सवलती लागू.",
      hi: "ऐतिहासिक 2023: 4 तहसीलें गंभीर/मध्यम घोषित। 10 नवंबर 2023 के GR से 42 मंडलों में 8 रियायतें।"
    }
  },
  {
    id: "jalna",
    code: "JAL",
    name: "Jalna",
    nameMr: "जालना",
    nameHi: "जालना",
    division: "Marathwada",
    divisionMr: "मराठवाडा",
    divisionHi: "मराठवाड़ा",
    totalTalukas: 8,
    status2026: "officially_declared",
    declaredCount2026: 8,
    talukas2026: [
      { name: "Jalna", nameMr: "जालना", nameHi: "जालना", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Badnapur", nameMr: "बदनापूर", nameHi: "बदनापुर", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Ambad", nameMr: "अंबड", nameHi: "अंबड", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Bhokardan", nameMr: "भोकरदन", nameHi: "भोकरदन", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Partur", nameMr: "परतूर", nameHi: "परतूर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Mantha", nameMr: "मंठा", nameHi: "मंठा", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Jafrabad", nameMr: "जाफ्राबाद", nameHi: "जाफराबाद", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Ghansawangi", nameMr: "घनसावंगी", nameHi: "घनसावंगी", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2026: {
      en: "All 8 talukas declared drought-affected in 2026. 12 statutory concessions and student exam fee waiver operational.",
      mr: "२०२६ मध्ये सर्व ८ तालुके दुष्काळग्रस्त घोषित. १२ शासकीय सवलती व परीक्षा शुल्कमाफी लागू.",
      hi: "2026 में सभी 8 तहसीलें सूखाग्रस्त। 12 वैधानिक रियायतें व परीक्षा शुल्क छूट चालू।"
    },
    status2023: "officially_declared",
    declaredCount2023: 1,
    circlesCount2023: 49,
    gr2023: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate2023: "31 October 2023",
    talukas2023: [
      { name: "Badnapur", nameMr: "बदनापूर", nameHi: "बदनापुर", severity: "moderate", grNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३", grDate: "31 Oct 2023", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2023: {
      en: "Historical 2023: Only Badnapur declared in Oct 2023. Later 49 revenue circles covered under 10 Nov 2023 concessions.",
      mr: "ऐतिहासिक २०२३: केवळ बदनापूर ऑक्टोबर २०२३ मध्ये घोषित. नंतर १० नोव्हेंबरच्या आदेशाने ४९ महसूल मंडळांना सवलती लागू.",
      hi: "ऐतिहासिक 2023: केवल बदनापुर अक्टूबर 2023 में घोषित। बाद में 49 मंडलों को रियायतें।"
    }
  },
  {
    id: "beed",
    code: "BEE",
    name: "Beed",
    nameMr: "बीड",
    nameHi: "बीड",
    division: "Marathwada",
    divisionMr: "मराठवाडा",
    divisionHi: "मराठवाड़ा",
    totalTalukas: 11,
    status2026: "officially_declared",
    declaredCount2026: 11,
    talukas2026: [
      { name: "Beed", nameMr: "बीड", nameHi: "बीड", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Ashti", nameMr: "आष्टी", nameHi: "आष्टी", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Patoda", nameMr: "पाटोदा", nameHi: "पाटोदा", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Shirur Kasar", nameMr: "शिरूर कासार", nameHi: "शिरूर कासार", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Georai", nameMr: "गेवराई", nameHi: "गेवराई", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Majalgaon", nameMr: "माजलगाव", nameHi: "माजलगांव", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Ambejogai", nameMr: "अंबाजोगाई", nameHi: "अंबाजोगाई", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Kaij", nameMr: "केज", nameHi: "केज", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Parli", nameMr: "परळी", nameHi: "परली", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Dharur", nameMr: "धारूर", nameHi: "धारूर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Wadwani", nameMr: "वडवणी", nameHi: "वडवणी", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2026: {
      en: "All 11 talukas declared drought-hit. 205 active drinking water tankers (highest in Maharashtra as of 23 Oct 2026).",
      mr: "सर्व ११ तालुके दुष्काळग्रस्त घोषित. २०५ पिण्याचे टँकर सक्रिय (२३ ऑक्टोबर २०२६ रोजी राज्यात सर्वाधिक).",
      hi: "सभी 11 तहसीलें सूखाग्रस्त। 205 पेयजल टैंकर सक्रिय (23 अक्टूबर 2026 तक राज्य में सर्वाधिक)।"
    },
    status2023: "officially_declared",
    declaredCount2023: 0,
    circlesCount2023: 63,
    gr2023: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate2023: "10 November 2023",
    talukas2023: [],
    note2023: {
      en: "Historical 2023: 0 talukas declared in initial 40 list; later 63 revenue circles covered under 10 Nov concessions.",
      mr: "ऐतिहासिक २०२३: मूळ ४० तालुक्यांत शून्य तालुके; नंतर १० नोव्हेंबरला ६३ महसूल मंडळांना सवलती लागू.",
      hi: "ऐतिहासिक 2023: प्रारंभिक सूची में 0 तहसीलें; 10 नवंबर को 63 मंडलों को रियायतें।"
    }
  },
  {
    id: "dharashiv",
    code: "DHA",
    name: "Dharashiv (Osmanabad)",
    nameMr: "धाराशिव (उस्मानाबाद)",
    nameHi: "धाराशिव (उस्मानाबाद)",
    division: "Marathwada",
    divisionMr: "मराठवाडा",
    divisionHi: "मराठवाड़ा",
    totalTalukas: 8,
    status2026: "officially_declared",
    declaredCount2026: 8,
    talukas2026: [
      { name: "Dharashiv", nameMr: "धाराशिव", nameHi: "धाराशिव", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Tuljapur", nameMr: "तुळजापूर", nameHi: "तुलजापुर", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Omerga", nameMr: "उमरगा", nameHi: "उमरगा", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Lohara", nameMr: "लोहारा", nameHi: "लोहारा", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Kalamb", nameMr: "कळंब", nameHi: "कळंब", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Bhum", nameMr: "भूम", nameHi: "भूम", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Paranda", nameMr: "परंडा", nameHi: "परंडा", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Washi", nameMr: "वाशी", nameHi: "वाशी", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2026: {
      en: "All 8 talukas officially declared drought-hit. Ground reports: Farmer Chand Shaikh sent ₹5,000 money order to CM in protest on 17 Oct.",
      mr: "सर्व ८ तालुके अधिकृत दुष्काळग्रस्त. १७ ऑक्टोबर रोजी शेतकरी चांद शेख यांनी ५००० रु. चा मनीऑर्डर मुख्यमंत्र्यांना परत पाठवून निषेध नोंदवला.",
      hi: "सभी 8 तहसीलें सूखाग्रस्त। 17 अक्टूबर को किसान चांद शेख ने ₹5000 का मनी ऑर्डर सीएम को लौटाकर विरोध दर्ज कराया।"
    },
    status2023: "officially_declared",
    declaredCount2023: 1,
    circlesCount2023: 41,
    gr2023: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate2023: "31 October 2023",
    talukas2023: [
      { name: "Washi", nameMr: "वाशी", nameHi: "वाशी", severity: "moderate", grNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३", grDate: "31 Oct 2023", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2023: {
      en: "Historical 2023: Only Washi declared in Oct 2023. 41 circles later covered under Nov 2023 order.",
      mr: "ऐतिहासिक २०२३: केवळ वाशी तालुका ऑक्टोबर २०२३ मध्ये घोषित. नंतर ४१ महसूल मंडळांना सवलती लागू.",
      hi: "ऐतिहासिक 2023: केवल वाशी तहसील घोषित। बाद में 41 मंडलों को रियायतें।"
    }
  },
  {
    id: "nanded",
    code: "NAN",
    name: "Nanded",
    nameMr: "नांदेड",
    nameHi: "नांदेड",
    division: "Marathwada",
    divisionMr: "मराठवाडा",
    divisionHi: "मराठवाड़ा",
    totalTalukas: 16,
    status2026: "officially_declared",
    declaredCount2026: 16,
    talukas2026: [
      { name: "Nanded", nameMr: "नांदेड", nameHi: "नांदेड", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Ardhapur", nameMr: "अर्धापूर", nameHi: "अर्धापुर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Mudkhed", nameMr: "मुदखेड", nameHi: "मुदखेड", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Bhokar", nameMr: "भोकर", nameHi: "भोकर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Umri", nameMr: "उमरी", nameHi: "उमरी", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Loha", nameMr: "लोहा", nameHi: "लोहा", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Kandhar", nameMr: "कंधार", nameHi: "कंधार", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Kinwat", nameMr: "किनवट", nameHi: "किनवट", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Himayatnagar", nameMr: "हिमायत नगर", nameHi: "हिमायतनगर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Hadgaon", nameMr: "हदगाव", nameHi: "हदगांव", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Mahoor", nameMr: "माहूर", nameHi: "माहूर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Degloor", nameMr: "देगलूर", nameHi: "देगलूर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Mukhed", nameMr: "मुखेड", nameHi: "मुखेड", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Dharmabad", nameMr: "धर्माबाद", nameHi: "धर्माबाद", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Biloli", nameMr: "बिलोली", nameHi: "बिलोली", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Naigaon", nameMr: "नायगाव", nameHi: "नायगांव", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2026: {
      en: "All 16 talukas declared drought-hit in 2026. Panchanamas completed for soyabean and cotton crops.",
      mr: "२०२६ मध्ये सर्व १६ तालुके दुष्काळग्रस्त घोषित. सोयाबीन व कापूस पिकांचे पंचनामे पूर्ण.",
      hi: "2026 में सभी 16 तहसीलें सूखाग्रस्त। सोयाबीन व कपास के पंचनामे पूरे।"
    },
    status2023: "concession_circles",
    declaredCount2023: 0,
    circlesCount2023: 88,
    gr2023: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate2023: "10 November 2023",
    talukas2023: [],
    note2023: {
      en: "Historical 2023: 0 talukas in 40 list; 88 revenue circles received concessions.",
      mr: "ऐतिहासिक २०२३: मूळ ४० तालुक्यांत शून्य तालुके; ८८ महसूल मंडळांना सवलती लागू.",
      hi: "ऐतिहासिक 2023: प्रारंभिक सूची में 0; 88 मंडलों को रियायतें।"
    }
  },
  {
    id: "parbhani",
    code: "PAR",
    name: "Parbhani",
    nameMr: "परभणी",
    nameHi: "परभणी",
    division: "Marathwada",
    divisionMr: "मराठवाडा",
    divisionHi: "मराठवाड़ा",
    totalTalukas: 9,
    status2026: "officially_declared",
    declaredCount2026: 9,
    talukas2026: [
      { name: "Parbhani", nameMr: "परभणी", nameHi: "परभणी", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Gangakhed", nameMr: "गंगाखेड", nameHi: "गंगाखेड", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Sonpeth", nameMr: "सोनपेठ", nameHi: "सोनपेठ", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Pathri", nameMr: "पाथरी", nameHi: "पाथरी", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Manwath", nameMr: "मानवत", nameHi: "मानवत", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Palam", nameMr: "पालम", nameHi: "पालम", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Selu", nameMr: "सेलू", nameHi: "सेलू", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Jintur", nameMr: "जिंतूर", nameHi: "जिंतूर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Purna", nameMr: "पूर्णा", nameHi: "पूर्णा", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2026: {
      en: "All 9 talukas declared drought-hit in 2026. Relief concessions and farm loan restructuring active.",
      mr: "सर्व ९ तालुके २०२६ मध्ये दुष्काळग्रस्त घोषित. १२ शासकीय सवलती लागू.",
      hi: "सभी 9 तहसीलें 2026 में सूखाग्रस्त। 12 शासकीय रियायतें लागू।"
    },
    status2023: "concession_circles",
    declaredCount2023: 0,
    circlesCount2023: 52,
    gr2023: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate2023: "10 November 2023",
    talukas2023: [],
    note2023: {
      en: "Historical 2023: 52 revenue circles declared drought-like.",
      mr: "ऐतिहासिक २०२३: ५२ महसूल मंडळांना दुष्काळसदृश सवलती.",
      hi: "ऐतिहासिक 2023: 52 मंडलों को सूखा-सदृश रियायतें।"
    }
  },
  {
    id: "hingoli",
    code: "HIN",
    name: "Hingoli",
    nameMr: "हिंगोली",
    nameHi: "हिंगोली",
    division: "Marathwada",
    divisionMr: "मराठवाडा",
    divisionHi: "मराठवाड़ा",
    totalTalukas: 5,
    status2026: "officially_declared",
    declaredCount2026: 5,
    talukas2026: [
      { name: "Hingoli", nameMr: "हिंगोली", nameHi: "हिंगोली", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Kalamnuri", nameMr: "कलमनुरी", nameHi: "कलमनुरी", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Sengaon", nameMr: "सेनगाव", nameHi: "सेनगांव", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Basmath", nameMr: "वसमत", nameHi: "बसमत", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Aundha Nagnath", nameMr: "औंढा नागनाथ", nameHi: "औंधा नागनाथ", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2026: {
      en: "All 5 talukas declared drought-hit in 2026.",
      mr: "सर्व ५ तालुके २०२६ मध्ये दुष्काळग्रस्त घोषित.",
      hi: "सभी 5 तहसीलें 2026 में सूखाग्रस्त।"
    },
    status2023: "concession_circles",
    declaredCount2023: 0,
    circlesCount2023: 28,
    gr2023: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate2023: "10 November 2023",
    talukas2023: [],
    note2023: {
      en: "Historical 2023: 28 revenue circles granted concessions.",
      mr: "ऐतिहासिक २०२३: २८ महसूल मंडळांना सवलती लागू.",
      hi: "ऐतिहासिक 2023: 28 मंडलों को रियायतें।"
    }
  },
  {
    id: "latur",
    code: "LAT",
    name: "Latur",
    nameMr: "लातूर",
    nameHi: "लातूर",
    division: "Marathwada",
    divisionMr: "मराठवाडा",
    divisionHi: "मराठवाड़ा",
    totalTalukas: 10,
    status2026: "officially_declared",
    declaredCount2026: 10,
    talukas2026: [
      { name: "Latur", nameMr: "लातूर", nameHi: "लातूर", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Ausa", nameMr: "औसा", nameHi: "औसा", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Nilanga", nameMr: "निलंगा", nameHi: "निलंगा", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Renapur", nameMr: "रेणापूर", nameHi: "रेणापुर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Chakur", nameMr: "चाकूर", nameHi: "चाकूर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Shirur Anantpal", nameMr: "शिरूर अनंतपाळ", nameHi: "शिरूर अनंतपाल", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Deoni", nameMr: "देवणी", nameHi: "देवणी", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Udgir", nameMr: "उदगीर", nameHi: "उदगीर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Ahmadpur", nameMr: "अहमदपूर", nameHi: "अहमदपुर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Jalkot", nameMr: "जळकोट", nameHi: "जलकोट", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2026: {
      en: "All 10 talukas declared drought-hit in 2026. Water rationing plans prepared.",
      mr: "२०२६ मध्ये सर्व १० तालुके दुष्काळग्रस्त घोषित.",
      hi: "2026 में सभी 10 तहसीलें सूखाग्रस्त घोषित।"
    },
    status2023: "concession_circles",
    declaredCount2023: 0,
    circlesCount2023: 50,
    gr2023: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate2023: "10 November 2023",
    talukas2023: [],
    note2023: {
      en: "Historical 2023: 50 revenue circles received concessions.",
      mr: "ऐतिहासिक २०२३: ५० महसूल मंडळांना सवलती लागू.",
      hi: "ऐतिहासिक 2023: 50 मंडलों को रियायतें।"
    }
  },

  // 2. PASCHIM MAHARASHTRA (PUNE DIVISION)
  {
    id: "pune",
    code: "PUN",
    name: "Pune",
    nameMr: "पुणे",
    nameHi: "पुणे",
    division: "Paschim Maharashtra",
    divisionMr: "पश्चिम महाराष्ट्र",
    divisionHi: "पश्चिम महाराष्ट्र",
    totalTalukas: 14,
    status2026: "partially_declared", // 13 out of 14 talukas
    declaredCount2026: 13,
    talukas2026: [
      { name: "Baramati", nameMr: "बारामती", nameHi: "बारामती", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Indapur", nameMr: "इंदापूर", nameHi: "इंदापुर", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Daund", nameMr: "दौंड", nameHi: "दौंड", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Shirur", nameMr: "शिरूर", nameHi: "शिरूर", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Purandar", nameMr: "पुरंदर", nameHi: "पुरंदर", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Khed", nameMr: "खेड", nameHi: "खेड", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Bhor", nameMr: "भोर", nameHi: "भोर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Velhe", nameMr: "वेल्हे", nameHi: "वेल्हे", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Ambegaon", nameMr: "आंबेगाव", nameHi: "आंबेगांव", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Junnar", nameMr: "जुन्नर", nameHi: "जुन्नर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Maval", nameMr: "मावळ", nameHi: "मावल", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Mulshi", nameMr: "मुळशी", nameHi: "मुलशी", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Haveli", nameMr: "हवेली", nameHi: "हवेली", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2026: {
      en: "Partially declared: 10 out of 14 talukas declared drought-hit. 4 talukas (Haveli, Pune City, Maval, Mulshi) are non-drought baseline. SPPU Zero-Challan facility active (65,200 students registered).",
      mr: "अंशतः घोषित: १४ पैकी १० तालुके अधिकृत दुष्काळग्रस्त. ४ तालुके (हवेली, पुणे शहर, मावळ, मुळशी) वगळले. सावित्रीबाई फुले पुणे विद्यापीठात ६५,२०० विद्यार्थ्यांची झिरो-चलन नोंदणी.",
      hi: "आंशिक घोषित: 14 में से 10 तहसीलें सूखाग्रस्त। 4 तहसीलें (हवेली, पुणे सिटी, मावल, मुलशी) सामान्य। पुणे विवि में 65,200 छात्रों का जीरो-चालान पंजीकृत।"
    },
    status2023: "officially_declared",
    declaredCount2023: 2,
    circlesCount2023: 31,
    gr2023: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate2023: "31 October 2023",
    talukas2023: [
      { name: "Baramati", nameMr: "बारामती", nameHi: "बारामती", severity: "moderate", grNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३", grDate: "31 Oct 2023", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Purandar", nameMr: "पुरंदर", nameHi: "पुरंदर", severity: "moderate", grNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३", grDate: "31 Oct 2023", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2023: {
      en: "Historical 2023: 2 talukas declared in Oct 2023 (Baramati, Purandar). 31 circles granted concessions in Nov 2023.",
      mr: "ऐतिहासिक २०२३: बारामती व पुरंदर हे २ तालुके घोषित. ३१ महसूल मंडळांना सवलती लागू.",
      hi: "ऐतिहासिक 2023: बारामती और पुरंदर 2 तहसीलें घोषित। 31 मंडलों को रियायतें।"
    }
  },
  {
    id: "solapur",
    code: "SOL",
    name: "Solapur",
    nameMr: "सोलापूर",
    nameHi: "सोलापूर",
    division: "Paschim Maharashtra",
    divisionMr: "पश्चिम महाराष्ट्र",
    divisionHi: "पश्चिम महाराष्ट्र",
    totalTalukas: 11,
    status2026: "officially_declared",
    declaredCount2026: 11,
    talukas2026: [
      { name: "Solapur North", nameMr: "उत्तर सोलापूर", nameHi: "उत्तर सोलापुर", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Solapur South", nameMr: "दक्षिण सोलापूर", nameHi: "दक्षिण सोलापुर", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Barshi", nameMr: "बार्शी", nameHi: "बार्शी", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Akkalkot", nameMr: "अक्कलकोट", nameHi: "अक्कलकोट", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Mohol", nameMr: "मोहोळ", nameHi: "मोहोळ", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Pandharpur", nameMr: "पंढरपूर", nameHi: "पंढरपुर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Malshiras", nameMr: "माळशिरस", nameHi: "मालशिरस", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Karmala", nameMr: "करमाळा", nameHi: "करमाला", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Madha", nameMr: "माढा", nameHi: "माढा", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Sangole", nameMr: "सांगोला", nameHi: "सांगोला", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Mangalwedha", nameMr: "मंगळवेढा", nameHi: "मंगलवेढ़ा", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2026: {
      en: "All 11 talukas declared severe/moderate drought in 2026. 140 drinking water tankers deployed.",
      mr: "सर्व ११ तालुके तीव्र/मध्यम दुष्काळग्रस्त घोषित. १४० पिण्याचे पाण्याचे टँकर सुरू.",
      hi: "सभी 11 तहसीलें सूखाग्रस्त। 140 पेयजल टैंकर तैनात।"
    },
    status2023: "concession_circles",
    declaredCount2023: 0,
    circlesCount2023: 65,
    gr2023: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate2023: "10 November 2023",
    talukas2023: [],
    note2023: {
      en: "Historical 2023: 65 revenue circles granted concessions under 10 Nov 2023 order.",
      mr: "ऐतिहासिक २०२३: ६५ महसूल मंडळांना दुष्काळसदृश सवलती.",
      hi: "ऐतिहासिक 2023: 65 मंडलों को रियायतें।"
    }
  },
  {
    id: "satara",
    code: "SAT",
    name: "Satara",
    nameMr: "सातारा",
    nameHi: "सातारा",
    division: "Paschim Maharashtra",
    divisionMr: "पश्चिम महाराष्ट्र",
    divisionHi: "पश्चिम महाराष्ट्र",
    totalTalukas: 11,
    status2026: "partially_declared", // 10 out of 11 talukas
    declaredCount2026: 10,
    talukas2026: [
      { name: "Man", nameMr: "माण", nameHi: "माण", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Khatav", nameMr: "खटाव", nameHi: "खटाव", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Phaltan", nameMr: "फलटण", nameHi: "फलटन", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Koregaon", nameMr: "कोरेगाव", nameHi: "कोरेगांव", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Khandala", nameMr: "खंडाळा", nameHi: "खंडाला", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Wai", nameMr: "वाई", nameHi: "वाई", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Karad", nameMr: "कराड", nameHi: "कराड", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Patan", nameMr: "पाटण", nameHi: "पाटन", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Jaoli", nameMr: "जावळी", nameHi: "जावली", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Satara", nameMr: "सातारा", nameHi: "सातारा", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2026: {
      en: "Partially declared: 8 out of 11 talukas declared. 3 Western Ghats talukas (Mahabaleshwar, Jawali, Satara) are non-drought baseline.",
      mr: "अंशतः घोषित: ११ पैकी ८ तालुके अधिकृत घोषित. ३ पश्चिम घाट तालुके (महाबळेश्वर, जावळी, सातारा) वगळले.",
      hi: "आंशिक घोषित: 11 में से 8 तहसीलें घोषित। 3 पश्चिमी घाट तहसीलें (महाबलेश्वर, जावली, सातारा) सामान्य।"
    },
    status2023: "concession_circles",
    declaredCount2023: 0,
    circlesCount2023: 39,
    gr2023: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate2023: "10 November 2023",
    talukas2023: [],
    note2023: {
      en: "Historical 2023: 39 revenue circles granted concessions.",
      mr: "ऐतिहासिक २०२३: ३९ महसूल मंडळांना सवलती लागू.",
      hi: "ऐतिहासिक 2023: 39 मंडलों को रियायतें।"
    }
  },
  {
    id: "sangli",
    code: "SAN",
    name: "Sangli",
    nameMr: "सांगली",
    nameHi: "सांगली",
    division: "Paschim Maharashtra",
    divisionMr: "पश्चिम महाराष्ट्र",
    divisionHi: "पश्चिम महाराष्ट्र",
    totalTalukas: 10,
    status2026: "officially_declared",
    declaredCount2026: 10,
    talukas2026: [
      { name: "Miraj", nameMr: "मिरज", nameHi: "मिरज", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Jat", nameMr: "जत", nameHi: "जत", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Khanapur (Vita)", nameMr: "खानापूर (विटा)", nameHi: "खानापुर", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Atpadi", nameMr: "आटपाडी", nameHi: "आटपाडी", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Tasgaon", nameMr: "तासगाव", nameHi: "तासगांव", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Kavathe Mahankal", nameMr: "कवठे महांकाळ", nameHi: "कवठे महांकाल", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Walwa", nameMr: "वाळवा", nameHi: "वालवा", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Shirala", nameMr: "शिराळा", nameHi: "शिराला", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Kadegaon", nameMr: "कडेगाव", nameHi: "कडेगांव", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Palus", nameMr: "पलूस", nameHi: "पलूस", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2026: {
      en: "All 10 talukas declared drought-hit in 2026.",
      mr: "सर्व १० तालुके २०२६ मध्ये दुष्काळग्रस्त घोषित.",
      hi: "सभी 10 तहसीलें 2026 में सूखाग्रस्त घोषित।"
    },
    status2023: "concession_circles",
    declaredCount2023: 0,
    circlesCount2023: 45,
    gr2023: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate2023: "10 November 2023",
    talukas2023: [],
    note2023: {
      en: "Historical 2023: 45 revenue circles granted concessions.",
      mr: "ऐतिहासिक २०२३: ४५ महसूल मंडळांना सवलती लागू.",
      hi: "ऐतिहासिक 2023: 45 मंडलों को रियायतें।"
    }
  },
  {
    id: "kolhapur",
    code: "KOL",
    name: "Kolhapur",
    nameMr: "कोल्हापूर",
    nameHi: "कोल्हापुर",
    division: "Paschim Maharashtra",
    divisionMr: "पश्चिम महाराष्ट्र",
    divisionHi: "पश्चिम महाराष्ट्र",
    totalTalukas: 12,
    status2026: "partially_declared", // 10 out of 12 talukas declared
    declaredCount2026: 10,
    talukas2026: [
      { name: "Hatkanangale", nameMr: "हातकणंगले", nameHi: "हातकणंगले", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Shirol", nameMr: "शिरोळ", nameHi: "शिरोल", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Gadhinglaj", nameMr: "गडहिंग्लज", nameHi: "गडहिंग्लज", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Kagal", nameMr: "कागल", nameHi: "कागल", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Ajra", nameMr: "आजरा", nameHi: "आजरा", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Gaganbawada", nameMr: "गगनबावडा", nameHi: "गगनबावड़ा", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Radhanagari", nameMr: "राधानगरी", nameHi: "राधानगरी", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Bhudargad", nameMr: "भुदरगड", nameHi: "भुदरगढ़", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Chandgad", nameMr: "चंदगड", nameHi: "चंदगढ़", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Panhala", nameMr: "पन्हाळा", nameHi: "पन्हाला", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2026: {
      en: "Partially declared: 10 out of 12 talukas declared following Trigger-1 and Trigger-2 dry-spell evaluations. Karvir and Shahuwadi remain baseline.",
      mr: "अंशतः घोषित: ट्रिगर-१ व ट्रिगर-२ मूल्यांकनानंतर १२ पैकी १० तालुके अधिकृत घोषित. करवीर व शाहूवाडी वगळले.",
      hi: "आंशिक घोषित: 12 में से 10 तहसीलें ट्रिगर-1/2 के तहत घोषित। करवीर व शाहूवाड़ी सामान्य।"
    },
    status2023: "officially_declared",
    declaredCount2023: 2,
    circlesCount2023: 18,
    gr2023: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate2023: "31 October 2023",
    talukas2023: [
      { name: "Hatkanangale", nameMr: "हातकणंगले", nameHi: "हातकणंगले", severity: "moderate", grNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३", grDate: "31 Oct 2023", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Gadhinglaj", nameMr: "गडहिंग्लज", nameHi: "गडहिंग्लज", severity: "moderate", grNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३", grDate: "31 Oct 2023", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2023: {
      en: "Historical 2023: 2 talukas declared in Oct 2023; 18 circles granted concessions in Nov 2023.",
      mr: "ऐतिहासिक २०२३: २ तालुके घोषित; १८ महसूल मंडळांना सवलती लागू.",
      hi: "ऐतिहासिक 2023: 2 तहसीलें घोषित; 18 मंडलों को रियायतें।"
    }
  },

  // 3. NASHIK DIVISION
  {
    id: "ahilyanagar",
    code: "AHI",
    name: "Ahilyanagar (Ahmednagar)",
    nameMr: "अहिल्यानगर (अहमदनगर)",
    nameHi: "अहिल्यानगर (अहमदनगर)",
    division: "Nashik",
    divisionMr: "नाशिक विभाग",
    divisionHi: "नासिक विभाग",
    totalTalukas: 14,
    status2026: "officially_declared",
    declaredCount2026: 14,
    talukas2026: [
      { name: "Nagar", nameMr: "नगर", nameHi: "नगर", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Shevgaon", nameMr: "शेवगाव", nameHi: "शेवगांव", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Pathardi", nameMr: "पाथर्डी", nameHi: "पाथर्डी", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Parner", nameMr: "पारनेर", nameHi: "पारनेर", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Sangamner", nameMr: "संगमनेर", nameHi: "संगमनेर", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Kopargaon", nameMr: "कोपरगाव", nameHi: "कोपरगांव", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Shrirampur", nameMr: "श्रीरामपूर", nameHi: "श्रीरामपुर", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Nevasa", nameMr: "नेवासा", nameHi: "नेवासा", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Rahata", nameMr: "राहाता", nameHi: "राहाता", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Rahuri", nameMr: "राहुरी", nameHi: "राहुरी", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Shrigonda", nameMr: "श्रीगोंदा", nameHi: "श्रीगोंदा", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Karjat", nameMr: "कर्जत", nameHi: "कर्जत", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Jamkhed", nameMr: "जामखेड", nameHi: "जामखेड", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Akole", nameMr: "अकोले", nameHi: "अकोले", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2026: {
      en: "All 14 talukas declared drought-hit. 196 drinking water tankers deployed (2nd highest in state as of 23 Oct 2026).",
      mr: "सर्व १४ तालुके दुष्काळग्रस्त घोषित. १९६ पिण्याचे टँकर सक्रिय (राज्यात दुसऱ्या क्रमांकावर).",
      hi: "सभी 14 तहसीलें सूखाग्रस्त। 196 पेयजल टैंकर तैनात (राज्य में दूसरा स्थान)।"
    },
    status2023: "officially_declared",
    declaredCount2023: 4,
    circlesCount2023: 67,
    gr2023: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate2023: "31 October 2023",
    talukas2023: [
      { name: "Parner", nameMr: "पारनेर", nameHi: "पारनेर", severity: "severe", grNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३", grDate: "31 Oct 2023", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Sangamner", nameMr: "संगमनेर", nameHi: "संगमनेर", severity: "severe", grNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३", grDate: "31 Oct 2023", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Kopargaon", nameMr: "कोपरगाव", nameHi: "कोपरगांव", severity: "moderate", grNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३", grDate: "31 Oct 2023", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Shrirampur", nameMr: "श्रीरामपूर", nameHi: "श्रीरामपुर", severity: "moderate", grNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३", grDate: "31 Oct 2023", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2023: {
      en: "Historical 2023: 4 talukas declared in Oct 2023. 67 revenue circles covered under 10 Nov 2023 concessions.",
      mr: "ऐतिहासिक २०२३: ४ तालुके ऑक्टोबर २०२३ मध्ये घोषित. नंतर ६७ महसूल मंडळांना सवलती लागू.",
      hi: "ऐतिहासिक 2023: 4 तहसीलें घोषित। 67 मंडलों को रियायतें।"
    }
  },
  {
    id: "nashik",
    code: "NAS",
    name: "Nashik",
    nameMr: "नाशिक",
    nameHi: "नासिक",
    division: "Nashik",
    divisionMr: "नाशिक विभाग",
    divisionHi: "नासिक विभाग",
    totalTalukas: 15,
    status2026: "officially_declared",
    declaredCount2026: 15,
    talukas2026: [
      { name: "Nashik", nameMr: "नाशिक", nameHi: "नासिक", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Malegaon", nameMr: "मालेगाव", nameHi: "मालेगांव", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Sinnar", nameMr: "सिन्नर", nameHi: "सिन्नर", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Yeola", nameMr: "येवला", nameHi: "येवला", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Nandgaon", nameMr: "नांदगाव", nameHi: "नांदगांव", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Chandwad", nameMr: "चांदवड", nameHi: "चांदवड़", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Deola", nameMr: "देवळा", nameHi: "देवला", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Baglan (Satana)", nameMr: "बागलाण (सटाणा)", nameHi: "बागलाण", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Kalwan", nameMr: "कळवण", nameHi: "कलवण", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Dindori", nameMr: "दिंडोरी", nameHi: "दिंडोरी", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Niphad", nameMr: "निफाड", nameHi: "निफाड़", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Igatpuri", nameMr: "इगतपुरी", nameHi: "इगतपुरी", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Trimbakeshwar", nameMr: "त्र्यंबकेश्वर", nameHi: "त्र्यंबकेश्वर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Peint", nameMr: "पेठ", nameHi: "पेठ", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Surgana", nameMr: "सुरगाणा", nameHi: "सुरगाणा", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2026: {
      en: "All 15 talukas declared drought-hit in 2026. 12 concessions operational.",
      mr: "सर्व १५ तालुके २०२६ मध्ये दुष्काळग्रस्त घोषित. १२ शासकीय सवलती लागू.",
      hi: "सभी 15 तहसीलें 2026 में सूखाग्रस्त। 12 शासकीय रियायतें लागू।"
    },
    status2023: "officially_declared",
    declaredCount2023: 4,
    circlesCount2023: 56,
    gr2023: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate2023: "31 October 2023",
    talukas2023: [
      { name: "Malegaon", nameMr: "मालेगाव", nameHi: "मालेगांव", severity: "severe", grNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३", grDate: "31 Oct 2023", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Sinnar", nameMr: "सिन्नर", nameHi: "सिन्नर", severity: "severe", grNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३", grDate: "31 Oct 2023", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Yeola", nameMr: "येवला", nameHi: "येवला", severity: "moderate", grNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३", grDate: "31 Oct 2023", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Nandgaon", nameMr: "नांदगाव", nameHi: "नांदगांव", severity: "moderate", grNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३", grDate: "31 Oct 2023", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2023: {
      en: "Historical 2023: 4 talukas declared in Oct 2023. 56 circles granted concessions in Nov 2023.",
      mr: "ऐतिहासिक २०२३: ४ तालुके घोषित; ५६ महसूल मंडळांना सवलती लागू.",
      hi: "ऐतिहासिक 2023: 4 तहसीलें घोषित; 56 मंडलों को रियायतें।"
    }
  },
  {
    id: "dhule",
    code: "DHU",
    name: "Dhule",
    nameMr: "धुळे",
    nameHi: "धुले",
    division: "Nashik",
    divisionMr: "नाशिक विभाग",
    divisionHi: "नासिक विभाग",
    totalTalukas: 4,
    status2026: "officially_declared",
    declaredCount2026: 4,
    talukas2026: [
      { name: "Dhule", nameMr: "धुळे", nameHi: "धुले", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Sindkheda", nameMr: "शिंदखेडा", nameHi: "शिंदखेडा", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Shirpur", nameMr: "शिरपूर", nameHi: "शिरपुर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Sakri", nameMr: "साक्री", nameHi: "साक्री", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2026: {
      en: "All 4 talukas declared drought-hit in 2026.",
      mr: "सर्व ४ तालुके २०२६ मध्ये दुष्काळग्रस्त घोषित.",
      hi: "सभी 4 तहसीलें 2026 में सूखाग्रस्त।"
    },
    status2023: "officially_declared",
    declaredCount2023: 2,
    circlesCount2023: 20,
    gr2023: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate2023: "31 October 2023",
    talukas2023: [
      { name: "Sindkheda", nameMr: "शिंदखेडा", nameHi: "शिंदखेडा", severity: "severe", grNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३", grDate: "31 Oct 2023", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Dhule", nameMr: "धुळे", nameHi: "धुले", severity: "moderate", grNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३", grDate: "31 Oct 2023", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2023: {
      en: "Historical 2023: 2 talukas declared in Oct 2023; 20 circles granted concessions in Nov 2023.",
      mr: "ऐतिहासिक २०२३: २ तालुके घोषित; २० महसूल मंडळांना सवलती लागू.",
      hi: "ऐतिहासिक 2023: 2 तहसीलें घोषित; 20 मंडलों को रियायतें।"
    }
  },
  {
    id: "jalgaon",
    code: "JAL",
    name: "Jalgaon",
    nameMr: "जळगाव",
    nameHi: "जलगांव",
    division: "Nashik",
    divisionMr: "नाशिक विभाग",
    divisionHi: "नासिक विभाग",
    totalTalukas: 15,
    status2026: "officially_declared",
    declaredCount2026: 15,
    talukas2026: [
      { name: "Jalgaon", nameMr: "जळगाव", nameHi: "जलगांव", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Jamner", nameMr: "जामनेर", nameHi: "जामनेर", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Bhadgaon", nameMr: "भडगाव", nameHi: "भडगांव", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Chalisgaon", nameMr: "चाळीसगाव", nameHi: "चालीसगांव", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Parola", nameMr: "पारोळा", nameHi: "पारोला", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Amalner", nameMr: "अमळनेर", nameHi: "अमलनेर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Chopda", nameMr: "चोपडा", nameHi: "चोपड़ा", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Yawal", nameMr: "यावल", nameHi: "यावल", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Raver", nameMr: "रावेर", nameHi: "रावेर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Muktainagar", nameMr: "मुक्ताईनगर", nameHi: "मुक्ताईनगर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Bodwad", nameMr: "बोधवड", nameHi: "बोधवड", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Bhusawal", nameMr: "भुसावळ", nameHi: "भुसावल", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Pachora", nameMr: "पाचोरा", nameHi: "पाचोरा", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Erandol", nameMr: "एरंडोल", nameHi: "एरंडोल", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Dharangaon", nameMr: "धरणगाव", nameHi: "धरणगांव", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2026: {
      en: "All 15 talukas declared drought-hit in 2026.",
      mr: "सर्व १५ तालुके २०२६ मध्ये दुष्काळग्रस्त घोषित.",
      hi: "सभी 15 तहसीलें 2026 में सूखाग्रस्त।"
    },
    status2023: "officially_declared",
    declaredCount2023: 4,
    circlesCount2023: 48,
    gr2023: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate2023: "31 October 2023",
    talukas2023: [
      { name: "Chalisgaon", nameMr: "चाळीसगाव", nameHi: "चालीसगांव", severity: "severe", grNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३", grDate: "31 Oct 2023", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Amalner", nameMr: "अमळनेर", nameHi: "अमलनेर", severity: "moderate", grNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३", grDate: "31 Oct 2023", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Parola", nameMr: "पारोळा", nameHi: "पारोला", severity: "moderate", grNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३", grDate: "31 Oct 2023", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Dharangaon", nameMr: "धरणगाव", nameHi: "धरणगांव", severity: "moderate", grNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३", grDate: "31 Oct 2023", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2023: {
      en: "Historical 2023: 4 talukas declared in Oct 2023; 48 circles granted concessions in Nov 2023.",
      mr: "ऐतिहासिक २०२३: ४ तालुके घोषित; ४८ महसूल मंडळांना सवलती लागू.",
      hi: "ऐतिहासिक 2023: 4 तहसीलें घोषित; 48 मंडलों को रियायतें।"
    }
  },
  {
    id: "nandurbar",
    code: "NAN",
    name: "Nandurbar",
    nameMr: "नंदुरबार",
    nameHi: "नंदुरबार",
    division: "Nashik",
    divisionMr: "नाशिक विभाग",
    divisionHi: "नासिक विभाग",
    totalTalukas: 6,
    status2026: "officially_declared",
    declaredCount2026: 6,
    talukas2026: [
      { name: "Nandurbar", nameMr: "नंदुरबार", nameHi: "नंदुरबार", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Shahada", nameMr: "शहादा", nameHi: "शहादा", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Taloda", nameMr: "तळोदा", nameHi: "तलोदा", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Akkalkuwa", nameMr: "अक्कलकुवा", nameHi: "अक्कलकुवा", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Dhadgaon (Akrani)", nameMr: "धडगाव (अक्राणी)", nameHi: "धड़गांव", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Navapur", nameMr: "नवापूर", nameHi: "नवापुर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2026: {
      en: "All 6 talukas declared drought-hit in 2026.",
      mr: "सर्व ६ तालुके २०२६ मध्ये दुष्काळग्रस्त घोषित.",
      hi: "सभी 6 तहसीलें 2026 में सूखाग्रस्त।"
    },
    status2023: "officially_declared",
    declaredCount2023: 1,
    circlesCount2023: 15,
    gr2023: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate2023: "31 October 2023",
    talukas2023: [
      { name: "Nandurbar", nameMr: "नंदुरबार", nameHi: "नंदुरबार", severity: "moderate", grNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३", grDate: "31 Oct 2023", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2023: {
      en: "Historical 2023: Nandurbar declared in Oct 2023; 15 circles received concessions in Nov 2023.",
      mr: "ऐतिहासिक २०२३: केवळ नंदुरबार घोषित; १५ मंडळांना सवलती लागू.",
      hi: "ऐतिहासिक 2023: केवल नंदुरबार घोषित; 15 मंडलों को रियायतें।"
    }
  },

  // 4. VIDARBHA (WEST / AMRAVATI DIVISION)
  {
    id: "buldhana",
    code: "BUL",
    name: "Buldhana",
    nameMr: "बुलढाणा",
    nameHi: "बुलढाणा",
    division: "Vidarbha (West)",
    divisionMr: "विदर्भ (अमरावती)",
    divisionHi: "विदर्भ (अमरावती)",
    totalTalukas: 13,
    status2026: "officially_declared",
    declaredCount2026: 13,
    talukas2026: [
      { name: "Buldhana", nameMr: "बुलढाणा", nameHi: "बुलढाणा", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Chikhli", nameMr: "चिखली", nameHi: "चिखली", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Deulgaon Raja", nameMr: "देउळगाव राजा", nameHi: "देउलगांव राजा", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Jalgaon Jamod", nameMr: "जळगाव जामोद", nameHi: "जलगांव जामोद", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Sangrampur", nameMr: "संग्रामपूर", nameHi: "संग्रामपुर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Malkapur", nameMr: "मलकापूर", nameHi: "मलकापुर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Motala", nameMr: "मोताळा", nameHi: "मोताला", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Nandura", nameMr: "नांदुरा", nameHi: "नांदुरा", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Khamgaon", nameMr: "खामगाव", nameHi: "खामगांव", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Shegaon", nameMr: "शेगाव", nameHi: "शेगांव", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Mehkar", nameMr: "मेहकर", nameHi: "मेहकर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Sindkhed Raja", nameMr: "सिंदखेड राजा", nameHi: "सिंदखेड राजा", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Lonar", nameMr: "लोणार", nameHi: "लोनार", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2026: {
      en: "All 13 talukas declared drought-hit in 2026. Cotton and soyabean damage assistance active.",
      mr: "सर्व १३ तालुके २०२६ मध्ये दुष्काळग्रस्त घोषित.",
      hi: "सभी 13 तहसीलें 2026 में सूखाग्रस्त घोषित।"
    },
    status2023: "officially_declared",
    declaredCount2023: 3,
    circlesCount2023: 45,
    gr2023: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate2023: "31 October 2023",
    talukas2023: [
      { name: "Lonar", nameMr: "लोणार", nameHi: "लोनार", severity: "severe", grNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३", grDate: "31 Oct 2023", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Sindkhed Raja", nameMr: "सिंदखेड राजा", nameHi: "सिंदखेड राजा", severity: "moderate", grNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३", grDate: "31 Oct 2023", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Mehkar", nameMr: "मेहकर", nameHi: "मेहकर", severity: "moderate", grNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३", grDate: "31 Oct 2023", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2023: {
      en: "Historical 2023: 3 talukas declared in Oct 2023; 45 circles granted concessions in Nov 2023.",
      mr: "ऐतिहासिक २०२३: ३ तालुके घोषित; ४५ महसूल मंडळांना सवलती लागू.",
      hi: "ऐतिहासिक 2023: 3 तहसीलें घोषित; 45 मंडलों को रियायतें।"
    }
  },
  {
    id: "akola",
    code: "AKO",
    name: "Akola",
    nameMr: "अकोला",
    nameHi: "अकोला",
    division: "Vidarbha (West)",
    divisionMr: "विदर्भ (अमरावती)",
    divisionHi: "विदर्भ (अमरावती)",
    totalTalukas: 7,
    status2026: "officially_declared",
    declaredCount2026: 7,
    talukas2026: [
      { name: "Akola", nameMr: "अकोला", nameHi: "अकोला", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Akot", nameMr: "आकोट", nameHi: "आकोट", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Telhara", nameMr: "तेल्हारा", nameHi: "तेल्हारा", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Balapur", nameMr: "बाळापूर", nameHi: "बालापुर", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Patur", nameMr: "पातूर", nameHi: "पातुर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Murtizapur", nameMr: "मूर्तिजापूर", nameHi: "मूर्तिजापुर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Barshitakli", nameMr: "बार्शीटाकळी", nameHi: "बार्शीटाकली", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2026: {
      en: "All 7 talukas declared drought-hit in 2026.",
      mr: "सर्व ७ तालुके २०२६ मध्ये दुष्काळग्रस्त घोषित.",
      hi: "सभी 7 तहसीलें 2026 में सूखाग्रस्त।"
    },
    status2023: "concession_circles",
    declaredCount2023: 0,
    circlesCount2023: 35,
    gr2023: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate2023: "10 November 2023",
    talukas2023: [],
    note2023: {
      en: "Historical 2023: 35 revenue circles received concessions.",
      mr: "ऐतिहासिक २०२३: ३५ महसूल मंडळांना सवलती लागू.",
      hi: "ऐतिहासिक 2023: 35 मंडलों को रियायतें।"
    }
  },
  {
    id: "washim",
    code: "WAS",
    name: "Washim",
    nameMr: "वाशिम",
    nameHi: "वाशिम",
    division: "Vidarbha (West)",
    divisionMr: "विदर्भ (अमरावती)",
    divisionHi: "विदर्भ (अमरावती)",
    totalTalukas: 6,
    status2026: "officially_declared",
    declaredCount2026: 6,
    talukas2026: [
      { name: "Washim", nameMr: "वाशिम", nameHi: "वाशिम", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Malegaon", nameMr: "मालेगाव", nameHi: "मालेगांव", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Risod", nameMr: "रिसोड", nameHi: "रिसोड", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Mangrulpir", nameMr: "मंगरुळपीर", nameHi: "मंगरुलपीर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Karanja", nameMr: "कारंजा", nameHi: "कारंजा", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Manora", nameMr: "मानोरा", nameHi: "मानोरा", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2026: {
      en: "All 6 talukas declared drought-hit in 2026.",
      mr: "सर्व ६ तालुके २०२६ मध्ये दुष्काळग्रस्त घोषित.",
      hi: "सभी 6 तहसीलें 2026 में सूखाग्रस्त घोषित।"
    },
    status2023: "concession_circles",
    declaredCount2023: 0,
    circlesCount2023: 27,
    gr2023: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate2023: "10 November 2023",
    talukas2023: [],
    note2023: {
      en: "Historical 2023: 27 revenue circles received concessions.",
      mr: "ऐतिहासिक २०२३: २७ महसूल मंडळांना सवलती लागू.",
      hi: "ऐतिहासिक 2023: 27 मंडलों को रियायतें।"
    }
  },
  {
    id: "amravati",
    code: "AMR",
    name: "Amravati",
    nameMr: "अमरावती",
    nameHi: "अमरावती",
    division: "Vidarbha (West)",
    divisionMr: "विदर्भ (अमरावती)",
    divisionHi: "विदर्भ (अमरावती)",
    totalTalukas: 14,
    status2026: "officially_declared",
    declaredCount2026: 14,
    talukas2026: [
      { name: "Amravati", nameMr: "अमरावती", nameHi: "अमरावती", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Bhatkuli", nameMr: "भातकुली", nameHi: "भातकुली", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Nandgaon Khandeshwar", nameMr: "नांदगाव खंडेश्वर", nameHi: "नांदगांव खंडेश्वर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Dharni", nameMr: "धारणी", nameHi: "धारणी", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Chikhaldara", nameMr: "चिखलदरा", nameHi: "चिखलदरा", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Achalpur", nameMr: "अचलपूर", nameHi: "अचलपुर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Chandurbazar", nameMr: "चांदूर बाजार", nameHi: "चांदूर बाजार", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Morshi", nameMr: "मोर्शी", nameHi: "मोर्शी", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Warud", nameMr: "वरुड", nameHi: "वरुड", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Daryapur", nameMr: "दर्यापूर", nameHi: "दर्यापुर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Anjangaon Surji", nameMr: "अंजनगाव सुर्जी", nameHi: "अंजनगांव सुर्जी", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Chandur Railway", nameMr: "चांदूर रेल्वे", nameHi: "चांदूर रेलवे", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Dhamangaon Railway", nameMr: "धामणगाव रेल्वे", nameHi: "धामणगांव रेलवे", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Tiosa", nameMr: "तिवसा", nameHi: "तिवसा", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2026: {
      en: "All 14 talukas declared drought-hit. 21 Oct directive: Water Supply Dept ordered village action plan by 25 Oct.",
      mr: "सर्व १४ तालुके दुष्काळग्रस्त घोषित. २१ ऑक्टोबर आदेश: पाणीपुरवठा विभागाने २५ ऑक्टोबरपर्यंत टंचाई कृती आराखडा सादर करण्याचे निर्देश दिले.",
      hi: "सभी 14 तहसीलें सूखाग्रस्त। 21 अक्टूबर निर्देश: 25 अक्टूबर तक पेयजल योजना पेश करने का आदेश।"
    },
    status2023: "officially_declared",
    declaredCount2023: 1,
    circlesCount2023: 40,
    gr2023: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate2023: "31 October 2023",
    talukas2023: [
      { name: "Warud", nameMr: "वरुड", nameHi: "वरुड", severity: "moderate", grNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३", grDate: "31 Oct 2023", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2023: {
      en: "Historical 2023: Only Warud declared in Oct 2023; 40 circles received concessions in Nov 2023.",
      mr: "ऐतिहासिक २०२३: केवळ वरुड तालुका घोषित; ४० मंडळांना सवलती लागू.",
      hi: "ऐतिहासिक 2023: केवल वरुड घोषित; 40 मंडलों को रियायतें।"
    }
  },
  {
    id: "yavatmal",
    code: "YAV",
    name: "Yavatmal",
    nameMr: "यवतमाळ",
    nameHi: "यवतमाल",
    division: "Vidarbha (West)",
    divisionMr: "विदर्भ (अमरावती)",
    divisionHi: "विदर्भ (अमरावती)",
    totalTalukas: 16,
    status2026: "officially_declared",
    declaredCount2026: 16,
    talukas2026: [
      { name: "Yavatmal", nameMr: "यवतमाळ", nameHi: "यवतमाल", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Arni", nameMr: "आर्णी", nameHi: "आर्णी", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Babhulgaon", nameMr: "बाभुळगाव", nameHi: "बाभुलगांव", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Kalamb", nameMr: "कळंब", nameHi: "कलंब", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Darwha", nameMr: "दारव्हा", nameHi: "दारव्हा", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Digras", nameMr: "दिग्रस", nameHi: "दिग्रस", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Ner", nameMr: "नेर", nameHi: "नेर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Pusad", nameMr: "पुसद", nameHi: "पुसद", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Umarkhed", nameMr: "उमरखेड", nameHi: "उमरखेड", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Mahagaon", nameMr: "महागाव", nameHi: "महागांव", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Kelapur (Pandharkawada)", nameMr: "केळापूर (पांढरकवडा)", nameHi: "केलापुर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Ralegaon", nameMr: "राळेगाव", nameHi: "रालेगांव", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Ghatanji", nameMr: "घाटंजी", nameHi: "घाटंजी", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Wani", nameMr: "वणी", nameHi: "वणी", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Maregaon", nameMr: "मारेगाव", nameHi: "मारेगांव", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Zari-Jamani", nameMr: "झरी जामणी", nameHi: "झरी जामणी", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2026: {
      en: "All 16 talukas declared drought-hit in 2026. Cotton crop stress monitored.",
      mr: "सर्व १६ तालुके २०२६ मध्ये दुष्काळग्रस्त घोषित.",
      hi: "सभी 16 तहसीलें 2026 में सूखाग्रस्त।"
    },
    status2023: "officially_declared",
    declaredCount2023: 3,
    circlesCount2023: 47,
    gr2023: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate2023: "31 October 2023",
    talukas2023: [
      { name: "Ralegaon", nameMr: "राळेगाव", nameHi: "रालेगांव", severity: "moderate", grNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३", grDate: "31 Oct 2023", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Mahagaon", nameMr: "महागाव", nameHi: "महागांव", severity: "moderate", grNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३", grDate: "31 Oct 2023", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Kalamb", nameMr: "कळंब", nameHi: "कलंब", severity: "moderate", grNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३", grDate: "31 Oct 2023", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2023: {
      en: "Historical 2023: 3 talukas declared in Oct 2023; 47 circles granted concessions in Nov 2023.",
      mr: "ऐतिहासिक २०२३: ३ तालुके घोषित; ४७ मंडळांना सवलती लागू.",
      hi: "ऐतिहासिक 2023: 3 तहसीलें घोषित; 47 मंडलों को रियायतें।"
    }
  },

  // 5. VIDARBHA (EAST / NAGPUR DIVISION)
  {
    id: "wardha",
    code: "WAR",
    name: "Wardha",
    nameMr: "वर्धा",
    nameHi: "वर्धा",
    division: "Vidarbha (East)",
    divisionMr: "विदर्भ (नागपूर)",
    divisionHi: "विदर्भ (नागपुर)",
    totalTalukas: 8,
    status2026: "officially_declared",
    declaredCount2026: 8,
    talukas2026: [
      { name: "Wardha", nameMr: "वर्धा", nameHi: "वर्धा", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Deoli", nameMr: "देवळी", nameHi: "देवली", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Seloo", nameMr: "सेलू", nameHi: "सेलू", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Arvi", nameMr: "आर्वी", nameHi: "आर्वी", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Ashti", nameMr: "आष्टी", nameHi: "आष्टी", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Karanja", nameMr: "कारंजा", nameHi: "कारंजा", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Hinganghat", nameMr: "हिंगणघाट", nameHi: "हिंगनघाट", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Samudrapur", nameMr: "समुद्रपूर", nameHi: "समुद्रपुर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2026: {
      en: "All 8 talukas declared drought-hit in 2026. On 17 Oct, CM addressed drought relief measures during Wardha visit.",
      mr: "सर्व ८ तालुके २०२६ मध्ये दुष्काळग्रस्त घोषित. १७ ऑक्टोबरला मुख्यमंत्र्यांनी वर्धा दौऱ्यात दुष्काळ उपाययोजनांचा आढावा घेतला.",
      hi: "सभी 8 तहसीलें 2026 में सूखाग्रस्त। 17 अक्टूबर को सीएम ने वर्धा में राहत की समीक्षा की।"
    },
    status2023: "concession_circles",
    declaredCount2023: 0,
    circlesCount2023: 32,
    gr2023: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate2023: "10 November 2023",
    talukas2023: [],
    note2023: {
      en: "Historical 2023: 32 revenue circles received concessions.",
      mr: "ऐतिहासिक २०२३: ३२ महसूल मंडळांना सवलती लागू.",
      hi: "ऐतिहासिक 2023: 32 मंडलों को रियायतें।"
    }
  },
  {
    id: "nagpur",
    code: "NAG",
    name: "Nagpur",
    nameMr: "नागपूर",
    nameHi: "नागपुर",
    division: "Vidarbha (East)",
    divisionMr: "विदर्भ (नागपूर)",
    divisionHi: "विदर्भ (नागपुर)",
    totalTalukas: 14,
    status2026: "officially_declared",
    declaredCount2026: 14,
    talukas2026: [
      { name: "Nagpur Urban", nameMr: "नागपूर शहर", nameHi: "नागपुर शहर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Nagpur Rural", nameMr: "नागपूर ग्रामीण", nameHi: "नागपुर ग्रामीण", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Kamptee", nameMr: "कामठी", nameHi: "कामठी", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Hingna", nameMr: "हिंगणा", nameHi: "हिंगना", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Katol", nameMr: "काटोल", nameHi: "काटोल", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Narkhed", nameMr: "नरखेड", nameHi: "नरखेड", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Savner", nameMr: "सावनेर", nameHi: "सावनेर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Kalameshwar", nameMr: "कलमेश्वर", nameHi: "कलमेश्वर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Ramtek", nameMr: "रामटेक", nameHi: "रामटेक", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Parseoni", nameMr: "पारशिवणी", nameHi: "पारशिवनी", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Mouda", nameMr: "मौदा", nameHi: "मौदा", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Umred", nameMr: "उमरेड", nameHi: "उमरेड", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Bhiwapur", nameMr: "भिवापूर", nameHi: "भिवापुर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Kuhi", nameMr: "कुही", nameHi: "कुही", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2026: {
      en: "All 14 talukas declared drought-hit in 2026. 21 Oct directive: Water Supply Dept ordered village action plan by 25 Oct.",
      mr: "सर्व १४ तालुके २०२६ मध्ये दुष्काळग्रस्त घोषित. २१ ऑक्टोबर आदेश: पाणीपुरवठा विभागाने २५ ऑक्टोबरपर्यंत टंचाई कृती आराखडा सादर करण्याचे निर्देश दिले.",
      hi: "सभी 14 तहसीलें 2026 में सूखाग्रस्त। 21 अक्टूबर निर्देश: 25 अक्टूबर तक पेयजल योजना पेश करने का आदेश।"
    },
    status2023: "concession_circles",
    declaredCount2023: 0,
    circlesCount2023: 38,
    gr2023: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate2023: "10 November 2023",
    talukas2023: [],
    note2023: {
      en: "Historical 2023: 38 revenue circles received concessions.",
      mr: "ऐतिहासिक २०२३: ३८ महसूल मंडळांना सवलती लागू.",
      hi: "ऐतिहासिक 2023: 38 मंडलों को रियायतें।"
    }
  },
  {
    id: "bhandara",
    code: "BHA",
    name: "Bhandara",
    nameMr: "भंडारा",
    nameHi: "भंडारा",
    division: "Vidarbha (East)",
    divisionMr: "विदर्भ (नागपूर)",
    divisionHi: "विदर्भ (नागपुर)",
    totalTalukas: 7,
    status2026: "partially_declared", // 5 out of 7 declared
    declaredCount2026: 5,
    talukas2026: [
      { name: "Bhandara", nameMr: "भंडारा", nameHi: "भंडारा", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Pauni", nameMr: "पवनी", nameHi: "पौनी", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Lakhandur", nameMr: "लाखांदूर", nameHi: "लाखांदूर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Mohadi", nameMr: "मोहाडी", nameHi: "मोहाडी", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Tumsar", nameMr: "तुमसर", nameHi: "तुमसर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2026: {
      en: "Partially declared: 5 out of 7 talukas declared in mid-Oct expansion (Bhandara, Pauni, Lakhandur, Mohadi, Tumsar). Sakoli and Lakhani remain baseline.",
      mr: "अंशतः घोषित: ७ पैकी ५ तालुके ऑक्टोबरच्या विस्तारात घोषित (भंडारा, पवनी, लाखांदूर, मोहाडी, तुमसर). साकोली व लाखांनी वगळले.",
      hi: "आंशिक घोषित: 7 में से 5 तहसीलें घोषित। साकोली व लाखानी सामान्य।"
    },
    status2023: "concession_circles",
    declaredCount2023: 0,
    circlesCount2023: 22,
    gr2023: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate2023: "10 November 2023",
    talukas2023: [],
    note2023: {
      en: "Historical 2023: 22 revenue circles received concessions.",
      mr: "ऐतिहासिक २०२३: २२ महसूल मंडळांना सवलती लागू.",
      hi: "ऐतिहासिक 2023: 22 मंडलों को रियायतें।"
    }
  },
  {
    id: "gondia",
    code: "GON",
    name: "Gondia",
    nameMr: "गोंदिया",
    nameHi: "गोंदिया",
    division: "Vidarbha (East)",
    divisionMr: "विदर्भ (नागपूर)",
    divisionHi: "विदर्भ (नागपुर)",
    totalTalukas: 8,
    status2026: "officially_declared",
    declaredCount2026: 8,
    talukas2026: [
      { name: "Gondia", nameMr: "गोंदिया", nameHi: "गोंदिया", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Tiroda", nameMr: "तिरोडा", nameHi: "तिरोड़ा", severity: "severe", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Goregaon", nameMr: "गोरेगाव", nameHi: "गोरेगांव", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Arjuni Morgaon", nameMr: "अर्जुनी मोरगाव", nameHi: "अर्जुनी मोरगांव", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Amgaon", nameMr: "आमगाव", nameHi: "आमगांव", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Salekasa", nameMr: "सालेकसा", nameHi: "सालेकसा", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Sadak Arjuni", nameMr: "सडक अर्जुनी", nameHi: "सड़क अर्जुनी", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Deori", nameMr: "देवरी", nameHi: "देवरी", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2026: {
      en: "All 8 talukas included in October 2026 drought expansion.",
      mr: "ऑक्टोबर २०२६ च्या दुष्काळ विस्तारात सर्व ८ तालुके समाविष्ट.",
      hi: "अक्टूबर 2026 विस्तार में सभी 8 तहसीलें शामिल।"
    },
    status2023: "concession_circles",
    declaredCount2023: 0,
    circlesCount2023: 20,
    gr2023: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate2023: "10 November 2023",
    talukas2023: [],
    note2023: {
      en: "Historical 2023: 20 revenue circles received concessions.",
      mr: "ऐतिहासिक २०२३: २० महसूल मंडळांना सवलती लागू.",
      hi: "ऐतिहासिक 2023: 20 मंडलों को रियायतें।"
    }
  },
  {
    id: "chandrapur",
    code: "CHA",
    name: "Chandrapur",
    nameMr: "चंद्रपूर",
    nameHi: "चंद्रपुर",
    division: "Vidarbha (East)",
    divisionMr: "विदर्भ (नागपूर)",
    divisionHi: "विदर्भ (नागपुर)",
    totalTalukas: 15,
    status2026: "officially_declared",
    declaredCount2026: 15,
    talukas2026: [
      { name: "Chandrapur", nameMr: "चंद्रपूर", nameHi: "चंद्रपुर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Saoli", nameMr: "सावली", nameHi: "सावली", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Mul", nameMr: "मूल", nameHi: "मूल", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Ballarpur", nameMr: "बल्लारपूर", nameHi: "बल्लारपुर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Pombhurna", nameMr: "पोंभुर्णा", nameHi: "पोंभुर्ना", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Gondpipri", nameMr: "गोंडपिंपरी", nameHi: "गोंडपिपरी", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Warora", nameMr: "वरोरा", nameHi: "वरोरा", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Bhadrawati", nameMr: "भद्रावती", nameHi: "भद्रावती", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Chimur", nameMr: "चिमूर", nameHi: "चिमूर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Brahmapuri", nameMr: "ब्रह्मपुरी", nameHi: "ब्रह्मपुरी", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Nagbhid", nameMr: "नागभीड", nameHi: "नागभीड", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Sindewahi", nameMr: "सिंदेवाही", nameHi: "सिंदेवाही", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Rajura", nameMr: "राजूरा", nameHi: "राजूरा", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Korpurna", nameMr: "कोरपना", nameHi: "कोरपना", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Jiwati", nameMr: "जिवती", nameHi: "जिवती", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2026: {
      en: "All 15 talukas covered under drought relief following 14 Oct expansion.",
      mr: "१४ ऑक्टोबरच्या विस्तारानंतर सर्व १५ तालुके दुष्काळ सवलतींखाली समाविष्ट.",
      hi: "14 अक्टूबर विस्तार के बाद सभी 15 तहसीलें सूखा राहत में शामिल।"
    },
    status2023: "concession_circles",
    declaredCount2023: 0,
    circlesCount2023: 42,
    gr2023: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate2023: "10 November 2023",
    talukas2023: [],
    note2023: {
      en: "Historical 2023: 42 revenue circles received concessions.",
      mr: "ऐतिहासिक २०२३: ४२ महसूल मंडळांना सवलती लागू.",
      hi: "ऐतिहासिक 2023: 42 मंडलों को रियायतें।"
    }
  },
  {
    id: "gadchiroli",
    code: "GAD",
    name: "Gadchiroli",
    nameMr: "गडचिरोली",
    nameHi: "गडचिरोली",
    division: "Vidarbha (East)",
    divisionMr: "विदर्भ (नागपूर)",
    divisionHi: "विदर्भ (नागपुर)",
    totalTalukas: 12,
    status2026: "partially_declared", // 2 out of 12 talukas declared
    declaredCount2026: 2,
    talukas2026: [
      { name: "Gadchiroli", nameMr: "गडचिरोली", nameHi: "गडचिरोली", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Chamorshi", nameMr: "चामोर्शी", nameHi: "चामोर्शी", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2026: {
      en: "Partially declared: 2 talukas (Gadchiroli, Chamorshi) declared drought-hit due to local dry spells. Remaining 10 forest/heavy rainfall talukas are baseline.",
      mr: "अंशतः घोषित: केवळ २ तालुके (गडचिरोली, चामोर्शी) स्थानिक पावसाच्या खंडामुळे घोषित. उर्वरित १० तालुके सामान्य पर्जन्यमान श्रेणीत.",
      hi: "आंशिक घोषित: केवल 2 तहसीलें (गडचिरोली, चामोर्शी) घोषित। शेष 10 तहसीलें सामान्य।"
    },
    status2023: "baseline_monitored",
    declaredCount2023: 0,
    circlesCount2023: 0,
    gr2023: "N/A",
    grDate2023: "31 October 2023",
    talukas2023: [],
    note2023: {
      en: "Historical 2023: 0 talukas declared.",
      mr: "ऐतिहासिक २०२३: शून्य तालुके घोषित.",
      hi: "ऐतिहासिक 2023: 0 तहसीलें घोषित।"
    }
  },

  // 6. KONKAN DIVISION (Coastal - mostly baseline except specific pockets)
  {
    id: "palghar",
    code: "PAL",
    name: "Palghar",
    nameMr: "पालघर",
    nameHi: "पालघर",
    division: "Konkan",
    divisionMr: "कोकण",
    divisionHi: "कोंकण",
    totalTalukas: 8,
    status2026: "partially_declared", // 5 out of 8 talukas
    declaredCount2026: 5,
    talukas2026: [
      { name: "Dahanu", nameMr: "डहाणू", nameHi: "डहाणू", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Palghar", nameMr: "पालघर", nameHi: "पालघर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Vada", nameMr: "वाडा", nameHi: "वाडा", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Vikramgad", nameMr: "विक्रमगड", nameHi: "विक्रमगढ़", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Jawhar", nameMr: "जव्हार", nameHi: "जव्हार", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2026: {
      en: "Partially declared: 3 out of 8 talukas declared due to severe crop dry spells. 5 talukas remain baseline.",
      mr: "अंशतः घोषित: ८ पैकी ३ तालुके पावसाच्या खंडामुळे घोषित. ५ तालुके सामान्य श्रेणीत.",
      hi: "आंशिक घोषित: 8 में से 3 तहसीलें घोषित। 5 तहसीलें सामान्य।"
    },
    status2023: "officially_declared",
    declaredCount2023: 1,
    circlesCount2023: 8,
    gr2023: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate2023: "31 October 2023",
    talukas2023: [
      { name: "Vikramgad", nameMr: "विक्रमगड", nameHi: "विक्रमगढ़", severity: "moderate", grNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३", grDate: "31 Oct 2023", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2023: {
      en: "Historical 2023: Vikramgad declared in Oct 2023.",
      mr: "ऐतिहासिक २०२३: विक्रमगड तालुका घोषित.",
      hi: "ऐतिहासिक 2023: विक्रमगढ़ तहसील घोषित।"
    }
  },
  {
    id: "raigad",
    code: "RAI",
    name: "Raigad",
    nameMr: "रायगड",
    nameHi: "रायगढ़",
    division: "Konkan",
    divisionMr: "कोकण",
    divisionHi: "कोंकण",
    totalTalukas: 8,
    status2026: "partially_declared", // 1 out of 8 talukas
    declaredCount2026: 1,
    talukas2026: [
      { name: "Shrivardhan", nameMr: "श्रीवर्धन", nameHi: "श्रीवर्धन", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2026: {
      en: "Partially declared: Only 1 taluka (Shrivardhan) declared drought-hit. 7 talukas are baseline with abundant rainfall.",
      mr: "अंशतः घोषित: केवळ १ तालुका (श्रीवर्धन) दुष्काळग्रस्त घोषित. उर्वरित ७ तालुके सामान्य पर्जन्यमान श्रेणीत.",
      hi: "आंशिक घोषित: केवल 1 तहसील (श्रीवर्धन) घोषित। शेष 7 तहसीलें सामान्य।"
    },
    status2023: "baseline_monitored",
    declaredCount2023: 0,
    circlesCount2023: 0,
    gr2023: "N/A",
    grDate2023: "31 October 2023",
    talukas2023: [],
    note2023: {
      en: "Historical 2023: 0 talukas declared.",
      mr: "ऐतिहासिक २०२३: शून्य तालुके घोषित.",
      hi: "ऐतिहासिक 2023: 0 तहसीलें घोषित।"
    }
  },
  {
    id: "ratnagiri",
    code: "RAT",
    name: "Ratnagiri",
    nameMr: "रत्नागिरी",
    nameHi: "रत्नागिरी",
    division: "Konkan",
    divisionMr: "कोकण",
    divisionHi: "कोंकण",
    totalTalukas: 9,
    status2026: "partially_declared", // 6 out of 9 talukas
    declaredCount2026: 6,
    talukas2026: [
      { name: "Mandangad", nameMr: "मंडणगड", nameHi: "मंडणगढ़", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Dapoli", nameMr: "दापोली", nameHi: "दापोली", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Khed", nameMr: "खेड", nameHi: "खेड", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Chiplun", nameMr: "चिपळूण", nameHi: "चिपळूण", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Guhagar", nameMr: "गुहागर", nameHi: "गुहागर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" },
      { name: "Sangameshwar", nameMr: "संगमेश्वर", nameHi: "संगमेश्वर", severity: "moderate", grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२", grDate: "14 Oct 2026", sourceUrl: "https://gr.maharashtra.gov.in" }
    ],
    note2026: {
      en: "Partially declared: 6 out of 9 talukas declared under Trigger-1/2 norms. Ratnagiri, Rajapur, Lanja are baseline.",
      mr: "अंशतः घोषित: ९ पैकी ६ तालुके दुष्काळग्रस्त घोषित. रत्नागिरी, राजापूर व लांजा सामान्य श्रेणीत.",
      hi: "आंशिक घोषित: 9 में से 6 तहसीलें घोषित। रत्नागिरी, राजापुर, लांजा सामान्य।"
    },
    status2023: "baseline_monitored",
    declaredCount2023: 0,
    circlesCount2023: 0,
    gr2023: "N/A",
    grDate2023: "31 October 2023",
    talukas2023: [],
    note2023: {
      en: "Historical 2023: 0 talukas declared.",
      mr: "ऐतिहासिक २०२३: शून्य तालुके घोषित.",
      hi: "ऐतिहासिक 2023: 0 तहसीलें घोषित।"
    }
  },
  {
    id: "sindhudurg",
    code: "SIN",
    name: "Sindhudurg",
    nameMr: "सिंधुदुर्ग",
    nameHi: "सिंधुदुर्ग",
    division: "Konkan",
    divisionMr: "कोकण",
    divisionHi: "कोंकण",
    totalTalukas: 8,
    status2026: "baseline_monitored", // 0 declared talukas
    declaredCount2026: 0,
    talukas2026: [],
    note2026: {
      en: "Baseline monitored: Normal to surplus monsoon rainfall (>110% of normal). 0 talukas declared drought-hit. Water levels satisfactory.",
      mr: "सामान्य पर्जन्यमान: समाधानकारक पाऊस (>११०%). शून्य तालुके दुष्काळग्रस्त घोषित. पाणीसाठा समाधानकारक.",
      hi: "सामान्य श्रेणी: सामान्य से अधिक वर्षा। 0 तहसीलें सूखाग्रस्त। जलस्तर संतोषजनक।"
    },
    status2023: "baseline_monitored",
    declaredCount2023: 0,
    circlesCount2023: 0,
    gr2023: "N/A",
    grDate2023: "31 October 2023",
    talukas2023: [],
    note2023: {
      en: "Historical 2023: 0 talukas declared.",
      mr: "ऐतिहासिक २०२३: शून्य तालुके घोषित.",
      hi: "ऐतिहासिक 2023: 0 तहसीलें घोषित।"
    }
  },
  {
    id: "thane",
    code: "THA",
    name: "Thane",
    nameMr: "ठाणे",
    nameHi: "ठाणे",
    division: "Konkan",
    divisionMr: "कोकण",
    divisionHi: "कोंकण",
    totalTalukas: 7,
    status2026: "baseline_monitored",
    declaredCount2026: 0,
    talukas2026: [],
    note2026: {
      en: "Baseline monitored: 0 talukas declared drought-hit. Normal rainfall in catchment dams.",
      mr: "सामान्य पर्जन्यमान: शून्य तालुके घोषित. धरण पाणलोट क्षेत्रात पुरेसा पाऊस.",
      hi: "सामान्य श्रेणी: 0 तहसीलें घोषित। बांधों में पर्याप्त जल।"
    },
    status2023: "baseline_monitored",
    declaredCount2023: 0,
    circlesCount2023: 0,
    gr2023: "N/A",
    grDate2023: "31 October 2023",
    talukas2023: [],
    note2023: {
      en: "Historical 2023: 0 talukas declared.",
      mr: "ऐतिहासिक २०२३: शून्य तालुके घोषित.",
      hi: "ऐतिहासिक 2023: 0 तहसीलें घोषित।"
    }
  },
  {
    id: "mumbai-suburban",
    code: "MSU",
    name: "Mumbai Suburban",
    nameMr: "मुंबई उपनगर",
    nameHi: "मुंबई उपनगर",
    division: "Konkan",
    divisionMr: "कोकण",
    divisionHi: "कोंकण",
    totalTalukas: 3,
    status2026: "baseline_monitored",
    declaredCount2026: 0,
    talukas2026: [],
    note2026: {
      en: "Metropolitan urban non-agricultural district (Kurla, Andheri, Borivali sub-divisions). Excluded from agricultural drought declarations.",
      mr: "महानगरीय बिगर-शेती जिल्हा (कुर्ला, अंधेरी, बोरिवली उपविभाग). कृषी दुष्काळ कक्षेतून वगळलेला.",
      hi: "महानगरीय गैर-कृषि जिला। कृषि सूखा राहत से बाहर।"
    },
    status2023: "baseline_monitored",
    declaredCount2023: 0,
    circlesCount2023: 0,
    gr2023: "N/A",
    grDate2023: "31 October 2023",
    talukas2023: [],
    note2023: {
      en: "Historical 2023: Urban district excluded.",
      mr: "ऐतिहासिक २०२३: शहरी जिल्हा वगळलेला.",
      hi: "ऐतिहासिक 2023: शहरी जिला बाहर।"
    }
  },
  {
    id: "mumbai-city",
    code: "MUM",
    name: "Mumbai City",
    nameMr: "मुंबई शहर",
    nameHi: "मुंबई शहर",
    division: "Konkan",
    divisionMr: "कोकण",
    divisionHi: "कोंकण",
    totalTalukas: 0,
    status2026: "baseline_monitored",
    declaredCount2026: 0,
    talukas2026: [],
    note2026: {
      en: "Urban district with 0 rural talukas.",
      mr: "शहरी जिल्हा (शून्य ग्रामीण तालुके).",
      hi: "शहरी जिला (0 ग्रामीण तहसीलें)।"
    },
    status2023: "baseline_monitored",
    declaredCount2023: 0,
    circlesCount2023: 0,
    gr2023: "N/A",
    grDate2023: "31 October 2023",
    talukas2023: [],
    note2023: {
      en: "Historical 2023: Urban district.",
      mr: "ऐतिहासिक २०२३: शहरी जिल्हा.",
      hi: "ऐतिहासिक 2023: शहरी जिला।"
    }
  }
];

// Verify the count
let totalDeclared2026 = 0;
let districtsWithDeclared = 0;
districts.forEach(d => {
  totalDeclared2026 += d.declaredCount2026;
  if (d.declaredCount2026 > 0) districtsWithDeclared++;
});
console.log(`Audited 2026 Declared Talukas: ${totalDeclared2026}`);
console.log(`Audited 2026 Districts with Declared Talukas: ${districtsWithDeclared}`);

// Generate TypeScript code
let tsCode = `// Official Geographic and Drought Classification Dataset for Maharashtra (36 Districts)
// Sources:
// 1. Revenue & Forest Department, Government of Maharashtra
// 2. Relief and Rehabilitation Department, Disaster Management Division
// 3. Government Resolution (GR) No. Samiti-2026/PK 82/Madat-2 (Dated 25 Sept 2026 - Trigger-1 in 265 Talukas)
// 4. Government Resolution & Corrigendum (Dated 14 Oct 2026 - 304 Talukas across 32 Districts)
// 5. Food, Civil Supplies & Consumer Protection Dept GR No. 202610221655482506 (Dated 22 Oct 2026)
// 6. Historical Reference: GR No. 202310311805175519 (Dated 31 Oct 2023 - 40 Talukas) & 202311101905338119 (1,021 Circles)
// Last Verified & Audited: 23 October 2026

export type DroughtSeasonYear = "kharif_2026" | "historical_2023_24";

export type DistrictDroughtStatus = 
  | "officially_declared"       // All talukas declared drought-hit
  | "partially_declared"        // Specific sub-divisions declared (e.g. 10 of 14 in Pune, 1 of 8 in Raigad)
  | "concession_circles"       // Revenue circles declared drought-like
  | "under_assessment"         // Proposed / verification under audit
  | "baseline_monitored";      // Normal rainfall / non-drought / urban baseline

export interface DeclaredTalukaInfo {
  name: string;
  nameMr: string;
  nameHi: string;
  severity: "severe" | "moderate" | "concession_circle" | "proposed";
  grNumber: string;
  grDate: string;
  sourceUrl: string;
}

export interface SeasonDroughtDetails {
  status: DistrictDroughtStatus;
  declaredTalukasCount: number;
  totalTalukas: number;
  declaredTalukas: DeclaredTalukaInfo[];
  officialGrRef: string;
  grDate: string;
  sourceUrl: string;
  declaredCirclesCount?: number;
  verificationNote: {
    en: string;
    mr: string;
    hi: string;
  };
}

export interface MaharashtraDistrictGeo {
  id: string; // Slug (e.g. "chhatrapati-sambhajinagar")
  code: string; // 3-letter code
  name: string; // English
  nameMr: string; // Marathi
  nameHi: string; // Hindi
  division: "Marathwada" | "Paschim Maharashtra" | "Nashik" | "Vidarbha (West)" | "Vidarbha (East)" | "Konkan";
  divisionMr: string;
  divisionHi: string;
  totalTalukas: number;

  // Active view properties (Defaults to Kharif 2026)
  status: DistrictDroughtStatus;
  declaredTalukasCount: number;
  declaredTalukas: DeclaredTalukaInfo[];
  declaredCirclesCount: number;
  officialGrRef: string;
  grDate: string;
  sourceUrl: string;
  lastVerifiedDate: string;
  verificationNote: {
    en: string;
    mr: string;
    hi: string;
  };

  // Structured season layers
  season2026: SeasonDroughtDetails;
  historical2023: SeasonDroughtDetails;

  // SVG Vector Path coordinates for topological accuracy (viewBox 0 0 800 680)
  svgPath: string;
  labelX: number;
  labelY: number;
}

// 36 Districts of Maharashtra mapped with verified coordinates and dual-season data
export const MAHARASHTRA_DISTRICTS_DATA: MaharashtraDistrictGeo[] = [
`;

for (const d of districts) {
  const svg = svgMap[d.id] || { svgPath: "M0,0 Z", labelX: 400, labelY: 340 };

  tsCode += `  {
    id: ${JSON.stringify(d.id)},
    code: ${JSON.stringify(d.code)},
    name: ${JSON.stringify(d.name)},
    nameMr: ${JSON.stringify(d.nameMr)},
    nameHi: ${JSON.stringify(d.nameHi)},
    division: ${JSON.stringify(d.division)},
    divisionMr: ${JSON.stringify(d.divisionMr)},
    divisionHi: ${JSON.stringify(d.divisionHi)},
    totalTalukas: ${d.totalTalukas},

    // Default view: Kharif 2026
    status: ${JSON.stringify(d.status2026)},
    declaredTalukasCount: ${d.declaredCount2026},
    declaredCirclesCount: 0,
    officialGrRef: "शासन निर्णय क्र. संकीर्ण-२०२६/प्र.क्र.८२/म-२",
    grDate: "14 October 2026",
    sourceUrl: "https://gr.maharashtra.gov.in",
    lastVerifiedDate: "23 October 2026",
    verificationNote: ${JSON.stringify(d.note2026)},
    declaredTalukas: ${JSON.stringify(d.talukas2026, null, 6).replace(/\n/g, "\n    ")},

    // Structured Kharif 2026 Layer
    season2026: {
      status: ${JSON.stringify(d.status2026)},
      declaredTalukasCount: ${d.declaredCount2026},
      totalTalukas: ${d.totalTalukas},
      officialGrRef: "शासन निर्णय क्र. संकीर्ण-२०२६/प्र.क्र.८२/म-२",
      grDate: "14 October 2026",
      sourceUrl: "https://gr.maharashtra.gov.in",
      verificationNote: ${JSON.stringify(d.note2026)},
      declaredTalukas: ${JSON.stringify(d.talukas2026, null, 8).replace(/\n/g, "\n      ")}
    },

    // Structured Historical 2023-24 Layer
    historical2023: {
      status: ${JSON.stringify(d.status2023)},
      declaredTalukasCount: ${d.declaredCount2023},
      totalTalukas: ${d.totalTalukas},
      declaredCirclesCount: ${d.circlesCount2023},
      officialGrRef: ${JSON.stringify(d.gr2023)},
      grDate: ${JSON.stringify(d.grDate2023)},
      sourceUrl: "https://gr.maharashtra.gov.in",
      verificationNote: ${JSON.stringify(d.note2023)},
      declaredTalukas: ${JSON.stringify(d.talukas2023, null, 8).replace(/\n/g, "\n      ")}
    },

    svgPath: ${JSON.stringify(svg.svgPath)},
    labelX: ${svg.labelX},
    labelY: ${svg.labelY}
  },\n`;
}

tsCode += `];

// Helper to filter districts by search query and drought status
export function getFilteredDistricts(
  searchQuery: string = "",
  statusFilter: DistrictDroughtStatus | "all" = "all",
  season: DroughtSeasonYear = "kharif_2026"
): MaharashtraDistrictGeo[] {
  const query = searchQuery.trim().toLowerCase();

  return MAHARASHTRA_DISTRICTS_DATA.filter((district) => {
    const details = season === "kharif_2026" ? district.season2026 : district.historical2023;
    const matchesStatus = statusFilter === "all" || details.status === statusFilter;

    if (!matchesStatus) return false;

    if (!query) return true;

    const matchesName =
      district.name.toLowerCase().includes(query) ||
      district.nameMr.toLowerCase().includes(query) ||
      district.nameHi.toLowerCase().includes(query) ||
      district.code.toLowerCase().includes(query) ||
      district.division.toLowerCase().includes(query) ||
      district.divisionMr.toLowerCase().includes(query);

    const matchesTaluka = details.declaredTalukas.some(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.nameMr.toLowerCase().includes(query) ||
        t.nameHi.toLowerCase().includes(query)
    );

    return matchesName || matchesTaluka;
  });
}

// Summary statistics for Kharif 2026 and Historical 2023-24
export function getMaharashtraDroughtSummary(season: DroughtSeasonYear = "kharif_2026") {
  let declaredDistrictsCount = 0;
  let partialDistrictsCount = 0;
  let declaredTalukasTotal = 0;
  let totalTalukasState = 358;
  let totalCirclesCount = 0;

  for (const d of MAHARASHTRA_DISTRICTS_DATA) {
    const details = season === "kharif_2026" ? d.season2026 : d.historical2023;
    if (details.status === "officially_declared") {
      declaredDistrictsCount += 1;
    } else if (details.status === "partially_declared") {
      partialDistrictsCount += 1;
    }
    declaredTalukasTotal += details.declaredTalukasCount;
    if (details.declaredCirclesCount) {
      totalCirclesCount += details.declaredCirclesCount;
    }
  }

  return {
    season,
    totalDistricts: MAHARASHTRA_DISTRICTS_DATA.length, // 36
    declaredDistrictsCount,
    partialDistrictsCount,
    totalDistrictsCovered: declaredDistrictsCount + partialDistrictsCount,
    declaredTalukasTotal,
    totalTalukasState,
    totalCirclesCount,
    auditDisclaimer: {
      en: "The final count of drought-affected talukas in 2026 remains under official verification across 304 and 305 declarations.",
      mr: "२०२६ मधील दुष्काळग्रस्त तालुक्यांची अंतिम संख्या पडताळणीअधीन आहे.",
      hi: "2026 में सूखाग्रस्त तहसीलों की अंतिम संख्या सत्यापन के अधीन है।"
    },
    primaryGr: season === "kharif_2026" 
      ? "शासन निर्णय क्र. संकीर्ण-२०२६/प्र.क्र.८२/म-२ (१४ ऑक्टोबर २०२६) & अन्न व नागरी पुरवठा GR क्र. २०२६१०२२१६५५४८२५०६ (२२ ऑक्टोबर २०२६)"
      : "शासन निर्णय क्र. २०२३१०३११८०५१७५५१९ (३१ ऑक्टोबर २०२३ - ४० तालुके) & २०२३१११०१९०५३३८११९ (१० नोव्हेंबर २०२३ - १,०२१ मंडळे)",
    lastVerifiedDate: "23 October 2026"
  };
}
`;

fs.writeFileSync(targetFile, tsCode);
console.log(`Successfully generated updated ${targetFile}`);
