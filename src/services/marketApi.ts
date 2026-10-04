// Official AGMARKNET Market Prices Provider
// Sourced directly from Directorate of Marketing & Inspection, Ministry of Agriculture and Farmers Welfare, Government of India.
// No mock, simulated, or estimated data is ever generated.

export interface DailyPrice {
  date: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number; // Modal price
  price?: number; // Alias for chart compatibility
}

export interface MarketData {
  id: string;
  state: string;
  district: string;
  mandi: string; // APMC Mandi
  crop: string; // Commodity
  variety?: string; // Crop Variety
  grade?: string; // Grade (FAQ, etc.)
  currentMin: number;
  currentMax: number;
  currentAvg: number; // Modal Price in Rs./Quintal
  lastUpdated: string;
  priceDate: string;
  trend7Days: DailyPrice[];
  isAvailable: boolean;
  source: string;
}

export interface MarketProvider {
  fetchMarketData(state: string, district: string, crop?: string): Promise<MarketData[]>;
  fetchAvailableCrops(state: string, district: string): Promise<string[]>;
}

export interface AgmarknetRawRecord {
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
}

export class AgmarknetMarketProvider implements MarketProvider {
  
  async fetchAvailableCrops(state: string, district: string): Promise<string[]> {
    try {
      const params = new URLSearchParams({
        state,
        district,
        action: "crops",
      });
      const res = await fetch(`/api/market-prices?${params.toString()}`);
      if (!res.ok) return [];
      const json = await res.json();
      return json.crops || [];
    } catch (error) {
      console.error("Failed to fetch available AGMARKNET crops:", error);
      return [];
    }
  }

  async fetchMarketData(state: string, district: string, crop?: string): Promise<MarketData[]> {
    try {
      const params = new URLSearchParams({
        state,
        district,
      });
      if (crop) {
        params.append("commodity", crop);
      }

      const res = await fetch(`/api/market-prices?${params.toString()}`);
      if (!res.ok) {
        if (crop) {
          return [{
            id: `${state}-${district}-${crop}`.toLowerCase().replace(/\s+/g, '-'),
            state,
            district,
            mandi: `${district} APMC`,
            crop,
            variety: "N/A",
            grade: "FAQ",
            currentMin: 0,
            currentMax: 0,
            currentAvg: 0,
            lastUpdated: "Latest data unavailable",
            priceDate: "N/A",
            trend7Days: [],
            isAvailable: false,
            source: "AGMARKNET"
          }];
        }
        return [];
      }

      const json = await res.json();
      console.log(`[CLIENT_MARKET_API] Fetched for State="${state}", District="${district}", Crop="${crop || 'ALL'}":`, json);
      
      if (json.rawReason) {
        console.info(`[AGMARKNET_STATUS] ${json.rawReason}`);
      }
      if (json.error) {
        console.warn(`[AGMARKNET_ERROR] Raw API Error: ${json.error}`);
      }

      const records: AgmarknetRawRecord[] = json.records || [];

      if (records.length === 0) {
        console.warn(`[AGMARKNET_NO_RECORDS] Zero records returned for ${state} -> ${district} -> ${crop || 'ALL'}. Raw reason: ${json.rawReason || json.error || 'No records filed'}`);
        if (crop) {
          return [{
            id: `${state}-${district}-${crop}`.toLowerCase().replace(/\s+/g, '-'),
            state,
            district,
            mandi: `${district} APMC`,
            crop,
            variety: "N/A",
            grade: "FAQ",
            currentMin: 0,
            currentMax: 0,
            currentAvg: 0,
            lastUpdated: "Latest data unavailable",
            priceDate: "N/A",
            trend7Days: [],
            isAvailable: false,
            source: "AGMARKNET"
          }];
        }
        return [];
      }

      // Group records by unique mandi + commodity + variety
      const commodityMap = new Map<string, AgmarknetRawRecord[]>();
      for (const rec of records) {
        const key = `${rec.market}_${rec.commodity}_${rec.variety}`.toLowerCase();
        if (!commodityMap.has(key)) {
          commodityMap.set(key, []);
        }
        commodityMap.get(key)!.push(rec);
      }

      const results: MarketData[] = [];

      for (const [key, group] of commodityMap.entries()) {
        // Sort by arrival date descending if multiple dates
        const latestRecord = group[0];
        
        // Build 7-day trend from actual historical records
        let trend7Days: DailyPrice[] = [];
        if ((latestRecord as any).history && Array.isArray((latestRecord as any).history)) {
          trend7Days = (latestRecord as any).history.map((h: any) => ({
            date: h.date,
            minPrice: h.min_price,
            maxPrice: h.max_price,
            avgPrice: h.modal_price,
            price: h.modal_price
          }));
        } else {
          trend7Days = group.map(r => ({
            date: r.arrival_date,
            minPrice: r.min_price,
            maxPrice: r.max_price,
            avgPrice: r.modal_price,
            price: r.modal_price
          }));
        }

        results.push({
          id: `${latestRecord.state}-${latestRecord.district}-${latestRecord.market}-${latestRecord.commodity}-${latestRecord.variety}-${key}`.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          state: latestRecord.state,
          district: latestRecord.district,
          mandi: latestRecord.market,
          crop: latestRecord.commodity,
          variety: latestRecord.variety,
          grade: latestRecord.grade,
          currentMin: latestRecord.min_price,
          currentMax: latestRecord.max_price,
          currentAvg: latestRecord.modal_price,
          lastUpdated: latestRecord.arrival_date,
          priceDate: latestRecord.arrival_date,
          trend7Days: trend7Days,
          isAvailable: true,
          source: json.source || "Official AGMARKNET"
        });
      }

      return results;
    } catch (error) {
      console.error("Failed to load official AGMARKNET data:", error);
      if (crop) {
        return [{
          id: `${state}-${district}-${crop}`.toLowerCase().replace(/\s+/g, '-'),
          state,
          district,
          mandi: `${district} APMC`,
          crop,
          variety: "N/A",
          grade: "FAQ",
          currentMin: 0,
          currentMax: 0,
          currentAvg: 0,
          lastUpdated: "Latest data unavailable",
          priceDate: "N/A",
          trend7Days: [],
          isAvailable: false,
          source: "AGMARKNET"
        }];
      }
      return [];
    }
  }
}

// Export singleton instance of official AGMARKNET provider
export const marketApi = new AgmarknetMarketProvider();
