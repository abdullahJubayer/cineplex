"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Film, Mail, Lock, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("alex@ticketor.com");
  const [password, setPassword] = useState("password123");
  const [roleSelection, setRoleSelection] = useState<"ADMIN" | "USER">("ADMIN");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      login(email, roleSelection);
      if (roleSelection === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    }, 500);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-[#010108] text-[#E0E0E4] font-sans relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FCFC65]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#141418] border border-[#1A1A1F] rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8 relative z-10 backdrop-blur-xl">
        {/* Header Icon & Title */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#FCFC65] text-[#010108] font-black text-2xl flex items-center justify-center mx-auto shadow-xl shadow-[#FCFC65]/20">
            T
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight uppercase font-['Manrope']">
            Sign In to Ticketor
          </h1>
          <p className="text-xs text-[#9797AA] leading-relaxed">
            Manage your cinema bookings, VIP digital passes, and admin control panel
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-xl bg-[#010108] border border-[#1A1A1F]">
          <button
            type="button"
            onClick={() => {
              setRoleSelection("ADMIN");
              setEmail("alex@ticketor.com");
            }}
            className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              roleSelection === "ADMIN"
                ? "bg-[#FCFC65] text-[#010108] shadow-md shadow-[#FCFC65]/20"
                : "text-[#9797AA] hover:text-white"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Access</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setRoleSelection("USER");
              setEmail("user@example.com");
            }}
            className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              roleSelection === "USER"
                ? "bg-[#FCFC65] text-[#010108] shadow-md shadow-[#FCFC65]/20"
                : "text-[#9797AA] hover:text-white"
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Moviegoer</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div>
            <label className="block text-[#E0E0E4] font-semibold mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#565669]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-[#010108] border border-[#1A1A1F] text-white placeholder-[#565669] focus:outline-none focus:border-[#FCFC65] transition-colors"
                placeholder="alex@ticketor.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#E0E0E4] font-semibold mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#565669]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-[#010108] border border-[#1A1A1F] text-white placeholder-[#565669] focus:outline-none focus:border-[#FCFC65] transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-[#FCFC65] hover:bg-[#ecec50] text-[#010108] font-black text-xs uppercase tracking-wider shadow-lg shadow-[#FCFC65]/20 transition-all flex items-center justify-center gap-2 mt-4"
          >
            <span>{isSubmitting ? "Authenticating..." : `Sign In as ${roleSelection}`}</span>
            <ArrowRight className="w-4 h-4 text-[#010108]" />
          </button>
        </form>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-[#1A1A1F]" />
          <span className="flex-shrink mx-4 text-[10px] text-[#565669] uppercase tracking-wider font-bold">OR</span>
          <div className="flex-grow border-t border-[#1A1A1F]" />
        </div>

        <button
          onClick={() => {
            login("google_user@gmail.com", "USER");
            router.push("/");
          }}
          className="w-full py-3 rounded-xl bg-[#010108] border border-[#1A1A1F] text-[#E0E0E4] hover:text-white hover:border-[#FCFC65]/50 font-bold text-xs transition-all flex items-center justify-center gap-2"
        >
          <span>Continue with Google</span>
        </button>

        <p className="text-center text-xs text-[#9797AA] pt-2">
          Don't have an account?{" "}
          <Link href="/signup" className="text-[#FCFC65] font-bold hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
