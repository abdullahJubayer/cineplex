"use client";

import React from "react";
import Link from "next/link";
import { Ticket, Film, ShieldCheck, CreditCard, Sparkles, Popcorn } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#070A11] border-t border-slate-800/80 text-slate-400 text-sm">
      {/* Top feature banner */}
      <div className="border-b border-slate-800/60 bg-[#0B0F19]/50">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Instant E-Tickets</h4>
              <p className="text-xs text-slate-500">Scan & enter with zero queue</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider">IMAX Laser & Dolby</h4>
              <p className="text-xs text-slate-500">Next-gen cinema immersion</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Popcorn className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider">In-Seat Concessions</h4>
              <p className="text-xs text-slate-500">Pre-order food & drinks</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Secure Payment</h4>
              <p className="text-xs text-slate-500">100% refund guarantee</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white">
              <Film className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-white tracking-wider">TICKETOR</span>
          </Link>
          <p className="text-xs text-slate-500 leading-relaxed">
            The premium cinema booking platform designed for film lovers. Discover upcoming blockbusters, reserve custom seating, and order snacks directly from your phone.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Quick Links</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/" className="hover:text-rose-400 transition-colors">Now Showing</Link></li>
            <li><Link href="/showtimes" className="hover:text-rose-400 transition-colors">Showtimes</Link></li>
            <li><Link href="/cinemas" className="hover:text-rose-400 transition-colors">Locations</Link></li>
            <li><Link href="/food" className="hover:text-rose-400 transition-colors">Food & Combos</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Experience</h4>
          <ul className="space-y-2 text-xs">
            <li><span className="text-slate-500">IMAX 3D Laser</span></li>
            <li><span className="text-slate-500">Dolby Atmos Surround</span></li>
            <li><span className="text-slate-500">4DX Dynamic Seating</span></li>
            <li><span className="text-slate-500">VIP Recliner Lounges</span></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Support & Terms</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#" className="hover:text-rose-400 transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-rose-400 transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-rose-400 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-rose-400 transition-colors">Contact Support</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-600">
        <p>&copy; {new Date().getFullYear()} Ticketor Cineplex Pro. All rights reserved.</p>
      </div>
    </footer>
  );
}
