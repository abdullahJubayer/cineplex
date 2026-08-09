"use client";

import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#010108] border-t border-[#1A1A1F] text-[#9797AA] text-sm relative overflow-hidden">
      {/* Footer Main Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-[#FCFC65] flex items-center justify-center text-[#010108] font-black text-lg">
              T
            </div>
            <span className="text-xl font-extrabold tracking-wider text-white">
              Ticketor
            </span>
          </Link>
          <p className="text-xs text-[#9797AA] leading-relaxed">
            Ticketor is the premier movie ticket booking platform designed for film lovers. Discover upcoming blockbusters, reserve custom seating live, and order snacks directly from your phone.
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm mb-4">Quick Links</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/" className="hover:text-[#FCFC65] transition-colors">Now Showing</Link></li>
            <li><Link href="/showtimes" className="hover:text-[#FCFC65] transition-colors">Showtimes</Link></li>
            <li><Link href="/cinemas" className="hover:text-[#FCFC65] transition-colors">Locations</Link></li>
            <li><Link href="/food" className="hover:text-[#FCFC65] transition-colors">Food & Combos</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm mb-4">Categories</h4>
          <ul className="space-y-2.5 text-xs">
            <li><span className="text-[#9797AA] hover:text-white cursor-pointer">Action & Adventure</span></li>
            <li><span className="text-[#9797AA] hover:text-white cursor-pointer">Drama & Romance</span></li>
            <li><span className="text-[#9797AA] hover:text-white cursor-pointer">Sci-Fi & Fantasy</span></li>
            <li><span className="text-[#9797AA] hover:text-[#FCFC65] cursor-pointer">IMAX 3D Screenings</span></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm mb-4">Help & Support</h4>
          <ul className="space-y-2.5 text-xs">
            <li><a href="#" className="hover:text-[#FCFC65] transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-[#FCFC65] transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-[#FCFC65] transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-[#FCFC65] transition-colors">Contact Support</a></li>
          </ul>
        </div>
      </div>

      {/* Copyright & Bottom Crowd Banner matching Figma */}
      <div className="relative border-t border-[#1A1A1F] py-8 text-center text-xs text-[#9797AA]">
        <p>&copy; {new Date().getFullYear()} Ticketor Cineplex Pro. All rights reserved.</p>
      </div>

      {/* Bottom Audience Banner from Figma */}
      <div className="w-full h-32 relative overflow-hidden opacity-30 pointer-events-none">
        <img
          src="/images/cinema_audience.jpg"
          alt="Cinema Moviegoers Background"
          className="w-full h-full object-cover object-bottom"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#010108] via-transparent to-[#010108]" />
      </div>
    </footer>
  );
}
