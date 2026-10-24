import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/server/db/userStore";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, location, farmDetails, preferredLanguage, authProvider } = body;

    // 1. Strict Email Validation
    if (!email || typeof email !== "string") {
      return NextResponse.json({ success: false, error: "Valid email address is required" }, { status: 400 });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (normalizedEmail.length < 5 || normalizedEmail.length > 254 || !EMAIL_REGEX.test(normalizedEmail)) {
      return NextResponse.json({ success: false, error: "Invalid email format" }, { status: 400 });
    }

    // 2. Strict Name Validation
    if (!name || typeof name !== "string") {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }
    const trimmedName = name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 100) {
      return NextResponse.json({ success: false, error: "Name must be between 2 and 100 characters" }, { status: 400 });
    }

    // 3. Optional Phone Sanitization
    let sanitizedPhone: string | undefined;
    if (phone && typeof phone === "string") {
      const trimmedPhone = phone.trim();
      if (/^[+0-9\s\-()]{7,25}$/.test(trimmedPhone)) {
        sanitizedPhone = trimmedPhone;
      }
    }

    // 4. Preferred Language Guard
    const validLanguages = ["en", "mr", "hi"];
    const sanitizedLang = typeof preferredLanguage === "string" && validLanguages.includes(preferredLanguage)
      ? preferredLanguage
      : "en";

    // 5. Auth Provider Validation
    const validProviders = ["email_password", "google", "phone"];
    const sanitizedProvider = typeof authProvider === "string" && validProviders.includes(authProvider)
      ? (authProvider as "email_password" | "google" | "phone")
      : "email_password";

    // 6. Location Sanitization
    let sanitizedLocation: { state: string; district: string; taluka: string; village: string } | undefined;
    if (location && typeof location === "object") {
      sanitizedLocation = {
        state: String(location.state || "Maharashtra").slice(0, 100),
        district: String(location.district || "").slice(0, 100),
        taluka: String(location.taluka || "").slice(0, 100),
        village: String(location.village || "").slice(0, 100)
      };
    }

    // 7. Farm Details Sanitization
    let sanitizedFarmDetails: { farmSize: string; soilType: string; primaryCrops: string[] } | undefined;
    if (farmDetails && typeof farmDetails === "object") {
      const rawCrops = Array.isArray(farmDetails.primaryCrops) ? farmDetails.primaryCrops : [];
      sanitizedFarmDetails = {
        farmSize: String(farmDetails.farmSize || "").slice(0, 50),
        soilType: String(farmDetails.soilType || "").slice(0, 50),
        primaryCrops: rawCrops.slice(0, 10).map((c: unknown) => String(c).slice(0, 50))
      };
    }

    // Extract generalized IP address for security logging without fingerprinting
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ipAddress = forwardedFor ? forwardedFor.split(",")[0].trim() : undefined;

    const result = await registerUser(
      {
        name: trimmedName,
        email: normalizedEmail,
        phone: sanitizedPhone,
        preferredLanguage: sanitizedLang,
        location: sanitizedLocation,
        farmDetails: sanitizedFarmDetails
      },
      sanitizedProvider,
      ipAddress
    );

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Registration recorded successfully",
      user: result.user,
      sessionToken: result.user?.sessionToken
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: "Internal server error during registration", details: errorMsg }, { status: 500 });
  }
}
