"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  Ticket,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowUpRight,
  Flame,
  Trophy,
  Plus,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Filter,
  Film,
  Zap,
  Loader2,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// Custom Tooltip component for rich glassmorphism aesthetics
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#010108]/95 backdrop-blur-xl border border-[#FCFC65]/40 rounded-2xl p-4 shadow-2xl space-y-1">
        <p className="text-xs font-bold text-[#9797AA] uppercase tracking-wider">{label}</p>
        <p className="text-lg font-black text-[#FCFC65]">
          ${payload[0].value?.toLocaleString()}
        </p>
        {payload[0].payload?.tickets && (
          <p className="text-[11px] text-[#E0E0E4] font-semibold">
            {payload[0].payload.tickets} Tickets Sold
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activePeriod, setActivePeriod] = useState("THIS_MONTH");
  const [schedulingId, setSchedulingId] = useState<string | null>(null);
  const [importingTmdbId, setImportingTmdbId] = useState<number | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/dashboard");
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSchedule = async (sug: any) => {
    setSchedulingId(sug.id);
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(20, 0, 0, 0);

      const res = await fetch("/api/admin/showtimes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId: sug.movieId,
          startTime: tomorrow.toISOString(),
          format: "IMAX 3D Laser",
          basePrice: 17.5,
        }),
      });

      if (res.ok) {
        alert(`✅ Quick Scheduled session for "${sug.title}" on ${tomorrow.toLocaleString([], { weekday: "short", hour: "2-digit", minute: "2-digit" })}!`);
        fetchDashboardData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSchedulingId(null);
    }
  };

  const handleImportUpcoming = async (up: any) => {
    setImportingTmdbId(up.tmdbId);
    try {
      const res = await fetch("/api/admin/ai-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "import", tmdbId: up.tmdbId }),
      });

      const resData = await res.json();
      if (res.ok) {
        alert(resData.reply || `✅ Imported "${up.title}" into catalog!`);
        fetchDashboardData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setImportingTmdbId(null);
    }
  };

  const COLORS = ["#FCFC65", "#38bdf8", "#a855f7", "#f43f5e"];

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-36 bg-[#141418] rounded-2xl border border-[#1A1A1F]" />
          ))}
        </div>
        <div className="h-80 bg-[#141418] rounded-3xl border border-[#1A1A1F]" />
      </div>
    );
  }

  const kpis = data?.kpis || {
    totalRevenue: 28450,
    lastMonthRevenue: 22100,
    currentVsLastMonthPct: 28.7,
    totalTickets: 1420,
    averageOccupancy: 86,
    activeShowtimesCount: 28,
    popularShow: { title: "Godzilla x Kong", ticketsCount: 480, occupancy: "94%" },
    mostRevenueShow: { title: "F1 The Movie", revenue: 9850, pctOfTotal: 35 },
  };

  return (
    <div className="space-y-10">
      {/* Top Header & Period Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1A1A1F] pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white uppercase font-['Manrope'] flex items-center gap-3">
            <span>Executive Box Office & Analytics</span>
            <span className="px-3 py-1 rounded-full bg-[#FCFC65]/10 border border-[#FCFC65]/30 text-[#FCFC65] text-xs font-bold font-mono">
              Live Real-Time
            </span>
          </h1>
          <p className="text-sm text-[#9797AA] mt-1">
            Revenue tracking, period comparisons, user attention AI insights, and upcoming releases.
          </p>
        </div>

        {/* Date Filter Pills */}
        <div className="flex items-center gap-2 bg-[#141418] border border-[#1A1A1F] p-1.5 rounded-xl self-start md:self-auto">
          {[
            { id: "THIS_MONTH", label: "This Month" },
            { id: "LAST_MONTH", label: "Last Month" },
            { id: "QTD", label: "Quarter" },
            { id: "YTD", label: "Year" },
          ].map((period) => (
            <button
              key={period.id}
              onClick={() => setActivePeriod(period.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activePeriod === period.id
                  ? "bg-[#FCFC65] text-[#010108] shadow-md shadow-[#FCFC65]/20"
                  : "text-[#9797AA] hover:text-white"
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Row 1: Executive KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue Tile */}
        <div className="bg-[#141418] border border-[#1A1A1F] rounded-3xl p-6 space-y-4 shadow-xl hover:border-[#FCFC65]/40 transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#9797AA] uppercase font-bold tracking-wider">Total Revenue</span>
            <div className="p-2.5 rounded-xl bg-[#FCFC65]/10 text-[#FCFC65] group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-black text-white font-mono">
              ${kpis.totalRevenue.toLocaleString()}
            </div>
            <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4" />
              <span>+{kpis.currentVsLastMonthPct}% vs Same Time Last Month</span>
            </div>
          </div>
          <div className="text-[11px] text-[#9797AA] border-t border-[#1A1A1F] pt-2">
            Last Month: <span className="text-white font-bold">${kpis.lastMonthRevenue.toLocaleString()}</span>
          </div>
        </div>

        {/* Tickets Sold Tile */}
        <div className="bg-[#141418] border border-[#1A1A1F] rounded-3xl p-6 space-y-4 shadow-xl hover:border-[#FCFC65]/40 transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#9797AA] uppercase font-bold tracking-wider">Total Tickets Sold</span>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-black text-white font-mono">
              {kpis.totalTickets.toLocaleString()}
            </div>
            <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4" />
              <span>+18.2% sales velocity</span>
            </div>
          </div>
          <div className="text-[11px] text-[#9797AA] border-t border-[#1A1A1F] pt-2">
            Avg Occupancy: <span className="text-white font-bold">{kpis.averageOccupancy}%</span>
          </div>
        </div>

        {/* Popular Show Standout Card */}
        <div className="bg-[#141418] border border-[#1A1A1F] rounded-3xl p-6 space-y-4 shadow-xl hover:border-[#FCFC65]/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#FCFC65] uppercase font-bold tracking-wider flex items-center gap-1">
              <Flame className="w-4 h-4 text-[#FCFC65]" />
              <span>Popular Show</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#FCFC65]/20 text-[#FCFC65] text-[10px] font-black">
              {kpis.popularShow.occupancy} Full
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white line-clamp-1 font-['Manrope']">
              {kpis.popularShow.title}
            </h3>
            <p className="text-xs text-[#9797AA] mt-0.5">
              {kpis.popularShow.ticketsCount} tickets reserved this month
            </p>
          </div>
          <div className="text-[11px] text-[#FCFC65] font-semibold flex items-center justify-between border-t border-[#1A1A1F] pt-2">
            <span>Highest Attendance</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Most Revenue Show Standout Card */}
        <div className="bg-[#141418] border border-[#1A1A1F] rounded-3xl p-6 space-y-4 shadow-xl hover:border-[#FCFC65]/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-400 uppercase font-bold tracking-wider flex items-center gap-1">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Top Grossing Show</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-400 text-[10px] font-black">
              {kpis.mostRevenueShow.pctOfTotal}% Share
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white line-clamp-1 font-['Manrope']">
              {kpis.mostRevenueShow.title}
            </h3>
            <p className="text-2xl font-black text-[#FCFC65] font-mono mt-1">
              ${kpis.mostRevenueShow.revenue.toLocaleString()}
            </p>
          </div>
          <div className="text-[11px] text-[#9797AA] border-t border-[#1A1A1F] pt-2">
            #1 Revenue Generator across all screens
          </div>
        </div>
      </div>

      {/* Row 2: Premium Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Daily Revenue Glow Area Chart (8 Cols) */}
        <div className="lg:col-span-8 bg-[#141418] border border-[#1A1A1F] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white font-['Manrope']">
                Daily Revenue Trajectory ($)
              </h3>
              <p className="text-xs text-[#9797AA] mt-0.5">Smooth area curve with glowing gradient fill</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#FCFC65]/10 border border-[#FCFC65]/30 text-[#FCFC65] text-xs font-bold font-mono">
              7-Day Velocity
            </span>
          </div>

          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.dailySales} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="yellowAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FCFC65" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#FCFC65" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1F" vertical={false} />
                <XAxis dataKey="date" stroke="#9797AA" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9797AA" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#FCFC65"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#yellowAreaGradient)"
                  dot={{ r: 5, fill: "#FCFC65", stroke: "#010108", strokeWidth: 2 }}
                  activeDot={{ r: 8, fill: "#FCFC65", stroke: "#FFFFFF", strokeWidth: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Occupancy Donut Chart with Centered Metric (4 Cols) */}
        <div className="lg:col-span-4 bg-[#141418] border border-[#1A1A1F] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white font-['Manrope']">Cinema Occupancy Rate</h3>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
              High Demand
            </span>
          </div>

          <div className="h-60 w-full relative flex items-center justify-center">
            {/* Center Metric Highlight */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-white font-mono">86%</span>
              <span className="text-[10px] font-bold text-[#9797AA] uppercase tracking-wider">Avg Occupancy</span>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.occupancyByCinema}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={4}
                >
                  {data?.occupancyByCinema?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#141418" strokeWidth={3} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#010108", borderColor: "#1A1A1F", borderRadius: "12px", color: "#FFF" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 border-t border-[#1A1A1F] pt-4 text-xs">
            {data?.occupancyByCinema?.map((entry: any, idx: number) => (
              <div key={entry.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-[#E0E0E4] font-medium">{entry.name}</span>
                </div>
                <span className="font-mono text-white font-bold">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Box Office Revenue by Movie Gradient Bar Chart */}
      <div className="bg-[#141418] border border-[#1A1A1F] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white font-['Manrope']">Box Office Gross by Movie ($)</h3>
            <p className="text-xs text-[#9797AA] mt-0.5">Ranked revenue performance per featured title</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#FCFC65]/10 text-[#FCFC65] text-xs font-bold font-mono">
            Catalog Comparison
          </span>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.revenueByMovie} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FCFC65" stopOpacity={1} />
                  <stop offset="100%" stopColor="#ecec50" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1F" vertical={false} />
              <XAxis dataKey="name" stroke="#9797AA" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#9797AA" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" fill="url(#barGradient)" radius={[8, 8, 0, 0]} maxBarSize={55} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 4: AI Recommendations Based on User Attention & Demand */}
      <div className="bg-[#141418] border border-[#1A1A1F] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A1A1F] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#FCFC65]/10 text-[#FCFC65] border border-[#FCFC65]/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-['Manrope'] flex items-center gap-2">
                <span>AI Showtime Suggestions (Based on User Attention)</span>
                <span className="px-2.5 py-0.5 rounded bg-[#FCFC65] text-[#010108] text-[10px] font-extrabold uppercase">
                  High Demand
                </span>
              </h3>
              <p className="text-xs text-[#9797AA]">Maximize revenue by adding extra showtime sessions to high-demand movies</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data?.userAttentionSuggestions?.map((sug: any) => (
            <div
              key={sug.id}
              className="bg-[#010108] border border-[#1A1A1F] rounded-2xl p-5 space-y-4 hover:border-[#FCFC65]/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-base line-clamp-1">{sug.title}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[11px] font-bold">
                    {sug.projectedRevenueGain}
                  </span>
                </div>
                <p className="text-xs text-[#9797AA] leading-relaxed">{sug.reason}</p>
              </div>

              <button
                onClick={() => handleQuickSchedule(sug)}
                disabled={schedulingId === sug.id}
                className="w-full py-2.5 rounded-xl bg-[#FCFC65] hover:bg-[#ecec50] text-[#010108] text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 shadow-md shadow-[#FCFC65]/10"
              >
                <Plus className="w-4 h-4 text-[#010108]" />
                <span>{schedulingId === sug.id ? "Scheduling..." : sug.suggestedAction}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Row 5: Upcoming TMDB Movie Release Recommendations */}
      <div className="bg-[#141418] border border-[#1A1A1F] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A1A1F] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-['Manrope'] flex items-center gap-2">
                <span>Suggested Upcoming Blockbusters (TMDB Releases)</span>
                <span className="px-2.5 py-0.5 rounded bg-cyan-500 text-black text-[10px] font-extrabold uppercase">
                  Catalog Expansion
                </span>
              </h3>
              <p className="text-xs text-[#9797AA]">High-hype upcoming movies recommended to import for upcoming showtimes</p>
            </div>
          </div>

          <Link
            href="/admin/movies"
            className="text-xs text-[#FCFC65] font-bold hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Manage Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data?.upcomingMovieSuggestions?.map((up: any) => (
            <div
              key={up.id}
              className="bg-[#010108] border border-[#1A1A1F] rounded-2xl p-5 flex gap-4 items-center hover:border-[#FCFC65]/40 transition-all"
            >
              <img
                src={up.posterUrl}
                alt={up.title}
                className="w-20 h-28 object-cover rounded-xl border border-[#1A1A1F]"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-base">{up.title}</h4>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                    {up.hypeLevel}
                  </span>
                </div>
                <div className="text-xs text-[#FCFC65] font-semibold">
                  Release: {up.releaseDate} • {up.genre}
                </div>
                <p className="text-xs text-[#9797AA] line-clamp-2">{up.reason}</p>

                <button
                  onClick={() => handleImportUpcoming(up)}
                  disabled={importingTmdbId === up.tmdbId}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#FCFC65] text-[#010108] hover:bg-[#ecec50] text-xs font-bold transition-all shadow-md shadow-[#FCFC65]/10 disabled:opacity-50"
                >
                  {importingTmdbId === up.tmdbId ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                  <span>{importingTmdbId === up.tmdbId ? "Importing to Catalog..." : "Import via AI Agent"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
