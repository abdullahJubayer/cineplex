"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Send,
  Plus,
  CheckCircle2,
  Film,
  Loader2,
  Bot,
  User,
  Clock,
  Building2,
  Tag,
  Calendar,
  AlertCircle,
  X,
  Minimize2,
  Maximize2,
  MessageSquare,
  RotateCcw,
} from "lucide-react";

export function AdminAiChat({
  onMovieImported,
  isFloating = true,
}: {
  onMovieImported?: () => void;
  isFloating?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const initialWelcomeMsg = {
    id: "init",
    sender: "ai",
    text: "👋 Hi Admin! I'm your Full Ticketor Autonomous Operating Agent. Ask me to perform any admin action:\n\n• 🎬 Add movies from TMDB\n• ⏰ Schedule showtimes & validate overlaps\n• 🏛️ Generate cinemas & seat layouts\n• 🏷️ Create promo codes",
  };

  const [messages, setMessages] = useState<any[]>([initialWelcomeMsg]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [importingId, setImportingId] = useState<number | null>(null);

  // Form states for slot filling inside chat
  const [selectedMovieId, setSelectedMovieId] = useState("");
  const [selectedCinemaId, setSelectedCinemaId] = useState("");
  const [showtimeDate, setShowtimeDate] = useState("2026-08-18");
  const [showtimeTime, setShowtimeTime] = useState("19:30");

  // Load Admin Chat from Session Storage
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("ticketor_admin_chat_messages");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save Admin Chat to Session Storage on change
  useEffect(() => {
    try {
      if (messages.length > 0) {
        sessionStorage.setItem("ticketor_admin_chat_messages", JSON.stringify(messages));
      }
    } catch (e) {
      console.error(e);
    }
  }, [messages]);

  const handleClearSession = () => {
    setMessages([initialWelcomeMsg]);
    sessionStorage.removeItem("ticketor_admin_chat_messages");
  };

  const quickPrompts = [
    { label: "🎬 Add Oppenheimer", query: "Add Oppenheimer to catalog" },
    { label: "⏰ Schedule Showtime", query: "Schedule Godzilla x Kong at Grand IMAX for tomorrow at 8:00 PM" },
    { label: "🏛️ Create Cinema Layout", query: "Create Cinema 'Apex IMAX' in Brooklyn with 8 rows and 10 cols" },
    { label: "🏷️ Create Promo Code", query: "Create promo code SUMMER30 for 30% off" },
  ];

  const handleSendMessage = async (textToSend?: string, actionType?: string, draftData?: any) => {
    const query = textToSend || input;
    if (!query.trim() && !actionType) return;

    const userMsgId = Date.now().toString();
    if (query) {
      setMessages((prev) => [...prev, { id: userMsgId, sender: "user", text: query }]);
    }
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      // Compact conversation history (last 6 turns) to pass context without bloat
      const historyPayload = messages.slice(-6).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await fetch("/api/admin/ai-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          action: actionType,
          draftData,
          history: historyPayload,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: data.reply || "Action completed!",
          type: data.type,
          results: data.results,
          movie: data.movie,
          showtime: data.showtime,
          cinema: data.cinema,
          hall: data.hall,
          promo: data.promo,
          draftData: data.draftData,
          availableMovies: data.availableMovies,
          availableCinemas: data.availableCinemas,
        },
      ]);

      if (onMovieImported) onMovieImported();
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: "Sorry, I encountered an error executing this admin action.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleImportClick = async (tmdbId: number) => {
    setImportingId(tmdbId);
    try {
      const res = await fetch("/api/admin/ai-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "import", tmdbId }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "ai",
          text: data.reply,
          type: "import_result",
          movie: data.movie,
          alreadyExisted: data.alreadyExisted,
        },
      ]);

      if (onMovieImported) onMovieImported();
    } catch (e) {
      console.error(e);
    } finally {
      setImportingId(null);
    }
  };

  const contentUI = (
    <div className="flex flex-col h-full space-y-4">
      {/* Message Chat Body */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-none text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${
              m.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                m.sender === "user"
                  ? "bg-white/10 text-white"
                  : "bg-[#FCFC65] text-[#010108]"
              }`}
            >
              {m.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[88%] p-3.5 rounded-2xl space-y-2.5 ${
                m.sender === "user"
                  ? "bg-[#FCFC65] text-[#010108] font-semibold rounded-tr-none"
                  : "bg-[#010108] border border-[#1A1A1F] text-[#E0E0E4] rounded-tl-none"
              }`}
            >
              <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>

              {/* 1. TMDB Search Results Cards */}
              {m.results && m.results.length > 0 && (
                <div className="grid grid-cols-1 gap-2 pt-2">
                  {m.results.map((r: any) => (
                    <div
                      key={r.id}
                      className="bg-[#141418] border border-[#1A1A1F] rounded-xl p-2.5 flex gap-2.5 items-center hover:border-[#FCFC65]/40 transition-all"
                    >
                      <img
                        src={
                          r.poster_path
                            ? `https://image.tmdb.org/t/p/w200${r.poster_path}`
                            : "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=200&q=80"
                        }
                        alt={r.title}
                        className="w-10 h-14 object-cover rounded-md border border-[#1A1A1F]"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="font-bold text-white text-xs line-clamp-1">{r.title}</div>
                        <div className="text-[10px] text-[#9797AA]">
                          {r.release_date?.slice(0, 4) || "2026"} • ⭐ {r.vote_average?.toFixed(1) || 8.0}
                        </div>
                        <button
                          onClick={() => handleImportClick(r.id)}
                          disabled={importingId === r.id}
                          className="px-2 py-0.5 rounded bg-[#FCFC65] hover:bg-[#ecec50] text-[#010108] text-[10px] font-bold uppercase transition-all flex items-center gap-1"
                        >
                          {importingId === r.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Plus className="w-3 h-3" />
                          )}
                          <span>Import to DB</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 2. Created Showtime Confirmation Card */}
              {m.showtime && (
                <div className="p-3 rounded-xl bg-[#FCFC65]/10 border border-[#FCFC65]/30 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{m.showtime.movie?.title}</span>
                    <span className="px-2 py-0.5 rounded bg-[#FCFC65] text-[#010108] text-[9px] font-extrabold uppercase">
                      {m.showtime.format}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#9797AA]">
                    {m.showtime.cinema?.name} ({m.showtime.hall?.name || "Auditorium 1"})
                  </div>
                  <div className="text-[11px] text-[#FCFC65] font-mono font-bold flex items-center justify-between border-t border-[#FCFC65]/20 pt-1.5">
                    <span>{new Date(m.showtime.startTime).toLocaleString()}</span>
                    <span>${m.showtime.basePrice?.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* 3. Created Cinema Layout Confirmation Card */}
              {m.cinema && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{m.cinema.name}</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-black text-[9px] font-extrabold uppercase">
                      {m.cinema.city}
                    </span>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono font-bold">
                    ✓ Layout Created ({m.seatCount || 80} Seats generated)
                  </div>
                </div>
              )}

              {/* 4. Created Promo Code Confirmation Card */}
              {m.promo && (
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between">
                  <div>
                    <div className="font-mono text-cyan-400 font-black text-xs">{m.promo.code}</div>
                    <div className="text-[11px] text-white font-bold">
                      {m.promo.discountType === "PERCENTAGE" ? `${m.promo.amount}% OFF` : `$${m.promo.amount} OFF`}
                    </div>
                  </div>
                  <div className="text-[10px] text-cyan-400 font-bold">Active</div>
                </div>
              )}

              {/* 5. Slot-Filling Form */}
              {m.type === "prompt_showtime_details" && (
                <div className="p-3 rounded-xl bg-[#141418] border border-[#FCFC65]/40 space-y-2.5">
                  <div className="font-bold text-white text-xs">Confirm Showtime Parameters:</div>
                  <div className="space-y-1.5">
                    <select
                      defaultValue={m.draftData?.movieId}
                      onChange={(e) => setSelectedMovieId(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-[#010108] border border-[#1A1A1F] text-white text-xs"
                    >
                      {m.availableMovies?.map((mov: any) => (
                        <option key={mov.id} value={mov.id}>
                          {mov.title}
                        </option>
                      ))}
                    </select>

                    <select
                      defaultValue={m.draftData?.cinemaId}
                      onChange={(e) => setSelectedCinemaId(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-[#010108] border border-[#1A1A1F] text-white text-xs"
                    >
                      {m.availableCinemas?.map((cin: any) => (
                        <option key={cin.id} value={cin.id}>
                          {cin.name} ({cin.city})
                        </option>
                      ))}
                    </select>

                    <div className="grid grid-cols-2 gap-1.5">
                      <input
                        type="date"
                        value={showtimeDate}
                        onChange={(e) => setShowtimeDate(e.target.value)}
                        className="w-full px-2 py-1 rounded bg-[#010108] border border-[#1A1A1F] text-white text-xs"
                      />
                      <input
                        type="time"
                        value={showtimeTime}
                        onChange={(e) => setShowtimeTime(e.target.value)}
                        className="w-full px-2 py-1 rounded bg-[#010108] border border-[#1A1A1F] text-white text-xs"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleSendMessage(
                        "Confirm Schedule",
                        "create_showtime",
                        {
                          movieId: selectedMovieId || m.draftData?.movieId,
                          cinemaId: selectedCinemaId || m.draftData?.cinemaId,
                          startTime: new Date(`${showtimeDate}T${showtimeTime}:00`).toISOString(),
                          format: "IMAX 3D Laser",
                          basePrice: 16.5,
                        }
                      )
                    }
                    className="w-full py-2 rounded bg-[#FCFC65] hover:bg-[#ecec50] text-[#010108] text-xs font-bold uppercase transition-all"
                  >
                    Confirm Showtime
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-[#9797AA] animate-pulse">
            <Bot className="w-4 h-4 text-[#FCFC65]" />
            <span>AI Assistant is executing action...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none shrink-0">
        {quickPrompts.map((qp) => (
          <button
            key={qp.label}
            onClick={() => handleSendMessage(qp.query)}
            className="px-2.5 py-1 rounded-full bg-[#010108] border border-[#1A1A1F] text-[#FCFC65] text-[10px] font-semibold hover:border-[#FCFC65] whitespace-nowrap transition-colors"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 pt-2 border-t border-[#1A1A1F] shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI to add movie, schedule showtime, create cinema layout..."
          className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#010108] border border-[#1A1A1F] text-white text-xs focus:border-[#FCFC65] outline-none"
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
  );

  // If NOT floating, render embedded card UI
  if (!isFloating) {
    return (
      <div className="bg-[#141418] border border-[#1A1A1F] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl flex flex-col h-[560px]">
        <div className="flex items-center justify-between border-b border-[#1A1A1F] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FCFC65]/10 border border-[#FCFC65]/30 flex items-center justify-center text-[#FCFC65]">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-['Manrope'] flex items-center gap-2">
                <span>Full Admin Autonomous AI Assistant</span>
                <span className="px-2 py-0.5 rounded bg-[#FCFC65] text-[#010108] text-[10px] font-black uppercase">
                  Session Active
                </span>
              </h3>
              <p className="text-xs text-[#9797AA]">Movies, Showtimes, Seat Layouts, and Promo Codes</p>
            </div>
          </div>
          <button
            onClick={handleClearSession}
            className="p-2 rounded-lg bg-[#010108] border border-[#1A1A1F] text-[#9797AA] hover:text-white text-xs font-bold flex items-center gap-1 transition-colors"
            title="Reset Session"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
        {contentUI}
      </div>
    );
  }

  // Floating Window Widget Rendering
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="px-5 py-3.5 rounded-full bg-[#FCFC65] hover:bg-[#ecec50] text-[#010108] font-extrabold text-xs shadow-2xl shadow-[#FCFC65]/30 flex items-center gap-2.5 transition-all hover:scale-105 border border-[#FCFC65]"
        >
          <div className="w-7 h-7 rounded-full bg-[#010108] text-[#FCFC65] flex items-center justify-center font-black">
            <Bot className="w-4 h-4" />
          </div>
          <span className="uppercase tracking-wider">Admin AI Assistant</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
        </button>
      )}

      {/* Floating Chat Modal Window */}
      {isOpen && (
        <div
          className={`bg-[#141418] border border-[#1A1A1F] rounded-3xl shadow-2xl flex flex-col transition-all overflow-hidden ${
            isExpanded ? "w-[600px] h-[720px]" : "w-[380px] sm:w-[420px] h-[540px]"
          }`}
        >
          {/* Window Top Bar */}
          <div className="bg-[#010108] px-5 py-3.5 border-b border-[#1A1A1F] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-[#FCFC65] text-[#010108] flex items-center justify-center font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white text-xs font-['Manrope']">
                  Admin AI Assistant
                </span>
                <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Session Restored</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearSession}
                className="p-1.5 rounded text-[#9797AA] hover:text-white transition-colors"
                title="Reset Session Chat"
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

          {/* Window Body */}
          <div className="p-4 flex-1 overflow-hidden">{contentUI}</div>
        </div>
      )}
    </div>
  );
}
