"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Popcorn, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";
import { useBooking } from "@/context/BookingContext";

export default function FoodSelectionPage() {
  const router = useRouter();
  const { booking, updateFoodQuantity, calculateTotal } = useBooking();
  const [foodItems, setFoodItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("ALL");

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/food");
      const data = await res.json();
      if (Array.isArray(data)) setFoodItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["ALL", "COMBO", "POPCORN", "BEVERAGE", "SNACKS"];

  const filteredItems = foodItems.filter(
    (item) => activeCategory === "ALL" || item.category === activeCategory
  );

  const { grandTotal } = calculateTotal();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8 pb-32">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2.5 rounded-xl bg-[#131927] border border-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Popcorn className="w-5 h-5 text-rose-500" />
              <span>Gourmet Food & Beverages</span>
            </h1>
            <p className="text-xs text-slate-400">Pre-order snacks delivered right to your cinema seat</p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="hidden sm:flex items-center gap-3 text-xs font-semibold">
          <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400">1. Seats</span>
          <span className="text-slate-600">&rarr;</span>
          <span className="px-3 py-1 rounded-full bg-rose-600 text-white">2. Food</span>
          <span className="text-slate-600">&rarr;</span>
          <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400">3. Checkout</span>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeCategory === cat
                ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30"
                : "bg-[#131927] border border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Food Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-64 bg-slate-800/40 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => {
            const selected = booking.foodItems.find(
              (f) => f.foodItemId === item.id
            );
            const qty = selected ? selected.quantity : 0;

            return (
              <div
                key={item.id}
                className="bg-[#131927] border border-slate-800/80 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl"
              >
                <div className="aspect-video w-full overflow-hidden bg-slate-900">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-white line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                    <span className="text-sm font-extrabold text-white">
                      ${item.price.toFixed(2)}
                    </span>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1">
                      <button
                        onClick={() =>
                          updateFoodQuantity(
                            { foodItemId: item.id, name: item.name, price: item.price },
                            -1
                          )
                        }
                        className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold text-white w-5 text-center">
                        {qty}
                      </span>
                      <button
                        onClick={() =>
                          updateFoodQuantity(
                            { foodItemId: item.id, name: item.name, price: item.price },
                            1
                          )
                        }
                        className="p-1 rounded-lg hover:bg-slate-800 text-rose-400 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Sticky Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F19]/90 backdrop-blur-xl border-t border-slate-800 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">
              Food items selected:{" "}
              <span className="font-bold text-white">
                {booking.foodItems.reduce((sum, f) => sum + f.quantity, 0)} items
              </span>
            </div>
            <div className="text-lg font-black text-white">
              ${grandTotal.toFixed(2)}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/booking/checkout")}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
