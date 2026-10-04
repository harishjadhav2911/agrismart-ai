// Verified Government Schemes Data for Indian Farmers
// Sourced and verified from official Central (GoI) and State Government portals.
// Full multilingual localization supporting Marathi (MR), Hindi (HI), and English (EN).

export interface LocalizedSchemeContent {
  name: string;
  shortDescription: string;
  category: string;
  ministry: string;
  launchDate: string;
  applicationOpeningDate: string;
  applicationDeadline: string;
  status: string;
  lastVerified: string;
  benefits: string[];
  eligibility: string[];
  documents: string[];
  process: string;
}

export interface Scheme {
  id: string;
  website: string;
  statusType: "Active" | "Upcoming" | "Deadline Passed";
  categoryType: "Financial" | "Insurance" | "Infrastructure" | "Technology" | "Soil Health" | "Solar & Energy";
  stateTags: string[];
  en: LocalizedSchemeContent;
  mr: LocalizedSchemeContent;
  hi: LocalizedSchemeContent;
}

export const rawSchemesData: Scheme[] = [
  // ==========================================
  // 1. PM-KISAN
  // ==========================================
  {
    id: "pm-kisan",
    website: "https://pmkisan.gov.in/",
    statusType: "Active",
    categoryType: "Financial",
    stateTags: ["All", "Maharashtra", "Uttar Pradesh", "Madhya Pradesh", "Bihar", "Rajasthan", "Punjab"],
    en: {
      name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
      shortDescription: "Direct income support of ₹6,000 per year transferred into bank accounts of all landholding farmer families across India.",
      category: "Financial Support",
      ministry: "Ministry of Agriculture & Farmers Welfare, Government of India",
      launchDate: "24 February 2019 (Effective 1 Dec 2018)",
      applicationOpeningDate: "Continuous / Open round the year",
      applicationDeadline: "Ongoing (No cutoff deadline)",
      status: "Active",
      lastVerified: "29 August 2026",
      benefits: [
        "₹6,000 per year transferred directly to bank accounts via Direct Benefit Transfer (DBT)",
        "Disbursed in three equal installments of ₹2,000 every 4 months (April-July, Aug-Nov, Dec-March)",
        "100% centrally funded scheme with zero deduction or intermediary fees"
      ],
      eligibility: [
        "All landholding farmer families who own cultivable land in their names",
        "Farmer must complete Aadhaar-based e-KYC on the PM-KISAN portal or CSC",
        "Bank account must be linked with Aadhaar and enabled for NPCI DBT payments",
        "Exclusions: Institutional landholders, income-tax payers, constitutional post holders, serving/retired government employees, and pensioners with monthly pension ≥ ₹10,000"
      ],
      documents: [
        "Aadhaar Card",
        "Land Record (7/12 extract / Khasra-Khatauni / RoR)",
        "Aadhaar-seeded Bank Account Passbook",
        "Aadhaar-linked Mobile Number"
      ],
      process: "Farmers can register directly online through the 'Farmer Corner' on pmkisan.gov.in or visit their nearest Common Service Centre (CSC) or Village Agriculture Officer."
    },
    mr: {
      name: "प्रधानमंत्री किसान सन्मान निधी (PM-KISAN)",
      shortDescription: "शेतजमीनधारक शेतकरी कुटुंबांना दरवर्षी ₹६,००० चे थेट बँक खात्यात आर्थिक साहाय्य.",
      category: "आर्थिक सहाय्य",
      ministry: "कृषी व शेतकरी कल्याण मंत्रालय, भारत सरकार",
      launchDate: "२४ फेब्रुवारी २०१९ (१ डिसेंबर २०१८ पासून लागू)",
      applicationOpeningDate: "वर्षभर अविरतपणे सुरू",
      applicationDeadline: "सुरू आहे (अंतिम मुदत नाही)",
      status: "सुरू आहे (Active)",
      lastVerified: "२९ ऑगस्ट २०२६",
      benefits: [
        "डीबीटी (DBT) द्वारे बँक खात्यात थेट प्रतिवर्ष ₹६,००० जमा",
        "दर ४ महिन्यांनी प्रत्येकी ₹२,००० चे तीन समान हप्ते (एप्रिल-जुलै, ऑगस्ट-नोव्हेंबर, डिसेंबर-मार्च)",
        "कोणताही मध्यस्थ किंवा दलालीशिवाय थेट १००% केंद्रीय अनुदान"
      ],
      eligibility: [
        "स्वतःच्या नावावर शेतजमीन असलेली सर्व पात्र शेतकरी कुटुंबे",
        "शेतकऱ्याचे आधार ई-केवायसी (e-KYC) पूर्ण असणे बंधनकारक",
        "बँक खाते आधारशी संलग्न (Aadhaar Seeded) व डीबीटी सक्षम असणे आवश्यक",
        "अपवाद: संस्थात्मक जमीनधारक, आयकर भरणारे, संविधानिक पदधारक, शासकीय नोकरदार आणि ₹१०,००० पेक्षा जास्त निवृत्तीवेतन घेणारे"
      ],
      documents: [
        "आधार कार्ड",
        "७/१२ उतारा व ८-अ खाते उतारा",
        "आधार लिंक असलेले बँक पासबुक",
        "आधारशी जोडलेला मोबाईल क्रमांक"
      ],
      process: "शेतकरी pmkisan.gov.in या संकेतस्थळावर 'Farmer Corner' मधून थेट नोंदणी करू शकतात किंवा गावातील आपले सरकार सेवा केंद्र (CSC) / कृषी सहाय्यकांशी संपर्क साधू शकतात."
    },
    hi: {
      name: "प्रधानमंत्री किसान सम्मान निधि (PM-KISAN)",
      shortDescription: "सभी भूमिधारक किसान परिवारों के बैंक खातों में प्रति वर्ष ₹6,000 की प्रत्यक्ष आय सहायता।",
      category: "वित्तीय सहायता",
      ministry: "कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार",
      launchDate: "24 फरवरी 2019 (1 दिसंबर 2018 से प्रभावी)",
      applicationOpeningDate: "वर्ष भर निरंतर खुला",
      applicationDeadline: "जारी है (कोई अंतिम तिथि नहीं)",
      status: "सक्रिय (Active)",
      lastVerified: "29 अगस्त 2026",
      benefits: [
        "डीबीटी (DBT) के माध्यम से बैंक खातों में सीधे ₹6,000 प्रति वर्ष हस्तांतरित",
        "प्रत्येक 4 माह में ₹2,000 की तीन समान किस्तों में भुगतान",
        "शून्य कटौती और बिना किसी बिचौलिए के शत-प्रतिशत केंद्र प्रायोजित योजना"
      ],
      eligibility: [
        "सभी भूमिधारक किसान परिवार जिनके नाम पर कृषि योग्य भूमि है",
        "पीएम-किसान पोर्टल या सीएससी पर आधार आधारित ई-केवाईसी अनिवार्य",
        "बैंक खाता आधार से जुड़ा और एनपीसीआई डीबीटी सक्षम होना चाहिए",
        "अपवाद: संस्थागत भूमिधारक, आयकर दाता, संवैधानिक पदधारक और ₹10,000 से अधिक मासिक पेंशनभोगी"
      ],
      documents: [
        "आधार कार्ड",
        "भूमि स्वामित्व दस्तावेज (खसरा/खतौनी)",
        "आधार-लिंक्ड बैंक पासबुक",
        "सक्रिय मोबाइल नंबर"
      ],
      process: "किसान pmkisan.gov.in पर 'Farmer Corner' के माध्यम से ऑनलाइन पंजीकरण कर सकते हैं या निकटतम सीएससी केंद्र / कृषि अधिकारी से संपर्क कर सकते हैं।"
    }
  },

  // ==========================================
  // 2. PMFBY (Crop Insurance)
  // ==========================================
  {
    id: "pmfby",
    website: "https://pmfby.gov.in/",
    statusType: "Active",
    categoryType: "Insurance",
    stateTags: ["All", "Maharashtra", "Madhya Pradesh", "Rajasthan", "Uttar Pradesh", "Odisha", "Haryana"],
    en: {
      name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
      shortDescription: "Comprehensive crop insurance providing financial protection against yield loss, natural calamities, pests, and post-harvest damages.",
      category: "Crop Insurance",
      ministry: "Ministry of Agriculture & Farmers Welfare, Government of India",
      launchDate: "18 February 2016",
      applicationOpeningDate: "Seasonal (Kharif: April-May | Rabi: October-November)",
      applicationDeadline: "Kharif: 31 July | Rabi: 31 December (or as notified by State Govt)",
      status: "Active",
      lastVerified: "29 August 2026",
      benefits: [
        "Extremely low farmer premium rates: Maximum 2.0% for Kharif crops, 1.5% for Rabi foodgrains/oilseeds, and 5.0% for annual commercial/horticultural crops",
        "Remaining actuarial premium is subsidized 50:50 by Central and State Governments",
        "Covers prevented sowing, mid-season adversity, localized risks (hailstorm, landslide, inundation), and post-harvest losses up to 14 days",
        "No upper capping on government subsidy or claim payout"
      ],
      eligibility: [
        "All farmers growing notified crops in notified areas as declared by the State Government",
        "Open to both loanee and non-loanee farmers, owner cultivators, sharecroppers, and tenant farmers"
      ],
      documents: [
        "Aadhaar Card",
        "Land Record (7/12 extract, Khasra, or registered Tenancy Agreement)",
        "Bank Account details (Passbook copy / cancelled cheque)",
        "Sowing Certificate / Crop Sowing Self-Declaration"
      ],
      process: "Apply online at pmfby.gov.in, via nationalized/cooperative banks, through the Crop Insurance Mobile App, or at local CSC centers before the state-notified season cutoff date."
    },
    mr: {
      name: "प्रधानमंत्री पीक विमा योजना (PMFBY)",
      shortDescription: "नैसर्गिक आपत्ती, दुष्काळ, कीड-रोग आणि काढणीनंतरच्या नुकसानीपासून सर्वसमावेशक पीक विमा संरक्षण.",
      category: "पीक विमा",
      ministry: "कृषी व शेतकरी कल्याण मंत्रालय, भारत सरकार",
      launchDate: "१८ फेब्रुवारी २०१६",
      applicationOpeningDate: "हंगामनिहाय (खरीप: एप्रिल-मे | रब्बी: ऑक्टोबर-नोव्हेंबर)",
      applicationDeadline: "खरीप: ३१ जुलै | रब्बी: ३१ डिसेंबर (किंवा राज्य शासनाच्या अधिसूचनेनुसार)",
      status: "सुरू आहे (Active)",
      lastVerified: "२९ ऑगस्ट २०२६",
      benefits: [
        "अत्यल्प शेतकरी हप्ता: खरीप पिकांसाठी जास्तीत जास्त २%, रब्बीसाठी १.५% आणि बागायती/व्यापारी पिकांसाठी ५% (महाराष्ट्रात ₹१ मध्ये पीक विमा योजना लागू)",
        "उर्वरित सर्व विमा हप्ता केंद्र व राज्य सरकारकडून भरला जातो",
        "पेरणी न होणे, दुष्काळ, अतिवृष्टी, गारपीट, पुराचे पाणी साचणे व काढणीनंतर १४ दिवसांपर्यंतच्या नुकसानीस संपूर्ण भरपाई",
        "विमा दाव्याच्या रकमेवर कोणतीही कमाल मर्यादा नाही"
      ],
      eligibility: [
        "अधिसुचित क्षेत्रात अधिसुचित पिके घेणारे सर्व शेतकरी (कर्जदार व बिगर-कर्जदार)",
        "जमीन मालक शेतकरी, कुळ शेतकरी आणि भाडेतत्त्वावर शेती करणारे शेतकरी पात्र"
      ],
      documents: [
        "आधार कार्ड",
        "७/१२ उतारा व ८-अ उतारा (किंवा भाडेकरार पत्र)",
        "बँक पासबुक झेरॉक्स (IFSC कोडसह)",
        "पीक पेरा स्वयंघोषणापत्र / तलाठी पीक नोंद"
      ],
      process: "pmfby.gov.in पोर्टलवर, महाडीबीटी (MahaDBT) वर, आपल्या बँकेत, किंवा गावातील सीएससी (CSC) केंद्रावर जाऊन विहित मुदतीपूर्वी विमा अर्ज भरावा."
    },
    hi: {
      name: "प्रधानमंत्री फसल बीमा योजना (PMFBY)",
      shortDescription: "प्राकृतिक आपदाओं, कीटों और कटाई उपरांत नुकसान से फसलों को संपूर्ण वित्तीय सुरक्षा कवच।",
      category: "फसल बीमा",
      ministry: "कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार",
      launchDate: "18 फरवरी 2016",
      applicationOpeningDate: "मौसमी (खरीफ: अप्रैल-मई | रबी: अक्टूबर-नवंबर)",
      applicationDeadline: "खरीफ: 31 जुलाई | रबी: 31 दिसंबर (अथवा राज्य अधिसूचना अनुसार)",
      status: "सक्रिय (Active)",
      lastVerified: "29 अगस्त 2026",
      benefits: [
        "बेहद कम प्रीमियम: खरीफ फसलों के लिए मात्र 2%, रबी के लिए 1.5% और वाणिज्यिक फसलों के लिए 5%",
        "शेष संपूर्ण प्रीमियम का भुगतान केंद्र और राज्य सरकार द्वारा वहन",
        "बुआई न हो पाना, सूखा, बाढ़, ओलावृष्टि और फसल कटाई के 14 दिन बाद तक के नुकसान पर पूर्ण दावा",
        "सरकारी सब्सिडी या क्लेम राशि पर कोई ऊपरी सीमा नहीं"
      ],
      eligibility: [
        "अधिसूचित क्षेत्रों में अधिसूचित फसल उगाने वाले सभी किसान (ऋणी व गैर-ऋणी)",
        "भूमि स्वामी, बटाईदार और काश्तकार किसान पात्र हैं"
      ],
      documents: [
        "आधार कार्ड",
        "भूमि दस्तावेज (खसरा/खतौनी)",
        "बैंक पासबुक की प्रति",
        "फसल बुआई प्रमाण पत्र / स्व-घोषणा"
      ],
      process: "pmfby.gov.in पोर्टल, बैंक शाखा, सीएससी केंद्र अथवा क्रॉप इंश्योरेंस मोबाइल ऐप के जरिए समयसीमा से पूर्व आवेदन करें।"
    }
  },

  // ==========================================
  // 3. KCC (Kisan Credit Card)
  // ==========================================
  {
    id: "kcc",
    website: "https://agricoop.gov.in/",
    statusType: "Active",
    categoryType: "Financial",
    stateTags: ["All", "Maharashtra", "Punjab", "Haryana", "Andhra Pradesh", "Karnataka", "Tamil Nadu"],
    en: {
      name: "Kisan Credit Card (KCC) Scheme",
      shortDescription: "Institutional short-term crop credit and term loans at an effective subsidized interest rate of 4% per annum.",
      category: "Agricultural Credit",
      ministry: "Department of Agriculture & Farmers Welfare / Ministry of Finance / RBI & NABARD",
      launchDate: "August 1998 (Revamped & simplified in Feb 2019)",
      applicationOpeningDate: "Continuous / Open round the year",
      applicationDeadline: "Ongoing (Continuous access)",
      status: "Active",
      lastVerified: "29 August 2026",
      benefits: [
        "Short-term crop production loan limit up to ₹3,00,000 at a concessional interest rate of 7% per annum",
        "3% Prompt Repayment Incentive (PRI) for timely repayment, reducing the effective interest rate to 4% per annum",
        "Collateral-free agricultural loan limit up to ₹1,60,000 (extended to ₹2,00,000 under tie-ups)",
        "Includes working capital coverage for animal husbandry, dairy, and fisheries"
      ],
      eligibility: [
        "All individual or joint owner cultivators",
        "Tenant farmers, oral lessees, and sharecroppers",
        "Self Help Groups (SHGs) and Joint Liability Groups (JLGs) of farmers engaged in agriculture and allied activities"
      ],
      documents: [
        "Simplified 1-page KCC Application Form",
        "Identity and Address Proof (Aadhaar Card, Voter ID, PAN Card)",
        "Land Ownership Documents (7/12, 8-A extract, Khasra/Khatauni) or Tenancy Declaration",
        "Passport size photographs"
      ],
      process: "Download the simplified one-page KCC application form from pmkisan.gov.in or apply at any Commercial Bank, Regional Rural Bank (RRB), or Cooperative Bank branch."
    },
    mr: {
      name: "किसान क्रेडिट कार्ड योजना (KCC)",
      shortDescription: "शेतकऱ्यांना अवघ्या ४% सवलतीच्या व्याजदराने वेळेवर पीक कर्ज आणि खेळते भांडवल उपलब्ध करून देणारी योजना.",
      category: "पीक कर्ज व वित्त",
      ministry: "कृषी विभाग / वित्त मंत्रालय / नाबार्ड व रिझर्व्ह बँक ऑफ इंडिया",
      launchDate: "ऑगस्ट १९९८ (फेब्रुवारी २०१९ मध्ये सुलभ व पुनर्रचित)",
      applicationOpeningDate: "वर्षभर अविरतपणे सुरू",
      applicationDeadline: "सुरू आहे (निरंतर प्रक्रिया)",
      status: "सुरू आहे (Active)",
      lastVerified: "२९ ऑगस्ट २०२६",
      benefits: [
        "₹३,००,००० पर्यंतचे पीक कर्ज ७% सवलतीच्या दराने, वेळेवर परतफेडीवर ३% व्याज परतावा मिळून निव्वळ ४% व्याजदर",
        "₹१,६०,००० पर्यंतच्या पीक कर्जासाठी कोणतीही तारण किंवा जमीन गहाण ठेवण्याची गरज नाही",
        "लवचिक परतफेड सुविधा (पिकांच्या काढणी व विक्री हंगामानुसार)",
        "पशुसंवर्धन, दुग्धव्यवसाय आणि मत्स्यपालनासाठीही खेळत्या भांडवलाची सोय"
      ],
      eligibility: [
        "सर्व वैयक्तिक व संयुक्त शेतजमीन मालक शेतकरी",
        "भाडेतत्त्वावर शेती करणारे, कुळ शेतकरी व वाटणीदार",
        "शेतकऱ्यांचे बचत गट (SHGs) आणि संयुक्त दायित्व गट (JLGs)"
      ],
      documents: [
        "१ पानी सुलभ केसीसी (KCC) अर्ज",
        "आधार कार्ड, पॅन कार्ड किंवा मतदान ओळखपत्र",
        "७/१२, ८-अ चालू उतारा व फेरफार नोंद",
        "२ पासपोर्ट आकाराचे फोटो"
      ],
      process: "pmkisan.gov.in वरून १ पानी केसीसी फॉर्म डाऊनलोड करून किंवा नजीकच्या राष्ट्रीयीकृत बँक, जिल्हा मध्यवर्ती सहकारी बँक (DCCB) किंवा ग्रामीण बँकेत अर्ज सादर करावा."
    },
    hi: {
      name: "किसान क्रेडिट कार्ड योजना (KCC)",
      shortDescription: "मात्र 4% की प्रभावी रियायती ब्याज दर पर किसानों को समय पर संस्थागत अल्पावधि फसल ऋण।",
      category: "कृषि ऋण",
      ministry: "कृषि एवं किसान कल्याण विभाग / वित्त मंत्रालय / नाबार्ड",
      launchDate: "अगस्त 1998 (फरवरी 2019 में सरलीकृत)",
      applicationOpeningDate: "वर्ष भर निरंतर उपलब्ध",
      applicationDeadline: "जारी है (सतत सुविधा)",
      status: "सक्रिय (Active)",
      lastVerified: "29 अगस्त 2026",
      benefits: [
        "₹3,00,000 तक का अल्पावधि फसल ऋण 7% ब्याज पर, समय पर भुगतान पर 3% छूट सहित मात्र 4% प्रभावी ब्याज",
        "₹1,60,000 तक का कृषि ऋण बिना किसी बंधक या गारंटी (Collateral-Free) के उपलब्ध",
        "फसल कटाई और बिक्री चक्र के अनुरूप आसान पुनर्भुगतान",
        "डेयरी, पशुपालन और मत्स्य पालन के लिए भी कार्यशील पूंजी ऋण की सुविधा"
      ],
      eligibility: [
        "सभी व्यक्तिगत अथवा संयुक्त भूमि स्वामी किसान",
        "काश्तकार, बटाईदार और मौखिक पट्टेदार किसान",
        "किसानों के स्वयं सहायता समूह (SHG) एवं संयुक्त देयता समूह (JLG)"
      ],
      documents: [
        "सरल 1-पृष्ठीय केसीसी आवेदन पत्र",
        "पहचान एवं निवास प्रमाण (आधार कार्ड / वोटर आईडी / पैन)",
        "भूमि स्वामित्व दस्तावेज (खसरा-खतौनी)",
        "पासपोर्ट साइज फोटो"
      ],
      process: "pmkisan.gov.in से 1-पेज का केसीसी फॉर्म डाउनलोड कर अथवा नजदीकी वाणिज्यिक, ग्रामीण या सहकारी बैंक शाखा में जमा करें।"
    }
  },

  // ==========================================
  // 4. Namo Shetkari Yojana (Maharashtra)
  // ==========================================
  {
    id: "namo-shetkari",
    website: "https://mahadbt.maharashtra.gov.in/",
    statusType: "Active",
    categoryType: "Financial",
    stateTags: ["Maharashtra"],
    en: {
      name: "Namo Shetkari Mahasanman Nidhi Yojana",
      shortDescription: "Maharashtra State Government grant of ₹6,000 per year transferred directly to farmers in addition to the Central PM-KISAN scheme.",
      category: "State Financial Grant",
      ministry: "Department of Agriculture, Government of Maharashtra",
      launchDate: "29 May 2023",
      applicationOpeningDate: "Automatic enrollment for PM-KISAN registered farmers",
      applicationDeadline: "Ongoing (Tied to PM-KISAN disbursement cycle)",
      status: "Active",
      lastVerified: "29 August 2026",
      benefits: [
        "State financial assistance of ₹6,000 per year disbursed in 3 equal installments of ₹2,000 each",
        "Combined with Central PM-KISAN (₹6,000), eligible farmers in Maharashtra receive a total of ₹12,000 per year",
        "Direct Benefit Transfer (DBT) into Aadhaar-linked bank accounts with zero paperwork for existing PM-KISAN beneficiaries"
      ],
      eligibility: [
        "Landholding farmers in the State of Maharashtra",
        "Must be an active, verified beneficiary of the Central PM-KISAN scheme with approved e-KYC and land seeding status"
      ],
      documents: [
        "PM-KISAN Registration ID / Aadhaar Number",
        "7/12 and 8-A Land Record Extract (Maharashtra)",
        "Aadhaar-seeded Bank Account in Maharashtra"
      ],
      process: "Existing PM-KISAN approved beneficiaries in Maharashtra are automatically enrolled. New applicants should register on the MahaDBT portal (mahadbt.maharashtra.gov.in) or PM-KISAN."
    },
    mr: {
      name: "नमो शेतकरी महासन्मान निधी योजना",
      shortDescription: "महाराष्ट्र शासनाचा दरवर्षी ₹६,००० चा थेट निधी — केंद्र शासनाच्या ₹६,००० सह एकूण ₹१२,००० वार्षिक लाभ.",
      category: "राज्य आर्थिक अनुदान",
      ministry: "कृषी विभाग, महाराष्ट्र शासन",
      launchDate: "२९ मे २०२३",
      applicationOpeningDate: "पीएम-किसान पात्र शेतकऱ्यांसाठी आपोआप नोंदणी",
      applicationDeadline: "सुरू आहे (पीएम-किसान हप्त्यांशी संलग्न)",
      status: "सुरू आहे (Active)",
      lastVerified: "२९ ऑगस्ट २०२६",
      benefits: [
        "महाराष्ट्र शासनाकडून दरवर्षी ₹६,००० चे अतिरिक्त आर्थिक साहाय्य (प्रत्येकी ₹२,००० चे तीन हप्ते)",
        "केंद्रीय पीएम-किसान (₹६,०००) + नमो शेतकरी (₹६,०००) = महाराष्ट्रातील शेतकऱ्यांना एकूण ₹१२,००० प्रतिवर्ष",
        "थेट आधार संलग्न बँक खात्यात (DBT) जमा, कोणत्याही अतिरिक्त अर्जाची आवश्यकता नाही"
      ],
      eligibility: [
        "महाराष्ट्रातील शेतजमीनधारक शेतकरी कुटुंब",
        "केंद्रीय पीएम-किसान योजनेचा मान्यताप्राप्त व ई-केवायसी पूर्ण असलेला शेतकरी असणे आवश्यक"
      ],
      documents: [
        "पीएम-किसान नोंदणी क्रमांक / आधार क्रमांक",
        "महाराष्ट्रातील चालू ७/१२ व ८-अ उतारा",
        "आधार संलग्न बँक खाते"
      ],
      process: "पीएम-किसान योजनेत पात्र असलेल्या महाराष्ट्रातील सर्व शेतकऱ्यांना हा लाभ थेट मिळतो. नवीन शेतकऱ्यांनी महाडीबीटी (mahadbt.maharashtra.gov.in) किंवा पीएम-किसानवर नोंदणी करावी."
    },
    hi: {
      name: "नमो शेतकरी महासम्मान निधि योजना",
      shortDescription: "महाराष्ट्र सरकार द्वारा ₹6,000 प्रति वर्ष की अतिरिक्त सहायता — कुल ₹12,000 का वार्षिक लाभ।",
      category: "राज्य वित्तीय अनुदान",
      ministry: "कृषि विभाग, महाराष्ट्र शासन",
      launchDate: "29 मई 2023",
      applicationOpeningDate: "पीएम-किसान पंजीकृत किसानों का स्वतः नामांकन",
      applicationDeadline: "जारी है (पीएम-किसान किस्त चक्र से संबद्ध)",
      status: "सक्रिय (Active)",
      lastVerified: "29 अगस्त 2026",
      benefits: [
        "महाराष्ट्र राज्य सरकार द्वारा ₹6,000 प्रति वर्ष (₹2,000 की 3 किस्तें) का प्रत्यक्ष लाभ",
        "केंद्र के ₹6,000 + राज्य के ₹6,000 = कुल ₹12,000 प्रति वर्ष बैंक खाते में",
        "डीबीटी के माध्यम से सीधे आधार-लिंक्ड खाते में भुगतान"
      ],
      eligibility: [
        "महाराष्ट्र राज्य के भूमिधारक किसान परिवार",
        "केंद्रीय पीएम-किसान योजना में ई-केवाईसी और लैंड सीडिंग सत्यापित होना अनिवार्य"
      ],
      documents: [
        "पीएम-किसान पंजीकरण संख्या / आधार नंबर",
        "7/12 और 8-ए खतौनी (महाराष्ट्र)",
        "आधार-सीडेड बैंक खाता"
      ],
      process: "पीएम-किसान के पात्र लाभार्थियों को स्वतः लाभ मिलता है। नए किसान महाडीबीटी पोर्टल (mahadbt.maharashtra.gov.in) पर पंजीकरण कर सकते हैं।"
    }
  },

  // ==========================================
  // 5. PMKSY - Per Drop More Crop (Micro Irrigation)
  // ==========================================
  {
    id: "pmksy-pdmc",
    website: "https://pmksy.gov.in/",
    statusType: "Active",
    categoryType: "Infrastructure",
    stateTags: ["All", "Maharashtra", "Gujarat", "Karnataka", "Andhra Pradesh", "Tamil Nadu", "Rajasthan"],
    en: {
      name: "PMKSY - Per Drop More Crop (Micro Irrigation)",
      shortDescription: "Up to 55% capital subsidy for installing water-saving Drip and Sprinkler irrigation systems to maximize water use efficiency.",
      category: "Irrigation Infrastructure",
      ministry: "Ministry of Agriculture & Farmers Welfare, Government of India",
      launchDate: "1 July 2015",
      applicationOpeningDate: "Annual State Budget Cycles (Continuous registration on state DBT portals)",
      applicationDeadline: "Ongoing (Subject to district-level quota allocations)",
      status: "Active",
      lastVerified: "29 August 2026",
      benefits: [
        "55% financial subsidy for Small and Marginal Farmers (landholding up to 2 hectares)",
        "45% financial subsidy for Other category farmers",
        "Saves 40% to 60% irrigation water while boosting crop yields by 20% to 35%",
        "Subsidies directly credited to beneficiary or approved manufacturer upon geo-tagged field verification"
      ],
      eligibility: [
        "Farmers owning agricultural land with an assured water source (borewell, open well, farm pond, or canal)",
        "Members of cooperative farming societies, FPOs, and SHGs",
        "Cultivators with long-term registered land lease (minimum 7 to 10 years)"
      ],
      documents: [
        "Aadhaar Card",
        "Land Ownership Documents (7/12 extract, 8-A certificate or Khasra)",
        "Water source self-declaration / electricity connection proof",
        "Bank Account details",
        "Quotation / Design layout from empaneled micro-irrigation system manufacturer"
      ],
      process: "Apply online through State Agriculture/Horticulture DBT portals (e.g. MahaDBT in Maharashtra, e-Uparjan in MP) or through the District Agriculture Officer (DAO)."
    },
    mr: {
      name: "प्रधानमंत्री कृषी सिंचन योजना - प्रति थेंब अधिक पीक (सूक्ष्म सिंचन)",
      shortDescription: "ठिबक व तुषार सिंचन संच बसवण्यासाठी लहान व अल्पभूधारक शेतकऱ्यांना ५५% पर्यंत थेट सरकारी अनुदान.",
      category: "सिंचन पायाभूत सुविधा",
      ministry: "कृषी व शेतकरी कल्याण मंत्रालय, भारत सरकार व राज्य कृषी विभाग",
      launchDate: "१ जुलै २०१५",
      applicationOpeningDate: "राज्य महाडीबीटी पोर्टलवर वर्षभर अर्ज सुरू",
      applicationDeadline: "सुरू आहे (जिल्हास्तरीय उद्दिष्टानुसार वाटप)",
      status: "सुरू आहे (Active)",
      lastVerified: "२९ ऑगस्ट २०२६",
      benefits: [
        "लहान व अल्पभूधारक शेतकऱ्यांना (२ हेक्टरपर्यंत) ५५% थेट सरकारी अनुदान",
        "इतर (मोठ्या) शेतकऱ्यांना ४५% आर्थिक अनुदान",
        "४०% ते ६०% पाण्याची बचत आणि पिकांच्या उत्पादनात २०% ते ३५% भरघोस वाढ",
        "जीपीएस (GPS) जिओ-टॅगिंग पडताळणीनंतर थेट बँक खात्यात अनुदान जमा"
      ],
      eligibility: [
        "स्वतःची शेतजमीन आणि पाण्याची निश्चित सोय (विहीर, कूपनलिका, शेततळे किंवा कालवा) असणारे शेतकरी",
        "शेतकरी उत्पादक कंपन्या (FPO), सहकारी संस्था व बचत गट पात्र"
      ],
      documents: [
        "आधार कार्ड",
        "चालू ७/१२ आणि ८-अ उतारा",
        "पाण्याचा स्रोत दाखवणारा पुरावा / वीज बिल",
        "बँक पासबुक झेरॉक्स",
        "मान्यताप्राप्त कंपनीचे सूक्ष्म सिंचन कोटेशन व आराखडा"
      ],
      process: "महाराष्ट्रात mahadbt.maharashtra.gov.in (महाडीबीटी) वर 'शेतकरी योजना' अंतर्गत सूक्ष्म सिंचनासाठी ऑनलाईन अर्ज करावा."
    },
    hi: {
      name: "पीएम कृषि सिंचाई योजना - प्रति बूंद अधिक फसल (सूक्ष्म सिंचाई)",
      shortDescription: "ड्रिप एवं स्प्रिंकलर सिंचाई प्रणाली की स्थापना पर छोटे और सीमांत किसानों को 55% तक का सरकारी अनुदान।",
      category: "सिंचाई अवसंरचना",
      ministry: "कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार",
      launchDate: "1 जुलाई 2015",
      applicationOpeningDate: "राज्य डीबीटी पोर्टलों पर वार्षिक निरंतर आवेदन",
      applicationDeadline: "जारी है (जिलावार लक्ष्य आवंटन)",
      status: "सक्रिय (Active)",
      lastVerified: "29 अगस्त 2026",
      benefits: [
        "लघु एवं सीमांत किसानों (2 हेक्टेयर तक) को 55% पूंजीगत सब्सिडी",
        "अन्य सामान्य श्रेणी के किसानों को 45% वित्तीय सहायता",
        "40% से 60% जल की बचत के साथ पैदावार में 25% से 35% की वृद्धि",
        "भौतिक एवं जियो-टैग्ड सत्यापन के बाद सब्सिडी सीधे बैंक खाते में"
      ],
      eligibility: [
        "कृषि भूमि के स्वामी किसान जिनके पास निश्चित जल स्रोत (कुआं/बोरवेल/तालाब) हो",
        "एफपीओ, स्वयं सहायता समूह और सहकारी समितियां"
      ],
      documents: [
        "आधार कार्ड",
        "भूमि दस्तावेज (खसरा/खतौनी)",
        "जल स्रोत का प्रमाण पत्र / बिजली बिल",
        "बैंक पासबुक",
        "अधिकृत कंपनी का कोटेशन"
      ],
      process: "राज्य कृषि विभाग के डीबीटी पोर्टल (जैसे MahaDBT, UP Agriculture) के माध्यम से ऑनलाइन आवेदन प्रस्तुत करें।"
    }
  },

  // ==========================================
  // 6. PM-KUSUM (Solar Pumps)
  // ==========================================
  {
    id: "pm-kusum",
    website: "https://pmkusum.mnre.gov.in/",
    statusType: "Active",
    categoryType: "Solar & Energy",
    stateTags: ["All", "Maharashtra", "Rajasthan", "Madhya Pradesh", "Haryana", "Gujarat", "Uttar Pradesh"],
    en: {
      name: "PM-KUSUM (Solar Agriculture Pumps)",
      shortDescription: "Up to 60% subsidy for installing standalone off-grid Solar Agricultural Pumps and solarizing existing grid-connected pumps.",
      category: "Renewable Energy",
      ministry: "Ministry of New and Renewable Energy (MNRE), Government of India",
      launchDate: "8 March 2019 (Extended up to March 2026/2027)",
      applicationOpeningDate: "State Nodal Agency allocation windows",
      applicationDeadline: "Ongoing (State-wise allotment quotas)",
      status: "Active",
      lastVerified: "29 August 2026",
      benefits: [
        "Up to 60% total subsidy (30% Central Government grant + 30% State Government subsidy)",
        "Farmer contribution is only 10% of total cost, with remaining 30% available through bank loans",
        "Assured daytime irrigation without dependency on diesel generators or night-time erratic grid electricity",
        "Component C allows selling surplus solar power back to DISCOMs for additional farm income"
      ],
      eligibility: [
        "Individual farmers, Water User Associations (WUAs), FPOs, and Primary Agricultural Credit Societies (PACS)",
        "For Component B (Standalone Pumps): Farmers with no existing electric grid agricultural connection",
        "Land ownership with an adequate underground or surface water source"
      ],
      documents: [
        "Aadhaar Card",
        "7/12 and 8-A Land Extract (or Khasra/Khatauni)",
        "No-Electricity-Connection NOC / Certificate from local electricity board (for standalone solar pumps)",
        "Bank Account Passbook",
        "Passport size photograph"
      ],
      process: "Apply through official State Renewable Energy Development Agency portals (e.g., Mahadiscom Solar Kusum Portal in Maharashtra, RRECL in Rajasthan, UPNEDA in UP)."
    },
    mr: {
      name: "पीएम-कुसुम सौर कृषी पंप योजना (PM-KUSUM)",
      shortDescription: "शेतकऱ्यांसाठी सौर कृषी पंप बसवण्यासाठी ६०% पर्यंत सरकारी अनुदान — दिवसा भरवशाचे सिंचन आणि वीजबिलातून मुक्ती.",
      category: "सौर व ऊर्जा",
      ministry: "नवीन व नवीकरणीय ऊर्जा मंत्रालय (MNRE), भारत सरकार व महावितरण",
      launchDate: "८ मार्च २०१९ (मुदतवाढ २०२६/२०२७ पर्यंत)",
      applicationOpeningDate: "महावितरण व मेडा (MEDA) पोर्टलवर टप्प्याटप्प्याने अर्ज",
      applicationDeadline: "सुरू आहे (कोटा उपलब्धतेनुसार)",
      status: "सुरू आहे (Active)",
      lastVerified: "२९ ऑगस्ट २०२६",
      benefits: [
        "एकूण ६०% अनुदान (३०% केंद्र सरकार + ३०% राज्य सरकार)",
        "शेतकऱ्याला फक्त १०% रक्कम भरावी लागते (उर्वरित ३०% बँकेकडून कर्ज उपलब्ध)",
        "दिवसा अखंडित पाणीपुरवठा — रात्रीच्या वेळी शेतात पाणी देण्याच्या त्रासातून आणि विजेच्या लपंडावातून कायमची मुक्ती",
        "सौर पंपाची अतिरिक्त वीज महावितरणला विकून अतिरिक्त कमाईची संधी (घटक-क अंतर्गत)"
      ],
      eligibility: [
        "स्वतःची शेतजमीन आणि पाण्याची सोय असणारे शेतकरी",
        "घटक-ब साठी: ज्यांच्याकडे पारंपरिक कृषी वीज जोडणी नाही असे शेतकरी",
        "पाणी वापर संस्था (WUA), शेतकरी उत्पादक कंपन्या (FPO) पात्र"
      ],
      documents: [
        "आधार कार्ड",
        "७/१२ आणि ८-अ उतारा",
        "पारंपरिक वीज जोडणी नसल्याचे स्वयंघोषणापत्र",
        "बँक पासबुक",
        "पासपोर्ट आकाराचा फोटो"
      ],
      process: "महाराष्ट्रात महावितरणच्या अधिकृत कुसुम पोर्टलवर (mahadiscom.in/solar_kusum) किंवा महाऊर्जा (MEDA) संकेतस्थळावर ऑनलाईन अर्ज करावा."
    },
    hi: {
      name: "पीएम-कुसुम सौर कृषि पंप योजना (PM-KUSUM)",
      shortDescription: "सोलर कृषि पंप लगाने पर 60% तक भारी सब्सिडी — दिन के समय निर्बाध सिंचाई और बिजली बिल से आजादी।",
      category: "सौर एवं ऊर्जा",
      ministry: "नवीन एवं नवीकरणीय ऊर्जा मंत्रालय (MNRE), भारत सरकार",
      launchDate: "8 मार्च 2019 (2026/2027 तक विस्तारित)",
      applicationOpeningDate: "राज्य नोडल एजेंसियों द्वारा चरणबद्ध आवेदन",
      applicationDeadline: "जारी है (राज्यवार कोटा आवंटन)",
      status: "सक्रिय (Active)",
      lastVerified: "29 अगस्त 2026",
      benefits: [
        "कुल 60% तक सब्सिडी (30% केंद्र सरकार + 30% राज्य सरकार)",
        "किसान को मात्र 10% अंशदान देना होगा (शेष 30% बैंक ऋण संभव)",
        "दिन के समय सुनिश्चित और भरोसेमंद सिंचाई की सुविधा",
        "अतिरिक्त उत्पादित सौर ऊर्जा को ग्रिड में बेचकर अतिरिक्त आमदनी"
      ],
      eligibility: [
        "व्यक्तिगत किसान, जल उपभोक्ता संघ, एफपीओ और प्राथमिक कृषि ऋण समितियां",
        "घटक-बी के लिए: जहां ग्रिड बिजली कनेक्शन उपलब्ध नहीं है",
        "भूमि स्वामित्व और जल स्रोत होना अनिवार्य"
      ],
      documents: [
        "आधार कार्ड",
        "खसरा-खतौनी की प्रति",
        "बिजली कनेक्शन न होने का अनापत्ति प्रमाण पत्र",
        "बैंक पासबुक",
        "पासपोर्ट साइज फोटो"
      ],
      process: "राज्य की अधिकृत अक्षय ऊर्जा विकास एजेंसी (जैसे महाडिस्कॉम, यूपीनेडा, रेकल) के पोर्टल पर ऑनलाइन पंजीकरण करें।"
    }
  },

  // ==========================================
  // 7. Soil Health Card (SHC)
  // ==========================================
  {
    id: "shc",
    website: "https://soilhealth.dac.gov.in/",
    statusType: "Active",
    categoryType: "Soil Health",
    stateTags: ["All", "Maharashtra", "Gujarat", "Karnataka", "Tamil Nadu", "Uttar Pradesh", "Punjab"],
    en: {
      name: "Soil Health Card (SHC) Scheme",
      shortDescription: "Free diagnostic testing of farm soil and issuance of personalized soil health cards with precise 12-parameter nutrient recommendations.",
      category: "Soil Diagnostic Support",
      ministry: "Ministry of Agriculture & Farmers Welfare, Government of India",
      launchDate: "19 February 2015",
      applicationOpeningDate: "Continuous cycle (Every 2–3 years per village)",
      applicationDeadline: "Ongoing (Continuous village-level sampling cycles)",
      status: "Active",
      lastVerified: "29 August 2026",
      benefits: [
        "Free scientific testing of 12 chemical parameters: N, P, K (macro-nutrients), S (secondary), Zn, Fe, Cu, Mn, Bo (micro-nutrients), and pH, EC, OC (physical parameters)",
        "Customized crop-wise fertilizer dosage recommendations to prevent over-fertilization and save input costs",
        "Digital Soil Health Card accessible online and downloadable anytime"
      ],
      eligibility: [
        "All farmers across all states and Union Territories in India owning or cultivating agricultural land"
      ],
      documents: [
        "Aadhaar Card",
        "Farm Plot Number (Survey No. / Khasra No. / Gut No.)",
        "Active Mobile Number"
      ],
      process: "Soil samples are collected from farm plots by trained agricultural extension workers. Farmers can also submit soil samples directly at the nearest Krishi Vigyan Kendra (KVK) or district soil testing laboratory and download reports from soilhealth.dac.gov.in."
    },
    mr: {
      name: "मृदा आरोग्य पत्रिका योजना (Soil Health Card)",
      shortDescription: "शेतातील मातीची मोफत रासायनिक तपासणी आणि १२ घटकांवर आधारित खत व्यवस्थापनाचा अचूक सल्ला देणारी पत्रिका.",
      category: "माती आरोग्य व तपासणी",
      ministry: "कृषी व शेतकरी कल्याण मंत्रालय, भारत सरकार",
      launchDate: "१९ फेब्रुवारी २०१५",
      applicationOpeningDate: "प्रत्येक गावात दर २-३ वर्षांनी अविरत चक्रीय मोहीम",
      applicationDeadline: "सुरू आहे (निरंतर गावपातळीवर नमुने तपासणी)",
      status: "सुरू आहे (Active)",
      lastVerified: "२९ ऑगस्ट २०२६",
      benefits: [
        "१२ घटकांची मोफत प्रयोगशाळा तपासणी: नत्र (N), स्फुरद (P), पालाश (K), गंधक (S), जस्त (Zn), लोह (Fe), तांबे (Cu), मँगनीज (Mn), बोरॉन (Bo), सामू (pH), क्षारता (EC) आणि सेंद्रिय कर्ब (OC)",
        "पिकानिहाय संतुलित खतांची मात्रा शिफारस, ज्यामुळे खतांचा खर्च १५% ते २५% वाचतो",
        "ऑनलाईन डिजिटल सॉईल हेल्थ कार्ड डाऊनलोड करण्याची सोय"
      ],
      eligibility: [
        "महाराष्ट्रातील व देशभरातील शेतजमीन असणारे सर्व शेतकरी"
      ],
      documents: [
        "आधार कार्ड",
        "शेताचा गट क्रमांक / सर्व्हे नंबर",
        "मोबाईल क्रमांक"
      ],
      process: "कृषी विभागाच्या कर्मचाऱ्यांमार्फत शेतातून मातीचे नमुने गोळा केले जातात. शेतकरी स्वतःही जवळच्या कृषी विज्ञान केंद्र (KVK) किंवा माती परीक्षण प्रयोगशाळेत नमुना देऊन soilhealth.dac.gov.in वरून पत्रिका मिळवू शकतात."
    },
    hi: {
      name: "मृदा स्वास्थ्य कार्ड योजना (Soil Health Card)",
      shortDescription: "खेत की मिट्टी की निःशुल्क वैज्ञानिक जांच और 12 पोषक तत्वों के आधार पर संतुलित उर्वरक उपयोग की सिफारिश।",
      category: "मृदा स्वास्थ्य",
      ministry: "कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार",
      launchDate: "19 फरवरी 2015",
      applicationOpeningDate: "ग्राम स्तर पर हर 2-3 वर्ष में निरंतर चक्र",
      applicationDeadline: "जारी है (सतत मृदा नमूना परीक्षण)",
      status: "सक्रिय (Active)",
      lastVerified: "29 अगस्त 2026",
      benefits: [
        "12 मुख्य मापदंडों (N, P, K, S, Zn, Fe, Cu, Mn, B, pH, EC, OC) की निःशुल्क जांच",
        "फसलवार संतुलित खाद एवं उर्वरक का वैज्ञानिक परामर्श, जिससे खेती की लागत घटती है",
        "डिजिटल सॉइल हेल्थ कार्ड ऑनलाइन डाउनलोड करने की सुविधा"
      ],
      eligibility: [
        "देश भर के सभी कृषि भूमि धारक किसान"
      ],
      documents: [
        "आधार कार्ड",
        "खेत का खसरा नंबर",
        "मोबाइल नंबर"
      ],
      process: "कृषि प्रसार कार्यकर्ताओं द्वारा खेत से मिट्टी के नमूने एकत्र किए जाते हैं। किसान सीधे केवीके या जिला मिट्टी परीक्षण प्रयोगशाला में भी संपर्क कर सकते हैं।"
    }
  },

  // ==========================================
  // 8. e-NAM (National Agriculture Market)
  // ==========================================
  {
    id: "enam",
    website: "https://enam.gov.in/",
    statusType: "Active",
    categoryType: "Infrastructure",
    stateTags: ["All", "Maharashtra", "Madhya Pradesh", "Haryana", "Telangana", "Uttar Pradesh", "Gujarat", "Rajasthan"],
    en: {
      name: "National Agriculture Market (e-NAM)",
      shortDescription: "Pan-India electronic trading portal integrating 1,361+ wholesale APMC mandis to enable transparent online price discovery and nationwide selling.",
      category: "Agricultural Marketing",
      ministry: "Ministry of Agriculture & Farmers Welfare (Implemented by SFAC)",
      launchDate: "14 April 2016",
      applicationOpeningDate: "Continuous / Open round the year",
      applicationDeadline: "Ongoing (Continuous registration)",
      status: "Active",
      lastVerified: "29 August 2026",
      benefits: [
        "Access to pan-India electronic bidding and price discovery across 1,361+ connected APMC markets across 23 states/UTs",
        "Eliminates local mandi cartels and middleman commissions",
        "Scientific assaying and quality certification facilities at mandi gates",
        "Direct online payment into the farmer's bank account on the same day of trade"
      ],
      eligibility: [
        "Any farmer, Farmer Producer Organization (FPO), or authorized trader/buyer registered with a participating APMC mandi"
      ],
      documents: [
        "Aadhaar Card",
        "Bank Account Details (Passbook copy / Cancelled Cheque with IFSC)",
        "APMC Mandi Entry Gate Pass / Weighment Slip",
        "Mobile number for OTP verification"
      ],
      process: "Register as a farmer on the eNAM web portal (enam.gov.in), mobile app, or at the eNAM help desk situated at any connected APMC mandi yard."
    },
    mr: {
      name: "राष्ट्रीय कृषी बाजार (e-NAM)",
      shortDescription: "देशभरातील १,३६१+ कृषी उत्पन्न बाजार समित्यांना (APMC) जोडणारे ऑनलाईन इलेक्ट्रॉनिक ट्रेडिंग पोर्टल.",
      category: "बाजार व विपणन",
      ministry: "कृषी व शेतकरी कल्याण मंत्रालय (SFAC मार्फत अंमलबजावणी)",
      launchDate: "१४ एप्रिल २०१६",
      applicationOpeningDate: "वर्षभर अविरतपणे सुरू",
      applicationDeadline: "सुरू आहे (ऑनलाईन नोंदणी सुरू)",
      status: "सुरू आहे (Active)",
      lastVerified: "२९ ऑगस्ट २०२६",
      benefits: [
        "देशभरातील १,३६१ हून अधिक बाजार समित्यांमध्ये शेतीमालासाठी ऑनलाईन लिलाव आणि पारदर्शक स्पर्धात्मक दर",
        "स्थानिक दलाल व अडत्यांच्या मक्तेदारीतून शेतकऱ्यांची मुक्तता",
        "बाजार समिती गेटवर शेतीमालाची गुणवत्ता तपासणी (Assaying) सुविधा",
        "मालाच्या विक्रीचे पैसे थेट शेतकऱ्याच्या बँक खात्यात त्याच दिवशी ऑनलाईन जमा"
      ],
      eligibility: [
        "नोंदणीकृत बाजार समितीशी जोडलेले सर्व शेतकरी, शेतकरी उत्पादक कंपन्या (FPO) आणि व्यापारी"
      ],
      documents: [
        "आधार कार्ड",
        "बँक पासबुक झेरॉक्स किंवा कॅन्सल चेक (IFSC कोडसह)",
        "बाजार समिती आवक नोंद पावती / गेट पास",
        "मोबाईल नंबर"
      ],
      process: "enam.gov.in पोर्टलवर, e-NAM मोबाईल ॲपवरून किंवा नजीकच्या ई-नाम जोडणी असलेल्या कृषी उत्पन्न बाजार समिती (APMC) आवारात नोंदणी करावी."
    },
    hi: {
      name: "राष्ट्रीय कृषि बाजार (e-NAM)",
      shortDescription: "देश भर की 1,361+ थोक मंडियों को जोड़ने वाला एकीकृत ऑनलाइन इलेक्ट्रॉनिक व्यापार मंच।",
      category: "कृषि विपणन",
      ministry: "कृषि एवं किसान कल्याण मंत्रालय (SFAC द्वारा संचालित)",
      launchDate: "14 अप्रैल 2016",
      applicationOpeningDate: "वर्ष भर निरंतर उपलब्ध",
      applicationDeadline: "जारी है (ऑनलाइन पंजीकरण)",
      status: "सक्रिय (Active)",
      lastVerified: "29 अगस्त 2026",
      benefits: [
        "देशभर की 1,361+ मंडियों में ऑनलाइन पारदर्शी ई-बोली के जरिए बेहतर मूल्य प्राप्ति",
        "स्थानीय बिचौलियों और कमीशन एजेंटों पर निर्भरता समाप्त",
        "मंडी द्वार पर गुणवत्ता परीक्षण एवं प्रमाणन की सुविधा",
        "बिक्री की राशि का उसी दिन किसान के बैंक खाते में सीधा ऑनलाइन अंतरण"
      ],
      eligibility: [
        "संबद्ध एपीएमसी मंडी में पंजीकृत सभी किसान, एफपीओ और व्यापारी"
      ],
      documents: [
        "आधार कार्ड",
        "बैंक पासबुक / कैंसल चेक",
        "मंडी प्रवेश गेट पास / तौल पर्ची",
        "मोबाइल नंबर"
      ],
      process: "enam.gov.in पोर्टल, eNAM मोबाइल ऐप अथवा मंडी प्रांगण में स्थापित ई-नाम हेल्प डेस्क पर किसान के रूप में पंजीकरण करें।"
    }
  },

  // ==========================================
  // 9. Digital Agriculture Mission & AgriStack
  // ==========================================
  {
    id: "agristack",
    website: "https://agricoop.gov.in/",
    statusType: "Active",
    categoryType: "Technology",
    stateTags: ["All", "Maharashtra", "Uttar Pradesh", "Madhya Pradesh", "Gujarat", "Odisha", "Andhra Pradesh"],
    en: {
      name: "Digital Agriculture Mission & AgriStack",
      shortDescription: "National Digital Public Infrastructure creating unique 12-digit Digital Farmer IDs linked to verified land records and crop surveys.",
      category: "Digital Agriculture Infrastructure",
      ministry: "Ministry of Agriculture & Farmers Welfare, Government of India",
      launchDate: "2 September 2024",
      applicationOpeningDate: "Phased state-wide rollout (Active in Maharashtra, UP, MP, Gujarat, Odisha)",
      applicationDeadline: "Ongoing onboarding",
      status: "Active",
      lastVerified: "29 August 2026",
      benefits: [
        "Creation of a unique 12-digit Digital Farmer ID (Kisan Pehchan Patra) linked to verified land records",
        "Single-window paperless access to all central & state subsidies, PM-KISAN, crop insurance claims, and KCC credit",
        "Digital crop survey records enabling automated, expedited insurance claim settlements without physical paperwork",
        "Tailored agro-climatic advisories delivered directly to the farmer's mobile"
      ],
      eligibility: [
        "All landholding and cultivating farmers in participating states/UTs"
      ],
      documents: [
        "Aadhaar Card",
        "Aadhaar-linked Mobile Number",
        "Land Record ID (Khasra / Khatauni / 7-12 extract)"
      ],
      process: "Onboarding is conducted via State Agriculture Department verification drives, Common Service Centres (CSCs), and the AgriStack portal."
    },
    mr: {
      name: "डिजिटल कृषी मिशन आणि ॲग्रीस्टॅक (AgriStack)",
      shortDescription: "शेतकऱ्यांसाठी १२ अंकी डिजिटल शेतकरी ओळखपत्र (Kisan ID) आणि सर्व सरकारी योजनांसाठी एकखिडकी डिजिटल सुविधा.",
      category: "डिजिटल कृषी तंत्रज्ञान",
      ministry: "कृषी व शेतकरी कल्याण मंत्रालय, भारत सरकार",
      launchDate: "२ सप्टेंबर २०२४",
      applicationOpeningDate: "राज्यनिहाय टप्प्याटप्प्याने नोंदणी मोहीम सुरू",
      applicationDeadline: "सुरू आहे (निरंतर नोंदणी)",
      status: "सुरू आहे (Active)",
      lastVerified: "२९ ऑगस्ट २०२६",
      benefits: [
        "जमीन अभिलेखांशी जोडलेले १२ अंकी डिजिटल शेतकरी ओळखपत्र (किसान ओळखपत्र)",
        "पीक कर्ज, पीक विमा, पीएम-किसान आणि शासकीय अनुदानांसाठी कागदपत्रांशिवाय एका क्लिकवर मंजुरी",
        "ई-पीक पाहणीच्या आधारे नैसर्गिक आपत्तीत विनासायास थेट नुकसान भरपाई",
        "शेतकऱ्याच्या शेताच्या अचूक स्थानानुसार थेट मोबाईलवर हवामान व कृषी सल्ला"
      ],
      eligibility: [
        "महाराष्ट्रातील व इतर सहभागी राज्यांमधील सर्व शेतकरी"
      ],
      documents: [
        "आधार कार्ड",
        "आधार लिंक मोबाईल क्रमांक",
        "७/१२ उतारा व खाते क्रमांक"
      ],
      process: "गावपातळीवरील कृषी सहाय्यक, तलाठी, आपले सरकार सेवा केंद्र (CSC) किंवा ॲग्रीस्टॅक पोर्टलवरून नोंदणी केली जाते."
    },
    hi: {
      name: "डिजिटल कृषि मिशन एवं एग्रीस्टैक (AgriStack)",
      shortDescription: "किसानों के लिए 12-अंकीय डिजिटल किसान पहचान पत्र (Kisan ID) और कागजरहित सरकारी सेवाओं की सुविधा।",
      category: "डिजिटल कृषि प्रौद्योगिकी",
      ministry: "कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार",
      launchDate: "2 सितंबर 2024",
      applicationOpeningDate: "राज्यों में चरणबद्ध नामांकन प्रक्रिया",
      applicationDeadline: "जारी है (सतत प्रक्रिया)",
      status: "सक्रिय (Active)",
      lastVerified: "29 अगस्त 2026",
      benefits: [
        "भूमि रिकॉर्ड से सत्यापित 12-अंकीय विशिष्ट डिजिटल किसान पहचान पत्र (किसान आईडी)",
        "सभी सरकारी योजनाओं, फसल बीमा, केसीसी ऋण और सब्सिडी का पेपरलेस एकल खिड़की लाभ",
        "डिजिटल फसल सर्वेक्षण के आधार पर बिना कागजी कार्रवाई के त्वरित बीमा दावा निपटान",
        "सटीक मौसम और कृषि परामर्श सीधे मोबाइल पर"
      ],
      eligibility: [
        "संबद्ध राज्यों के सभी भूमिधारक एवं काश्तकार किसान"
      ],
      documents: [
        "आधार कार्ड",
        "आधार से जुड़ा मोबाइल नंबर",
        "खसरा-खतौनी विवरण"
      ],
      process: "राज्य कृषि विभाग, सीएससी केंद्रों अथवा एग्रीस्टैक पोर्टल के माध्यम से किसान आईडी का निर्माण किया जाता है।"
    }
  },

  // ==========================================
  // 10. Agriculture Infrastructure Fund (AIF)
  // ==========================================
  {
    id: "aif",
    website: "https://agriinfra.dac.gov.in/",
    statusType: "Active",
    categoryType: "Infrastructure",
    stateTags: ["All", "Maharashtra", "Uttar Pradesh", "Gujarat", "Andhra Pradesh", "Karnataka", "Telangana", "Punjab"],
    en: {
      name: "Agriculture Infrastructure Fund (AIF)",
      shortDescription: "Medium-to-long term debt financing facility with 3% interest subvention for post-harvest management and community farming assets.",
      category: "Post-Harvest Infrastructure",
      ministry: "Ministry of Agriculture & Farmers Welfare, Government of India",
      launchDate: "8 July 2020 (Operational through 2032-33)",
      applicationOpeningDate: "Continuous / Open round the year",
      applicationDeadline: "Ongoing (Scheme active till FY 2032-33)",
      status: "Active",
      lastVerified: "29 August 2026",
      benefits: [
        "3% per annum interest subvention on bank loans up to ₹2 Crore for a maximum period of 7 years",
        "Credit guarantee fee coverage under CGTMSE for loans up to ₹2 Crore",
        "Finances warehouses, cold storage chains, silos, assaying units, pack-houses, primary processing units, and solar-powered agri-infrastructure",
        "Loans can be availed from all commercial and cooperative lending institutions"
      ],
      eligibility: [
        "Primary Agricultural Credit Societies (PACS), Marketing Cooperative Societies, FPOs, SHGs, JLGs, Farmers, Agri-entrepreneurs, and Startups"
      ],
      documents: [
        "Detailed Project Report (DPR)",
        "Aadhaar Card & PAN Card of applicant / entity",
        "Land Ownership / Registered Lease Document for project site",
        "Bank Loan Sanction Letter / Account Statement",
        "Statutory registrations / GST certificate (for FPOs/Enterprises)"
      ],
      process: "Submit project application online on the AIF portal (agriinfra.dac.gov.in). Following initial screening by the Ministry, the proposal is routed to the applicant's chosen bank for loan sanctioning."
    },
    mr: {
      name: "कृषी पायाभूत सुविधा निधी (AIF)",
      shortDescription: "गोदामे, शीतगृहे, पॅकहाऊस आणि प्रक्रिया उद्योग उभारण्यासाठी ३% व्याज सवलतीसह ₹२ कोटींपर्यंतचे कर्ज साहाय्य.",
      category: "काढणीपश्चात पायाभूत सुविधा",
      ministry: "कृषी व शेतकरी कल्याण मंत्रालय, भारत सरकार",
      launchDate: "८ जुलै २०२० (२०३२-३३ पर्यंत कार्यरत)",
      applicationOpeningDate: "वर्षभर अविरतपणे सुरू",
      applicationDeadline: "सुरू आहे (२०३२-३३ पर्यंत मुदत)",
      status: "सुरू आहे (Active)",
      lastVerified: "२९ ऑगस्ट २०२६",
      benefits: [
        "₹२ कोटींपर्यंतच्या बँक कर्जावर वार्षिक ३% व्याज परतावा (व्याज सवलत) सलग ७ वर्षांसाठी",
        "सीजीटीएमएसई (CGTMSE) अंतर्गत कर्जासाठी पत हमी शुल्क सरकारमार्फत भरले जाते",
        "गोदामे, शीतगृहे (Cold Storage), प्रतवारी व पॅकिंग युनिट, डाळ/तेल प्रक्रिया उद्योग उभारणीसाठी अर्थसाहाय्य",
        "सर्व राष्ट्रीयीकृत व सहकारी बँकांमार्फत कर्ज सुविधा उपलब्ध"
      ],
      eligibility: [
        "शेतकरी, शेतकरी उत्पादक कंपन्या (FPO), प्राथमिक कृषी पतसंस्था (PACS), बचत गट व कृषी उद्योजक"
      ],
      documents: [
        "प्रकल्पाचा सविस्तर अहवाल (DPR)",
        "आधार कार्ड व पॅन कार्ड",
        "प्रकल्प जागेचा ७/१२ किंवा नोंदणीकृत भाडेकरार",
        "बँक कर्ज मंजुरी पत्र / बँक स्टेटमेंट"
      ],
      process: "agriinfra.dac.gov.in या पोर्टलवर ऑनलाईन प्रकल्प प्रस्ताव सादर करावा. प्राथमिक तपासणीनंतर प्रस्ताव थेट बँकेकडे कर्ज वितरणासाठी पाठवला जातो."
    },
    hi: {
      name: "कृषि अवसंरचना कोष (AIF)",
      shortDescription: "गोदाम, कोल्ड स्टोरेज और प्रसंस्करण इकाइयां स्थापित करने के लिए 3% ब्याज छूट के साथ ₹2 करोड़ तक का ऋण।",
      category: "कटाई उपरांत अवसंरचना",
      ministry: "कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार",
      launchDate: "8 जुलाई 2020 (2032-33 तक सक्रिय)",
      applicationOpeningDate: "वर्ष भर निरंतर उपलब्ध",
      applicationDeadline: "जारी है (वित्तीय वर्ष 2032-33 तक)",
      status: "सक्रिय (Active)",
      lastVerified: "29 अगस्त 2026",
      benefits: [
        "₹2 करोड़ तक के ऋण पर 7 वर्षों की अवधि के लिए 3% वार्षिक ब्याज अनुदान",
        "CGTMSE योजना के तहत शून्य लागत पर क्रेडिट गारंटी सुरक्षा",
        "वेयरहाउस, साइलो, कोल्ड चेन, ग्रेडिंग-पैकिंग व प्राथमिक प्रसंस्करण इकाइयों के निर्माण हेतु वित्तपोषण",
        "सभी अनुसूचित वाणिज्यिक व सहकारी बैंकों के माध्यम से ऋण सुविधा"
      ],
      eligibility: [
        "किसान, एफपीओ, प्राथमिक कृषि साख समितियां (PACS), स्वयं सहायता समूह एवं कृषि उद्यमी"
      ],
      documents: [
        "विस्तृत परियोजना रिपोर्ट (DPR)",
        "आधार एवं पैन कार्ड",
        "परियोजना स्थल के भूमि दस्तावेज / लीज एग्रीमेंट",
        "बैंक खाता विवरण"
      ],
      process: "agriinfra.dac.gov.in पोर्टल पर ऑनलाइन परियोजना प्रस्ताव जमा करें। मंत्रालय द्वारा अनुमोदन के पश्चात बैंक ऋण स्वीकृत करता है।"
    }
  },

  // ==========================================
  // 11. PM-KMY (Kisan Maandhan Pension)
  // ==========================================
  {
    id: "pm-kmy",
    website: "https://maandhan.in/",
    statusType: "Active",
    categoryType: "Financial",
    stateTags: ["All", "Maharashtra", "Uttar Pradesh", "Bihar", "Madhya Pradesh", "Odisha", "Jharkhand"],
    en: {
      name: "Pradhan Mantri Kisan Maandhan Yojana (PM-KMY)",
      shortDescription: "Old-age pension scheme providing an assured monthly pension of ₹3,000 to small and marginal farmers upon reaching 60 years of age.",
      category: "Social Security & Pension",
      ministry: "Ministry of Agriculture & Farmers Welfare & Life Insurance Corporation of India (LIC)",
      launchDate: "12 September 2019",
      applicationOpeningDate: "Continuous / Open round the year",
      applicationDeadline: "Ongoing (Continuous enrollment)",
      status: "Active",
      lastVerified: "29 August 2026",
      benefits: [
        "Guaranteed monthly pension of ₹3,000 after attaining 60 years of age",
        "50:50 matching contribution: Central Government deposits an equal amount into the pension fund every month",
        "Monthly farmer contribution ranges from ₹55 to ₹200 based on entry age (18 to 40 years)",
        "In the event of the farmer's death, the spouse is entitled to 50% of the pension (₹1,500/month) as family pension"
      ],
      eligibility: [
        "Small and Marginal Farmers (SMF) owning cultivable agricultural land up to 2 hectares (5 acres)",
        "Entry age between 18 and 40 years",
        "Exclusions: Farmers covered under other statutory social security schemes (NPS, ESIC, PM-SYM) or income tax payees"
      ],
      documents: [
        "Aadhaar Card",
        "Savings Bank Account Passbook / PM-KISAN bank account details",
        "Land Record Documents (7/12 extract or Khasra/Khatauni)"
      ],
      process: "Enroll through any nearest Common Service Centre (CSC) or self-register on the Maandhan portal (maandhan.in). Contributions can also be auto-debited from PM-KISAN installments."
    },
    mr: {
      name: "प्रधानमंत्री किसान मानधन योजना (PM-KMY)",
      shortDescription: "अल्प व अत्यल्प भूधारक शेतकऱ्यांना वयाची ६० वर्षे पूर्ण झाल्यानंतर दरमहा ₹३,००० ची निश्चित पेन्शन.",
      category: "सामाजिक सुरक्षा व पेन्शन",
      ministry: "कृषी व शेतकरी कल्याण मंत्रालय व भारतीय आयुर्विमा महामंडळ (LIC)",
      launchDate: "१२ सप्टेंबर २०१९",
      applicationOpeningDate: "वर्षभर अविरतपणे सुरू",
      applicationDeadline: "सुरू आहे (निरंतर नोंदणी सुरू)",
      status: "सुरू आहे (Active)",
      lastVerified: "२९ ऑगस्ट २०२६",
      benefits: [
        "वयाची ६० वर्षे पूर्ण झाल्यानंतर दरमहा ₹३,००० ची खात्रीशीर मासिक पेन्शन",
        "५०:५० समभाग योगदान: शेतकरी जेवढा मासिक हप्ता भरतो, तेवढाच हप्ता केंद्र सरकार भरते",
        "वयाच्या १८ ते ४० वर्षांनुसार मासिक हप्ता फक्त ₹५५ ते ₹२००",
        "शेतकऱ्याच्या मृत्यूनंतर पती/पत्नीस दरमहा ₹१,५०० (५०%) कुटुंब निवृत्तीवेतन"
      ],
      eligibility: [
        "२ हेक्टरपर्यंत (५ एकर) शेतजमीन असलेले लहान व सीमांत शेतकरी",
        "प्रवेशाचे वय १८ ते ४० वर्षांच्या दरम्यान असणे आवश्यक",
        "ईपीएफओ (EPFO), ईएसआयसी (ESIC) किंवा आयकर भरणारे शेतकरी वगळून"
      ],
      documents: [
        "आधार कार्ड",
        "बँक पासबुक / पीएम-किसान बँक खाते",
        "७/१२ उतारा व ८-अ उतारा",
        "वारसाचे (Nominee) आधार तपशील"
      ],
      process: "नजीकच्या आपले सरकार सेवा केंद्रावर (CSC) जाऊन किंवा maandhan.in पोर्टलवर नोंदणी करता येते. मासिक हप्ता पीएम-किसानच्या हप्त्यामधूनही थेट वळता करण्याची सुविधा आहे."
    },
    hi: {
      name: "प्रधानमंत्री किसान मानधन योजना (PM-KMY)",
      shortDescription: "छोटे और सीमांत किसानों को 60 वर्ष की आयु पूर्ण होने पर ₹3,000 प्रति माह की सुनिश्चित वृद्धावस्था पेंशन।",
      category: "सामाजिक सुरक्षा एवं पेंशन",
      ministry: "कृषि एवं किसान कल्याण मंत्रालय एवं भारतीय जीवन बीमा निगम (LIC)",
      launchDate: "12 सितंबर 2019",
      applicationOpeningDate: "वर्ष भर निरंतर उपलब्ध",
      applicationDeadline: "जारी है (सतत नामांकन)",
      status: "सक्रिय (Active)",
      lastVerified: "29 अगस्त 2026",
      benefits: [
        "60 वर्ष की आयु के बाद ₹3,000 प्रति माह की गारंटीड आजीवन पेंशन",
        "50:50 अंशदान: जितनी राशि किसान जमा करता है, उतनी ही राशि केंद्र सरकार द्वारा जमा",
        "प्रवेश आयु (18-40 वर्ष) के आधार पर मासिक प्रीमियम मात्र ₹55 से ₹200",
        "किसान की मृत्यु की स्थिति में जीवनसाथी को 50% (₹1,500/माह) पारिवारिक पेंशन"
      ],
      eligibility: [
        "2 हेक्टेयर तक कृषि योग्य भूमि वाले लघु एवं सीमांत किसान",
        "प्रवेश के समय आयु 18 से 40 वर्ष के मध्य होनी चाहिए",
        "आयकर दाता व अन्य सामाजिक सुरक्षा योजनाओं के लाभार्थी अपात्र"
      ],
      documents: [
        "आधार कार्ड",
        "बचत बैंक खाता पासबुक / पीएम-किसान खाता विवरण",
        "भूमि दस्तावेज (खसरा/खतौनी)",
        "नामित व्यक्ति (Nominee) का विवरण"
      ],
      process: "निकटतम सीएससी (CSC) केंद्र पर जाएं या maandhan.in पोर्टल पर स्वयं पंजीकरण करें। प्रीमियम पीएम-किसान खाते से भी ऑटो-डेबिट किया जा सकता है।"
    }
  }
];

export type LanguageCode = "en" | "mr" | "hi";

export interface DisplayScheme extends LocalizedSchemeContent {
  id: string;
  website: string;
  statusType: "Active" | "Upcoming" | "Deadline Passed";
  categoryType: "Financial" | "Insurance" | "Infrastructure" | "Technology" | "Soil Health" | "Solar & Energy";
  stateTags: string[];
}

export function getLocalizedSchemes(lang: string = "en"): DisplayScheme[] {
  const selectedLang: LanguageCode = (lang === "mr" || lang === "hi") ? lang : "en";
  return rawSchemesData.map(scheme => {
    const content = scheme[selectedLang] || scheme.en;
    return {
      id: scheme.id,
      website: scheme.website,
      statusType: scheme.statusType,
      categoryType: scheme.categoryType,
      stateTags: scheme.stateTags,
      ...content
    };
  });
}

// Backward compatibility default export
export const schemesData = getLocalizedSchemes("en");
