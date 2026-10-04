import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { history, message, context, language } = await req.json();

    if (!apiKey || apiKey === "your_google_gemini_api_key_here") {
      return NextResponse.json(
        { error: "Gemini API key is not configured. Please add GEMINI_API_KEY to your .env.local file." },
        { status: 503 }
      );
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    const langMap: Record<string, string> = {
      "hi": "Hindi (हिंदी)",
      "mr": "Marathi (मराठी)",
      "en": "English",
      "ta": "Tamil (தமிழ்)",
      "te": "Telugu (తెలుగు)",
      "bn": "Bengali (বাংলা)",
      "gu": "Gujarati (ગુજરાતી)",
      "kn": "Kannada (ಕನ್ನಡ)",
      "ml": "Malayalam (മലയാളം)",
      "pa": "Punjabi (ਪੰਜਾਬੀ)"
    };

    const defaultLanguage = langMap[language] || "Marathi (मराठी)";

    const systemPrompt = `You are AgriSmart AI (अॅग्रीस्मार्ट एआय), a dedicated, expert, and friendly agricultural advisor for Indian farmers.
Current Feature/Page Context: ${context || "General Agriculture"}

CRITICAL RULES:
1. STRICT LANGUAGE MATCHING (HIGHEST PRIORITY):
   - ALWAYS respond in the EXACT SAME LANGUAGE as the user's latest message.
   - If the user's message is in Marathi (मराठी), reply ENTIRELY in natural, grammatically correct Marathi (मराठी).
   - If the user's message is in Hindi (हिंदी), reply ENTIRELY in natural, grammatically correct Hindi (हिंदी).
   - If the user's message is in English, reply ENTIRELY in clear English.
   - If the user's message is in another Indian language (Tamil, Telugu, Gujarati, Bengali, Kannada, Punjabi, etc.), reply ENTIRELY in that language.
   - If the user's language is ambiguous or neutral, default to ${defaultLanguage}.
   - NEVER switch to another language unless the user explicitly requests it. Do not mix languages within sentences (except standard agro abbreviations like NPK, DAP, pH).

2. COMPLETE & UNTRUNCATED RESPONSES:
   - Provide full, comprehensive explanations without cutting off mid-sentence.
   - Always finish all list items and end with a courteous, encouraging concluding sentence or offer for follow-up questions.

3. CLEAN FORMATTING & READABILITY:
   - Use structured section headings (e.g. ### १. खत व्यवस्थापन or ### 1. Fertilizer Schedule).
   - Use bullet points (* or -) for dosages and action items.
   - Use bold (**term**) for key numbers, fertilizers, chemicals, and timings.

4. PRACTICAL & ACTIONABLE FARMING GUIDANCE:
   - Give realistic per-acre / per-hectare dosages and water volumes.
   - Specify application timing (at sowing, vegetative stage, flowering, fruiting).
   - For diseases and pests, provide integrated management (organic prevention + safe chemical remedies).
   - Maintain a respectful, helpful, and supportive tone for the farmer.`;

    const genAI = new GoogleGenerativeAI(apiKey);

    // Format previous conversation history
    const formattedHistory = Array.isArray(history) 
      ? history
          .filter((msg: { role: string; text?: string }) => msg && typeof msg.text === "string" && msg.text.trim().length > 0)
          .map((msg: { role: string; text: string }) => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.text.trim() }],
          }))
      : [];

    // Candidate models to ensure high availability and instant fallback
    const candidateModels = [
      "gemini-3.5-flash-lite",
      "gemini-3.1-flash-lite",
      "gemini-flash-lite-latest",
      "gemini-3.8-flash",
      "gemini-3.6-flash",
      "gemini-3.5-flash",
      "gemini-3.7-flash",
      "gemini-3-flash-preview"
    ];
    let responseText = "";
    let lastError: unknown = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemPrompt,
        });

        const chat = model.startChat({
          history: formattedHistory,
          generationConfig: {
            maxOutputTokens: 3500,
            temperature: 0.5, // Lower temperature for high consistency and strict adherence to language
          },
        });

        const result = await chat.sendMessage(message.trim());
        responseText = result.response.text();
        if (responseText && responseText.trim()) {
          break;
        }
      } catch (err) {
        lastError = err;
        console.warn(`Model ${modelName} failed or unavailable:`, (err as Error)?.message || err);
      }
    }

    if (!responseText || !responseText.trim()) {
      throw lastError || new Error("Failed to generate response from Gemini AI.");
    }

    return NextResponse.json({ text: responseText.trim() });

  } catch (error: unknown) {
    console.error("Gemini Chat API Route Error:", error);
    const errMessage = error instanceof Error ? error.message : "Failed to communicate with AI.";
    return NextResponse.json(
      { error: errMessage || "Failed to communicate with AI. Please try again later." },
      { status: 500 }
    );
  }
}
