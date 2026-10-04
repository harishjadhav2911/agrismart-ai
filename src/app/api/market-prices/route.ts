import { NextRequest, NextResponse } from "next/server";
import { findLatestOfficialRecords, getOfficialAvailableCrops } from "@/data/agmarknetOfficialRecords";

export interface AgmarknetRecord {
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

interface FetchResult {
  records: AgmarknetRecord[];
  status: number;
  url: string;
  rawText: string;
  error?: string;
  total?: number;
  keySource: string;
}

const OGD_API_BASE = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";

async function fetchFromAgmarknetAPI(state?: string, district?: string, commodity?: string): Promise<FetchResult> {
  const envKey = process.env.DATA_GOV_IN_API_KEY?.trim();
  const apiKey = envKey || "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b";
  const keySource = envKey ? "DATA_GOV_IN_API_KEY (from .env.local)" : "Default fallback demo key";

  const params = new URLSearchParams({
    "api-key": apiKey,
    format: "json",
    limit: "50",
  });

  if (state) {
    params.append("filters[state]", state);
  }
  if (district) {
    params.append("filters[district]", district);
  }
  if (commodity) {
    params.append("filters[commodity]", commodity);
  }

  const requestUrl = `${OGD_API_BASE}?${params.toString()}`;
  
  console.log("\n=======================================================");
  console.log("[AGMARKNET_API_REQUEST]");
  console.log(`URL: ${requestUrl}`);
  console.log(`Key Source: ${keySource}`);
  console.log(`Filters -> State: "${state || 'ALL'}", District: "${district || 'ALL'}", Commodity: "${commodity || 'ALL'}"`);
  console.log("=======================================================");

  try {
    const res = await fetch(requestUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    const rawText = await res.text();

    console.log("\n=======================================================");
    console.log("[AGMARKNET_RAW_RESPONSE]");
    console.log(`HTTP Status: ${res.status} (${res.statusText})`);
    console.log(`Raw Body: ${rawText}`);
    console.log("=======================================================\n");

    // Explicit Status Handling
    if (res.status === 429) {
      const errorMsg = "Rate Limit Exceeded (HTTP 429) on data.gov.in API gateway.";
      console.warn(`[AGMARKNET_RATE_LIMIT] ${errorMsg}`);
      return {
        records: [],
        status: 429,
        url: requestUrl,
        rawText,
        error: errorMsg,
        keySource
      };
    }

    if (res.status === 401 || res.status === 403) {
      const errorMsg = `Unauthorized / Forbidden (HTTP ${res.status}). The provided DATA_GOV_IN_API_KEY is invalid or inactive.`;
      console.error(`[AGMARKNET_AUTH_ERROR] ${errorMsg}`);
      return {
        records: [],
        status: res.status,
        url: requestUrl,
        rawText,
        error: errorMsg,
        keySource
      };
    }

    if (res.status === 404) {
      const errorMsg = "Resource Not Found (HTTP 404). OGD resource 9ef84268-d588-465a-a308-a864a43d0070 is currently unavailable.";
      console.error(`[AGMARKNET_404_ERROR] ${errorMsg}`);
      return {
        records: [],
        status: 404,
        url: requestUrl,
        rawText,
        error: errorMsg,
        keySource
      };
    }

    if (!res.ok) {
      let errorMsg = `HTTP ${res.status} ${res.statusText}`;
      try {
        const errJson = JSON.parse(rawText);
        if (errJson.error) errorMsg += `: ${errJson.error}`;
      } catch {
        // ignore
      }
      return {
        records: [],
        status: res.status,
        url: requestUrl,
        rawText,
        error: errorMsg,
        keySource
      };
    }

    const data = JSON.parse(rawText);
    const records: AgmarknetRecord[] = [];

    if (data && Array.isArray(data.records)) {
      for (const r of data.records) {
        records.push({
          state: String(r.state || "").trim(),
          district: String(r.district || "").trim(),
          market: String(r.market || "").trim(),
          commodity: String(r.commodity || "").trim(),
          variety: String(r.variety || "").trim(),
          grade: String(r.grade || "").trim(),
          arrival_date: String(r.arrival_date || "").trim(),
          min_price: Number(r.min_price) || 0,
          max_price: Number(r.max_price) || 0,
          modal_price: Number(r.modal_price) || 0,
        });
      }
    }

    console.log(`[AGMARKNET_LIVE_RECORDS] Count: ${records.length} | Total matching in live DB: ${data.total ?? records.length}`);
    return {
      records,
      status: res.status,
      url: requestUrl,
      rawText,
      total: data.total,
      keySource
    };
  } catch (err: any) {
    console.error("[AGMARKNET_FETCH_EXCEPTION]", err);
    return {
      records: [],
      status: 500,
      url: requestUrl,
      rawText: err?.message || String(err),
      error: err?.message || String(err),
      keySource
    };
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get("state")?.trim() || "";
  const district = searchParams.get("district")?.trim() || "";
  const commodity = searchParams.get("commodity")?.trim() || "";
  const action = searchParams.get("action")?.trim() || "prices"; // 'prices' or 'crops'

  console.log(`\n[API_ROUTE /api/market-prices] Request: state="${state}", district="${district}", commodity="${commodity}", action="${action}"`);

  // 1. First attempt to fetch from Live AGMARKNET API
  const liveResult = await fetchFromAgmarknetAPI(state || undefined, district || undefined, commodity || undefined);

  // Handle action = 'crops'
  if (action === "crops") {
    let crops: string[] = [];
    if (liveResult.records.length > 0) {
      crops = [...new Set(liveResult.records.map(r => r.commodity))].filter(Boolean).sort();
    }
    // Also include crops from official archive
    const archivedCrops = getOfficialAvailableCrops(state, district);
    crops = [...new Set([...crops, ...archivedCrops])].filter(Boolean).sort();

    return NextResponse.json({
      success: true,
      state,
      district,
      crops,
      totalRecords: crops.length,
      isLiveToday: liveResult.records.length > 0,
      rateLimited: liveResult.status === 429,
      requestUrl: liveResult.url,
      keySource: liveResult.keySource,
      source: "AGMARKNET (agmarknet.gov.in / data.gov.in)"
    });
  }

  // 2. If live API returned records for today, return them directly
  if (liveResult.records.length > 0) {
    return NextResponse.json({
      success: true,
      state,
      district,
      commodity,
      records: liveResult.records,
      count: liveResult.records.length,
      totalInDb: liveResult.total,
      isLiveToday: true,
      rateLimited: false,
      rawReason: `Found ${liveResult.records.length} live records in AGMARKNET today`,
      requestUrl: liveResult.url,
      keySource: liveResult.keySource,
      source: "Official AGMARKNET (Live Daily Stream)"
    });
  }

  // 3. If live API returned 0 records today OR was rate limited (429), retrieve the latest available official AGMARKNET record
  const latestOfficialRecords = findLatestOfficialRecords(state, district, commodity);

  if (latestOfficialRecords.length > 0) {
    const isRateLimited = liveResult.status === 429;
    const latestDate = latestOfficialRecords[0].arrival_date;

    const rawReason = isRateLimited
      ? `Live API rate limit reached (HTTP 429); retrieved latest official AGMARKNET record from ${latestDate}.`
      : `No filings submitted to AGMARKNET today for ${state} -> ${district}; retrieved latest official AGMARKNET record from ${latestDate}.`;

    console.log(`[AGMARKNET_LATEST_OFFICIAL_RETRIEVAL] ${rawReason} Records count: ${latestOfficialRecords.length}`);

    return NextResponse.json({
      success: true,
      state,
      district,
      commodity,
      records: latestOfficialRecords,
      count: latestOfficialRecords.length,
      totalInDb: latestOfficialRecords.length,
      isLiveToday: false,
      rateLimited: isRateLimited,
      latestArrivalDate: latestDate,
      rawReason,
      requestUrl: liveResult.url,
      keySource: liveResult.keySource,
      source: isRateLimited 
        ? "Official AGMARKNET (Latest Record - Live API Rate Limited 429)" 
        : `Official AGMARKNET (Latest Record: ${latestDate})`
    });
  }

  // 4. If zero records exist in both live and official archive:
  const isRateLimited = liveResult.status === 429;
  return NextResponse.json({
    success: false,
    state,
    district,
    commodity,
    records: [],
    count: 0,
    totalInDb: 0,
    isLiveToday: false,
    rateLimited: isRateLimited,
    rawReason: isRateLimited
      ? "AGMARKNET API Rate Limit Exceeded (HTTP 429). Configure a valid DATA_GOV_IN_API_KEY in .env.local."
      : `No official AGMARKNET records filed for State: "${state}", District: "${district}", Commodity: "${commodity}".`,
    error: isRateLimited ? liveResult.error : undefined,
    requestUrl: liveResult.url,
    keySource: liveResult.keySource,
    source: "AGMARKNET (api.data.gov.in)"
  });
}
