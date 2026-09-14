"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string | null;
}

export default function VideoModal({ isOpen, onClose, videoId }: VideoModalProps) {
  // Safely lock and restore body scroll on open/close without layout shift
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // Prevent horizontal layout jump when scrollbar disappears
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen]);

  // Close modal when pressing ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && videoId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-2.5 xs:p-4 sm:p-6 md:p-12 overflow-y-auto"
        >
          {/* Backdrop with rich warm color grading */}
          <div 
            className="absolute inset-0 bg-[#1A1212]/90 backdrop-blur-md cursor-pointer"
            onClick={onClose}
            aria-label="Close modal backdrop"
          />
          
          {/* Modal Content with warm espresso & cappuccino styling */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl z-10 my-auto flex flex-col items-center"
          >
            <div className="relative w-full aspect-video bg-[#1A1212] rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_30px_rgba(200,149,95,0.2)] border border-cappuccino/30">
              {/* Close Button - high contrast, finger-friendly, comfortable 44px touch target */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close video player"
                title="Close video player"
                className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-30 w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center bg-[#241A1A]/95 hover:bg-cappuccino hover:text-coffee-dark text-white rounded-full transition-all duration-200 backdrop-blur-md border border-cappuccino/40 hover:border-cappuccino touch-manipulation shadow-xl focus:outline-none focus:ring-2 focus:ring-cappuccino active:scale-90 cursor-pointer"
              >
                <X size={20} className="sm:w-5 sm:h-5 shrink-0" />
              </button>

              {/* YouTube Iframe */}
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&rel=0`}
                title="Vajra Fitness Arts Training Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>

            {/* Mobile Bottom Close Pill - Thumb-friendly tap target on small screens */}
            <div className="mt-3 sm:hidden text-center">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close video player"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#241A1A]/95 hover:bg-cappuccino hover:text-coffee-dark border border-cappuccino/40 text-cappuccino text-xs font-semibold shadow-xl active:scale-95 cursor-pointer touch-manipulation min-h-[40px]"
              >
                <X size={14} className="shrink-0" />
                <span>Close Player</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
