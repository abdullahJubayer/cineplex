"use client";

import React, { useState, useEffect } from "react";
import { Clock, Plus, MapPin, Film, AlertTriangle, CheckCircle2, Calendar } from "lucide-react";

export default function AdminShowtimesPage() {
  const [showtimes, setShowtimes] = useState<any[]>([]);
  const [movies, setMovies] = useState<any[]>([]);
  const [cinemas, setCinemas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [selectedMovieId, setSelectedMovieId] = useState("");
  const [selectedCinemaId, setSelectedCinemaId] = useState("");
  const [format, setFormat] = useState("Digital 3D");
  const [dateStr, setDateStr] = useState("2026-08-18");
  const [timeStr, setTimeStr] = useState("18:30");
  const [basePrice, setBasePrice] = useState("16.50");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [stRes, movRes, cinRes] = await Promise.all([
        fetch("/api/admin/showtimes"),
        fetch("/api/movies"),
        fetch("/api/admin/cinemas"),
      ]);

      const [stData, movData, cinData] = await Promise.all([
        stRes.json(),
        movRes.json(),
        cinRes.json(),
      ]);

      if (Array.isArray(stData)) setShowtimes(stData);
      if (Array.isArray(movData)) {
        setMovies(movData);
        if (movData[0]) setSelectedMovieId(movData[0].id);
      }
      if (Array.isArray(cinData)) {
        setCinemas(cinData);
        if (cinData[0]) setSelectedCinemaId(cinData[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleShowtime = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!selectedMovieId || !selectedCinemaId || !dateStr || !timeStr) return;

    setSubmitting(true);
    try {
      const startIso = new Date(`${dateStr}T${timeStr}:00`).toISOString();

      const res = await fetch("/api/admin/showtimes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId: selectedMovieId,
          cinemaId: selectedCinemaId,
          startTime: startIso,
          format,
          basePrice: Number(basePrice),
        }),
      });

      const data = await res.json();

      if (res.status === 409) {
        setErrorMsg(data.error || "Overlap Conflict: Screen is reserved for another session.");
      } else if (res.ok) {
        setShowModal(false);
        setErrorMsg("");
        fetchData();
      } else {
        setErrorMsg(data.error || "Failed to schedule showtime");
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Network error when scheduling showtime");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A1A1F] pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white uppercase font-['Manrope']">
            Showtime Scheduling & Overlap Validation
          </h1>
          <p className="text-sm text-[#9797AA] mt-1">
            Schedule movie sessions with automated screen availability & overlap conflict protection.
          </p>
        </div>

        <button
          onClick={() => {
            setErrorMsg("");
            setShowModal(true);
          }}
          className="px-6 py-3 rounded-md bg-[#FCFC65] hover:bg-[#ecec50] text-[#010108] font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#010108]" />
          <span>Schedule New Session</span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 bg-[#141418] rounded-2xl border border-[#1A1A1F]" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {showtimes.map((st) => {
            const timeFormatted = new Date(st.startTime).toLocaleString([], {
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={st.id}
                className="bg-[#141418] border border-[#1A1A1F] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#FCFC65]/40 transition-all shadow-xl"
              >
                <div className="flex items-start gap-4">
                  {st.movie?.posterUrl && (
                    <img
                      src={st.movie.posterUrl}
                      alt={st.movie?.title}
                      className="w-14 h-20 rounded-lg object-cover border border-[#1A1A1F]"
                    />
                  )}
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white font-['Manrope']">{st.movie?.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-[#FCFC65]">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{st.cinema?.name}</span>
                    </div>
                    <div className="text-xs text-[#9797AA]">
                      {st.hall?.name || "Auditorium 1"} • {st.movie?.durationMins || 120} mins
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="p-3 rounded-xl bg-[#010108] border border-[#1A1A1F] text-xs space-y-0.5">
                    <div className="text-[#9797AA]">Scheduled Time:</div>
                    <div className="font-bold text-white">{timeFormatted}</div>
                  </div>

                  <span className="px-3 py-1.5 rounded bg-[#FCFC65]/10 border border-[#FCFC65]/30 text-[#FCFC65] text-xs font-bold">
                    {st.format}
                  </span>

                  <span className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-white font-mono text-xs font-bold">
                    ${st.basePrice?.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Scheduling Showtime */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#141418] border border-[#1A1A1F] rounded-3xl p-8 w-full max-w-md space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#1A1A1F] pb-4">
              <h3 className="text-xl font-bold text-white font-['Manrope']">Schedule Showtime Session</h3>
              <button onClick={() => setShowModal(false)} className="text-[#9797AA] hover:text-white">✕</button>
            </div>

            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleScheduleShowtime} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#9797AA] font-bold mb-1">Select Movie</label>
                <select
                  value={selectedMovieId}
                  onChange={(e) => setSelectedMovieId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-md bg-[#010108] border border-[#1A1A1F] text-white focus:border-[#FCFC65] outline-none"
                >
                  {movies.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title} ({m.durationMins || 120}m)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#9797AA] font-bold mb-1">Select Cinema Location</label>
                <select
                  value={selectedCinemaId}
                  onChange={(e) => setSelectedCinemaId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-md bg-[#010108] border border-[#1A1A1F] text-white focus:border-[#FCFC65] outline-none"
                >
                  {cinemas.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#9797AA] font-bold mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-md bg-[#010108] border border-[#1A1A1F] text-white focus:border-[#FCFC65] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#9797AA] font-bold mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={timeStr}
                    onChange={(e) => setTimeStr(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-md bg-[#010108] border border-[#1A1A1F] text-white focus:border-[#FCFC65] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#9797AA] font-bold mb-1">Viewing Format</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-md bg-[#010108] border border-[#1A1A1F] text-white focus:border-[#FCFC65] outline-none"
                  >
                    <option value="IMAX 3D Laser">IMAX 3D Laser</option>
                    <option value="Digital 3D">Digital 3D</option>
                    <option value="4DX">4DX</option>
                    <option value="Standard">Standard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#9797AA] font-bold mb-1">Base Price ($)</label>
                  <input
                    type="number"
                    step="0.50"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-md bg-[#010108] border border-[#1A1A1F] text-white focus:border-[#FCFC65] outline-none font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-md bg-[#FCFC65] hover:bg-[#ecec50] text-[#010108] font-bold text-sm uppercase tracking-wider transition-all"
              >
                {submitting ? "Checking Overlap & Scheduling..." : "Validate & Schedule Session"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
