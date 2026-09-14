"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Phone,
  BookOpen,
  Clock,
  MapPin,
  FileText,
  Trash2,
  Check,
  RefreshCw,
  AlertTriangle,
  Award,
  Sparkles,
  LogOut
} from "lucide-react";
import { Student } from "@/lib/cmsDefaults";
import ConfirmDialogModal from "@/components/portal/ConfirmDialogModal";

interface EditStudentModalProps {
  isOpen: boolean;
  student: Student | null;
  onClose: () => void;
  onStudentUpdated: (updated: Student) => void;
  onStudentDeleted: (studentId: string) => void;
}

const batchOptions = [
  "4:30 AM - 5:15 AM (Morning)",
  "5:30 AM - 6:00 AM (Morning)",
  "8:30 AM - 9:15 AM (Morning)",
  "3:45 PM - 4:30 PM (Evening)",
  "5:00 PM - 5:45 PM (Evening)",
  "6:00 PM - 6:45 PM (Evening)",
  "All Batches"
];

const courseOptions = ["Fitness", "Silambam", "Yoga", "Martial Arts"];

export default function EditStudentModal({
  isOpen,
  student,
  onClose,
  onStudentUpdated,
  onStudentDeleted
}: EditStudentModalProps) {
  const [formData, setFormData] = useState({
    permanentCode: "",
    name: "",
    phone: "",
    course: "Fitness",
    batch: "4:30 AM - 5:15 AM (Morning)",
    status: "APPROVED" as "PENDING" | "APPROVED" | "REJECTED" | "LEFT",
    age: "",
    city: "",
    notes: ""
  });

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (student) {
      setFormData({
        permanentCode: student.permanentCode || student.tempCode || "",
        name: student.name || "",
        phone: student.phone || "",
        course: student.course || "Fitness",
        batch: student.batch || batchOptions[0],
        status: student.status || "APPROVED",
        age: student.age || "",
        city: student.city || "",
        notes: student.notes || ""
      });
      setErrorMessage(null);
    }
  }, [student]);

  if (!isOpen || !student) return null;

  const handleGenerateCode = () => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    setFormData((prev) => ({
      ...prev,
      permanentCode: `vajra-${randomDigits}`
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;

    setSaving(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/portal/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "edit_student",
          studentId: student.id,
          ...formData
        })
      });

      const data = await res.json();
      if (data.success && data.student) {
        onStudentUpdated(data.student);
        onClose();
      } else {
        setErrorMessage(data.error || "Failed to update student record.");
      }
    } catch (err) {
      console.error("Save error:", err);
      setErrorMessage("An unexpected error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  const handleExecuteDelete = async () => {
    if (!student) return;

    setDeleting(true);
    try {
      const res = await fetch("/api/portal/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete_student",
          studentId: student.id
        })
      });
      const data = await res.json();
      if (data.success) {
        onStudentDeleted(student.id);
        onClose();
      } else {
        setErrorMessage(data.error || "Failed to delete student.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setErrorMessage("Failed to delete student. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleMarkLeft = () => {
    setFormData((prev) => ({ ...prev, status: "LEFT" }));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-5">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
        />

        {/* Modal Window - Luxury Light Theme (#FAF7F2) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-[#FAF7F2] text-coffee-dark border border-cappuccino/40 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10"
        >
          {/* Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cappuccino/15 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-cappuccino/10 rounded-full blur-2xl pointer-events-none translate-y-1/2 -translate-x-1/2" />

          {/* Header */}
          <div className="relative px-5 py-4 border-b border-coffee-dark/10 flex items-center justify-between gap-3 bg-white/60 backdrop-blur-md z-10">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-full bg-coffee-dark text-cappuccino flex items-center justify-center font-serif font-bold text-base shrink-0 border border-cappuccino/50 shadow-xs">
                {student.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h3 className="font-serif font-bold text-base sm:text-lg text-coffee-dark truncate">
                  Edit Student ID &amp; Profile
                </h3>
                <p className="text-[11px] text-coffee-dark/65 font-medium truncate">
                  {student.name} • Temp ID: <span className="font-mono font-bold text-cappuccino">{student.tempCode}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full text-coffee-dark/60 hover:text-coffee-dark hover:bg-coffee-dark/5 active:bg-coffee-dark/10 transition-colors flex items-center justify-center cursor-pointer"
              title="Close"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSave} className="relative z-10 overflow-y-auto p-5 space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertTriangle size={15} className="shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Student ID (permanentCode) Editor */}
            <div className="p-4 rounded-2xl bg-white border border-cappuccino/35 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase tracking-wider text-coffee-dark font-bold flex items-center gap-1.5">
                  <Award size={14} className="text-cappuccino" />
                  <span>Permanent Student Login ID *</span>
                </label>
                <button
                  type="button"
                  onClick={handleGenerateCode}
                  className="text-[10.5px] font-semibold text-cappuccino hover:text-[#9e6e3c] flex items-center gap-1 transition-colors cursor-pointer active:scale-95"
                >
                  <Sparkles size={12} />
                  <span>Generate Code</span>
                </button>
              </div>

              <input
                type="text"
                value={formData.permanentCode}
                onChange={(e) => setFormData({ ...formData, permanentCode: e.target.value })}
                placeholder="e.g. vajra-1042"
                required
                className="w-full bg-[#FAF7F2] border border-coffee-dark/20 focus:border-cappuccino focus:bg-white text-coffee-dark font-mono text-sm font-bold rounded-xl px-3.5 py-2.5 focus:outline-none transition-all shadow-2xs"
              />
              <p className="text-[11px] text-coffee-dark/60 leading-snug">
                This permanent code is what the student enters to log in to the Student Portal.
              </p>
            </div>

            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-coffee-dark/70 font-bold block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full min-h-[42px] bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 py-2 text-xs focus:outline-none transition-all shadow-2xs"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-coffee-dark/70 font-bold block mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full min-h-[42px] bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* Course & Batch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-coffee-dark/70 font-bold block mb-1">
                  Discipline Course
                </label>
                <select
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full min-h-[42px] bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 py-2 text-xs focus:outline-none cursor-pointer shadow-2xs"
                >
                  {courseOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-coffee-dark/70 font-bold block mb-1">
                  Daily Batch Slot
                </label>
                <select
                  value={formData.batch}
                  onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                  className="w-full min-h-[42px] bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 py-2 text-xs focus:outline-none cursor-pointer shadow-2xs"
                >
                  {batchOptions.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status & Quick Mark Left */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-coffee-dark/70 font-bold block mb-1">
                  Enrollment Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as "PENDING" | "APPROVED" | "REJECTED" | "LEFT"
                    })
                  }
                  className="w-full min-h-[42px] bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 py-2 text-xs focus:outline-none cursor-pointer shadow-2xs"
                >
                  <option value="APPROVED">Active Enrolled (Approved)</option>
                  <option value="LEFT">Left / Discontinued Course</option>
                  <option value="PENDING">Pending Approval</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-coffee-dark/70 font-bold block mb-1">
                  Quick Action
                </label>
                <button
                  type="button"
                  onClick={handleMarkLeft}
                  className="w-full min-h-[42px] px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-900 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <LogOut size={13} className="text-amber-800" />
                  <span>Mark as Left Course</span>
                </button>
              </div>
            </div>

            {/* City & Age */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-coffee-dark/70 font-bold block mb-1">
                  Location / City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Ariyalur"
                  className="w-full min-h-[42px] bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 py-2 text-xs focus:outline-none transition-all shadow-2xs"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-coffee-dark/70 font-bold block mb-1">
                  Age (Years)
                </label>
                <input
                  type="text"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="e.g. 21"
                  className="w-full min-h-[42px] bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 py-2 text-xs focus:outline-none transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* Admin Notes */}
            <div>
              <label className="text-[10px] uppercase tracking-wider text-coffee-dark/70 font-bold block mb-1">
                Admin Coaching / Status Notes
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Reason for leave, batch adjustments, or coaching notes..."
                className="w-full bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl p-3 text-xs focus:outline-none transition-all shadow-2xs"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-coffee-dark/10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/40 -mx-5 -mb-5 p-5">
              {/* Delete Student Button */}
              <button
                type="button"
                onClick={() => setShowConfirmDelete(true)}
                disabled={deleting}
                className="w-full sm:w-auto min-h-[42px] px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-700 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95"
              >
                {deleting ? (
                  <RefreshCw size={13} className="animate-spin" />
                ) : (
                  <Trash2 size={13} />
                )}
                <span>Delete Student Permanently</span>
              </button>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={saving}
                  className="px-4 py-2 text-xs font-bold text-coffee-dark/70 hover:text-coffee-dark rounded-full transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="min-h-[42px] px-6 bg-cappuccino hover:bg-[#d69f68] text-coffee-dark font-extrabold text-xs uppercase tracking-wider rounded-full shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>

        {/* Confirmation Dialog for Permanent Deletion */}
        <ConfirmDialogModal
          isOpen={showConfirmDelete}
          title="Permanently Delete Student"
          message={`Are you sure you want to permanently delete ${student.name} (${student.permanentCode || student.tempCode})?\n\nThis will permanently remove their enrollment record and classroom chat history. This action cannot be undone.`}
          confirmText="Yes, Permanently Delete"
          cancelText="Cancel"
          isDestructive={true}
          onConfirm={handleExecuteDelete}
          onClose={() => setShowConfirmDelete(false)}
        />
      </div>
    </AnimatePresence>
  );
}
