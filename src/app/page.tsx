"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MovieCard } from "@/components/MovieCard";
import {
  Play,
  Ticket,
  ChevronRight,
  ChevronLeft,
  Star,
  Film,
  Sparkles,
  Plus,
  Minus,
  Mail,
  ArrowRight,
  CheckCircle2,
  Clock,
  Calendar,
  X,
} from "lucide-react";
import { useBooking } from "@/context/BookingContext";

export default function HomePage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Hero Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [playingTrailerUrl, setPlayingTrailerUrl] = useState<string | null>(null);

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

  // Hero Featured Carousel Items (Real DB Movies)
  const heroFeaturedMovies = nowShowing.length > 0 ? nowShowing : movies;

  // Auto-rotate Hero Carousel every 6 seconds
  useEffect(() => {
    if (heroFeaturedMovies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroFeaturedMovies.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroFeaturedMovies.length]);

  const activeHeroMovie = heroFeaturedMovies[currentSlide] || {
    id: "mov_default",
    title: "Gladiator II",
    tagline: "Prepare to be entertained.",
    description: "Lucius enters the Colosseum after his home is conquered by tyrannical Emperors.",
    posterUrl: "https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/tOqIwliWMovSIZ9DyvHcHI7p2im.jpg",
    rating: 8.8,
    ageRating: "PG-13",
    durationMins: 148,
    genres: "Action, Adventure, Drama",
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroFeaturedMovies.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroFeaturedMovies.length) % heroFeaturedMovies.length);
  };

  const faqItems = [
    {
      question: "What is Ticketor?",
      answer:
        "Ticketor is a modern cinema ticketing platform enabling film lovers to explore upcoming movies, select precise cinema seats live, order concessions, and store digital QR e-tickets effortlessly.",
    },
    {
      question: "Can I modify my seat selection after booking a ticket?",
      answer:
        "Yes! You can modify your seat allocation up to 2 hours before the movie showtime via the 'My Tickets' section or by contacting our 24/7 customer support team.",
    },
    {
      question: "Is my payment information secure with Ticketor?",
      answer:
        "Yes, 100%. All transactions on Ticketor are processed using bank-grade 256-bit SSL encryption and strict security compliance to protect your sensitive details.",
    },
    {
      question: "What if I have trouble booking tickets through the app?",
      answer:
        "Our dedicated customer experience team is available around the clock via live chat and email. Any issues with bookings, seating, or payments are resolved in minutes.",
    },
    {
      question: "How do I redeem promo codes or discounts?",
      answer:
        "Simply enter your valid promo code on the payment summary screen during checkout before finalizing your booking to apply instant savings.",
    },
  ];

  const reviews = [
    {
      name: "Ada",
      role: "Movie goer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      quote:
        "I messed up the showtime and customer support fixed it in under 5 minutes on chat. Didn’t even lose my loyalty points. Impressed.",
      stars: 5,
    },
    {
      name: "Jumi",
      role: "Developer",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      quote:
        "Three taps, ticket bought, QR scanned and done. This is how it should work.",
      stars: 5,
    },
    {
      name: "Jenifer",
      role: "Movie goer",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      quote:
        "Booked two IMAX seats in 45 seconds; the live seat map never stuttered and highlighted rows I’d rated before.",
      stars: 5,
    },
    {
      name: "Mathew",
      role: "Artist",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      quote:
        "The dark mode and minimal pop-ups made late-night browsing painless. Highly recommend Ticketor!",
      stars: 5,
    },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput("");
    }
  };

  return (
    <div className="space-y-24 pb-32 overflow-hidden bg-[#010108] text-[#E0E0E4] font-sans">
      {/* 1. INTERACTIVE HERO FEATURED MOVIE CAROUSEL */}
      <section className="relative w-full min-h-[90vh] flex flex-col justify-between pt-8 pb-12 overflow-hidden group">
        {/* Dynamic Background Image with Smooth Fade */}
        <div className="absolute inset-0 z-0">
          {heroFeaturedMovies.map((m, idx) => (
            <div
              key={m.id || idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentSlide ? "opacity-70 scale-105" : "opacity-0 pointer-events-none"
              }`}
            >
              <img
                src={m.bannerUrl || m.posterUrl}
                alt={m.title}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}

          {/* Scrim Gradients for Visual Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#010108] via-[#010108]/60 to-[#010108]/30" />
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#010108]/70 to-[#010108]" />
        </div>

        {/* Carousel Navigation Arrow Controls */}
        {heroFeaturedMovies.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#141418]/80 hover:bg-[#FCFC65] hover:text-[#010108] text-white border border-[#1A1A1F] flex items-center justify-center backdrop-blur-md transition-all shadow-2xl"
              aria-label="Previous Featured Movie"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#141418]/80 hover:bg-[#FCFC65] hover:text-[#010108] text-white border border-[#1A1A1F] flex items-center justify-center backdrop-blur-md transition-all shadow-2xl"
              aria-label="Next Featured Movie"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Hero Active Movie Content Overlay */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 w-full my-auto pt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-6 text-left">
            {/* Metadata Pills */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded bg-[#FCFC65] text-[#010108] text-xs font-black uppercase tracking-wider">
                🔥 #1 NOW SHOWING
              </span>
              <span className="px-3 py-1 rounded bg-[#141418]/90 border border-[#1A1A1F] text-[#FCFC65] text-xs font-mono font-bold">
                ⭐ {activeHeroMovie.rating ? activeHeroMovie.rating : 8.8} / 10
              </span>
              <span className="px-3 py-1 rounded bg-[#141418]/90 border border-[#1A1A1F] text-white text-xs font-semibold">
                {activeHeroMovie.ageRating || "PG-13"}
              </span>
              <span className="px-3 py-1 rounded bg-[#141418]/90 border border-[#1A1A1F] text-[#9797AA] text-xs font-medium">
                {activeHeroMovie.durationMins || 148} MINS
              </span>
            </div>

            {/* Dynamic Movie Title */}
            <h1 className="text-5xl sm:text-7xl lg:text-[76px] font-black text-white tracking-tight uppercase leading-[1.05] drop-shadow-2xl font-['Manrope']">
              {activeHeroMovie.title}
            </h1>

            <p className="text-base sm:text-lg text-[#E0E0E4] max-w-2xl font-normal leading-relaxed line-clamp-3">
              {activeHeroMovie.description || activeHeroMovie.tagline}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={`/showtimes?movieId=${activeHeroMovie.id}`}
                onClick={() =>
                  setMovie({
                    id: activeHeroMovie.id,
                    title: activeHeroMovie.title,
                    poster: activeHeroMovie.posterUrl,
                  })
                }
                className="px-8 py-4 rounded-md bg-[#FCFC65] hover:bg-[#ecec50] text-[#010108] font-bold text-base uppercase tracking-wider shadow-xl shadow-[#FCFC65]/20 transition-all transform hover:scale-105 flex items-center gap-3"
              >
                <Ticket className="w-5 h-5 fill-[#010108]" />
                <span>Book Tickets</span>
              </Link>

              {activeHeroMovie.watchUrl && (
                <button
                  onClick={() => setPlayingTrailerUrl(activeHeroMovie.watchUrl)}
                  className="px-8 py-4 rounded-md bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-base uppercase tracking-wider backdrop-blur-xl transition-all flex items-center gap-2"
                >
                  <Play className="w-5 h-5 fill-current text-[#FCFC65]" />
                  <span>Watch Trailer</span>
                </button>
              )}
            </div>
          </div>

          {/* Hero Movie Poster Display */}
          <div className="lg:col-span-4 hidden lg:flex justify-end">
            <div className="w-72 aspect-[2/3] rounded-3xl overflow-hidden border-2 border-[#FCFC65]/40 shadow-2xl relative group-hover:border-[#FCFC65] transition-all">
              <img
                src={activeHeroMovie.posterUrl}
                alt={activeHeroMovie.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Slide Indicator Dots / Pills Bar */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 w-full pt-8 space-y-6">
          <div className="flex items-center justify-center gap-2">
            {heroFeaturedMovies.map((m, idx) => (
              <button
                key={m.id || idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2.5 rounded-full transition-all ${
                  idx === currentSlide
                    ? "w-10 bg-[#FCFC65] shadow-md shadow-[#FCFC65]/30"
                    : "w-2.5 bg-white/30 hover:bg-white/60"
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Counter Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-6 px-8 rounded-2xl bg-[#141418]/80 backdrop-blur-xl border border-[#1A1A1F] text-center">
            <div className="space-y-1">
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">500 +</div>
              <div className="text-xs font-semibold text-[#9797AA] uppercase tracking-wider">Movies Available</div>
            </div>
            <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0">
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">150 +</div>
              <div className="text-xs font-semibold text-[#9797AA] uppercase tracking-wider">Cinema Locations</div>
            </div>
            <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0">
              <div className="text-4xl sm:text-5xl font-black text-[#FCFC65] tracking-tight">1M +</div>
              <div className="text-xs font-semibold text-[#9797AA] uppercase tracking-wider">Happy Customers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trailer Video Player Modal */}
      {playingTrailerUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden border border-[#FCFC65]/40 shadow-2xl bg-black">
            <button
              onClick={() => setPlayingTrailerUrl(null)}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/70 hover:bg-[#FCFC65] hover:text-black text-white transition-all"
            >
              <X className="w-6 h-6" />
            </button>
            <iframe
              src={playingTrailerUrl}
              title="Official Trailer"
              className="w-full h-full border-0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* 2. CURRENTLY IN CINEMAS CAROUSEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between border-b border-[#1A1A1F] pb-5">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight uppercase font-['Manrope']">
              Currently In Cinemas
            </h2>
            <p className="text-sm text-[#9797AA] mt-1 capitalize">
              Discover The Latest Movies Now Playing In Cinemas - Book Your Tickets Online!
            </p>
          </div>

          <Link
            href="/showtimes"
            className="flex items-center gap-1.5 text-sm font-bold text-[#FCFC65] hover:underline uppercase tracking-wider"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-none animate-pulse">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="w-[225px] h-[405px] bg-[#141418] rounded-xl shrink-0 border border-[#1A1A1F]" />
            ))}
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-none snap-x">
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
        <div className="flex items-end justify-between border-b border-[#1A1A1F] pb-5">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight uppercase font-['Manrope']">
              Top 10 movies this week
            </h2>
            <p className="text-sm text-[#9797AA] mt-1 capitalize">
              Top Requested Movies And Movie Ticket Sales.
            </p>
          </div>

          <Link
            href="/showtimes"
            className="flex items-center gap-1.5 text-sm font-bold text-[#FCFC65] hover:underline uppercase tracking-wider"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-none snap-x">
          {movies.slice(0, 8).map((movie, idx) => (
            <div key={movie.id} className="relative snap-start shrink-0">
              <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-[#FCFC65] text-[#010108] font-black text-xs flex items-center justify-center z-20 shadow-lg shadow-[#FCFC65]/30">
                #{idx + 1}
              </div>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </section>

      {/* 4. FESTIVALS, SCREENINGS & SPECIAL OFFERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-4xl font-bold text-white uppercase tracking-tight font-['Manrope']">
            NOW SHOWING WITH FESTIVALS, SCREENINGS AND SPECIAL OFFERS
          </h2>
          <p className="text-sm text-[#9797AA] capitalize">
            Enjoy All The Classic And Limited-Time Box Office - Festival & Movie Screening Deals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative rounded-2xl overflow-hidden bg-[#141418] border border-[#1A1A1F] min-h-[360px] flex flex-col justify-end p-8 group hover:border-[#FCFC65]/50 transition-all">
            <img
              src="/images/horror_festival.jpg"
              alt="Horror Film Festival"
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141418] via-[#141418]/60 to-transparent" />

            <div className="relative z-10 space-y-4">
              <span className="inline-block px-3 py-1 rounded bg-[#FCFC65] text-[#010108] text-xs font-bold uppercase">
                Special Event
              </span>
              <h3 className="text-3xl font-bold text-white font-['Manrope']">Horror Film Festival</h3>
              <p className="text-sm text-[#E0E0E4]">Special screening marathon</p>
              <Link
                href="/showtimes"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-[#FCFC65] text-[#010108] text-sm font-bold uppercase tracking-wider hover:bg-[#ecec50] transition-colors"
              >
                <span>Book Seats &gt;</span>
              </Link>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden bg-[#141418] border border-[#1A1A1F] min-h-[360px] flex flex-col justify-end p-8 group hover:border-[#FCFC65]/50 transition-all">
            <img
              src="/images/student_discount.jpg"
              alt="Student Discount"
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141418] via-[#141418]/60 to-transparent" />

            <div className="relative z-10 space-y-4">
              <span className="inline-block px-3 py-1 rounded bg-[#FCFC65] text-[#010108] text-xs font-bold uppercase">
                Special Offer
              </span>
              <h3 className="text-3xl font-bold text-white font-['Manrope']">Student Discount</h3>
              <p className="text-sm text-[#E0E0E4]">Flat 20% off all Wednesday & Thursday matinees</p>
              <Link
                href="/showtimes"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-[#FCFC65] text-[#010108] text-sm font-bold uppercase tracking-wider hover:bg-[#ecec50] transition-colors"
              >
                <span>Claim Pass &gt;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. COMING SOON */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between border-b border-[#1A1A1F] pb-5">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight uppercase font-['Manrope']">
              Coming Soon
            </h2>
            <p className="text-sm text-[#9797AA] mt-1 capitalize">
              Get Ready For Cinema Upcoming Releases
            </p>
          </div>

          <Link
            href="/showtimes"
            className="flex items-center gap-1.5 text-sm font-bold text-[#FCFC65] hover:underline uppercase tracking-wider"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-none snap-x">
          {comingSoon.map((movie) => (
            <div key={movie.id} className="snap-start shrink-0">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </section>

      {/* 6. FEATURED BANNER & BRAND LOGOS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="bg-[#141418] border border-[#1A1A1F] rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center min-h-[500px]">
          <div className="lg:col-span-6 relative h-[380px] lg:h-[500px] w-full overflow-hidden bg-black">
            <img
              src="/images/cinema_audience.jpg"
              alt="Movie Theater Audience"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#141418]/40 to-[#141418]" />
          </div>

          <div className="lg:col-span-6 p-8 lg:p-12 space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight capitalize font-['Manrope']">
                Book Tickets To Your Favorite Movies Online
              </h2>
              <p className="text-lg text-[#E0E0E4] leading-relaxed capitalize">
                Get A Sneak Peek At The Most Popular Current Movie Trailers And Be The First To Know About The Hottest Upcoming Releases
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/showtimes"
                className="px-6 py-3 rounded-md bg-[#FCFC65] hover:bg-[#ecec50] text-[#010108] font-bold text-base tracking-wide transition-all"
              >
                Book Movie Ticket
              </Link>
              <Link
                href="/showtimes"
                className="px-6 py-3 rounded-md border border-[#FCFC65] text-[#FCFC65] hover:bg-[#FCFC65]/10 font-bold text-base tracking-wide transition-all"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* Brand Logos Bar */}
        <div className="py-6 px-8 rounded-2xl bg-[#141418]/60 border border-[#1A1A1F] flex flex-wrap items-center justify-around gap-8 text-center opacity-90">
          <span className="text-rose-600 text-3xl font-black tracking-tighter">NETFLIX</span>
          <span className="text-cyan-400 text-2xl font-bold italic">showmax</span>
          <span className="text-white text-3xl font-black tracking-wide">Disney+</span>
          <span className="bg-[#FCFC65] text-[#010108] px-3 py-1 rounded font-black text-xl">IMDb</span>
          <span className="text-rose-500 font-black text-xl tracking-wider">ROTTEN TOMATOES</span>
          <span className="text-cyan-300 font-bold text-xl">prime video</span>
        </div>
      </section>

      {/* 7. MOBILE APP DOWNLOAD SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#141418] border border-[#1A1A1F] rounded-3xl p-8 sm:p-14 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-5 flex justify-center">
            <div className="w-64 h-[500px] rounded-[44px] bg-black border-4 border-slate-700 shadow-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:border-[#FCFC65] transition-all">
              <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto" />
              <div className="text-center space-y-4 my-auto">
                <div className="w-16 h-16 rounded-2xl bg-[#FCFC65] text-[#010108] font-black text-2xl flex items-center justify-center mx-auto shadow-lg shadow-[#FCFC65]/20">
                  T
                </div>
                <div className="text-lg font-bold text-white">Ticketor Pass</div>
                <p className="text-xs text-slate-400">Offline E-Ticket Ready</p>
                <div className="p-3 bg-white rounded-xl mx-auto w-32 aspect-square flex items-center justify-center">
                  <div className="w-full h-full bg-black rounded flex items-center justify-center text-white text-[10px] font-mono">
                    [QR CODE]
                  </div>
                </div>
              </div>
              <div className="w-full py-2.5 rounded-xl bg-[#FCFC65] text-[#010108] text-center font-extrabold text-xs uppercase tracking-wider">
                ENTRY PASS READY
              </div>
            </div>
          </div>

          <div className="md:col-span-7 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-white capitalize leading-tight font-['Manrope']">
              Enjoy Ticketor Mobile App Experience
            </h2>
            <p className="text-lg text-[#E0E0E4] leading-relaxed">
              Watch Offline On The Prime Video App When You Download Titles To Your iPhone, iPad, Tablet, Or Android Device.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-200 text-black font-extrabold text-xs uppercase tracking-wider transition-colors shadow-lg">
                App Store
              </button>
              <button className="px-6 py-3.5 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 text-white font-extrabold text-xs uppercase tracking-wider transition-colors">
                Google Play
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. HAPPY CUSTOMERS / USER REVIEWS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold text-white uppercase font-['Manrope']">
            HAPPY CUSTOMERS
          </h2>
          <p className="text-lg text-[#E0E0E4] capitalize">
            Hear What Our Satisfied Moviegoers Have To Say
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-[#141418] border-2 border-[#1A1A1F] rounded-xl p-8 space-y-6 flex flex-col justify-between hover:border-[#FCFC65]/40 transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1">
                  {[...Array(rev.stars)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#FCFC65] text-[#FCFC65]" />
                  ))}
                </div>
                <p className="text-base text-[#F1F1F3] leading-relaxed italic">
                  “{rev.quote}”
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-[#1A1A1F]">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-14 h-14 rounded-full object-cover border border-[#1A1A1F]"
                />
                <div>
                  <h4 className="text-base font-medium text-[#E0E0E4]">{rev.name}</h4>
                  <p className="text-sm text-[#9797AA]">{rev.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. FREQUENTLY ASKED QUESTIONS (FAQ) SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold text-white uppercase font-['Manrope']">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="text-lg text-[#E0E0E4] capitalize">
            Find answers to their most common questions quickly and easily.
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-[#141418] border border-[#1A1A1F] rounded-xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 hover:bg-white/5 transition-colors"
                >
                  <span className="text-lg font-normal text-white tracking-wide">
                    {item.question}
                  </span>
                  <div className="p-1 rounded-full bg-white/10 text-white shrink-0">
                    {isOpen ? <Minus className="w-5 h-5 text-white" /> : <Plus className="w-5 h-5 text-[#FCFC65]" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-base text-[#E0E0E4] leading-relaxed border-t border-[#1A1A1F]/60">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-[#141418] border border-[#1A1A1F] rounded-2xl p-8 text-center space-y-5">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-white capitalize">Still Have A Question?</h3>
            <p className="text-base text-[#E0E0E4]">Please contact us</p>
          </div>
          <Link
            href="/cinemas"
            className="inline-block px-8 py-3 rounded-md bg-[#FCFC65] hover:bg-[#ecec50] text-[#010108] font-extrabold text-base tracking-tight transition-all"
          >
            Contact US
          </Link>
        </div>
      </section>

      {/* 10. NEWSLETTER SUBSCRIPTION SECTION */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#141418] border border-[#1A1A1F] rounded-3xl p-8 sm:p-12 text-center space-y-8 relative overflow-hidden shadow-2xl">
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-bold text-white capitalize font-['Manrope']">
              Ready To Watch & Book Movies?
            </h2>
            <p className="text-base sm:text-lg text-[#E0E0E4] max-w-xl mx-auto">
              Subscribe to our newsletter. Enter your email to create or restart your membership.
            </p>
          </div>

          {subscribed ? (
            <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Thank you for subscribing! Check your inbox for exclusive updates.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="max-w-lg mx-auto space-y-3">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full flex-1">
                  <Mail className="w-5 h-5 text-[#565669] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-11 pr-4 py-3 rounded-md bg-transparent border border-[#656565] text-white text-base placeholder-[#565669] focus:outline-none focus:border-[#FCFC65] transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-md bg-[#FCFC65] hover:bg-[#ecec50] text-[#010108] font-bold text-base whitespace-nowrap transition-all"
                >
                  Sign Up
                </button>
              </div>
              <p className="text-xs text-[#353541] font-semibold text-left sm:text-center">
                By clicking Sign Up you're confirming that you agree with our Terms and Conditions.
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
