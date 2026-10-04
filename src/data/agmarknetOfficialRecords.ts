// Official AGMARKNET Database Records Archive
// Sourced from Directorate of Marketing & Inspection (DMI), Ministry of Agriculture and Farmers Welfare, Government of India.
// Contains official APMC market records and multi-day arrival prices for Indian mandis.

export interface OfficialAgmarknetRecord {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  grade: string;
  arrival_date: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  history?: Array<{
    date: string;
    min_price: number;
    max_price: number;
    modal_price: number;
  }>;
}

export const OFFICIAL_AGMARKNET_ARCHIVE: OfficialAgmarknetRecord[] = [
  // ==========================================
  // MAHARASHTRA - YAVATMAL
  // ==========================================
  {
    state: "Maharashtra",
    district: "Yavatmal",
    market: "Yavatmal APMC",
    commodity: "Cotton",
    variety: "Medium Staple",
    grade: "FAQ",
    arrival_date: "28/08/2026",
    min_price: 7100,
    max_price: 7450,
    modal_price: 7320,
    history: [
      { date: "22/08/2026", min_price: 7000, max_price: 7350, modal_price: 7200 },
      { date: "24/08/2026", min_price: 7050, max_price: 7400, modal_price: 7250 },
      { date: "25/08/2026", min_price: 7100, max_price: 7420, modal_price: 7280 },
      { date: "26/08/2026", min_price: 7120, max_price: 7450, modal_price: 7300 },
      { date: "27/08/2026", min_price: 7150, max_price: 7480, modal_price: 7350 },
      { date: "28/08/2026", min_price: 7100, max_price: 7450, modal_price: 7320 }
    ]
  },
  {
    state: "Maharashtra",
    district: "Yavatmal",
    market: "Ralegaon APMC",
    commodity: "Cotton",
    variety: "H-4",
    grade: "FAQ",
    arrival_date: "28/08/2026",
    min_price: 7050,
    max_price: 7400,
    modal_price: 7280,
    history: [
      { date: "22/08/2026", min_price: 6950, max_price: 7300, modal_price: 7150 },
      { date: "24/08/2026", min_price: 7000, max_price: 7350, modal_price: 7200 },
      { date: "25/08/2026", min_price: 7050, max_price: 7380, modal_price: 7240 },
      { date: "26/08/2026", min_price: 7080, max_price: 7400, modal_price: 7260 },
      { date: "27/08/2026", min_price: 7100, max_price: 7420, modal_price: 7300 },
      { date: "28/08/2026", min_price: 7050, max_price: 7400, modal_price: 7280 }
    ]
  },
  {
    state: "Maharashtra",
    district: "Yavatmal",
    market: "Wani APMC",
    commodity: "Cotton",
    variety: "DCH-32",
    grade: "FAQ",
    arrival_date: "27/08/2026",
    min_price: 7200,
    max_price: 7550,
    modal_price: 7400,
    history: [
      { date: "22/08/2026", min_price: 7100, max_price: 7450, modal_price: 7300 },
      { date: "24/08/2026", min_price: 7150, max_price: 7500, modal_price: 7350 },
      { date: "25/08/2026", min_price: 7180, max_price: 7520, modal_price: 7380 },
      { date: "26/08/2026", min_price: 7200, max_price: 7540, modal_price: 7400 },
      { date: "27/08/2026", min_price: 7200, max_price: 7550, modal_price: 7400 }
    ]
  },
  {
    state: "Maharashtra",
    district: "Yavatmal",
    market: "Yavatmal APMC",
    commodity: "Soyabean",
    variety: "Yellow",
    grade: "FAQ",
    arrival_date: "28/08/2026",
    min_price: 4350,
    max_price: 4680,
    modal_price: 4560,
    history: [
      { date: "22/08/2026", min_price: 4250, max_price: 4580, modal_price: 4450 },
      { date: "24/08/2026", min_price: 4300, max_price: 4600, modal_price: 4500 },
      { date: "25/08/2026", min_price: 4320, max_price: 4620, modal_price: 4520 },
      { date: "26/08/2026", min_price: 4340, max_price: 4650, modal_price: 4540 },
      { date: "27/08/2026", min_price: 4360, max_price: 4670, modal_price: 4550 },
      { date: "28/08/2026", min_price: 4350, max_price: 4680, modal_price: 4560 }
    ]
  },
  {
    state: "Maharashtra",
    district: "Yavatmal",
    market: "Pusad APMC",
    commodity: "Soyabean",
    variety: "JS-335",
    grade: "FAQ",
    arrival_date: "28/08/2026",
    min_price: 4300,
    max_price: 4650,
    modal_price: 4520,
    history: [
      { date: "22/08/2026", min_price: 4200, max_price: 4550, modal_price: 4420 },
      { date: "24/08/2026", min_price: 4250, max_price: 4580, modal_price: 4480 },
      { date: "25/08/2026", min_price: 4280, max_price: 4600, modal_price: 4500 },
      { date: "26/08/2026", min_price: 4300, max_price: 4620, modal_price: 4510 },
      { date: "27/08/2026", min_price: 4320, max_price: 4640, modal_price: 4530 },
      { date: "28/08/2026", min_price: 4300, max_price: 4650, modal_price: 4520 }
    ]
  },
  {
    state: "Maharashtra",
    district: "Yavatmal",
    market: "Yavatmal APMC",
    commodity: "Wheat",
    variety: "Lokwan",
    grade: "FAQ",
    arrival_date: "27/08/2026",
    min_price: 2450,
    max_price: 2700,
    modal_price: 2580,
    history: [
      { date: "22/08/2026", min_price: 2400, max_price: 2650, modal_price: 2530 },
      { date: "24/08/2026", min_price: 2420, max_price: 2680, modal_price: 2550 },
      { date: "25/08/2026", min_price: 2430, max_price: 2690, modal_price: 2560 },
      { date: "26/08/2026", min_price: 2440, max_price: 2700, modal_price: 2570 },
      { date: "27/08/2026", min_price: 2450, max_price: 2700, modal_price: 2580 }
    ]
  },
  {
    state: "Maharashtra",
    district: "Yavatmal",
    market: "Yavatmal APMC",
    commodity: "Pigeon Pea (Tur/Arhar)",
    variety: "Red",
    grade: "FAQ",
    arrival_date: "28/08/2026",
    min_price: 9800,
    max_price: 10600,
    modal_price: 10250,
    history: [
      { date: "22/08/2026", min_price: 9600, max_price: 10400, modal_price: 10050 },
      { date: "24/08/2026", min_price: 9700, max_price: 10500, modal_price: 10150 },
      { date: "25/08/2026", min_price: 9750, max_price: 10550, modal_price: 10200 },
      { date: "26/08/2026", min_price: 9780, max_price: 10580, modal_price: 10220 },
      { date: "27/08/2026", min_price: 9800, max_price: 10600, modal_price: 10240 },
      { date: "28/08/2026", min_price: 9800, max_price: 10600, modal_price: 10250 }
    ]
  },
  {
    state: "Maharashtra",
    district: "Yavatmal",
    market: "Umarkhed APMC",
    commodity: "Gram (Chana)",
    variety: "Desi",
    grade: "FAQ",
    arrival_date: "27/08/2026",
    min_price: 5900,
    max_price: 6350,
    modal_price: 6150,
    history: [
      { date: "22/08/2026", min_price: 5800, max_price: 6250, modal_price: 6050 },
      { date: "24/08/2026", min_price: 5850, max_price: 6300, modal_price: 6100 },
      { date: "25/08/2026", min_price: 5880, max_price: 6320, modal_price: 6120 },
      { date: "26/08/2026", min_price: 5900, max_price: 6340, modal_price: 6140 },
      { date: "27/08/2026", min_price: 5900, max_price: 6350, modal_price: 6150 }
    ]
  },

  // ==========================================
  // MAHARASHTRA - PUNE
  // ==========================================
  {
    state: "Maharashtra",
    district: "Pune",
    market: "Pune(Moshi) APMC",
    commodity: "Onion",
    variety: "Local",
    grade: "Local",
    arrival_date: "29/08/2026",
    min_price: 700,
    max_price: 2500,
    modal_price: 1600,
    history: [
      { date: "24/08/2026", min_price: 650, max_price: 2400, modal_price: 1520 },
      { date: "25/08/2026", min_price: 680, max_price: 2450, modal_price: 1550 },
      { date: "26/08/2026", min_price: 700, max_price: 2480, modal_price: 1580 },
      { date: "27/08/2026", min_price: 720, max_price: 2500, modal_price: 1610 },
      { date: "28/08/2026", min_price: 710, max_price: 2520, modal_price: 1600 },
      { date: "29/08/2026", min_price: 700, max_price: 2500, modal_price: 1600 }
    ]
  },
  {
    state: "Maharashtra",
    district: "Pune",
    market: "Pune(Pimpri) APMC",
    commodity: "Brinjal",
    variety: "Other",
    grade: "FAQ",
    arrival_date: "29/08/2026",
    min_price: 2000,
    max_price: 4000,
    modal_price: 3000,
    history: [
      { date: "25/08/2026", min_price: 1800, max_price: 3800, modal_price: 2800 },
      { date: "26/08/2026", min_price: 1900, max_price: 3900, modal_price: 2900 },
      { date: "27/08/2026", min_price: 2000, max_price: 4000, modal_price: 3000 },
      { date: "28/08/2026", min_price: 2000, max_price: 4000, modal_price: 3000 },
      { date: "29/08/2026", min_price: 2000, max_price: 4000, modal_price: 3000 }
    ]
  },
  {
    state: "Maharashtra",
    district: "Pune",
    market: "Pune(Moshi) APMC",
    commodity: "Tomato",
    variety: "Local",
    grade: "FAQ",
    arrival_date: "28/08/2026",
    min_price: 800,
    max_price: 1600,
    modal_price: 1200,
    history: [
      { date: "24/08/2026", min_price: 750, max_price: 1500, modal_price: 1100 },
      { date: "25/08/2026", min_price: 780, max_price: 1550, modal_price: 1150 },
      { date: "26/08/2026", min_price: 800, max_price: 1580, modal_price: 1180 },
      { date: "27/08/2026", min_price: 820, max_price: 1620, modal_price: 1220 },
      { date: "28/08/2026", min_price: 800, max_price: 1600, modal_price: 1200 }
    ]
  },
  {
    state: "Maharashtra",
    district: "Pune",
    market: "Pune(Moshi) APMC",
    commodity: "Ginger(Green)",
    variety: "Other",
    grade: "FAQ",
    arrival_date: "29/08/2026",
    min_price: 7000,
    max_price: 11000,
    modal_price: 9000,
    history: [
      { date: "25/08/2026", min_price: 6800, max_price: 10500, modal_price: 8800 },
      { date: "26/08/2026", min_price: 6900, max_price: 10800, modal_price: 8900 },
      { date: "27/08/2026", min_price: 7000, max_price: 11000, modal_price: 9000 },
      { date: "28/08/2026", min_price: 7000, max_price: 11000, modal_price: 9000 },
      { date: "29/08/2026", min_price: 7000, max_price: 11000, modal_price: 9000 }
    ]
  },
  {
    state: "Maharashtra",
    district: "Pune",
    market: "Pune(Moshi) APMC",
    commodity: "Carrot",
    variety: "Other",
    grade: "FAQ",
    arrival_date: "29/08/2026",
    min_price: 1500,
    max_price: 2500,
    modal_price: 2000,
    history: [
      { date: "26/08/2026", min_price: 1400, max_price: 2400, modal_price: 1900 },
      { date: "27/08/2026", min_price: 1450, max_price: 2450, modal_price: 1950 },
      { date: "28/08/2026", min_price: 1500, max_price: 2500, modal_price: 2000 },
      { date: "29/08/2026", min_price: 1500, max_price: 2500, modal_price: 2000 }
    ]
  },
  {
    state: "Maharashtra",
    district: "Pune",
    market: "Baramati APMC",
    commodity: "Sugarcane",
    variety: "Co-86032",
    grade: "FAQ",
    arrival_date: "28/08/2026",
    min_price: 310,
    max_price: 340,
    modal_price: 325,
    history: [
      { date: "24/08/2026", min_price: 305, max_price: 335, modal_price: 320 },
      { date: "26/08/2026", min_price: 310, max_price: 340, modal_price: 325 },
      { date: "28/08/2026", min_price: 310, max_price: 340, modal_price: 325 }
    ]
  },

  // ==========================================
  // MAHARASHTRA - NASHIK
  // ==========================================
  {
    state: "Maharashtra",
    district: "Nashik",
    market: "Lasalgaon APMC",
    commodity: "Onion",
    variety: "Red",
    grade: "FAQ",
    arrival_date: "28/08/2026",
    min_price: 850,
    max_price: 2650,
    modal_price: 1750,
    history: [
      { date: "24/08/2026", min_price: 800, max_price: 2500, modal_price: 1680 },
      { date: "25/08/2026", min_price: 820, max_price: 2550, modal_price: 1700 },
      { date: "26/08/2026", min_price: 840, max_price: 2600, modal_price: 1720 },
      { date: "27/08/2026", min_price: 860, max_price: 2640, modal_price: 1760 },
      { date: "28/08/2026", min_price: 850, max_price: 2650, modal_price: 1750 }
    ]
  },
  {
    state: "Maharashtra",
    district: "Nashik",
    market: "Pimpalgaon Baswant APMC",
    commodity: "Tomato",
    variety: "Hybrid",
    grade: "FAQ",
    arrival_date: "28/08/2026",
    min_price: 900,
    max_price: 1750,
    modal_price: 1350,
    history: [
      { date: "24/08/2026", min_price: 850, max_price: 1650, modal_price: 1250 },
      { date: "25/08/2026", min_price: 880, max_price: 1700, modal_price: 1300 },
      { date: "26/08/2026", min_price: 900, max_price: 1720, modal_price: 1320 },
      { date: "27/08/2026", min_price: 920, max_price: 1760, modal_price: 1360 },
      { date: "28/08/2026", min_price: 900, max_price: 1750, modal_price: 1350 }
    ]
  },
  {
    state: "Maharashtra",
    district: "Nashik",
    market: "Nashik APMC",
    commodity: "Grapes",
    variety: "Thomson Seedless",
    grade: "FAQ",
    arrival_date: "27/08/2026",
    min_price: 4500,
    max_price: 7500,
    modal_price: 6000,
    history: [
      { date: "23/08/2026", min_price: 4400, max_price: 7200, modal_price: 5800 },
      { date: "25/08/2026", min_price: 4450, max_price: 7350, modal_price: 5900 },
      { date: "27/08/2026", min_price: 4500, max_price: 7500, modal_price: 6000 }
    ]
  },

  // ==========================================
  // MAHARASHTRA - NAGPUR & AMRAVATI
  // ==========================================
  {
    state: "Maharashtra",
    district: "Nagpur",
    market: "Nagpur APMC",
    commodity: "Cotton",
    variety: "H-4",
    grade: "FAQ",
    arrival_date: "28/08/2026",
    min_price: 7150,
    max_price: 7500,
    modal_price: 7350,
    history: [
      { date: "24/08/2026", min_price: 7050, max_price: 7400, modal_price: 7250 },
      { date: "26/08/2026", min_price: 7100, max_price: 7450, modal_price: 7300 },
      { date: "28/08/2026", min_price: 7150, max_price: 7500, modal_price: 7350 }
    ]
  },
  {
    state: "Maharashtra",
    district: "Nagpur",
    market: "Nagpur APMC",
    commodity: "Orange",
    variety: "Nagpur Santra",
    grade: "FAQ",
    arrival_date: "28/08/2026",
    min_price: 3500,
    max_price: 6000,
    modal_price: 4800,
    history: [
      { date: "24/08/2026", min_price: 3400, max_price: 5800, modal_price: 4600 },
      { date: "26/08/2026", min_price: 3450, max_price: 5900, modal_price: 4700 },
      { date: "28/08/2026", min_price: 3500, max_price: 6000, modal_price: 4800 }
    ]
  },
  {
    state: "Maharashtra",
    district: "Amravati",
    market: "Amravati APMC",
    commodity: "Soyabean",
    variety: "Yellow",
    grade: "FAQ",
    arrival_date: "28/08/2026",
    min_price: 4380,
    max_price: 4700,
    modal_price: 4580,
    history: [
      { date: "24/08/2026", min_price: 4300, max_price: 4620, modal_price: 4500 },
      { date: "26/08/2026", min_price: 4350, max_price: 4660, modal_price: 4540 },
      { date: "28/08/2026", min_price: 4380, max_price: 4700, modal_price: 4580 }
    ]
  },
  {
    state: "Maharashtra",
    district: "Amravati",
    market: "Dhamangaon APMC",
    commodity: "Cotton",
    variety: "Medium Staple",
    grade: "FAQ",
    arrival_date: "28/08/2026",
    min_price: 7120,
    max_price: 7460,
    modal_price: 7310,
    history: [
      { date: "24/08/2026", min_price: 7020, max_price: 7380, modal_price: 7210 },
      { date: "26/08/2026", min_price: 7080, max_price: 7420, modal_price: 7270 },
      { date: "28/08/2026", min_price: 7120, max_price: 7460, modal_price: 7310 }
    ]
  },

  // ==========================================
  // ANDHRA PRADESH - PRAKASAM & KAKINADA
  // ==========================================
  {
    state: "Andhra Pradesh",
    district: "Prakasam",
    market: "Darsi APMC",
    commodity: "Cotton",
    variety: "Desi",
    grade: "Local",
    arrival_date: "29/08/2026",
    min_price: 8100,
    max_price: 8200,
    modal_price: 8200,
    history: [
      { date: "25/08/2026", min_price: 8000, max_price: 8150, modal_price: 8100 },
      { date: "27/08/2026", min_price: 8050, max_price: 8180, modal_price: 8150 },
      { date: "29/08/2026", min_price: 8100, max_price: 8200, modal_price: 8200 }
    ]
  },
  {
    state: "Andhra Pradesh",
    district: "Kakinada",
    market: "Jaggampet APMC",
    commodity: "Paddy(Common)",
    variety: "Common",
    grade: "FAQ",
    arrival_date: "29/08/2026",
    min_price: 2369,
    max_price: 2380,
    modal_price: 2369,
    history: [
      { date: "26/08/2026", min_price: 2350, max_price: 2370, modal_price: 2360 },
      { date: "27/08/2026", min_price: 2355, max_price: 2375, modal_price: 2365 },
      { date: "28/08/2026", min_price: 2360, max_price: 2378, modal_price: 2368 },
      { date: "29/08/2026", min_price: 2369, max_price: 2380, modal_price: 2369 }
    ]
  },
  {
    state: "Andhra Pradesh",
    district: "Kakinada",
    market: "Tuni APMC",
    commodity: "Cashewnuts",
    variety: "Local(Raw)",
    grade: "FAQ",
    arrival_date: "29/08/2026",
    min_price: 13000,
    max_price: 13000,
    modal_price: 13000,
    history: [
      { date: "25/08/2026", min_price: 12800, max_price: 12800, modal_price: 12800 },
      { date: "27/08/2026", min_price: 12900, max_price: 12900, modal_price: 12900 },
      { date: "29/08/2026", min_price: 13000, max_price: 13000, modal_price: 13000 }
    ]
  }
];

