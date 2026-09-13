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
  Play
} from "lucide-react";
import VideoModal from "@/components/VideoModal";

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

  // Demo Video Modal State (Matching Reference Image "Watch Demo")
  const [demoVideoOpen, setDemoVideoOpen] = useState(false);

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
    <main className="min-h-screen bg-background text-coffee-dark pt-24 sm:pt-28 pb-20 px-3 xs:px-4 sm:px-6 md:px-10 lg:px-12 relative overflow-hidden flex flex-col items-center justify-center">
      {/* Concentric Circular Watermarks & Ambient Auras (Matching Reference Image) */}
      <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full border border-cappuccino/15 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[680px] h-[680px] rounded-full border border-cappuccino/10 pointer-events-none" />
      <div className="absolute -bottom-40 left-12 w-[600px] h-[600px] rounded-full border border-cappuccino/15 pointer-events-none" />
      <div className="absolute top-1/3 right-1/3 w-48 h-48 rounded-full bg-cappuccino/10 blur-2xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-cappuccino/15 rounded-full blur-[120px] pointer-events-none -translate-y-1/3 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[550px] h-[550px] bg-[#241A1A]/10 rounded-full blur-[120px] pointer-events-none translate-y-1/3 -translate-x-1/4" />

      {/* Main Canvas Container */}
      <div className="w-full max-w-[1450px] mx-auto z-10 relative flex flex-col lg:flex-row items-center justify-between min-h-[780px] py-4">

        {/* MOBILE & TABLET TOP DOME CARD (< lg) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden w-full max-w-xl mx-auto mb-6 bg-[#241A1A] rounded-3xl p-5 sm:p-6 border border-cappuccino/35 shadow-xl relative overflow-hidden text-white"
        >
          {/* Subtle Background Action Image */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Image
              src="/images/vajra_hero.jpg"
              alt="Vajra Virtual Training Academy"
              fill
              className="object-cover opacity-20 filter saturate-50 contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#241A1A] via-[#241A1A]/85 to-[#1A1212]/95" />
          </div>

          <div className="relative z-10 text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cappuccino/15 border border-cappuccino/35 text-cappuccino text-[9px] font-bold uppercase tracking-[0.25em]">
              <GraduationCap size={13} />
              <span>Virtual Academy</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white leading-tight">
              Ancient Disciplines. <span className="italic text-cappuccino">Elite Virtual Mastery.</span>
            </h2>
            <p className="text-[11px] text-white/70 font-light">
              Daily posture correction, personalized instructor feedback, and traditional martial arts mastery across 6 batches.
            </p>

            {/* Mobile Dual Action Buttons */}
            <div className="flex items-center justify-center gap-3 pt-1">
              <Link
                href="/course"
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-cappuccino to-[#DDA922] text-coffee-dark font-extrabold text-[11px] uppercase tracking-wider shadow-md active:scale-95 flex items-center gap-1.5"
              >
                <span>Courses</span>
                <ArrowRight size={13} />
              </Link>

              <button
                type="button"
                onClick={() => setDemoVideoOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-cappuccino/50 bg-white/5 text-white text-[11px] font-bold uppercase tracking-wider cursor-pointer active:scale-95"
              >
                <Play size={12} className="fill-cappuccino text-cappuccino" />
                <span>Watch Demo</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* LEFT/MID SECTION: Floating Ring Logo & Authentication Console */}
        <div className="w-full max-w-xl mx-auto lg:mx-0 lg:ml-6 xl:ml-12 2xl:ml-16 z-20 relative flex flex-col justify-center">

          {/* Floating Golden Ring Crest (Matching Reference Image's Circular Ring at Top) */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center mb-5 sm:mb-6 text-center"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-cappuccino/60 bg-[#241A1A] p-2.5 flex items-center justify-center shadow-[0_0_35px_rgba(200,149,95,0.4)] relative group">
              <div className="absolute -inset-1 rounded-full border border-cappuccino/30 animate-pulse pointer-events-none" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo_gold.jpeg"
                alt="Vajra Emblem"
                className="w-full h-full object-contain scale-110 rounded-full"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-coffee-dark tracking-tight mt-3">
              Vajra Virtual Studio
            </h1>
            <p className="text-[10px] sm:text-xs text-cappuccino uppercase tracking-[0.25em] font-bold mt-0.5">
              Live Disciplines &amp; Online Admissions
            </p>
          </motion.div>

          {/* Main Glassmorphic Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="bg-[#241A1A] text-white p-5 sm:p-7 md:p-8 rounded-3xl border border-cappuccino/35 shadow-[0_25px_60px_rgba(0,0,0,0.45)] relative overflow-hidden"
          >
            {/* Ambient Radial Highlights */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-cappuccino/15 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-cappuccino/10 rounded-full blur-[70px] pointer-events-none translate-y-1/2 -translate-x-1/2" />

            {/* MNC Segmented Control Navigation Tabs */}
            <div className="relative z-10 bg-[#170F0F] p-1 rounded-2xl border border-white/10 shadow-inner mb-6 flex flex-wrap sm:flex-nowrap gap-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("login");
                  setLoginError("");
                }}
                className={`flex-1 py-2.5 sm:py-3 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === "login"
                    ? "bg-[#241A1A] text-white shadow-md border border-cappuccino/50 text-cappuccino"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <LogIn size={14} className={activeTab === "login" ? "text-cappuccino" : ""} />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("enroll");
                  setEnrollError("");
                }}
                className={`flex-1 py-2.5 sm:py-3 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === "enroll"
                    ? "bg-[#241A1A] text-white shadow-md border border-cappuccino/50 text-cappuccino"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Sparkles size={14} className={activeTab === "enroll" ? "text-cappuccino" : ""} />
                <span>Enroll Online</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("track");
                  setTrackError("");
                }}
                className={`flex-1 py-2.5 sm:py-3 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === "track"
                    ? "bg-[#241A1A] text-white shadow-md border border-cappuccino/50 text-cappuccino"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Search size={14} className={activeTab === "track" ? "text-cappuccino" : ""} />
                <span>Track Status</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("admin");
                  setAdminError("");
                }}
                className={`py-2.5 sm:py-3 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
                  activeTab === "admin"
                    ? "bg-cappuccino text-coffee-dark shadow-md font-extrabold"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
                title="Admin Management Console"
              >
                <ShieldCheck size={15} />
                <span className="hidden sm:inline">Admin</span>
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
                  className="space-y-5 relative z-10"
                >
                  <div className="border-b border-white/10 pb-3">
                    <h3 className="text-xl font-serif font-bold text-white">Student Sign In</h3>
                    <p className="text-xs text-white/60 mt-0.5">
                      Enter your registered name and permanent student code to enter your classroom
                    </p>
                  </div>

                  {loginError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-start gap-2.5"
                    >
                      <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-400" />
                      <span>{loginError}</span>
                    </motion.div>
                  )}

                  <form onSubmit={handleStudentLogin} className="space-y-4">
                    {/* Username */}
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-bold block mb-1.5">
                        Username / Registered Full Name
                      </label>
                      <div className="relative">
                        <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cappuccino/60" />
                        <input
                          type="text"
                          value={studentUsername}
                          onChange={(e) => setStudentUsername(e.target.value)}
                          className="w-full bg-[#181010] border border-white/20 focus:border-cappuccino focus:ring-1 focus:ring-cappuccino/50 text-white rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none transition-all"
                          required
                        />
                      </div>
                    </div>

                    {/* Permanent Code */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-bold">
                          Permanent Student Code
                        </label>
                        <button
                          type="button"
                          onClick={() => setActiveTab("track")}
                          className="text-[10px] text-cappuccino hover:underline transition-colors cursor-pointer"
                        >
                          Forgot or checking code?
                        </button>
                      </div>
                      <div className="relative">
                        <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cappuccino/60" />
                        <input
                          type="text"
                          value={studentCode}
                          onChange={(e) => setStudentCode(e.target.value)}
                          className="w-full bg-[#181010] border border-white/20 focus:border-cappuccino focus:ring-1 focus:ring-cappuccino/50 text-white font-mono rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none transition-all"
                          required
                        />
                      </div>
                      <span className="text-[10px] text-white/40 block mt-1">
                        Format: <code className="text-cappuccino font-mono">vajra-xxxx</code>
                      </span>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={loginLoading}
                        className="w-full py-3.5 bg-cappuccino hover:bg-white text-coffee-dark font-extrabold text-xs uppercase tracking-[0.2em] rounded-full transition-all shadow-premium flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                      >
                        {loginLoading ? (
                          <span>Verifying Credentials...</span>
                        ) : (
                          <>
                            <span>Enter Student Portal</span>
                            <ArrowRight size={15} />
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Need to Enroll? */}
                  <div className="pt-2 text-center text-xs text-white/50 border-t border-white/10">
                    New to online classes?{" "}
                    <button
                      type="button"
                      onClick={() => setActiveTab("enroll")}
                      className="text-cappuccino font-bold underline hover:text-white transition-colors cursor-pointer"
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
                  className="space-y-5 relative z-10"
                >
                  {generatedTempCode ? (
                    /* MNC Success Modal */
                    <div className="text-center py-4 space-y-5">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto shadow-lg animate-bounce">
                        <CheckCircle2 size={36} />
                      </div>

                      <div>
                        <span className="text-[10px] uppercase tracking-[0.3em] text-cappuccino font-bold block mb-1">
                          Admission Submitted Successfully
                        </span>
                        <h3 className="text-2xl font-serif font-bold text-white">Your Temporary Tracking Code</h3>
                        <p className="text-xs text-white/70 max-w-sm mx-auto mt-1 leading-relaxed">
                          Please save this code. Our Head Coach will review and approve your slot, after which your permanent <code>vajra-xxxx</code> login code will be activated.
                        </p>
                      </div>

                      <div className="bg-[#170F0F] border-2 border-cappuccino/60 rounded-2xl p-5 max-w-xs mx-auto shadow-inner relative group">
                        <span className="text-[9px] uppercase tracking-widest text-white/50 block mb-1">
                          Tracking Code
                        </span>
                        <div className="text-3xl font-mono font-extrabold text-cappuccino tracking-widest">
                          {generatedTempCode}
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(generatedTempCode)}
                          className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 hover:bg-cappuccino hover:text-coffee-dark text-xs font-bold transition-all cursor-pointer"
                        >
                          {copiedCode ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                          <span>{copiedCode ? "Copied!" : "Copy Code"}</span>
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setTrackInputCode(generatedTempCode);
                            setActiveTab("track");
                            performTrack(generatedTempCode);
                          }}
                          className="w-full sm:w-auto px-7 py-3.5 bg-cappuccino text-coffee-dark font-extrabold text-xs uppercase tracking-[0.2em] rounded-full hover:bg-white transition-all shadow-premium inline-flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Track Approval Status</span>
                          <ArrowRight size={15} />
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
                          className="w-full sm:w-auto px-5 py-3.5 border border-white/20 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all cursor-pointer"
                        >
                          New Application
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* MNC Minimalist Registration Form - STRICTLY NO PLACEHOLDERS */
                    <div className="space-y-4">
                      <div className="border-b border-white/10 pb-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-serif font-bold text-white">Online Admission Form</h3>
                          <span className="text-[10px] text-cappuccino font-semibold uppercase tracking-wider">
                            Essential Details Only
                          </span>
                        </div>
                        <p className="text-xs text-white/60 mt-0.5">
                          No email address required. Instant temporary code generation upon submission.
                        </p>
                      </div>

                      {enrollError && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-start gap-2.5"
                        >
                          <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-400" />
                          <span>{enrollError}</span>
                        </motion.div>
                      )}

                      <form onSubmit={handleEnrollSubmit} className="space-y-4">
                        {/* Interactive Course Selection Pill Cards */}
                        <div>
                          <label className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-bold block mb-2">
                            Select Training Discipline *
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {courseOptions.map((c) => {
                              const isSelected = enrollForm.course === c.name;
                              return (
                                <button
                                  key={c.name}
                                  type="button"
                                  onClick={() => setEnrollForm({ ...enrollForm, course: c.name })}
                                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                                    isSelected
                                      ? "bg-cappuccino text-coffee-dark border-cappuccino shadow-lg scale-[1.02] font-bold"
                                      : "bg-[#181010] text-white/80 border-white/15 hover:border-cappuccino/40"
                                  }`}
                                >
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span>{c.icon}</span>
                                      <span className="text-xs font-bold">{c.name}</span>
                                    </div>
                                    <span className={`text-[9px] block mt-0.5 ${isSelected ? "text-coffee-dark/80" : "text-white/40"}`}>
                                      {c.tag}
                                    </span>
                                  </div>
                                  {isSelected && <CheckCircle2 size={16} className="text-coffee-dark shrink-0" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Full Name & Phone Number (NO Placeholders) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-bold block mb-1">
                              Full Name *
                            </label>
                            <div className="relative">
                              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cappuccino/60" />
                              <input
                                type="text"
                                value={enrollForm.name}
                                onChange={(e) => setEnrollForm({ ...enrollForm, name: e.target.value })}
                                className="w-full bg-[#181010] border border-white/20 focus:border-cappuccino focus:ring-1 focus:ring-cappuccino/50 text-white rounded-xl pl-10 pr-3 py-2 text-xs sm:text-sm focus:outline-none transition-all"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-bold block mb-1">
                              Phone Number (WhatsApp) *
                            </label>
                            <div className="relative">
                              <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cappuccino/60" />
                              <input
                                type="tel"
                                value={enrollForm.phone}
                                onChange={(e) => setEnrollForm({ ...enrollForm, phone: e.target.value })}
                                className="w-full bg-[#181010] border border-white/20 focus:border-cappuccino focus:ring-1 focus:ring-cappuccino/50 text-white rounded-xl pl-10 pr-3 py-2 text-xs sm:text-sm focus:outline-none transition-all"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        {/* Preferred Batch Timing */}
                        <div>
                          <label className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-bold block mb-1">
                            Preferred Batch Slot *
                          </label>
                          <div className="relative">
                            <Clock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cappuccino/60" />
                            <select
                              value={enrollForm.batch}
                              onChange={(e) => setEnrollForm({ ...enrollForm, batch: e.target.value })}
                              className="w-full bg-[#181010] border border-white/20 focus:border-cappuccino focus:ring-1 focus:ring-cappuccino/50 text-white rounded-xl pl-10 pr-3 py-2 text-xs sm:text-sm focus:outline-none transition-all cursor-pointer"
                            >
                              {officialBatches.map((b) => (
                                <option key={b} value={b} className="bg-[#181010] text-white">
                                  {b}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Age, Gender, City (NO Placeholders) */}
                        <div className="grid grid-cols-3 gap-2.5">
                          <div>
                            <label className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-bold block mb-1">
                              Age
                            </label>
                            <input
                              type="number"
                              value={enrollForm.age}
                              onChange={(e) => setEnrollForm({ ...enrollForm, age: e.target.value })}
                              className="w-full bg-[#181010] border border-white/20 focus:border-cappuccino focus:ring-1 focus:ring-cappuccino/50 text-white rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none transition-all"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-bold block mb-1">
                              Gender
                            </label>
                            <select
                              value={enrollForm.gender}
                              onChange={(e) => setEnrollForm({ ...enrollForm, gender: e.target.value })}
                              className="w-full bg-[#181010] border border-white/20 focus:border-cappuccino focus:ring-1 focus:ring-cappuccino/50 text-white rounded-xl px-2 py-2 text-xs sm:text-sm focus:outline-none transition-all cursor-pointer"
                            >
                              <option value="Male" className="bg-[#181010] text-white">Male</option>
                              <option value="Female" className="bg-[#181010] text-white">Female</option>
                              <option value="Other" className="bg-[#181010] text-white">Other</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-bold block mb-1">
                              City
                            </label>
                            <input
                              type="text"
                              value={enrollForm.city}
                              onChange={(e) => setEnrollForm({ ...enrollForm, city: e.target.value })}
                              className="w-full bg-[#181010] border border-white/20 focus:border-cappuccino focus:ring-1 focus:ring-cappuccino/50 text-white rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none transition-all"
                            />
                          </div>
                        </div>

                        {/* Goals / Notes (NO Placeholder) */}
                        <div>
                          <label className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-bold block mb-1">
                            Goals or Prior Experience (Optional)
                          </label>
                          <textarea
                            rows={2}
                            value={enrollForm.notes}
                            onChange={(e) => setEnrollForm({ ...enrollForm, notes: e.target.value })}
                            className="w-full bg-[#181010] border border-white/20 focus:border-cappuccino focus:ring-1 focus:ring-cappuccino/50 text-white rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none transition-all resize-none"
                          />
                        </div>

                        <div className="pt-2">
                          <button
                            type="submit"
                            disabled={enrollLoading}
                            className="w-full py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-black font-extrabold text-xs uppercase tracking-[0.2em] rounded-full transition-all shadow-[0_0_25px_rgba(37,211,102,0.4)] flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                          >
                            {enrollLoading ? (
                              <span>Generating Temporary Code...</span>
                            ) : (
                              <>
                                <span>Submit Admission &amp; Get Code</span>
                                <Sparkles size={15} />
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
                  className="space-y-5 relative z-10"
                >
                  <div className="border-b border-white/10 pb-3">
                    <h3 className="text-xl font-serif font-bold text-white">Track Admission Approval</h3>
                    <p className="text-xs text-white/60 mt-0.5">
                      Enter your temporary code to inspect real-time review status and retrieve your permanent login code
                    </p>
                  </div>

                  {trackError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-start gap-2.5"
                    >
                      <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-400" />
                      <span>{trackError}</span>
                    </motion.div>
                  )}

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      performTrack();
                    }}
                    className="space-y-3"
                  >
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-bold block mb-1.5">
                        Temporary Tracking Code
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={trackInputCode}
                          onChange={(e) => setTrackInputCode(e.target.value.toUpperCase())}
                          className="flex-1 bg-[#181010] border border-white/20 focus:border-cappuccino focus:ring-1 focus:ring-cappuccino/50 text-white font-mono tracking-widest uppercase rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all"
                          required
                        />
                        <button
                          type="submit"
                          disabled={trackLoading}
                          className="px-6 bg-cappuccino text-coffee-dark font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
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
                      className="p-5 rounded-2xl bg-[#170F0F] border border-cappuccino/40 space-y-4"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/10">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-white/50 block">Applicant</span>
                          <h4 className="text-base font-bold text-white">{trackedStudent.name}</h4>
                          <p className="text-xs text-cappuccino">{trackedStudent.course} • {trackedStudent.batch}</p>
                        </div>

                        <div>
                          {trackedStudent.status === "APPROVED" && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/50 text-xs font-bold uppercase tracking-wider">
                              <CheckCircle2 size={14} />
                              <span>Approved</span>
                            </div>
                          )}
                          {trackedStudent.status === "PENDING" && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-500/50 text-xs font-bold uppercase tracking-wider">
                              <Clock size={14} className="animate-spin" />
                              <span>Under Review</span>
                            </div>
                          )}
                          {trackedStudent.status === "REJECTED" && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950 text-red-300 border border-red-500/50 text-xs font-bold uppercase tracking-wider">
                              <AlertCircle size={14} />
                              <span>Not Approved</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Approved with Permanent Code */}
                      {trackedStudent.status === "APPROVED" && trackedStudent.permanentCode && (
                        <div className="p-4 rounded-xl bg-[#241A1A] border-2 border-emerald-500/50 space-y-2.5 text-center">
                          <span className="text-[9px] uppercase tracking-[0.25em] text-emerald-400 font-bold block">
                            Permanent Code Activated
                          </span>
                          <div className="text-2xl sm:text-3xl font-mono font-extrabold text-white tracking-widest">
                            {trackedStudent.permanentCode}
                          </div>
                          <p className="text-xs text-white/70">
                            Use your name <strong>{trackedStudent.name}</strong> and code{" "}
                            <strong className="text-cappuccino">{trackedStudent.permanentCode}</strong> to login.
                          </p>

                          <button
                            type="button"
                            onClick={() => {
                              setStudentUsername(trackedStudent.name);
                              setStudentCode(trackedStudent.permanentCode);
                              setActiveTab("login");
                            }}
                            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-[0.2em] rounded-full transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-1"
                          >
                            <LogIn size={14} />
                            <span>Proceed to Student Login</span>
                          </button>
                        </div>
                      )}

                      {/* Pending Step-by-Step Progress */}
                      {trackedStudent.status === "PENDING" && (
                        <div className="p-4 rounded-xl bg-amber-950/25 border border-amber-500/30 text-xs text-amber-200/90 space-y-2">
                          <div className="flex items-center gap-2 font-bold text-amber-300">
                            <Clock size={14} />
                            <span>Admission Verification in Progress</span>
                          </div>
                          <p className="text-[11px] leading-relaxed text-white/70">
                            Your application is currently being allocated to a batch slot by our Head Coach. Once approved, your permanent <code>vajra-xxxx</code> code will be generated right here!
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
                  className="space-y-5 relative z-10"
                >
                  <div className="border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={20} className="text-cappuccino" />
                      <h3 className="text-xl font-serif font-bold text-white">Academy Admin Access</h3>
                    </div>
                    <p className="text-xs text-white/60 mt-0.5">
                      Restricted to Head Coach and Academy Administration Desk
                    </p>
                  </div>

                  {adminError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-start gap-2.5"
                    >
                      <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-400" />
                      <span>{adminError}</span>
                    </motion.div>
                  )}

                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-bold block mb-1.5">
                        Admin Identifier
                      </label>
                      <div className="relative">
                        <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cappuccino/60" />
                        <input
                          type="text"
                          value={adminUsername}
                          onChange={(e) => setAdminUsername(e.target.value)}
                          className="w-full bg-[#181010] border border-white/20 focus:border-cappuccino focus:ring-1 focus:ring-cappuccino/50 text-white rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-bold block mb-1.5">
                        Master Secret PIN / Password
                      </label>
                      <div className="relative">
                        <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cappuccino/60" />
                        <input
                          type={showAdminPass ? "text" : "password"}
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          className="w-full bg-[#181010] border border-white/20 focus:border-cappuccino focus:ring-1 focus:ring-cappuccino/50 text-white rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm focus:outline-none transition-all"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowAdminPass(!showAdminPass)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                        >
                          {showAdminPass ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={adminLoading}
                        className="w-full py-3.5 bg-cappuccino hover:bg-white text-coffee-dark font-extrabold text-xs uppercase tracking-[0.2em] rounded-full transition-all shadow-premium flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                      >
                        {adminLoading ? (
                          <span>Verifying Access...</span>
                        ) : (
                          <>
                            <span>Authorize &amp; Open Desk</span>
                            <ShieldCheck size={15} />
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Admin Auto-Fill helper (preserved as requested) */}
                  <div className="mt-4 pt-4 border-t border-white/10 text-xs text-white/60">
                    <div className="bg-[#181010] p-3 rounded-xl border border-white/10 flex items-center justify-between">
                      <span>ID: <strong>admin</strong> | Key: <code className="text-cappuccino font-mono">vajra@2026</code></span>
                      <button
                        type="button"
                        onClick={() => {
                          setAdminUsername("admin");
                          setAdminPassword("vajra@2026");
                        }}
                        className="px-3 py-1 bg-white/10 hover:bg-cappuccino hover:text-black rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer"
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

        {/* DESKTOP GIANT CIRCULAR / OVAL DOME (lg: and above - Matching Reference Image) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:flex absolute -right-24 xl:-right-16 2xl:right-0 top-1/2 -translate-y-1/2 w-[620px] xl:w-[740px] 2xl:w-[820px] h-[620px] xl:h-[740px] 2xl:h-[820px] rounded-full bg-[#241A1A] border-2 border-cappuccino/50 shadow-[-25px_0_70px_rgba(0,0,0,0.5)] z-10 overflow-hidden flex-col justify-center pl-16 xl:pl-20 2xl:pl-24 pr-12 xl:pr-16 text-white"
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
          <div className="absolute inset-4 rounded-full border border-cappuccino/15 pointer-events-none" />

          {/* Ambient Golden Radial Halo */}
          <div className="absolute top-1/4 left-10 w-72 h-72 bg-cappuccino/20 rounded-full blur-3xl pointer-events-none" />

          {/* Content Inside the Giant Circular Dome */}
          <div className="relative z-10 space-y-4 xl:space-y-5 max-w-md xl:max-w-lg">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cappuccino/15 border border-cappuccino/35 text-cappuccino text-[9px] xl:text-[10px] font-bold uppercase tracking-[0.25em]">
              <GraduationCap size={14} />
              <span>Vajra Virtual Training Academy</span>
            </div>

            <h2 className="text-3xl xl:text-4xl 2xl:text-5xl font-serif font-bold text-white leading-tight tracking-tight">
              Ancient Disciplines. <br />
              <span className="italic text-cappuccino">Elite Virtual Mastery.</span>
            </h2>

            <p className="text-xs xl:text-sm text-white/75 font-light leading-relaxed pr-6">
              Connect daily from anywhere in the world for live posture-corrected training, personal instructor feedback, and traditional martial arts mastery across 6 official morning and evening batch slots.
            </p>

            {/* Dual Action Buttons (Matching Reference Image: Pill Button + Circular Play Button) */}
            <div className="flex items-center gap-4 pt-2">
              <Link
                href="/course"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-cappuccino to-[#DDA922] hover:from-white hover:to-white text-coffee-dark font-extrabold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-2"
              >
                <span>Explore Courses</span>
                <ArrowRight size={14} />
              </Link>

              <button
                type="button"
                onClick={() => setDemoVideoOpen(true)}
                className="flex items-center gap-2.5 text-white/85 hover:text-cappuccino transition-colors group cursor-pointer"
              >
                <div className="w-11 h-11 rounded-full border-2 border-cappuccino/60 bg-white/5 group-hover:bg-cappuccino group-hover:text-coffee-dark flex items-center justify-center transition-all shadow-[0_0_20px_rgba(200,149,95,0.35)]">
                  <Play size={15} className="ml-0.5 fill-current" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">Watch Demo</span>
              </button>
            </div>

            {/* 4 Core Pillars Badges */}
            <div className="grid grid-cols-2 gap-2.5 pt-3 text-[11px] text-white/70 pr-6 border-t border-white/10">
              <div className="flex items-center gap-2">
                <Radio size={13} className="text-emerald-400 shrink-0 animate-pulse" />
                <span>Daily Google Meet</span>
              </div>
              <div className="flex items-center gap-2">
                <Video size={13} className="text-cappuccino shrink-0" />
                <span>Private YouTube Library</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare size={13} className="text-[#25D366] shrink-0" />
                <span>WhatsApp Coach Desk</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={13} className="text-amber-400 shrink-0" />
                <span>Official vajra-xxxx ID</span>
              </div>
            </div>
          </div>

          {/* Bottom Trust Seal */}
          <div className="relative z-10 pt-4 mt-4 border-t border-white/10 flex items-center gap-4 text-[11px] text-white/50">
            <span className="flex items-center gap-1.5">
              <Lock size={12} className="text-cappuccino" />
              <span>Zero Spam • No Email Required</span>
            </span>
            <span>•</span>
            <span className="font-semibold text-cappuccino font-mono">6 Official Batches</span>
          </div>
        </motion.div>
      </div>

      {/* Video Demo Modal */}
      <VideoModal
        isOpen={demoVideoOpen}
        onClose={() => setDemoVideoOpen(false)}
        videoId="dQw4w9WgXcQ"
      />
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
