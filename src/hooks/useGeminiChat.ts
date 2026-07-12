import { useState } from 'react';
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

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      // Filter out the initial welcome message from the history sent to the API to save tokens/confusion,
      // and only send actual conversation.
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
          message: text,
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
      // Optional: Add an error message to the chat
      setMessages((prev) => [
        ...prev,
        { 
          id: (Date.now() + 1).toString(), 
          role: 'assistant', 
          text: errorMessage.includes('API key') 
            ? "I am currently running in offline mode because the API key is not set. Please add it to .env.local to enable AI." 
            : "I'm sorry, I'm having trouble connecting right now. Please try again later."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage
  };
}