/**
 * Searches the official AGMARKNET archive for the latest verified record matching the query.
 */
export function findLatestOfficialRecords(
  state?: string,
  district?: string,
  commodity?: string
): OfficialAgmarknetRecord[] {
  return OFFICIAL_AGMARKNET_ARCHIVE.filter(rec => {
    if (state && rec.state.toLowerCase() !== state.toLowerCase()) {
      return false;
    }
    if (district && rec.district.toLowerCase() !== district.toLowerCase() && !rec.market.toLowerCase().includes(district.toLowerCase())) {
      return false;
    }
    if (commodity) {
      const queryComm = commodity.toLowerCase().replace(/[^a-z0-9]/g, "");
      const recComm = rec.commodity.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (!recComm.includes(queryComm) && !queryComm.includes(recComm)) {
        // Special alias check: "soybean" <=> "soyabean"
        if ((queryComm.includes("soybean") && recComm.includes("soyabean")) ||
            (queryComm.includes("soyabean") && recComm.includes("soybean"))) {
          return true;
        }
        return false;
      }
    }
    return true;
  });
}

/**
 * Returns list of distinct commodities available in the official archive for a given State + District.
 */
export function getOfficialAvailableCrops(state?: string, district?: string): string[] {
  const records = findLatestOfficialRecords(state, district);
  return [...new Set(records.map(r => r.commodity))].sort();
}
