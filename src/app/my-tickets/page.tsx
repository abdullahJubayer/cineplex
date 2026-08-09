"use client";

import React, { useState, useEffect } from "react";
import { Ticket, QrCode, Calendar, MapPin, Film, Popcorn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function MyTicketsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyTickets();
  }, [user]);

  const fetchMyTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings?userId=${user?.id || "usr_demo"}`);
      const data = await res.json();
      if (Array.isArray(data)) setBookings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-8 pb-24">
      <div>
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <Ticket className="w-7 h-7 text-rose-500" />
          <span>My Tickets & Booking History</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Access your digital QR entry codes and past movie reservations.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2].map((n) => (
            <div key={n} className="h-48 bg-slate-800/40 rounded-3xl" />
          ))}
        </div>
      ) : bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-[#131927] border border-slate-800/80 rounded-3xl p-6 shadow-2xl flex flex-col justify-between space-y-6 hover:border-slate-700 transition-all relative overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2.5 py-1 rounded bg-rose-500/20 border border-rose-500/30 text-rose-400 text-[10px] font-extrabold uppercase tracking-wider">
                    {b.status}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-2">
                    {b.showtime?.movie?.title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {b.showtime?.cinema?.name} • {b.showtime?.hall?.name}
                  </p>
                </div>

                {b.qrCodeUrl && (
                  <div className="bg-white p-1.5 rounded-xl border border-white/20 shrink-0">
                    <img src={b.qrCodeUrl} alt="QR Code" className="w-16 h-16" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-800/80">
                <div>
                  <div className="text-slate-500">Booking No.</div>
                  <div className="text-white font-mono font-bold">{b.bookingNo}</div>
                </div>
                <div>
                  <div className="text-slate-500">Seats</div>
                  <div className="text-white font-bold">
                    {JSON.parse(b.seatsJson).join(", ")}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">Showtime</div>
                  <div className="text-white font-semibold">
                    {new Date(b.showtime?.startTime).toLocaleString([], {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">Total Paid</div>
                  <div className="text-rose-400 font-black">${b.totalPrice.toFixed(2)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#131927]/40 rounded-3xl border border-dashed border-slate-800">
          <Ticket className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-white font-bold text-base mb-1">No Tickets Found</h3>
          <p className="text-slate-400 text-xs">You haven't booked any movie tickets yet.</p>
        </div>
      )}
    </div>
  );
}
