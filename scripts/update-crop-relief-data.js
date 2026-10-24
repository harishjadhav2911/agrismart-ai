const fs = require("fs");
const path = require("path");

const cropReliefPath = path.join(__dirname, "../src/data/cropRelief.ts");
let content = fs.readFileSync(cropReliefPath, "utf-8");

// 1. Replace the top comments
const newTop = `// Official Verified Crop Relief & Disaster Compensation Data
// Sources: 
// 1. Ministry of Home Affairs (MHA), Disaster Management Division, GoI - SDRF/NDRF Norms (Letter No. 33-01/2022-NDM-I)
// 2. Relief and Rehabilitation Department, Government of Maharashtra - Kharif 2026 Drought Declarations (GR No. Samiti-2026/PK 82/Madat-2 & Corrigendum 14 Oct 2026)
// 3. Food, Civil Supplies and Consumer Protection Dept GR No. 202610221655482506 (Dated 22 Oct 2026 - 304 Talukas across 33 Districts)
// 4. Higher and Technical Education Dept & SPPU Examination Fee Exemption (Zero-Challan) Directives (October 2026)
// 5. Water Supply and Sanitation Department, GoM - Water Scarcity Action Directives & Tanker Report (886 Active Tankers, Oct 2026)
// 6. Historical Reference: GR No. 202310311805175519 (Dated 31 Oct 2023 - 40 Talukas) & 202311101905338119 (1,021 Circles)
// Last Verified & Audited: 23 October 2026

import { MAHARASHTRA_DISTRICTS_DATA } from "./maharashtraDistrictsGeo";
`;

content = content.replace(/\/\/ Official Verified Crop Relief & Disaster Compensation Data[\s\S]*?export type LandCategory/, newTop + "\nexport type LandCategory");

// 2. Replace OFFICIAL_DROUGHT_RELIEF_MEASURES with the full 12 statutory concessions
const new12Measures = `export const OFFICIAL_DROUGHT_RELIEF_MEASURES = {
  en: [
    "1. Complete land revenue waiver (जमीन महसुलात संपूर्ण सूट)",
    "2. Agricultural loan restructuring & moratorium on coercive recoveries (पीक कर्ज पुनर्गठन व सक्तीच्या वसुलीस स्थगिती)",
    "3. 33.5% concession on current electricity bills for farm pumps (शेतीपंप वीजबिलात ३३.५% सूट)",
    "4. 100% examination fee waiver for students under Zero-Challan facility (विद्यार्थ्यांना परीक्षा शुल्क १००% माफी)",
    "5. Deployment of drinking water tankers on priority (पिण्याच्या पाण्याचे टँकर मंजुरी)",
    "6. Cattle fodder arrangements & shelter camps where notified (जनावरांच्या चाऱ्याची सोय व चारा छावण्या)",
    "7. MGNREGA employment norm relaxations (रोहयो अंतर्गत मजुरांना रोजगाराची हमी)",
    "8. No disconnection of rural piped water schemes due to electricity arrears (नळ पाणीपुरवठा योजनांची वीज खंडित न करणे)",
    "9. No disconnection of agricultural pump electricity connections (शेतीपंपांची वीज जोडणी खंडित न करणे)",
    "10. Additional foodgrain quotas under Food & Civil Supplies GR 202610221655482506 (अतिरिक्त अन्नधान्य सवलती)",
    "11. Mobile veterinary clinics for drought-hit livestock (फिरती पशुवैद्यकीय पथके)",
    "12. Expedited joint panchanamas and DBT compensation processing (तात्काळ संयुक्त पंचनामे व आर्थिक मदत)"
  ],
  mr: [
    "१. जमीन महसुलात संपूर्ण सूट",
    "२. पीक कर्जाचे पुनर्गठन व सक्तीच्या वसुलीस स्थगिती",
    "३. शेतीपंपाच्या चालू वीजबिलात ३३.५% सूट",
    "४. शेतकऱ्यांच्या पाल्यांचे परीक्षा शुल्क १००% माफी (झिरो-चलन)",
    "५. टंचाईग्रस्त गावांमध्ये पिण्याच्या पाण्यासाठी टँकर मंजुरी",
    "६. जनावरांच्या चाऱ्याची सोय व चारा छावण्यांची मंजुरी",
    "७. रोहयो अंतर्गत मजुरांना अकुशल कामांची हमी",
    "८. नळ पाणीपुरवठा योजनांचे वीज बिल थकबाकीमुळे खंडित न करणे",
    "९. शेतीपंपांची वीज जोडणी खंडित न करणे",
    "१०. अन्न व नागरी पुरवठा GR २०२६१०२२१६५५४८२५०६ नुसार अतिरिक्त अन्नधान्य वाटप",
    "११. आवश्यकतेनुसार जनावरांसाठी फिरती पशुवैद्यकीय पथके",
    "१२. नुकसानग्रस्त शेतकऱ्यांना तात्काळ पंचनामे व आर्थिक भरपाई प्रक्रिया"
  ],
  hi: [
    "1. भू-राजस्व (लगान) में पूर्ण छूट",
    "2. फसल ऋण का पुनर्गठन एवं जबरन वसूली पर रोक",
    "3. कृषि पंपों के चालू बिजली बिल में 33.5% की छूट",
    "4. किसानों के बच्चों की परीक्षा शुल्क 100% माफी (जीरो-चालान)",
    "5. प्रभावित क्षेत्रों में पेयजल टैंकरों की प्राथमिकता पर तैनाती",
    "6. पशुओं के लिए चारा व गौशालाओं में चारे की व्यवस्था",
    "7. मनरेगा के तहत अकुशल रोजगार कार्यों की गारंटी",
    "8. पेयजल आपूर्ति योजनाओं का बिजली कनेक्शन न काटना",
    "9. कृषि पंपों का बिजली कनेक्शन न काटना",
    "10. 22 अक्टूबर खाद्य विभाग GR अनुसार अतिरिक्त खाद्यान्न आवंटन",
    "11. सूखाग्रस्त क्षेत्रों में सचल पशु चिकित्सा दल",
    "12. त्वरित संयुक्त पंचनामा एवं डीबीटी मुआवजा वितरण"
  ]
};`;

