/**
 * Authoritative Agronomic Database for Crop Diseases in India
 * Sourced from:
 * - ICAR (Indian Council of Agricultural Research) Institutes:
 *   - ICAR-NRCG (National Research Centre for Grapes, Pune)
 *   - ICAR-CPRI (Central Potato Research Institute, Shimla)
 *   - ICAR-IIHR (Indian Institute of Horticultural Research, Bengaluru)
 *   - ICAR-CICR (Central Institute for Cotton Research, Nagpur)
 *   - ICAR-IISR (Indian Institute of Soybean Research, Indore)
 *   - ICAR-IIWBR (Indian Institute of Wheat and Barley Research, Karnal)
 *   - ICAR-IIMR (Indian Institute of Maize Research, Ludhiana)
 * - CIBRC (Central Insecticides Board & Registration Committee) Registered Formulations
 */

export interface VerifiedDiseaseRecord {
  crop: string;
  cropMarathi: string;
  cropHindi: string;
  diseaseName: string;
  diseaseNameMarathi: string;
  diseaseNameHindi: string;
  pathogen: string;
  symptoms: {
    en: string;
    mr: string;
    hi: string;
  };
  organicTreatment: {
    en: string;
    mr: string;
    hi: string;
  };
  chemicalTreatment: {
    en: string;
    mr: string;
    hi: string;
    activeIngredient: string;
    dosagePerLiter: string;
    dosagePerAcre: string;
    phiDays: number;
    cibrcApproved: boolean;
  };
  prevention: {
    en: string;
    mr: string;
    hi: string;
  };
  sourceReference: {
    institution: string;
    document: string;
  };
}

