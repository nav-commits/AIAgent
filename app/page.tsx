'use client';

import { useState, useEffect, useRef } from 'react';

type Message = {
  role: 'user' | 'ai';
  content: string;
};

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const handleAsk = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: input.trim() }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.statusText}`);
      }

      const data = await res.json();
      const aiMessage: Message = { role: 'ai', content: data.output || 'No response from AI.' };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col h-screen max-w-3xl mx-auto p-6 bg-white">
      <h1 className="text-3xl font-semibold mb-6 text-center">🧠 AI Agent Chat</h1>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        {messages.length === 0 && (
          <p className="text-center text-gray-400 mt-20 select-none">
            Start the conversation by typing below...
          </p>
        )}

        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={idx}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
              aria-live="polite"
            >
              <div
                className={`
                  max-w-[70%] px-5 py-3 rounded-3xl
                  ${isUser
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-900 rounded-bl-none'}
                  whitespace-pre-wrap
                  shadow
                `}
              >
                {msg.content}
              </div>
            </div>
          );
        })}

        {loading && (
          <p className="text-gray-500 italic text-center">AI is thinking...</p>
        )}

        {error && (
          <p className="text-red-600 bg-red-100 p-2 rounded text-center">{error}</p>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!loading) handleAsk();
        }}
        className="mt-4 flex items-center gap-3"
      >
        <textarea
          className="flex-grow resize-none rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (!loading) handleAsk();
            }
          }}
          aria-label="Chat input"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="bg-blue-600 disabled:opacity-50 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Send
        </button>
      </form>
    </main>
  );
}
