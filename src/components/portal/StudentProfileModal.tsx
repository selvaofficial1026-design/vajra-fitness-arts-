"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Award,
  Clock,
  Phone,
  MapPin,
  CheckCircle2,
  Copy,
  Check,
  LogOut,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import { Student } from "@/lib/portalStore";

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  onLogout: () => void;
}

export default function StudentProfileModal({
  isOpen,
  onClose,
  student,
  onLogout
}: StudentProfileModalProps) {
  const [copiedCode, setCopiedCode] = useState(false);

  const activeCode = student.permanentCode || student.tempCode;

  const handleCopyCode = async () => {
    if (!activeCode) return;
    try {
      await navigator.clipboard.writeText(activeCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 xs:p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Container - Luxury Light Theme (#FAF7F2) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="relative w-full max-w-lg bg-[#FAF7F2] text-coffee-dark rounded-2xl sm:rounded-3xl border border-cappuccino/40 shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[90dvh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Radial Golden Aura */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cappuccino/15 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-cappuccino/10 rounded-full blur-2xl pointer-events-none translate-y-1/2 -translate-x-1/2" />

            {/* Modal Header */}
            <div className="relative p-3 xs:p-4 sm:p-6 border-b border-coffee-dark/10 flex items-center justify-between shrink-0 z-10 gap-2">
              <div className="flex items-center gap-2.5 xs:gap-3.5 min-w-0 pr-1 flex-1">
                <div className="w-10 h-10 xs:w-12 xs:h-12 rounded-full border-2 border-cappuccino/70 bg-coffee-dark text-cappuccino font-serif font-bold text-lg xs:text-xl flex items-center justify-center shadow-[0_0_15px_rgba(200,149,95,0.35)] shrink-0">
                  {student.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 xs:gap-2 flex-wrap mb-0.5 min-w-0">
                    <h3 className="text-base xs:text-lg sm:text-xl font-serif font-bold text-coffee-dark truncate min-w-0">
                      {student.name}
                    </h3>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-[9px] font-bold uppercase tracking-wider shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      Active Student
                    </span>
                  </div>
                  <p className="text-[10px] xs:text-[11px] text-coffee-dark/65 truncate">
                    Vajra Virtual Studio • Student Profile
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full text-coffee-dark/60 hover:text-coffee-dark hover:bg-coffee-dark/5 active:bg-coffee-dark/10 transition-colors flex items-center justify-center cursor-pointer shrink-0 touch-manipulation"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-3 xs:p-4 sm:p-6 space-y-3.5 xs:space-y-4 sm:space-y-5 overflow-y-auto flex-1 relative z-10 overscroll-contain">
              {/* Permanent Code Spotlight Card */}
              <div className="bg-white/80 p-3.5 xs:p-4 sm:p-4.5 rounded-2xl border border-cappuccino/30 flex flex-col xs:flex-row xs:items-center justify-between gap-3 shadow-xs min-w-0">
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-cappuccino font-bold block mb-0.5">
                    Official Student ID
                  </span>
                  <div className="text-lg xs:text-xl sm:text-2xl font-mono font-extrabold text-coffee-dark tracking-wider sm:tracking-widest break-all">
                    {activeCode}
                  </div>
                  <p className="text-[10px] xs:text-[10.5px] text-coffee-dark/60 leading-snug">
                    Use this ID to sign in to your student portal
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="w-full xs:w-auto min-h-[40px] px-3.5 py-2 rounded-xl bg-cappuccino/20 hover:bg-cappuccino hover:text-coffee-dark text-coffee-dark font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 active:scale-95 touch-manipulation border border-cappuccino/40 shadow-xs"
                  title="Copy Student ID"
                >
                  {copiedCode ? <Check size={14} className="text-emerald-700" /> : <Copy size={14} />}
                  <span>{copiedCode ? "Copied" : "Copy"}</span>
                </button>
              </div>

              {/* Student Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs">
                {/* Discipline */}
                <div className="p-3 xs:p-3.5 rounded-xl bg-white/70 border border-coffee-dark/10 space-y-1 shadow-2xs min-w-0">
                  <span className="text-[9.5px] uppercase tracking-wider text-coffee-dark/50 font-bold block">
                    Enrolled Discipline
                  </span>
                  <p className="text-xs xs:text-sm font-bold text-coffee-dark flex items-center gap-2 min-w-0">
                    <Award size={15} className="text-cappuccino shrink-0" />
                    <span className="truncate min-w-0">{student.course} Academy</span>
                  </p>
                </div>

                {/* Batch Timing */}
                <div className="p-3 xs:p-3.5 rounded-xl bg-white/70 border border-coffee-dark/10 space-y-1 shadow-2xs min-w-0">
                  <span className="text-[9.5px] uppercase tracking-wider text-coffee-dark/50 font-bold block">
                    Daily Batch Slot
                  </span>
                  <p className="text-xs xs:text-sm font-bold text-coffee-dark flex items-center gap-2 font-mono min-w-0">
                    <Clock size={15} className="text-cappuccino shrink-0" />
                    <span className="truncate min-w-0">{student.batch}</span>
                  </p>
                </div>

                {/* Phone */}
                <div className="p-3 xs:p-3.5 rounded-xl bg-white/70 border border-coffee-dark/10 space-y-1 shadow-2xs min-w-0">
                  <span className="text-[9.5px] uppercase tracking-wider text-coffee-dark/50 font-bold block">
                    Phone Number
                  </span>
                  <p className="text-xs xs:text-sm font-semibold text-coffee-dark flex items-center gap-2 min-w-0">
                    <Phone size={15} className="text-cappuccino shrink-0" />
                    <span className="break-all min-w-0">+91 {student.phone}</span>
                  </p>
                </div>

                {/* Location */}
                <div className="p-3 xs:p-3.5 rounded-xl bg-white/70 border border-coffee-dark/10 space-y-1 shadow-2xs min-w-0">
                  <span className="text-[9.5px] uppercase tracking-wider text-coffee-dark/50 font-bold block">
                    Location / Studio
                  </span>
                  <p className="text-xs xs:text-sm font-semibold text-coffee-dark flex items-center gap-2 min-w-0">
                    <MapPin size={15} className="text-cappuccino shrink-0" />
                    <span className="truncate min-w-0">{student.city || "Ariyalur Main Studio"}</span>
                  </p>
                </div>

                {/* Age & Gender (if provided) */}
                {(student.age || student.gender) && (
                  <div className="p-3 xs:p-3.5 rounded-xl bg-white/70 border border-coffee-dark/10 space-y-1 sm:col-span-2 shadow-2xs min-w-0">
                    <span className="text-[9.5px] uppercase tracking-wider text-coffee-dark/50 font-bold block">
                      Demographics
                    </span>
                    <p className="text-xs font-semibold text-coffee-dark flex items-center gap-2 min-w-0">
                      <User size={14} className="text-cappuccino shrink-0" />
                      <span className="break-words min-w-0">
                        {[student.age ? `Age: ${student.age}` : null, student.gender ? `Gender: ${student.gender}` : null]
                          .filter(Boolean)
                          .join(" • ")}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Academy Creed */}
              <div className="p-3.5 xs:p-4 rounded-2xl bg-white/70 border border-coffee-dark/10 space-y-1.5 shadow-2xs min-w-0">
                <div className="flex items-center gap-2 text-coffee-dark font-serif font-bold text-xs">
                  <Sparkles size={14} className="text-cappuccino shrink-0" />
                  <span>Vajra Training Creed</span>
                </div>
                <p className="text-xs text-coffee-dark/70 leading-relaxed font-light italic break-words">
                  &ldquo;Consistency over intensity. Discipline over emotion. Respect for the ancient arts and dedication to daily physical mastery.&rdquo;
                </p>
              </div>
            </div>

            {/* Modal Footer: Logout Action */}
            <div className="p-3 xs:p-4 sm:p-5 border-t border-coffee-dark/10 bg-white/40 flex items-center justify-between gap-3 shrink-0 relative z-10">
              <span className="text-[10px] xs:text-[10.5px] text-coffee-dark/50 font-mono shrink-0">
                Session Active
              </span>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="min-h-[40px] px-4 py-2 rounded-full bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white border border-red-500/20 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 touch-manipulation shrink-0"
              >
                <LogOut size={14} className="shrink-0" />
                <span>Log Out</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
