"use client";

import React, { useState, useEffect } from "react";
import { DollarSign, Ticket, TrendingUp, Clock, Users, ArrowUpRight, ShieldCheck, Film } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  const COLORS = ["#FCFC65", "#38bdf8", "#f43f5e", "#a855f7"];

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-32 bg-[#141418] rounded-2xl border border-[#1A1A1F]" />
          ))}
        </div>
        <div className="h-80 bg-[#141418] rounded-3xl border border-[#1A1A1F]" />
      </div>
    );
  }

  const kpis = data?.kpis || { totalRevenue: 23990, ticketsSold: 1233, averageOccupancy: 82, activeShowtimesCount: 24 };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="border-b border-[#1A1A1F] pb-6">
        <h1 className="text-3xl font-bold text-white uppercase font-['Manrope']">
          Sales & Occupancy Dashboard
        </h1>
        <p className="text-sm text-[#9797AA] mt-1">
          Real-time box office metrics, ticket sales volume, and cinema occupancy breakdown.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#141418] border border-[#1A1A1F] rounded-2xl p-6 space-y-3 shadow-xl hover:border-[#FCFC65]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#9797AA] uppercase font-bold">Total Revenue</span>
            <div className="p-2.5 rounded-xl bg-[#FCFC65]/10 text-[#FCFC65]">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono">
            ${kpis.totalRevenue.toLocaleString()}
          </div>
          <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" />
            <span>+18.4% vs last week</span>
          </div>
        </div>

        <div className="bg-[#141418] border border-[#1A1A1F] rounded-2xl p-6 space-y-3 shadow-xl hover:border-[#FCFC65]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#9797AA] uppercase font-bold">Tickets Sold</span>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {kpis.ticketsSold.toLocaleString()}
          </div>
          <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" />
            <span>+12.1% growth</span>
          </div>
        </div>

        <div className="bg-[#141418] border border-[#1A1A1F] rounded-2xl p-6 space-y-3 shadow-xl hover:border-[#FCFC65]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#9797AA] uppercase font-bold">Avg Occupancy</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {kpis.averageOccupancy}%
          </div>
          <div className="text-xs text-purple-400 font-semibold">High Demand</div>
        </div>

        <div className="bg-[#141418] border border-[#1A1A1F] rounded-2xl p-6 space-y-3 shadow-xl hover:border-[#FCFC65]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#9797AA] uppercase font-bold">Active Sessions</span>
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {kpis.activeShowtimesCount}
          </div>
          <div className="text-xs text-[#9797AA]">Across all auditoriums</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Daily Ticket Sales Line Chart (8 cols) */}
        <div className="lg:col-span-8 bg-[#141418] border border-[#1A1A1F] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white font-['Manrope']">Daily Revenue & Sales ($)</h3>
            <span className="px-3 py-1 rounded bg-[#FCFC65]/10 text-[#FCFC65] text-xs font-bold">Weekly Trend</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.dailySales}>
                <XAxis dataKey="date" stroke="#9797AA" fontSize={12} />
                <YAxis stroke="#9797AA" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#010108", borderColor: "#1A1A1F", borderRadius: "8px", color: "#FFF" }}
                />
                <Line type="monotone" dataKey="sales" stroke="#FCFC65" strokeWidth={3} dot={{ r: 5, fill: "#FCFC65" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Occupancy by Cinema Pie Chart (4 cols) */}
        <div className="lg:col-span-4 bg-[#141418] border border-[#1A1A1F] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl flex flex-col justify-between">
          <h3 className="text-xl font-bold text-white font-['Manrope']">Occupancy Rate (%)</h3>

          <div className="h-56 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data?.occupancyByCinema} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80}>
                  {data?.occupancyByCinema?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#010108", borderColor: "#1A1A1F", borderRadius: "8px" }} />
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

      {/* Revenue by Movie Bar Chart */}
      <div className="bg-[#141418] border border-[#1A1A1F] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <h3 className="text-xl font-bold text-white font-['Manrope']">Box Office Revenue by Movie ($)</h3>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.revenueByMovie}>
              <XAxis dataKey="name" stroke="#9797AA" fontSize={12} />
              <YAxis stroke="#9797AA" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "#010108", borderColor: "#1A1A1F", borderRadius: "8px" }} />
              <Bar dataKey="revenue" fill="#FCFC65" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-[#141418] border border-[#1A1A1F] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <h3 className="text-xl font-bold text-white font-['Manrope']">Recent Ticket Orders</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1A1A1F] text-[#9797AA] uppercase font-bold">
                <th className="pb-3">Ticket Code</th>
                <th className="pb-3">Movie</th>
                <th className="pb-3">Cinema</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Time</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1F]">
              {data?.recentBookings?.map((b: any) => (
                <tr key={b.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 font-mono text-[#FCFC65] font-bold">{b.code}</td>
                  <td className="py-3.5 font-bold text-white">{b.movie}</td>
                  <td className="py-3.5 text-[#E0E0E4]">{b.cinema}</td>
                  <td className="py-3.5 font-bold text-white">${b.amount.toFixed(2)}</td>
                  <td className="py-3.5 text-[#9797AA]">{b.date}</td>
                  <td className="py-3.5 text-right">
                    <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
