"use client";

import React, { useState, useEffect } from "react";
import { Building2, Plus, MapPin, Grid, Layers, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminCinemasPage() {
  const [cinemas, setCinemas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [city, setCity] = useState("New York");
  const [address, setAddress] = useState("");
  const [screenName, setScreenName] = useState("Auditorium 1 (IMAX)");
  const [rows, setRows] = useState(8);
  const [cols, setCols] = useState(10);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCinemas();
  }, []);

  const fetchCinemas = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/cinemas");
      const data = await res.json();
      if (Array.isArray(data)) setCinemas(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCinema = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/cinemas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          city,
          address,
          screenName,
          rows: Number(rows),
          cols: Number(cols),
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setName("");
        setAddress("");
        fetchCinemas();
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
            Cinema & Seat Layout Management
          </h1>
          <p className="text-sm text-[#9797AA] mt-1">
            Configure theater venues, halls, and custom seat matrix dimensions (Rows x Cols).
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 rounded-md bg-[#FCFC65] hover:bg-[#ecec50] text-[#010108] font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#010108]" />
          <span>Add Cinema & Layout</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          {[1, 2].map((n) => (
            <div key={n} className="h-64 bg-[#141418] rounded-2xl border border-[#1A1A1F]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cinemas.map((c) => (
            <div
              key={c.id}
              className="bg-[#141418] border border-[#1A1A1F] rounded-2xl p-6 sm:p-8 space-y-6 hover:border-[#FCFC65]/40 transition-all shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4 border-b border-[#1A1A1F] pb-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white font-['Manrope']">{c.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#FCFC65]">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{c.address}</span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded bg-[#FCFC65]/10 border border-[#FCFC65]/30 text-[#FCFC65] text-xs font-bold">
                  {c.city}
                </span>
              </div>

              {/* Halls and Seat Configuration */}
              <div className="space-y-4">
                <div className="text-xs font-semibold text-[#9797AA] uppercase tracking-wider flex items-center gap-1.5">
                  <Grid className="w-4 h-4 text-[#FCFC65]" />
                  <span>Auditoriums & Halls ({c.halls?.length || 0}):</span>
                </div>

                <div className="space-y-3">
                  {c.halls?.map((hall: any) => (
                    <div
                      key={hall.id}
                      className="p-4 rounded-xl bg-[#010108] border border-[#1A1A1F] flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-white text-sm">{hall.name}</div>
                        <div className="text-[#9797AA]">
                          Total Seats: <span className="text-white font-bold">{hall.totalSeats || 80} Seats</span>
                        </div>
                      </div>
                      <div className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-white font-mono text-[11px]">
                        Hall ID: {hall.id.slice(-6)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for adding Cinema & Seat Layout */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#141418] border border-[#1A1A1F] rounded-3xl p-8 w-full max-w-lg space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#1A1A1F] pb-4">
              <h3 className="text-xl font-bold text-white font-['Manrope']">New Cinema & Seat Layout</h3>
              <button onClick={() => setShowModal(false)} className="text-[#9797AA] hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateCinema} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#9797AA] font-bold mb-1">Cinema Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ticketor Apex IMAX Cinema"
                  className="w-full px-4 py-2.5 rounded-md bg-[#010108] border border-[#1A1A1F] text-white focus:border-[#FCFC65] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#9797AA] font-bold mb-1">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-md bg-[#010108] border border-[#1A1A1F] text-white focus:border-[#FCFC65] outline-none"
                  >
                    <option value="New York">New York</option>
                    <option value="Los Angeles">Los Angeles</option>
                    <option value="Chicago">Chicago</option>
                    <option value="San Francisco">San Francisco</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#9797AA] font-bold mb-1">Auditorium / Hall Name</label>
                  <input
                    type="text"
                    required
                    value={screenName}
                    onChange={(e) => setScreenName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-md bg-[#010108] border border-[#1A1A1F] text-white focus:border-[#FCFC65] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#9797AA] font-bold mb-1">Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 500 Fifth Avenue, New York, NY"
                  className="w-full px-4 py-2.5 rounded-md bg-[#010108] border border-[#1A1A1F] text-white focus:border-[#FCFC65] outline-none"
                />
              </div>

              {/* Seat Matrix Dimensions */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#010108] border border-[#1A1A1F]">
                <div>
                  <label className="block text-[#FCFC65] font-bold mb-1">Number of Rows (A..H)</label>
                  <input
                    type="number"
                    min="4"
                    max="10"
                    value={rows}
                    onChange={(e) => setRows(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-md bg-[#141418] border border-[#1A1A1F] text-white focus:border-[#FCFC65] outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[#FCFC65] font-bold mb-1">Seats per Row (Cols)</label>
                  <input
                    type="number"
                    min="6"
                    max="12"
                    value={cols}
                    onChange={(e) => setCols(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-md bg-[#141418] border border-[#1A1A1F] text-white focus:border-[#FCFC65] outline-none font-bold"
                  />
                </div>

                <div className="col-span-2 text-[#9797AA] text-[11px]">
                  Total Seat Records Created: <span className="text-white font-bold">{rows * cols} Seats</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-md bg-[#FCFC65] hover:bg-[#ecec50] text-[#010108] font-bold text-sm uppercase tracking-wider transition-all"
              >
                {submitting ? "Creating Seat Layout..." : "Generate Cinema & Seats"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
