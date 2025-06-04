'use client';

import Navbar from '@/components/navbar';
import { useGeminiQuota } from '@/hooks/useGeminiQuota';
import { useState } from 'react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

export default function Chat() {
  const { quota, refreshQuota } = useGeminiQuota();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      // Check if it's a rate limit or API error
      if (data.error) {
        const errorMessage: ChatMessage = {
          id: Date.now().toString() + '-limit',
          sender: 'bot',
          text: data.error,
        };
        setMessages((prev) => [...prev, errorMessage]);
        return;
      }

      const botMessage: ChatMessage = {
        id: Date.now().toString() + '-bot',
        sender: 'bot',
        text: data.reply || "Sorry, I didn't understand that.",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Chat API error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + '-error',
          sender: 'bot',
          text: '⚠️ Error connecting to the AI service.',
        },
      ]);
    } finally {
      setLoading(false);
      refreshQuota();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-2xl w-full space-y-6">
          <h1 className="text-3xl font-bold text-center mb-4">Chat with AI</h1>
          {quota && (
            <p className="text-sm text-gray-500 text-center">
              {quota.remaining} / {quota.max} Gemini uses left today
            </p>
          )}

          {/* Chat Display */}
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg h-64 overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center">
                No messages yet. Start the conversation.
              </p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2 rounded max-w-[80%] ${msg.sender === 'user'
                      ? 'bg-blue-500 text-white self-end ml-auto'
                      : 'bg-gray-300 text-gray-800 self-start mr-auto'
                    }`}
                >
                  {msg.text}
                </div>
              ))
            )}
            {loading && (
              <div className="text-sm text-gray-500 italic">
                AI is thinking...
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow border border-gray-300 dark:border-gray-600 p-2 rounded"
              placeholder="Type your message..."
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              {loading ? '...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
