import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

export function useGeminiChat(pageContext: string, initialMessageKey: string) {
  const { language, t } = useLanguage();
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'initial-1',
      role: 'assistant',
      text: t(initialMessageKey) || "Hello! How can I help you today?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update initial greeting if user switches language and hasn't started a conversation yet
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'initial-1') {
        return [
          {
            id: 'initial-1',
            role: 'assistant',
            text: t(initialMessageKey) || "Hello! How can I help you today?"
          }
        ];
      }
      return prev;
    });
  }, [language, initialMessageKey, t]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      // Filter out the initial welcome message from the history sent to the API to save tokens/confusion,
      // and only send actual conversation history.
      const historyForApi = messages
        .filter(m => m.id !== 'initial-1')
        .map(m => ({
          role: m.role,
          text: m.text
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: historyForApi,
          message: text.trim(),
          context: pageContext,
          language: language
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch response');
      }

      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'assistant', text: data.text }
      ]);
    } catch (err: unknown) {
      console.error("Chat error:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      
      const fallbackText = language === 'mr'
        ? "माफ करा, सर्व्हरशी संपर्क साधताना अडचण आली. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा."
        : language === 'hi'
        ? "क्षमा करें, सर्वर से जुड़ने में समस्या आई। कृपया कुछ समय बाद पुनः प्रयास करें।"
        : "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";

      setMessages((prev) => [
        ...prev,
        { 
          id: (Date.now() + 1).toString(), 
          role: 'assistant', 
          text: errorMessage.includes('API key') 
            ? "API Key is missing or invalid. Please check your .env.local configuration." 
            : fallbackText
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'initial-1',
        role: 'assistant',
        text: t(initialMessageKey) || "Hello! How can I help you today?"
      }
    ]);
    setError(null);
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat
  };
}
