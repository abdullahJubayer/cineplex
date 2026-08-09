"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Popcorn, Plus, Minus, ArrowLeft, ShoppingBag, ArrowRight } from "lucide-react";
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
  const totalFoodCount = booking.foodItems.reduce((sum, f) => sum + f.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-36 bg-[#010108] text-[#E0E0E4] font-sans min-h-screen">
      {/* Top Header & Stepper */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#1A1A1F] pb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-3 rounded-md bg-[#141418] border border-[#1A1A1F] text-[#9797AA] hover:text-white hover:border-[#FCFC65] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white uppercase tracking-tight flex items-center gap-3 font-['Manrope']">
              <Popcorn className="w-8 h-8 text-[#FCFC65]" />
              <span>Gourmet Food & Beverages</span>
            </h1>
            <p className="text-sm text-[#9797AA] mt-1">Pre-order snacks delivered right to your cinema seat</p>
          </div>
        </div>

        {/* Stepper Matching Figma */}
        <div className="flex items-center gap-6 text-xs font-bold">
          <div className="flex items-center gap-2 text-[#9797AA]">
            <span className="w-6 h-6 rounded-full bg-[#141418] border border-[#1A1A1F] flex items-center justify-center">1</span>
            <span>Seat</span>
          </div>
          <span className="text-[#353541]">————</span>
          <div className="flex items-center gap-2 text-[#FCFC65]">
            <span className="w-6 h-6 rounded-full bg-[#FCFC65] text-[#010108] flex items-center justify-center font-black">2</span>
            <span>Food & Drink</span>
          </div>
          <span className="text-[#353541]">————</span>
          <div className="flex items-center gap-2 text-[#9797AA]">
            <span className="w-6 h-6 rounded-full bg-[#141418] border border-[#1A1A1F] flex items-center justify-center">3</span>
            <span>Payment</span>
          </div>
          <span className="text-[#353541]">————</span>
          <div className="flex items-center gap-2 text-[#9797AA]">
            <span className="w-6 h-6 rounded-full bg-[#141418] border border-[#1A1A1F] flex items-center justify-center">4</span>
            <span>Ticket</span>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none border-b border-[#1A1A1F]">
        <span className="text-xs font-bold text-[#9797AA] uppercase tracking-wider mr-2">Category:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${
              activeCategory === cat
                ? "bg-[#FCFC65] text-[#010108] shadow-lg shadow-[#FCFC65]/20"
                : "bg-[#141418] border border-[#1A1A1F] text-[#9797AA] hover:text-white hover:border-[#FCFC65]/40"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Food Items Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-64 bg-[#141418] rounded-2xl border border-[#1A1A1F]" />
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
                className="bg-[#141418] border border-[#1A1A1F] rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#FCFC65]/40 transition-all shadow-2xl group"
              >
                <div className="aspect-video w-full overflow-hidden bg-black relative">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded bg-[#010108]/80 text-[#FCFC65] text-[10px] font-bold uppercase border border-[#1A1A1F]">
                    {item.category}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white line-clamp-1 font-['Manrope']">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#9797AA] line-clamp-2 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#1A1A1F]">
                    <span className="text-lg font-extrabold text-[#FCFC65]">
                      ${item.price.toFixed(2)}
                    </span>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 bg-[#010108] border border-[#1A1A1F] rounded-md p-1">
                      <button
                        onClick={() =>
                          updateFoodQuantity(
                            { foodItemId: item.id, name: item.name, price: item.price },
                            -1
                          )
                        }
                        className="p-1 rounded text-[#9797AA] hover:text-white transition-colors"
                      >
                        <Minus className="w-4 h-4" />
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
                        className="p-1 rounded text-[#FCFC65] hover:text-[#ecec50] transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Sticky Summary Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#010108]/95 backdrop-blur-xl border-t border-[#1A1A1F] p-4 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="text-xs text-[#9797AA]">
              Selected Snacks:{" "}
              <span className="font-bold text-white">
                {totalFoodCount} {totalFoodCount === 1 ? "Item" : "Items"}
              </span>
            </div>
            <div className="text-2xl font-black text-[#FCFC65]">
              ${grandTotal.toFixed(2)}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/booking/checkout")}
              className="px-8 py-3.5 rounded-md bg-[#FCFC65] hover:bg-[#ecec50] text-[#010108] font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-[#FCFC65]/20 flex items-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 text-[#010108]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
