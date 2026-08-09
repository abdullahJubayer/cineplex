"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Clock, Calendar, MapPin, Ticket, Play, Heart, ChevronRight, ThumbsUp, ChevronDown } from "lucide-react";
import { useBooking } from "@/context/BookingContext";

export default function MovieDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { setMovie } = useBooking();

  const [movie, setMovieData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const [reviewFilter, setReviewFilter] = useState("All Reviews");

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
      <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse space-y-8 bg-[#010108] min-h-screen">
        <div className="h-96 bg-[#141418] rounded-3xl" />
        <div className="h-40 bg-[#141418] rounded-2xl" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center bg-[#010108] min-h-screen">
        <h2 className="text-3xl font-bold text-white mb-4">Movie Not Found</h2>
        <Link href="/" className="px-6 py-3 rounded-md bg-[#FCFC65] text-[#010108] text-sm font-bold uppercase">
          Return to Home
        </Link>
      </div>
    );
  }

  // Cast list matching Figma frame 4235:22745
  const castList = [
    { name: "Nico Parker", role: "Astrid Hofferson", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" },
    { name: "Mason Thames", role: "Hiccup Horrendous", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" },
    { name: "Gerard Butler", role: "Stoick The Vast", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" },
    { name: "Nick Frost", role: "Gobber The Belch", img: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80" },
    { name: "Bronwyn James", role: "Ruffnut", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80" },
  ];

  // User reviews list matching Figma frame 4235:22790
  const reviewsList = [
    { score: 9.2, author: "Marco D.", date: "Jan 25, 2026", comment: "Finally a film that gets the technical side all right. The jet action sequences had me holding my breath!" },
    { score: 8.0, author: "Lina K.", date: "Jul 12, 2025", comment: "It's a beautifully shot film, no doubt about that. Extremely well acted and executed." },
    { score: 8.8, author: "Reza A.", date: "Jul 18, 2025", comment: "The energy deep in the middle and never fully recovered. Pure adrenaline from start to finish!" },
    { score: 10, author: "Sophie W.", date: "Jul 18, 2025", comment: "Hands down the most immersive racing movie experience I've ever had. Loved every second!" },
    { score: 8.5, author: "Jared M.", date: "Jul 15, 2025", comment: "This film strikes a great balance between high-octane race scenes and human drama. Keeps you engaged from start to finish." },
    { score: 4.0, author: "Tanya R.", date: "Jul 18, 2025", comment: "I really wanted to love this movie but it missed the mark for me. The story dragged and character arcs felt flat." },
    { score: 8.5, author: "Michele M.", date: "Jul 15, 2025", comment: "Great cinematography and sound design! Easily one of the best theater experiences of the year." },
    { score: 5.5, author: "Daynee H.", date: "Jul 18, 2025", comment: "A solid mid-tier entry. Good visual effects but predictable plot turns." },
  ];

  return (
    <div className="pb-32 space-y-16 bg-[#010108] text-[#E0E0E4] font-sans min-h-screen">
      {/* 1. FIGMA MOVIE DETAILS HERO WITH SPLIT MEDIA (4235:22720) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight font-['Manrope']">
          {movie.title}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Main Poster Image */}
          <div className="aspect-[16/10] rounded-3xl overflow-hidden border border-[#1A1A1F] shadow-2xl relative bg-black">
            <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
          </div>

          {/* Trailer Media Preview with Play Button */}
          <div className="aspect-[16/10] rounded-3xl overflow-hidden border border-[#1A1A1F] shadow-2xl relative bg-black group">
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
                <img src={movie.bannerUrl || movie.posterUrl} alt="Trailer Thumbnail" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <button
                    onClick={() => setIsPlayingTrailer(true)}
                    className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all hover:bg-[#FCFC65] hover:text-[#010108] hover:border-[#FCFC65]"
                  >
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 2. SUMMARY & CTA BUTTONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-8 space-y-6">
            <h2 className="text-2xl font-bold text-white uppercase font-['Manrope']">Summary</h2>
            <p className="text-base text-[#E0E0E4] leading-relaxed">
              {movie.description || "Sonny Hayes (Brad Pitt) was FORMULA 1's most promising phenomenon of the 1990s until an accident on the track nearly ended his career. Thirty years later, he is a nomadic driver-for-hire when he's approached by his former teammate Ruben Cervantes (Javier Bardem), owner of a struggling FORMULA 1 team that is on the verge of collapse."}
            </p>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-[#1A1A1F] text-xs">
              <div>
                <span className="text-[#9797AA] block text-sm font-semibold mb-1">Director</span>
                <span className="text-white font-bold text-base">{movie.director || "Joseph Kosinski"}</span>
              </div>
              <div>
                <span className="text-[#9797AA] block text-sm font-semibold mb-1">Writers</span>
                <span className="text-white font-bold text-base">Ehren Kruger - Joseph Kosinski</span>
              </div>
            </div>
          </div>

          {/* Action CTAs Matching Figma */}
          <div className="lg:col-span-4 space-y-4 bg-[#141418] p-8 rounded-2xl border border-[#1A1A1F] shadow-2xl">
            <Link
              href={`/showtimes?movieId=${movie.id}`}
              onClick={() =>
                setMovie({
                  id: movie.id,
                  title: movie.title,
                  poster: movie.posterUrl,
                })
              }
              className="w-full py-4 rounded-md bg-[#FCFC65] hover:bg-[#ecec50] text-[#010108] font-bold text-base uppercase tracking-wider shadow-lg shadow-[#FCFC65]/20 transition-all flex items-center justify-center gap-2"
            >
              <Ticket className="w-5 h-5 fill-[#010108]" />
              <span>Get Ticket</span>
            </Link>

            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`w-full py-3.5 rounded-md border font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                isFavorite
                  ? "bg-rose-500/20 border-rose-500 text-rose-400"
                  : "bg-transparent border-[#1A1A1F] text-white hover:border-[#FCFC65] hover:text-[#FCFC65]"
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
        <div className="flex items-center justify-between border-b border-[#1A1A1F] pb-4">
          <h2 className="text-2xl font-bold text-white uppercase font-['Manrope']">Cast</h2>
          <span className="text-xs font-bold text-[#FCFC65] cursor-pointer hover:underline">View All &gt;</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {castList.map((actor, idx) => (
            <div key={idx} className="bg-[#141418] rounded-xl overflow-hidden border border-[#1A1A1F] p-3 space-y-3 hover:border-[#FCFC65]/40 transition-all">
              <div className="aspect-square rounded-lg overflow-hidden bg-black">
                <img src={actor.img} alt={actor.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-sm font-bold text-white line-clamp-1">{actor.name}</div>
                <div className="text-xs text-[#9797AA] line-clamp-1">{actor.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. USER REVIEWS & RATINGS BREAKDOWN (Figma Frame 4235:22756) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between border-b border-[#1A1A1F] pb-4">
          <h2 className="text-2xl font-bold text-white uppercase font-['Manrope']">User Reviews</h2>
          <span className="text-xs font-bold text-[#FCFC65] cursor-pointer hover:underline">View All &gt;</span>
        </div>

        {/* Rating Breakdown Card */}
        <div className="bg-[#141418] border border-[#1A1A1F] rounded-2xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center shadow-2xl">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-[#FCFC65] text-[#010108] font-black text-4xl flex items-center justify-center shadow-lg shadow-[#FCFC65]/20">
              6
            </div>
            <div>
              <div className="text-xs text-[#9797AA] uppercase font-bold">User Score</div>
              <div className="text-2xl font-extrabold text-white">Favorable</div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="w-20 text-[#E0E0E4] font-bold">Positive</span>
              <div className="flex-1 mx-4 h-2 bg-[#010108] rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 w-[75%]" />
              </div>
              <span className="text-[#9797AA] font-mono">125 Ratings (75%)</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="w-20 text-[#E0E0E4] font-bold">Average</span>
              <div className="flex-1 mx-4 h-2 bg-[#010108] rounded-full overflow-hidden">
                <div className="h-full bg-[#FCFC65] w-[15%]" />
              </div>
              <span className="text-[#9797AA] font-mono">27 Ratings (15%)</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="w-20 text-[#E0E0E4] font-bold">Negative</span>
              <div className="flex-1 mx-4 h-2 bg-[#010108] rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 w-[9%]" />
              </div>
              <span className="text-[#9797AA] font-mono">16 Ratings (9%)</span>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none border-b border-[#1A1A1F]">
          {["All Reviews", "Positive Reviews", "Average Reviews", "Negative Reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setReviewFilter(tab)}
              className={`px-4 py-2 rounded-md text-xs font-bold transition-all whitespace-nowrap ${
                reviewFilter === tab
                  ? "bg-[#FCFC65]/20 border border-[#FCFC65] text-[#FCFC65]"
                  : "bg-[#141418] border border-[#1A1A1F] text-[#9797AA] hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviewsList.map((rev, idx) => (
            <div key={idx} className="bg-[#141418] border border-[#1A1A1F] rounded-xl p-6 space-y-4 hover:border-[#FCFC65]/40 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 rounded bg-[#FCFC65] text-[#010108] font-black text-xs">
                    {rev.score}
                  </div>
                  <span className="text-base font-bold text-white">{rev.author}</span>
                </div>
                <span className="text-xs text-[#9797AA]">{rev.date}</span>
              </div>
              <p className="text-sm text-[#E0E0E4] leading-relaxed">{rev.comment}</p>
              <div className="pt-2">
                <button className="text-xs font-bold text-[#FCFC65] hover:underline flex items-center gap-1">
                  <span>Full Review</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-6">
          <button className="px-8 py-3 rounded-md bg-[#141418] border border-[#1A1A1F] text-white hover:border-[#FCFC65] text-sm font-bold inline-flex items-center gap-2">
            <span>119 more reviews</span>
            <ChevronDown className="w-4 h-4 text-[#FCFC65]" />
          </button>
        </div>
      </section>
    </div>
  );
}