export const VERIFIED_CROP_DISEASES: Record<string, VerifiedDiseaseRecord> = {
  "grape_downy_mildew": {
    crop: "Grape",
    cropMarathi: "द्राक्ष",
    cropHindi: "अंगूर",
    diseaseName: "Grape Downy Mildew",
    diseaseNameMarathi: "द्राक्षावरील केवडा रोग (डाउनी मिल्ड्यू)",
    diseaseNameHindi: "अंगूर का मृदुरोमिल आसिता (डाउनी मिल्ड्यू)",
    pathogen: "Oomycete Fungus (Plasmopara viticola)",
    symptoms: {
      en: "Yellowish, translucent 'oil spots' on upper leaf surfaces. In high humidity/dew, dense white downy fungal cottony growth develops on corresponding lower leaf surfaces. Infected young bunches turn brown, wither, and drop.",
      mr: "पानाच्या वरच्या बाजूला पिवळसर, तेलकट डाग (ऑईल स्पॉट्स) दिसतात. दमट हवेत पानाच्या खालच्या बाजूला पांढरी कापसासारखी बुरशी वाढते. कोवळे घड तपकिरी पडून सुकतात व गळतात.",
      hi: "पत्तियों की ऊपरी सतह पर पीले, तेलिया धब्बे (ऑयल स्पॉट्स) बनते हैं। अधिक आर्द्रता में पत्तियों की निचली सतह पर सफेद रुई जैसी फफूंद उगती है। अंगूर के गुच्छे भूरे होकर सूख जाते हैं।"
    },
    organicTreatment: {
      en: "Spray Trichoderma asperellum / viride @ 5 g/L. Apply Bordeaux Mixture (0.8% - 1%) preventively before rains. Remove and destroy lower ground-touching leaves.",
      mr: "ट्रायकोडर्मा ५ ग्रॅम/लिटर फवारावे. पावसाळ्यापूर्वी प्रतिबंधात्मक ०.८% ते १% बोर्डो मिश्रण फवारावे. जमिनीला टेकलेली खालची पाने काढून टाकावीत.",
      hi: "ट्राइकोडर्मा ५ ग्राम/लीटर का छिड़काव करें। बारिश से पहले ०.८% से १% बोर्डो मिश्रण का छिड़काव करें। जमीन को छूने वाली पत्तियां हटा दें।"
    },
    chemicalTreatment: {
      en: "Preventive: Mancozeb 75% WP @ 2.0 g/L OR Propineb 70% WP @ 2.0 g/L. Curative upon outbreak: Dimethomorph 50% WP @ 1.0 g/L (200 g/acre) OR Mandipropamid 23.4% SC @ 0.8 ml/L (160 ml/acre) OR Cymoxanil 8% + Mancozeb 64% WP @ 2.5 g/L (500 g/acre in 200 L water).",
      mr: "प्रतिबंधात्मक: मॅन्कोझेब ७५% WP २ ग्रॅम/लिटर किंवा प्रोपिनेब ७०% WP २ ग्रॅम/लिटर. प्रादुर्भाव झाल्यावर: डायमेथोमॉर्फ ५०% WP १ ग्रॅम/लिटर किंवा मँडिप्रोपॅमिड २३.४% SC ०.८ मिली/लिटर किंवा सायमोक्सॅनिल + मॅन्कोझेब २.५ ग्रॅम/लिटर फवारावे.",
      hi: "रोकथाम: मैंकोजेब ७५% WP २ ग्राम/लीटर या प्रोपिनेब २ ग्राम/लीटर। प्रकोप पर: डाइमेथोमॉर्फ ५०% WP १ ग्राम/लीटर या मैंडीप्रोपामिड २३.४% SC ०.८ मिली/लीटर या साइमोक्सानिल + मैंकोजेब २.५ ग्राम/लीटर का छिड़काव करें।",
      activeIngredient: "Dimethomorph 50% WP / Mandipropamid 23.4% SC / Cymoxanil + Mancozeb",
      dosagePerLiter: "0.8 - 2.5 g/ml per Litre",
      dosagePerAcre: "160 ml - 500 g in 200 L water",
      phiDays: 14,
      cibrcApproved: true
    },
    prevention: {
      en: "Maintain open canopy by timely shoot thinning and leaf defoliation to maximize air circulation. Ensure good vineyard drainage. Follow ICAR-NRC Grapes weather-based advisory.",
      mr: "घड व पानांमध्ये हवा खेळती राहण्यासाठी छाटणी व विरळणी वेळेवर करा. बागेत पाणी साचू देऊ नका. भाकृअनुप-राष्ट्रीय द्राक्ष संशोधन केंद्र, पुणे यांच्या सल्ल्याचे पालन करा.",
      hi: "अंगूर के बगीचे में हवा के प्रवाह हेतु समय पर छंटाई करें। जल निकासी सुगम रखें। आईसीएआर-राष्ट्रीय अंगूर अनुसंधान केंद्र, पुणे की मौसम आधारित सलाह का पालन करें।"
    },
    sourceReference: {
      institution: "ICAR - National Research Centre for Grapes (NRCG), Pune",
      document: "Grape Crop Protection Guidelines & Fungicide Resistance Management"
    }
  },

  "potato_late_blight": {
    crop: "Potato",
    cropMarathi: "बटाटा",
    cropHindi: "आलू",
    diseaseName: "Potato Late Blight",
    diseaseNameMarathi: "बटाट्यावरील करपा (लेट ब्लाइट)",
    diseaseNameHindi: "आलू का पछेती झुलसा (लेट ब्लाइट)",
    pathogen: "Oomycete Fungus (Phytophthora infestans)",
    symptoms: {
      en: "Water-soaked, irregular pale-green to dark brown lesions starting from leaf tips and margins. In humid cool weather, white cottony fungal growth appears on leaf undersides. Rapid browning and foliage collapse.",
      mr: "पानांच्या कडा व टोकांवर काळपट तपकिरी, पाणथळ डाग पडतात. दमट व थंड हवामानात पानांच्या खालच्या बाजूला पांढरी बुरशी दिसते. झाडाची पाने वेगाने करपतात व गळतात.",
      hi: "पत्तियों के सिरों और किनारों पर पानी से भीगे हुए भूरे-काले धब्बे बनते हैं। नम व ठंडे मौसम में पत्तियों की निचली सतह पर सफेद फफूंद दिखाई देती है और पूरा पौधा झुलस जाता है।"
    },
    organicTreatment: {
      en: "Spray Trichoderma viride / harzianum @ 5 g/L or Pseudomonas fluorescens @ 5 ml/L. Apply copper-based formulations (Bordeaux mixture 1%) preventively before disease onset. Destroy infected plant debris.",
      mr: "ट्रायकोडर्मा व्हिरीडी ५ ग्रॅम/लिटर किंवा स्युडोमोनास फ्लुरोसेन्स ५ मिली/लिटर फवारावे. रोग सुरू होण्यापूर्वी १% बोर्डो मिश्रण प्रतिबंधक म्हणून फवारावे. बाधित पाने नष्ट करावीत.",
      hi: "ट्राइकोडर्मा विरिडी ५ ग्राम/लीटर या स्यूडोमोनास फ्लोरोसेंस ५ मिली/लीटर का छिड़काव करें। रोग की शुरुआत से पहले १% बोर्डो मिश्रण का छिड़काव करें। प्रभावित पौधों को नष्ट करें।"
    },
    chemicalTreatment: {
      en: "Preventive: Mancozeb 75% WP @ 2.0 g/L (400-500 g/acre in 200 L water) OR Chlorothalonil 75% WP @ 2.0 g/L. Curative upon outbreak: Cymoxanil 8% + Mancozeb 64% WP @ 2.5 g/L (500 g/acre) OR Dimethomorph 50% WP @ 1.0 g/L (200 g/acre).",
      mr: "प्रतिबंधात्मक: मॅन्कोझेब ७५% WP २ ग्रॅम/लिटर (४००-५०० ग्रॅम/एकर) किंवा क्लोरोथॅलोनिल ७५% WP २ ग्रॅम/लिटर. प्रादुर्भाव झाल्यावर: सायमोक्सॅनिल ८% + मॅन्कोझेब ६४% WP २.५ ग्रॅम/लिटर (५०० ग्रॅम/एकर) फवारावे.",
      hi: "रोकथाम हेतु: मैंकोजेब ७५% WP २ ग्राम/लीटर (४००-५०० ग्राम/एकड़) या क्लोरोथैलोनिल ७५% WP २ ग्राम/लीटर। प्रकोप होने पर: साइमोक्सानिल ८% + मैंकोजेब ६४% WP २.५ ग्राम/लीटर (५०० ग्राम/एकड़) छिड़कें।",
      activeIngredient: "Cymoxanil 8% + Mancozeb 64% WP / Dimethomorph 50% WP",
      dosagePerLiter: "2.0 - 2.5 g/L",
      dosagePerAcre: "400 - 500 g in 200 Litres water",
      phiDays: 7,
      cibrcApproved: true
    },
    prevention: {
      en: "Use certified disease-free seed tubers from ICAR-CPRI. Avoid furrow flooding. Maintain wide spacing for canopy ventilation. Avoid planting near infected tomato fields.",
      mr: "भाकृअनुप-केंद्रीय बटाटा संशोधन संस्थेचे (CPRI) प्रमाणित रोगमुक्त बियाणे वापरावे. शेतात पाणी साचू देऊ नका. झाडांमध्ये पुरेशी हवा खेळती राहण्यासाठी योग्य अंतर ठेवा.",
      hi: "आईसीएआर-केंद्रीय आलू अनुसंधान संस्थान (CPRI) के प्रमाणित बीज कंद प्रयोग करें। खेत में जलभराव न होने दें। पौधों के बीच उचित दूरी रखें।"
    },
    sourceReference: {
      institution: "ICAR - Central Potato Research Institute (CPRI), Shimla",
      document: "Late Blight Management in Potato & CIBRC Approved Fungicide Schedule"
    }
  },

  "potato_early_blight": {
    crop: "Potato",
    cropMarathi: "बटाटा",
    cropHindi: "आलू",
    diseaseName: "Potato Early Blight",
    diseaseNameMarathi: "बटाट्यावरील लवकर येणारा करपा (अर्ली ब्लाइट)",
    diseaseNameHindi: "आलू का अगेती झुलसा (अर्ली ब्लाइट)",
    pathogen: "Fungus (Alternaria solani)",
    symptoms: {
      en: "Small, scattered dark brown to black spots on older lower leaves, developing distinct concentric rings (target board pattern). Leaves turn yellow and drop prematurely.",
      mr: "खालच्या जुन्या पानांवर गोलाकार व वलयाकार (केंद्रीत कडे असलेले) तपकिरी काळे ठिपके पडतात. पाने पिवळी पडून सुकतात व गळतात.",
      hi: "पुरानी निचली पत्तियों पर भूरे-काले गोल धब्बे बनते हैं जिनमें गोल छल्ले (टारगेट बोर्ड) जैसे निशान दिखाई देते हैं। पत्तियां पीली पड़कर सूख जाती हैं।"
    },
    organicTreatment: {
      en: "Foliar spray of Neem oil (Azadirachtin 10,000 ppm @ 2 ml/L) or Trichoderma viride @ 5 g/L. Remove lower infected leaves and destroy them away from the field.",
      mr: "कडुलिंब अर्क / नीम तेल (अझाडिरॅक्टिन १०,००० ppm २ मिली/लिटर) किंवा ट्रायकोडर्मा ५ ग्रॅम/लिटर फवारावे. बाधित झालेली खालची पाने काढून नष्ट करावीत.",
      hi: "नीम तेल (१०,००० ppm २ मिली/लीटर) या ट्राइकोडर्मा ५ ग्राम/लीटर का छिड़काव करें। निचली संक्रमित पत्तियों को तोड़कर खेत से दूर नष्ट करें।"
    },
    chemicalTreatment: {
      en: "Spray Mancozeb 75% WP @ 2.0 g/L (400-500 g/acre) OR Propineb 70% WP @ 2.0 g/L OR Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1.0 ml/L (200 ml/acre) at initial symptom stage.",
      mr: "मॅन्कोझेब ७५% WP २ ग्रॅम/लिटर किंवा प्रोपिनेब ७०% WP २ ग्रॅम/लिटर किंवा अझॉक्सिस्ट्रॉबिन १८.२% + डायफेनोकोनाझोल ११.४% SC १ मिली/लिटर (२०० मिली/एकर) फवारावे.",
      hi: "मैंकोजेब ७५% WP २ ग्राम/लीटर या प्रोपिनेब ७०% WP २ ग्राम/लीटर या एजॉक्सीस्ट्रोबिन १८.२% + डाइफेनोकोनाजोल ११.४% SC १ मिली/लीटर (२०० मिली/एकड़) का छिड़काव करें।",
      activeIngredient: "Mancozeb 75% WP / Azoxystrobin + Difenoconazole",
      dosagePerLiter: "1.0 - 2.0 g/ml per Litre",
      dosagePerAcre: "200 ml to 400 g in 200 L water",
      phiDays: 7,
      cibrcApproved: true
    },
    prevention: {
      en: "Follow crop rotation with non-solanaceous crops (avoid rotating with tomato/brinjal). Ensure balanced nitrogen fertilizer; excess nitrogen promotes succulent vulnerable foliage.",
      mr: "टोमॅटो किंवा वांगी लागवड असलेल्या जमिनीत फेरपालट करा. नत्राचा (युरिया) अतिवापर टाळावा व पोटॅशचे संतुलित प्रमाण ठेवावे.",
      hi: "टमाटर व बैंगन की फसलों के साथ फसल चक्र अपनाएं। यूरिया का अत्यधिक उपयोग न करें और पोटाश का संतुलित प्रयोग करें।"
    },
    sourceReference: {
      institution: "ICAR - Central Potato Research Institute (CPRI), Shimla",
      document: "Package of Practices for Potato Diseases"
    }
  },

  "tomato_early_blight": {
    crop: "Tomato",
    cropMarathi: "टोमॅटो",
    cropHindi: "टमाटर",
    diseaseName: "Tomato Early Blight",
    diseaseNameMarathi: "टोमॅटोवरील अर्ली ब्लाइट (करपा)",
    diseaseNameHindi: "टमाटर का अगेती झुलसा (अर्ली ब्लाइट)",
    pathogen: "Fungus (Alternaria solani)",
    symptoms: {
      en: "Dark brown necrotic spots with characteristic concentric rings (target board pattern) on older leaves. Surrounding tissue turns yellow (chlorosis). Collar rot on stems and dark sunken cankers near stem-end of fruits.",
      mr: "जुन्या पानांवर गोलाकार वलयांकित काळपट डाग (टार्गेट बोर्ड पॅटर्न) दिसतात. डागांभोवती पान पिवळे पडते. खोडावर व फळांच्या देठाजवळ काळे खोलगट चट्टे पडतात.",
      hi: "पुरानी पत्तियों पर गाढ़े भूरे रंग के छल्लेदार (टारगेट बोर्ड) धब्बे बनते हैं। धब्बों के आसपास पत्ती पीली हो जाती है। तने व फलों पर काले धंसे हुए धब्बे पड़ते हैं।"
    },
    organicTreatment: {
      en: "Prune bottom 12 inches of leaves to prevent soil splash. Spray Copper Hydroxide 53.8% DF @ 2 g/L or Trichoderma harzianum @ 5 g/L at 10-day intervals. Mulch soil to prevent spore splash.",
      mr: "खालच्या १२ इंचांमधील पाने छाटून टाकावीत जेणेकरून जमिनीतील बुरशी पानांवर उडणार नाही. कॉपर हायड्रॉक्साइड २ ग्रॅम/लिटर किंवा ट्रायकोडर्मा ५ ग्रॅम/लिटर फवारावे. जमिनीवर मल्चिंग पेपर वापरावा.",
      hi: "जमीन से सटी निचली पत्तियों को काट दें। कॉपर हाइड्रॉक्साइड २ ग्राम/लीटर या ट्राइकोडर्मा ५ ग्राम/लीटर का छिड़काव करें। जमीन पर मल्चिंग का प्रयोग करें।"
    },
    chemicalTreatment: {
      en: "Spray Mancozeb 75% WP @ 2.0 g/L (400-500 g/acre) OR Chlorothalonil 75% WP @ 2.0 g/L OR Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1.0 ml/L (200 ml/acre in 200 L water).",
      mr: "मॅन्कोझेब ७५% WP २ ग्रॅम/लिटर (४०० ग्रॅम/एकर) किंवा क्लोरोथॅलोनिल ७५% WP २ ग्रॅम/लिटर किंवा अझॉक्सिस्ट्रॉबिन + डायफेनोकोनाझोल १ मिली/लिटर फवारावे.",
      hi: "मैंकोजेब ७५% WP २ ग्राम/लीटर (४०० ग्राम/एकड़) या क्लोरोथैलोनिल ७५% WP २ ग्राम/लीटर या एजॉक्सीस्ट्रोबिन + डाइफेनोकोनाजोल १ मिली/लीटर का छिड़काव करें।",
      activeIngredient: "Mancozeb 75% WP / Azoxystrobin + Difenoconazole SC",
      dosagePerLiter: "1.0 - 2.0 g/ml per Litre",
      dosagePerAcre: "200 ml - 400 g in 200 Litres water",
      phiDays: 3,
      cibrcApproved: true
    },
    prevention: {
      en: "Stake plants to keep foliage off ground. Use drip irrigation instead of overhead sprinklers. Rotate with maize, pulses, or cereals for 2-3 seasons.",
      mr: "झाडांना काठ्या व तारेचा आधार (स्टेकिंग) द्यावा. स्प्रिंकलर ऐवजी ठिबक सिंचनाचा वापर करावा. मका, कडधान्ये किंवा तृणधान्यांसोबत फेरपालट करावी.",
      hi: "पौधों को बांस व सुतली से सहारा (स्टेकिंग) दें। ड्रिप सिंचाई का प्रयोग करें। मक्का या दालों के साथ २-३ सीजन फसल चक्र अपनाएं।"
    },
    sourceReference: {
      institution: "ICAR - Indian Institute of Horticultural Research (IIHR), Bengaluru",
      document: "Tomato Crop Protection & IPM Guidelines"
    }
  },

  "tomato_late_blight": {
    crop: "Tomato",
    cropMarathi: "टोमॅटो",
    cropHindi: "टमाटर",
    diseaseName: "Tomato Late Blight",
    diseaseNameMarathi: "टोमॅटोवरील उशिरा येणारा करपा (लेट ब्लाइट)",
    diseaseNameHindi: "टमाटर का पछेती झुलसा (लेट ब्लाइट)",
    pathogen: "Oomycete (Phytophthora infestans)",
    symptoms: {
      en: "Large, dark olive-green to black greasy lesions on leaves and stems. White mildew growth appears on undersides during high humidity and cool fog. Fruits develop firm, dark brown greasy patches.",
      mr: "पानांवर आणि खोडावर मोठे, तेलकट काळे किंवा गडद तपकिरी डाग पडतात. दमट हवेत पानाच्या खाली पांढरी बुरशी वाढते. फळांवर टणक तपकिरी चट्टे पडून फळे सडतात.",
      hi: "पत्तियों व तनों पर बड़े तेलिया काले-भूरे धब्बे बनते हैं। अत्यधिक नमी में पत्तियों के नीचे सफेद फफूंद दिखाई देती है। फलों पर सख्त भूरे धब्बे पड़ जाते हैं।"
    },
    organicTreatment: {
      en: "Spray Bordeaux Mixture (1%) or Copper Oxychloride 50% WP @ 2.5 g/L preventively. Remove and deeply bury infected fruits and foliage immediately.",
      mr: "प्रतिबंधात्मक म्हणून १% बोर्डो मिश्रण किंवा कॉपर ऑक्सिक्लोराईड ५०% WP २.५ ग्रॅम/लिटर फवारावे. बाधित फळे व पाने ताबडतोब जमिनीत गाडून नष्ट करावीत.",
      hi: "रोकथाम के लिए १% बोर्डो मिश्रण या कॉपर ऑक्सीक्लोराइड ५०% WP २.५ ग्राम/लीटर का छिड़काव करें। संक्रमित फलों व पत्तियों को तुरंत नष्ट करें।"
    },
    chemicalTreatment: {
      en: "Spray Metalaxyl-M 4% + Mancozeb 64% WP @ 2.5 g/L (500 g/acre) OR Mandipropamid 23.4% SC @ 0.8 ml/L (160 ml/acre) OR Cymoxanil 8% + Mancozeb 64% WP @ 2.5 g/L.",
      mr: "मेटॅलॅक्सिल-एम ४% + मॅन्कोझेब ६४% WP २.५ ग्रॅम/लिटर (५०० ग्रॅम/एकर) किंवा मँडिप्रोपॅमिड २३.४% SC ०.८ मिली/लिटर (१६० मिली/एकर) फवारावे.",
      hi: "मेटालेक्सिल-एम ४% + मैंकोजेब ६४% WP २.५ ग्राम/लीटर (५०० ग्राम/एकड़) या मैंडीप्रोपामिड २३.४% SC ०.८ मिली/लीटर (१६० मिली/एकड़) का छिड़काव करें।",
      activeIngredient: "Metalaxyl-M 4% + Mancozeb 64% WP / Mandipropamid 23.4% SC",
      dosagePerLiter: "0.8 - 2.5 g/ml per Litre",
      dosagePerAcre: "160 ml - 500 g in 200 Litres water",
      phiDays: 5,
      cibrcApproved: true
    },
    prevention: {
      en: "Avoid overhead irrigation. Ensure excellent field drainage. Plant resistant hybrids. Destroy volunteer solanaceous weed hosts.",
      mr: "पानाचा पृष्ठभाग ओला राहील अशी तुषार सिंचन पद्धत टाळावी. शेतात पाण्याचा उत्तम निचरा ठेवावा. सोबतीला बटाटा पीक लावणे टाळावे.",
      hi: "फव्वारा सिंचाई से बचें। खेत में जल निकासी की उत्तम व्यवस्था रखें। आलू के पास टमाटर न लगाएं।"
    },
    sourceReference: {
      institution: "ICAR - Indian Institute of Horticultural Research (IIHR), Bengaluru",
      document: "Management of Late Blight in Solanaceous Crops"
    }
  },

  "cotton_bacterial_blight": {
    crop: "Cotton",
    cropMarathi: "कापूस",
    cropHindi: "कपास",
    diseaseName: "Cotton Bacterial Blight (Angular Leaf Spot / Blackarm)",
    diseaseNameMarathi: "कापसावरील करपा / कोनीय ठिपके (बॅक्टेरियल ब्लाइट / काळा दंड)",
    diseaseNameHindi: "कपास का जीवाणु झुलसा / कोणीय धब्बा रोग (ब्लैक आर्म)",
    pathogen: "Bacterium (Xanthomonas citri pv. malvacearum)",
    symptoms: {
      en: "Small, angular, water-soaked translucent spots bounded by leaf veins on leaves, turning dark brown to black (Angular Leaf Spot). Elongated black lesions on stems causing lodging (Blackarm stage) and water-soaked dark spots on bolls.",
      mr: "पानांच्या शिरांमुळे मर्यादित राहिलेले कोनीय, पाणथळ व काळपट तपकिरी ठिपके पडतात. खोडावर व फांद्यांवर काळे चट्टे पडून फांद्या मोडतात (काळा दंड). बोंडांवर खोलगट डाग पडून कापूस खराब होतो.",
      hi: "पत्तियों की नसों से घिरे कोणीय, पानीदार काले-भूरे धब्बे बनते हैं। तने व शाखाओं पर काले घाव बनते हैं जिससे टहनियां टूट जाती हैं (ब्लैक आर्म)। गूलरों पर धब्बे पड़ते हैं।"
    },
    organicTreatment: {
      en: "Seed treatment with Pseudomonas fluorescens @ 10 g/kg seed. Foliar spray of Pseudomonas fluorescens @ 5 g/L. Spray cow urine solution (10%) with neem leaf extract.",
      mr: "बियाण्यास स्युडोमोनास फ्लुरोसेन्स १० ग्रॅम/किलोची बीजप्रक्रिया करावी. स्युडोमोनास फ्लुरोसेन्स ५ ग्रॅम/लिटर किंवा १०% गोमूत्र अर्क फवारावा.",
      hi: "स्यूडोमोनास फ्लोरोसेंस १० ग्राम/किग्रा बीज से बीज उपचार करें। स्यूडोमोनास ५ ग्राम/लीटर या १०% गोमूत्र अर्क का छिड़काव करें।"
    },
    chemicalTreatment: {
      en: "Spray Copper Oxychloride 50% WP @ 2.5 - 3.0 g/L (500-600 g/acre) + Streptocycline (Streptomycin sulphate 90% + Tetracycline hydrochloride 10%) @ 1.0 g per 10 Litres water (10-12 g/acre in 150-200 L water).",
      mr: "कॉपर ऑक्सिक्लोराईड ५०% WP २.५ ते ३.० ग्रॅम/लिटर (५००-६०० ग्रॅम/एकर) + स्ट्रेप्टोसायक्लिन १ ग्रॅम प्रति १० लिटर पाणी (१०-१२ ग्रॅम/एकर) एकत्र करून फवारावे.",
      hi: "कॉपर ऑक्सीक्लोराइड ५०% WP २.५ से ३.० ग्राम/लीटर (५००-६०० ग्राम/एकड़) + स्ट्रेप्टोसाइक्लिन १ ग्राम प्रति १० लीटर पानी (१०-१२ ग्राम/एकड़) का छिड़काव करें।",
      activeIngredient: "Copper Oxychloride 50% WP + Streptocycline",
      dosagePerLiter: "2.5 g COC + 0.1 g Streptocycline per Litre",
      dosagePerAcre: "500 g COC + 10 g Streptocycline in 200 L water",
      phiDays: 14,
      cibrcApproved: true
    },
    prevention: {
      en: "Acid delinting of cottonseed (100 ml conc. H2SO4 per kg fuzzy seed). Grow resistant Bt cotton hybrids. Avoid excessive vegetative growth by balancing nitrogen.",
      mr: "कापूस बियाण्याची आम्ल प्रक्रिया (ऍसिड डेलिंटिंग) करावी. रोगास प्रतिकारक संकरित वाण वापरावेत. नत्राचा (युरिया) अतिवापर टाळावा.",
      hi: "कपास के बीज की एसिड डीलिंटिंग करें। रोग प्रतिरोधी संकर बीटी किस्मों का चयन करें। यूरिया का अत्यधिक उपयोग न करें।"
    },
    sourceReference: {
      institution: "ICAR - Central Institute for Cotton Research (CICR), Nagpur",
      document: "Integrated Disease Management in Bt Cotton & CIBRC Schedules"
    }
  },

  "soybean_rust": {
    crop: "Soybean",
    cropMarathi: "सोयाबीन",
    cropHindi: "सोयाबीन",
    diseaseName: "Soybean Rust (Asian Soybean Rust)",
    diseaseNameMarathi: "सोयाबीनवरील तांबेरा (रस्ट)",
    diseaseNameHindi: "सोयाबीन का गेरुई / रतुआ (रस्ट)",
    pathogen: "Fungus (Phakopsora pachyrhizi)",
    symptoms: {
      en: "Small, pinpoint chlorotic to dark reddish-brown lesions mostly on lower leaf undersides with raised volcano-shaped pustules releasing tan powdery spores. Severe defoliation and premature pod maturation with shriveled grains.",
      mr: "पानाच्या खालच्या बाजूला बारीक सुईच्या टोकासारखे तांबूस तपकिरी ठिपके पडतात व त्यातून तांबूस रंगाची भुकटी (बिजाणू) बाहेर पडते. पाने पिवळी पडून गळतात आणि शेंगांमधील दाणे बारीक राहतात.",
      hi: "पत्तियों की निचली सतह पर छोटे सुई की नोक जैसे लाल-भूरे उभरे हुए दाने बनते हैं जिनसे भूरी धूल निकलती है। पत्तियां झड़ जाती हैं और फलियों में दाने सिकुड़ जाते हैं।"
    },
    organicTreatment: {
      en: "Foliar spray of Trichoderma harzianum @ 5 g/L at early vegetative stage. Apply 5% Neem Seed Kernel Extract (NSKE) preventively at canopy closure.",
      mr: "सुरुवातीच्या काळात ट्रायकोडर्मा हार्झियानम ५ ग्रॅम/लिटर फवारावे. पीक दाट होण्याच्या वेळी ५% निंबोळी अर्क (NSKE) प्रतिबंधक म्हणून फवारावा.",
      hi: "शुरुआती अवस्था में ट्राइकोडर्मा ५ ग्राम/लीटर का छिड़काव करें। ५% नीम बीज अर्क (NSKE) का छिड़काव करें।"
    },
    chemicalTreatment: {
      en: "Spray Hexaconazole 5% EC @ 2.0 ml/L (400 ml/acre) OR Tebuconazole 25.9% EC @ 1.25 ml/L (250 ml/acre) OR Pyraclostrobin 20% WG @ 1.0 g/L (200 g/acre in 200 L water) at very first appearance of pustules.",
      mr: "रोगाची लक्षणे दिसताच हेक्साकोनाझोल ५% EC २ मिली/लिटर (४०० मिली/एकर) किंवा टेब्युकोनाझोल २५.९% EC १.२५ मिली/लिटर (२५० मिली/एकर) किंवा पायराक्लोस्ट्रॉबिन २०% WG १ ग्रॅम/लिटर फवारावे.",
      hi: "पहला लक्षण दिखते ही हेक्साकोनाजोल ५% EC २ मिली/लीटर (४०० मिली/एकड़) या टेबुकोनाजोल २५.९% EC १.२५ मिली/लीटर (२५० मिली/एकड़) या पायराक्लोस्ट्रोबिन २०% WG १ ग्राम/लीटर का छिड़काव करें।",
      activeIngredient: "Tebuconazole 25.9% EC / Hexaconazole 5% EC",
      dosagePerLiter: "1.25 - 2.0 ml per Litre",
      dosagePerAcre: "250 - 400 ml in 200 Litres water",
      phiDays: 15,
      cibrcApproved: true
    },
    prevention: {
      en: "Sow at optimum spacing (45 x 5 cm) using Broad Bed Furrow (BBF) to reduce humidity within canopy. Plant rust-tolerant varieties (e.g., JS 335, Phule Agrani / KDS 344).",
      mr: "बीबीएफ (रुंद वरंबा सरी) पद्धतीने लागवड करावी जेणेकरून हवा खेळती राहील. तांबेरा सहनशील वाण (उदा. फुले अग्रणी / KDS ३४४) वापरावेत.",
      hi: "बीबीएफ पद्धति से बुवाई करें जिससे पौधों में हवा का आवागमन बना रहे। गेरुई प्रतिरोधी किस्मों (जैसे फुले अग्रणी) का प्रयोग करें।"
    },
    sourceReference: {
      institution: "ICAR - Indian Institute of Soybean Research (IISR), Indore",
      document: "Management of Asian Soybean Rust in India"
    }
  },

  "wheat_yellow_rust": {
    crop: "Wheat",
    cropMarathi: "गहू",
    cropHindi: "गेहूं",
    diseaseName: "Wheat Yellow Rust (Stripe Rust)",
    diseaseNameMarathi: "गव्हावरील पिवळा तांबेरा (स्ट्राइप रस्ट)",
    diseaseNameHindi: "गेहूं का पीला रतुआ (स्ट्राइप रस्ट)",
    pathogen: "Fungus (Puccinia striiformis f. sp. tritici)",
    symptoms: {
      en: "Bright yellow to orange-yellow powdery pustules arranged in prominent parallel stripes/lines along leaf veins. When touched, yellow powder adheres to fingers. Severe attack causes drying of leaves and shriveled grain.",
      mr: "पानांवर शिरांच्या दिशेने समांतर पिवळ्या रंगाच्या पट्ट्यांमध्ये बारीक फोड (पस्ट्युल्स) दिसतात. बोटाने पुसल्यास पिवळी भुकटी हाताला लागते. पाने सुकतात व दाणे बारीक भरतात.",
      hi: "पत्तियों की नसों के समानांतर चमकीली पीली पट्टियों में कतारबद्ध छोटे दाने बनते हैं। छूने पर हाथ पर पीला पाउडर लग जाता है। पत्तियां सूख जाती हैं और दाना कमजोर रह जाता है।"
    },
    organicTreatment: {
      en: "Destroy infected self-sown volunteer wheat plants in offseason. Spray Trichoderma viride @ 5 g/L preventively at jointing stage. Maintain balanced potash levels.",
      mr: "हंगामाव्यतिरिक्त शेतात उगवलेली गव्हाची रोपे नष्ट करावीत. कांडी धरण्याच्या अवस्थेत ट्रायकोडर्मा ५ ग्रॅम/लिटर फवारावे. पोटॅश खताचा योग्य वापर करावा.",
      hi: "मौसम के बाहर उगे गेहूं के पौधों को नष्ट करें। ट्राइकोडर्मा ५ ग्राम/लीटर का छिड़काव करें। पोटाश का संतुलित प्रयोग करें।"
    },
    chemicalTreatment: {
      en: "Spray Propiconazole 25% EC (Tilt) @ 1.0 ml/L (200 ml/acre in 200 L water) OR Tebuconazole 25.9% EC @ 1.0 ml/L at first focal patch appearance. Repeat after 15 days if cloudy weather persists.",
      mr: "पहिला पिवळा पट्टा दिसताच प्रोपिकोनाझोल २५% EC (टिल्ट) १ मिली/लिटर (२०० मिली/एकर) किंवा टेब्युकोनाझोल २५.९% EC १ मिली/लिटर २०० लिटर पाण्यात मिसळून फवारावे.",
      hi: "पीला रतुआ का पहला धब्बा दिखते ही प्रोपिकोनाजोल २५% EC (टिल्ट) १ मिली/लीटर (२०० मिली/एकड़) या टेबुकोनाजोल २५.९% EC १ मिली/लीटर २०० लीटर पानी में मिलाकर छिड़कें।",
      activeIngredient: "Propiconazole 25% EC / Tebuconazole 25.9% EC",
      dosagePerLiter: "1.0 ml per Litre",
      dosagePerAcre: "200 ml in 200 Litres water",
      phiDays: 30,
      cibrcApproved: true
    },
    prevention: {
      en: "Grow stripe-rust resistant varieties recommended for your zone (e.g., HD 3086, DBW 187, DBW 222, PBW 725). Avoid delayed sowing after November.",
      mr: "भाकृअनुप शिफारशीत तांबेरा प्रतिकारक वाण (HD ३०८६, DBW १८७, DBW २२२) वापरावेत. १५ नोव्हेंबरनंतर उशिरा पेरणी करणे टाळावे.",
      hi: "पीला रतुआ प्रतिरोधी किस्मों (जैसे HD ३०८६, DBW १८७, DBW २२२) की समय पर (नवंबर) बुवाई करें। देर से बुवाई से बचें।"
    },
    sourceReference: {
      institution: "ICAR - Indian Institute of Wheat and Barley Research (IIWBR), Karnal",
      document: "Yellow Rust Management Protocol & Advisory for Northern/Central Plains"
    }
  },

  "maize_maydis_blight": {
    crop: "Maize",
    cropMarathi: "मका",
    cropHindi: "मक्का",
    diseaseName: "Maize Maydis Leaf Blight (Southern Corn Leaf Blight)",
    diseaseNameMarathi: "मक्यावरील मेडीस करपा (मेडीस लीफ ब्लाइट)",
    diseaseNameHindi: "मक्का का मेडीस झुलसा (मेडीस लीफ ब्लाइट)",
    pathogen: "Fungus (Bipolaris maydis / Cochliobolus heterostrophus)",
    symptoms: {
      en: "Small, oval to rectangular diamond-shaped tan to buff lesions on leaves bounded by veins. Lesions coalesce into large dead necrotic areas, causing premature leaf drying and reduced ear weight.",
      mr: "पानांवर लंबगोलाकार ते चौकोनी तपकिरी रंगाचे डाग पडतात. हे डाग एकत्र येऊन मोठी पाने करपतात, ज्यामुळे दाण्यांचे वजन व उत्पादनात मोठी घट होते.",
      hi: "पत्तियों पर अंडाकार से आयताकार हल्के भूरे रंग के धब्बे बनते हैं जो नसों के बीच सीमित होते हैं। बाद में धब्बे मिलकर पूरी पत्ती को झुलसा देते हैं जिससे भुट्टे का वजन घट जाता है।"
    },
    organicTreatment: {
      en: "Foliar spray of Trichoderma harzianum @ 5 g/L or Pseudomonas fluorescens @ 5 ml/L. Deep summer plowing to bury previous crop residues.",
      mr: "ट्रायकोडर्मा ५ ग्रॅम/लिटर किंवा स्युडोमोनास ५ मिली/लिटर फवारावे. उन्हाळ्यात खोल नांगरट करून पूर्वीचे पिकाचे अवशेष जमिनीत गाडून टाकावेत.",
      hi: "ट्राइकोडर्मा ५ ग्राम/लीटर या स्यूडोमोनास ५ मिली/लीटर का छिड़काव करें। गर्मियों में गहरी जुताई करें ताकि पुराने फसल अवशेष नष्ट हो जाएं।"
    },
    chemicalTreatment: {
      en: "Spray Mancozeb 75% WP @ 2.0 - 2.5 g/L (400-500 g/acre in 200 L water) OR Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1.0 ml/L (200 ml/acre) at first symptom appearance.",
      mr: "मॅन्कोझेब ७५% WP २ ते २.५ ग्रॅम/लिटर (४००-५०० ग्रॅम/एकर) किंवा अझॉक्सिस्ट्रॉबिन + डायफेनोकोनाझोल १ मिली/लिटर (२०० मिली/एकर) पाण्यात मिसळून फवारावे.",
      hi: "मैंकोजेब ७५% WP २ से २.५ ग्राम/लीटर (४००-५०० ग्राम/एकड़) या एजॉक्सीस्ट्रोबिन + डाइफेनोकोनाजोल १ मिली/लीटर (२०० मिली/एकड़) का छिड़काव करें।",
      activeIngredient: "Mancozeb 75% WP / Azoxystrobin + Difenoconazole",
      dosagePerLiter: "1.0 - 2.5 g/ml per Litre",
      dosagePerAcre: "200 ml - 500 g in 200 Litres water",
      phiDays: 14,
      cibrcApproved: true
    },
    prevention: {
      en: "Use certified hybrid seeds (e.g., DMRH 1308, PMH series). Avoid dense plant populations. Practice crop rotation with legumes (soybean, gram).",
      mr: "प्रमाणित संकरित वाण वापरावेत. झाडांची अतिघनता टाळावी. कडधान्य पिकांसोबत (सोयाबीन, हरभरा) फेरपालट करावी.",
      hi: "प्रमाणित संकर बीज लगाएं। पौधों की उचित दूरी रखें। दलहनी फसलों के साथ फसल चक्र अपनाएं।"
    },
    sourceReference: {
      institution: "ICAR - Indian Institute of Maize Research (IIMR), Ludhiana",
      document: "Maize Pathology & Foliar Blight Management Guidelines"
    }
  }
};
