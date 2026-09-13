"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PortalNavItem {
  id: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: React.ComponentType<{ size?: number; className?: string }>;
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
  onProfileClick?: () => void;
}

export default function PortalNavbar({
  role,
  navItems,
  activeNavId,
  onNavChange,
  user,
  onLogout,
  onProfileClick
}: PortalNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

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
    <nav className="fixed left-0 right-0 z-50 transition-all duration-700 px-3 xs:px-4 sm:px-6 md:px-12 pointer-events-none flex justify-center top-3 sm:top-6">
      <div className="transition-all duration-700 pointer-events-auto flex items-center justify-between bg-background/90 backdrop-blur-2xl py-3 px-4 sm:px-6 md:px-8 rounded-full shadow-premium-hover border border-cappuccino/20 min-w-0 w-[95%] sm:w-auto md:min-w-[700px] lg:min-w-[860px] md:justify-around gap-4 sm:gap-6">
        {/* Brand Logo - EXACTLY matching main website navbar */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-4 group shrink-0">
          <div className="relative overflow-hidden rounded-full border border-cappuccino/40 group-hover:scale-105 transition-all duration-700 shadow-[0_0_15px_rgba(200,160,120,0.35)] flex items-center justify-center bg-coffee-dark shrink-0 w-9 h-9 sm:w-10 sm:h-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo_gold.jpeg"
              alt="Vajra Fitness Arts"
              className="w-full h-full object-contain scale-110"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold tracking-tight transition-all duration-700 leading-none text-sm sm:text-base md:text-lg text-coffee-dark">
              Vajra
            </span>
            <span className="font-sans text-[7px] md:text-[8px] uppercase tracking-[0.25em] sm:tracking-[0.3em] font-bold transition-all duration-700 mt-1 text-cappuccino">
              Fitness Arts
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links - EXACTLY matching main website nav link typography & golden underline */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navItems.map((item) => {
            const isActive = activeNavId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavChange(item.id)}
                className={cn(
                  "text-[10px] font-bold tracking-[0.3em] uppercase transition-all duration-300 relative group cursor-pointer flex items-center gap-1.5",
                  isActive
                    ? "text-cappuccino font-extrabold"
                    : "text-coffee-dark/80 hover:text-cappuccino"
                )}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={cn(
                      "px-1.5 py-0.2 rounded-full text-[8.5px] font-bold font-mono tracking-normal",
                      isActive
                        ? "bg-cappuccino text-coffee-dark"
                        : "bg-cappuccino/20 text-cappuccino border border-cappuccino/30"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
                <span
                  className={cn(
                    "absolute -bottom-2 left-0 w-0 h-[2px] bg-cappuccino transition-all duration-300 group-hover:w-full",
                    isActive && "w-full"
                  )}
                />
              </button>
            );
          })}
        </div>

        {/* Right Section: User snippet + Logout Button */}
        {/* Right Section: User snippet (Interactive Profile Button) + Logout Button */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          {/* Desktop/Tablet Clickable Avatar & User Badge */}
          <button
            type="button"
            onClick={onProfileClick}
            className="hidden sm:flex items-center gap-2.5 pr-2.5 border-r border-coffee-dark/10 group cursor-pointer text-left hover:opacity-95 transition-all rounded-full py-0.5 pl-0.5 focus:outline-none"
            title="Click to view Admin Profile & Change Password"
          >
            <div className="w-8 h-8 rounded-full border border-cappuccino/50 bg-coffee-dark text-cappuccino font-serif font-bold text-xs flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:border-cappuccino group-hover:shadow-[0_0_15px_rgba(200,149,95,0.45)] transition-all relative">
              <span>{user.avatarLetter || user.name.charAt(0).toUpperCase()}</span>
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-background" />
            </div>
            <div className="hidden lg:block text-left leading-tight">
              <p className="font-serif font-bold text-xs text-coffee-dark truncate max-w-[110px] group-hover:text-cappuccino transition-colors">
                {user.name}
              </p>
              <p className="text-[7.5px] uppercase tracking-wider text-cappuccino font-bold truncate max-w-[110px]">
                {user.badgeCode || user.roleName}
              </p>
            </div>
          </button>

          {/* Mobile Clickable Avatar Button directly in the pill navbar */}
          {onProfileClick && (
            <button
              type="button"
              onClick={onProfileClick}
              className="sm:hidden w-8 h-8 rounded-full border border-cappuccino/60 bg-coffee-dark text-cappuccino font-serif font-bold text-xs flex items-center justify-center shadow-sm active:scale-95 cursor-pointer relative"
              title="Open Admin Profile & Settings"
            >
              <span>{user.avatarLetter || user.name.charAt(0).toUpperCase()}</span>
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-50 border border-background" />
            </button>
          )}

          <button
            type="button"
            onClick={onLogout}
            className="px-3.5 py-1.5 rounded-full bg-coffee-dark hover:bg-cappuccino text-white hover:text-coffee-dark font-sans text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Log Out"
          >
            <LogOut size={12} />
            <span className="hidden sm:inline">Logout</span>
          </button>

          {/* Mobile Toggle Button - EXACTLY matching main website navbar */}
          <button
            aria-label={isOpen ? "Close mobile menu" : "Open mobile menu"}
            className="md:hidden p-2 -mr-1 rounded-full text-coffee-dark hover:bg-coffee-dark/5 transition-colors active:scale-90 touch-manipulation focus:outline-none cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu - EXACTLY matching main website navbar drawer */}
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
                  <img
                    src="/images/logo_gold.jpeg"
                    alt="Vajra Logo"
                    className="w-full h-full object-contain scale-110"
                  />
                </div>
                <div>
                  <span className="font-serif text-xl font-bold text-coffee-dark block leading-none">
                    Vajra
                  </span>
                  <span className="font-sans text-[7px] uppercase tracking-[0.25em] text-cappuccino font-bold">
                    Fitness Arts
                  </span>
                </div>
              </div>
              <button
                aria-label="Close menu"
                onClick={() => setIsOpen(false)}
                className="p-2.5 -mr-2 rounded-full text-coffee-dark hover:bg-coffee-dark/5 active:scale-90 transition-all touch-manipulation focus:outline-none cursor-pointer"
              >
                <X size={28} />
              </button>
            </div>

            {/* Nav Links with finger-friendly spacing - matching main website style */}
            <div className="flex flex-col gap-2.5 py-6 my-auto">
              <div className="mb-2 px-3">
                <span className="text-[9px] uppercase tracking-[0.25em] text-coffee-dark/40 font-bold">
                  {role === "admin" ? "Master Admin Navigation" : "Student Navigation"}
                </span>
              </div>

              {navItems.map((item, i) => {
                const isActive = activeNavId === item.id;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 25 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04, duration: 0.25 }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onNavChange(item.id);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "w-full text-left text-2xl sm:text-3xl font-serif font-bold tracking-wider uppercase transition-colors duration-200 block py-3 px-3 rounded-xl touch-manipulation active:bg-coffee-dark/5 flex items-center justify-between cursor-pointer",
                        isActive
                          ? "text-cappuccino font-extrabold bg-cappuccino/10"
                          : "text-coffee-dark hover:text-cappuccino"
                      )}
                    >
                      <span>{item.label}</span>
                      {item.badge !== undefined && (
                        <span
                          className={cn(
                            "px-2.5 py-0.5 rounded-full text-xs font-bold font-mono tracking-normal",
                            isActive
                              ? "bg-cappuccino text-coffee-dark"
                              : "bg-coffee-dark/10 text-coffee-dark"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* Drawer Bottom: User info (Clickable to open profile) & Logout */}
            <div className="pt-5 border-t border-coffee-dark/10 space-y-3">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    if (onProfileClick) onProfileClick();
                  }}
                  className="flex items-center gap-2.5 text-left cursor-pointer group p-1 -ml-1 rounded-xl hover:bg-coffee-dark/5 transition-all"
                  title="Open Admin Profile"
                >
                  <div className="w-9 h-9 rounded-full border border-cappuccino/60 bg-coffee-dark text-cappuccino font-serif font-bold text-sm flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    {user.avatarLetter || user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-serif font-bold text-sm text-coffee-dark group-hover:text-cappuccino transition-colors">{user.name}</p>
                    <p className="text-[8.5px] uppercase tracking-wider text-cappuccino font-bold">
                      {user.badgeCode || user.roleName} • View Profile
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onLogout();
                  }}
                  className="px-4 py-2 rounded-full bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white border border-red-500/20 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-coffee-dark/40 font-bold text-center pt-1">
                Vajra Virtual Studio • 2026
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
