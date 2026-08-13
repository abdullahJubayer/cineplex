"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import ReactMarkdown from "react-markdown";
import {
  Sparkles,
  Send,
  Bot,
  User as UserIcon,
  X,
  Minimize2,
  Maximize2,
  RotateCcw,
  Film,
  Ticket,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useBooking } from "@/context/BookingContext";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function UserAiChatFloating() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { setMovie } = useBooking();

  // Hide floating widget if user is in Admin panel or already on the dedicated /ai-recommend full page
  if (pathname?.startsWith("/admin") || pathname === "/ai-recommend") {
    return null;
  }

  const defaultWelcomeMessage: Message = {
    role: "assistant",
    content:
      "Hi! I'm your AI Cineplex Agent 🍿✨ Tell me what movies you love/hate, ask for live seat availability, or ask me to book tickets for you!",
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([defaultWelcomeMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load user chat session storage
  useEffect(() => {
    try {
      const storedMsgs = sessionStorage.getItem("ticketor_user_chat_messages");
      if (storedMsgs) {
        const parsed = JSON.parse(storedMsgs);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save session storage
  useEffect(() => {
    try {
      if (messages.length > 0) {
        sessionStorage.setItem("ticketor_user_chat_messages", JSON.stringify(messages));
      }
    } catch (e) {
      console.error(e);
    }
  }, [messages]);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading, isOpen]);

  const handleReset = () => {
    setMessages([defaultWelcomeMessage]);
    sessionStorage.removeItem("ticketor_user_chat_messages");
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const newMessages: Message[] = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          userId: user?.id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages([...newMessages, { role: "assistant", content: data.reply }]);

        // Track guest booking reference if created
        const bookingNoToSave = data.createdBookingNo || (data.reply.match(/TCK-[A-Z0-9-]+/i) ? data.reply.match(/TCK-[A-Z0-9-]+/i)[0] : null);
        if (bookingNoToSave) {
          const bookingNo = bookingNoToSave.toUpperCase();
          const existingStr = sessionStorage.getItem("ticketor_guest_booking_nos");
          let existingNos: string[] = [];
          if (existingStr) {
            try { existingNos = JSON.parse(existingStr); } catch (e) {}
          }
          if (!existingNos.includes(bookingNo)) {
            existingNos.push(bookingNo);
            sessionStorage.setItem("ticketor_guest_booking_nos", JSON.stringify(existingNos));
          }
        }
      } else {
        setMessages([
          ...newMessages,
          { role: "assistant", content: "Sorry, I had trouble processing your request." },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "An error occurred connecting to the assistant." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Action Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="px-5 py-3.5 rounded-full bg-[#FCFC65] hover:bg-[#ecec50] text-[#010108] font-extrabold text-xs shadow-2xl shadow-[#FCFC65]/30 flex items-center gap-2.5 transition-all hover:scale-105 border border-[#FCFC65]"
        >
          <div className="w-7 h-7 rounded-full bg-[#010108] text-[#FCFC65] flex items-center justify-center font-black">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="uppercase tracking-wider">AI Movie Assistant</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
        </button>
      )}

      {/* Floating Chat Modal Window */}
      {isOpen && (
        <div
          className={`bg-[#141418] border border-[#1A1A1F] rounded-3xl shadow-2xl flex flex-col transition-all overflow-hidden ${
            isExpanded ? "w-[600px] h-[700px]" : "w-[360px] sm:w-[400px] h-[520px]"
          }`}
        >
          {/* Header */}
          <div className="bg-[#010108] px-5 py-3.5 border-b border-[#1A1A1F] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-[#FCFC65] text-[#010108] flex items-center justify-center font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white text-xs font-['Manrope']">
                  AI Cinema Assistant
                </span>
                <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Live Ready</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                className="p-1.5 rounded text-[#9797AA] hover:text-white transition-colors"
                title="Reset Chat"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded text-[#9797AA] hover:text-white transition-colors"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded text-[#9797AA] hover:text-[#FCFC65] transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-none text-xs"
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-[#FCFC65] text-[#010108] flex items-center justify-center font-bold shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[85%] ${
                    m.role === "user"
                      ? "bg-[#FCFC65] text-[#010108] font-semibold rounded-br-none"
                      : "bg-[#010108] border border-[#1A1A1F] text-[#E0E0E4] rounded-bl-none prose prose-invert prose-xs max-w-none [&_p]:mb-1.5 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-4 [&_a]:text-[#FCFC65] [&_a]:underline"
                  }`}
                >
                  {m.role === "user" ? (
                    m.content
                  ) : (
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 items-center text-xs text-[#FCFC65] animate-pulse">
                <Bot className="w-4 h-4" />
                <span>AI Agent is typing...</span>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-[#010108] border-t border-[#1A1A1F] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about movies, seats, or book tickets..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#141418] border border-[#1A1A1F] text-white text-xs focus:border-[#FCFC65] outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-[#FCFC65] hover:bg-[#ecec50] text-[#010108] font-bold transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-[#010108]" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
