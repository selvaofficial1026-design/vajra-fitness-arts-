"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCheck,
  ShieldCheck,
  Search,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  Check,
  LogIn,
  KeyRound,
  Phone,
  User,
  GraduationCap,
  Lock,
  Eye,
  EyeOff,
  Radio,
  Video,
  MessageSquare,
  Award,
  Zap,
  Flame,
  ChevronRight,
  HelpCircle,
  MapPin
} from "lucide-react";

const officialBatches = [
  "4:30 AM - 5:15 AM (Morning)",
  "5:30 AM - 6:00 AM (Morning)",
  "8:30 AM - 9:15 AM (Morning)",
  "3:45 PM - 4:30 PM (Evening)",
  "5:00 PM - 5:45 PM (Evening)",
  "6:00 PM - 6:45 PM (Evening)",
];

const courseOptions = [
  { name: "Fitness", tag: "Strength & Calisthenics", icon: "⚡" },
  { name: "Silambam", tag: "Traditional Tamil Staff", icon: "🥢" },
  { name: "Yoga", tag: "Breathwork & Flexibility", icon: "🧘" },
  { name: "Martial Arts", tag: "Striking & Self-Defense", icon: "🥊" },
];

function PortalAuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "login";

  const [activeTab, setActiveTab] = useState<"login" | "enroll" | "track" | "admin">(
    initialTab === "enroll" || initialTab === "track" || initialTab === "admin" ? initialTab : "login"
  );

  // Student Login State
  const [studentUsername, setStudentUsername] = useState("");
  const [studentCode, setStudentCode] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Admin Login State
  const [adminUsername, setAdminUsername] = useState("admin");
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState("");

  // Enrollment Form State (Strictly NO Placeholders, essential fields only)
  const [enrollForm, setEnrollForm] = useState({
    name: "",
    phone: "",
    course: "Fitness",
    batch: officialBatches[0],
    age: "",
    gender: "Male",
    city: "Ariyalur",
    notes: ""
  });
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [enrollError, setEnrollError] = useState("");
  const [generatedTempCode, setGeneratedTempCode] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Track Status State
  const [trackInputCode, setTrackInputCode] = useState("");
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [trackedStudent, setTrackedStudent] = useState<any | null>(null);

  // Auto-fill track code or switch to enroll tab if passed via URL
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "enroll" || tabParam === "track" || tabParam === "login" || tabParam === "admin") {
      setActiveTab(tabParam);
    }

    const courseParam = searchParams.get("course");
    if (courseParam) {
      const matched = courseOptions.find((c) => c.name.toLowerCase() === courseParam.toLowerCase());
      if (matched) {
        setEnrollForm((prev) => ({ ...prev, course: matched.name }));
      }
    }

    const codeParam = searchParams.get("code");
    if (codeParam) {
      setTrackInputCode(codeParam);
      setActiveTab("track");
      performTrack(codeParam);
    }
  }, [searchParams]);

  // Handle Student Login
  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!studentUsername.trim() || !studentCode.trim()) {
      setLoginError("Please enter both your Username / Registered Name and Permanent Student Code.");
      return;
    }

    setLoginLoading(true);
    try {
      const res = await fetch("/api/portal/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "student",
          username: studentUsername.trim(),
          code: studentCode.trim()
        })
      });
      const data = await res.json();

      if (data.success && data.user) {
        localStorage.setItem("vajra_student_session", JSON.stringify(data.user));
        router.push("/portal/student");
      } else {
        setLoginError(data.error || "Authentication failed. Please verify your credentials.");
      }
    } catch {
      setLoginError("Network connection error. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Admin Login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError("");

    if (!adminUsername.trim() || !adminPassword.trim()) {
      setAdminError("Please enter Admin Username and Password.");
      return;
    }

    setAdminLoading(true);
    try {
      const res = await fetch("/api/portal/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "admin",
          username: adminUsername.trim(),
          password: adminPassword.trim()
        })
      });
      const data = await res.json();

      if (data.success && data.user) {
        localStorage.setItem("vajra_admin_session", JSON.stringify(data.user));
        router.push("/portal/admin");
      } else {
        setAdminError(data.error || "Invalid Admin credentials.");
      }
    } catch {
      setAdminError("Network connection error. Please try again.");
    } finally {
      setAdminLoading(false);
    }
  };

  // Handle Enrollment Submission
  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnrollError("");

    if (!enrollForm.name.trim()) {
      setEnrollError("Please enter your full name.");
      return;
    }

    const cleanPhone = enrollForm.phone.replace(/\D/g, "");
    if (cleanPhone.length < 7 || cleanPhone.length > 15) {
      setEnrollError("Please enter a valid phone number (7 to 15 digits).");
      return;
    }

    setEnrollLoading(true);
    try {
      const res = await fetch("/api/portal/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enrollForm)
      });
      const data = await res.json();

      if (data.success && data.tempCode) {
        setGeneratedTempCode(data.tempCode);
      } else {
        setEnrollError(data.error || "Failed to submit enrollment request.");
      }
    } catch {
      setEnrollError("Network error. Could not submit enrollment.");
    } finally {
      setEnrollLoading(false);
    }
  };

  // Handle Track Lookup
  const performTrack = async (codeToTrack?: string) => {
    const code = (codeToTrack || trackInputCode).trim().toUpperCase();
    if (!code) {
      setTrackError("Please enter your temporary tracking code (e.g. TEMP-xxxx).");
      return;
    }

    setTrackLoading(true);
    setTrackError("");
    setTrackedStudent(null);

    try {
      const res = await fetch(`/api/portal/track?code=${encodeURIComponent(code)}`);
      const data = await res.json();

      if (data.success && data.student) {
        setTrackedStudent(data.student);
      } else {
        setTrackError(data.error || "No student enrollment found with this code. Please verify and try again.");
      }
    } catch {
      setTrackError("Failed to look up tracking status. Please check your network.");
    } finally {
      setTrackLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <main className="min-h-screen bg-background text-coffee-dark pt-16 sm:pt-20 md:pt-20 lg:pt-22 pb-8 md:pb-10 px-4 sm:px-6 md:px-6 lg:px-8 xl:px-12 relative overflow-hidden flex flex-col items-center justify-center">
      {/* Concentric Circular Watermarks & Ambient Auras (Matching Reference Image) */}
      <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full border border-cappuccino/15 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[680px] h-[680px] rounded-full border border-cappuccino/10 pointer-events-none" />
      <div className="absolute -bottom-40 left-12 w-[600px] h-[600px] rounded-full border border-cappuccino/15 pointer-events-none" />
      <div className="absolute top-1/3 right-1/3 w-48 h-48 rounded-full bg-cappuccino/10 blur-2xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-cappuccino/15 rounded-full blur-[120px] pointer-events-none -translate-y-1/3 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[550px] h-[550px] bg-[#241A1A]/10 rounded-full blur-[120px] pointer-events-none translate-y-1/3 -translate-x-1/4" />

      {/* Main Canvas Container - Centered and Responsive */}
      <div className="w-full max-w-[1440px] mx-auto z-10 relative flex flex-col md:flex-row items-center md:items-stretch justify-center md:justify-between gap-6 md:gap-4 lg:gap-8">

        {/* MOBILE ONLY TOP OVAL DOME (md:hidden - Luxury downward-curved oval canopy for mobile) */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="md:hidden w-full max-w-lg mx-auto mb-5 bg-[#241A1A] rounded-t-3xl rounded-b-[110px] sm:rounded-b-[140px] pt-6 pb-9 px-5 sm:px-7 border-b-2 border-x border-cappuccino/50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden text-white text-center"
        >
          {/* Background Martial Arts Hero Image with Dark Luxury Vignette */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Image
              src="/images/vajra_hero.jpg"
              alt="Vajra Virtual Training Academy"
              fill
              className="object-cover opacity-20 filter saturate-50 contrast-125 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#1A1212]/95 via-[#241A1A]/85 to-[#241A1A]/95" />
          </div>

          {/* Concentric Inner Arched Oval Line */}
          <div className="absolute inset-x-3.5 top-3.5 bottom-3.5 rounded-t-2xl rounded-b-[95px] sm:rounded-b-[125px] border-b border-cappuccino/25 pointer-events-none" />

          {/* Ambient Golden Radial Halo */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cappuccino/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-3">
            {/* Integrated Floating Golden Ring Crest */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full border-2 border-cappuccino/60 bg-[#241A1A] p-1.5 flex items-center justify-center shadow-[0_0_20px_rgba(200,149,95,0.35)] relative">
                <div className="absolute -inset-1 rounded-full border border-cappuccino/30 animate-pulse pointer-events-none" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logo_gold.jpeg"
                  alt="Vajra Emblem"
                  className="w-full h-full object-contain scale-110 rounded-full"
                />
              </div>
              <h1 className="text-lg font-serif font-bold text-white tracking-tight mt-1.5">
                Vajra Virtual Studio
              </h1>
              <p className="text-[8.5px] text-cappuccino uppercase tracking-[0.2em] font-bold">
                Live Disciplines &amp; Admissions
              </p>
            </div>

            {/* Virtual Academy Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cappuccino/15 border border-cappuccino/35 text-cappuccino text-[9px] font-bold uppercase tracking-[0.2em]">
              <GraduationCap size={12} />
              <span>Virtual Training Academy</span>
            </div>

            {/* Title & Subtitle */}
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white leading-tight">
              Ancient Disciplines. <br />
              <span className="italic text-cappuccino">Elite Virtual Mastery.</span>
            </h2>

            <p className="text-[11px] text-white/70 font-light max-w-sm mx-auto leading-relaxed">
              Live posture-corrected training, personal instructor feedback, and traditional martial arts mastery across 6 official batches.
            </p>

            {/* Action Button */}
            <div className="flex items-center justify-center pt-0.5">
              <Link
                href="/course"
                className="px-5 py-2 rounded-full bg-gradient-to-r from-cappuccino to-[#DDA922] text-coffee-dark font-extrabold text-[10.5px] uppercase tracking-wider shadow-md active:scale-95 inline-flex items-center gap-1.5"
              >
                <span>Explore Courses</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {/* 4 Core Pillars Badges (2x2 Grid) */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-[10.5px] text-white/75 border-t border-white/10 max-w-xs mx-auto text-left">
              <div className="flex items-center gap-1.5">
                <Radio size={12} className="text-emerald-400 shrink-0 animate-pulse" />
                <span>Daily Google Meet</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Video size={12} className="text-cappuccino shrink-0" />
                <span>YouTube Library</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MessageSquare size={12} className="text-cappuccino shrink-0" />
                <span>Direct Message Desk</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-amber-400 shrink-0" />
                <span>vajra-xxxx ID</span>
              </div>
            </div>

            {/* Trust Seal */}
            <div className="pt-1.5 border-t border-white/10 flex items-center justify-center gap-2 text-[9.5px] text-white/55">
              <span className="flex items-center gap-1">
                <Lock size={11} className="text-cappuccino" />
                <span>Zero Spam</span>
              </span>
              <span>•</span>
              <span className="font-semibold text-cappuccino">6 Official Batches</span>
            </div>
          </div>
        </motion.div>

        {/* LEFT COLUMN: Floating Ring Logo & Authentication Console */}
        <div className="w-full md:w-[47%] lg:w-[45%] xl:w-[43%] min-w-0 flex flex-col justify-center py-2 md:py-4 px-1 sm:px-2 z-20 relative">

          {/* Floating Golden Ring Crest - Desktop Only (housed inside top oval dome on mobile) */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden md:flex flex-col items-center justify-center mb-2.5 sm:mb-3 text-center"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-cappuccino/60 bg-[#241A1A] p-2 flex items-center justify-center shadow-[0_0_25px_rgba(200,149,95,0.35)] relative group">
              <div className="absolute -inset-1 rounded-full border border-cappuccino/30 animate-pulse pointer-events-none" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo_gold.jpeg"
                alt="Vajra Emblem"
                className="w-full h-full object-contain scale-110 rounded-full"
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-coffee-dark tracking-tight mt-2">
              Vajra Virtual Studio
            </h1>
            <p className="text-[9px] sm:text-[10px] text-cappuccino uppercase tracking-[0.2em] font-bold mt-0.5">
              Live Disciplines &amp; Online Admissions
            </p>
          </motion.div>

          {/* Seamless Authentication Console - Box-Free & Blended with Background */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-coffee-dark relative max-w-[440px] sm:max-w-md w-full mx-auto"
          >
            {/* Seamless Segmented Navigation Tabs */}
            <div className="relative z-10 bg-white/70 backdrop-blur-md p-1 rounded-full border border-coffee-dark/10 shadow-xs mb-4 flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("login");
                  setLoginError("");
                }}
                className={`flex-1 py-2 px-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "login"
                    ? "bg-coffee-dark text-cappuccino shadow-sm"
                    : "text-coffee-dark/60 hover:text-coffee-dark hover:bg-black/5"
                }`}
              >
                <LogIn size={13} className={activeTab === "login" ? "text-cappuccino" : ""} />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("enroll");
                  setEnrollError("");
                }}
                className={`flex-1 py-2 px-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "enroll"
                    ? "bg-coffee-dark text-cappuccino shadow-sm"
                    : "text-coffee-dark/60 hover:text-coffee-dark hover:bg-black/5"
                }`}
              >
                <Sparkles size={13} className={activeTab === "enroll" ? "text-cappuccino" : ""} />
                <span>Enroll</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("track");
                  setTrackError("");
                }}
                className={`flex-1 py-2 px-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "track"
                    ? "bg-coffee-dark text-cappuccino shadow-sm"
                    : "text-coffee-dark/60 hover:text-coffee-dark hover:bg-black/5"
                }`}
              >
                <Search size={13} className={activeTab === "track" ? "text-cappuccino" : ""} />
                <span>Track</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("admin");
                  setAdminError("");
                }}
                className={`py-2 px-3 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer shrink-0 ${
                  activeTab === "admin"
                    ? "bg-cappuccino text-coffee-dark shadow-sm font-extrabold"
                    : "text-coffee-dark/50 hover:text-coffee-dark hover:bg-black/5"
                }`}
                title="Admin Management Console"
              >
                <ShieldCheck size={14} />
                <span>Admin</span>
              </button>
            </div>

            {/* TAB 1: STUDENT SIGN IN */}
            <AnimatePresence mode="wait">
              {activeTab === "login" && (
                <motion.div
                  key="login-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-3.5 relative z-10"
                >
                  <div className="border-b border-coffee-dark/10 pb-2.5">
                    <h3 className="text-base sm:text-lg font-serif font-bold text-coffee-dark">Student Sign In</h3>
                    <p className="text-[11px] text-coffee-dark/60 mt-0.5">
                      Enter your registered name and permanent student code to enter your classroom
                    </p>
                  </div>

                  {loginError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5"
                    >
                      <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-500" />
                      <span>{loginError}</span>
                    </motion.div>
                  )}

                  <form onSubmit={handleStudentLogin} className="space-y-3">
                    {/* Username */}
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.18em] text-coffee-dark/70 font-bold block mb-1">
                        Username / Registered Full Name <span className="text-cappuccino">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <User size={15} className="absolute left-3 text-cappuccino pointer-events-none" />
                        <input
                          type="text"
                          value={studentUsername}
                          onChange={(e) => setStudentUsername(e.target.value)}
                          className="w-full bg-white/80 border border-coffee-dark/15 focus:border-cappuccino focus:ring-1 focus:ring-cappuccino/40 text-coffee-dark rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none transition-all shadow-xs"
                          required
                        />
                      </div>
                    </div>

                    {/* Permanent Code */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] uppercase tracking-[0.18em] text-coffee-dark/70 font-bold">
                          Permanent Student Code <span className="text-cappuccino">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setActiveTab("track")}
                          className="text-[10px] text-cappuccino hover:underline transition-colors cursor-pointer font-medium"
                        >
                          Forgot or checking code?
                        </button>
                      </div>
                      <div className="relative flex items-center">
                        <KeyRound size={15} className="absolute left-3 text-cappuccino pointer-events-none" />
                        <input
                          type="text"
                          value={studentCode}
                          onChange={(e) => setStudentCode(e.target.value)}
                          className="w-full bg-white/80 border border-coffee-dark/15 focus:border-cappuccino focus:ring-1 focus:ring-cappuccino/40 text-coffee-dark font-mono rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none transition-all shadow-xs"
                          required
                        />
                      </div>
                      <span className="text-[10px] text-coffee-dark/50 block mt-1">
                        Format: <code className="text-cappuccino font-mono font-bold">vajra-xxxx</code>
                      </span>
                    </div>

                    <div className="pt-1.5">
                      <button
                        type="submit"
                        disabled={loginLoading}
                        className="w-full py-2.5 sm:py-3 bg-coffee-dark hover:bg-cappuccino text-white hover:text-coffee-dark font-extrabold text-xs uppercase tracking-[0.18em] rounded-full transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                      >
                        {loginLoading ? (
                          <span>Verifying Credentials...</span>
                        ) : (
                          <>
                            <span>Enter Student Portal</span>
                            <ArrowRight size={14} />
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Need to Enroll? */}
                  <div className="pt-2 text-center text-xs text-coffee-dark/60 border-t border-coffee-dark/10">
                    New to online classes?{" "}
                    <button
                      type="button"
                      onClick={() => setActiveTab("enroll")}
                      className="text-cappuccino font-bold underline hover:text-coffee-dark transition-colors cursor-pointer"
                    >
                      Enroll for Online Admission
                    </button>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: ENROLL FOR ONLINE CLASS (ZERO PLACEHOLDERS, MNC GRADE) */}
              {activeTab === "enroll" && (
                <motion.div
                  key="enroll-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-3.5 relative z-10"
                >
                  {generatedTempCode ? (
                    /* MNC Success State */
                    <div className="text-center py-3 space-y-4">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center justify-center text-emerald-600 mx-auto shadow-xs">
                        <CheckCircle2 size={32} />
                      </div>

                      <div>
                        <span className="text-[9px] uppercase tracking-[0.25em] text-cappuccino font-bold block mb-1">
                          Admission Submitted Successfully
                        </span>
                        <h3 className="text-xl font-serif font-bold text-coffee-dark">Your Temporary Tracking Code</h3>
                        <p className="text-[11px] text-coffee-dark/70 max-w-sm mx-auto mt-1 leading-relaxed">
                          Please save this code. Our Head Coach will review and approve your slot, after which your permanent <code>vajra-xxxx</code> login code will be activated.
                        </p>
                      </div>

                      <div className="bg-white/80 border border-cappuccino/40 rounded-2xl p-4 max-w-xs mx-auto shadow-xs relative group">
                        <span className="text-[9px] uppercase tracking-widest text-coffee-dark/50 block mb-1 font-semibold">
                          Tracking Code
                        </span>
                        <div className="text-2xl sm:text-3xl font-mono font-extrabold text-coffee-dark tracking-widest">
                          {generatedTempCode}
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(generatedTempCode)}
                          className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-coffee-dark/5 hover:bg-coffee-dark hover:text-white text-coffee-dark text-xs font-bold transition-all cursor-pointer"
                        >
                          {copiedCode ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
                          <span>{copiedCode ? "Copied!" : "Copy Code"}</span>
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setTrackInputCode(generatedTempCode);
                            setActiveTab("track");
                            performTrack(generatedTempCode);
                          }}
                          className="w-full sm:w-auto px-6 py-2.5 bg-coffee-dark text-white font-extrabold text-xs uppercase tracking-[0.18em] rounded-full hover:bg-cappuccino hover:text-coffee-dark transition-all shadow-sm inline-flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Track Approval Status</span>
                          <ArrowRight size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setGeneratedTempCode(null);
                            setEnrollForm({
                              name: "",
                              phone: "",
                              course: "Fitness",
                              batch: officialBatches[0],
                              age: "",
                              gender: "Male",
                              city: "Ariyalur",
                              notes: ""
                            });
                          }}
                          className="w-full sm:w-auto px-5 py-2.5 border border-coffee-dark/20 hover:bg-coffee-dark/5 text-coffee-dark font-bold text-xs uppercase tracking-wider rounded-full transition-all cursor-pointer"
                        >
                          New Application
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Minimalist Registration Form - STRICTLY NO PLACEHOLDERS */
                    <div className="space-y-3">
                      <div className="border-b border-coffee-dark/10 pb-2.5">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base sm:text-lg font-serif font-bold text-coffee-dark">Online Admission Form</h3>
                          <span className="text-[9px] text-cappuccino font-semibold uppercase tracking-wider">
                            Essential Details
                          </span>
                        </div>
                        <p className="text-[11px] text-coffee-dark/60 mt-0.5">
                          Instant temporary code generation upon submission. No email required.
                        </p>
                      </div>

                      {enrollError && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5"
                        >
                          <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-500" />
                          <span>{enrollError}</span>
                        </motion.div>
                      )}

                      <form onSubmit={handleEnrollSubmit} className="space-y-2.5">
                        {/* Interactive Course Selection Pill Cards */}
                        <div>
                          <label className="text-[10px] uppercase tracking-[0.18em] text-coffee-dark/70 font-bold block mb-1.5">
                            Select Training Discipline <span className="text-cappuccino">*</span>
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {courseOptions.map((c) => {
                              const isSelected = enrollForm.course === c.name;
                              return (
                                <button
                                  key={c.name}
                                  type="button"
                                  onClick={() => setEnrollForm({ ...enrollForm, course: c.name })}
                                  className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                                    isSelected
                                      ? "bg-coffee-dark text-cappuccino border-coffee-dark shadow-sm font-bold"
                                      : "bg-white/70 text-coffee-dark/80 border-coffee-dark/15 hover:border-cappuccino/60 hover:bg-white"
                                  }`}
                                >
                                  <span className="text-sm leading-none">{c.icon}</span>
                                  <span className="text-xs font-bold leading-tight">{c.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Full Name & Phone Number (Row 1 - Symmetrical 2 Columns) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="text-[10px] uppercase tracking-[0.18em] text-coffee-dark/70 font-bold block mb-1">
                              Full Name <span className="text-cappuccino">*</span>
                            </label>
                            <div className="relative flex items-center">
                              <User size={15} className="absolute left-3 text-cappuccino pointer-events-none" />
                              <input
                                type="text"
                                value={enrollForm.name}
                                onChange={(e) => setEnrollForm({ ...enrollForm, name: e.target.value })}
                                className="w-full bg-white/80 border border-coffee-dark/15 focus:border-cappuccino focus:ring-1 focus:ring-cappuccino/40 text-coffee-dark rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none transition-all shadow-xs"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] uppercase tracking-[0.18em] text-coffee-dark/70 font-bold block mb-1">
                              Phone Number <span className="text-cappuccino">*</span>
                            </label>
                            <div className="relative flex items-center">
                              <Phone size={15} className="absolute left-3 text-cappuccino pointer-events-none" />
                              <input
                                type="tel"
                                value={enrollForm.phone}
                                onChange={(e) => setEnrollForm({ ...enrollForm, phone: e.target.value })}
                                className="w-full bg-white/80 border border-coffee-dark/15 focus:border-cappuccino focus:ring-1 focus:ring-cappuccino/40 text-coffee-dark rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none transition-all shadow-xs"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        {/* Preferred Batch & City (Row 2 - Symmetrical 2 Columns) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="text-[10px] uppercase tracking-[0.18em] text-coffee-dark/70 font-bold block mb-1">
                              Preferred Batch Slot <span className="text-cappuccino">*</span>
                            </label>
                            <div className="relative flex items-center">
                              <Clock size={15} className="absolute left-3 text-cappuccino pointer-events-none" />
                              <select
                                value={enrollForm.batch}
                                onChange={(e) => setEnrollForm({ ...enrollForm, batch: e.target.value })}
                                className="w-full bg-white/80 border border-coffee-dark/15 focus:border-cappuccino focus:ring-1 focus:ring-cappuccino/40 text-coffee-dark rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none transition-all cursor-pointer shadow-xs"
                              >
                                {officialBatches.map((b) => (
                                  <option key={b} value={b} className="bg-background text-coffee-dark">
                                    {b}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] uppercase tracking-[0.18em] text-coffee-dark/70 font-bold block mb-1">
                              City <span className="text-cappuccino">*</span>
                            </label>
                            <div className="relative flex items-center">
                              <MapPin size={15} className="absolute left-3 text-cappuccino pointer-events-none" />
                              <input
                                type="text"
                                value={enrollForm.city}
                                onChange={(e) => setEnrollForm({ ...enrollForm, city: e.target.value })}
                                className="w-full bg-white/80 border border-coffee-dark/15 focus:border-cappuccino focus:ring-1 focus:ring-cappuccino/40 text-coffee-dark rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none transition-all shadow-xs"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        {/* Age & Gender (Row 3 - Symmetrical 2 Columns) */}
                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="text-[10px] uppercase tracking-[0.18em] text-coffee-dark/70 font-bold block mb-1">
                              Age
                            </label>
                            <input
                              type="number"
                              value={enrollForm.age}
                              onChange={(e) => setEnrollForm({ ...enrollForm, age: e.target.value })}
                              className="w-full bg-white/80 border border-coffee-dark/15 focus:border-cappuccino focus:ring-1 focus:ring-cappuccino/40 text-coffee-dark rounded-xl px-3 py-2 text-xs focus:outline-none transition-all shadow-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] uppercase tracking-[0.18em] text-coffee-dark/70 font-bold block mb-1">
                              Gender
                            </label>
                            <div className="relative flex items-center">
                              <UserCheck size={15} className="absolute left-3 text-cappuccino pointer-events-none" />
                              <select
                                value={enrollForm.gender}
                                onChange={(e) => setEnrollForm({ ...enrollForm, gender: e.target.value })}
                                className="w-full bg-white/80 border border-coffee-dark/15 focus:border-cappuccino focus:ring-1 focus:ring-cappuccino/40 text-coffee-dark rounded-xl pl-9 pr-2 py-2 text-xs focus:outline-none transition-all cursor-pointer shadow-xs"
                              >
                                <option value="Male" className="bg-background text-coffee-dark">Male</option>
                                <option value="Female" className="bg-background text-coffee-dark">Female</option>
                                <option value="Other" className="bg-background text-coffee-dark">Other</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Goals / Notes (Row 4) */}
                        <div>
                          <label className="text-[10px] uppercase tracking-[0.18em] text-coffee-dark/70 font-bold block mb-1">
                            Goals or Prior Experience (Optional)
                          </label>
                          <textarea
                            rows={2}
                            value={enrollForm.notes}
                            onChange={(e) => setEnrollForm({ ...enrollForm, notes: e.target.value })}
                            className="w-full bg-white/80 border border-coffee-dark/15 focus:border-cappuccino focus:ring-1 focus:ring-cappuccino/40 text-coffee-dark rounded-xl px-3 py-1.5 text-xs focus:outline-none transition-all resize-none shadow-xs"
                          />
                        </div>

                        <div className="pt-1">
                          <button
                            type="submit"
                            disabled={enrollLoading}
                            className="w-full py-2.5 sm:py-3 bg-[#25D366] hover:bg-[#20ba5a] text-black font-extrabold text-xs uppercase tracking-[0.18em] rounded-full transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                          >
                            {enrollLoading ? (
                              <span>Generating Temporary Code...</span>
                            ) : (
                              <>
                                <span>Submit Admission &amp; Get Code</span>
                                <Sparkles size={14} />
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 3: TRACK APPROVAL STATUS */}
              {activeTab === "track" && (
                <motion.div
                  key="track-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-3.5 relative z-10"
                >
                  <div className="border-b border-coffee-dark/10 pb-2.5">
                    <h3 className="text-base sm:text-lg font-serif font-bold text-coffee-dark">Track Admission Approval</h3>
                    <p className="text-[11px] text-coffee-dark/60 mt-0.5">
                      Enter your temporary code to inspect real-time review status and retrieve your permanent login code
                    </p>
                  </div>

                  {trackError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5"
                    >
                      <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-500" />
                      <span>{trackError}</span>
                    </motion.div>
                  )}

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      performTrack();
                    }}
                    className="space-y-2.5"
                  >
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.18em] text-coffee-dark/70 font-bold block mb-1">
                        Temporary Tracking Code
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1 flex items-center">
                          <KeyRound size={15} className="absolute left-3 text-cappuccino pointer-events-none" />
                          <input
                            type="text"
                            value={trackInputCode}
                            onChange={(e) => setTrackInputCode(e.target.value.toUpperCase())}
                            className="w-full bg-white/80 border border-coffee-dark/15 focus:border-cappuccino focus:ring-1 focus:ring-cappuccino/40 text-coffee-dark font-mono tracking-widest uppercase rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none transition-all shadow-xs"
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={trackLoading}
                          className="px-5 py-2 bg-coffee-dark hover:bg-cappuccino text-white hover:text-coffee-dark font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                        >
                          {trackLoading ? "Checking..." : "Inspect"}
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Track Result Display */}
                  {trackedStudent && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 rounded-2xl bg-white/80 border border-coffee-dark/15 shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-coffee-dark/10">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-coffee-dark/50 block font-semibold">Applicant</span>
                          <h4 className="text-sm font-bold text-coffee-dark">{trackedStudent.name}</h4>
                          <p className="text-[11px] text-cappuccino font-medium">{trackedStudent.course} • {trackedStudent.batch}</p>
                        </div>

                        <div>
                          {trackedStudent.status === "APPROVED" && (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                              <CheckCircle2 size={13} />
                              <span>Approved</span>
                            </div>
                          )}
                          {trackedStudent.status === "PENDING" && (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-300 text-[10px] font-bold uppercase tracking-wider">
                              <Clock size={13} className="animate-spin" />
                              <span>Under Review</span>
                            </div>
                          )}
                          {trackedStudent.status === "REJECTED" && (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-300 text-[10px] font-bold uppercase tracking-wider">
                              <AlertCircle size={13} />
                              <span>Not Approved</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Approved with Permanent Code */}
                      {trackedStudent.status === "APPROVED" && trackedStudent.permanentCode && (
                        <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-300 space-y-2 text-center">
                          <span className="text-[9px] uppercase tracking-[0.25em] text-emerald-700 font-bold block">
                            Permanent Code Activated
                          </span>
                          <div className="text-2xl font-mono font-extrabold text-coffee-dark tracking-widest">
                            {trackedStudent.permanentCode}
                          </div>
                          <p className="text-[11px] text-coffee-dark/70">
                            Name: <strong className="text-coffee-dark">{trackedStudent.name}</strong> • Code:{" "}
                            <strong className="text-cappuccino">{trackedStudent.permanentCode}</strong>
                          </p>

                          <button
                            type="button"
                            onClick={() => {
                              setStudentUsername(trackedStudent.name);
                              setStudentCode(trackedStudent.permanentCode);
                              setActiveTab("login");
                            }}
                            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-[0.18em] rounded-full transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-1"
                          >
                            <LogIn size={13} />
                            <span>Proceed to Student Login</span>
                          </button>
                        </div>
                      )}

                      {/* Pending Step-by-Step Progress */}
                      {trackedStudent.status === "PENDING" && (
                        <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-300 text-xs text-coffee-dark/80 space-y-1.5">
                          <div className="flex items-center gap-2 font-bold text-amber-800 text-xs">
                            <Clock size={13} />
                            <span>Admission Verification in Progress</span>
                          </div>
                          <p className="text-[11px] leading-relaxed text-coffee-dark/70">
                            Your application is currently being allocated to a batch slot by our Head Coach. Once approved, your permanent <code className="text-cappuccino font-mono">vajra-xxxx</code> code will be generated right here!
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* TAB 4: ADMIN LOGIN */}
              {activeTab === "admin" && (
                <motion.div
                  key="admin-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-3.5 relative z-10"
                >
                  <div className="border-b border-coffee-dark/10 pb-2.5">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={18} className="text-cappuccino" />
                      <h3 className="text-base sm:text-lg font-serif font-bold text-coffee-dark">Academy Admin Access</h3>
                    </div>
                    <p className="text-[11px] text-coffee-dark/60 mt-0.5">
                      Restricted to Head Coach and Academy Administration Desk
                    </p>
                  </div>

                  {adminError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5"
                    >
                      <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-500" />
                      <span>{adminError}</span>
                    </motion.div>
                  )}

                  <form onSubmit={handleAdminLogin} className="space-y-3">
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.18em] text-coffee-dark/70 font-bold block mb-1">
                        Admin Identifier <span className="text-cappuccino">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <User size={15} className="absolute left-3 text-cappuccino pointer-events-none" />
                        <input
                          type="text"
                          value={adminUsername}
                          onChange={(e) => setAdminUsername(e.target.value)}
                          className="w-full bg-white/80 border border-coffee-dark/15 focus:border-cappuccino focus:ring-1 focus:ring-cappuccino/40 text-coffee-dark rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none transition-all shadow-xs"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-[0.18em] text-coffee-dark/70 font-bold block mb-1">
                        Master Secret PIN / Password <span className="text-cappuccino">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <Lock size={15} className="absolute left-3 text-cappuccino pointer-events-none" />
                        <input
                          type={showAdminPass ? "text" : "password"}
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          className="w-full bg-white/80 border border-coffee-dark/15 focus:border-cappuccino focus:ring-1 focus:ring-cappuccino/40 text-coffee-dark rounded-xl pl-9 pr-9 py-2 text-xs focus:outline-none transition-all shadow-xs"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowAdminPass(!showAdminPass)}
                          className="absolute right-3 text-coffee-dark/40 hover:text-coffee-dark transition-colors cursor-pointer"
                        >
                          {showAdminPass ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>

                    <div className="pt-1.5">
                      <button
                        type="submit"
                        disabled={adminLoading}
                        className="w-full py-2.5 sm:py-3 bg-coffee-dark hover:bg-cappuccino text-white hover:text-coffee-dark font-extrabold text-xs uppercase tracking-[0.18em] rounded-full transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                      >
                        {adminLoading ? (
                          <span>Verifying Access...</span>
                        ) : (
                          <>
                            <span>Authorize &amp; Open Desk</span>
                            <ShieldCheck size={14} />
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Admin Auto-Fill helper (preserved as requested) */}
                  <div className="mt-3 pt-3 border-t border-coffee-dark/10 text-xs text-coffee-dark/60">
                    <div className="bg-white/70 p-2.5 rounded-xl border border-coffee-dark/10 flex items-center justify-between text-[11px]">
                      <span>ID: <strong className="text-coffee-dark">admin</strong> | Key: <code className="text-cappuccino font-mono font-bold">vajra@2026</code></span>
                      <button
                        type="button"
                        onClick={() => {
                          setAdminUsername("admin");
                          setAdminPassword("vajra@2026");
                        }}
                        className="px-2.5 py-1 bg-coffee-dark/10 hover:bg-coffee-dark hover:text-white text-coffee-dark rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer"
                      >
                        Fill
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: DESKTOP GIANT CIRCULAR / OVAL DOME (md: and above - Matching Reference Image) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="hidden md:flex w-full md:w-[51%] lg:w-[53%] xl:w-[55%] min-w-0 bg-[#241A1A] rounded-l-[140px] md:rounded-l-[180px] lg:rounded-l-[240px] xl:rounded-l-[280px] border-l-2 border-y border-cappuccino/50 shadow-[-25px_0_60px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col justify-center py-8 lg:py-10 text-white shrink-0 self-stretch my-auto z-10"
        >
          {/* Background Martial Arts Hero Image with Dark Luxury Vignette */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Image
              src="/images/vajra_hero.jpg"
              alt="Vajra Virtual Training Academy"
              fill
              className="object-cover opacity-20 filter saturate-50 contrast-125 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-[#241A1A]/95 via-[#241A1A]/85 to-[#1A1212]/95" />
          </div>

          {/* Concentric Inner Circular Arc Guide Line */}
          <div className="absolute inset-y-5 left-5 right-0 rounded-l-[120px] md:rounded-l-[160px] lg:rounded-l-[220px] xl:rounded-l-[260px] border-l border-cappuccino/20 pointer-events-none" />

          {/* Ambient Golden Radial Halo */}
          <div className="absolute top-1/4 left-10 w-72 h-72 bg-cappuccino/20 rounded-full blur-3xl pointer-events-none" />

          {/* Content Inside the Giant Circular Dome - INSET AWAY FROM CURVE */}
          <div className="relative z-10 space-y-3 xl:space-y-3.5 max-w-md xl:max-w-lg pl-16 sm:pl-20 md:pl-22 lg:pl-28 xl:pl-32 pr-4 sm:pr-6 lg:pr-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cappuccino/15 border border-cappuccino/35 text-cappuccino text-[9px] xl:text-[10px] font-bold uppercase tracking-[0.2em]">
              <GraduationCap size={13} />
              <span>Vajra Virtual Training Academy</span>
            </div>

            <h2 className="text-2xl sm:text-3xl xl:text-4xl font-serif font-bold text-white leading-tight tracking-tight">
              Ancient Disciplines. <br />
              <span className="italic text-cappuccino">Elite Virtual Mastery.</span>
            </h2>

            <p className="text-xs xl:text-sm text-white/75 font-light leading-relaxed pr-2">
              Connect daily from anywhere in the world for live posture-corrected training, personal instructor feedback, and traditional martial arts mastery across 6 official morning and evening batch slots.
            </p>

            {/* Pill CTA Button */}
            <div className="pt-1">
              <Link
                href="/course"
                className="px-6 py-2.5 lg:py-3 rounded-full bg-gradient-to-r from-cappuccino to-[#DDA922] hover:brightness-110 text-coffee-dark font-extrabold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 inline-flex items-center gap-2"
              >
                <span>Explore Courses</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* 4 Core Pillars Badges */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-white/70 pr-2 border-t border-white/10">
              <div className="flex items-center gap-2">
                <Radio size={13} className="text-emerald-400 shrink-0 animate-pulse" />
                <span>Daily Google Meet</span>
              </div>
              <div className="flex items-center gap-2">
                <Video size={13} className="text-cappuccino shrink-0" />
                <span>Private YouTube Library</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare size={13} className="text-cappuccino shrink-0" />
                <span>Direct Coach Desk</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={13} className="text-amber-400 shrink-0" />
                <span>Official vajra-xxxx ID</span>
              </div>
            </div>

            {/* Bottom Trust Seal - INSIDE SAFE AREA */}
            <div className="pt-2 mt-2 border-t border-white/10 flex flex-wrap items-center gap-2.5 text-[10px] xl:text-[11px] text-white/50">
              <span className="flex items-center gap-1.5">
                <Lock size={12} className="text-cappuccino" />
                <span>Zero Spam • No Email Required</span>
              </span>
              <span>•</span>
              <span className="font-semibold text-cappuccino font-mono">6 Official Batches</span>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

export default function PortalPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center text-cappuccino font-serif">
          Initializing Vajra Virtual Training Portal...
        </div>
      }
    >
      <PortalAuthContent />
    </Suspense>
  );
}
