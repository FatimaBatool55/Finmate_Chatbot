"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "How do I start budgeting?",
  "What is the 50/30/20 rule?",
  "How to build an emergency fund?",
  "Tips to improve credit score",
];

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi, I am FinMate AI. Ask me about budgeting, savings goals, or any finance question." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (customInput?: string) => {
    const text = customInput ?? input;
    if (!text.trim() || loading) return;

    const userMessage: Message = { role: "user", content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: messages.slice(-6) }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.response || "Sorry, something went wrong." }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Network error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="px-8 py-5 border-b border-[#e3ede7]">
        <h1 className="text-lg font-semibold text-[#1a2e22] flex items-center gap-2">
          <Sparkles size={18} className="text-[#16a34a]" />
          Chat with FinMate
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-2xl mx-auto space-y-5">
          {messages.map((msg, i) => (
            <div key={i} className={`flex animate-fadeIn ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#16a34a] text-white rounded-br-sm"
                    : "bg-[#f7faf8] text-[#1a2e22] border border-[#e3ede7] rounded-bl-sm prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1"
                }`}
              >
                {msg.role === "assistant" ? (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start animate-fadeIn">
              <div className="bg-[#f7faf8] border border-[#e3ede7] px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5">
                <span className="dot w-2 h-2 rounded-full bg-[#16a34a]"></span>
                <span className="dot w-2 h-2 rounded-full bg-[#16a34a]"></span>
                <span className="dot w-2 h-2 rounded-full bg-[#16a34a]"></span>
              </div>
            </div>
          )}

          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => sendMessage(s)}
                  className="text-xs px-4 py-2 rounded-full border border-[#e3ede7] text-[#4d6b5a] hover:bg-[#dcfce7] hover:border-[#16a34a] transition-colors cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </div>

      <div className="px-6 py-5 border-t border-[#e3ede7]">
        <div className="max-w-2xl mx-auto flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask about budgeting, savings, taxes..."
            className="flex-1 bg-[#f7faf8] border border-[#e3ede7] rounded-full px-5 py-3 text-sm text-[#1a2e22] placeholder-[#8fa89a] focus:outline-none focus:ring-2 focus:ring-[#16a34a] transition-all"
          />
          <button
            type="button"
            onClick={() => sendMessage()}
            disabled={loading}
            className="bg-[#16a34a] text-white p-3 rounded-full hover:bg-[#15803d] disabled:opacity-40 transition-colors cursor-pointer"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}