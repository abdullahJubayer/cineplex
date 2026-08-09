import React from "react";
import Link from "next/link";
import { MapPin, Sparkles, Film } from "lucide-react";

export default function CinemasPage() {
  const cinemas = [
    {
      id: "cin_grand",
      name: "Ticketor Grand IMAX Cineplex",
      location: "Downtown Plaza, New York",
      address: "100 Grand Avenue, Suite 400",
      screens: 12,
      formats: ["IMAX 3D Laser", "4DX", "Dolby Atmos"],
      image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "cin_starlight",
      name: "Starlight Dolby Cinema",
      location: "Sunset Boulevard, Los Angeles",
      address: "7500 Sunset Blvd",
      screens: 8,
      formats: ["Dolby Vision", "4DX", "VIP Recliner"],
      image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8 pb-24">
      <div>
        <h1 className="text-3xl font-black text-white">Cinema Locations</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Explore our state-of-the-art Cineplex theaters around the country.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {cinemas.map((c) => (
          <div
            key={c.id}
            className="bg-[#131927] border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between hover:border-slate-700 transition-all"
          >
            <div className="h-52 w-full overflow-hidden bg-slate-900">
              <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white">{c.name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>{c.address}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {c.formats.map((f) => (
                  <span
                    key={f}
                    className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-rose-400 text-xs font-semibold"
                  >
                    {f}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">{c.screens} Screens Active</span>
                <Link
                  href="/showtimes"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all"
                >
                  View Schedule
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
