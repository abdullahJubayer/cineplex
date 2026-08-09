"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Film,
  Building2,
  Clock,
  Ticket,
  ShieldAlert,
  Sparkles,
  LogOut,
  Tag,
  Lock,
} from "lucide-react";
import { AdminAiChat } from "@/components/AdminAiChat";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, login, logout } = useAuth();

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Movies", href: "/admin/movies", icon: Film },
    { label: "Cinemas & Layouts", href: "/admin/cinemas", icon: Building2 },
    { label: "Showtimes", href: "/admin/showtimes", icon: Clock },
    { label: "Promo Codes", href: "/admin/promos", icon: Tag },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Role-Based Access Control (RBAC) Protection Gate
  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-[#010108] text-white flex items-center justify-center p-4">
        <div className="bg-[#141418] border border-rose-500/40 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black font-['Manrope'] text-white">403 - Access Denied</h2>
            <p className="text-xs text-[#9797AA] leading-relaxed">
              Admin privileges required to access the Ticketor Control Panel. Your account ({user?.email || "Guest"}) does not have ADMIN role permissions.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => login("alex@ticketor.com", "ADMIN")}
              className="w-full py-3.5 rounded-xl bg-[#FCFC65] hover:bg-[#ecec50] text-[#010108] text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#FCFC65]/20"
            >
              Sign In as Admin (Alex Rivera)
            </button>

            <Link
              href="/"
              className="block w-full py-3 rounded-xl border border-[#1A1A1F] text-xs font-bold text-[#9797AA] hover:text-white hover:border-[#FCFC65] transition-all"
            >
              Return to Public App
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
              Control Panel ({user.name})
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold transition-all"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Log Out</span>
            </button>
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

      {/* Floating Admin AI Assistant Window */}
      <AdminAiChat isFloating={true} />
    </div>
  );
}
