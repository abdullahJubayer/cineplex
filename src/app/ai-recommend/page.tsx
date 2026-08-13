"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import {
  Sparkles,
  Send,
  Bot,
  User as UserIcon,
  ExternalLink,
  Film,
  Star,
  ThumbsUp,
  ThumbsDown,
  Ticket,
  Clock,
  Tv,
  RotateCcw,
  BookmarkCheck,
  CheckCircle2,
} from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import { useAuth } from "@/context/AuthContext";

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
  const { user } = useAuth();

  const defaultWelcomeMessage: Message = {
    role: "assistant",
    content:
      "Hello! I am your AI Cineplex Recommendation Agent 🍿✨ Tell me about movies you've loved or hated recently (e.g. 'I loved Dune 2 and Interstellar, but I dislike slow dramas'), and I will analyze your taste, search our cinema catalog, and curate your personalized watchlist with legal streaming links!",
  };

  const [messages, setMessages] = useState<Message[]>([defaultWelcomeMessage]);
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
  const [dbSummary, setDbSummary] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load Chat, Preferences & Watchlist from Session Storage or Database
  useEffect(() => {
    try {
      const storedMsgs = sessionStorage.getItem("ticketor_user_chat_messages");
      const storedPrefs = sessionStorage.getItem("ticketor_user_chat_preferences");
      const storedRecs = sessionStorage.getItem("ticketor_user_chat_recommendations");

      if (storedMsgs) {
        const parsedMsgs = JSON.parse(storedMsgs);
        if (Array.isArray(parsedMsgs) && parsedMsgs.length > 0) {
          setMessages(parsedMsgs);
          setHasPrompted(true);
        }
      }

      if (storedPrefs) {
        setPreferences(JSON.parse(storedPrefs));
      }

      if (storedRecs) {
        const parsedRecs = JSON.parse(storedRecs);
        if (Array.isArray(parsedRecs) && parsedRecs.length > 0) {
          setRecommendations(parsedRecs);
        }
      }
    } catch (e) {
      console.error(e);
    }

    // If User is logged in, fetch saved AI Summary & Watchlist from DB
    if (user?.id) {
      fetchUserDbSummary(user.id);
    }
  }, [user?.id]);

  const fetchUserDbSummary = async (userId: string) => {
    try {
      const res = await fetch(`/api/ai-chat/summarize?userId=${userId}`);
      const data = await res.json();
      if (data.summaryRecord) {
        setDbSummary(data.summaryRecord.summary);

        if (!sessionStorage.getItem("ticketor_user_chat_messages") && data.summaryRecord.rawMessages) {
          try {
            const raw = JSON.parse(data.summaryRecord.rawMessages);
            if (Array.isArray(raw) && raw.length > 0) {
              setMessages(raw);
              setHasPrompted(true);
            }
          } catch (err) {}
        }

        if (!sessionStorage.getItem("ticketor_user_chat_recommendations") && data.summaryRecord.rawRecommendations) {
          try {
            const rawRecs = JSON.parse(data.summaryRecord.rawRecommendations);
            if (Array.isArray(rawRecs) && rawRecs.length > 0) {
              setRecommendations(rawRecs);
            }
          } catch (err) {}
        }
      }
    } catch (e) {
      console.error("Fetch DB summary error:", e);
    }
  };

  // Save Chat, Preferences & Watchlist to Session Storage
  useEffect(() => {
    try {
      if (messages.length > 0) {
        sessionStorage.setItem("ticketor_user_chat_messages", JSON.stringify(messages));
      }
      if (preferences) {
        sessionStorage.setItem("ticketor_user_chat_preferences", JSON.stringify(preferences));
      }
      if (recommendations.length > 0) {
        sessionStorage.setItem("ticketor_user_chat_recommendations", JSON.stringify(recommendations));
      }
    } catch (e) {
      console.error(e);
    }
  }, [messages, preferences, recommendations]);

  // Smooth scroll internal chat container
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  const handleClearChat = () => {
    setMessages([defaultWelcomeMessage]);
    setPreferences({
      likedGenres: [],
      dislikedGenres: [],
      likedDirectors: [],
      lovedMovies: [],
      hatedMovies: [],
    });
    setRecommendations([]);
    setHasPrompted(false);
    sessionStorage.removeItem("ticketor_user_chat_messages");
    sessionStorage.removeItem("ticketor_user_chat_preferences");
    sessionStorage.removeItem("ticketor_user_chat_recommendations");
  };

  const saveSummaryToDb = async (newMessages: Message[], newRecommendations: MovieRec[]) => {
    if (!user?.id) return;
    try {
      const res = await fetch("/api/ai-chat/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          messages: newMessages,
          recommendations: newRecommendations,
        }),
      });
      const data = await res.json();
      if (data.summaryRecord) {
        setDbSummary(data.summaryRecord.summary);
      }
    } catch (e) {
      console.error("Save summary error:", e);
    }
  };

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
          summary: dbSummary,
          userId: user?.id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        const updatedMessages: Message[] = [...newMessages, { role: "assistant", content: data.reply }];
        setMessages(updatedMessages);
        if (data.preferences) setPreferences(data.preferences);
        
        let newRecs = recommendations;
        if (Array.isArray(data.recommendations) && data.recommendations.length > 0) {
          newRecs = data.recommendations;
          setRecommendations(newRecs);
        }

        // If reply or API response contains a booking reference code (TCK-AI-XXXXXX), save to guest sessionStorage!
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

        // If user is logged in, summarize and save messages + watchlist to Prisma DB!
        if (user?.id) {
          saveSummaryToDb(updatedMessages, newRecs);
        }
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
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 pb-32 bg-[#010108] text-[#E0E0E4] min-h-screen font-sans">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FCFC65]/10 border border-[#FCFC65]/30 text-[#FCFC65] text-xs font-extrabold uppercase tracking-widest">
          <Sparkles className="w-4 h-4" />
          <span>AI Movie Recommendation Agent</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tight font-['Manrope']">
          Find Movies Tailored To Your Taste
        </h1>

        <p className="text-xs sm:text-sm text-[#9797AA] leading-relaxed">
          Chat with our AI agent about films you loved or hated. We analyze your unique preferences and build your personalized watchlist with legal online streaming links.
        </p>
      </div>

      {/* Logged In User Saved AI Preference Summary Banner */}
      {user && dbSummary && (
        <div className="max-w-7xl mx-auto p-4 rounded-2xl bg-[#141418] border border-[#FCFC65]/40 text-xs flex items-center gap-3 shadow-xl">
          <div className="p-2.5 rounded-xl bg-[#FCFC65] text-[#010108] font-bold shrink-0">
            <BookmarkCheck className="w-5 h-5" />
          </div>
          <div className="space-y-0.5 flex-1">
            <div className="text-[#FCFC65] font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span>Saved AI Taste Profile ({user.name})</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px]">
                Synced with DB
              </span>
            </div>
            <p className="text-white font-medium italic">{dbSummary}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Chat Interface (7 cols) */}
        <div className="lg:col-span-7 bg-[#141418] border border-[#1A1A1F] rounded-3xl p-6 shadow-2xl flex flex-col h-[650px]">
          {/* Header Action Bar */}
          <div className="flex items-center justify-between border-b border-[#1A1A1F] pb-3 mb-4">
            <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Bot className="w-4 h-4 text-[#FCFC65]" />
              <span>Interactive AI Chat</span>
              {user ? (
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px]">
                  DB Persistence
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded bg-[#FCFC65]/10 text-[#FCFC65] text-[10px]">
                  Session Saved
                </span>
              )}
            </div>

            <button
              onClick={handleClearChat}
              className="px-3 py-1 rounded-lg bg-[#010108] border border-[#1A1A1F] text-[#9797AA] hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Reset Chat Session"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Chat Messages Log Container */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-none"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 text-xs leading-relaxed ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-xl bg-[#FCFC65] text-[#010108] flex items-center justify-center font-black shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`p-4 rounded-2xl max-w-[85%] ${
                    msg.role === "user"
                      ? "bg-[#FCFC65] text-[#010108] font-semibold rounded-br-none"
                      : "bg-[#010108] border border-[#1A1A1F] text-[#E0E0E4] rounded-bl-none prose prose-invert prose-xs max-w-none [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-4 [&_a]:text-[#FCFC65] [&_a]:underline [&_img]:rounded-xl [&_img]:my-2 [&_img]:max-h-48 [&_img]:object-cover"
                  }`}
                >
                  {msg.role === "user" ? (
                    msg.content
                  ) : (
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  )}
                </div>

                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-xl bg-[#1A1A1F] text-white flex items-center justify-center font-black shrink-0">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 items-center text-xs text-[#FCFC65] font-bold animate-pulse">
                <Bot className="w-4 h-4" />
                <span>Analyzing preferences & searching cinema database...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts / Sample Suggestion Chips */}
          <div className="pt-3 pb-2 border-t border-[#1A1A1F] flex items-center gap-2 overflow-x-auto scrollbar-none transition-all">
            <span className="text-[10px] font-bold text-[#FCFC65] uppercase tracking-wider shrink-0">Quick Prompts:</span>
            {samplePrompts.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setInput(prompt);
                }}
                className="text-[11px] px-3 py-1.5 rounded-xl bg-[#010108] border border-[#1A1A1F] text-[#9797AA] hover:border-[#FCFC65] hover:text-[#FCFC65] transition-all whitespace-nowrap shrink-0"
              >
                "{prompt}"
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="flex gap-2 pt-2 border-t border-[#1A1A1F]">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell me movies you loved or hated..."
              className="flex-1 px-4 py-3 rounded-xl bg-[#010108] border border-[#1A1A1F] text-xs text-white placeholder-[#565669] focus:outline-none focus:border-[#FCFC65]"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-3 rounded-xl bg-[#FCFC65] hover:bg-[#ecec50] text-[#010108] font-black text-xs uppercase tracking-wider shadow-lg shadow-[#FCFC65]/20 disabled:opacity-50 transition-all flex items-center gap-1.5"
            >
              <Send className="w-4 h-4 text-[#010108]" />
            </button>
          </form>
        </div>

        {/* Right Column: Preference Profile & Recommendations (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Extracted Preferences Profile Panel */}
          <div className="bg-[#141418] border border-[#1A1A1F] rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-[#1A1A1F] pb-3 flex items-center justify-between font-['Manrope']">
              <span>Your Extracted Profile</span>
              <Sparkles className="w-4 h-4 text-[#FCFC65]" />
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[#9797AA] block mb-1 font-semibold flex items-center gap-1">
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
                    <span className="text-[#565669] italic">Chat to extract liked preferences...</span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-[#9797AA] block mb-1 font-semibold flex items-center gap-1">
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
                    <span className="text-[#565669] italic">No disliked items logged yet...</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations Watchlist Output */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center justify-between font-['Manrope']">
              <span>Personalized Watchlist ({recommendations.length})</span>
              <Film className="w-4 h-4 text-[#FCFC65]" />
            </h3>

            {recommendations.length > 0 ? (
              recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-[#141418] border border-[#1A1A1F] rounded-2xl p-4 flex gap-4 hover:border-[#FCFC65]/50 transition-all shadow-xl"
                >
                  <img
                    src={rec.posterUrl}
                    alt={rec.title}
                    className="w-20 h-28 object-cover rounded-xl bg-black shrink-0 border border-[#1A1A1F]"
                  />

                  <div className="flex-1 space-y-2 text-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-white text-sm">{rec.title}</h4>
                        <div className="flex items-center gap-1 text-[#FCFC65] font-bold text-xs">
                          <Star className="w-3.5 h-3.5 fill-[#FCFC65]" />
                          <span>{rec.rating}</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-[#9797AA] mt-0.5">
                        {rec.genres} • {rec.durationMins}m
                      </div>

                      <p className="text-[11px] text-[#E0E0E4] mt-1.5 leading-snug italic bg-[#010108] p-2 rounded-lg border border-[#1A1A1F]">
                        "{rec.matchReason}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#1A1A1F]">
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
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FCFC65] hover:bg-[#ecec50] text-[#010108] font-black text-[11px] transition-colors"
                      >
                        <Ticket className="w-3.5 h-3.5 fill-[#010108]" />
                        <span>Book Seats</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-[#141418]/50 rounded-2xl border border-dashed border-[#1A1A1F] p-6 space-y-2">
                <Bot className="w-10 h-10 text-[#565669] mx-auto" />
                <div className="text-xs font-bold text-white">No Recommendations Generated Yet</div>
                <p className="text-[11px] text-[#9797AA]">
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
