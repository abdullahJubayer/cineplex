"use client";

import React, { useState, useEffect } from "react";
import {
  Ticket,
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  AlertCircle,
  QrCode,
  DollarSign,
  Film,
  X,
  ExternalLink,
} from "lucide-react";

interface BookingRecord {
  id: string;
  bookingNo: string;
  userName: string;
  userEmail: string;
  userAvatar: string | null;
  movieTitle: string;
  moviePoster: string;
  cinemaName: string;
  hallName: string;
  format: string;
  startTime: string;
  seats: string[];
  totalPrice: number;
  status: string;
  qrCodeUrl: string | null;
  createdAt: string;
  isUpcoming: boolean;
  foodItems: Array<{ name: string; quantity: number; price: number }>;
}

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"ALL" | "UPCOMING" | "PASSED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<BookingRecord | null>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/tickets");
      const data = await res.json();
      if (Array.isArray(data)) setTickets(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    // Filter by status (Upcoming vs Passed)
    if (filterStatus === "UPCOMING" && !t.isUpcoming) return false;
    if (filterStatus === "PASSED" && t.isUpcoming) return false;

    // Search query filter (Booking reference, user name, email, movie title, cinema)
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchNo = t.bookingNo.toLowerCase().includes(q);
      const matchUser = t.userName.toLowerCase().includes(q) || t.userEmail.toLowerCase().includes(q);
      const matchMovie = t.movieTitle.toLowerCase().includes(q);
      const matchCinema = t.cinemaName.toLowerCase().includes(q);
      return matchNo || matchUser || matchMovie || matchCinema;
    }

    return true;
  });

  const upcomingCount = tickets.filter((t) => t.isUpcoming).length;
  const passedCount = tickets.filter((t) => !t.isUpcoming).length;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-16 bg-[#141418] rounded-2xl border border-[#1A1A1F]" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 bg-[#141418] rounded-2xl border border-[#1A1A1F]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1A1A1F] pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white uppercase font-['Manrope'] flex items-center gap-3">
            <Ticket className="w-8 h-8 text-[#FCFC65]" />
            <span>Ticket Reservation List</span>
          </h1>
          <p className="text-sm text-[#9797AA] mt-1">
            View, search, and manage all customer ticket bookings and digital QR passes
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 bg-[#141418] border border-[#1A1A1F] p-1.5 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setFilterStatus("ALL")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterStatus === "ALL"
                ? "bg-[#FCFC65] text-[#010108] shadow-md shadow-[#FCFC65]/20"
                : "text-[#9797AA] hover:text-white"
            }`}
          >
            <span>All Tickets</span>
            <span className="px-1.5 py-0.5 rounded-full bg-[#010108]/20 text-[10px]">
              {tickets.length}
            </span>
          </button>

          <button
            onClick={() => setFilterStatus("UPCOMING")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterStatus === "UPCOMING"
                ? "bg-emerald-400 text-[#010108] shadow-md shadow-emerald-400/20"
                : "text-[#9797AA] hover:text-white"
            }`}
          >
            <span>Upcoming</span>
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px]">
              {upcomingCount}
            </span>
          </button>

          <button
            onClick={() => setFilterStatus("PASSED")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterStatus === "PASSED"
                ? "bg-[#353541] text-white shadow-md"
                : "text-[#9797AA] hover:text-white"
            }`}
          >
            <span>Already Passed</span>
            <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-slate-300 text-[10px]">
              {passedCount}
            </span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#565669]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by ticket #, user name, email, or movie..."
          className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#141418] border border-[#1A1A1F] text-xs text-white placeholder-[#565669] focus:outline-none focus:border-[#FCFC65] transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9797AA] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Ticket List Table / Cards */}
      {filteredTickets.length > 0 ? (
        <div className="space-y-4">
          {filteredTickets.map((t) => {
            const dateObj = new Date(t.startTime);
            const dateStr = dateObj.toLocaleDateString([], {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            const timeStr = dateObj.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={t.id}
                className="bg-[#141418] border border-[#1A1A1F] rounded-3xl p-5 hover:border-[#FCFC65]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl"
              >
                {/* Left: Movie & User details */}
                <div className="flex gap-4 items-center">
                  <img
                    src={t.moviePoster}
                    alt={t.movieTitle}
                    className="w-16 h-24 object-cover rounded-2xl border border-[#1A1A1F] bg-[#010108] shrink-0"
                  />

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-xs text-[#FCFC65]">
                        {t.bookingNo}
                      </span>
                      {t.isUpcoming ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                          Upcoming Session
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400 text-[10px] font-bold">
                          Already Passed
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded bg-[#010108] border border-[#1A1A1F] text-slate-300 text-[10px] font-bold">
                        {t.format}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-white font-['Manrope']">
                      {t.movieTitle}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-[#9797AA] flex-wrap">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#FCFC65]" />
                        <span>{t.cinemaName} ({t.hallName})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#FCFC65]" />
                        <span>{dateStr} • {timeStr}</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-300 flex items-center gap-2 pt-0.5">
                      <User className="w-3.5 h-3.5 text-[#9797AA]" />
                      <span>{t.userName} ({t.userEmail})</span>
                    </div>
                  </div>
                </div>

                {/* Right: Seats, Price & Action button */}
                <div className="flex flex-row md:flex-col items-end justify-between md:justify-center border-t md:border-t-0 border-[#1A1A1F] pt-4 md:pt-0 gap-3">
                  <div className="text-right">
                    <div className="text-xs text-[#9797AA]">
                      Seats: <span className="text-white font-bold">{t.seats.join(", ")}</span>
                    </div>
                    <div className="text-xl font-black text-[#FCFC65] font-mono mt-0.5">
                      ${t.totalPrice.toFixed(2)}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedTicket(t)}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-[#1A1A1F] hover:bg-[#FCFC65] hover:text-[#010108] hover:border-[#FCFC65] text-white font-bold text-xs transition-all flex items-center gap-1.5"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>View Digital Ticket</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#141418] border border-[#1A1A1F] rounded-3xl p-12 text-center space-y-3">
          <Ticket className="w-12 h-12 text-[#565669] mx-auto" />
          <h3 className="text-lg font-bold text-white">No Tickets Found</h3>
          <p className="text-xs text-[#9797AA]">
            No booking records match your selected filter or search query.
          </p>
        </div>
      )}

      {/* Ticket QR Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#141418] border border-[#1A1A1F] rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-5 right-5 text-[#9797AA] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <span className="text-xs text-[#FCFC65] font-bold uppercase tracking-wider font-mono">
                {selectedTicket.bookingNo}
              </span>
              <h3 className="text-xl font-bold text-white font-['Manrope']">
                {selectedTicket.movieTitle}
              </h3>
              <p className="text-xs text-[#9797AA]">{selectedTicket.cinemaName} • {selectedTicket.hallName}</p>
            </div>

            {/* QR Code Container */}
            <div className="bg-white p-4 rounded-2xl w-48 h-48 mx-auto flex items-center justify-center shadow-lg">
              {selectedTicket.qrCodeUrl ? (
                <img src={selectedTicket.qrCodeUrl} alt="Ticket QR" className="w-full h-full" />
              ) : (
                <QrCode className="w-32 h-32 text-black" />
              )}
            </div>

            {/* Ticket details summary */}
            <div className="bg-[#010108] border border-[#1A1A1F] rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#9797AA]">Customer:</span>
                <span className="text-white font-bold">{selectedTicket.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9797AA]">Seats:</span>
                <span className="text-[#FCFC65] font-bold">{selectedTicket.seats.join(", ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9797AA]">Showtime:</span>
                <span className="text-white font-medium">
                  {new Date(selectedTicket.startTime).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                </span>
              </div>
              <div className="flex justify-between border-t border-[#1A1A1F] pt-2">
                <span className="text-[#9797AA]">Total Paid:</span>
                <span className="text-lg font-black text-[#FCFC65] font-mono">
                  ${selectedTicket.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedTicket(null)}
              className="w-full py-3.5 rounded-xl bg-[#FCFC65] text-[#010108] font-bold text-xs uppercase"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
