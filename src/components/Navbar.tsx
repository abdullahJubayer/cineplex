"use client";

import React from "react";
import Link from "next/link";
import { Film, Ticket, User, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-[#05070B]/90 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo matching Figma Ticketor */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center text-black font-black text-lg group-hover:scale-105 transition-transform">
            T
          </div>
          <span className="text-xl font-extrabold tracking-wider text-white">
            Ticketor
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-bold uppercase tracking-wider text-slate-300">
          <Link href="/" className="hover:text-amber-400 transition-colors">
            Movies
          </Link>
          <Link href="/showtimes" className="hover:text-amber-400 transition-colors">
            Showtimes
          </Link>
          <Link href="/cinemas" className="hover:text-amber-400 transition-colors">
            Cinemas
          </Link>
          <Link href="/food" className="hover:text-amber-400 transition-colors">
            Food & Drink
          </Link>
          <Link
            href="/ai-recommend"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 hover:bg-amber-400 hover:text-black transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Recommender</span>
          </Link>
        </nav>

        {/* Action / User section */}
        <div className="flex items-center gap-4">
          <Link
            href="/my-tickets"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 text-xs font-bold uppercase transition-all"
          >
            <Ticket className="w-4 h-4 text-amber-400" />
            <span>My Tickets</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-slate-900 border border-slate-800 hover:border-amber-400/50 transition-all"
              >
                <img
                  src={user.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
                  alt={user.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-xs font-semibold text-white hidden sm:inline">
                  {user.name}
                </span>
              </Link>
              <button
                onClick={logout}
                title="Log out"
                className="p-2 rounded-xl text-slate-400 hover:text-amber-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider transition-all"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
