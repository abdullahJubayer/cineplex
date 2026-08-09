"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CreditCard, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import { useAuth } from "@/context/AuthContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { booking, calculateTotal, resetBooking } = useBooking();
  const { user } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedBooking, setCompletedBooking] = useState<any>(null);

  const { seatsTotal, foodTotal, bookingFee, grandTotal } = calculateTotal();

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking.showtimeId || booking.selectedSeats.length === 0) return;

    setIsSubmitting(true);
    try {
      const payload = {
        userId: user?.id || "usr_demo",
        showtimeId: booking.showtimeId,
        seats: booking.selectedSeats.map((s) => s.label),
        foodItems: booking.foodItems,
        totalPrice: grandTotal,
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setCompletedBooking(data);
        resetBooking();
      } else {
        alert(data.error || "Failed to process booking.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (completedBooking) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 space-y-8 text-center bg-[#05070B] text-slate-100">
        <div className="w-20 h-20 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-400 flex items-center justify-center mx-auto shadow-2xl">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-white uppercase">Booking Confirmed!</h1>
          <p className="text-slate-400 text-sm">
            Ticket Code: <span className="text-amber-400 font-extrabold">{completedBooking.bookingNo}</span>
          </p>
        </div>

        <div className="bg-[#0D121F] border border-white/10 rounded-3xl p-6 text-left space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white uppercase">
                {completedBooking.showtime?.movie?.title}
              </h3>
              <p className="text-xs text-slate-400">
                {completedBooking.showtime?.cinema?.name} • {completedBooking.showtime?.hall?.name}
              </p>
            </div>
            <span className="px-3 py-1 rounded bg-amber-400/20 text-amber-400 text-xs font-bold uppercase">
              {completedBooking.showtime?.format}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-slate-400">Showtime</div>
              <div className="text-white font-semibold">
                {new Date(completedBooking.showtime?.startTime).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-slate-400">Seats</div>
              <div className="text-white font-semibold">
                {JSON.parse(completedBooking.seatsJson).join(", ")}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
            {completedBooking.qrCodeUrl && (
              <img
                src={completedBooking.qrCodeUrl}
                alt="QR Ticket"
                className="w-36 h-36 rounded-lg bg-white p-2"
              />
            )}
            <span className="text-[10px] text-slate-400 font-mono">Scan at Cinema Entrance</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 pt-4">
          <Link
            href="/my-tickets"
            className="px-6 py-3 rounded-xl bg-amber-400 text-black font-extrabold text-xs uppercase"
          >
            View My Tickets
          </Link>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-white/10 text-white font-bold text-xs uppercase"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8 pb-20 bg-[#05070B] text-slate-100">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-black text-white uppercase">Checkout & Payment</h1>
            <p className="text-xs text-slate-400">Review your ticket summary and confirm payment</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-xs font-bold">
          <span className="px-3 py-1 rounded-full bg-white/5 text-slate-400">1. Seats</span>
          <span className="text-slate-600">&rarr;</span>
          <span className="px-3 py-1 rounded-full bg-white/5 text-slate-400">2. Food</span>
          <span className="text-slate-600">&rarr;</span>
          <span className="px-3 py-1 rounded-full bg-amber-400 text-black">3. Checkout</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handlePayNow} className="space-y-6">
            <div className="bg-[#0D121F] border border-white/10 rounded-3xl p-6 space-y-6 shadow-xl">
              <h3 className="text-base font-bold text-white uppercase border-b border-white/10 pb-3">
                Payment Details
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    defaultValue={user?.name || "Alex Rivera"}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Card Number</label>
                  <input
                    type="text"
                    defaultValue="4532 8910 2341 8892"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1">Expiry</label>
                    <input
                      type="text"
                      defaultValue="08/28"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">CVV</label>
                    <input
                      type="password"
                      defaultValue="891"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider shadow-xl transition-all"
            >
              {isSubmitting ? "Processing..." : `Pay $${grandTotal.toFixed(2)} & Confirm`}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-[#0D121F] border border-white/10 rounded-3xl p-6 space-y-6 shadow-xl">
            <h3 className="text-base font-bold text-white uppercase border-b border-white/10 pb-3">
              Booking Summary
            </h3>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Movie</span>
                <span className="font-bold text-white">{booking.movieTitle}</span>
              </div>
              <div className="flex justify-between">
                <span>Seats</span>
                <span className="font-bold text-white">{booking.selectedSeats.map((s) => s.label).join(", ")}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-amber-400 pt-3 border-t border-white/10">
                <span>Grand Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