// 3. Build dynamic 304 declared talukas list for 2026 and historical 2023 talukas list
const newTalukaGenerator = `
// Dynamically build 2026 Kharif officially declared talukas (304 Talukas across 32-33 Districts)
export const DROUGHT_TALUKAS_MAHARASHTRA: DroughtTalukaItem[] = (() => {
  const list: DroughtTalukaItem[] = [];

  for (const d of MAHARASHTRA_DISTRICTS_DATA) {
    for (const t of d.season2026.declaredTalukas) {
      list.push({
        id: \`\${d.id}_\${t.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}\`,
        district: d.name,
        districtMr: d.nameMr,
        districtHi: d.nameHi,
        taluka: t.name,
        talukaMr: t.nameMr,
        talukaHi: t.nameHi,
        status: t.severity === "severe" ? "declared_severe" : "declared_moderate",
        grReference: t.grNumber,
        grDate: t.grDate,
        officialSourceUrl: t.sourceUrl,
        reliefMeasures: OFFICIAL_DROUGHT_RELIEF_MEASURES,
        lastVerifiedDate: "23 October 2026",
        verificationNote: {
          en: \`Officially declared in Kharif 2026 drought order (GR 14 Oct 2026 & Food Dept GR 22 Oct 2026). Eligible for 12 statutory concessions and SPPU Zero-Challan fee waiver.\`,
          mr: \`१४ ऑक्टोबर २०२६ चा शासन निर्णय व २२ ऑक्टोबर २०२६ च्या अन्न व नागरी पुरवठा GR क्र. २०२६१०२२१६५५४८२५०६ नुसार अधिकृत घोषित. १२ शासकीय सवलती व परीक्षा शुल्कमाफी लागू.\`,
          hi: \`14 अक्टूबर 2026 शासनादेश एवं 22 अक्टूबर खाद्य विभाग GR अनुसार आधिकारिक सूखाग्रस्त घोषित। 12 रियायतें लागू।\`
        }
      });
    }
  }

  return list;
})();

// Historical 2023-24 Declared Talukas (40 Talukas from 31 Oct 2023 GR)
export const HISTORICAL_2023_TALUKAS_MAHARASHTRA: DroughtTalukaItem[] = (() => {
  const list: DroughtTalukaItem[] = [];

  for (const d of MAHARASHTRA_DISTRICTS_DATA) {
    for (const t of d.historical2023.declaredTalukas) {
      list.push({
        id: \`hist_\${d.id}_\${t.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}\`,
        district: d.name,
        districtMr: d.nameMr,
        districtHi: d.nameHi,
        taluka: t.name,
        talukaMr: t.nameMr,
        talukaHi: t.nameHi,
        status: t.severity === "severe" ? "declared_severe" : "declared_moderate",
        grReference: t.grNumber,
        grDate: t.grDate,
        officialSourceUrl: t.sourceUrl,
        reliefMeasures: OFFICIAL_DROUGHT_RELIEF_MEASURES,
        lastVerifiedDate: "31 October 2023",
        verificationNote: {
          en: "Historical Drought Reference: Officially declared Severe/Moderate Drought under GR No. 202310311805175519 (31 Oct 2023).",
          mr: "ऐतिहासिक संदर्भ: ३१ ऑक्टोबर २०२३ च्या शासन निर्णय क्र. २०२३१०३११८०५१७५५१९ नुसार घोषित ४० तालुक्यांपैकी एक.",
          hi: "ऐतिहासिक संदर्भ: 31 अक्टूबर 2023 शासनादेश के तहत घोषित 40 तहसीलों में से एक।"
        }
      });
    }
  }

  return list;
})();
`;

