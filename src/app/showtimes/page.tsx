"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { MapPin, Calendar, Clock, ChevronRight, Star, Ticket, ArrowRight, Sparkles } from "lucide-react";
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
  const [selectedCinema, setSelectedCinema] = useState("ALL");

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

  const handleSelectSession = (st: any) => {
    setMovie({
      id: st.movie.id,
      title: st.movie.title,
      poster: st.movie.posterUrl,
    });

    const timeString = new Date(st.startTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setShowtime({
      id: st.id,
      cinemaId: st.cinemaId,
      cinemaName: st.cinema.name,
      date: selectedDate,
      time: timeString,
      format: st.format,
      hallName: st.hall.name,
    });

    router.push(`/booking/seats?showtimeId=${st.id}`);
  };

  const dates = ["Thu 17", "Fri 18", "Sat 19", "Sun 20", "Mon 21", "Tue 22"];
  const formats = ["ALL", "Digital 3D", "IMAX 3D", "Standard"];

  return (
    <div className="pb-32 space-y-10 bg-[#010108] text-[#E0E0E4] min-h-screen font-sans">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FCFC65]/10 border border-[#FCFC65]/30 text-[#FCFC65] text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Select Cinema & Showtimes</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tight font-['Manrope']">
            Cinema & Ticket Selection
          </h1>
          <p className="text-base text-[#9797AA] capitalize">
            Choose your preferred cinema location, viewing format, date, and showtimes session.
          </p>
        </div>

        {/* Date Selector Pills (Matching Figma Design) */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none border-b border-[#1A1A1F]">
          {dates.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDate(d)}
              className={`px-6 py-3 rounded-md text-sm font-bold whitespace-nowrap transition-all ${
                selectedDate === d
                  ? "bg-[#FCFC65] text-[#010108] shadow-lg shadow-[#FCFC65]/20"
                  : "bg-[#141418] border border-[#1A1A1F] text-[#9797AA] hover:text-white hover:border-[#FCFC65]/40"
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Format Selector Pills */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-[#9797AA] uppercase tracking-wider mr-2">Format:</span>
          {formats.map((fmt) => (
            <button
              key={fmt}
              onClick={() => setSelectedFormat(fmt)}
              className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${
                selectedFormat === fmt
                  ? "bg-[#FCFC65]/20 border border-[#FCFC65] text-[#FCFC65]"
                  : "bg-[#141418] border border-[#1A1A1F] text-[#9797AA] hover:text-white"
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </section>

      {/* Showtimes Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {loading ? (
          <div className="space-y-6 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-44 bg-[#141418] rounded-2xl border border-[#1A1A1F]" />
            ))}
          </div>
        ) : showtimes.length === 0 ? (
          <div className="p-12 text-center bg-[#141418] border border-[#1A1A1F] rounded-2xl space-y-4">
            <h3 className="text-xl font-bold text-white">No Showtimes Found</h3>
            <p className="text-sm text-[#9797AA]">Try selecting a different date or viewing format.</p>
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
                  className="bg-[#141418] border border-[#1A1A1F] rounded-2xl p-6 sm:p-8 space-y-6 hover:border-[#FCFC65]/40 transition-all shadow-2xl"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#1A1A1F] pb-5">
                    <div className="flex items-start gap-4">
                      {st.movie?.posterUrl && (
                        <img
                          src={st.movie.posterUrl}
                          alt={st.movie.title}
                          className="w-16 h-24 rounded-lg object-cover border border-[#1A1A1F]"
                        />
                      )}
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold text-white font-['Manrope']">{st.movie?.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-[#FCFC65] font-semibold">
                          <MapPin className="w-4 h-4 text-[#FCFC65]" />
                          <span>{st.cinema?.name}</span>
                        </div>
                        <div className="text-xs text-[#9797AA]">
                          {st.cinema?.address} • <span className="text-white">{st.hall?.name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-start md:self-auto">
                      <span className="px-3.5 py-1.5 rounded bg-[#FCFC65]/10 border border-[#FCFC65]/30 text-[#FCFC65] text-xs font-bold">
                        {st.format}
                      </span>
                      <span className="px-3.5 py-1.5 rounded bg-white/5 border border-white/10 text-white text-xs font-mono">
                        ${st.basePrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Showtimes Sessions Grid */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-[#9797AA] uppercase tracking-wider">Available Sessions:</div>
                      <div className="flex flex-wrap items-center gap-3">
                        {["10:30 PM", "2:45 PM", "5:15 PM", "7:50 PM", "10:15 PM"].map((time, idx) => (
                          <button
                            key={time}
                            onClick={() => handleSelectSession(st)}
                            className={`px-5 py-2.5 rounded-md border text-xs font-bold transition-all ${
                              idx === 1
                                ? "bg-[#FCFC65] text-[#010108] border-[#FCFC65] font-extrabold shadow-md shadow-[#FCFC65]/20"
                                : "bg-[#010108] border-[#1A1A1F] text-white hover:border-[#FCFC65] hover:text-[#FCFC65]"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectSession(st)}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-md bg-[#FCFC65] hover:bg-[#ecec50] text-[#010108] font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                    >
                      <span>Select Seats</span>
                      <ArrowRight className="w-4 h-4 text-[#010108]" />
                    </button>
                  </div>
                </div>
              );
            })
        )}
      </section>
    </div>
  );
}

export default function ShowtimesPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-white bg-[#010108] min-h-screen">Loading showtimes...</div>}>
      <ShowtimesContent />
    </Suspense>
  );
}
