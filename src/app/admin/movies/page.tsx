"use client";

import React, { useState, useEffect } from "react";
import { Film, Plus, Star, Clock, Calendar, CheckCircle2 } from "lucide-react";

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [genre, setGenre] = useState("Action");
  const [durationMin, setDurationMin] = useState(135);
  const [rating, setRating] = useState("PG-13");
  const [status, setStatus] = useState("NOW_SHOWING");
  const [posterUrl, setPosterUrl] = useState("https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80");
  const [submitting, setSubmitting] = useState(false);

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

  const handleCreateMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !synopsis) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          synopsis,
          genre,
          durationMin: Number(durationMin),
          rating,
          status,
          posterUrl,
          releaseDate: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setTitle("");
        setSynopsis("");
        fetchMovies();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A1A1F] pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white uppercase font-['Manrope']">
            Movie Catalog Management
          </h1>
          <p className="text-sm text-[#9797AA] mt-1">
            Add, update, and publish movie titles, posters, genres, and release statuses.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 rounded-md bg-[#FCFC65] hover:bg-[#ecec50] text-[#010108] font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#010108]" />
          <span>Add New Movie</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-72 bg-[#141418] rounded-2xl border border-[#1A1A1F]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {movies.map((m) => (
            <div
              key={m.id}
              className="bg-[#141418] border border-[#1A1A1F] rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#FCFC65]/40 transition-all shadow-xl group"
            >
              <div className="aspect-[2/3] w-full overflow-hidden bg-black relative">
                <img src={m.posterUrl} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-[#010108]/80 backdrop-blur-md border border-[#1A1A1F] text-[#FCFC65] text-[10px] font-bold uppercase">
                  {m.status}
                </div>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="text-base font-bold text-white line-clamp-1 font-['Manrope']">{m.title}</h3>
                <div className="flex items-center justify-between text-xs text-[#9797AA]">
                  <span>{m.genre}</span>
                  <span>{m.durationMins || m.durationMin}m</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Creating Movie */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#141418] border border-[#1A1A1F] rounded-3xl p-8 w-full max-w-md space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#1A1A1F] pb-4">
              <h3 className="text-xl font-bold text-white font-['Manrope']">Add New Movie</h3>
              <button onClick={() => setShowModal(false)} className="text-[#9797AA] hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateMovie} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#9797AA] font-bold mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Avatar: Fire and Ash"
                  className="w-full px-4 py-2.5 rounded-md bg-[#010108] border border-[#1A1A1F] text-white focus:border-[#FCFC65] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#9797AA] font-bold mb-1">Synopsis</label>
                <textarea
                  required
                  rows={3}
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                  placeholder="Enter synopsis description..."
                  className="w-full px-4 py-2.5 rounded-md bg-[#010108] border border-[#1A1A1F] text-white focus:border-[#FCFC65] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#9797AA] font-bold mb-1">Genre</label>
                  <input
                    type="text"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-md bg-[#010108] border border-[#1A1A1F] text-white focus:border-[#FCFC65] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#9797AA] font-bold mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={durationMin}
                    onChange={(e) => setDurationMin(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-md bg-[#010108] border border-[#1A1A1F] text-white font-bold focus:border-[#FCFC65] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#9797AA] font-bold mb-1">Age Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-md bg-[#010108] border border-[#1A1A1F] text-white focus:border-[#FCFC65] outline-none"
                  >
                    <option value="PG">PG</option>
                    <option value="PG-13">PG-13</option>
                    <option value="R">R</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#9797AA] font-bold mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-md bg-[#010108] border border-[#1A1A1F] text-white focus:border-[#FCFC65] outline-none"
                  >
                    <option value="NOW_SHOWING">NOW_SHOWING</option>
                    <option value="COMING_SOON">COMING_SOON</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-md bg-[#FCFC65] hover:bg-[#ecec50] text-[#010108] font-bold text-sm uppercase tracking-wider transition-all"
              >
                {submitting ? "Adding Movie..." : "Add Movie to Catalog"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
