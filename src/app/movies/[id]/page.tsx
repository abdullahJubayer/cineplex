"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Clock, Calendar, MapPin, Ticket, Play, Heart, ChevronRight, ThumbsUp, MessageSquare } from "lucide-react";
import { useBooking } from "@/context/BookingContext";

export default function MovieDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { setMovie, setShowtime } = useBooking();

  const [movie, setMovieData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const [reviewFilter, setReviewFilter] = useState("ALL");

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  const fetchMovieDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/movies/${id}`);
      const data = await res.json();
      setMovieData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse space-y-8">
        <div className="h-96 bg-white/5 rounded-3xl" />
        <div className="h-40 bg-white/5 rounded-2xl" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Movie Not Found</h2>
        <Link href="/" className="px-6 py-2.5 rounded-xl bg-amber-400 text-black text-xs font-bold uppercase">
          Return to Home
        </Link>
      </div>
    );
  }

  // Cast members matching Figma frame 4235:22745
  const castList = [
    { name: "Nico Parker", role: "Astrid Hofferson", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" },
    { name: "Mason Thames", role: "Hiccup Horrendous", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" },
    { name: "Gerard Butler", role: "Stoick The Vast", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" },
    { name: "Nick Frost", role: "Gobber The Belch", img: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80" },
    { name: "Bronwyn James", role: "Ruffnut", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80" },
  ];

  // User reviews matching Figma frame 4235:22790
  const reviewsList = [
    { score: 9.2, author: "Marco D.", date: "Jan 25, 2026", comment: "Finally a film that gets the technical side all right. The jet action sequences had me holding my breath!" },
    { score: 8.0, author: "Lina K.", date: "Jul 12, 2025", comment: "It's a beautifully shot film, no doubt about that. Extremely well acted and executed." },
    { score: 8.8, author: "Reza A.", date: "Jul 18, 2025", comment: "The energy deep in the middle and never fully recovered. Pure adrenaline from start to finish!" },
    { score: 10, author: "Sophie W.", date: "Jul 18, 2025", comment: "Hands down the most immersive racing movie experience I've ever had. Loved every second!" },
  ];

  return (
    <div className="pb-32 space-y-16 bg-[#05070B] text-slate-100">
      {/* 1. FIGMA MOVIE DETAILS HERO WITH SPLIT TRAILER PREVIEW (4235:22720) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <h1 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tight mb-8">
          {movie.title}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Main Poster Image */}
          <div className="aspect-[16/10] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative bg-slate-900">
            <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
          </div>

          {/* Trailer Media Preview with Play Button */}
          <div className="aspect-[16/10] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative bg-slate-900 group">
            {isPlayingTrailer ? (
              <iframe
                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Trailer"
                className="w-full h-full border-0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <>
                <img src={movie.bannerUrl} alt="Trailer Thumbnail" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <button
                    onClick={() => setIsPlayingTrailer(true)}
                    className="w-20 h-20 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-2xl shadow-amber-400/40 transform group-hover:scale-110 transition-all"
                  >
                    <Play className="w-8 h-8 fill-black ml-1" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 2. SUMMARY & CTA BUTTONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-extrabold text-white uppercase">Summary</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {movie.description}
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/10 text-xs">
              <div>
                <span className="text-slate-400 block">Director</span>
                <span className="text-white font-bold text-sm">{movie.director}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Writers</span>
                <span className="text-white font-bold text-sm">Ehren Kruger - Joseph Kosinski</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-4 bg-[#0D121F] p-6 rounded-3xl border border-white/10">
            <Link
              href={`/showtimes?movieId=${movie.id}`}
              className="w-full py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-400/20 transition-all flex items-center justify-center gap-2"
            >
              <Ticket className="w-4 h-4 fill-black" />
              <span>Get Ticket</span>
            </Link>

            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`w-full py-3.5 rounded-2xl border font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                isFavorite
                  ? "bg-rose-500/20 border-rose-500 text-rose-400"
                  : "bg-white/5 border-white/10 text-white hover:bg-white/10"
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? "fill-rose-400" : ""}`} />
              <span>{isFavorite ? "Saved to Favorites" : "Add to Favorites"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. CAST SECTION (Figma frame 4235:22743) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-2xl font-extrabold text-white uppercase">Cast</h2>
          <span className="text-xs font-bold text-amber-400 cursor-pointer">View All &rarr;</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {castList.map((actor, idx) => (
            <div key={idx} className="bg-[#0D121F] rounded-2xl overflow-hidden border border-white/10 p-3 space-y-3">
              <div className="aspect-square rounded-xl overflow-hidden bg-slate-900">
                <img src={actor.img} alt={actor.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-xs font-bold text-white line-clamp-1">{actor.name}</div>
                <div className="text-[11px] text-slate-400 line-clamp-1">{actor.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. USER REVIEWS & RATINGS BREAKDOWN (Figma Frame 4235:22756) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-2xl font-extrabold text-white uppercase">User Reviews</h2>
          <span className="text-xs font-bold text-amber-400 cursor-pointer">View All &rarr;</span>
        </div>

        {/* Score Box & Rating Bars */}
        <div className="bg-[#0D121F] border border-white/10 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-amber-400 text-black font-black text-3xl flex items-center justify-center shadow-lg shadow-amber-400/20">
              6.0
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase font-semibold">User Score</div>
              <div className="text-xl font-extrabold text-white">Favorable</div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="w-20 text-slate-400 font-bold">Positive</span>
              <div className="flex-1 mx-4 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 w-[75%]" />
              </div>
              <span className="text-slate-300 font-mono">125 Ratings (75%)</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="w-20 text-slate-400 font-bold">Average</span>
              <div className="flex-1 mx-4 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 w-[15%]" />
              </div>
              <span className="text-slate-300 font-mono">27 Ratings (15%)</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="w-20 text-slate-400 font-bold">Negative</span>
              <div className="flex-1 mx-4 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 w-[9%]" />
              </div>
              <span className="text-slate-300 font-mono">16 Ratings (9%)</span>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-3">
          {["All Reviews", "Positive Reviews", "Average Reviews", "Negative Reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setReviewFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                reviewFilter === tab
                  ? "bg-white/10 text-white border border-white/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviewsList.map((rev, idx) => (
            <div key={idx} className="bg-[#0D121F] border border-white/10 rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 font-extrabold text-xs flex items-center justify-center">
                    {rev.score}
                  </div>
                  <span className="text-sm font-bold text-white">{rev.author}</span>
                </div>
                <span className="text-xs text-slate-500">{rev.date}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
