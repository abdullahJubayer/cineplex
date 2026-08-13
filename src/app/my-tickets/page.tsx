"use client";

import React, { useState, useEffect } from "react";
import { Ticket, QrCode, Calendar, MapPin, Film, Popcorn, UserCheck, ShieldAlert } from "lucide-react";
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
      if (user?.id) {
        // Logged-in User History (User-wise isolation)
        const res = await fetch(`/api/bookings?userId=${user.id}`);
        const data = await res.json();
        if (Array.isArray(data)) setBookings(data);
      } else {
        // Anonymous Guest History (Session-wise isolation)
        const storedGuestNos = sessionStorage.getItem("ticketor_guest_booking_nos");
        if (storedGuestNos) {
          try {
            const nosArray = JSON.parse(storedGuestNos);
            if (Array.isArray(nosArray) && nosArray.length > 0) {
              const res = await fetch(`/api/bookings?bookingNos=${encodeURIComponent(nosArray.join(","))}`);
              const data = await res.json();
              if (Array.isArray(data)) setBookings(data);
              else setBookings([]);
            } else {
              setBookings([]);
            }
          } catch (err) {
            setBookings([]);
          }
        } else {
          setBookings([]);
        }
      }
    } catch (e) {
      console.error(e);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-8 pb-24 font-sans text-slate-100 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white flex items-center gap-3 font-['Manrope']">
            <Ticket className="w-8 h-8 text-[#FCFC65]" />
            <span>My Tickets & Booking History</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Access your digital QR entry codes and past movie reservations.
          </p>
        </div>

        {user ? (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold shrink-0">
            <UserCheck className="w-4 h-4" />
            <span>Account: {user.name}</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FCFC65]/10 border border-[#FCFC65]/30 text-[#FCFC65] text-xs font-bold shrink-0">
            <ShieldAlert className="w-4 h-4" />
            <span>Guest Session History</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2].map((n) => (
            <div key={n} className="h-48 bg-slate-800/40 rounded-3xl border border-white/5" />
          ))}
        </div>
      ) : bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-[#141418] border border-[#1A1A1F] rounded-3xl p-6 shadow-2xl flex flex-col justify-between space-y-6 hover:border-[#FCFC65]/50 transition-all relative overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2.5 py-1 rounded bg-[#FCFC65] text-[#010108] text-[10px] font-black uppercase tracking-wider">
                    {b.status}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-2 font-['Manrope']">
                    {b.showtime?.movie?.title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {b.showtime?.cinema?.name} • {b.showtime?.hall?.name || "Auditorium 1"}
                  </p>
                </div>

                {b.qrCodeUrl && (
                  <div className="bg-white p-1.5 rounded-xl border border-white/20 shrink-0">
                    <img src={b.qrCodeUrl} alt="QR Code Entry Pass" className="w-16 h-16" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs pt-4 border-t border-white/10">
                <div>
                  <div className="text-slate-500 font-semibold">Booking No.</div>
                  <div className="text-[#FCFC65] font-mono font-bold">{b.bookingNo}</div>
                </div>
                <div>
                  <div className="text-slate-500 font-semibold">Seats</div>
                  <div className="text-white font-bold">
                    {JSON.parse(b.seatsJson || "[]").join(", ")}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 font-semibold">Showtime</div>
                  <div className="text-white font-medium">
                    {new Date(b.showtime?.startTime).toLocaleString([], {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 font-semibold">Total Paid</div>
                  <div className="text-emerald-400 font-black text-sm">${b.totalPrice.toFixed(2)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#141418]/50 rounded-3xl border border-dashed border-white/10 p-8 space-y-3">
          <Ticket className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-white font-bold text-base">No Tickets Found</h3>
          <p className="text-slate-400 text-xs max-w-sm mx-auto">
            {user
              ? "You haven't booked any movie tickets under your account yet."
              : "No active guest session tickets found. Log in to view your account booking history."}
          </p>
        </div>
      )}
    </div>
  );
}
