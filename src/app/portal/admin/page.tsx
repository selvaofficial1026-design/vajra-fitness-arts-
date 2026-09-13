"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Radio,
  Video,
  MessageSquare,
  ShieldCheck,
  LogOut,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Trash2,
  ExternalLink,
  Search,
  Send,
  Sparkles,
  Phone,
  AlertCircle,
  Copy,
  Check,
  Play,
  CheckCheck,
  UserCheck,
  RefreshCw,
  Award,
  KeyRound
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Student, ClassMeeting, VideoClass, ChatMessage } from "@/lib/portalStore";
import PortalNavbar, { PortalNavItem } from "@/components/portal/PortalNavbar";
import PortalLoadingScreen from "@/components/portal/PortalLoadingScreen";
import AdminProfileModal, { AdminProfileData } from "@/components/portal/AdminProfileModal";

const officialBatches = [
  "4:30 AM - 5:15 AM (Morning)",
  "5:30 AM - 6:00 AM (Morning)",
  "8:30 AM - 9:15 AM (Morning)",
  "3:45 PM - 4:30 PM (Evening)",
  "5:00 PM - 5:45 PM (Evening)",
  "6:00 PM - 6:45 PM (Evening)",
  "All Batches"
];

const courseOptions = ["All Courses", "Fitness", "Silambam", "Yoga", "Martial Arts"];

