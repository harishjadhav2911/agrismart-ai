// Provider Interface for Market Prices
// This allows seamless switching to a real API (like Agmarknet) later.

export interface DailyPrice {
  date: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
}

export interface MarketData {
  id: string;
  state: string;
  district: string;
  mandi: string;
  crop: string;
  currentMin: number;
  currentMax: number;
  currentAvg: number;
  lastUpdated: string;
  trend7Days: DailyPrice[];
}

export interface MarketProvider {
  fetchMarketData(state: string, district: string, crop?: string): Promise<MarketData[]>;
  fetchAvailableCrops(state: string, district: string): Promise<string[]>;
}

// ==========================================
// MOCK IMPLEMENTATION
// ==========================================

// Helper to generate a realistic 7-day trend based on a base price
const generateTrend = (basePrice: number): DailyPrice[] => {
  const trend: DailyPrice[] = [];
  const today = new Date();
  
  // Create a slight curve to simulate a trend (either going up or down)
  const trendDirection = Math.random() > 0.5 ? 1 : -1;
  const volatility = basePrice * 0.05; // 5% volatility
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    
    // Calculate price for that day based on trend and randomness
    const dayBase = basePrice - (trendDirection * (i * volatility * 0.3));
    const randomShift = (Math.random() - 0.5) * volatility;
    const finalAvg = Math.round(dayBase + randomShift);
    
    trend.push({
      date: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      minPrice: Math.round(finalAvg * 0.92),
      maxPrice: Math.round(finalAvg * 1.08),
      avgPrice: finalAvg
    });
  }
  return trend;
};

// Generates highly realistic mock data dynamically based on the requested location
export class MockMarketProvider implements MarketProvider {
  
  private basePrices: Record<string, number> = {
    "Wheat": 2200,
    "Rice (Paddy)": 2100,
    "Cotton": 7000,
    "Onion": 1800,
    "Tomato": 1200,
    "Soybean": 4500,
    "Maize": 2000,
    "Sugarcane": 300, // per quintal
    "Potato": 800,
    "Groundnut": 5500
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async fetchAvailableCrops(_state: string, _district: string): Promise<string[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return a random subset of crops to make it feel localized
    const allCrops = Object.keys(this.basePrices);
    // Shuffle and pick 4-6 crops
    return allCrops.sort(() => 0.5 - Math.random()).slice(0, 5 + Math.floor(Math.random() * 3)).sort();
  }

  async fetchMarketData(state: string, district: string, crop?: string): Promise<MarketData[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const cropsToGenerate = crop ? [crop] : await this.fetchAvailableCrops(state, district);
    
    return cropsToGenerate.map(cropName => {
      const basePrice = this.basePrices[cropName] || 2000;
      
      // Regional multiplier (e.g. some states have higher prices)
      const stateMultiplier = 1 + ((Math.random() - 0.5) * 0.1); 
      const regionalBase = basePrice * stateMultiplier;
      
      const trend = generateTrend(regionalBase);
      const latest = trend[trend.length - 1];

      // Format time safely, checking if we are on client to avoid hydration mismatch,
      // but since this is an async API it runs after hydration anyway.
      const now = new Date();
      
      return {
        id: `${state}-${district}-${cropName}`.toLowerCase().replace(/\s+/g, '-'),
        state: state,
        district: district,
        mandi: `${district} APMC`,
        crop: cropName,
        currentMin: latest.minPrice,
        currentMax: latest.maxPrice,
        currentAvg: latest.avgPrice,
        lastUpdated: `Today, ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`,
        trend7Days: trend
      };
    });
  }
}

// Export a singleton instance of the active provider
// When ready to switch to a real API, simply replace `new MockMarketProvider()` with `new RealAgmarknetProvider()`
export const marketApi = new MockMarketProvider();