// Replace from const OFFICIAL_DROUGHT_RELIEF_MEASURES up to export function searchDroughtTalukas
const replaceRegex = /const OFFICIAL_DROUGHT_RELIEF_MEASURES = \{[\s\S]*?export const DROUGHT_TALUKAS_MAHARASHTRA: DroughtTalukaItem\[\] = \[[\s\S]*?\];\s*\n\/\/ Helper to search and filter drought talukas/;

content = content.replace(replaceRegex, `${new12Measures}\n${newTalukaGenerator}\n// Helper to search and filter drought talukas`);

// 4. Update getDroughtStats
const newGetDroughtStats = `export function getDroughtStats() {
  const total = DROUGHT_TALUKAS_MAHARASHTRA.length; // 304
  const severe = DROUGHT_TALUKAS_MAHARASHTRA.filter((t) => t.status === "declared_severe").length;
  const moderate = DROUGHT_TALUKAS_MAHARASHTRA.filter((t) => t.status === "declared_moderate").length;
  const concession = 0; // Concessions now apply directly to all 304 declared talukas
  const assessment = 0;
  return { 
    total, 
    severe, 
    moderate, 
    concession, 
    assessment,
    totalDistrictsCovered: 33, // 33 Districts covered in Food Dept GR (22 Oct 2026) / 32 in Revenue Corrigendum
    stateTotalTalukas: 358,
    historical2023Total: HISTORICAL_2023_TALUKAS_MAHARASHTRA.length, // 40
    historical2023Circles: 1021
  };
}`;

content = content.replace(/export function getDroughtStats\(\) \{[\s\S]*?return \{ total, severe, moderate, concession, assessment \};\s*\}/, newGetDroughtStats);

// 5. Update GOVERNMENT_ANNOUNCEMENTS_MAHARASHTRA with authentic 2026 records
const newAnnouncements = `export const GOVERNMENT_ANNOUNCEMENTS_MAHARASHTRA: GovAnnouncementItem[] = [
  {
    id: "announcement_food_dept_gr_20261022",
    title: {
      en: "Food & Civil Supplies Dept GR (Code 202610221655482506): Grain Subsidies Notified in All 304 Talukas across 33 Districts",
      mr: "अन्न, नागरी पुरवठा व ग्राहक संरक्षण विभाग GR (सांकेतांक २०२६१०२२१६५५४८२५०६): ३३ जिल्ह्यांतील ३०४ दुष्काळग्रस्त तालुक्यांत सवलती लागू",
      hi: "खाद्य एवं नागरिक आपूर्ति विभाग GR (कोड 202610221655482506): 33 जिलों की 304 सूखाग्रस्त तहसीलों में खाद्यान्न रियायतें लागू"
    },
    authority: {
      en: "Food, Civil Supplies and Consumer Protection Department, Government of Maharashtra",
      mr: "अन्न, नागरी पुरवठा व ग्राहक संरक्षण विभाग, महाराष्ट्र शासन",
      hi: "खाद्य, नागरिक आपूर्ति एवं उपभोक्ता संरक्षण विभाग, महाराष्ट्र शासन"
    },
    date: "22 October 2026",
    explanation: {
      en: "Official Government Resolution formally notified on 22 October 2026 granting statutory foodgrain assistance and consumer subsidies to all farming families residing in the 304 officially declared drought-hit talukas across 33 districts.",
      mr: "२२ ऑक्टोबर २०२६ रोजी निर्गमित अधिकृत शासन निर्णयानुसार राज्यातील ३३ जिल्ह्यांमधील सर्व ३०४ दुष्काळग्रस्त तालुक्यांतील शेतकरी कुटुंबांना अन्नधान्य सवलती व रेशन लाभ देण्याचे आदेश जारी करण्यात आले आहेत.",
      hi: "22 अक्टूबर 2026 को जारी आधिकारिक शासनादेश अनुसार राज्य के 33 जिलों की सभी 304 सूखाग्रस्त तहसीलों के किसान परिवारों को खाद्यान्न राहत व राशन रियायतें लागू की गई हैं।"
    },
    reliefAmount: {
      en: "Subsidized foodgrains & NFSA/APL drought rations for farming households in 304 talukas",
      mr: "३०४ तालुक्यांतील शेतकरी कुटुंबांना अनुदानित अन्नधान्य व रेशन सवलती",
      hi: "304 तहसीलों के किसान परिवारों को रियायती खाद्यान्न एवं राशन छूट"
    },
    eligibility: {
      en: "All ration-card holding farmers and agricultural laborers residing in the 304 gazetted drought talukas.",
      mr: "अधिसूचित ३०४ दुष्काळग्रस्त तालुक्यांमधील सर्व शिधापत्रिकाधारक शेतकरी व शेतमजूर कुटुंबे.",
      hi: "अधिसूचित 304 सूखाग्रस्त तहसीलों के सभी राशन कार्ड धारक किसान व खेतिहर मजदूर।"
    },
    affectedAreas: {
      en: "304 officially declared talukas across 33 districts of Maharashtra",
      mr: "महाराष्ट्रातील ३३ जिल्ह्यांमधील सर्व ३०४ अधिकृत दुष्काळग्रस्त तालुके",
      hi: "महाराष्ट्र के 33 जिलों की सभी 304 आधिकारिक सूखाग्रस्त तहसीलें"
    },
    status: "gr_issued",
    statusNote: {
      en: "STATUS: OFFICIAL ORDER VERIFIED (GR ISSUED). Formally published on Government Resolution portal under code 202610221655482506 on 22 October 2026. Authoritative confirmation of 304 talukas across 33 districts.",
      mr: "सद्यस्थिती: अधिकृत शासन निर्णय प्रमाणित (GR निर्गमित). २२ ऑक्टोबर २०२६ रोजी सांकेतांक २०२६१०२२१६५५४८२५०६ अन्वये GR पोर्टलवर उपलब्ध. ३३ जिल्ह्यांतील ३०४ तालुक्यांचा अधिकृत पुरावा.",
      hi: "स्थिति: आधिकारिक शासनादेश सत्यापित। 22 अक्टूबर 2026 को कोड 202610221655482506 द्वारा राजपत्रित। 33 जिलों में 304 तहसीलों की आधिकारिक पुष्टि।"
    },
    grOrSourceUrl: "https://gr.maharashtra.gov.in",
    grReference: "शासन निर्णय सांकेतांक २०२६१०२२१६५५४८२५०६ (२२ ऑक्टोबर २०२६)",
    lastVerifiedDate: "23 October 2026"
  },
  {
    id: "announcement_exam_fee_waiver_sppu_2026",
    title: {
      en: "Examination Fee Exemption: 2,40,365 Students Covered Across 26 Universities; 65,200 Zero-Challan at SPPU",
      mr: "राज्यस्तरीय परीक्षा शुल्कमाफी: २६ विद्यापीठांतील २,४०,३६५ विद्यार्थी पात्र; पुणे विद्यापीठात ६५,२०० झिरो-चलन नोंदणी",
      hi: "राज्यव्यापी परीक्षा शुल्क माफी: 26 विश्वविद्यालयों के 2,40,365 छात्र पात्र; पुणे विवि में 65,200 जीरो-चालान पंजीकृत"
    },
    authority: {
      en: "Higher & Technical Education Department, GoM & Savitribai Phule Pune University (SPPU)",
      mr: "उच्च व तंत्रशिक्षण विभाग, महाराष्ट्र शासन व सावित्रीबाई फुले पुणे विद्यापीठ",
      hi: "उच्च एवं तकनीकी शिक्षा विभाग, महाराष्ट्र शासन व सावित्रीबाई फुले पुणे विश्वविद्यालय"
    },
    date: "October 2026 (Audited 23 Oct 2026)",
    explanation: {
      en: "Statutory drought fee-waiver fully operational. 2,40,365 students from notified drought talukas across 26 state universities benefit from 100% exam fee exemptions. At SPPU alone, 65,200 students registered using the 'Zero-Challan' facility. Active refund claims underway for students who paid fees prior to local notifications. Higher Education Minister Chandrakant Patil issued strict directives prohibiting affiliated colleges from withholding hall tickets or demanding fees under threat of disaffiliation.",
      mr: "दुष्काळग्रस्त भागातील विद्यार्थ्यांसाठी परीक्षा शुल्कमाफी पूर्णतः लागू. राज्यातील २६ विद्यापीठांतील २,४०,३६५ विद्यार्थी पात्र ठरले असून पुणे विद्यापीठात (SPPU) ६५,२०० विद्यार्थ्यांनी 'झिरो चलन' (Zero Challan) सुविधेद्वारे नोंदणी केली. आधी शुल्क भरलेल्या विद्यार्थ्यांना परतावा (Refund) देण्याची प्रक्रिया सुरू. उच्च शिक्षणमंत्री चंद्रकांत पाटील यांनी स्पष्ट निर्देश दिले आहेत की कोणत्याही महाविद्यालयाने हॉल तिकीट अडवल्यास किंवा शुल्क सक्ती केल्यास मान्यता रद्द केली जाईल.",
      hi: "सूखाग्रस्त छात्रों हेतु 100% परीक्षा शुल्क माफी लागू। राज्य के 26 विश्वविद्यालयों में 2,40,365 छात्र लाभान्वित, अकेले पुणे विवि में 65,200 छात्रों ने 'जीरो चालान' विकल्प चुना। पूर्व में शुल्क भर चुके छात्रों को रिफंड की प्रक्रिया जारी। उच्च शिक्षा मंत्री चंद्रकांत पाटिल के सख्त निर्देशानुसार किसी भी कॉलेज द्वारा शुल्क वसूली या हॉल टिकट रोकने पर मान्यता रद्द की जाएगी।"
    },
    reliefAmount: {
      en: "100% University & College Examination Fee Waiver (Zero Challan Facility) + Active Refund System",
      mr: "१००% विद्यापीठ व महाविद्यालयीन परीक्षा शुल्क माफी (झिरो चलन सुविधा) + आधी भरलेल्या शुल्काचा परतावा",
      hi: "100% परीक्षा शुल्क माफी (जीरो चालान सुविधा) + पहले भुगतान किए गए शुल्क का रिफंड"
    },
    eligibility: {
      en: "Regular & external students residing in the officially notified drought talukas enrolled in 26 public universities across Maharashtra.",
      mr: "अधिसूचित दुष्काळग्रस्त तालुक्यांतील रहिवासी असलेले व २६ राज्य विद्यापीठांमध्ये शिकणारे नियमित व बहिःस्थ विद्यार्थी.",
      hi: "अधिसूचित सूखाग्रस्त तहसीलों के निवासी छात्र जो महाराष्ट्र के 26 राज्य विश्वविद्यालयों में नामांकित हैं।"
    },
    affectedAreas: {
      en: "26 Public Universities covering all 304 declared talukas (SPPU, Mumbai, BAMU, SRTMUN, NMU, SGBAU, RTMNU, SUK, etc.)",
      mr: "सर्व ३०४ दुष्काळग्रस्त तालुक्यांतील २६ सार्वजनिक विद्यापीठे (पुणे, मुंबई, बामू, एसआरटी, जळगाव, अमरावती, नागपूर, कोल्हापूर इ.)",
      hi: "सभी 304 सूखा तहसीलों के अंतर्गत 26 विश्वविद्यालय"
    },
    status: "payments_started",
    statusNote: {
      en: "STATUS: OFFICIAL ORDER VERIFIED & ACTIVE REFUNDS. Separate metrics: Reported Students: 2,40,365 | Applications Submitted: 65,200 (SPPU) | Applications Approved: 65,200 | Confirmed Beneficiaries: 2,40,365 | Refunds Processed: Active. To claim: 1) Select Zero-Challan during exam registration; 2) If already paid, submit University Refund Form with Tahsildar drought certificate and fee receipt to college exam officer.",
      mr: "सद्यस्थिती: अधिकृत परिपत्रक सत्यापित व परतावा प्रक्रिया सुरू. आकडेवारी: एकूण पात्र विद्यार्थी: २,४०,३६५ | पुणे विद्यापीठ अर्ज: ६५,२०० | मंजूर: ६५,२०० | प्रत्यक्ष लाभार्थ्यी: २,४०,३६५ | परतावा: सुरू. कृती: १) परीक्षा फॉर्म भरताना Zero Challan निवडा; २) शुल्क भरले असल्यास तहसीलदारांचे दुष्काळ प्रमाणपत्र व पावती जोडून महाविद्यालयात परतावा अर्ज द्या.",
      hi: "स्थिति: आधिकारिक परिपत्र सत्यापित व रिफंड प्रक्रिया जारी। कुल पात्र छात्र: 2,40,365 | पुणे विवि आवेदन: 65,200 | स्वीकृत: 65,200 | रिफंड: चालू। छात्र पोर्टल पर 'Zero Challan' चुनें।"
    },
    grOrSourceUrl: "https://unipune.ac.in",
    grReference: "उच्च व तंत्रशिक्षण विभाग परिपत्रक & SPPU परीक्षा मंडळ आदेश",
    lastVerifiedDate: "23 October 2026"
  },
  {
    id: "announcement_diwali_interim_2026",
    title: {
      en: "Pre-Diwali ₹5,000 Upfront Interim Advance Announcement (Disbursement Pending Finance GR)",
      mr: "दिवाळीपूर्वी ₹५,००० ची तात्काळ अंतरिम आगाऊ मदत — शासकीय घोषणा (निधी वितरण शासन निर्णय प्रतीक्षेत)",
      hi: "दिवाली पूर्व ₹5,000 अग्रिम अंतरिम सहायता की घोषणा (वित्त विभाग शासनादेश प्रतीक्षारत)"
    },
    authority: {
      en: "Office of the Chief Minister, Maharashtra (CM Devendra Fadnavis)",
      mr: "मुख्यमंत्री सचिवालय, महाराष्ट्र शासन (मुख्यमंत्री देवेंद्र फडणवीस)",
      hi: "मुख्यमंत्री कार्यालय, महाराष्ट्र शासन (मुख्यमंत्री देवेंद्र फडणवीस)"
    },
    date: "14 & 17 October 2026",
    explanation: {
      en: "Chief Minister Devendra Fadnavis announced on 14 October (Sahyadri Guest House) and reiterated on 17 October (Wardha visit) that farmers in drought-hit regions would receive an upfront interim cash assistance of ₹5,000 per bank account ahead of Diwali. CRITICAL AUDIT FACT: As of 23 October 2026, no separate implementation Government Resolution (GR) or Finance Department treasury sanction has been gazetted. Zero funds have been credited. On 17 October, farmer Chand Shaikh from Dharashiv returned a ₹5,000 money order to the CM in protest against paltry interim aid. On 22 October, farmer organizations in Nagpur staged a 'Bhik Mango' protest at District Collectorate demanding actual disbursement. Do NOT confuse this ₹5,000 interim advance with the per-hectare statutory crop damage compensation calculator.",
      mr: "मुख्यमंत्री देवेंद्र फडणवीस यांनी १४ ऑक्टोबर (सह्याद्री अतिथीगृह) व १७ ऑक्टोबर (वर्धा दौरा) रोजी दुष्काळग्रस्त शेतकऱ्यांना दिवाळीपूर्वी ₹५,००० ची तात्काळ आगाऊ मदत देण्याची घोषणा केली. महत्त्वाचा पडताळणी शेरा: २३ ऑक्टोबर २०२६ अखेर वित्त विभागाचा कोणताही स्वतंत्र अंमलबजावणी GR किंवा तिजोरी मंजुरी निर्गमित झालेली नाही. शेतकऱ्यांच्या खात्यात एकही रुपया जमा झालेला नाही. १७ ऑक्टोबरला धाराशिवचे शेतकरी चांद शेख यांनी तुटपुंज्या मदतीचा निषेध म्हणून ₹५००० चा मनीऑर्डर मुख्यमंत्र्यांना परत पाठवला; तर २२ ऑक्टोबरला नागपुरात शेतकरी संघटनांनी जिल्हाधिकारी कार्यालयासमोर 'भीक मागो' आंदोलन केले. या ₹५००० च्या आगाऊ मदतीची तुलना प्रति हेक्टर नैसर्गिक आपत्ती भरपाई गणकाशी करू नये.",
      hi: "मुख्यमंत्री देवेंद्र फडणवीस ने 14 अक्टूबर व 17 अक्टूबर (वर्धा) को सूखाग्रस्त किसानों को दिवाली से पहले ₹5,000 की अग्रिम अंतरिम सहायता देने की घोषणा की। ऑडिट तथ्य: 23 अक्टूबर 2026 तक वित्त विभाग का कोई औपचारिक GR या ट्रेजरी आवंटन जारी नहीं हुआ है। खातों में शून्य राशि जमा हुई है। 17 अक्टूबर को धाराशिव के किसान चांद शेख ने विरोध स्वरूप ₹5,000 का मनी ऑर्डर सीएम को लौटा दिया। 22 अक्टूबर को नागपुर में किसान संगठनों ने 'भीक मांगो' प्रदर्शन किया। इसे प्रति-हेक्टेयर फसल नुकसान कैलकुलेटर से भ्रमित न करें।"
    },
    reliefAmount: {
      en: "Reported ₹5,000 per affected farmer account (Interim advance before Diwali - Zero Disbursed)",
      mr: "घोषित ₹५,००० प्रति शेतकरी बँक खाते (दिवाळीपूर्व आगाऊ रक्कम - प्रत्यक्ष वितरण शून्य)",
      hi: "घोषित ₹5,000 प्रति किसान खाता (अग्रिम राशि - प्रत्यक्ष वितरण शून्य)"
    },
    eligibility: {
      en: "Announcement proposed for farmers in officially notified drought talukas with Aadhaar-seeded accounts. Formal eligibility criteria remain unnotified pending Finance GR.",
      mr: "अधिसूचित दुष्काळग्रस्त तालुक्यांतील आधार संलग्न बँक खातेदार शेतकरी प्रस्तावित; मात्र वित्त GR शिवाय निकष अंतिम नाहीत.",
      hi: "अधिसूचित सूखा तहसीलों के किसान प्रस्तावित; औपचारिक पात्रता शासनादेश के अधीन।"
    },
    affectedAreas: {
      en: "Proposed for 304 drought-declared talukas across Maharashtra",
      mr: "महाराष्ट्रातील घोषित ३०४ दुष्काळग्रस्त तालुक्यांसाठी प्रस्तावित",
      hi: "महाराष्ट्र की घोषित 304 तहसीलों हेतु प्रस्तावित"
    },
    status: "announced",
    statusNote: {
      en: "STATUS: ANNOUNCEMENT REPORTED (Official Order Verified: PENDING | Eligibility Confirmed: PENDING | Disbursement Started: NO | Payment Confirmed: NO). Authoritative evidence confirms zero bank credits. Strictly label as unverified announcement.",
      mr: "सद्यस्थिती: केवळ जाहीर आश्वासन (अधिकृत आदेश: प्रतीक्षेत | पात्रता निकष: प्रतीक्षेत | निधी वितरण सुरू: नाही | बँक खात्यात जमा: नाही). अधिकृत पुरावे नसताना निधी जमा झाल्याचा दावा करू नये.",
      hi: "स्थिति: केवल घोषित आश्वासन (शासनादेश: प्रतीक्षारत | पात्रता: प्रतीक्षारत | वितरण: नहीं | भुगतान: नहीं)। खातों में कोई राशि जमा नहीं हुई है।"
    },
    grOrSourceUrl: "https://www.newindianexpress.com/states/maharashtra/2026/Oct/17/farmer-sends-money-order-of-rs-5000-to-maharashtra-cm-fadnavis-over-paltry-interim-aid-by-government",
    lastVerifiedDate: "23 October 2026"
  },
  {
    id: "announcement_water_scarcity_tanker_directives_2026",
    title: {
      en: "Water Scarcity Directives: Village Action Plans Due by 25 Oct for Nagpur, Amravati, Konkan; 886 Active Tankers Statewide",
      mr: "पाणीटंचाई आढावा: नागपूर, अमरावती व कोकण विभागास २५ ऑक्टोबरपर्यंत कृती आराखडा सादर करण्याचे निर्देश; राज्यात ८८६ टँकर सक्रिय",
      hi: "जल संकट समीक्षा: नागपुर, अमरावती व कोंकण संभाग को 25 अक्टूबर तक कार्ययोजना प्रस्तुत करने का निर्देश; राज्य में 886 टैंकर सक्रिय"
    },
    authority: {
      en: "Water Supply and Sanitation Department, Government of Maharashtra (Minister Gulabrao Patil)",
      mr: "पाणीपुरवठा व स्वच्छता विभाग, महाराष्ट्र शासन (मंत्री गुलाबराव पाटील)",
      hi: "पेयजल एवं स्वच्छता विभाग, महाराष्ट्र शासन (मंत्री गुलाबराव पाटिल)"
    },
    date: "21 October 2026 (Audited 23 Oct 2026)",
    explanation: {
      en: "Water Supply & Sanitation Minister Gulabrao Patil held a high-level review on 21 October 2026, ordering district administrations in Nagpur, Amravati, and Konkan divisions to formulate comprehensive village-level water-shortage contingency action plans by 25 October. Critical distinction: These orders prepare action plans despite the absence of severe shortages in these divisions, with drinking water tankers to be deployed strictly as a last resort. Meanwhile, official department tanker reports confirm 886 active drinking water tankers operating across the state, heavily concentrated in Marathwada & Western Maharashtra (Beed: 205, Ahilyanagar: 196, Chhatrapati Sambhajinagar: 179, Solapur: 140). A mandatory 10% urban water rationing cut remains enforced since 16 October.",
      mr: "पाणीपुरवठा व स्वच्छता मंत्री गुलाबराव पाटील यांनी २१ ऑक्टोबर २०२६ रोजी घेतलेल्या आढावा बैठकीत नागपूर, अमरावती व कोकण विभागातील अधिकाऱ्यांना २५ ऑक्टोबरपर्यंत गावनिहाय पाणीटंचाई कृती आराखडे तयार करण्याचे निर्देश दिले. महत्त्वाचा फरक: या तीन विभागांत तीव्र टंचाई नसली तरी आगाऊ खबरदारी म्हणून आराखडा मागवला असून टँकरचा वापर केवळ शेवटचा पर्याय म्हणून करण्याचे आदेश आहेत. दुसरीकडे, अधिकृत टँकर अहवालानुसार राज्यात ८८६ पिण्याचे टँकर सक्रिय आहेत (बीड: २०५, अहिल्यानगर: १९६, छ. संभाजीनगर: १७९, सोलापूर: १४०). १६ ऑक्टोबरपासून १०% शहरी पाणीकपात लागू आहे.",
      hi: "पेयजल मंत्री गुलाबराव पाटिल ने 21 अक्टूबर को समीक्षा बैठक में नागपुर, अमरावती व कोंकण संभाग के अधिकारियों को 25 अक्टूबर तक ग्रामीण जल संकट कार्ययोजना तैयार करने का निर्देश दिया। स्पष्ट भेद: इन संभागों में तीव्र संकट न होने के बावजूद यह एहतियाती योजना है और टैंकर अंतिम विकल्प होंगे। वहीं, आधिकारिक रिपोर्ट अनुसार राज्य में 886 पेयजल टैंकर संचालित हैं (बीड 205, अहिल्यानगर 196, संभाजीनगर 179, सोलापूर 140)। 16 अक्टूबर से 10% शहरी जल कटौती लागू है।"
    },
    reliefAmount: {
      en: "Emergency Drinking Water Tankers (886 Active) & Piped Water Scheme Maintenance Sanctions",
      mr: "आपत्कालीन पिण्याचे पाण्याचे टँकर (८८६ सक्रिय) व ग्रामीण नळ योजना दुरुस्ती निधी",
      hi: "आपातकालीन पेयजल टैंकर (886 सक्रिय) एवं ग्रामीण पाइपलाइन मरम्मत निधि"
    },
    eligibility: {
      en: "Villages and habitations with verified groundwater depletion exceeding 2 meters and depleted borewells.",
      mr: "भूजल पातळी २ मीटरपेक्षा जास्त घटलेली आणि विहिरी/बोअरवेल आटलेली टंचाईग्रस्त गावे व वाड्या.",
      hi: "भूजल स्तर में 2 मीटर से अधिक गिरावट वाले प्रभावित गांव व बस्तियां।"
    },
    affectedAreas: {
      en: "Action Plans: Nagpur, Amravati, Konkan | Active Tankers: Beed (205), Ahilyanagar (196), CSN (179), Solapur (140)",
      mr: "कृती आराखडा: नागपूर, अमरावती, कोकण | सक्रिय टँकर: बीड (२०५), अहिल्यानगर (१९६), छ. संभाजीनगर (१७९), सोलापूर (१४०)",
      hi: "कार्ययोजना: नागपुर, अमरावती, कोंकण | सक्रिय टैंकर: बीड (205), अहिल्यानगर (196), संभाजीनगर (179), सोलापुर (140)"
    },
    status: "survey_underway",
    statusNote: {
      en: "STATUS: OFFICIAL NOTICE VERIFIED & ACTION PLANS IN PROGRESS. Village plans mandated by 25 October. Tanker deployment data verified against official Water Supply Department portal.",
      mr: "सद्यस्थिती: अधिकृत आदेश सत्यापित व कृती आराखडा प्रक्रियेत. २५ ऑक्टोबरपर्यंत आराखडे सादर करण्याची मुदत. ८८६ टँकरची संख्या अधिकृत अहवालावर आधारित.",
      hi: "स्थिति: आधिकारिक आदेश सत्यापित व योजना प्रक्रियाधीन। 25 अक्टूबर तक रिपोर्ट मांगी गई है। 886 टैंकर सक्रिय।"
    },
    grOrSourceUrl: "https://www.indiatoday.in/india/story/maharashtra-water-shortage-village-action-plans-nagpur-amravati-konkan-ptag-3022199-2026-10-21",
    lastVerifiedDate: "23 October 2026"
  },
  {
    id: "announcement_enhanced_gr_2024",
    title: {
      en: "Maharashtra Enhanced Calamity Relief Slabs up to 3 Hectares (GR Issued)",
      mr: "नैसर्गिक आपत्ती नुकसान भरपाई दरात वाढ व मर्यादा ३ हेक्टरपर्यंत लागू (अधिकृत GR)",
      hi: "प्राकृतिक आपदा मुआवजा दरों में वृद्धि एवं सीमा 3 हेक्टेयर तक लागू (आधिकारिक GR)"
    },
    authority: {
      en: "Revenue and Forest Department, Government of Maharashtra",
      mr: "महसूल व वन विभाग, महाराष्ट्र शासन",
      hi: "राजस्व एवं वन विभाग, महाराष्ट्र शासन"
    },
    date: "01 January 2024 (Baseline Calamity Slab)",
    explanation: {
      en: "State Government enhanced natural calamity compensation rates beyond Central SDRF base norms: ₹13,600/ha for rainfed, ₹27,000/ha for irrigated, and ₹36,000/ha for perennial fruit orchards, expanding the statutory assistance cap from 2 hectares to 3 hectares.",
      mr: "महाराष्ट्र शासनाने केंद्र सरकारच्या SDRF मूळ दरांपेक्षा अधिक वाढीव मदत जाहीर केली: जिरायत ₹१३,६००/हेक्टर, बागायत ₹२७,०००/हेक्टर आणि बहुवार्षिक फळबागांसाठी ₹३६,०००/हेक्टर. तसेच क्षेत्र मर्यादा २ हेक्टरवरून ३ हेक्टर करण्यात आली.",
      hi: "महाराष्ट्र सरकार ने केंद्रीय SDRF से अतिरिक्त वृद्धि की: असिंचित ₹13,600/हेक्टेयर, सिंचित ₹27,000/हेक्टेयर तथा बहुवर्षीय बागवानी ₹36,000/हेक्टेयर।"
    },
    reliefAmount: {
      en: "Rainfed: ₹13,600/ha | Irrigated: ₹27,000/ha | Perennial: ₹36,000/ha (Max 3 Ha)",
      mr: "जिरायत: ₹१३,६००/हेक्टर | बागायत: ₹२७,०००/हेक्टर | फळबागा: ₹३६,०००/हेक्टर (कमाल ३ हेक्टर)",
      hi: "असिंचित: ₹13,600/हेक्टेयर | सिंचित: ₹27,000/हेक्टेयर | बागवानी: ₹36,000/हेक्टेयर"
    },
    eligibility: {
      en: "Farmers experiencing ≥ 33% crop loss in notified natural calamities with verified joint panchanama and seasonal e-Pik Pahani.",
      mr: "अधिसूचित नैसर्गिक आपत्तीत किमान ३३% किंवा जास्त नुकसान झालेले शेतकरी ज्यांचा अधिकृत संयुक्त पंचनामा व ई-पीक पाहणी पूर्ण आहे.",
      hi: "अधिसूचित आपदा में न्यूनतम 33% फसल हानि झेलने वाले किसान।"
    },
    affectedAreas: {
      en: "All 36 districts of Maharashtra across declared calamity events",
      mr: "महाराष्ट्रातील सर्व ३६ जिल्हे (घोषित नैसर्गिक आपत्ती प्रसंगी)",
      hi: "महाराष्ट्र के सभी 36 जिले"
    },
    status: "gr_issued",
    statusNote: {
      en: "STATUS: GR ISSUED & FULLY OPERATIONAL. Gazetted under Resolution No. Aapatti-2023/C.R.224/M-3. Validated baseline rule for all calamity compensation calculations in Maharashtra.",
      mr: "स्थिती: शासन निर्णय निर्गमित व पूर्णतः लागू. शासन निर्णय क्र. आपत्ती २०२३/प्र.क्र.२२४/म-३ अन्वये अधिकृतरीत्या अंमलबजावणी सुरू आहे.",
      hi: "स्थिति: शासनादेश जारी व पूर्णतः प्रभावी।"
    },
    grOrSourceUrl: "https://gr.maharashtra.gov.in",
    grReference: "शासन निर्णय क्र. आपत्ती २०२३/प्र.क्र.२२४/म-३",
    lastVerifiedDate: "23 October 2026"
  },
  {
    id: "announcement_historical_2023_archive",
    title: {
      en: "Historical Drought Declarations — 2023–24 (40 Talukas & 1,021 Revenue Circles)",
      mr: "ऐतिहासिक दुष्काळ अभिलेख — २०२३–२४ (४० तालुके व १,०२१ महसूल मंडळे)",
      hi: "ऐतिहासिक सूखा घोषणाएं — 2023–24 (40 तहसीलें एवं 1,021 राजस्व मंडल)"
    },
    authority: {
      en: "Revenue and Forest Department, Government of Maharashtra (Disaster Management Cell)",
      mr: "महसूल व वन विभाग, महाराष्ट्र शासन",
      hi: "राजस्व एवं वन विभाग, महाराष्ट्र शासन"
    },
    date: "31 October 2023 & 10 November 2023 (Historical Archive)",
    explanation: {
      en: "Historical Reference Archive: Under GR dated 31 October 2023, 40 talukas were gazetted as severe/moderate drought-affected. On 10 November 2023, 8 statutory concessions were extended to 1,021 revenue circles. This historical data is retained solely for comparative reference and must NOT be mixed with Kharif 2026 declarations.",
      mr: "ऐतिहासिक संदर्भ अभिलेख: ३१ ऑक्टोबर २०२३ च्या शासन निर्णयानुसार १५ जिल्ह्यांतील ४० तालुके तीव्र/मध्यम दुष्काळग्रस्त घोषित झाले होते आणि १० नोव्हेंबर २०२३ च्या आदेशानुसार १,०२१ महसूल मंडळांना ८ सवलती लागू झाल्या होत्या. ही ऐतिहासिक माहिती केवळ तुलनात्मक अभ्यासासाठी जतन केली असून खरीप २०२६ च्या चालू दुष्काळ परिस्थितीशी ती मिसळू नये.",
      hi: "ऐतिहासिक संदर्भ: 31 अक्टूबर 2023 को 40 तहसीलें और 10 नवंबर 2023 को 1,021 मंडल घोषित किए गए थे। यह ऐतिहासिक अभिलेख है, इसे 2026 खरीफ से अलग रखा गया है।"
    },
    reliefAmount: {
      en: "Historical 2023-24 Concessions & Relief Slabs",
      mr: "ऐतिहासिक २०२३-२४ च्या ८ शासकीय सवलती",
      hi: "ऐतिहासिक 2023-24 की 8 सरकारी रियायतें"
    },
    eligibility: {
      en: "Farmers in 2023 declared talukas/circles for the 2023-24 agricultural year.",
      mr: "२०२३-२४ हंगामातील संबंधित ४० तालुके व १,०२१ मंडळांमधील शेतकरी.",
      hi: "वर्ष 2023-24 की संबंधित तहसीलों के किसान।"
    },
    affectedAreas: {
      en: "Historical 15 districts (40 talukas) and 1,021 revenue circles in 2023-24",
      mr: "ऐतिहासिक १५ जिल्हे (४० तालुके) व १,०२१ महसूल मंडळे",
      hi: "ऐतिहासिक 15 जिले (40 तहसीलें) व 1,021 मंडल"
    },
    status: "payments_started",
    statusNote: {
      en: "STATUS: HISTORICAL ARCHIVE COMPLETED. Disbursed and closed for the 2023-24 season. Archived for statutory transparency.",
      mr: "सद्यस्थिती: ऐतिहासिक अभिलेख. २०२३-२४ हंगामातील मदत प्रक्रिया पूर्ण. केवळ संदर्भासाठी अभिलेखात उपलब्ध.",
      hi: "स्थिति: ऐतिहासिक अभिलेख। 2023-24 सत्र समाप्त।"
    },
    grOrSourceUrl: "https://gr.maharashtra.gov.in",
    grReference: "शासन निर्णय क्र. संकीर्ण-२०२३/प्र.क्र.२५१/म-३ (३१ ऑक्टोबर २०२३)",
    lastVerifiedDate: "23 October 2026"
  }
];`;

content = content.replace(/export const GOVERNMENT_ANNOUNCEMENTS_MAHARASHTRA: GovAnnouncementItem\[\] = \[[\s\S]*?\];\s*$/, `${newAnnouncements}\n`);

fs.writeFileSync(cropReliefPath, content);
console.log("Successfully updated src/data/cropRelief.ts with 2026 Kharif data, 12 statutory measures, and updated announcements!");
