"use client";

import React, { useState, useEffect } from "react";
import { Tag, Plus, CheckCircle2, AlertCircle, Percent, DollarSign, Calendar, RefreshCw } from "lucide-react";

export default function AdminPromosPage() {
  const [promos, setPromos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [code, setCode] = useState("SUMMER25");
  const [discountType, setDiscountType] = useState("PERCENTAGE");
  const [amount, setAmount] = useState("25");
  const [usageLimit, setUsageLimit] = useState("100");
  const [expiresAt, setExpiresAt] = useState("2026-09-30");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/promos");
      const data = await res.json();
      if (Array.isArray(data)) setPromos(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!code || !amount) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/promos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          discountType,
          amount: Number(amount),
          usageLimit: Number(usageLimit),
          expiresAt: new Date(expiresAt).toISOString(),
        }),
      });

      const data = await res.json();

      if (res.status === 409) {
        setErrorMsg("Promo code already exists. Please choose another code.");
      } else if (res.ok) {
        setShowModal(false);
        setErrorMsg("");
        fetchPromos();
      } else {
        setErrorMsg(data.error || "Failed to create promo code");
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A1A1F] pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white uppercase font-['Manrope']">
            Promo Code Management
          </h1>
          <p className="text-sm text-[#9797AA] mt-1">
            Create, manage, and monitor promotional discount vouchers and usage redemptions.
          </p>
        </div>

        <button
          onClick={() => {
            setErrorMsg("");
            setShowModal(true);
          }}
          className="px-6 py-3 rounded-md bg-[#FCFC65] hover:bg-[#ecec50] text-[#010108] font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#010108]" />
          <span>Create New Promo Code</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-44 bg-[#141418] rounded-2xl border border-[#1A1A1F]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promos.map((p) => {
            const isExpired = new Date(p.expiresAt) < new Date();
            const expDateFormatted = new Date(p.expiresAt).toLocaleDateString([], {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div
                key={p.id}
                className="bg-[#141418] border border-[#1A1A1F] rounded-2xl p-6 space-y-4 hover:border-[#FCFC65]/40 transition-all shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded bg-[#FCFC65]/10 border border-[#FCFC65]/30 text-[#FCFC65] font-mono text-base font-extrabold tracking-wider">
                      {p.code}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        isExpired
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {isExpired ? "Expired" : "Active"}
                    </span>
                  </div>

                  <div className="text-2xl font-black text-white font-['Manrope']">
                    {p.discountType === "PERCENTAGE" ? `${p.amount}% OFF` : `$${p.amount} OFF`}
                  </div>
                </div>

                <div className="space-y-2 border-t border-[#1A1A1F] pt-4 text-xs text-[#9797AA]">
                  <div className="flex items-center justify-between">
                    <span>Usage Limit:</span>
                    <span className="font-bold text-white">
                      {p.usedCount} / {p.usageLimit} redeemed
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Expires:</span>
                    <span className="font-bold text-white">{expDateFormatted}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Creating Promo Code */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#141418] border border-[#1A1A1F] rounded-3xl p-8 w-full max-w-md space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#1A1A1F] pb-4">
              <h3 className="text-xl font-bold text-white font-['Manrope']">Create Promo Code</h3>
              <button onClick={() => setShowModal(false)} className="text-[#9797AA] hover:text-white">✕</button>
            </div>

            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreatePromo} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#9797AA] font-bold mb-1">Promo Code (Uppercase)</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. TICKET20"
                  className="w-full px-4 py-2.5 rounded-md bg-[#010108] border border-[#1A1A1F] text-white font-mono font-bold uppercase focus:border-[#FCFC65] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#9797AA] font-bold mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-md bg-[#010108] border border-[#1A1A1F] text-white focus:border-[#FCFC65] outline-none"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#9797AA] font-bold mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-md bg-[#010108] border border-[#1A1A1F] text-white font-bold focus:border-[#FCFC65] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#9797AA] font-bold mb-1">Usage Limit</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-md bg-[#010108] border border-[#1A1A1F] text-white font-bold focus:border-[#FCFC65] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#9797AA] font-bold mb-1">Expiration Date</label>
                  <input
                    type="date"
                    required
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-md bg-[#010108] border border-[#1A1A1F] text-white focus:border-[#FCFC65] outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-md bg-[#FCFC65] hover:bg-[#ecec50] text-[#010108] font-bold text-sm uppercase tracking-wider transition-all"
              >
                {submitting ? "Creating Promo Code..." : "Create Promo Code"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
