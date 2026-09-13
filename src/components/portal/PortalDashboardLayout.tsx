"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Search,
  Bell,
  MessageSquare,
  LogOut,
  ChevronRight,
  Shield,
  Sparkles,
  ExternalLink,
  Phone
} from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string | number;
}

export interface PortalDashboardLayoutProps {
  role: "student" | "admin";
  title: string;
  subtitle?: string;
  breadcrumbs: { label: string; href?: string }[];
  navItems: NavItem[];
  activeNavId: string;
  onNavChange: (id: string) => void;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  user: {
    name: string;
    roleName: string;
    badgeCode?: string | null;
    avatarLetter?: string;
    phone?: string;
    courseOrBatch?: string;
  };
  onLogout: () => void;
  notificationsCount?: number;
  messagesCount?: number;
  rightWidget?: React.ReactNode;
  children: React.ReactNode;
}

export default function PortalDashboardLayout({
  role,
  title,
  subtitle,
  breadcrumbs,
  navItems,
  activeNavId,
  onNavChange,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search classes, batches, or records...",
  user,
  onLogout,
  notificationsCount = 0,
  messagesCount = 0,
  rightWidget,
  children
}: PortalDashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-coffee-dark flex flex-col antialiased">
      {/* ========================================================================= */}
      {/* DESKTOP & MOBILE SIDEBAR                                                 */}
      {/* ========================================================================= */}

      {/* Mobile Drawer Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-[#1A1212]/80 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className="flex flex-1 relative">
        {/* SIDEBAR CONTAINER */}
        <aside
          className={`
            fixed lg:sticky top-0 bottom-0 left-0 z-50 lg:z-30
            w-64 sm:w-72 bg-[#241A1A] text-white flex flex-col justify-between
            transition-transform duration-300 ease-in-out border-r border-cappuccino/20
            shadow-2xl lg:shadow-none h-screen overflow-y-auto
            ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          {/* Top Brand Logo Section */}
          <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full border border-cappuccino/60 bg-[#1A1212] p-1 flex items-center justify-center shadow-[0_0_15px_rgba(200,149,95,0.3)] relative shrink-0">
                <div className="absolute -inset-0.5 rounded-full border border-cappuccino/20 animate-pulse pointer-events-none" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logo_gold.jpeg"
                  alt="Vajra Emblem"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div className="min-w-0">
                <h1 className="font-serif font-bold text-base sm:text-lg text-white leading-tight tracking-tight group-hover:text-cappuccino transition-colors truncate">
                  Vajra Studio
                </h1>
                <p className="text-[9px] uppercase tracking-[0.2em] text-cappuccino font-bold truncate">
                  {role === "admin" ? "Admin Console" : "Virtual Academy"}
                </p>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 cursor-pointer"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links with Active Cutout Tab Styling */}
          <div className="flex-1 py-6 pl-4 pr-0 space-y-2">
            <div className="px-3 mb-3">
              <span className="text-[9.5px] uppercase tracking-[0.25em] text-white/40 font-bold">
                Navigation Desk
              </span>
            </div>

            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const isActive = activeNavId === item.id;
                const IconComponent = item.icon;

                return (
                  <div key={item.id} className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        onNavChange(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`
                        w-full flex items-center justify-between py-3 px-4 text-xs font-bold tracking-wide
                        transition-all duration-200 cursor-pointer text-left
                        ${
                          isActive
                            ? "bg-background text-coffee-dark rounded-l-2xl shadow-[-8px_4px_16px_rgba(0,0,0,0.25)] font-extrabold relative z-10"
                            : "text-white/70 hover:text-white hover:bg-white/5 rounded-l-xl pr-4"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <IconComponent
                          size={17}
                          className={`shrink-0 transition-colors ${
                            isActive ? "text-coffee-dark" : "text-cappuccino"
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {/* Badge / Count */}
                      {item.badge !== undefined && (
                        <span
                          className={`
                            px-2 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-wider shrink-0
                            ${
                              isActive
                                ? "bg-coffee-dark text-cappuccino"
                                : "bg-cappuccino/20 text-cappuccino border border-cappuccino/40"
                            }
                          `}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>

                    {/* Smooth Cutout Fillet Edge Curves (mimicking reference image) */}
                    {isActive && (
                      <>
                        <div className="hidden lg:block absolute -top-3 right-0 w-3 h-3 bg-background pointer-events-none">
                          <div className="w-full h-full bg-[#241A1A] rounded-br-2xl" />
                        </div>
                        <div className="hidden lg:block absolute -bottom-3 right-0 w-3 h-3 bg-background pointer-events-none">
                          <div className="w-full h-full bg-[#241A1A] rounded-tr-2xl" />
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Bottom Sidebar User Summary & Logout */}
          <div className="p-4 sm:p-5 border-t border-white/10 bg-[#1D1414] space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cappuccino/20 border border-cappuccino/40 flex items-center justify-center text-cappuccino font-serif font-bold text-sm shrink-0">
                {user.avatarLetter || user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-serif font-bold text-xs text-white truncate">
                  {user.name}
                </p>
                <p className="text-[9px] text-cappuccino uppercase tracking-wider font-semibold truncate">
                  {user.badgeCode || user.roleName}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/40 text-white/70 text-[11px] font-bold uppercase tracking-wider transition-all border border-white/10 flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut size={13} />
              <span>Log Out</span>
            </button>

            <div className="pt-1 text-center">
              <p className="text-[8.5px] text-white/30 uppercase tracking-[0.2em] font-mono">
                Vajra Portal • 2026
              </p>
            </div>
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* MAIN BODY AREA                                                           */}
        {/* ========================================================================= */}
        <div className="flex-1 flex flex-col min-w-0 bg-background">
          {/* TOP NAVIGATION HEADER BAR */}
          <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-cream px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
            {/* Left: Mobile Toggle & Page Title / Breadcrumbs */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-white border border-cream text-coffee-dark hover:bg-cream/40 transition-colors cursor-pointer"
                aria-label="Open sidebar"
              >
                <Menu size={18} />
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[9.5px] sm:text-[10px] text-cappuccino font-mono uppercase tracking-widest truncate">
                  {breadcrumbs.map((bc, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && <span className="text-coffee-dark/30">/</span>}
                      {bc.href ? (
                        <Link href={bc.href} className="hover:underline">
                          {bc.label}
                        </Link>
                      ) : (
                        <span className="font-bold text-coffee-dark">{bc.label}</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <h2 className="font-serif font-bold text-base sm:text-xl text-coffee-dark leading-tight truncate">
                  {title}
                </h2>
              </div>
            </div>

            {/* Center: Search Bar (Desktop / Tablet) */}
            {onSearchChange && (
              <div className="hidden md:flex flex-1 max-w-sm lg:max-w-md mx-4">
                <div className="w-full relative flex items-center bg-white rounded-full border border-cream px-3.5 py-1.5 shadow-sm focus-within:border-cappuccino focus-within:ring-1 focus-within:ring-cappuccino transition-all">
                  <Search size={14} className="text-cappuccino shrink-0 mr-2" />
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full bg-transparent text-xs text-coffee-dark placeholder:text-coffee-dark/40 outline-none"
                  />
                  {searchValue && (
                    <button
                      type="button"
                      onClick={() => onSearchChange("")}
                      className="text-coffee-dark/40 hover:text-coffee-dark text-xs ml-1 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Right: Notification Badges & User Pill */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Messages Badge */}
              <button
                type="button"
                onClick={() => onNavChange(role === "student" ? "doubt" : "messages")}
                className="relative p-2 rounded-full bg-white border border-cream text-coffee-dark hover:bg-cream/40 transition-colors cursor-pointer"
                title="Doubt Messages"
              >
                <MessageSquare size={16} className="text-coffee-dark" />
                {messagesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-cappuccino text-coffee-dark font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-sm">
                    {messagesCount}
                  </span>
                )}
              </button>

              {/* Bell Notifications */}
              <button
                type="button"
                className="relative p-2 rounded-full bg-white border border-cream text-coffee-dark hover:bg-cream/40 transition-colors cursor-pointer"
                title="Announcements & Live Meets"
              >
                <Bell size={16} className="text-coffee-dark" />
                {notificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#DDA922] text-coffee-dark font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-sm">
                    {notificationsCount}
                  </span>
                )}
              </button>

              {/* User Avatar & Name Pill */}
              <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-cream">
                <div className="w-8 h-8 rounded-full border-2 border-cappuccino bg-[#241A1A] text-cappuccino flex items-center justify-center font-serif font-bold text-xs shadow-sm">
                  {user.avatarLetter || user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left leading-tight hidden lg:block">
                  <p className="font-serif font-bold text-xs text-coffee-dark truncate max-w-[120px]">
                    {user.name}
                  </p>
                  <p className="text-[8.5px] uppercase tracking-wider text-cappuccino font-semibold truncate max-w-[120px]">
                    {user.badgeCode || user.roleName}
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* WORKSPACE GRID: Center Main Card + Right Profile Widget */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="max-w-[1600px] mx-auto">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                {/* CENTER MAIN WORKSPACE CARD */}
                <div
                  className={`
                    w-full min-w-0
                    ${rightWidget ? "xl:col-span-8 2xl:col-span-9" : "xl:col-span-12"}
                  `}
                >
                  {children}
                </div>

                {/* RIGHT PROFILE & QUICK STATS WIDGET */}
                {rightWidget && (
                  <aside className="w-full xl:col-span-4 2xl:col-span-3 space-y-6">
                    {rightWidget}
                  </aside>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
