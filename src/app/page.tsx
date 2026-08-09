"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MovieCard } from "@/components/MovieCard";
import {
  Play,
  Ticket,
  ChevronRight,
  Star,
  Film,
  Sparkles,
  Smartphone,
} from "lucide-react";
import { useBooking } from "@/context/BookingContext";

export default function HomePage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { setMovie } = useBooking();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/movies");
      const data = await res.json();
      if (Array.isArray(data)) setMovies(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const nowShowing = movies.filter((m) => m.status === "NOW_SHOWING");
  const comingSoon = movies.filter((m) => m.status === "COMING_SOON");
  const heroMovie = movies[0] || {
    id: "mov_dune2",
    title: "Dune: Part Two",
    bannerUrl:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1440&q=80",
    posterUrl:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
  };

  return (
    <div className="space-y-20 pb-32 overflow-hidden bg-[#05070B] text-slate-100">
      {/* 1. HERO SECTION WITH FIGMA BACKGROUND & EXACT TITLE */}
      <section className="relative w-full min-h-[88vh] flex items-center justify-center pt-10 pb-20 overflow-hidden">
        {/* Hero Background Backdrop */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80"
            alt="Hero Backdrop"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-[#05070B]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#05070B] via-transparent to-[#05070B]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-8">
          <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tight leading-tight uppercase drop-shadow-2xl">
            BOOK YOUR MOVIE <br />
            <span className="text-amber-400">TICKETS NOW!</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-xl mx-auto font-medium">
            Watch the latest movies at your favorite cinemas
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href={`/movies/${heroMovie.id}`}
              onClick={() =>
                setMovie({
                  id: heroMovie.id,
                  title: heroMovie.title,
                  poster: heroMovie.posterUrl,
                })
              }
              className="px-8 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-400/20 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <Ticket className="w-4 h-4 fill-black" />
              <span>Explore Movies</span>
            </Link>

            <Link
              href="/showtimes"
              className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-extrabold text-xs uppercase tracking-wider backdrop-blur-xl transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>See Showtimes</span>
            </Link>
          </div>

          {/* Stat counters matching Figma frame 1464203890 */}
          <div className="pt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto border-t border-white/10">
            <div className="space-y-1">
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">500 +</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Movies Available</div>
            </div>
            <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0">
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">150 +</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Cinema Locations</div>
            </div>
            <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0">
              <div className="text-4xl sm:text-5xl font-black text-amber-400 tracking-tight">1M +</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Happy Customers</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CURRENTLY IN CINEMAS CAROUSEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Currently In Cinemas
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Discover the latest movies now playing in cinemas — book your tickets online!
            </p>
          </div>

          <Link
            href="/showtimes"
            className="flex items-center gap-1 text-xs font-bold text-amber-400 hover:underline"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-none animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="w-[225px] h-[405px] bg-white/5 rounded-2xl shrink-0" />
            ))}
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-none snap-x">
            {nowShowing.map((movie) => (
              <div key={movie.id} className="snap-start shrink-0">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. TOP 10 MOVIES THIS WEEK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Top 10 Movies This Week
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Top 10 movies requested and movie ticket sales
            </p>
          </div>

          <Link
            href="/showtimes"
            className="flex items-center gap-1 text-xs font-bold text-amber-400 hover:underline"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-none snap-x">
          {movies.slice(0, 6).map((movie, idx) => (
            <div key={movie.id} className="relative snap-start shrink-0">
              <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-amber-400 text-black font-black text-xs flex items-center justify-center z-20 shadow-md">
                #{idx + 1}
              </div>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </section>

      {/* 4. FESTIVALS & SPECIAL OFFERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0B0E17] border border-white/10 rounded-3xl p-8 sm:p-12 space-y-8 shadow-2xl">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              NOW SHOWING WITH FESTIVALS, SCREENINGS AND SPECIAL OFFERS
            </h2>
            <p className="text-xs text-slate-400">
              Enjoy all the classic and limited-time box office offers & tickets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 hover:border-amber-400/50 transition-all">
              <span className="px-3 py-1 rounded bg-amber-400/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                Special Event
              </span>
              <h3 className="text-xl font-bold text-white">Horror Film Festival</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Special screening marathon with exclusive filmmaker Q&A.
              </p>
              <Link
                href="/showtimes"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 text-black text-xs font-extrabold uppercase"
              >
                <span>Book Seats &rarr;</span>
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 hover:border-amber-400/50 transition-all">
              <span className="px-3 py-1 rounded bg-amber-400/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                Special Discount
              </span>
              <h3 className="text-xl font-bold text-white">Student Discount</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Flat 20% off all Tuesday and Wednesday matinee showtimes.
              </p>
              <Link
                href="/showtimes"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 text-black text-xs font-extrabold uppercase"
              >
                <span>Claim Pass &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. COMING SOON */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Coming Soon
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Get ready for cinema upcoming releases
            </p>
          </div>

          <Link
            href="/showtimes"
            className="flex items-center gap-1 text-xs font-bold text-amber-400 hover:underline"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-none snap-x">
          {comingSoon.map((movie) => (
            <div key={movie.id} className="snap-start shrink-0">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </section>

      {/* 6. BRAND LOGO BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-around gap-6 text-center text-xs font-black text-slate-400">
          <span className="text-rose-600 text-xl font-extrabold">NETFLIX</span>
          <span className="text-cyan-400 text-lg font-bold">showmax</span>
          <span className="text-white text-xl font-bold">Disney+</span>
          <span className="bg-amber-400 text-black px-2 py-0.5 rounded font-black text-base">IMDb</span>
          <span className="text-rose-500 font-extrabold text-sm">ROTTEN TOMATOES</span>
          <span className="text-cyan-300 font-bold text-sm">prime video</span>
        </div>
      </section>

      {/* 7. APP DOWNLOAD PROMO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0B0E17] border border-white/10 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-lg">
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">
              Enjoy Ticketor Mobile App Experience
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Unlock offline e-tickets, instant row seat upgrades, and exclusive popcorn discount offers on iOS and Android devices.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <button className="px-6 py-3 rounded-xl bg-white text-black font-extrabold text-xs hover:bg-slate-200 transition-colors">
                App Store
              </button>
              <button className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-extrabold text-xs hover:bg-white/20 transition-colors">
                Google Play
              </button>
            </div>
          </div>

          <div className="w-56 aspect-[9/16] bg-black rounded-[32px] border-4 border-slate-700 shadow-2xl p-4 flex flex-col justify-between">
            <div className="w-16 h-3 bg-slate-800 rounded-full mx-auto" />
            <div className="text-center space-y-2 my-auto">
              <Ticket className="w-8 h-8 text-amber-400 mx-auto" />
              <div className="text-xs font-bold text-white">Ticketor Pass</div>
            </div>
            <div className="w-full py-2 rounded-xl bg-amber-400 text-black text-center font-extrabold text-[10px]">
              TICKET READY
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
