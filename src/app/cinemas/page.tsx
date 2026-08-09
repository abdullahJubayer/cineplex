"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, Sparkles, Film, ArrowRight, ShieldCheck, Ticket, Popcorn, Clock } from "lucide-react";

export default function CinemasPage() {
  const [selectedCity, setSelectedCity] = useState("ALL");

  const cinemas = [
    {
      id: "cin_grand",
      name: "Ticketor Grand IMAX Cineplex",
      city: "New York",
      location: "Downtown Plaza, New York",
      address: "100 Grand Avenue, Suite 400, New York, NY 10001",
      screens: 12,
      phone: "+1 (212) 555-0199",
      formats: ["IMAX 3D Laser", "4DX", "Dolby Atmos", "VIP Recliner"],
      image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "cin_starlight",
      name: "Starlight Dolby Cinema",
      city: "Los Angeles",
      location: "Sunset Boulevard, Los Angeles",
      address: "7500 Sunset Blvd, Los Angeles, CA 90046",
      screens: 8,
      phone: "+1 (323) 555-0142",
      formats: ["Dolby Vision", "4DX", "VIP Lounge", "Gourmet Dining"],
      image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "cin_chicago",
      name: "Ticketor Royal Cinema Hall",
      city: "Chicago",
      location: "Michigan Avenue, Chicago",
      address: "435 N Michigan Ave, Chicago, IL 60611",
      screens: 10,
      phone: "+1 (312) 555-0188",
      formats: ["IMAX 3D", "Dolby Atmos", "VIP Recliner"],
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "cin_sf",
      name: "Bayfront IMAX & 4DX Theater",
      city: "San Francisco",
      location: "Embarcadero Center, San Francisco",
      address: "2 Embarcadero Center, San Francisco, CA 94111",
      screens: 9,
      phone: "+1 (415) 555-0123",
      formats: ["4DX", "IMAX Laser", "Dolby Vision"],
      image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const cities = ["ALL", "New York", "Los Angeles", "Chicago", "San Francisco"];

  const filteredCinemas = cinemas.filter(
    (c) => selectedCity === "ALL" || c.city === selectedCity
  );

  return (
    <div className="pb-32 space-y-12 bg-[#010108] text-[#E0E0E4] font-sans min-h-screen">
      {/* Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FCFC65]/10 border border-[#FCFC65]/30 text-[#FCFC65] text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>State-of-the-Art Cineplex Venues</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight font-['Manrope']">
            Cinema Locations
          </h1>
          <p className="text-base text-[#9797AA] max-w-2xl">
            Explore our luxury Cineplex theaters featuring IMAX 3D laser projection, Dolby Atmos surround sound, and premium recliner seating across the country.
          </p>
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none border-b border-[#1A1A1F]">
          <span className="text-xs font-bold text-[#9797AA] uppercase tracking-wider mr-2">City:</span>
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-5 py-2.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${
                selectedCity === city
                  ? "bg-[#FCFC65] text-[#010108] shadow-lg shadow-[#FCFC65]/20"
                  : "bg-[#141418] border border-[#1A1A1F] text-[#9797AA] hover:text-white hover:border-[#FCFC65]/40"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </section>

      {/* Cinema Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredCinemas.map((c) => (
            <div
              key={c.id}
              className="bg-[#141418] border border-[#1A1A1F] rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between hover:border-[#FCFC65]/50 transition-all duration-300 group"
            >
              {/* Cinema Image Backdrop */}
              <div className="h-60 w-full overflow-hidden bg-black relative">
                <img
                  src={c.image}
                  alt={c.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141418] via-transparent to-transparent" />
                <div className="absolute top-4 left-4 px-3 py-1 rounded bg-[#010108]/80 backdrop-blur-md border border-[#1A1A1F] text-xs font-bold text-[#FCFC65]">
                  {c.city}
                </div>
              </div>

              {/* Card Details */}
              <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-white font-['Manrope']">{c.name}</h3>
                  <div className="flex items-start gap-2 text-sm text-[#9797AA]">
                    <MapPin className="w-4 h-4 text-[#FCFC65] shrink-0 mt-0.5" />
                    <span>{c.address}</span>
                  </div>
                </div>

                {/* Viewing Format Badges */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-[#9797AA] uppercase tracking-wider">Available Formats:</div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {c.formats.map((f) => (
                      <span
                        key={f}
                        className="px-3 py-1 rounded bg-[#FCFC65]/10 border border-[#FCFC65]/30 text-[#FCFC65] text-xs font-bold"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-6 border-t border-[#1A1A1F] flex items-center justify-between">
                  <div className="text-xs text-[#9797AA]">
                    <span className="font-bold text-white text-sm">{c.screens}</span> Active Screens
                  </div>
                  <Link
                    href={`/showtimes?cinemaId=${c.id}`}
                    className="px-6 py-3 rounded-md bg-[#FCFC65] hover:bg-[#ecec50] text-[#010108] font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                  >
                    <span>View Schedule</span>
                    <ArrowRight className="w-4 h-4 text-[#010108]" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Amenities Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-[#141418] border border-[#1A1A1F] rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-bold text-white uppercase font-['Manrope']">
              The Ticketor Premium Experience
            </h2>
            <p className="text-sm text-[#9797AA]">
              Every location is engineered with cutting-edge technology for maximum comfort and immersion.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-[#010108]/60 border border-[#1A1A1F] space-y-3">
              <Sparkles className="w-8 h-8 text-[#FCFC65] mx-auto" />
              <h4 className="text-base font-bold text-white">IMAX Laser 4K</h4>
              <p className="text-xs text-[#9797AA]">Crystal-clear dual 4K laser projection with expanded aspect ratio.</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#010108]/60 border border-[#1A1A1F] space-y-3">
              <Film className="w-8 h-8 text-[#FCFC65] mx-auto" />
              <h4 className="text-base font-bold text-white">Dolby Atmos</h4>
              <p className="text-xs text-[#9797AA]">360-degree multi-dimensional object-based surround sound system.</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#010108]/60 border border-[#1A1A1F] space-y-3">
              <Popcorn className="w-8 h-8 text-[#FCFC65] mx-auto" />
              <h4 className="text-base font-bold text-white">In-Seat Concessions</h4>
              <p className="text-xs text-[#9797AA]">Order food & beverages directly to your recliner seat without missing a scene.</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#010108]/60 border border-[#1A1A1F] space-y-3">
              <ShieldCheck className="w-8 h-8 text-[#FCFC65] mx-auto" />
              <h4 className="text-base font-bold text-white">VIP Recliner Lounges</h4>
              <p className="text-xs text-[#9797AA]">Powered plush leather recliners with personal swivel tables & footrests.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
