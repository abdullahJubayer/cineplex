"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { MapPin, Calendar, Clock, ChevronRight, Filter, Minus, Plus, X } from "lucide-react";
import { useBooking } from "@/context/BookingContext";

function ShowtimesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialMovieId = searchParams.get("movieId");

  const { setMovie, setShowtime } = useBooking();

  const [showtimes, setShowtimes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("Fri 18");
  const [selectedFormat, setSelectedFormat] = useState("ALL");

  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [targetShowtime, setTargetShowtime] = useState<any>(null);
  const [adultQty, setAdultQty] = useState(1);
  const [childQty, setChildQty] = useState(0);

  useEffect(() => {
    fetchShowtimes();
  }, [initialMovieId]);

  const fetchShowtimes = async () => {
    setLoading(true);
    try {
      const url = initialMovieId ? `/api/showtimes?movieId=${initialMovieId}` : "/api/showtimes";
      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data)) setShowtimes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenTicketModal = (st: any) => {
    setTargetShowtime(st);
    setTicketModalOpen(true);
  };

  const handleConfirmTickets = () => {
    if (!targetShowtime) return;

    setMovie({
      id: targetShowtime.movie.id,
      title: targetShowtime.movie.title,
      poster: targetShowtime.movie.posterUrl,
    });

    const timeString = new Date(targetShowtime.startTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setShowtime({
      id: targetShowtime.id,
      cinemaId: targetShowtime.cinemaId,
      cinemaName: targetShowtime.cinema.name,
      date: selectedDate,
      time: timeString,
      format: targetShowtime.format,
      hallName: targetShowtime.hall.name,
    });

    setTicketModalOpen(false);
    router.push(`/booking/seats?showtimeId=${targetShowtime.id}`);
  };

  return (
    <div className="pb-32 space-y-12 bg-[#05070B] text-slate-100 min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">
            Select Showtimes & Cinemas
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Choose your preferred cinema location, viewing format, and showtime schedule.
          </p>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
          {["Thu 17", "Fri 18", "Sat 19", "Sun 20", "Mon 21", "Tue 22"].map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDate(d)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedDate === d
                  ? "bg-amber-400 text-black shadow-lg shadow-amber-400/20"
                  : "bg-white/5 border border-white/10 text-slate-400 hover:text-white"
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {["ALL", "Digital 3D", "IMAX 3D", "Standard"].map((fmt) => (
            <button
              key={fmt}
              onClick={() => setSelectedFormat(fmt)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedFormat === fmt
                  ? "bg-white/10 text-white border border-white/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-40 bg-white/5 rounded-3xl" />
            ))}
          </div>
        ) : (
          showtimes
            .filter((st) => selectedFormat === "ALL" || st.format.includes(selectedFormat))
            .map((st) => {
              const timeStr = new Date(st.startTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={st.id}
                  className="bg-[#0D121F] border border-white/10 rounded-3xl p-6 space-y-4 hover:border-amber-400/50 transition-all shadow-xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <div className="flex items-center gap-2 text-base font-extrabold text-white">
                        <MapPin className="w-4 h-4 text-amber-400" />
                        <span>{st.cinema?.name}</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {st.cinema?.address} • {st.hall?.name}
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded bg-white/5 border border-white/10 text-amber-400 text-xs font-bold self-start sm:self-auto">
                      {st.format}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleOpenTicketModal(st)}
                        className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400 text-white font-extrabold text-xs transition-all hover:bg-amber-400 hover:text-black"
                      >
                        {timeStr}
                      </button>
                    </div>

                    <button
                      onClick={() => handleOpenTicketModal(st)}
                      className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider transition-all"
                    >
                      Continue &rarr;
                    </button>
                  </div>
                </div>
              );
            })
        )}
      </section>

      {ticketModalOpen && targetShowtime && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D121F] border border-white/20 rounded-3xl p-6 w-full max-w-md space-y-6 shadow-2xl relative">
            <button
              onClick={() => setTicketModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                Choose Tickets For Everyone
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Select the number of tickets for your group
              </p>
            </div>

            <div className="space-y-4 text-xs border-t border-b border-white/10 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-sm">Adult</div>
                  <div className="text-slate-400">${targetShowtime.basePrice.toFixed(2)}</div>
                </div>
                <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-1.5">
                  <button
                    onClick={() => setAdultQty(Math.max(1, adultQty - 1))}
                    className="p-1 rounded text-slate-300 hover:text-white"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-white w-4 text-center">{adultQty}</span>
                  <button
                    onClick={() => setAdultQty(adultQty + 1)}
                    className="p-1 rounded text-amber-400"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-sm">Child</div>
                  <div className="text-slate-400">${(targetShowtime.basePrice * 0.7).toFixed(2)}</div>
                </div>
                <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-1.5">
                  <button
                    onClick={() => setChildQty(Math.max(0, childQty - 1))}
                    className="p-1 rounded text-slate-300 hover:text-white"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-white w-4 text-center">{childQty}</span>
                  <button
                    onClick={() => setChildQty(childQty + 1)}
                    className="p-1 rounded text-amber-400"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleConfirmTickets}
              className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider transition-all"
            >
              Continue to Seat Map &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShowtimesPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-white">Loading showtimes...</div>}>
      <ShowtimesContent />
    </Suspense>
  );
}
