"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Film, Mail, Lock, User, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"USER" | "ADMIN">("USER");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || "user@ticketor.com", role);
    if (role === "ADMIN") {
      router.push("/admin/dashboard");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-[#010108] text-[#E0E0E4] font-sans relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FCFC65]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#141418] border border-[#1A1A1F] rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8 relative z-10 backdrop-blur-xl">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#FCFC65] text-[#010108] font-black text-2xl flex items-center justify-center mx-auto shadow-xl shadow-[#FCFC65]/20">
            T
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight uppercase font-['Manrope']">
            Create Account
          </h1>
          <p className="text-xs text-[#9797AA] leading-relaxed">
            Join Ticketor for instant live seat reservation & VIP perks
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div>
            <label className="block text-[#E0E0E4] font-semibold mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#565669]" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Rivera"
                required
                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-[#010108] border border-[#1A1A1F] text-white placeholder-[#565669] focus:outline-none focus:border-[#FCFC65] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#E0E0E4] font-semibold mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#565669]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                required
                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-[#010108] border border-[#1A1A1F] text-white placeholder-[#565669] focus:outline-none focus:border-[#FCFC65] transition-colors"
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
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-[#010108] border border-[#1A1A1F] text-white placeholder-[#565669] focus:outline-none focus:border-[#FCFC65] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#E0E0E4] font-semibold mb-2">Account Type</label>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#010108] border border-[#1A1A1F]">
              <button
                type="button"
                onClick={() => setRole("USER")}
                className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  role === "USER"
                    ? "bg-[#FCFC65] text-[#010108] shadow-md shadow-[#FCFC65]/20"
                    : "text-[#9797AA] hover:text-white"
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Moviegoer</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("ADMIN")}
                className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  role === "ADMIN"
                    ? "bg-[#FCFC65] text-[#010108] shadow-md shadow-[#FCFC65]/20"
                    : "text-[#9797AA] hover:text-white"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-[#FCFC65] hover:bg-[#ecec50] text-[#010108] font-black text-xs uppercase tracking-wider shadow-lg shadow-[#FCFC65]/20 transition-all flex items-center justify-center gap-2 mt-4"
          >
            <span>Create Account</span>
            <ArrowRight className="w-4 h-4 text-[#010108]" />
          </button>
        </form>

        <p className="text-center text-xs text-[#9797AA] pt-2">
          Already have an account?{" "}
          <Link href="/login" className="text-[#FCFC65] font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
