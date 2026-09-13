"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Courses", href: "/course" },
  { name: "Gallery", href: "/gallery" },
  { name: "Online Portal", href: "/portal" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    // Check initial scroll position immediately on mount/navigation
    handleScroll();
    // Re-check after a tiny delay to catch browser scroll restoration
    const timeoutId = setTimeout(handleScroll, 100);
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <nav
      className={cn(
        "fixed left-0 right-0 z-50 transition-all duration-700 px-3 xs:px-4 sm:px-6 md:px-12 pointer-events-none flex justify-center",
        scrolled ? "top-3 sm:top-6" : "top-0"
      )}
    >
      <div className={cn(
        "transition-all duration-700 pointer-events-auto flex items-center justify-between",
        scrolled 
          ? "bg-background/90 backdrop-blur-2xl py-3 px-4 sm:px-6 md:px-8 rounded-full shadow-premium-hover border border-cappuccino/20 min-w-0 w-[95%] sm:w-auto md:min-w-[700px] md:justify-around" 
          : "bg-transparent py-5 sm:py-8 md:py-10 px-3 xs:px-4 sm:px-6 md:px-8 w-full max-w-7xl"
      )}>
        <Link href="/" className="flex items-center gap-2.5 sm:gap-4 group shrink-0">
          <div className={cn(
            "relative overflow-hidden rounded-full border border-cappuccino/40 group-hover:scale-105 transition-all duration-700 shadow-[0_0_15px_rgba(200,160,120,0.35)] flex items-center justify-center bg-coffee-dark shrink-0",
            scrolled ? "w-9 h-9 sm:w-10 sm:h-10" : "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"
          )}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/images/logo_gold.jpeg" 
              alt="Vajra Fitness Arts" 
              className="w-full h-full object-contain scale-110"
            />
          </div>
          <div className="flex flex-col">
            <span className={cn(
              "font-serif font-bold tracking-tight transition-all duration-700 leading-none",
              scrolled ? "text-sm sm:text-base md:text-lg text-coffee-dark" : "text-lg sm:text-xl md:text-2xl text-white drop-shadow-sm"
            )}>
              Vajra
            </span>
            <span className={cn(
              "font-sans text-[7px] md:text-[8px] uppercase tracking-[0.25em] sm:tracking-[0.3em] font-bold transition-all duration-700 mt-1",
              scrolled ? "text-cappuccino" : "text-cappuccino drop-shadow-sm"
            )}>
              Fitness Arts
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 lg:gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-[10px] font-bold tracking-[0.3em] uppercase transition-all duration-300 relative group",
                pathname === link.href
                  ? "text-cappuccino font-extrabold"
                  : scrolled
                  ? "text-coffee-dark/80 hover:text-cappuccino"
                  : "text-white/90 hover:text-cappuccino drop-shadow-sm"
              )}
            >
              {link.name}
              <span className={cn(
                "absolute -bottom-2 left-0 w-0 h-[2px] bg-cappuccino transition-all duration-300 group-hover:w-full",
                pathname === link.href && "w-full"
              )} />
            </Link>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button
          aria-label={isOpen ? "Close mobile menu" : "Open mobile menu"}
          className={cn(
            "md:hidden p-2 -mr-1 rounded-full transition-colors active:scale-90 touch-manipulation focus:outline-none",
            scrolled ? "text-coffee-dark hover:bg-coffee-dark/5" : "text-white hover:bg-white/10"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="fixed inset-0 bg-background/98 backdrop-blur-2xl z-[100] flex flex-col justify-between p-5 sm:p-10 md:hidden pointer-events-auto overflow-y-auto"
          >
            {/* Drawer Header */}
            <div className="flex justify-between items-center pb-4 border-b border-coffee-dark/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-cappuccino/40 flex items-center justify-center bg-coffee-dark shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/logo_gold.jpeg" alt="Vajra Logo" className="w-full h-full object-contain scale-110" />
                </div>
                <div>
                  <span className="font-serif text-xl font-bold text-coffee-dark block leading-none">Vajra</span>
                  <span className="font-sans text-[7px] uppercase tracking-[0.25em] text-cappuccino font-bold">Fitness Arts</span>
                </div>
              </div>
              <button 
                aria-label="Close menu" 
                onClick={() => setIsOpen(false)} 
                className="p-2.5 -mr-2 rounded-full text-coffee-dark hover:bg-coffee-dark/5 active:scale-90 transition-all touch-manipulation focus:outline-none"
              >
                <X size={28} />
              </button>
            </div>

            {/* Nav Links with finger-friendly spacing */}
            <div className="flex flex-col gap-2.5 py-6 my-auto">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 + i * 0.05, duration: 0.25 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "text-2xl sm:text-3xl font-serif font-bold tracking-wider uppercase transition-colors duration-200 block py-3 px-3 rounded-xl touch-manipulation active:bg-coffee-dark/5",
                      pathname === link.href ? "text-cappuccino font-extrabold bg-cappuccino/10" : "text-coffee-dark hover:text-cappuccino"
                    )}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Footer info in drawer */}
            <div className="pt-5 border-t border-coffee-dark/10 space-y-3">
              <p className="text-[10px] uppercase tracking-[0.3em] text-coffee-dark/50 font-bold">Connect With Us</p>
              <div className="flex gap-6 text-coffee-dark">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-xs font-bold uppercase tracking-widest hover:text-cappuccino transition-colors py-1">Instagram</a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-xs font-bold uppercase tracking-widest hover:text-cappuccino transition-colors py-1">Facebook</a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-xs font-bold uppercase tracking-widest hover:text-cappuccino transition-colors py-1">YouTube</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
