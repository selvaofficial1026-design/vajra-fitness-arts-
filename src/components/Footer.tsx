import React from "react";
import Link from "next/link";
import { MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-coffee-dark text-white px-4 sm:px-6 md:px-12 py-16 sm:py-24 relative overflow-hidden font-sans">
      {/* Decorative background circle */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cappuccino/5 rounded-full translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-10 sm:gap-y-12 gap-x-6 md:gap-12 mb-12 sm:mb-16 md:mb-20 relative z-10">
        {/* Brand Section */}
        <div className="col-span-1 sm:col-span-2 md:col-span-1">
          <Link href="/" className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6 group">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 overflow-hidden rounded-full border border-cappuccino/40 shadow-[0_0_15px_rgba(200,160,120,0.3)] flex items-center justify-center bg-white/5 group-hover:bg-cappuccino/10 transition-colors duration-500 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo_gold.jpeg" alt="Vajra Fitness Arts" className="w-full h-full object-contain scale-110" />
            </div>
            <div>
              <span className="font-serif text-2xl md:text-3xl font-bold tracking-tight italic text-white block">
                Vajra
              </span>
              <span className="text-cappuccino font-sans text-[8px] sm:text-[9px] uppercase tracking-[0.3em] font-bold">
                Fitness Arts
              </span>
            </div>
          </Link>
          <p className="text-white/60 leading-relaxed mb-6 font-light text-sm max-w-sm">
            Ancient Disciplines. Modern Strength. Cultivating mental focus, martial warrior spirit, holistic wellness, and peak physical conditioning.
          </p>
          <div className="flex gap-4">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram" 
              className="w-10 h-10 rounded-full bg-white/5 text-white/80 flex items-center justify-center hover:bg-cappuccino hover:text-coffee-dark hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Facebook" 
              className="w-10 h-10 rounded-full bg-white/5 text-white/80 flex items-center justify-center hover:bg-cappuccino hover:text-coffee-dark hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="YouTube" 
              className="w-10 h-10 rounded-full bg-white/5 text-white/80 flex items-center justify-center hover:bg-cappuccino hover:text-coffee-dark hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><polygon points="10 15 15 12 10 9 10 15"/></svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="col-span-1">
          <h4 className="font-serif text-lg md:text-xl font-bold mb-4 sm:mb-6 md:mb-8 italic text-cappuccino">Disciplines &amp; Pages</h4>
          <ul className="space-y-3 sm:space-y-4 text-white/60 text-sm md:text-base">
            <li><Link href="/" className="hover:text-cappuccino transition-colors flex items-center gap-3 group py-0.5"><div className="w-1.5 h-1.5 rounded-full bg-cappuccino/30 group-hover:bg-cappuccino transition-all shrink-0" /> Home</Link></li>
            <li><Link href="/about" className="hover:text-cappuccino transition-colors flex items-center gap-3 group py-0.5"><div className="w-1.5 h-1.5 rounded-full bg-cappuccino/30 group-hover:bg-cappuccino transition-all shrink-0" /> About Our Academy</Link></li>
            <li><Link href="/course" className="hover:text-cappuccino transition-colors flex items-center gap-3 group py-0.5"><div className="w-1.5 h-1.5 rounded-full bg-cappuccino/30 group-hover:bg-cappuccino transition-all shrink-0" /> Training Courses</Link></li>
            <li><Link href="/gallery" className="hover:text-cappuccino transition-colors flex items-center gap-3 group py-0.5"><div className="w-1.5 h-1.5 rounded-full bg-cappuccino/30 group-hover:bg-cappuccino transition-all shrink-0" /> Action Gallery</Link></li>
            <li><Link href="/portal" className="hover:text-cappuccino transition-colors flex items-center gap-3 group py-0.5"><div className="w-1.5 h-1.5 rounded-full bg-cappuccino/30 group-hover:bg-cappuccino transition-all shrink-0" /> Online Student Portal</Link></li>
            <li><Link href="/contact" className="hover:text-cappuccino transition-colors flex items-center gap-3 group py-0.5"><div className="w-1.5 h-1.5 rounded-full bg-cappuccino/30 group-hover:bg-cappuccino transition-all shrink-0" /> Contact &amp; Admissions</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="col-span-1">
          <h4 className="font-serif text-lg md:text-xl font-bold mb-4 sm:mb-6 md:mb-8 italic text-cappuccino">Training Center</h4>
          <ul className="space-y-4 sm:space-y-6">
            <li>
              <a 
                href="https://maps.google.com/?q=18,+Usman+Street,+Opp+to+Dmart,+Ariyalur+-+621704,+Tamil+Nadu" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex gap-3 md:gap-4 items-start group active:scale-95 transition-all duration-300"
                aria-label="Find Vajra Fitness Arts on Google Maps"
              >
                <MapPin className="text-cappuccino shrink-0 mt-0.5 md:mt-1 group-hover:scale-115 group-hover:drop-shadow-[0_0_10px_rgba(200,160,120,0.8)] transition-all duration-300 w-4 h-4 md:w-5 md:h-5" />
                <span className="text-xs md:text-sm leading-relaxed text-white/70 group-hover:text-white transition-colors duration-300">
                  18, Usman Street, Opp to Dmart, Ariyalur - 621704, Tamil Nadu
                </span>
              </a>
            </li>
            <li>
              <a 
                href="tel:+918778931958" 
                className="flex gap-3 md:gap-4 items-center group active:scale-95 transition-all duration-300"
                aria-label="Call Vajra Fitness Arts at +91 87789 31958"
              >
                <Phone className="text-cappuccino shrink-0 group-hover:scale-115 group-hover:drop-shadow-[0_0_10px_rgba(200,160,120,0.8)] transition-all duration-300 w-4 h-4 md:w-5 md:h-5" />
                <span className="text-xs md:text-sm text-white/70 group-hover:text-white transition-colors duration-300">
                  +91 87789 31958
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 sm:pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 text-white/70 text-xs font-medium tracking-wider relative z-10 text-center md:text-left">
        <p className="text-white/80">© {new Date().getFullYear()} Vajra Fitness Arts. All rights reserved.</p>
        <div className="flex gap-6 sm:gap-8">
          <Link href="/privacy" className="group relative hover:text-cappuccino transition-colors duration-300">
            <span className="relative z-10">Privacy Guidelines</span>
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-cappuccino transition-all duration-300 group-hover:w-full shadow-[0_0_8px_rgba(200,149,95,0.8)]" />
          </Link>
          <Link href="/terms" className="group relative hover:text-cappuccino transition-colors duration-300">
            <span className="relative z-10">Terms &amp; Conditions</span>
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-cappuccino transition-all duration-300 group-hover:w-full shadow-[0_0_8px_rgba(200,149,95,0.8)]" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
