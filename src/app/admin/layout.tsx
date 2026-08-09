"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Film,
  Building2,
  Clock,
  Ticket,
  ShieldAlert,
  Sparkles,
  ArrowLeft,
  Tag,
} from "lucide-react";
import { AdminAiChat } from "@/components/AdminAiChat";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Movies", href: "/admin/movies", icon: Film },
    { label: "Cinemas & Layouts", href: "/admin/cinemas", icon: Building2 },
    { label: "Showtimes", href: "/admin/showtimes", icon: Clock },
    { label: "Promo Codes", href: "/admin/promos", icon: Tag },
  ];

  return (
    <div className="min-h-screen bg-[#010108] text-[#E0E0E4] font-sans flex flex-col relative">
      {/* Admin Navbar */}
      <header className="bg-[#141418] border-b border-[#1A1A1F] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-[#FCFC65] text-[#010108] font-black text-base flex items-center justify-center">
                T
              </div>
              <span className="text-lg font-bold text-white font-['Manrope']">
                Ticketor Admin
              </span>
            </Link>

            <span className="px-2.5 py-0.5 rounded bg-[#FCFC65]/10 border border-[#FCFC65]/30 text-[#FCFC65] text-[10px] font-bold uppercase tracking-wider">
              Control Panel
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-[#9797AA] hover:text-[#FCFC65] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to App</span>
            </Link>
          </div>
        </div>

        {/* Admin Nav Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto scrollbar-none border-t border-[#1A1A1F]/60 pt-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                  isActive
                    ? "border-[#FCFC65] text-[#FCFC65] bg-[#010108]/60"
                    : "border-transparent text-[#9797AA] hover:text-white hover:border-[#353541]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main Admin Body */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full pb-28">
        {children}
      </main>

      {/* Floating Admin AI Assistant Window (Available across all admin pages) */}
      <AdminAiChat isFloating={true} />
    </div>
  );
}
