"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Info, HelpCircle, X } from "lucide-react";

export type ConfirmDialogMode = "confirm" | "alert";
export type ConfirmDialogType = ConfirmDialogMode;

export interface ConfirmDialogModalProps {
  isOpen: boolean;
  title: string;
  message?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  type?: ConfirmDialogMode;
  mode?: ConfirmDialogMode;
  onConfirm: () => void;
  onClose?: () => void;
  onCancel?: () => void;
}

export default function ConfirmDialogModal({
  isOpen,
  title,
  message,
  description,
  confirmText,
  cancelText = "Cancel",
  isDestructive = false,
  type,
  mode,
  onConfirm,
  onClose,
  onCancel
}: ConfirmDialogModalProps) {
  const dialogType = mode || type || "confirm";
  const bodyText = description || message || "";
  const handleDismiss = onCancel || onClose || (() => {});

  // Close on Escape, confirm on Enter
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleDismiss();
      } else if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onConfirm();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onConfirm, handleDismiss]);

  const defaultConfirmText = dialogType === "alert" ? "Got it" : isDestructive ? "Yes, Delete" : "Confirm";
  const finalConfirmText = confirmText || defaultConfirmText;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 select-none">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleDismiss}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="relative w-full max-w-md bg-[#241A1A] border border-cappuccino/40 rounded-3xl p-6 sm:p-7 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] text-white overflow-hidden z-10"
            role="dialog"
            aria-modal="true"
          >
            {/* Ambient Warm Corner Glow */}
            <div
              className={`pointer-events-none absolute -top-16 -right-16 w-36 h-36 rounded-full blur-3xl opacity-30 ${
                isDestructive ? "bg-rose-500" : "bg-cappuccino"
              }`}
            />

            {/* Close Icon Button */}
            <button
              type="button"
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close (ESC)"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>

            {/* Header with Luxury Crest */}
            <div className="flex items-start gap-3.5 mb-4">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                  isDestructive
                    ? "bg-rose-500/15 border-rose-500/40 text-rose-400"
                    : dialogType === "alert"
                    ? "bg-cappuccino/15 border-cappuccino/40 text-cappuccino"
                    : "bg-cappuccino/15 border-cappuccino/40 text-cappuccino"
                }`}
              >
                {isDestructive ? (
                  <AlertTriangle size={22} />
                ) : dialogType === "alert" ? (
                  <Info size={22} />
                ) : (
                  <HelpCircle size={22} />
                )}
              </div>

              <div className="min-w-0 flex-1 pt-0.5 pr-4">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                  {title}
                </h3>
              </div>
            </div>

            {/* Message Body */}
            <div className="mb-6 pl-0.5">
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-light break-words whitespace-pre-line">
                {bodyText}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              {dialogType === "confirm" && (
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="min-h-[42px] px-5 rounded-full border border-white/20 hover:border-white/40 hover:bg-white/5 text-white/85 hover:text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95"
                >
                  {cancelText}
                </button>
              )}

              <button
                type="button"
                autoFocus
                onClick={() => {
                  onConfirm();
                  handleDismiss();
                }}
                className={`min-h-[42px] px-6 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 ${
                  isDestructive
                    ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30"
                    : "bg-cappuccino hover:bg-[#d69f68] text-coffee-dark shadow-amber-950/20"
                }`}
              >
                <span>{finalConfirmText}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
