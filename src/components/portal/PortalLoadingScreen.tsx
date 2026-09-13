"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface PortalLoadingScreenProps {
  show: boolean;
  role: "admin" | "student";
  title?: string;
  subtitle?: string;
}

export default function PortalLoadingScreen({
  show,
  role,
  title,
  subtitle
}: PortalLoadingScreenProps) {
  const defaultTitle = role === "admin" ? "Vajra Master Admin" : "Vajra Student Portal";
  const defaultSubtitle =
    role === "admin"
      ? "Authenticating Master Instructor Privileges..."
      : "Connecting to Live Training Sessions & Batch Records...";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.02,
            transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
          }}
          className="fixed inset-0 z-[200] min-h-[100dvh] bg-[#241A1A] flex flex-col items-center justify-center text-white pointer-events-auto select-none overflow-hidden p-4"
        >
          {/* Ambient Golden Glow Background */}
          <div className="absolute w-72 h-72 sm:w-[420px] sm:h-[420px] rounded-full bg-[#DDA922]/15 blur-3xl pointer-events-none -z-10 animate-pulse" />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, transition: { duration: 0.35 } }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center px-4 sm:px-6 text-center max-w-sm sm:max-w-md w-full"
          >
            {/* Logo in Golden Circular Ring */}
            <div className="relative w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3.5 sm:mb-5 border-2 border-[#DDA922]/70 shadow-[0_0_35px_rgba(221,169,34,0.45),0_0_70px_rgba(200,149,95,0.25)] bg-[#1A1212] flex items-center justify-center p-1.5 shrink-0">
              <div className="absolute -inset-1 rounded-full border border-cappuccino/30 animate-pulse pointer-events-none" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo_gold.jpeg"
                alt="Vajra Emblem"
                className="w-full h-full object-contain scale-110 rounded-full"
              />
            </div>

            {/* Portal Title & Role Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cappuccino/15 border border-cappuccino/40 text-cappuccino text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] mb-2.5">
              <span>{role === "admin" ? "Master Console" : "Virtual Academy"}</span>
            </div>

            <h1 className="font-serif text-xl xs:text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2 leading-tight">
              <span>{title || defaultTitle}</span>
            </h1>

            <p className="text-[11px] sm:text-xs text-white/75 font-light max-w-xs sm:max-w-sm mx-auto mb-5 sm:mb-6 leading-relaxed">
              {subtitle || defaultSubtitle}
            </p>

            {/* Golden Animated Progress Line */}
            <div className="w-44 xs:w-56 sm:w-72 h-[2px] bg-white/15 rounded-full relative overflow-hidden shadow-inner">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#DDA922] to-cappuccino shadow-[0_0_12px_rgba(221,169,34,0.8)]"
              />
            </div>
          </motion.div>

          {/* Bottom Disciplines Tagline - Mobile safe with wrapping & controlled tracking */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="mt-6 sm:mt-8 text-[8px] xs:text-[9px] uppercase tracking-[0.18em] sm:tracking-[0.28em] text-cappuccino/70 font-bold font-mono text-center px-4 max-w-xs sm:max-w-md break-words"
          >
            Ancient Disciplines • Elite Virtual Mastery
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
