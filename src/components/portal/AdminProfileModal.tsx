"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShieldCheck,
  KeyRound,
  User,
  Phone,
  Mail,
  Building2,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Sparkles,
  Copy,
  Check
} from "lucide-react";

export interface AdminProfileData {
  username: string;
  name: string;
  phone?: string;
  email?: string;
  roleTitle?: string;
  academyBranch?: string;
  avatarLetter?: string;
  lastPasswordChange?: string | null;
}

interface AdminProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminProfile: AdminProfileData;
  onProfileUpdated: (updated: AdminProfileData) => void;
  onLogout: () => void;
  totalStudents?: number;
  approvedStudents?: number;
}

export default function AdminProfileModal({
  isOpen,
  onClose,
  adminProfile,
  onProfileUpdated,
  onLogout,
  totalStudents = 0,
  approvedStudents = 0
}: AdminProfileModalProps) {
  const [activeSubTab, setActiveSubTab] = useState<"security" | "details" | "session">("security");

  // Edit Profile Form State
  const [name, setName] = useState(adminProfile.name || "Master Coach & Admin");
  const [phone, setPhone] = useState(adminProfile.phone || "+91 87789 31958");
  const [email, setEmail] = useState(adminProfile.email || "vajrafitnessarts@gmail.com");
  const [roleTitle, setRoleTitle] = useState(adminProfile.roleTitle || "Head Coach & Academy Administrator");
  const [academyBranch, setAcademyBranch] = useState(adminProfile.academyBranch || "Ariyalur Main Studio, Tamil Nadu");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Quick Copy Token
  const [copiedToken, setCopiedToken] = useState(false);

  // Sync props when adminProfile changes
  useEffect(() => {
    setName(adminProfile.name || "Master Coach & Admin");
    setPhone(adminProfile.phone || "+91 87789 31958");
    setEmail(adminProfile.email || "vajrafitnessarts@gmail.com");
    setRoleTitle(adminProfile.roleTitle || "Head Coach & Academy Administrator");
    setAcademyBranch(adminProfile.academyBranch || "Ariyalur Main Studio, Tamil Nadu");
  }, [adminProfile]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);

    if (!name.trim()) {
      setProfileError("Admin name cannot be empty.");
      return;
    }

    setProfileLoading(true);
    try {
      const res = await fetch("/api/portal/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_profile",
          name,
          phone,
          email,
          roleTitle,
          academyBranch
        })
      });
      const data = await res.json();
      if (data.success && data.adminConfig) {
        setProfileSuccess(data.message || "Profile updated successfully!");
        onProfileUpdated(data.adminConfig);
        setTimeout(() => setProfileSuccess(null), 3500);
      } else {
        setProfileError(data.error || "Failed to update profile.");
      }
    } catch {
      setProfileError("Network error. Please try again.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword) {
      setPasswordError("Please enter your current master password.");
      return;
    }

    if (!newPassword || newPassword.length < 4) {
      setPasswordError("New password must be at least 4 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch("/api/portal/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "change_password",
          currentPassword,
          newPassword
        })
      });
      const data = await res.json();
      if (data.success) {
        setPasswordSuccess(data.message || "Master Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPasswordSuccess(null), 4500);
      } else {
        setPasswordError(data.error || "Failed to change password. Please verify current password.");
      }
    } catch {
      setPasswordError("Network error. Please try again.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const copyAdminToken = () => {
    const token = `VAJRA-ADMIN-PRIVILEGE-${adminProfile.username.toUpperCase()}-2026`;
    navigator.clipboard.writeText(token);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-2.5 xs:p-4 overflow-y-auto">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Card Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="relative w-full max-w-lg max-h-[90dvh] sm:max-h-[88vh] flex flex-col bg-[#FAF7F2] text-coffee-dark rounded-2xl xs:rounded-3xl border border-cappuccino/40 shadow-2xl p-4 xs:p-5 sm:p-7 z-10 my-auto overflow-hidden"
          >
            {/* Ambient Radial Golden Aura */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cappuccino/15 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-cappuccino/10 rounded-full blur-2xl pointer-events-none translate-y-1/2 -translate-x-1/2" />

            {/* Header: Avatar, Name & Close Button */}
            <div className="relative z-10 flex items-start justify-between pb-3.5 sm:pb-4 border-b border-coffee-dark/10 shrink-0 gap-2">
              <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                {/* Monogram Crest Avatar "A" */}
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-cappuccino/70 bg-coffee-dark text-cappuccino font-serif font-bold text-lg sm:text-xl flex items-center justify-center shadow-[0_0_20px_rgba(200,149,95,0.35)] relative group shrink-0">
                  <span>{adminProfile.avatarLetter || adminProfile.name?.charAt(0).toUpperCase() || "A"}</span>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-emerald-500 border-2 border-[#FAF7F2]" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cappuccino/15 border border-cappuccino/30 text-cappuccino text-[8px] sm:text-[8.5px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] max-w-full">
                    <ShieldCheck size={10} className="shrink-0" />
                    <span className="truncate">Master Admin Privilege</span>
                  </div>
                  <h3 className="font-serif font-bold text-base sm:text-xl text-coffee-dark leading-snug sm:leading-tight mt-0.5 truncate" title={adminProfile.name || "Master Coach"}>
                    {adminProfile.name || "Master Coach"}
                  </h3>
                  <p className="text-[10.5px] sm:text-[11px] text-coffee-dark/60 font-sans truncate">
                    Username: <code className="text-cappuccino font-mono font-bold">@{adminProfile.username}</code>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-11 h-11 min-w-[44px] min-h-[44px] -mr-1.5 -mt-1.5 rounded-full text-coffee-dark/60 hover:text-coffee-dark hover:bg-coffee-dark/5 active:bg-coffee-dark/10 transition-colors cursor-pointer flex items-center justify-center shrink-0 touch-manipulation"
                title="Close profile"
                aria-label="Close profile modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Sub-Navigation Tabs */}
            <div className="relative z-10 flex items-center gap-1 p-1 bg-white/70 backdrop-blur-md rounded-full border border-coffee-dark/10 shadow-xs my-3 sm:my-4 shrink-0">
              <button
                type="button"
                onClick={() => setActiveSubTab("security")}
                className={`flex-1 py-2 sm:py-1.5 px-1.5 sm:px-2 rounded-full text-[9.5px] xs:text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer min-h-[36px] sm:min-h-0 ${
                  activeSubTab === "security"
                    ? "bg-coffee-dark text-cappuccino shadow-sm"
                    : "text-coffee-dark/60 hover:text-coffee-dark hover:bg-black/5"
                }`}
              >
                <KeyRound size={12} className="shrink-0" />
                <span className="truncate">Password</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSubTab("details")}
                className={`flex-1 py-2 sm:py-1.5 px-1.5 sm:px-2 rounded-full text-[9.5px] xs:text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer min-h-[36px] sm:min-h-0 ${
                  activeSubTab === "details"
                    ? "bg-coffee-dark text-cappuccino shadow-sm"
                    : "text-coffee-dark/60 hover:text-coffee-dark hover:bg-black/5"
                }`}
              >
                <User size={12} className="shrink-0" />
                <span className="truncate">Details</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSubTab("session")}
                className={`flex-1 py-2 sm:py-1.5 px-1.5 sm:px-2 rounded-full text-[9.5px] xs:text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer min-h-[36px] sm:min-h-0 ${
                  activeSubTab === "session"
                    ? "bg-coffee-dark text-cappuccino shadow-sm"
                    : "text-coffee-dark/60 hover:text-coffee-dark hover:bg-black/5"
                }`}
              >
                <Building2 size={12} className="shrink-0" />
                <span className="truncate">Academy</span>
              </button>
            </div>

            {/* TAB 1: PASSWORD & SECURITY */}
            {activeSubTab === "security" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="relative z-10 space-y-3.5 flex-1 min-h-0 overflow-y-auto pr-1 sm:pr-1.5 overscroll-contain"
              >
                <div className="pb-1">
                  <h4 className="font-serif font-bold text-sm text-coffee-dark">
                    Change Master Admin Password
                  </h4>
                  <p className="text-[11px] text-coffee-dark/60">
                    Update your primary master key for the Academy Admin Desk &amp; Head Coach controls
                  </p>
                </div>

                {passwordSuccess && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-start gap-2"
                  >
                    <CheckCircle2 size={15} className="shrink-0 mt-0.5 text-emerald-600" />
                    <span>{passwordSuccess}</span>
                  </motion.div>
                )}

                {passwordError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2"
                  >
                    <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-500" />
                    <span>{passwordError}</span>
                  </motion.div>
                )}

                <form onSubmit={handleChangePassword} autoComplete="off" data-lpignore="true" className="space-y-3 pb-1">
                  {/* Anti-autofill trap fields for browser password managers */}
                  <input type="text" name="anti_autofill_user_trap" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
                  <input type="password" name="anti_autofill_pass_trap" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

                  {/* Current Password */}
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.18em] text-coffee-dark/70 font-bold block mb-1">
                      Current Password <span className="text-cappuccino">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <Lock size={14} className="absolute left-3 text-cappuccino pointer-events-none" />
                      <input
                        type={showCurrentPass ? "text" : "password"}
                        name="vajra_admin_cur_pwd"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        autoComplete="new-password"
                        data-lpignore="true"
                        data-form-type="other"
                        className="w-full bg-white/80 border border-coffee-dark/15 focus:border-cappuccino focus:ring-1 focus:ring-cappuccino/40 text-coffee-dark rounded-xl pl-9 pr-10 py-2.5 sm:py-2 text-sm sm:text-xs focus:outline-none transition-all shadow-xs"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute right-0 inset-y-0 w-10 flex items-center justify-center text-coffee-dark/40 hover:text-coffee-dark active:text-coffee-dark transition-colors cursor-pointer touch-manipulation"
                        aria-label={showCurrentPass ? "Hide current password" : "Show current password"}
                      >
                        {showCurrentPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.18em] text-coffee-dark/70 font-bold block mb-1">
                      New Master Password <span className="text-cappuccino">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <KeyRound size={14} className="absolute left-3 text-cappuccino pointer-events-none" />
                      <input
                        type={showNewPass ? "text" : "password"}
                        name="vajra_admin_new_pwd"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        autoComplete="new-password"
                        data-lpignore="true"
                        data-form-type="other"
                        className="w-full bg-white/80 border border-coffee-dark/15 focus:border-cappuccino focus:ring-1 focus:ring-cappuccino/40 text-coffee-dark rounded-xl pl-9 pr-10 py-2.5 sm:py-2 text-sm sm:text-xs focus:outline-none transition-all shadow-xs"
                        required
                        minLength={4}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-0 inset-y-0 w-10 flex items-center justify-center text-coffee-dark/40 hover:text-coffee-dark active:text-coffee-dark transition-colors cursor-pointer touch-manipulation"
                        aria-label={showNewPass ? "Hide new password" : "Show new password"}
                      >
                        {showNewPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    <span className="text-[9.5px] text-coffee-dark/50 block mt-0.5">
                      Minimum 4 characters. Keep it secure and memorable.
                    </span>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.18em] text-coffee-dark/70 font-bold block mb-1">
                      Confirm New Password <span className="text-cappuccino">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <Lock size={14} className="absolute left-3 text-cappuccino pointer-events-none" />
                      <input
                        type={showConfirmPass ? "text" : "password"}
                        name="vajra_admin_cnf_pwd"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                        data-lpignore="true"
                        data-form-type="other"
                        className="w-full bg-white/80 border border-coffee-dark/15 focus:border-cappuccino focus:ring-1 focus:ring-cappuccino/40 text-coffee-dark rounded-xl pl-9 pr-10 py-2.5 sm:py-2 text-sm sm:text-xs focus:outline-none transition-all shadow-xs"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute right-0 inset-y-0 w-10 flex items-center justify-center text-coffee-dark/40 hover:text-coffee-dark active:text-coffee-dark transition-colors cursor-pointer touch-manipulation"
                        aria-label={showConfirmPass ? "Hide confirm password" : "Show confirm password"}
                      >
                        {showConfirmPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="w-full py-3 sm:py-2.5 bg-coffee-dark hover:bg-cappuccino text-white hover:text-coffee-dark font-extrabold text-xs uppercase tracking-[0.18em] rounded-full transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 min-h-[44px] touch-manipulation"
                    >
                      {passwordLoading ? (
                        <span>Updating Password...</span>
                      ) : (
                        <>
                          <KeyRound size={13} />
                          <span>Save New Master Password</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* TAB 2: PROFILE DETAILS */}
            {activeSubTab === "details" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="relative z-10 space-y-3.5 flex-1 min-h-0 overflow-y-auto pr-1 sm:pr-1.5 overscroll-contain"
              >
                <div className="pb-1">
                  <h4 className="font-serif font-bold text-sm text-coffee-dark">
                    Administrator Profile Information
                  </h4>
                  <p className="text-[11px] text-coffee-dark/60">
                    Official Head Coach credentials and Academy desk contacts
                  </p>
                </div>

                {profileSuccess && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-start gap-2"
                  >
                    <CheckCircle2 size={15} className="shrink-0 mt-0.5 text-emerald-600" />
                    <span>{profileSuccess}</span>
                  </motion.div>
                )}

                {profileError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2"
                  >
                    <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-500" />
                    <span>{profileError}</span>
                  </motion.div>
                )}

                <form onSubmit={handleUpdateProfile} autoComplete="off" data-lpignore="true" className="space-y-3 pb-1">
                  {/* Master Username (Immutable) */}
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.18em] text-coffee-dark/70 font-bold block mb-1">
                      Master Username <span className="text-coffee-dark/40 lowercase text-[9px] font-normal">(system identifier)</span>
                    </label>
                    <div className="relative flex items-center">
                      <User size={14} className="absolute left-3 text-cappuccino/60 pointer-events-none" />
                      <input
                        type="text"
                        value={`@${adminProfile.username}`}
                        readOnly
                        disabled
                        className="w-full bg-black/5 border border-coffee-dark/10 text-coffee-dark/60 font-mono rounded-xl pl-9 pr-3 py-2.5 sm:py-2 text-sm sm:text-xs cursor-not-allowed select-all"
                      />
                    </div>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.18em] text-coffee-dark/70 font-bold block mb-1">
                      Head Coach Full Name <span className="text-cappuccino">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <User size={14} className="absolute left-3 text-cappuccino pointer-events-none" />
                      <input
                        type="text"
                        name="vajra_admin_prof_name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="off"
                        data-lpignore="true"
                        className="w-full bg-white/80 border border-coffee-dark/15 focus:border-cappuccino focus:ring-1 focus:ring-cappuccino/40 text-coffee-dark rounded-xl pl-9 pr-3 py-2.5 sm:py-2 text-sm sm:text-xs focus:outline-none transition-all shadow-xs"
                        required
                      />
                    </div>
                  </div>

                  {/* Role Title */}
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.18em] text-coffee-dark/70 font-bold block mb-1">
                      Official Role / Title
                    </label>
                    <div className="relative flex items-center">
                      <ShieldCheck size={14} className="absolute left-3 text-cappuccino pointer-events-none" />
                      <input
                        type="text"
                        value={roleTitle}
                        onChange={(e) => setRoleTitle(e.target.value)}
                        className="w-full bg-white/80 border border-coffee-dark/15 focus:border-cappuccino focus:ring-1 focus:ring-cappuccino/40 text-coffee-dark rounded-xl pl-9 pr-3 py-2.5 sm:py-2 text-sm sm:text-xs focus:outline-none transition-all shadow-xs"
                      />
                    </div>
                  </div>

                  {/* WhatsApp Phone */}
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.18em] text-coffee-dark/70 font-bold block mb-1">
                      Official WhatsApp Number
                    </label>
                    <div className="relative flex items-center">
                      <Phone size={14} className="absolute left-3 text-cappuccino pointer-events-none" />
                      <input
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white/80 border border-coffee-dark/15 focus:border-cappuccino focus:ring-1 focus:ring-cappuccino/40 text-coffee-dark rounded-xl pl-9 pr-3 py-2.5 sm:py-2 text-sm sm:text-xs focus:outline-none transition-all shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.18em] text-coffee-dark/70 font-bold block mb-1">
                      Official Academy Email
                    </label>
                    <div className="relative flex items-center">
                      <Mail size={14} className="absolute left-3 text-cappuccino pointer-events-none" />
                      <input
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/80 border border-coffee-dark/15 focus:border-cappuccino focus:ring-1 focus:ring-cappuccino/40 text-coffee-dark rounded-xl pl-9 pr-3 py-2.5 sm:py-2 text-sm sm:text-xs focus:outline-none transition-all shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Branch */}
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.18em] text-coffee-dark/70 font-bold block mb-1">
                      Studio Campus / Branch
                    </label>
                    <div className="relative flex items-center">
                      <Building2 size={14} className="absolute left-3 text-cappuccino pointer-events-none" />
                      <input
                        type="text"
                        value={academyBranch}
                        onChange={(e) => setAcademyBranch(e.target.value)}
                        className="w-full bg-white/80 border border-coffee-dark/15 focus:border-cappuccino focus:ring-1 focus:ring-cappuccino/40 text-coffee-dark rounded-xl pl-9 pr-3 py-2.5 sm:py-2 text-sm sm:text-xs focus:outline-none transition-all shadow-xs"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={profileLoading}
                      className="w-full py-3 sm:py-2.5 bg-coffee-dark hover:bg-cappuccino text-white hover:text-coffee-dark font-extrabold text-xs uppercase tracking-[0.18em] rounded-full transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 min-h-[44px] touch-manipulation"
                    >
                      {profileLoading ? (
                        <span>Saving Details...</span>
                      ) : (
                        <>
                          <Sparkles size={13} />
                          <span>Save Profile Information</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* TAB 3: ACADEMY DESK & SESSION */}
            {activeSubTab === "session" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="relative z-10 space-y-3 flex-1 min-h-0 overflow-y-auto pr-1 sm:pr-1.5 overscroll-contain"
              >
                <div className="pb-1">
                  <h4 className="font-serif font-bold text-sm text-coffee-dark">
                    Active Desk Session &amp; Statistics
                  </h4>
                  <p className="text-[11px] text-coffee-dark/60">
                    Live system metrics and administrative security clearance
                  </p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                  <div className="p-3 rounded-2xl bg-white/80 border border-coffee-dark/10 shadow-xs">
                    <span className="text-[8.5px] sm:text-[9px] uppercase tracking-wider text-coffee-dark/50 font-bold block truncate">
                      Total Admissions
                    </span>
                    <p className="text-lg sm:text-xl font-bold font-mono text-coffee-dark mt-0.5">
                      {totalStudents}
                    </p>
                    <span className="text-[9px] sm:text-[9.5px] text-emerald-600 font-semibold block mt-0.5 truncate">
                      {approvedStudents} Approved
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/80 border border-coffee-dark/10 shadow-xs">
                    <span className="text-[8.5px] sm:text-[9px] uppercase tracking-wider text-coffee-dark/50 font-bold block truncate">
                      Security Clearance
                    </span>
                    <p className="text-lg sm:text-xl font-bold font-mono text-cappuccino mt-0.5">
                      Level 1
                    </p>
                    <span className="text-[9px] sm:text-[9.5px] text-coffee-dark/60 font-medium block mt-0.5 truncate">
                      Full Privileges
                    </span>
                  </div>
                </div>

                {/* Master Token Box */}
                <div className="p-3 sm:p-3.5 rounded-2xl bg-white/80 border border-coffee-dark/10 shadow-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[8.5px] sm:text-[9px] uppercase tracking-wider text-coffee-dark/50 font-bold truncate">
                      Master Authorization Token
                    </span>
                    <button
                      type="button"
                      onClick={copyAdminToken}
                      className="inline-flex items-center gap-1 py-1 px-2 -my-1 -mr-1 rounded-md text-[10px] text-cappuccino hover:bg-cappuccino/10 active:bg-cappuccino/20 font-bold cursor-pointer transition-colors touch-manipulation"
                    >
                      {copiedToken ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                      <span>{copiedToken ? "Copied!" : "Copy"}</span>
                    </button>
                  </div>
                  <code className="text-[11px] sm:text-xs font-mono font-bold text-coffee-dark block bg-[#FAF7F2] p-2 sm:p-2.5 rounded-xl border border-coffee-dark/10 truncate select-all">
                    VAJRA-ADMIN-PRIVILEGE-@{adminProfile.username.toUpperCase()}-2026
                  </code>
                </div>

                {/* Logout Button from Profile */}
                <div className="pt-2 border-t border-coffee-dark/10 flex flex-col xs:flex-row xs:items-center justify-between gap-2.5">
                  <span className="text-[10px] text-coffee-dark/50">
                    Active Desk: Ariyalur Studio
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onLogout();
                    }}
                    className="w-full xs:w-auto px-4 py-2.5 rounded-full bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white border border-red-500/20 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px] touch-manipulation active:scale-95"
                  >
                    <LogOut size={13} />
                    <span>Terminate Session</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Modal Footer Note */}
            <div className="relative z-10 shrink-0 pt-3 mt-auto border-t border-coffee-dark/10 text-center">
              <p className="text-[8.5px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-coffee-dark/40 font-bold truncate">
                Vajra Virtual Studio • Master Administrative Console
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
