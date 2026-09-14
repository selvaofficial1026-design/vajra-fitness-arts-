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
          className="absolute inset-0 bg-[#160E0E]/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-[#241A1A] border border-cappuccino/35 rounded-2xl sm:rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] text-white overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-cappuccino/20 flex items-center justify-between gap-3 bg-white/[0.02]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-cappuccino/20 text-cappuccino flex items-center justify-center font-serif font-bold text-sm shrink-0 border border-cappuccino/30">
                {student.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h3 className="font-serif font-bold text-base sm:text-lg text-white truncate">
                  Edit Student ID &amp; Profile
                </h3>
                <p className="text-[11px] text-white/60 font-light truncate">
                  {student.name} • Temp: {student.tempCode}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSave} className="overflow-y-auto p-5 space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                <AlertTriangle size={15} className="shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Student ID (permanentCode) Editor */}
            <div className="p-3.5 rounded-xl bg-white/[0.04] border border-cappuccino/30 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase tracking-wider text-cappuccino font-bold flex items-center gap-1.5">
                  <Award size={13} />
                  <span>Permanent Student Login ID *</span>
                </label>
                <button
                  type="button"
                  onClick={handleGenerateCode}
                  className="text-[10.5px] text-white/70 hover:text-cappuccino flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Sparkles size={11} />
                  <span>Generate Code</span>
                </button>
              </div>

              <input
                type="text"
                value={formData.permanentCode}
                onChange={(e) => setFormData({ ...formData, permanentCode: e.target.value })}
                placeholder="e.g. vajra-1042"
                required
                className="w-full bg-black/40 border border-cappuccino/50 focus:border-cappuccino text-white font-mono text-sm font-bold rounded-xl px-3.5 py-2 focus:outline-none transition-all"
              />
              <p className="text-[10.5px] text-white/50 leading-tight">
                This is the code the student enters on the Student Portal to access live Google Meet rooms and videos.
              </p>
            </div>

            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-white/60 font-bold block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full min-h-[40px] bg-white/[0.05] border border-white/15 focus:border-cappuccino text-white rounded-xl px-3 py-2 text-xs focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-white/60 font-bold block mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full min-h-[40px] bg-white/[0.05] border border-white/15 focus:border-cappuccino text-white rounded-xl px-3 py-2 text-xs font-mono focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Course & Batch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-white/60 font-bold block mb-1">
                  Discipline Course
                </label>
                <select
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full min-h-[40px] bg-[#1a1313] border border-white/15 focus:border-cappuccino text-white rounded-xl px-3 py-2 text-xs focus:outline-none cursor-pointer"
                >
                  {courseOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-white/60 font-bold block mb-1">
                  Daily Batch Slot
                </label>
                <select
                  value={formData.batch}
                  onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                  className="w-full min-h-[40px] bg-[#1a1313] border border-white/15 focus:border-cappuccino text-white rounded-xl px-3 py-2 text-xs focus:outline-none cursor-pointer"
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
                <label className="text-[10px] uppercase tracking-wider text-white/60 font-bold block mb-1">
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
                  className="w-full min-h-[40px] bg-[#1a1313] border border-white/15 focus:border-cappuccino text-white rounded-xl px-3 py-2 text-xs focus:outline-none cursor-pointer"
                >
                  <option value="APPROVED">Active Enrolled (Approved)</option>
                  <option value="LEFT">Left / Discontinued Course</option>
                  <option value="PENDING">Pending Approval</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-white/60 font-bold block mb-1">
                  Quick Action
                </label>
                <button
                  type="button"
                  onClick={handleMarkLeft}
                  className="w-full min-h-[40px] px-3 py-2 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut size={13} />
                  <span>Mark as Left Course</span>
                </button>
              </div>
            </div>

            {/* City & Age */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-white/60 font-bold block mb-1">
                  Location / City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Ariyalur"
                  className="w-full min-h-[40px] bg-white/[0.05] border border-white/15 focus:border-cappuccino text-white rounded-xl px-3 py-2 text-xs focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-white/60 font-bold block mb-1">
                  Age (Years)
                </label>
                <input
                  type="text"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="e.g. 21"
                  className="w-full min-h-[40px] bg-white/[0.05] border border-white/15 focus:border-cappuccino text-white rounded-xl px-3 py-2 text-xs focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Admin Notes */}
            <div>
              <label className="text-[10px] uppercase tracking-wider text-white/60 font-bold block mb-1">
                Admin Coaching / Status Notes
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Reason for leave, batch adjustments, or coaching notes..."
                className="w-full bg-white/[0.05] border border-white/15 focus:border-cappuccino text-white rounded-xl p-3 text-xs focus:outline-none transition-all"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-cappuccino/20 flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Delete Student Button */}
              <button
                type="button"
                onClick={() => setShowConfirmDelete(true)}
                disabled={deleting}
                className="w-full sm:w-auto min-h-[40px] px-4 py-2 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 hover:text-red-200 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
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
                  className="px-4 py-2 text-xs font-bold text-white/70 hover:text-white rounded-full transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="min-h-[42px] px-6 bg-cappuccino hover:bg-[#b5834f] text-coffee-dark font-extrabold text-xs uppercase tracking-wider rounded-full shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
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
