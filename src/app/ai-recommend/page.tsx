"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import {
  Sparkles,
  Send,
  Bot,
  User,
  ExternalLink,
  Film,
  Star,
  ThumbsUp,
  ThumbsDown,
  Ticket,
  Clock,
  Tv,
} from "lucide-react";
import { useBooking } from "@/context/BookingContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface MovieRec {
  id: string;
  title: string;
  posterUrl: string;
  rating: number;
  genres: string;
  director: string;
  matchReason: string;
  watchUrl: string;
  durationMins: number;
}

export default function AiRecommendPage() {
  const { setMovie } = useBooking();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I am your AI Cineplex Recommendation Agent 🍿✨ Tell me about movies you've loved or hated recently (e.g. 'I loved Dune 2 and Interstellar, but I dislike slow dramas'), and I will analyze your taste, search our cinema catalog, and curate your personalized watchlist with legal streaming links!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(false);
  const [preferences, setPreferences] = useState<any>({
    likedGenres: [],
    dislikedGenres: [],
    likedDirectors: [],
    lovedMovies: [],
    hatedMovies: [],
  });
  const [recommendations, setRecommendations] = useState<MovieRec[]>([]);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Smooth scroll ONLY the internal chat container
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const newMessages: Message[] = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setHasPrompted(true);

    try {
      const res = await fetch("/api/ai-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          preferences,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages([...newMessages, { role: "assistant", content: data.reply }]);
        if (data.preferences) setPreferences(data.preferences);
        if (Array.isArray(data.recommendations)) setRecommendations(data.recommendations);
      } else {
        setMessages([
          ...newMessages,
          { role: "assistant", content: "Sorry, I had trouble processing your request. Please try again!" },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "An error occurred connecting to the recommendation service." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    "I loved Dune Part Two & Christopher Nolan films, but I hate slow romances.",
    "Recommend sci-fi action movies with high IMDb ratings like Cyber Neon 2088.",
    "I'm in the mood for an intense mystery thriller with Oscar Isaac.",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 pb-32 bg-[#05070B] text-slate-100 min-h-screen">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-extrabold uppercase tracking-widest">
          <Sparkles className="w-4 h-4" />
          <span>AI Movie Recommendation Agent</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tight">
          Find Movies Tailored To Your Taste
        </h1>

        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Chat with our AI agent about films you loved or hated. We analyze your unique preferences and build your personalized watchlist with legal online streaming links.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Chat Interface (7 cols) */}
        <div className="lg:col-span-7 bg-[#0D121F] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col h-[650px]">
          {/* Chat Messages Log Container */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 text-xs leading-relaxed ${msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-xl bg-amber-400 text-black flex items-center justify-center font-black shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`p-4 rounded-2xl max-w-[85%] ${msg.role === "user"
                    ? "bg-amber-400 text-black font-semibold rounded-br-none"
                    : "bg-white/5 border border-white/10 text-slate-200 rounded-bl-none prose prose-invert prose-xs max-w-none [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-4 [&_a]:text-amber-400 [&_a]:underline [&_img]:rounded-xl [&_img]:my-2 [&_img]:max-h-48 [&_img]:object-cover"
                    }`}
                >
                  {msg.role === "user" ? (
                    msg.content
                  ) : (
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  )}
                </div>

                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center font-black shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 items-center text-xs text-amber-400 font-bold animate-pulse">
                <Bot className="w-4 h-4" />
                <span>Analyzing preferences & searching cinema database...</span>
              </div>
            )}
          </div>

          {/* Sample Suggestion Chips (Hidden after first prompt) */}
          {!hasPrompted && (
            <div className="pt-4 pb-2 border-t border-white/10 flex flex-wrap gap-2 transition-all">
              {samplePrompts.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setInput(prompt)}
                  className="text-[11px] px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:border-amber-400/50 hover:text-white transition-all text-left line-clamp-1"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <form onSubmit={handleSend} className="flex gap-2 pt-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell me movies you loved or hated..."
              className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-400/20 disabled:opacity-50 transition-all flex items-center gap-1.5"
            >
              <Send className="w-4 h-4 fill-black" />
            </button>
          </form>
        </div>

        {/* Right Column: Preference Profile & Recommendations (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Extracted Preferences Profile Panel */}
          <div className="bg-[#0D121F] border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-white/10 pb-3 flex items-center justify-between">
              <span>Your Extracted Profile</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-1 font-semibold flex items-center gap-1">
                  <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" /> Liked Genres & Directors:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[...preferences.likedGenres, ...preferences.likedDirectors].length > 0 ? (
                    [...preferences.likedGenres, ...preferences.likedDirectors].map((g: string, i: number) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold"
                      >
                        {g}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 italic">Chat to extract liked preferences...</span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-1 font-semibold flex items-center gap-1">
                  <ThumbsDown className="w-3.5 h-3.5 text-rose-400" /> Disliked Genres / Movies:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[...preferences.dislikedGenres, ...preferences.hatedMovies].length > 0 ? (
                    [...preferences.dislikedGenres, ...preferences.hatedMovies].map((g: string, i: number) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-md bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold"
                      >
                        {g}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 italic">No disliked items logged yet...</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations Watchlist Output */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center justify-between">
              <span>Personalized Watchlist ({recommendations.length})</span>
              <Film className="w-4 h-4 text-amber-400" />
            </h3>

            {recommendations.length > 0 ? (
              recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-[#0D121F] border border-white/10 rounded-2xl p-4 flex gap-4 hover:border-amber-400/50 transition-all shadow-xl"
                >
                  <img
                    src={rec.posterUrl}
                    alt={rec.title}
                    className="w-20 h-28 object-cover rounded-xl bg-slate-900 shrink-0"
                  />

                  <div className="flex-1 space-y-2 text-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-white text-sm">{rec.title}</h4>
                        <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{rec.rating}</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {rec.genres} • {rec.durationMins}m
                      </div>

                      <p className="text-[11px] text-slate-300 mt-1.5 leading-snug italic bg-white/5 p-2 rounded-lg border border-white/5">
                        "{rec.matchReason}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      {/* Legal Watch / Streaming Link */}
                      <a
                        href={rec.watchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-cyan-300 font-bold text-[11px] transition-colors border border-white/10"
                      >
                        <Tv className="w-3.5 h-3.5" />
                        <span>Watch Online</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </a>

                      <Link
                        href={`/movies/${rec.id}`}
                        onClick={() =>
                          setMovie({
                            id: rec.id,
                            title: rec.title,
                            poster: rec.posterUrl,
                          })
                        }
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-[11px] transition-colors"
                      >
                        <Ticket className="w-3.5 h-3.5 fill-black" />
                        <span>Book Seats</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-[#0D121F]/50 rounded-2xl border border-dashed border-white/10 p-6 space-y-2">
                <Bot className="w-10 h-10 text-slate-600 mx-auto" />
                <div className="text-xs font-bold text-white">No Recommendations Generated Yet</div>
                <p className="text-[11px] text-slate-400">
                  Chat with the agent on the left to extract your movie preferences and generate your custom watchlist!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
