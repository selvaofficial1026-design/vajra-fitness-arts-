"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, Shield, User, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PortalNavItem {
  id: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string | number;
}

export interface PortalNavbarProps {
  role: "admin" | "student";
  navItems: PortalNavItem[];
  activeNavId: string;
  onNavChange: (id: string) => void;
  user: {
    name: string;
    roleName: string;
    badgeCode?: string | null;
    avatarLetter?: string;
  };
  onLogout: () => void;
}

export default function PortalNavbar({
  role,
  navItems,
  activeNavId,
  onNavChange,
  user,
  onLogout
}: PortalNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(true);

  // Close mobile drawer on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  // Lock scroll when mobile menu is open
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
    <>
      <nav className="fixed left-0 right-0 top-3 sm:top-6 z-50 px-3 xs:px-4 sm:px-6 md:px-12 pointer-events-none flex justify-center">
        <div
          className={cn(
            "pointer-events-auto transition-all duration-500",
            "bg-[#241A1A]/95 backdrop-blur-2xl py-2.5 sm:py-3 px-4 sm:px-6 md:px-8",
            "rounded-full shadow-2xl border border-cappuccino/35",
            "w-[96%] sm:w-auto min-w-0 md:min-w-[700px] lg:min-w-[840px] max-w-7xl",
            "flex items-center justify-between gap-3 sm:gap-6"
          )}
        >
          {/* Brand Logo & Portal Tag */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 overflow-hidden rounded-full border border-cappuccino/50 shadow-[0_0_15px_rgba(200,160,120,0.3)] flex items-center justify-center bg-[#1A1212] shrink-0 group-hover:scale-105 transition-transform duration-300">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo_gold.jpeg"
                alt="Vajra"
                className="w-full h-full object-contain scale-110"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-sm sm:text-base text-white tracking-tight leading-none">
                Vajra
              </span>
              <span className="font-sans text-[7.5px] sm:text-[8px] uppercase tracking-[0.25em] font-bold text-cappuccino mt-0.5">
                {role === "admin" ? "Admin Portal" : "Student Portal"}
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navItems.map((item) => {
              const isActive = activeNavId === item.id;
              const IconComponent = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavChange(item.id)}
                  className={cn(
                    "px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer",
                    isActive
                      ? "bg-cappuccino text-coffee-dark shadow-md scale-100"
                      : "text-white/75 hover:text-white hover:bg-white/10"
                  )}
                >
                  <IconComponent size={14} className={isActive ? "text-coffee-dark" : "text-cappuccino"} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={cn(
                        "px-1.5 py-0.2 rounded-full text-[9px] font-bold font-mono tracking-tighter",
                        isActive
                          ? "bg-coffee-dark text-cappuccino"
                          : "bg-cappuccino/25 text-cappuccino border border-cappuccino/40"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right User Snippet & Logout */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-2 pr-2 border-r border-white/15">
              <div className="w-7 h-7 rounded-full bg-cappuccino/20 border border-cappuccino/40 text-cappuccino font-serif font-bold text-xs flex items-center justify-center">
                {user.avatarLetter || user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden lg:block text-left leading-tight">
                <p className="font-serif font-bold text-xs text-white truncate max-w-[110px]">
                  {user.name}
                </p>
                <p className="text-[8px] uppercase tracking-wider text-cappuccino font-semibold truncate max-w-[110px]">
                  {user.badgeCode || user.roleName}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/40 text-white/80 text-[10.5px] font-bold uppercase tracking-wider transition-all border border-white/15 flex items-center gap-1.5 cursor-pointer active:scale-95"
              title="Log out of session"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Logout</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Toggle Portal Menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#1A1212]/98 backdrop-blur-3xl md:hidden flex flex-col justify-between pt-24 pb-8 px-6 text-white"
          >
            {/* User Info Header in Mobile Drawer */}
            <div className="p-4 rounded-2xl bg-[#241A1A] border border-cappuccino/30 flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-cappuccino text-coffee-dark font-serif text-xl font-bold flex items-center justify-center shrink-0">
                {user.avatarLetter || user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h3 className="font-serif font-bold text-base text-white truncate">{user.name}</h3>
                <p className="text-xs text-cappuccino uppercase tracking-wider font-semibold">
                  {user.badgeCode || user.roleName}
                </p>
                <span className="inline-block text-[10px] text-white/50 font-mono mt-0.5">
                  {role === "admin" ? "Master Console" : "Verified Student"}
                </span>
              </div>
            </div>

            {/* Navigation Buttons List */}
            <div className="flex-1 space-y-2">
              <span className="text-[9px] uppercase tracking-[0.25em] text-white/40 font-bold block px-2 mb-2">
                Portal Menu
              </span>
              {navItems.map((item) => {
                const isActive = activeNavId === item.id;
                const IconComponent = item.icon;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onNavChange(item.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between p-3.5 rounded-2xl text-sm font-bold uppercase tracking-wider transition-all cursor-pointer",
                      isActive
                        ? "bg-cappuccino text-coffee-dark shadow-lg font-extrabold"
                        : "bg-white/5 text-white/80 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent size={18} className={isActive ? "text-coffee-dark" : "text-cappuccino"} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider",
                          isActive
                            ? "bg-coffee-dark text-cappuccino"
                            : "bg-cappuccino/20 text-cappuccino border border-cappuccino/40"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Mobile Footer & Logout */}
            <div className="pt-6 border-t border-white/10 space-y-3">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="w-full py-3 px-4 rounded-2xl bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white border border-red-500/40 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut size={16} />
                <span>Log Out of Portal</span>
              </button>

              <p className="text-center text-[9px] text-white/30 uppercase tracking-[0.2em] font-mono">
                Vajra Virtual Studio • 2026
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
