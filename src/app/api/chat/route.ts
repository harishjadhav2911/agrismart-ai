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

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Build the system prompt
    const langMap: Record<string, string> = {
      "hi": "Hindi",
      "mr": "Marathi",
      "en": "English",
      "ta": "Tamil",
      "te": "Telugu",
      "bn": "Bengali",
      "gu": "Gujarati",
      "kn": "Kannada",
      "ml": "Malayalam",
      "pa": "Punjabi"
    };
    
    const targetLanguage = langMap[language] || "English";
    
    const systemPrompt = `You are AgriSmart AI, a helpful and expert agricultural assistant.
Context of the user's current page: ${context}
CRITICAL INSTRUCTION: You MUST reply entirely in ${targetLanguage}. 
Keep your answers concise, practical, and easy for a farmer to understand.`;

    // Map the history to the format required by GoogleGenerativeAI
    const formattedHistory = history.map((msg: { role: string, text: string }) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    // Insert the system prompt as the first message if history is empty
    if (formattedHistory.length === 0) {
        formattedHistory.push({
            role: "user",
            parts: [{ text: `SYSTEM DIRECTIVE: ${systemPrompt}` }]
        });
        formattedHistory.push({
            role: "model",
            parts: [{ text: `Understood. I will respond in ${targetLanguage} and act as AgriSmart AI.` }]
        });
    }

    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    return NextResponse.json({ text: responseText });
    
  } catch (error: unknown) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to communicate with AI. Please try again later." },
      { status: 500 }
    );
  }
}
