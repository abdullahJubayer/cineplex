"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, ShieldCheck, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      login(email || "admin@gmail.com", "ADMIN");
      router.push("/admin/dashboard");
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
            <ShieldCheck className="w-8 h-8 text-[#010108]" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight uppercase font-['Manrope']">
            Admin Control Panel
          </h1>
          <p className="text-xs text-[#9797AA] leading-relaxed">
            Restricted access for cinema managers and operations team
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div>
            <label className="block text-[#E0E0E4] font-semibold mb-2">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#565669]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-[#010108] border border-[#1A1A1F] text-white placeholder-[#565669] focus:outline-none focus:border-[#FCFC65] transition-colors"
                placeholder="admin@gmail.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#E0E0E4] font-semibold mb-2">Admin Password</label>
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
            <span>{isSubmitting ? "Authenticating..." : "Sign In to Admin Portal"}</span>
            <ArrowRight className="w-4 h-4 text-[#010108]" />
          </button>
        </form>
      </div>
    </div>
  );
}
