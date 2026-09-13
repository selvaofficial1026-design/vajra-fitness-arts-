"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Phone } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  // Hide public website footer inside the student and admin portals
  if (pathname?.startsWith("/portal/admin") || pathname?.startsWith("/portal/student")) {
    return null;
  }

  return (
    <footer className="bg-coffee-dark text-white px-4 sm:px-6 md:px-12 py-10 sm:py-12 md:py-14 relative overflow-hidden font-sans">
      {/* Decorative background circle */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-cappuccino/5 rounded-full translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-8 md:gap-16 mb-8 sm:mb-10 relative z-10">
        {/* Brand Section */}
        <div className="max-w-md">
          <Link href="/" className="flex items-center gap-3 mb-3.5 sm:mb-4 group">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 overflow-hidden rounded-full border border-cappuccino/40 shadow-[0_0_12px_rgba(200,160,120,0.25)] flex items-center justify-center bg-white/5 group-hover:bg-cappuccino/10 transition-colors duration-500 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo_gold.jpeg" alt="Vajra Fitness Arts" className="w-full h-full object-contain scale-110" />
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight italic text-white block">
                Vajra
              </span>
              <span className="text-cappuccino font-sans text-[8px] uppercase tracking-[0.28em] font-bold">
                Fitness Arts
              </span>
            </div>
          </Link>
          <p className="text-white/60 leading-relaxed mb-4 font-light text-xs sm:text-sm max-w-sm">
            Ancient Disciplines. Modern Strength. Cultivating mental focus, martial warrior spirit, holistic wellness, and peak physical conditioning.
          </p>
          <div className="flex gap-3">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram" 
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 text-white/80 flex items-center justify-center hover:bg-cappuccino hover:text-coffee-dark hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Facebook" 
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 text-white/80 flex items-center justify-center hover:bg-cappuccino hover:text-coffee-dark hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="YouTube" 
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 text-white/80 flex items-center justify-center hover:bg-cappuccino hover:text-coffee-dark hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><polygon points="10 15 15 12 10 9 10 15"/></svg>
            </a>
          </div>
        </div>

        {/* Contact Info */}
        <div className="max-w-md md:ml-auto">
          <h4 className="font-serif text-base sm:text-lg font-bold mb-3 sm:mb-4 italic text-cappuccino">Training Center</h4>
          <ul className="space-y-3 sm:space-y-3.5">
            <li>
              <a 
                href="https://maps.google.com/?q=18,+Usman+Street,+Opp+to+Dmart,+Ariyalur+-+621704,+Tamil+Nadu" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex gap-2.5 sm:gap-3 items-start group active:scale-95 transition-all duration-300"
                aria-label="Find Vajra Fitness Arts on Google Maps"
              >
                <MapPin className="text-cappuccino shrink-0 mt-0.5 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(200,160,120,0.8)] transition-all duration-300 w-4 h-4" />
                <span className="text-xs sm:text-sm leading-relaxed text-white/70 group-hover:text-white transition-colors duration-300">
                  18, Usman Street, Opp to Dmart, Ariyalur - 621704, Tamil Nadu
                </span>
              </a>
            </li>
            <li>
              <a 
                href="tel:+918778931958" 
                className="flex gap-2.5 sm:gap-3 items-center group active:scale-95 transition-all duration-300"
                aria-label="Call Vajra Fitness Arts at +91 87789 31958"
              >
                <Phone className="text-cappuccino shrink-0 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(200,160,120,0.8)] transition-all duration-300 w-4 h-4" />
                <span className="text-xs sm:text-sm text-white/70 group-hover:text-white transition-colors duration-300">
                  +91 87789 31958
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-5 sm:pt-6 border-t border-white/10 flex items-center justify-center text-white/70 text-[11px] sm:text-xs font-medium tracking-wider relative z-10 text-center">
        <p className="text-white/80">© {new Date().getFullYear()} Vajra Fitness Arts. All rights reserved.</p>
      </div>
    </footer>
  );
}
