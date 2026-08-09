"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertCircle, Minus, Plus, Star, MapPin, Ticket, Check } from "lucide-react";
import { useBooking } from "@/context/BookingContext";

function SeatSelectionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const showtimeId = searchParams.get("showtimeId");
  const { booking, toggleSeat, calculateTotal, setShowtime } = useBooking();

  const [showtimeData, setShowtimeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Ticket counters matching Figma right panel
  const [adultCount, setAdultCount] = useState(2);
  const [seniorCount, setSeniorCount] = useState(1);
  const [childCount, setChildCount] = useState(1);

  // Active date & time states matching Figma left panel
  const [selectedDate, setSelectedDate] = useState("Fri 11");
  const [selectedTime, setSelectedTime] = useState("2:45 PM");

  useEffect(() => {
    fetchSeatsData();
  }, [showtimeId]);

  const fetchSeatsData = async () => {
    setLoading(true);
    try {
      const url = showtimeId ? `/api/showtimes/${showtimeId}/seats` : `/api/showtimes`;
      const res = await fetch(url);
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
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
      <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse space-y-8 bg-[#010108] min-h-screen">
        <div className="h-20 bg-[#141418] rounded-2xl" />
        <div className="h-[600px] bg-[#141418] rounded-3xl" />
      </div>
    );
  }

  if (!showtimeData || !showtimeData.hall) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4 bg-[#010108] min-h-screen text-[#E0E0E4]">
        <AlertCircle className="w-12 h-12 text-[#FCFC65] mx-auto" />
        <h2 className="text-2xl font-bold text-white font-['Manrope']">No Showtime Selected</h2>
        <p className="text-sm text-[#9797AA]">Please choose a showtime session to view available seats.</p>
        <Link href="/showtimes" className="inline-block px-6 py-3 rounded-md bg-[#FCFC65] text-[#010108] text-xs font-bold uppercase">
          Browse Showtimes
        </Link>
      </div>
    );
  }

  const { hall, bookedSeats = [], movie, cinema } = showtimeData;
  const seats = hall.seats || [];
  const { seatsTotal } = calculateTotal();

  // Calculate ticket prices matching Figma right panel
  const calculatedTotal = adultCount * 19.07 + seniorCount * 16.95 + childCount * 12.07;

  // Group seats by row (A..H)
  const rows: Record<string, any[]> = {};
  seats.forEach((seat: any) => {
    if (!rows[seat.row]) rows[seat.row] = [];
    rows[seat.row].push(seat);
  });

  const selectedSeatLabels = booking.selectedSeats.map((s) => s.label).join(", ");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-32 bg-[#010108] text-[#E0E0E4] font-sans min-h-screen">
      {/* 1. FIGMA TOP HEADER & STEPPER BAR (Seat -> Food & Drink -> Payment -> Ticket) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#1A1A1F] pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white uppercase tracking-tight font-['Manrope']">
            {movie.title || "F1 The Movie"}
          </h1>
          <div className="flex items-center gap-3 text-xs text-[#9797AA] mt-1 font-medium">
            <span>{movie.durationMins || 155}m</span>
            <span>|</span>
            <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold">{movie.ageRating || "PG"}</span>
            <span>|</span>
            <div className="flex items-center gap-1 text-[#FCFC65] font-bold">
              <Star className="w-3.5 h-3.5 fill-[#FCFC65] text-[#FCFC65]" />
              <span>{movie.rating || 7.9}</span>
            </div>
          </div>
        </div>

        {/* Stepper Matching Figma Node 4235:25744 */}
        <div className="flex items-center gap-6 text-xs font-bold">
          <div className="flex items-center gap-2 text-[#FCFC65]">
            <span className="w-6 h-6 rounded-full bg-[#FCFC65] text-[#010108] flex items-center justify-center font-black">1</span>
            <span>Seat</span>
          </div>
          <span className="text-[#353541]">————</span>
          <div className="flex items-center gap-2 text-[#9797AA]">
            <span className="w-6 h-6 rounded-full bg-[#141418] border border-[#1A1A1F] flex items-center justify-center">2</span>
            <span>Food & Drink</span>
          </div>
          <span className="text-[#353541]">————</span>
          <div className="flex items-center gap-2 text-[#9797AA]">
            <span className="w-6 h-6 rounded-full bg-[#141418] border border-[#1A1A1F] flex items-center justify-center">3</span>
            <span>Payment</span>
          </div>
          <span className="text-[#353541]">————</span>
          <div className="flex items-center gap-2 text-[#9797AA]">
            <span className="w-6 h-6 rounded-full bg-[#141418] border border-[#1A1A1F] flex items-center justify-center">4</span>
            <span>Ticket</span>
          </div>
        </div>
      </div>

      {/* 2. THREE-COLUMN LAYOUT: (Poster/Cinema Left | Stage & Seat Map Center | Selected Seats Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: POSTER, CINEMA NAME & SHOWTIMES SELECTOR */}
        <div className="lg:col-span-3 space-y-6">
          <div className="aspect-[2/3] rounded-2xl overflow-hidden border border-[#1A1A1F] shadow-2xl bg-black">
            <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
          </div>

          <div className="space-y-4 bg-[#141418] p-5 rounded-2xl border border-[#1A1A1F]">
            <div className="space-y-1">
              <h3 className="font-bold text-white text-base font-['Manrope']">{cinema.name || "Regal Gallery Place"}</h3>
              <p className="text-xs text-[#9797AA]">{cinema.address || "701 Seventh Street Northwest, Washington, DC"}</p>
            </div>

            {/* Date Selector Pills */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase text-[#9797AA] tracking-wider">Date:</div>
              <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
                {["Tue 08", "Wed 09", "Thu 10", "Fri 11", "Sat 12", "Sun 13"].map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDate(d)}
                    className={`px-3 py-1.5 rounded text-xs font-bold whitespace-nowrap transition-all ${
                      selectedDate === d
                        ? "bg-[#FCFC65] text-[#010108]"
                        : "bg-[#010108] border border-[#1A1A1F] text-[#9797AA] hover:text-white"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Showtime Pills */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase text-[#9797AA] tracking-wider">Time:</div>
              <div className="flex flex-wrap gap-2">
                {["10:30 PM", "2:45 PM", "5:15 PM", "7:50 PM", "10:15 PM"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                      selectedTime === t
                        ? "bg-[#FCFC65] text-[#010108] font-extrabold"
                        : "bg-[#010108] border border-[#1A1A1F] text-[#E0E0E4] hover:border-[#FCFC65]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: TRAPEZOID STAGE SCREEN & SEAT MATRIX */}
        <div className="lg:col-span-6 bg-[#141418] border border-[#1A1A1F] rounded-3xl p-6 space-y-6 shadow-2xl overflow-x-auto">
          {/* Curved Perspective Trapezoid Stage Screen matching Figma */}
          <div className="w-full flex flex-col items-center pt-2">
            <div
              className="w-3/4 h-10 bg-gradient-to-b from-[#25252C] to-[#010108] border-t-2 border-[#FCFC65] rounded-t-2xl flex items-center justify-center shadow-lg"
              style={{
                clipPath: "polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)",
              }}
            >
              <span className="text-xs font-bold tracking-[0.4em] text-[#9797AA] uppercase">
                STAGE
              </span>
            </div>
          </div>

          {/* Seat Grid Matrix */}
          <div className="min-w-[420px] flex flex-col items-center space-y-2.5 pt-4">
            {Object.keys(rows)
              .sort()
              .map((rowName) => (
                <div key={rowName} className="flex items-center gap-3">
                  <span className="w-4 text-center text-xs font-bold text-[#9797AA]">
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

                        // Seat Pill Styling matching Figma
                        let seatStyle = "bg-[#25252C] border-[#353541] text-[#E0E0E4] hover:border-[#FCFC65]";
                        if (isSelected) {
                          seatStyle = "bg-[#FCFC65] border-[#FCFC65] text-[#010108] font-black scale-105 shadow-md shadow-[#FCFC65]/40";
                        }
                        if (isBooked) {
                          seatStyle = "bg-[#010108] border-[#1A1A1F] text-[#353541] cursor-not-allowed opacity-50";
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

                  <span className="w-4 text-center text-xs font-bold text-[#9797AA]">
                    {rowName}
                  </span>
                </div>
              ))}
          </div>

          {/* Selected Seats Counter Line */}
          <div className="p-3 rounded-xl bg-[#010108] border border-[#1A1A1F] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#FCFC65] font-bold">
              <Ticket className="w-4 h-4 text-[#FCFC65]" />
              <span>{booking.selectedSeats.length} Selected Seats</span>
            </div>
            <div className="text-white font-mono font-bold">
              {selectedSeatLabels || "None"}
            </div>
          </div>

          {/* Legend Bar matching Figma */}
          <div className="flex flex-wrap items-center justify-center gap-5 pt-4 border-t border-[#1A1A1F] text-xs text-[#9797AA]">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded bg-[#25252C] border border-[#353541]" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded bg-[#010108] border border-[#1A1A1F]" />
              <span>Reserved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded bg-[#FCFC65]" />
              <span className="text-[#FCFC65] font-bold">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded bg-[#010108] opacity-50" />
              <span>Unavailable</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SELECTED SEATS TICKET COUNTERS & TOTAL PAYMENT */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-[#141418] border border-[#1A1A1F] rounded-3xl p-6 space-y-6 shadow-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#1A1A1F] pb-3 font-['Manrope']">
              Selected Seats
            </h3>

            {/* Stepper Rows Matching Figma */}
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Adult</div>
                  <div className="text-xs text-[#9797AA]">$19.07</div>
                </div>
                <div className="flex items-center gap-2 bg-[#010108] border border-[#1A1A1F] rounded-md p-1">
                  <button onClick={() => setAdultCount(Math.max(0, adultCount - 1))} className="p-1 text-[#9797AA] hover:text-white">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-white w-5 text-center">{adultCount}</span>
                  <button onClick={() => setAdultCount(adultCount + 1)} className="p-1 text-[#FCFC65]">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Senior</div>
                  <div className="text-xs text-[#9797AA]">$16.95</div>
                </div>
                <div className="flex items-center gap-2 bg-[#010108] border border-[#1A1A1F] rounded-md p-1">
                  <button onClick={() => setSeniorCount(Math.max(0, seniorCount - 1))} className="p-1 text-[#9797AA] hover:text-white">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-white w-5 text-center">{seniorCount}</span>
                  <button onClick={() => setSeniorCount(seniorCount + 1)} className="p-1 text-[#FCFC65]">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Child</div>
                  <div className="text-xs text-[#9797AA]">$12.07</div>
                </div>
                <div className="flex items-center gap-2 bg-[#010108] border border-[#1A1A1F] rounded-md p-1">
                  <button onClick={() => setChildCount(Math.max(0, childCount - 1))} className="p-1 text-[#9797AA] hover:text-white">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-white w-5 text-center">{childCount}</span>
                  <button onClick={() => setChildCount(childCount + 1)} className="p-1 text-[#FCFC65]">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Total Payment display matching Figma */}
            <div className="border-t border-[#1A1A1F] pt-4 space-y-1">
              <div className="text-xs text-[#9797AA]">Total Payment:</div>
              <div className="text-3xl font-extrabold text-white">
                ${calculatedTotal.toFixed(2)}
              </div>
            </div>

            {/* Action Buttons matching Figma */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => router.push("/booking/food")}
                className="w-full py-3.5 rounded-md bg-[#FCFC65] hover:bg-[#ecec50] text-[#010108] font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-[#FCFC65]/20"
              >
                Add To Cart
              </button>

              <button
                onClick={() => router.back()}
                className="w-full py-3 rounded-md bg-transparent border border-[#1A1A1F] text-[#9797AA] hover:text-white font-bold text-xs uppercase transition-all"
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
    <Suspense fallback={<div className="p-20 text-center text-white bg-[#010108] min-h-screen">Loading seat map...</div>}>
      <SeatSelectionContent />
    </Suspense>
  );
}
