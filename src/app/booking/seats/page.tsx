"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertCircle, Minus, Plus, Star, MapPin } from "lucide-react";
import { useBooking } from "@/context/BookingContext";

function SeatSelectionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const showtimeId = searchParams.get("showtimeId");
  const { booking, toggleSeat, calculateTotal } = useBooking();

  const [showtimeData, setShowtimeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Ticket counters matching Figma right panel
  const [adultCount, setAdultCount] = useState(2);
  const [seniorCount, setSeniorCount] = useState(1);
  const [childCount, setChildCount] = useState(1);

  useEffect(() => {
    fetchSeatsData();
  }, [showtimeId]);

  const fetchSeatsData = async () => {
    setLoading(true);
    try {
      // If showtimeId is present, fetch specific showtime. Otherwise fetch first available showtime.
      const url = showtimeId ? `/api/showtimes/${showtimeId}/seats` : `/api/showtimes`;
      const res = await fetch(url);
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        // Fallback to first showtime if opened without param
        const fallbackRes = await fetch(`/api/showtimes/${data[0].id}/seats`);
        const fallbackData = await fallbackRes.json();
        setShowtimeData(fallbackData);
      } else if (data && data.hall) {
        setShowtimeData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse space-y-8 bg-[#05070B] min-h-screen">
        <div className="h-20 bg-white/5 rounded-2xl" />
        <div className="h-[600px] bg-white/5 rounded-3xl" />
      </div>
    );
  }

  if (!showtimeData || !showtimeData.hall) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4 bg-[#05070B] min-h-screen text-slate-100">
        <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">No Showtime Selected</h2>
        <p className="text-xs text-slate-400">Please choose a showtime session to view available seats.</p>
        <Link href="/showtimes" className="inline-block px-6 py-2.5 rounded-xl bg-amber-400 text-black text-xs font-extrabold uppercase">
          Browse Showtimes
        </Link>
      </div>
    );
  }

  const { hall, bookedSeats = [], movie, cinema } = showtimeData;
  const seats = hall.seats || [];
  const { seatsTotal } = calculateTotal();

  // Group seats by row (A..F)
  const rows: Record<string, any[]> = {};
  seats.forEach((seat: any) => {
    if (!rows[seat.row]) rows[seat.row] = [];
    rows[seat.row].push(seat);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 pb-32 bg-[#05070B] text-slate-100 min-h-screen">
      {/* 1. FIGMA TOP PROGRESS STEPPER (Seat -> Food & Drink -> Payment -> Ticket) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">
            {movie.title}
          </h1>
          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
            <span>{movie.durationMins}m</span>
            <span>•</span>
            <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold">{movie.ageRating}</span>
            <span>•</span>
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{movie.rating}</span>
            </div>
          </div>
        </div>

        {/* Stepper matching Figma node 4235:25744 */}
        <div className="flex items-center gap-6 text-xs font-bold">
          <div className="flex items-center gap-2 text-amber-400">
            <span className="w-6 h-6 rounded-full bg-amber-400 text-black flex items-center justify-center font-black">1</span>
            <span>Seat</span>
          </div>
          <span className="text-slate-600">————</span>
          <div className="flex items-center gap-2 text-slate-500">
            <span className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">2</span>
            <span>Food & Drink</span>
          </div>
          <span className="text-slate-600">————</span>
          <div className="flex items-center gap-2 text-slate-500">
            <span className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">3</span>
            <span>Payment</span>
          </div>
        </div>
      </div>

      {/* 2. THREE-COLUMN LAYOUT: (Poster/Schedule Left | Seat Map Center | Ticket Types Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT PANEL: MOVIE POSTER & LOCATION (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="aspect-[2/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900">
            <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
          </div>

          <div className="space-y-2 text-xs">
            <div className="font-bold text-white text-sm flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>{cinema.name}</span>
            </div>
            <div className="text-slate-400">{cinema.address}</div>

            <div className="flex gap-2 pt-2 overflow-x-auto scrollbar-none">
              {["10:30 PM", "2:45 PM", "5:15 PM"].map((t, idx) => (
                <span
                  key={t}
                  className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold ${
                    idx === 1
                      ? "bg-amber-400 text-black border-amber-400"
                      : "bg-white/5 border-white/10 text-slate-300"
                  }`}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER PANEL: STAGE & SEAT MATRIX (6 cols) */}
        <div className="lg:col-span-6 bg-[#0D121F] border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl overflow-x-auto">
          {/* Trapezoid Stage screen matching Figma */}
          <div className="w-full flex flex-col items-center">
            <div className="w-3/4 h-8 bg-gradient-to-b from-slate-700 to-slate-900 border-t-2 border-slate-500 rounded-t-xl flex items-center justify-center shadow-lg">
              <span className="text-[10px] font-black tracking-[0.4em] text-slate-400 uppercase">
                STAGE
              </span>
            </div>
          </div>

          {/* Seat Grid */}
          <div className="min-w-[420px] flex flex-col items-center space-y-2.5 pt-4">
            {Object.keys(rows)
              .sort()
              .map((rowName) => (
                <div key={rowName} className="flex items-center gap-3">
                  <span className="w-4 text-center text-xs font-bold text-slate-500">
                    {rowName}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {rows[rowName]
                      .sort((a, b) => a.number - b.number)
                      .map((seat) => {
                        const label = `${seat.row}${seat.number}`;
                        const isBooked = bookedSeats.includes(label);
                        const isSelected = booking.selectedSeats.some(
                          (s) => s.id === seat.id
                        );

                        // Pill seat style matching Figma
                        let seatStyle = "bg-slate-700 border-slate-600 text-slate-300 hover:border-amber-400";
                        if (isSelected) {
                          seatStyle = "bg-amber-400 border-amber-300 text-black font-black scale-105 shadow-md shadow-amber-400/30";
                        }
                        if (isBooked) {
                          seatStyle = "bg-slate-900 border-slate-800 text-slate-700 cursor-not-allowed opacity-40";
                        }

                        return (
                          <button
                            key={seat.id}
                            disabled={isBooked}
                            onClick={() =>
                              toggleSeat({
                                id: seat.id,
                                label,
                                price: seat.price,
                                type: seat.type,
                              })
                            }
                            className={`w-6 h-6 rounded-md border text-[10px] font-bold transition-all flex items-center justify-center ${seatStyle}`}
                          >
                            {seat.number}
                          </button>
                        );
                      })}
                  </div>

                  <span className="w-4 text-center text-xs font-bold text-slate-500">
                    {rowName}
                  </span>
                </div>
              ))}
          </div>

          {/* Legend matching Figma node 4235:25744 */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-6 border-t border-white/10 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded bg-slate-700 border border-slate-600" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded bg-slate-900 border border-slate-800 opacity-40" />
              <span>Reserved</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded bg-amber-400 border border-amber-300" />
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded bg-slate-950 border border-slate-900" />
              <span>Unavailable</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: SELECTED SEATS & TICKET COUNTERS (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-[#0D121F] border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider border-b border-white/10 pb-3">
              Selected Seats ({booking.selectedSeats.length})
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Adult</div>
                  <div className="text-slate-400 text-[11px]">$19.07</div>
                </div>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1">
                  <button onClick={() => setAdultCount(Math.max(0, adultCount - 1))} className="p-1 text-slate-300">
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-bold text-white w-4 text-center">{adultCount}</span>
                  <button onClick={() => setAdultCount(adultCount + 1)} className="p-1 text-amber-400">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Senior</div>
                  <div className="text-slate-400 text-[11px]">$16.95</div>
                </div>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1">
                  <button onClick={() => setSeniorCount(Math.max(0, seniorCount - 1))} className="p-1 text-slate-300">
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-bold text-white w-4 text-center">{seniorCount}</span>
                  <button onClick={() => setSeniorCount(seniorCount + 1)} className="p-1 text-amber-400">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Child</div>
                  <div className="text-slate-400 text-[11px]">$12.07</div>
                </div>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1">
                  <button onClick={() => setChildCount(Math.max(0, childCount - 1))} className="p-1 text-slate-300">
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-bold text-white w-4 text-center">{childCount}</span>
                  <button onClick={() => setChildCount(childCount + 1)} className="p-1 text-amber-400">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Total Payment display */}
            <div className="border-t border-white/10 pt-4 space-y-1">
              <div className="text-[11px] text-slate-400">Total Payment:</div>
              <div className="text-2xl font-black text-amber-400">
                ${(seatsTotal > 0 ? seatsTotal : 36.00).toFixed(2)}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => router.push("/booking/food")}
                className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-400/20"
              >
                Add To Cart
              </button>

              <button
                onClick={() => router.back()}
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 font-bold text-xs uppercase transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SeatSelectionPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-white bg-[#05070B] min-h-screen">Loading seat map...</div>}>
      <SeatSelectionContent />
    </Suspense>
  );
}
