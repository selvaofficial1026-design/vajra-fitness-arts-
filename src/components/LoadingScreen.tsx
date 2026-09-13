"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            scale: 1.03,
            transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] }
          }}
          className="fixed inset-0 z-[100] bg-coffee-dark flex flex-col items-center justify-center text-white pointer-events-auto select-none overflow-hidden"
        >
          {/* Ambient Golden Glow Background */}
          <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gold/15 blur-3xl pointer-events-none -z-10 animate-pulse" />

          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, transition: { duration: 0.4 } }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center"
          >
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-5 border-2 border-gold/70 shadow-[0_0_35px_rgba(221,169,34,0.45),0_0_70px_rgba(200,149,95,0.25)] bg-coffee-dark flex items-center justify-center p-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/images/logo_gold.jpeg" 
                alt="Vajra Fitness Arts" 
                className="w-full h-full object-contain scale-110" 
              />
            </div>
            <h1 className="font-serif text-3xl md:text-5xl font-bold mb-3 tracking-tight text-center text-white">
              <span className="text-white drop-shadow-[0_4px_20px_rgba(221,169,34,0.6)]">VAJRA</span>{" "}
              <span className="text-cappuccino font-light not-italic block sm:inline text-xl sm:text-3xl md:text-4xl">Fitness Arts</span>
            </h1>
            <div className="w-56 sm:w-64 h-[2px] bg-white/20 rounded-full relative overflow-hidden mt-3 shadow-inner">
              <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gold to-cappuccino shadow-[0_0_12px_rgba(221,169,34,0.8)]"
              />
            </div>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-6 text-[10px] uppercase tracking-[0.5em] text-cream/70 font-bold text-center"
          >
            Ancient Disciplines • Modern Strength
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