export default function AdminPortalPage() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<{ username: string; name: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"students" | "meet" | "videos" | "messages">("students");
  const [pageLoading, setPageLoading] = useState(true);

  // Admin Data State
  const [students, setStudents] = useState<Student[]>([]);
  const [meetings, setMeetings] = useState<ClassMeeting[]>([]);
  const [videos, setVideos] = useState<VideoClass[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Admin Profile Modal State
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [adminProfile, setAdminProfile] = useState<AdminProfileData>({
    username: "admin",
    name: "Master Coach & Admin",
    phone: "+91 87789 31958",
    email: "vajrafitnessarts@gmail.com",
    roleTitle: "Head Coach & Academy Administrator",
    academyBranch: "Ariyalur Main Studio, Tamil Nadu",
    avatarLetter: "A"
  });

  // Student Sub-Tab: Pending vs Enrolled
  const [studentFilter, setStudentFilter] = useState<"pending" | "approved" | "all">("pending");
  const [searchStudent, setSearchStudent] = useState("");

  // Google Meet Upload Form State
  const [newMeet, setNewMeet] = useState({
    course: "Fitness",
    batch: officialBatches[0],
    title: "",
    meetUrl: "",
    scheduledTime: "Daily Class",
    instructor: "Head Coach"
  });
  const [meetSubmitting, setMeetSubmitting] = useState(false);

  // Video Upload Form State
  const [newVideo, setNewVideo] = useState({
    youtubeUrl: "",
    title: "",
    course: "Fitness",
    category: "Foundations",
    description: ""
  });
  const [videoSubmitting, setVideoSubmitting] = useState(false);

  // Messaging State (WhatsApp Desk)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [messageSending, setMessageSending] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Check admin session & show luxury entrance loading screen
  useEffect(() => {
    const startTime = Date.now();
    const saved = localStorage.getItem("vajra_admin_session");
    if (!saved) {
      router.push("/portal?tab=admin");
      return;
    }
    try {
      const parsed = JSON.parse(saved);
      if (parsed.role !== "admin") {
        router.push("/portal?tab=admin");
        return;
      }
      setAdminUser(parsed);
      loadAdminData();

      const elapsed = Date.now() - startTime;
      const remaining = Math.max(1200 - elapsed, 400);
      const timer = setTimeout(() => {
        setPageLoading(false);
      }, remaining);
      return () => clearTimeout(timer);
    } catch {
      router.push("/portal?tab=admin");
    }
  }, [router]);

  const loadAdminData = async () => {
    try {
      const res = await fetch("/api/portal/admin");
      const data = await res.json();
      if (data.success) {
        setStudents(data.students || []);
        setMeetings(data.meetings || []);
        setVideos(data.videos || []);
        setMessages(data.messages || []);

        if (data.adminConfig) {
          setAdminProfile(data.adminConfig);
        }

        if (!selectedStudentId && data.students?.length > 0) {
          const firstApproved = data.students.find((s: Student) => s.status === "APPROVED") || data.students[0];
          setSelectedStudentId(firstApproved.id);
        }
      }
    } catch (err) {
      console.error("Failed to load admin data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      loadAdminData();
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeTab === "messages") {
      chatScrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedStudentId, activeTab]);

  const handleApproveStudent = async (studentId: string) => {
    try {
      const res = await fetch("/api/portal/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve", studentId })
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage(`Student approved! Permanent Code: ${data.student?.permanentCode}`);
        setTimeout(() => setActionMessage(null), 5000);
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectStudent = async (studentId: string) => {
    if (!confirm("Are you sure you want to reject this student enrollment?")) return;
    try {
      const res = await fetch("/api/portal/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", studentId })
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage("Student enrollment rejected.");
        setTimeout(() => setActionMessage(null), 4000);
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMeet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeet.title.trim() || !newMeet.meetUrl.trim()) return;

    setMeetSubmitting(true);
    try {
      const res = await fetch("/api/portal/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_meeting",
          ...newMeet
        })
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage("Google Meet link published successfully!");
        setTimeout(() => setActionMessage(null), 4000);
        setNewMeet({
          course: "Fitness",
          batch: officialBatches[0],
          title: "",
          meetUrl: "",
          scheduledTime: "Daily Class",
          instructor: "Head Coach"
        });
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setMeetSubmitting(false);
    }
  };

  const handleDeleteMeet = async (meetingId: string) => {
    if (!confirm("Delete this Google Meet link?")) return;
    try {
      await fetch("/api/portal/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_meeting", meetingId })
      });
      loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideo.title.trim() || !newVideo.youtubeUrl.trim()) return;

    setVideoSubmitting(true);
    try {
      const res = await fetch("/api/portal/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_video",
          ...newVideo
        })
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage("YouTube training video added!");
        setTimeout(() => setActionMessage(null), 4000);
        setNewVideo({
          youtubeUrl: "",
          title: "",
          course: "Fitness",
          category: "Foundations",
          description: ""
        });
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setVideoSubmitting(false);
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm("Delete this video lesson?")) return;
    try {
      await fetch("/api/portal/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_video", videoId })
      });
      loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendReply = async (e: React.FormEvent, customQuickText?: string) => {
    if (e) e.preventDefault();
    const textToSend = (customQuickText || replyText).trim();
    if (!textToSend || !selectedStudentId) return;

    setMessageSending(true);
    try {
      const res = await fetch("/api/portal/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudentId,
          sender: "admin",
          text: textToSend
        })
      });
      const data = await res.json();
      if (data.success && data.message) {
        setMessages((prev) => [...prev, data.message]);
        setReplyText("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setMessageSending(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("vajra_admin_session");
    router.push("/portal?tab=admin");
  };

  const pendingStudents = students.filter((s) => s.status === "PENDING");
  const approvedStudents = students.filter((s) => s.status === "APPROVED");

  const displayedStudents = students
    .filter((s) => {
      if (studentFilter === "pending") return s.status === "PENDING";
      if (studentFilter === "approved") return s.status === "APPROVED";
      return true;
    })
    .filter((s) => {
      if (!searchStudent.trim()) return true;
      const q = searchStudent.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.phone.includes(q) ||
        (s.permanentCode && s.permanentCode.toLowerCase().includes(q)) ||
        s.tempCode.toLowerCase().includes(q) ||
        s.course.toLowerCase().includes(q)
      );
    });

  const activeChatStudent = students.find((s) => s.id === selectedStudentId);
  const activeChatMessages = messages.filter((m) => m.studentId === selectedStudentId);

  // Exact matching nav items
  const navItems: PortalNavItem[] = [
    { id: "students", label: "Admissions", badge: pendingStudents.length || undefined },
    { id: "meet", label: "Google Meets", badge: meetings.length || undefined },
    { id: "videos", label: "Videos", badge: videos.length || undefined },
    { id: "messages", label: "Message Desk", badge: messages.length || undefined }
  ];

  if (!adminUser) {
    return (
      <PortalLoadingScreen
        show={true}
        role="admin"
        title="Vajra Master Admin"
        subtitle="Verifying supervisor access credentials..."
      />
    );
  }

  return (
    <>
      {/* Luxury Loading Screen shown when opening portal */}
      <PortalLoadingScreen
        show={pageLoading}
        role="admin"
        title="Vajra Master Admin Desk"
        subtitle="Authenticating Head Coach Privileges • Loading Admissions & Batches..."
      />

      {/* Dedicated Portal Floating Navbar (Matching Website Navbar Style Exactly) */}
      <PortalNavbar
        role="admin"
        navItems={navItems}
        activeNavId={activeTab}
        onNavChange={(id) => setActiveTab(id as typeof activeTab)}
        user={{
          name: adminProfile.name || adminUser?.name || "Master Coach",
          roleName: "Super Admin",
          badgeCode: "HEAD COACH",
          avatarLetter: adminProfile.avatarLetter || "A"
        }}
        onLogout={handleLogout}
        onProfileClick={() => setIsProfileOpen(true)}
      />

      {/* Admin Profile & Security Modal (Triggered by clicking A in Navbar) */}
      <AdminProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        adminProfile={adminProfile}
        onProfileUpdated={(updated) => {
          setAdminProfile(updated);
          setAdminUser((prev) => (prev ? { ...prev, name: updated.name } : null));
          const saved = localStorage.getItem("vajra_admin_session");
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              parsed.name = updated.name;
              localStorage.setItem("vajra_admin_session", JSON.stringify(parsed));
            } catch {}
          }
        }}
        onLogout={handleLogout}
        totalStudents={students.length}
        approvedStudents={approvedStudents.length}
      />

      {/* Main Admin Page Content - SEAMLESS CANVAS (NO HEAVY BOXES) */}
      <main className="min-h-screen bg-background text-coffee-dark pt-24 sm:pt-28 pb-16 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Top Admin Header - Sits directly on background without chunky boxes */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-coffee-dark/10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="inline-flex items-center gap-2 text-[9.5px] font-mono font-bold uppercase tracking-[0.3em] text-cappuccino">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Head Coach Console • Vajra Virtual Studio</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(true)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-coffee-dark/5 hover:bg-cappuccino hover:text-coffee-dark text-coffee-dark/80 text-[9.5px] font-bold uppercase tracking-wider transition-all cursor-pointer border border-coffee-dark/10"
                  title="Click to open Admin Profile & Password Settings"
                >
                  <KeyRound size={11} className="text-cappuccino" />
                  <span>Profile &amp; Password</span>
                </button>
              </div>
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-coffee-dark tracking-tight leading-none">
                Admissions &amp; Batch Operations
              </h1>
              <p className="text-xs sm:text-sm text-coffee-dark/65 font-light max-w-xl leading-relaxed pt-0.5">
                Approve new admissions, issue official permanent codes, broadcast live Google Meet classrooms, and manage student training inquiries.
              </p>
            </div>

            {/* Clean inline stat counters separated by hairlines - NO BOXES */}
            <div className="flex items-center gap-5 sm:gap-7 shrink-0 pt-2 md:pt-0">
              <div className="text-left">
                <span className="text-[9px] uppercase tracking-wider text-coffee-dark/50 font-bold block">Pending</span>
                <p className="font-mono font-bold text-lg sm:text-xl text-amber-600 mt-0.5">
                  {pendingStudents.length}
                </p>
              </div>
              <div className="h-8 w-[1px] bg-coffee-dark/15" />
              <div className="text-left">
                <span className="text-[9px] uppercase tracking-wider text-coffee-dark/50 font-bold block">Enrolled</span>
                <p className="font-mono font-bold text-lg sm:text-xl text-emerald-600 mt-0.5">
                  {approvedStudents.length}
                </p>
              </div>
              <div className="h-8 w-[1px] bg-coffee-dark/15" />
              <div className="text-left">
                <span className="text-[9px] uppercase tracking-wider text-coffee-dark/50 font-bold block">Live Rooms</span>
                <p className="font-mono font-bold text-lg sm:text-xl text-cappuccino mt-0.5">
                  {meetings.length}
                </p>
              </div>
            </div>
          </div>

          {/* Action Message Toast */}
          {actionMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-2xl bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} />
                <span>{actionMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setActionMessage(null)}
                className="text-emerald-400 hover:text-white text-sm cursor-pointer"
              >
                &times;
              </button>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* TAB 1: STUDENT ADMISSIONS & DIRECTORY (SEAMLESS EDITORIAL TABLE)           */}
          {/* ========================================================================= */}
          {activeTab === "students" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Filter Pills & Search Bar - Blends with background */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-coffee-dark/10">
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setStudentFilter("pending")}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5",
                      studentFilter === "pending"
                        ? "bg-coffee-dark text-cappuccino shadow-sm"
                        : "text-coffee-dark/70 hover:text-coffee-dark hover:bg-coffee-dark/5"
                    )}
                  >
                    <Clock size={13} />
                    <span>Pending ({pendingStudents.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStudentFilter("approved")}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer",
                      studentFilter === "approved"
                        ? "bg-coffee-dark text-cappuccino shadow-sm"
                        : "text-coffee-dark/70 hover:text-coffee-dark hover:bg-coffee-dark/5"
                    )}
                  >
                    <CheckCircle2 size={13} />
                    <span>Enrolled ({approvedStudents.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStudentFilter("all")}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer",
                      studentFilter === "all"
                        ? "bg-coffee-dark text-cappuccino shadow-sm"
                        : "text-coffee-dark/70 hover:text-coffee-dark hover:bg-coffee-dark/5"
                    )}
                  >
                    All ({students.length})
                  </button>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee-dark/40" />
                  <input
                    type="text"
                    value={searchStudent}
                    onChange={(e) => setSearchStudent(e.target.value)}
                    placeholder="Search name, phone, code..."
                    className="w-full bg-transparent border-b border-coffee-dark/20 focus:border-cappuccino text-coffee-dark pl-9 pr-2 py-1 text-xs outline-none placeholder:text-coffee-dark/40 transition-colors"
                  />
                </div>
              </div>

              {/* Students List - Clean borderless rows with hairlines */}
              {displayedStudents.length === 0 ? (
                <div className="py-16 text-center text-coffee-dark/50 space-y-2">
                  <Users size={32} className="mx-auto text-coffee-dark/30" />
                  <p className="text-sm font-bold text-coffee-dark">No student records found</p>
                  <p className="text-xs text-coffee-dark/60">
                    {studentFilter === "pending"
                      ? "Zero pending enrollment requests."
                      : "No matching student profiles."}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-coffee-dark/10">
                  {displayedStudents.map((std) => {
                    const isPending = std.status === "PENDING";
                    return (
                      <div
                        key={std.id}
                        className="py-5 sm:py-6 transition-colors hover:bg-coffee-dark/[0.02] -mx-3 px-3 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                      >
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-base sm:text-lg font-serif font-bold text-coffee-dark">
                              {std.name}
                            </h3>

                            {isPending ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                <Clock size={11} />
                                <span>Pending Approval</span>
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                <CheckCircle2 size={11} />
                                <span>ID: <strong className="font-mono">{std.permanentCode}</strong></span>
                              </span>
                            )}

                            <span className="text-[11px] text-coffee-dark/50 font-mono">
                              Temp: {std.tempCode}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                            <div>
                              <span className="block text-[9px] uppercase tracking-wider text-coffee-dark/50 font-semibold">
                                Discipline
                              </span>
                              <strong className="text-cappuccino font-medium">{std.course}</strong>
                            </div>
                            <div>
                              <span className="block text-[9px] uppercase tracking-wider text-coffee-dark/50 font-semibold">
                                Batch Slot
                              </span>
                              <span className="text-coffee-dark/80">{std.batch}</span>
                            </div>
                            <div>
                              <span className="block text-[9px] uppercase tracking-wider text-coffee-dark/50 font-semibold">
                                WhatsApp Phone
                              </span>
                              <a
                                href={`tel:${std.phone}`}
                                className="text-coffee-dark hover:text-cappuccino font-mono font-medium"
                              >
                                +91 {std.phone}
                              </a>
                            </div>
                            <div>
                              <span className="block text-[9px] uppercase tracking-wider text-coffee-dark/50 font-semibold">
                                Location / Age
                              </span>
                              <span className="text-coffee-dark/80">
                                {std.city || "Ariyalur"} • {std.age || "N/A"} yrs
                              </span>
                            </div>
                          </div>

                          {std.notes && (
                            <p className="text-xs italic text-coffee-dark/65 pt-0.5">
                              &ldquo;{std.notes}&rdquo;
                            </p>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2.5 shrink-0 pt-2 lg:pt-0">
                          {isPending ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApproveStudent(std.id)}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-full shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                              >
                                <CheckCircle2 size={14} />
                                <span>Approve &amp; Assign ID</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleRejectStudent(std.id)}
                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors cursor-pointer"
                                title="Reject enrollment"
                              >
                                <XCircle size={17} />
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedStudentId(std.id);
                                setActiveTab("messages");
                              }}
                              className="px-4 py-2 bg-coffee-dark hover:bg-cappuccino text-white hover:text-coffee-dark font-bold text-xs uppercase tracking-wider rounded-full transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                            >
                              <MessageSquare size={13} />
                              <span>Open Doubt Chat</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: GOOGLE MEET SCHEDULER (SEAMLESS FORM & ROOMS LIST)                 */}
          {/* ========================================================================= */}
          {activeTab === "meet" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-10"
            >
              {/* Seamless Form - Integrates with page background */}
              <div className="space-y-4 pb-8 border-b border-coffee-dark/10">
                <div className="space-y-1">
                  <h3 className="text-xl font-serif font-bold text-coffee-dark">
                    Publish Live Google Meet Link
                  </h3>
                  <p className="text-xs text-coffee-dark/65 font-light">
                    Targeted course &amp; batch students will see this room link in their personal classroom dashboard.
                  </p>
                </div>

                <form onSubmit={handleAddMeet} className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-coffee-dark/60 font-bold block mb-1">
                        Discipline Course
                      </label>
                      <select
                        value={newMeet.course}
                        onChange={(e) => setNewMeet({ ...newMeet, course: e.target.value })}
                        className="w-full bg-white/60 focus:bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 py-2 text-xs focus:outline-none cursor-pointer transition-colors shadow-sm"
                      >
                        {courseOptions.filter((c) => c !== "All Courses").map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-coffee-dark/60 font-bold block mb-1">
                        Target Batch Slot
                      </label>
                      <select
                        value={newMeet.batch}
                        onChange={(e) => setNewMeet({ ...newMeet, batch: e.target.value })}
                        className="w-full bg-white/60 focus:bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 py-2 text-xs focus:outline-none cursor-pointer transition-colors shadow-sm"
                      >
                        {officialBatches.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-coffee-dark/60 font-bold block mb-1">
                        Class Topic / Title
                      </label>
                      <input
                        type="text"
                        value={newMeet.title}
                        onChange={(e) => setNewMeet({ ...newMeet, title: e.target.value })}
                        placeholder="e.g. Silambam Kaalvari Stances & Basic Spin"
                        className="w-full bg-white/60 focus:bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 py-2 text-xs focus:outline-none transition-colors shadow-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-coffee-dark/60 font-bold block mb-1">
                        Google Meet URL (https://meet.google.com/...)
                      </label>
                      <input
                        type="url"
                        value={newMeet.meetUrl}
                        onChange={(e) => setNewMeet({ ...newMeet, meetUrl: e.target.value })}
                        placeholder="https://meet.google.com/xyz-abcd-efg"
                        className="w-full bg-white/60 focus:bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 py-2 text-xs focus:outline-none transition-colors shadow-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={meetSubmitting}
                      className="px-6 py-2.5 bg-coffee-dark hover:bg-cappuccino text-white hover:text-coffee-dark font-bold text-xs uppercase tracking-wider rounded-full transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      <Radio size={14} />
                      <span>Publish Google Meet Link</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Scheduled Classrooms List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-lg font-bold text-coffee-dark">
                    Active &amp; Scheduled Class Rooms ({meetings.length})
                  </h4>
                  <span className="text-[10px] uppercase tracking-wider text-coffee-dark/50 font-mono">
                    Updated Daily
                  </span>
                </div>

                <div className="divide-y divide-coffee-dark/10">
                  {meetings.map((meet) => (
                    <div
                      key={meet.id}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-coffee-dark/[0.02] -mx-2 px-2 rounded-xl transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-cappuccino/15 text-coffee-dark text-[9px] font-bold uppercase tracking-wider">
                            {meet.course}
                          </span>
                          <span className="text-xs text-coffee-dark/60 font-medium">
                            {meet.batch}
                          </span>
                        </div>
                        <h5 className="font-bold text-sm text-coffee-dark">{meet.title}</h5>
                        <a
                          href={meet.meetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-emerald-700 hover:underline font-mono truncate block"
                        >
                          {meet.meetUrl}
                        </a>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0">
                        <a
                          href={meet.meetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-full bg-coffee-dark/5 hover:bg-coffee-dark hover:text-white text-coffee-dark text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                          <span>Test Room</span>
                          <ExternalLink size={12} />
                        </a>

                        <button
                          type="button"
                          onClick={() => handleDeleteMeet(meet.id)}
                          className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-full transition-colors cursor-pointer"
                          title="Delete Meet link"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: VIDEOS UPLOAD & MANAGEMENT (SEAMLESS TILES)                       */}
          {/* ========================================================================= */}
          {activeTab === "videos" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-10"
            >
              {/* Seamless Upload Video Form */}
              <div className="space-y-4 pb-8 border-b border-coffee-dark/10">
                <div className="space-y-1">
                  <h3 className="text-xl font-serif font-bold text-coffee-dark">
                    Upload Recorded YouTube Video Lesson
                  </h3>
                  <p className="text-xs text-coffee-dark/65 font-light">
                    Paste any YouTube lesson URL to make it directly available in student archives.
                  </p>
                </div>

                <form onSubmit={handleAddVideo} className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-coffee-dark/60 font-bold block mb-1">
                        YouTube Video Link or ID
                      </label>
                      <input
                        type="text"
                        value={newVideo.youtubeUrl}
                        onChange={(e) => setNewVideo({ ...newVideo, youtubeUrl: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=... or ID"
                        className="w-full bg-white/60 focus:bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 py-2 text-xs focus:outline-none transition-colors shadow-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-coffee-dark/60 font-bold block mb-1">
                        Video Lesson Title
                      </label>
                      <input
                        type="text"
                        value={newVideo.title}
                        onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                        placeholder="e.g. Silambam Kaalvari Stances & Basic Spin"
                        className="w-full bg-white/60 focus:bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 py-2 text-xs focus:outline-none transition-colors shadow-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-coffee-dark/60 font-bold block mb-1">
                        Target Course
                      </label>
                      <select
                        value={newVideo.course}
                        onChange={(e) => setNewVideo({ ...newVideo, course: e.target.value })}
                        className="w-full bg-white/60 focus:bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 py-2 text-xs focus:outline-none cursor-pointer transition-colors shadow-sm"
                      >
                        {courseOptions.filter((c) => c !== "All Courses").map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-coffee-dark/60 font-bold block mb-1">
                        Category / Module
                      </label>
                      <input
                        type="text"
                        value={newVideo.category}
                        onChange={(e) => setNewVideo({ ...newVideo, category: e.target.value })}
                        placeholder="e.g. Foundational Stances"
                        className="w-full bg-white/60 focus:bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 py-2 text-xs focus:outline-none transition-colors shadow-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-coffee-dark/60 font-bold block mb-1">
                      Lesson Guidance &amp; Instructions
                    </label>
                    <textarea
                      rows={2}
                      value={newVideo.description}
                      onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                      placeholder="Instructions for students to practice after class..."
                      className="w-full bg-white/60 focus:bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 py-2 text-xs focus:outline-none transition-colors shadow-sm resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={videoSubmitting}
                      className="px-6 py-2.5 bg-coffee-dark hover:bg-cappuccino text-white hover:text-coffee-dark font-bold text-xs uppercase tracking-wider rounded-full transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      <Plus size={14} />
                      <span>Upload Video Lesson</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Videos Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-lg font-bold text-coffee-dark">
                    Uploaded Video Library ({videos.length})
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((vid) => (
                    <div
                      key={vid.id}
                      className="group flex flex-col justify-between space-y-2.5 transition-all"
                    >
                      <div className="relative aspect-video rounded-2xl overflow-hidden bg-coffee-dark shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://img.youtube.com/vi/${vid.youtubeId}/mqdefault.jpg`}
                          alt={vid.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2.5 left-2.5 bg-coffee-dark/85 backdrop-blur-sm text-cappuccino px-2.5 py-0.5 rounded-full text-[8.5px] font-bold uppercase tracking-wider">
                          {vid.course}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[9px] uppercase tracking-wider text-cappuccino font-bold block">
                          {vid.category}
                        </span>
                        <h5 className="font-serif font-bold text-sm text-coffee-dark line-clamp-1 leading-tight">
                          {vid.title}
                        </h5>
                        {vid.description && (
                          <p className="text-xs text-coffee-dark/70 line-clamp-2 font-light">
                            {vid.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-2 flex items-center justify-between text-xs">
                        <a
                          href={`https://www.youtube.com/watch?v=${vid.youtubeId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-coffee-dark hover:text-cappuccino flex items-center gap-1 transition-colors"
                        >
                          <Play size={12} fill="currentColor" />
                          <span>Watch on YouTube</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => handleDeleteVideo(vid.id)}
                          className="p-1 text-red-500 hover:bg-red-500/10 rounded-full transition-colors cursor-pointer"
                          title="Delete Video"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: MESSAGE SYSTEM (WHATSAPP-STYLE COMMUNICATION DESK)                 */}
          {/* ========================================================================= */}
          {activeTab === "messages" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/70 backdrop-blur-md rounded-3xl border border-coffee-dark/10 shadow-sm overflow-hidden h-[600px] grid grid-cols-1 md:grid-cols-3"
            >
              {/* Left Column: Students List */}
              <div className="border-r border-coffee-dark/10 flex flex-col h-full bg-white/40">
                <div className="p-4 border-b border-coffee-dark/10">
                  <h4 className="font-serif font-bold text-sm text-coffee-dark flex items-center gap-2">
                    <MessageSquare size={14} className="text-cappuccino" />
                    <span>Student Doubts</span>
                  </h4>
                  <p className="text-[10px] text-coffee-dark/50 mt-0.5">Select an enrolled student to message</p>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-coffee-dark/5">
                  {students.filter((s) => s.status === "APPROVED").length === 0 ? (
                    <div className="p-6 text-center text-coffee-dark/40 text-xs space-y-1">
                      <p>No enrolled students yet.</p>
                      <p className="text-[10px]">Approved students will appear here for direct feedback.</p>
                    </div>
                  ) : (
                    students
                      .filter((s) => s.status === "APPROVED")
                      .map((std) => {
                        const isSelected = selectedStudentId === std.id;
                        const lastMsg = messages
                          .filter((m) => m.studentId === std.id)
                          .slice(-1)[0];

                        return (
                          <div
                            key={std.id}
                            onClick={() => setSelectedStudentId(std.id)}
                            className={cn(
                              "p-3 transition-all cursor-pointer flex items-center gap-3",
                              isSelected
                                ? "bg-cappuccino/15 border-l-4 border-cappuccino"
                                : "hover:bg-coffee-dark/[0.02]"
                            )}
                          >
                            <div className="w-9 h-9 rounded-full bg-coffee-dark text-cappuccino font-serif font-bold flex items-center justify-center text-xs shrink-0">
                              {std.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <h5 className="font-bold text-xs text-coffee-dark truncate">{std.name}</h5>
                                <span className="text-[8.5px] text-coffee-dark/50 font-mono">
                                  {std.permanentCode}
                                </span>
                              </div>
                              <p className="text-[10px] text-cappuccino font-medium truncate">{std.course}</p>
                              {lastMsg && (
                                <p className="text-[9.5px] text-coffee-dark/60 truncate mt-0.5">
                                  {lastMsg.sender === "admin" ? "You: " : ""}{lastMsg.text}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>

              {/* Right Column: Active Conversation */}
              <div className="col-span-1 md:col-span-2 flex flex-col h-full bg-background/50">
                {activeChatStudent ? (
                  <>
                    <div className="p-3.5 bg-white/70 border-b border-coffee-dark/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-coffee-dark text-cappuccino font-serif font-bold flex items-center justify-center shrink-0">
                          {activeChatStudent.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-sm text-coffee-dark flex items-center gap-2">
                            <span>{activeChatStudent.name}</span>
                            <span className="text-[9.5px] font-mono text-cappuccino font-bold">
                              ({activeChatStudent.permanentCode})
                            </span>
                          </h4>
                          <p className="text-[10px] text-coffee-dark/60">
                            {activeChatStudent.course} • Batch: {activeChatStudent.batch}
                          </p>
                        </div>
                      </div>

                      <a
                        href={`https://wa.me/91${activeChatStudent.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-full bg-[#25D366]/15 border border-[#25D366]/30 text-emerald-800 text-xs font-bold hover:bg-[#25D366] hover:text-black transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Phone size={12} />
                        <span>WhatsApp App</span>
                      </a>
                    </div>

                    <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3">
                      {activeChatMessages.length === 0 ? (
                        <div className="text-center py-20 text-coffee-dark/40 space-y-1">
                          <MessageSquare size={30} className="mx-auto text-cappuccino/60" />
                          <p className="text-xs sm:text-sm font-medium text-coffee-dark">No messages yet with {activeChatStudent.name}.</p>
                          <p className="text-[11px]">Type instructions or posture feedback below.</p>
                        </div>
                      ) : (
                        activeChatMessages.map((msg) => {
                          const isAdmin = msg.sender === "admin";
                          return (
                            <div
                              key={msg.id}
                              className={cn("flex", isAdmin ? "justify-end" : "justify-start")}
                            >
                              <div
                                className={cn(
                                  "max-w-[85%] sm:max-w-[70%] p-3 rounded-2xl text-xs leading-relaxed shadow-sm",
                                  isAdmin
                                    ? "bg-coffee-dark text-white rounded-tr-none"
                                    : "bg-white text-coffee-dark border border-coffee-dark/10 rounded-tl-none"
                                )}
                              >
                                {!isAdmin && (
                                  <span className="text-[10px] font-bold text-cappuccino block mb-0.5">
                                    {activeChatStudent.name}
                                  </span>
                                )}
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                                <div
                                  className={cn(
                                    "flex items-center justify-end gap-1 text-[9px] mt-1.5",
                                    isAdmin ? "text-white/60" : "text-coffee-dark/50"
                                  )}
                                >
                                  <span>
                                    {new Date(msg.timestamp).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit"
                                    })}
                                  </span>
                                  {isAdmin && <CheckCheck size={13} className="text-[#53bdeb]" />}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                      <div ref={chatScrollRef} />
                    </div>

                    <form
                      onSubmit={handleSendReply}
                      className="p-3 bg-white/80 border-t border-coffee-dark/10 flex items-center gap-2"
                    >
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={`Reply to ${activeChatStudent.name}...`}
                        className="flex-1 bg-background/80 border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-full px-4 py-2 text-xs focus:outline-none transition-colors"
                      />
                      <button
                        type="submit"
                        disabled={messageSending || !replyText.trim()}
                        className="w-9 h-9 rounded-full bg-coffee-dark hover:bg-cappuccino text-white hover:text-coffee-dark flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer shrink-0 shadow-sm active:scale-95 font-bold"
                      >
                        <Send size={14} />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-coffee-dark/40 text-xs">
                    Select a student from the left panel to begin chat.
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </>
  );
}
