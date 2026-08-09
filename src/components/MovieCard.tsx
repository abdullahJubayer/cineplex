"use client";

import React from "react";
import Link from "next/link";
import { Star, Clock, Ticket } from "lucide-react";
import { useBooking } from "@/context/BookingContext";

interface MovieCardProps {
  movie: {
    id: string;
    title: string;
    posterUrl: string;
    rating: number;
    durationMins: number;
    genres: string;
    ageRating: string;
  };
}

export function MovieCard({ movie }: MovieCardProps) {
  const { setMovie } = useBooking();

  return (
    <div className="group relative bg-[#0B0F17] rounded-2xl overflow-hidden border border-slate-800/80 hover:border-amber-400/60 transition-all duration-300 flex flex-col h-full w-[225px] shrink-0">
      {/* Poster image container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-900">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {/* Age Rating Badge */}
          <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase">
            {movie.ageRating}
          </span>
          {/* Rating Badge */}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md border border-amber-400/30 text-[11px] font-bold text-amber-400">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{movie.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Hover Quick Book Overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-4 text-center">
          <Link
            href={`/movies/${movie.id}`}
            onClick={() =>
              setMovie({
                id: movie.id,
                title: movie.title,
                poster: movie.posterUrl,
              })
            }
            className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-amber-400/20"
          >
            <Ticket className="w-4 h-4 fill-black" />
            <span>Book Ticket</span>
          </Link>
        </div>
      </div>

      {/* Details */}
      <div className="p-3.5 flex flex-col flex-1 justify-between space-y-2">
        <div>
          <Link href={`/movies/${movie.id}`}>
            <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
              {movie.title}
            </h3>
          </Link>
          <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
            {movie.genres}
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>{movie.durationMins}m</span>
          </div>
          <Link
            href={`/movies/${movie.id}`}
            className="font-semibold text-amber-400 hover:underline"
          >
            Book &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
