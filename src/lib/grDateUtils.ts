/**
 * grDateUtils.ts - Safe, Timezone-Resilient Government Resolution Date Parser and Formatter
 * 
 * Rules:
 * 1. Date-only strings (e.g. "2026-10-19") are treated as calendar dates without UTC-to-local shifts.
 * 2. Original publication date is strictly preserved; missing dates display localized "Date unavailable".
 * 3. Never invent dates or substitute fetch/crawl dates.
 * 4. Month names are localized properly for English, Marathi, and Hindi without hardcoding English months.
 */

export interface ParsedGrDate {
  year: number;
  month: number; // 1-12
  day: number;   // 1-31
  timestampMs: number;
}

const MONTHS_EN = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const MONTHS_MR = [
  "जानेवारी", "फेब्रुवारी", "मार्च", "एप्रिल", "मे", "जून",
  "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर"
];

const MONTHS_MR_SHORT = [
  "जाने", "फेब्रु", "मार्च", "एप्रिल", "मे", "जून",
  "जुलै", "ऑगस्ट", "सप्टें", "ऑक्टो", "नोव्हें", "डिसें"
];

const MONTHS_HI = [
  "जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून",
  "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"
];

const MONTHS_HI_SHORT = [
  "जन", "फर", "मार्च", "अप्रैल", "मई", "जून",
  "जुलाई", "अगस्त", "सितं", "अक्तू", "नवं", "दिसं"
];

const MARATHI_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

export function toMarathiDigits(num: number | string): string {
  return String(num).replace(/\d/g, (d) => MARATHI_DIGITS[parseInt(d, 10)]);
}

/**
 * Parses government document date safely without timezone day-shifting.
 */
export function parseGovernmentGrDate(dateStr: string | null | undefined): ParsedGrDate | null {
  if (!dateStr || typeof dateStr !== "string") return null;

  const trimmed = dateStr.trim();
  if (!trimmed || trimmed === "null" || trimmed === "undefined" || trimmed.toLowerCase() === "date unavailable") {
    return null;
  }

  // 1. Check Date-Only YYYY-MM-DD
  const ymdMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (ymdMatch) {
    const year = parseInt(ymdMatch[1], 10);
    const month = parseInt(ymdMatch[2], 10);
    const day = parseInt(ymdMatch[3], 10);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      // Use calendar midday in UTC to calculate stable timestamp for sorting
      const timestampMs = Date.UTC(year, month - 1, day, 12, 0, 0);
      return { year, month, day, timestampMs };
    }
    return null;
  }

  // 2. Check DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = trimmed.match(/^(\d{1,2})[\/\.-](\d{1,2})[\/\.-](\d{4})$/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10);
    const year = parseInt(dmyMatch[3], 10);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      const timestampMs = Date.UTC(year, month - 1, day, 12, 0, 0);
      return { year, month, day, timestampMs };
    }
    return null;
  }

  // 3. Check ISO timestamp (e.g. 2026-10-22T16:55:00.000Z)
  // For Indian Government resolutions, offset by Indian Standard Time (UTC+05:30)
  if (trimmed.includes("T")) {
    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) {
      // Offset by +5.5 hours to represent Indian Calendar Date
      const istTimeMs = d.getTime() + 5.5 * 60 * 60 * 1000;
      const istDate = new Date(istTimeMs);
      return {
        year: istDate.getUTCFullYear(),
        month: istDate.getUTCMonth() + 1,
        day: istDate.getUTCDate(),
        timestampMs: d.getTime()
      };
    }
  }

  // 4. Fallback Date constructor check
  const fallback = new Date(trimmed);
  if (!isNaN(fallback.getTime())) {
    return {
      year: fallback.getFullYear(),
      month: fallback.getMonth() + 1,
      day: fallback.getDate(),
      timestampMs: fallback.getTime()
    };
  }

  return null;
}

/**
 * Formats a government date in the user's selected language.
 */
export function formatGovernmentGrDate(
  dateStr: string | null | undefined,
  lang: "en" | "mr" | "hi" = "en",
  options: { shortMonth?: boolean; useDevanagariDigits?: boolean } = { shortMonth: true, useDevanagariDigits: false }
): string {
  const parsed = parseGovernmentGrDate(dateStr);

  if (!parsed) {
    if (lang === "mr") return "तारीख उपलब्ध नाही";
    if (lang === "hi") return "तिथि उपलब्ध नहीं";
    return "Date unavailable";
  }

  const { year, month, day } = parsed;
  const monthIdx = month - 1;

  if (lang === "mr") {
    const monthName = options.shortMonth ? MONTHS_MR_SHORT[monthIdx] : MONTHS_MR[monthIdx];
    if (options.useDevanagariDigits) {
      return `${toMarathiDigits(day)} ${monthName} ${toMarathiDigits(year)}`;
    }
    return `${day} ${monthName} ${year}`;
  }

  if (lang === "hi") {
    const monthName = options.shortMonth ? MONTHS_HI_SHORT[monthIdx] : MONTHS_HI[monthIdx];
    return `${day} ${monthName} ${year}`;
  }

  const monthName = options.shortMonth ? MONTHS_EN[monthIdx] : MONTHS_EN[monthIdx];
  return `${day} ${monthName} ${year}`;
}

/**
 * Determines if an announcement is genuinely new:
 * - Must NOT be historical
 * - Must have a verified publishedAt date within recencyDays
 * - Must have verified status (official_gr_verified or official_notice_verified)
 */
export function isGenuinelyNewAnnouncement(
  publishedAt: string | null | undefined,
  evidenceStatus: string,
  recencyDays = 14,
  currentReferenceTimeMs: number = Date.now()
): boolean {
  if (evidenceStatus === "historical") return false;
  if (evidenceStatus !== "official_gr_verified" && evidenceStatus !== "official_notice_verified") {
    return false;
  }

  const parsed = parseGovernmentGrDate(publishedAt);
  if (!parsed) return false;

  const ageMs = currentReferenceTimeMs - parsed.timestampMs;
  // If published in the future or older than recency window, not considered "new"
  const maxAgeMs = recencyDays * 24 * 60 * 60 * 1000;
  return ageMs >= 0 && ageMs <= maxAgeMs;
}

/**
 * Sorts announcements safely by verified original publication date.
 * Announcements with known dates are sorted newest first.
 * Announcements with unavailable dates are placed at the end.
 */
export function sortAnnouncementsByVerifiedDate<T extends { publishedAt?: string | null }>(
  items: T[]
): T[] {
  return [...items].sort((a, b) => {
    const parsedA = parseGovernmentGrDate(a.publishedAt);
    const parsedB = parseGovernmentGrDate(b.publishedAt);

    if (parsedA && parsedB) {
      return parsedB.timestampMs - parsedA.timestampMs;
    }
    if (parsedA && !parsedB) return -1;
    if (!parsedA && parsedB) return 1;
    return 0;
  });
}
