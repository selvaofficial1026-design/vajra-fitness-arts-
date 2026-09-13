"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
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
  GraduationCap
} from "lucide-react";

const officialBatches = [
  "4:30 AM - 5:15 AM (Morning)",
  "5:30 AM - 6:00 AM (Morning)",
  "8:30 AM - 9:15 AM (Morning)",
  "3:45 PM - 4:30 PM (Evening)",
  "5:00 PM - 5:45 PM (Evening)",
  "6:00 PM - 6:45 PM (Evening)",
];

const courseOptions = ["Fitness", "Silambam", "Yoga", "Martial Arts"];

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
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState("");

  // Enrollment Form State (NO Email requested as per strict instructions!)
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
      const matched = courseOptions.find((c) => c.toLowerCase() === courseParam.toLowerCase());
      if (matched) {
        setEnrollForm((prev) => ({ ...prev, course: matched }));
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
      setLoginError("Please enter both your Username / Full Name and Permanent Student Code.");
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
        // Save session locally
        localStorage.setItem("vajra_student_session", JSON.stringify(data.user));
        router.push("/portal/student");
      } else {
        setLoginError(data.error || "Authentication failed. Please check your credentials.");
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
      setTrackError("Please enter your temporary tracking code (e.g., TEMP-xxxx).");
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
        setTrackError(data.error || "No enrollment found with this code. Please check and try again.");
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
    <main className="min-h-screen bg-background text-coffee-dark pt-28 pb-20 px-4 sm:px-6 md:px-12 relative overflow-hidden flex flex-col items-center">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cappuccino/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-10 left-0 w-96 h-96 bg-[#241A1A]/10 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />

      {/* Header Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl mx-auto mb-10 z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-coffee-dark text-cappuccino border border-cappuccino/30 text-[10px] font-bold uppercase tracking-[0.25em] mb-4 shadow-md">
          <GraduationCap size={14} className="text-cappuccino" />
          <span>Vajra Online Academy</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-coffee-dark tracking-tight mb-3">
          Virtual Training Portal
        </h1>
        <p className="text-xs sm:text-sm text-coffee-dark/70 font-light leading-relaxed">
          Daily live Google Meet sessions, private YouTube training videos, syllabus guidance, and direct WhatsApp messaging with our Head Coach.
        </p>
      </motion.div>

      {/* Main Card Container */}
      <div className="w-full max-w-2xl z-10">
        {/* Navigation Tabs */}
        <div className="flex rounded-2xl bg-white border border-cream p-1.5 shadow-premium mb-8 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => {
              setActiveTab("login");
              setLoginError("");
            }}
            className={`flex-1 py-3 px-3 sm:px-5 rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shrink-0 ${
              activeTab === "login"
                ? "bg-[#241A1A] text-white shadow-md border border-cappuccino/40"
                : "text-coffee-dark/60 hover:text-coffee-dark hover:bg-cream/40"
            }`}
          >
            <LogIn size={15} className={activeTab === "login" ? "text-cappuccino" : ""} />
            <span>Student Login</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("enroll");
              setEnrollError("");
            }}
            className={`flex-1 py-3 px-3 sm:px-5 rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shrink-0 ${
              activeTab === "enroll"
                ? "bg-[#241A1A] text-white shadow-md border border-cappuccino/40"
                : "text-coffee-dark/60 hover:text-coffee-dark hover:bg-cream/40"
            }`}
          >
            <Sparkles size={15} className={activeTab === "enroll" ? "text-cappuccino" : ""} />
            <span>Enroll Online</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("track");
              setTrackError("");
            }}
            className={`flex-1 py-3 px-3 sm:px-5 rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shrink-0 ${
              activeTab === "track"
                ? "bg-[#241A1A] text-white shadow-md border border-cappuccino/40"
                : "text-coffee-dark/60 hover:text-coffee-dark hover:bg-cream/40"
            }`}
          >
            <Search size={15} className={activeTab === "track" ? "text-cappuccino" : ""} />
            <span>Track Approval</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("admin");
              setAdminError("");
            }}
            className={`py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shrink-0 ${
              activeTab === "admin"
                ? "bg-cappuccino text-coffee-dark shadow-md"
                : "text-coffee-dark/60 hover:text-coffee-dark hover:bg-cream/40"
            }`}
            title="Academy Admin Access"
          >
            <ShieldCheck size={16} />
            <span className="hidden sm:inline">Admin</span>
          </button>
        </div>

        {/* Tab 1: Student Login */}
        <AnimatePresence mode="wait">
          {activeTab === "login" && (
            <motion.div
              key="login-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-[#241A1A] text-white p-6 sm:p-10 rounded-3xl border border-cappuccino/30 shadow-2xl relative overflow-hidden"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-cappuccino/20 border border-cappuccino/40 flex items-center justify-center text-cappuccino">
                  <UserCheck size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-white">Student Sign In</h3>
                  <p className="text-xs text-white/60">Enter your approved credentials to access online classes</p>
                </div>
              </div>

              {loginError && (
                <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-start gap-3">
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-400" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleStudentLogin} className="space-y-5">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-bold block mb-2">
                    Username or Registered Name
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      type="text"
                      value={studentUsername}
                      onChange={(e) => setStudentUsername(e.target.value)}
                      placeholder="Enter your registered name"
                      className="w-full bg-[#191111] border border-white/20 focus:border-cappuccino text-white rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-bold block mb-2">
                    Permanent Student Code (vajra-xxxx)
                  </label>
                  <div className="relative">
                    <KeyRound size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      type="text"
                      value={studentCode}
                      onChange={(e) => setStudentCode(e.target.value)}
                      placeholder="Enter permanent code (vajra-xxxx)"
                      className="w-full bg-[#191111] border border-white/20 focus:border-cappuccino text-white rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-white/50 mt-1.5">
                    Don&apos;t have your permanent code yet? Check{" "}
                    <button
                      type="button"
                      onClick={() => setActiveTab("track")}
                      className="text-cappuccino underline hover:text-white transition-colors cursor-pointer"
                    >
                      Track Approval
                    </button>{" "}
                    or{" "}
                    <button
                      type="button"
                      onClick={() => setActiveTab("enroll")}
                      className="text-cappuccino underline hover:text-white transition-colors cursor-pointer"
                    >
                      Enroll Now
                    </button>
                    .
                  </p>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full py-4 bg-cappuccino text-coffee-dark font-bold text-xs uppercase tracking-[0.2em] rounded-full hover:bg-white transition-all shadow-premium flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    {loginLoading ? (
                      <span>Signing In...</span>
                    ) : (
                      <>
                        <span>Enter Student Portal</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Tab 2: Enroll for Online Class */}
          {activeTab === "enroll" && (
            <motion.div
              key="enroll-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-[#241A1A] text-white p-6 sm:p-10 rounded-3xl border border-cappuccino/30 shadow-2xl relative overflow-hidden"
            >
              {generatedTempCode ? (
                /* Success Temporary Code Modal */
                <div className="text-center py-4 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-cappuccino/20 border border-cappuccino/50 flex items-center justify-center text-cappuccino mx-auto shadow-lg">
                    <CheckCircle2 size={36} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-cappuccino font-bold block mb-1">
                      Enrollment Submitted
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-white">Temporary Code Generated</h3>
                    <p className="text-xs text-white/70 max-w-md mx-auto mt-2 leading-relaxed">
                      Your admission request has been sent to our Head Coach for approval. Use this temporary code to track approval and obtain your permanent login credentials.
                    </p>
                  </div>

                  <div className="bg-[#191111] border-2 border-cappuccino/60 rounded-2xl p-6 max-w-sm mx-auto shadow-inner relative group">
                    <span className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">
                      Your Temporary Tracking Code
                    </span>
                    <div className="text-3xl font-mono font-extrabold text-cappuccino tracking-widest">
                      {generatedTempCode}
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(generatedTempCode)}
                      className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 hover:bg-cappuccino hover:text-coffee-dark text-xs font-bold transition-all cursor-pointer"
                    >
                      {copiedCode ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                      <span>{copiedCode ? "Copied to Clipboard!" : "Copy Temporary Code"}</span>
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
                      className="w-full sm:w-auto px-8 py-3.5 bg-cappuccino text-coffee-dark font-bold text-xs uppercase tracking-[0.2em] rounded-full hover:bg-white transition-all shadow-premium inline-flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Track Approval Status Now</span>
                      <ArrowRight size={16} />
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
                      className="w-full sm:w-auto px-6 py-3.5 border border-white/20 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-[0.2em] rounded-full transition-all cursor-pointer"
                    >
                      Submit Another
                    </button>
                  </div>
                </div>
              ) : (
                /* Registration Form - Essential Details Only (NO Email) */
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-cappuccino/20 border border-cappuccino/40 flex items-center justify-center text-cappuccino">
                      <GraduationCap size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-bold text-white">Online Class Admission</h3>
                      <p className="text-xs text-white/60">Fill in your essential details to get a temporary approval code</p>
                    </div>
                  </div>

                  {enrollError && (
                    <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-start gap-3">
                      <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-400" />
                      <span>{enrollError}</span>
                    </div>
                  )}

                  <form onSubmit={handleEnrollSubmit} className="space-y-4">
                    {/* Full Name & Phone Number (NO Email) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-bold block mb-1.5">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                          <input
                            type="text"
                            value={enrollForm.name}
                            onChange={(e) => setEnrollForm({ ...enrollForm, name: e.target.value })}
                            placeholder="Your full name"
                            className="w-full bg-[#191111] border border-white/20 focus:border-cappuccino text-white rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm focus:outline-none transition-colors"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-bold block mb-1.5">
                          Phone Number (WhatsApp) *
                        </label>
                        <div className="relative">
                          <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                          <input
                            type="tel"
                            value={enrollForm.phone}
                            onChange={(e) => setEnrollForm({ ...enrollForm, phone: e.target.value })}
                            placeholder="e.g. 9876543210"
                            className="w-full bg-[#191111] border border-white/20 focus:border-cappuccino text-white rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm focus:outline-none transition-colors"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Course & Official Batch Dropdowns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-bold block mb-1.5">
                          Course Discipline *
                        </label>
                        <select
                          value={enrollForm.course}
                          onChange={(e) => setEnrollForm({ ...enrollForm, course: e.target.value })}
                          className="w-full bg-[#191111] border border-white/20 focus:border-cappuccino text-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none transition-colors cursor-pointer"
                        >
                          {courseOptions.map((c) => (
                            <option key={c} value={c} className="bg-[#191111] text-white">
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-bold block mb-1.5">
                          Preferred Batch Timing *
                        </label>
                        <select
                          value={enrollForm.batch}
                          onChange={(e) => setEnrollForm({ ...enrollForm, batch: e.target.value })}
                          className="w-full bg-[#191111] border border-white/20 focus:border-cappuccino text-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none transition-colors cursor-pointer"
                        >
                          {officialBatches.map((b) => (
                            <option key={b} value={b} className="bg-[#191111] text-white">
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Age, Gender, City */}
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-bold block mb-1.5">
                          Age
                        </label>
                        <input
                          type="number"
                          value={enrollForm.age}
                          onChange={(e) => setEnrollForm({ ...enrollForm, age: e.target.value })}
                          placeholder="e.g. 21"
                          className="w-full bg-[#191111] border border-white/20 focus:border-cappuccino text-white rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-bold block mb-1.5">
                          Gender
                        </label>
                        <select
                          value={enrollForm.gender}
                          onChange={(e) => setEnrollForm({ ...enrollForm, gender: e.target.value })}
                          className="w-full bg-[#191111] border border-white/20 focus:border-cappuccino text-white rounded-xl px-2 py-2.5 text-xs sm:text-sm focus:outline-none transition-colors cursor-pointer"
                        >
                          <option value="Male" className="bg-[#191111] text-white">Male</option>
                          <option value="Female" className="bg-[#191111] text-white">Female</option>
                          <option value="Other" className="bg-[#191111] text-white">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-bold block mb-1.5">
                          City / Location
                        </label>
                        <input
                          type="text"
                          value={enrollForm.city}
                          onChange={(e) => setEnrollForm({ ...enrollForm, city: e.target.value })}
                          placeholder="e.g. Ariyalur"
                          className="w-full bg-[#191111] border border-white/20 focus:border-cappuccino text-white rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Goals / Notes */}
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-bold block mb-1.5">
                        Goals or Prior Experience (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={enrollForm.notes}
                        onChange={(e) => setEnrollForm({ ...enrollForm, notes: e.target.value })}
                        placeholder="Tell us your goals or any past experience..."
                        className="w-full bg-[#191111] border border-white/20 focus:border-cappuccino text-white rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none transition-colors resize-none"
                      />
                    </div>

                    <div className="pt-3">
                      <button
                        type="submit"
                        disabled={enrollLoading}
                        className="w-full py-4 bg-[#25D366] text-black font-extrabold text-xs uppercase tracking-[0.2em] rounded-full hover:bg-[#20ba5a] transition-all shadow-premium flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                      >
                        {enrollLoading ? (
                          <span>Generating Code...</span>
                        ) : (
                          <>
                            <span>Submit Admission &amp; Get Code</span>
                            <Sparkles size={16} />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </motion.div>
          )}

          {/* Tab 3: Track Approval */}
          {activeTab === "track" && (
            <motion.div
              key="track-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-[#241A1A] text-white p-6 sm:p-10 rounded-3xl border border-cappuccino/30 shadow-2xl relative overflow-hidden"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-cappuccino/20 border border-cappuccino/40 flex items-center justify-center text-cappuccino">
                  <Search size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-white">Track Approval Status</h3>
                  <p className="text-xs text-white/60">Enter your Temporary Code (e.g. TEMP-2045) to check verification</p>
                </div>
              </div>

              {trackError && (
                <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-start gap-3">
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-400" />
                  <span>{trackError}</span>
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  performTrack();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-bold block mb-2">
                    Enter Your Temporary Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={trackInputCode}
                      onChange={(e) => setTrackInputCode(e.target.value.toUpperCase())}
                      placeholder="e.g. TEMP-xxxx"
                      className="flex-1 bg-[#191111] border border-white/20 focus:border-cappuccino text-white font-mono tracking-wider uppercase rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
                      required
                    />
                    <button
                      type="submit"
                      disabled={trackLoading}
                      className="px-6 bg-cappuccino text-coffee-dark font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
                    >
                      {trackLoading ? "Checking..." : "Check"}
                    </button>
                  </div>
                </div>
              </form>

              {/* Track Result Display */}
              {trackedStudent && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-8 p-6 rounded-2xl bg-[#191111] border border-cappuccino/40 space-y-5"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-t border-white/10 pt-2">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-white/50 block">Applicant</span>
                      <h4 className="text-lg font-bold text-white">{trackedStudent.name}</h4>
                      <p className="text-xs text-cappuccino">{trackedStudent.course} • {trackedStudent.batch}</p>
                    </div>

                    <div>
                      {trackedStudent.status === "APPROVED" && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider">
                          <CheckCircle2 size={14} />
                          <span>Approved</span>
                        </div>
                      )}
                      {trackedStudent.status === "PENDING" && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider">
                          <Clock size={14} />
                          <span>Pending Review</span>
                        </div>
                      )}
                      {trackedStudent.status === "REJECTED" && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950 text-red-300 border border-red-500/40 text-xs font-bold uppercase tracking-wider">
                          <AlertCircle size={14} />
                          <span>Not Approved</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {trackedStudent.status === "APPROVED" && trackedStudent.permanentCode && (
                    <div className="p-4 rounded-xl bg-[#241A1A] border-2 border-emerald-500/40 space-y-3 text-center">
                      <span className="text-[10px] uppercase tracking-[0.25em] text-emerald-400 font-bold block">
                        🎉 Permanent Student Code Generated!
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
                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-[0.2em] rounded-full transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
                      >
                        <LogIn size={15} />
                        <span>Proceed to Student Login</span>
                      </button>
                    </div>
                  )}

                  {trackedStudent.status === "PENDING" && (
                    <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed">
                      <p className="font-bold mb-1 text-amber-300">Approval in Progress:</p>
                      Your enrollment request has been submitted to the Head Coach. Once approved in the Admin Portal, your permanent <code>vajra-xxxx</code> code will be generated here automatically!
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Tab 4: Admin Login */}
          {activeTab === "admin" && (
            <motion.div
              key="admin-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-[#241A1A] text-white p-6 sm:p-10 rounded-3xl border border-cappuccino/30 shadow-2xl relative overflow-hidden"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-cappuccino/20 border border-cappuccino/40 flex items-center justify-center text-cappuccino">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-white">Academy Admin Portal</h3>
                  <p className="text-xs text-white/60">Restricted to Head Coach and Academy Administration</p>
                </div>
              </div>

              {adminError && (
                <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-start gap-3">
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-400" />
                  <span>{adminError}</span>
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-bold block mb-2">
                    Admin Username
                  </label>
                  <input
                    type="text"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="admin"
                    className="w-full bg-[#191111] border border-white/20 focus:border-cappuccino text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-bold block mb-2">
                    Admin Password / Security PIN
                  </label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full bg-[#191111] border border-white/20 focus:border-cappuccino text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={adminLoading}
                    className="w-full py-4 bg-cappuccino text-coffee-dark font-bold text-xs uppercase tracking-[0.2em] rounded-full hover:bg-white transition-all shadow-premium flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    {adminLoading ? (
                      <span>Verifying...</span>
                    ) : (
                      <>
                        <span>Access Admin Console</span>
                        <ShieldCheck size={16} />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Admin Demo Credentials Hint */}
              <div className="mt-8 pt-6 border-t border-white/10 text-xs text-white/60">
                <p className="font-bold text-cappuccino mb-2 uppercase tracking-wider text-[10px]">
                  💡 Default Admin Credentials:
                </p>
                <div className="bg-[#191111] p-3 rounded-xl border border-white/10 flex items-center justify-between">
                  <span>Username: <strong>admin</strong> | Password: <code className="text-cappuccino font-mono">vajra@2026</code></span>
                  <button
                    type="button"
                    onClick={() => {
                      setAdminUsername("admin");
                      setAdminPassword("vajra@2026");
                    }}
                    className="px-3 py-1 bg-white/10 hover:bg-cappuccino hover:text-black rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer"
                  >
                    Auto Fill
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

export default function PortalPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center text-cappuccino">
          Loading Vajra Virtual Training Portal...
        </div>
      }
    >
      <PortalAuthContent />
    </Suspense>
  );
}
