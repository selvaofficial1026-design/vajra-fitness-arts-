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
  Zap,
  Flame,
  MapPin
} from "lucide-react";
import { Student, ClassMeeting, VideoClass, ChatMessage, extractYoutubeId } from "@/lib/portalStore";
import PortalDashboardLayout, { NavItem } from "@/components/portal/PortalDashboardLayout";

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
  const [searchQuery, setSearchQuery] = useState("");

  // Admin Data State
  const [students, setStudents] = useState<Student[]>([]);
  const [meetings, setMeetings] = useState<ClassMeeting[]>([]);
  const [videos, setVideos] = useState<VideoClass[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Student Sub-Tab: Pending vs Enrolled
  const [studentFilter, setStudentFilter] = useState<"pending" | "approved" | "all">("pending");

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

  // Check admin session
  useEffect(() => {
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

        // Default selected student for chat if none selected
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

  // Auto-refresh chat and student requests every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadAdminData();
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom of active chat
  useEffect(() => {
    if (activeTab === "messages") {
      chatScrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedStudentId, activeTab]);

  // Handle Approve Student
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

  // Handle Reject Student
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

  // Handle Add Google Meet Link
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

  // Handle Delete Meet Link
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

  // Handle Add Video
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

  // Handle Delete Video
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

  // Handle Admin Send Reply in Chat
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

  // Filter students based on sub-tab and search query
  const displayedStudents = students
    .filter((s) => {
      if (studentFilter === "pending") return s.status === "PENDING";
      if (studentFilter === "approved") return s.status === "APPROVED";
      return true;
    })
    .filter((s) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.phone.includes(q) ||
        (s.permanentCode && s.permanentCode.toLowerCase().includes(q)) ||
        s.tempCode.toLowerCase().includes(q) ||
        s.course.toLowerCase().includes(q) ||
        (s.city && s.city.toLowerCase().includes(q))
      );
    });

  const activeChatStudent = students.find((s) => s.id === selectedStudentId);
  const activeChatMessages = messages.filter((m) => m.studentId === selectedStudentId);

  // Navigation Items
  const navItems: NavItem[] = [
    { id: "students", label: "Admissions Desk", icon: Users, badge: pendingStudents.length || undefined },
    { id: "meet", label: "Google Meets", icon: Radio, badge: meetings.length || undefined },
    { id: "videos", label: "Video Library", icon: Video, badge: videos.length || undefined },
    { id: "messages", label: "Coach Messages", icon: MessageSquare, badge: messages.length || undefined }
  ];

  const tabTitles: Record<string, string> = {
    students: "Student Admissions & Directory Desk",
    meet: "Live Google Meet Classroom Scheduler",
    videos: "YouTube Training Video Management",
    messages: "Student Doubts & Stance Feedback Desk"
  };

  const breadcrumbs = [
    { label: "Vajra Portal", href: "/portal" },
    { label: "Admin Console", href: "/portal/admin" },
    { label: navItems.find((n) => n.id === activeTab)?.label || "Dashboard" }
  ];

  // Right Admin Widget (Matching reference image architecture, styled in Vajra's brand theme)
  const rightAdminWidget = (
    <div className="bg-white rounded-3xl border border-cream shadow-premium p-6 space-y-6 text-coffee-dark text-center">
      {/* Circular Avatar with Progress Ring */}
      <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" className="stroke-[#EDE4D8]" strokeWidth="6" fill="transparent" />
          <circle
            cx="50"
            cy="50"
            r="44"
            className="stroke-cappuccino"
            strokeWidth="6"
            strokeDasharray={276}
            strokeDashoffset={0}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Inner Logo Badge */}
        <div className="absolute inset-2 rounded-full bg-[#241A1A] border-2 border-cappuccino/60 flex items-center justify-center p-2.5 shadow-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo_gold.jpeg"
            alt="Vajra Emblem"
            className="w-full h-full object-contain rounded-full"
          />
        </div>

        {/* Verified Admin Shield */}
        <span className="absolute bottom-1 right-1 bg-cappuccino text-coffee-dark p-1 rounded-full border-2 border-white shadow-sm" title="Master Administrator">
          <ShieldCheck size={14} />
        </span>
      </div>

      {/* Admin Name & Role */}
      <div className="space-y-1">
        <h3 className="font-serif font-bold text-lg text-coffee-dark truncate">
          {adminUser?.name || "Vajra Master Admin"}
        </h3>
        <p className="text-xs text-cappuccino font-semibold tracking-wide">
          Lead Instructor &amp; Academy Director
        </p>
        <div className="pt-1">
          <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px] uppercase tracking-wider border border-emerald-300">
            Active Supervisor
          </span>
        </div>
      </div>

      {/* Stats Counter Boxes (Matching Reference Image) */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-cream">
        <div className="p-2.5 rounded-2xl bg-[#FAF7F2] border border-cream text-center">
          <span className="text-[9.5px] uppercase tracking-wider text-coffee-dark/50 font-bold block">
            Pending
          </span>
          <p className="font-mono font-bold text-base text-amber-600 mt-0.5">
            {pendingStudents.length}
          </p>
        </div>

        <div className="p-2.5 rounded-2xl bg-[#FAF7F2] border border-cream text-center">
          <span className="text-[9.5px] uppercase tracking-wider text-coffee-dark/50 font-bold block">
            Approved
          </span>
          <p className="font-mono font-bold text-base text-emerald-600 mt-0.5">
            {approvedStudents.length}
          </p>
        </div>
      </div>

      {/* Contact & Control Information */}
      <div className="space-y-2.5 text-left text-xs border-t border-cream pt-4">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-[#FAF7F2] border border-cream">
          <div className="w-7 h-7 rounded-lg bg-cappuccino/15 text-cappuccino flex items-center justify-center shrink-0">
            <Phone size={13} />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[9px] uppercase tracking-wider text-coffee-dark/50 font-semibold block">Academy Line</span>
            <p className="font-mono font-bold text-coffee-dark text-[11px] truncate">+91 87789 31958</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2 rounded-xl bg-[#FAF7F2] border border-cream">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
            <Radio size={13} />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[9px] uppercase tracking-wider text-coffee-dark/50 font-semibold block">Scheduled Meets</span>
            <p className="font-bold text-coffee-dark text-[11px] truncate">{meetings.length} Active Links</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2 rounded-xl bg-[#FAF7F2] border border-cream">
          <div className="w-7 h-7 rounded-lg bg-cappuccino/15 text-cappuccino flex items-center justify-center shrink-0">
            <Award size={13} />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[9px] uppercase tracking-wider text-coffee-dark/50 font-semibold block">Batches</span>
            <p className="font-bold text-coffee-dark text-[11px] truncate">6 Daily Slots</p>
          </div>
        </div>
      </div>

      {/* 3 Circular System Gauges (Bottom Right Gauges from Reference Image) */}
      <div className="border-t border-cream pt-4 space-y-2">
        <span className="text-[9.5px] uppercase tracking-widest text-coffee-dark/40 font-bold block">
          Portal Health &amp; Response
        </span>

        <div className="grid grid-cols-3 gap-2 pt-1">
          {/* Gauge 1: Approval Rate */}
          <div className="flex flex-col items-center">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" stroke="#EDE4D8" strokeWidth="3" fill="none" />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  stroke="#C8955F"
                  strokeWidth="3"
                  strokeDasharray="88"
                  strokeDashoffset={88 * (1 - 0.94)}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <span className="absolute text-[9px] font-bold text-coffee-dark font-mono">94%</span>
            </div>
            <span className="text-[8.5px] uppercase tracking-wider text-coffee-dark/70 font-semibold mt-1">
              Admissions
            </span>
          </div>

          {/* Gauge 2: Batch Coverage */}
          <div className="flex flex-col items-center">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" stroke="#EDE4D8" strokeWidth="3" fill="none" />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  stroke="#DDA922"
                  strokeWidth="3"
                  strokeDasharray="88"
                  strokeDashoffset={0}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <span className="absolute text-[9px] font-bold text-coffee-dark font-mono">100%</span>
            </div>
            <span className="text-[8.5px] uppercase tracking-wider text-coffee-dark/70 font-semibold mt-1">
              Batches
            </span>
          </div>

          {/* Gauge 3: Response Rate */}
          <div className="flex flex-col items-center">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" stroke="#EDE4D8" strokeWidth="3" fill="none" />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  stroke="#10B981"
                  strokeWidth="3"
                  strokeDasharray="88"
                  strokeDashoffset={88 * (1 - 0.98)}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <span className="absolute text-[9px] font-bold text-coffee-dark font-mono">98%</span>
            </div>
            <span className="text-[8.5px] uppercase tracking-wider text-coffee-dark/70 font-semibold mt-1">
              Response
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => loadAdminData()}
          className="w-full py-2.5 px-4 rounded-xl bg-[#241A1A] hover:bg-[#1A1212] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer border border-cappuccino/40"
        >
          <RefreshCw size={14} className="text-cappuccino" />
          <span>Refresh Records</span>
        </button>
      </div>
    </div>
  );

  return (
    <PortalDashboardLayout
      role="admin"
      title={tabTitles[activeTab]}
      subtitle="Head Coach Control Center &amp; Admissions Desk"
      breadcrumbs={breadcrumbs}
      navItems={navItems}
      activeNavId={activeTab}
      onNavChange={(id) => setActiveTab(id as typeof activeTab)}
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="Search student name, phone, or code..."
      user={{
        name: adminUser?.name || "Master Coach",
        roleName: "Super Admin",
        badgeCode: "HEAD COACH",
        avatarLetter: "A",
        phone: "8778931958",
        courseOrBatch: "6 Batches"
      }}
      onLogout={handleLogout}
      notificationsCount={pendingStudents.length}
      messagesCount={messages.length}
      rightWidget={rightAdminWidget}
    >
      <div className="space-y-6">
        {/* Global Toast Message */}
        {actionMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-emerald-950 text-emerald-300 border border-emerald-500/50 shadow-lg text-xs font-bold flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} />
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

        {/* Tab 1: STUDENT ADMISSIONS & DIRECTORY */}
        {activeTab === "students" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Filter Pills */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-cream shadow-premium flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setStudentFilter("pending")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                    studentFilter === "pending"
                      ? "bg-amber-500 text-black shadow-md"
                      : "bg-[#FAF7F2] text-coffee-dark/70 hover:bg-cream border border-cream"
                  }`}
                >
                  <Clock size={14} />
                  <span>Pending Requests ({pendingStudents.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStudentFilter("approved")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                    studentFilter === "approved"
                      ? "bg-emerald-600 text-white shadow-md"
                      : "bg-[#FAF7F2] text-coffee-dark/70 hover:bg-cream border border-cream"
                  }`}
                >
                  <CheckCircle2 size={14} />
                  <span>Enrolled Students ({approvedStudents.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStudentFilter("all")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    studentFilter === "all"
                      ? "bg-[#241A1A] text-white"
                      : "bg-[#FAF7F2] text-coffee-dark/70 hover:bg-cream border border-cream"
                  }`}
                >
                  All ({students.length})
                </button>
              </div>

              <span className="text-xs text-coffee-dark/60 font-mono">
                Showing: <strong>{displayedStudents.length}</strong> records
              </span>
            </div>

            {/* Students List */}
            {displayedStudents.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-cream text-center shadow-premium space-y-2">
                <Users size={36} className="mx-auto text-coffee-dark/30" />
                <p className="text-sm font-bold text-coffee-dark">No student records found</p>
                <p className="text-xs text-coffee-dark/60">
                  {studentFilter === "pending"
                    ? "Zero pending enrollment requests."
                    : "No matching student profiles."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {displayedStudents.map((std) => {
                  const isPending = std.status === "PENDING";
                  return (
                    <div
                      key={std.id}
                      className={`p-5 rounded-3xl border transition-all ${
                        isPending
                          ? "bg-[#241A1A] text-white border-amber-500/40 shadow-xl"
                          : "bg-white text-coffee-dark border-cream shadow-premium hover:border-cappuccino/40"
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-lg font-bold font-serif">{std.name}</h3>

                            {isPending ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500 text-amber-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                <Clock size={12} />
                                <span>Pending Approval</span>
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                <CheckCircle2 size={12} />
                                <span>Permanent: <strong className="font-mono">{std.permanentCode}</strong></span>
                              </span>
                            )}

                            <span className="text-[11px] opacity-60 font-mono">
                              Temp: {std.tempCode}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs opacity-80 pt-1">
                            <div>
                              <span className="block text-[9px] uppercase tracking-wider opacity-60 font-semibold">Discipline</span>
                              <strong className="text-cappuccino">{std.course}</strong>
                            </div>
                            <div>
                              <span className="block text-[9px] uppercase tracking-wider opacity-60 font-semibold">Batch Slot</span>
                              <span>{std.batch}</span>
                            </div>
                            <div>
                              <span className="block text-[9px] uppercase tracking-wider opacity-60 font-semibold">WhatsApp</span>
                              <a href={`tel:${std.phone}`} className="text-cappuccino hover:underline font-mono">
                                +91 {std.phone}
                              </a>
                            </div>
                            <div>
                              <span className="block text-[9px] uppercase tracking-wider opacity-60 font-semibold">Location / Age</span>
                              <span>{std.city || "Ariyalur"} • {std.age || "N/A"} yrs</span>
                            </div>
                          </div>

                          {std.notes && (
                            <p className="text-xs italic opacity-75 pt-1">
                              &ldquo;{std.notes}&rdquo;
                            </p>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/10">
                          {isPending ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApproveStudent(std.id)}
                                className="px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                              >
                                <CheckCircle2 size={15} />
                                <span>Approve &amp; Assign ID</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleRejectStudent(std.id)}
                                className="px-3.5 py-2.5 bg-red-500/20 hover:bg-red-500 hover:text-white text-red-300 border border-red-500/40 rounded-xl text-xs font-bold transition-all cursor-pointer"
                                title="Reject enrollment"
                              >
                                <XCircle size={15} />
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedStudentId(std.id);
                                setActiveTab("messages");
                              }}
                              className="px-4 py-2 bg-[#241A1A] text-cappuccino hover:bg-cappuccino hover:text-coffee-dark border border-cappuccino/40 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
                            >
                              <MessageSquare size={14} />
                              <span>Open Doubt Chat</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Tab 2: GOOGLE MEET SCHEDULER */}
        {activeTab === "meet" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Publish Meet Form */}
            <div className="bg-[#241A1A] text-white p-6 sm:p-8 rounded-3xl border border-cappuccino/30 shadow-2xl space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cappuccino/20 text-cappuccino flex items-center justify-center">
                  <Radio size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-white">Publish Google Meet Classroom Link</h3>
                  <p className="text-xs text-white/60">Students in this course and batch slot will see this active link to join live sessions</p>
                </div>
              </div>

              <form onSubmit={handleAddMeet} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-white/70 font-bold block mb-1">
                      Discipline Course
                    </label>
                    <select
                      value={newMeet.course}
                      onChange={(e) => setNewMeet({ ...newMeet, course: e.target.value })}
                      className="w-full bg-[#191111] border border-white/20 focus:border-cappuccino text-white rounded-xl px-3 py-2.5 text-xs focus:outline-none cursor-pointer"
                    >
                      {courseOptions.filter((c) => c !== "All Courses").map((c) => (
                        <option key={c} value={c} className="bg-[#191111] text-white">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-white/70 font-bold block mb-1">
                      Target Batch Slot
                    </label>
                    <select
                      value={newMeet.batch}
                      onChange={(e) => setNewMeet({ ...newMeet, batch: e.target.value })}
                      className="w-full bg-[#191111] border border-white/20 focus:border-cappuccino text-white rounded-xl px-3 py-2.5 text-xs focus:outline-none cursor-pointer"
                    >
                      {officialBatches.map((b) => (
                        <option key={b} value={b} className="bg-[#191111] text-white">
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-white/70 font-bold block mb-1">
                      Live Class Topic / Title
                    </label>
                    <input
                      type="text"
                      value={newMeet.title}
                      onChange={(e) => setNewMeet({ ...newMeet, title: e.target.value })}
                      placeholder="e.g. Silambam Kaalvari Stances & Basic Spin"
                      className="w-full bg-[#191111] border border-white/20 focus:border-cappuccino text-white rounded-xl px-3 py-2.5 text-xs focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-white/70 font-bold block mb-1">
                      Google Meet URL (https://meet.google.com/...)
                    </label>
                    <input
                      type="url"
                      value={newMeet.meetUrl}
                      onChange={(e) => setNewMeet({ ...newMeet, meetUrl: e.target.value })}
                      placeholder="https://meet.google.com/xyz-abcd-efg"
                      className="w-full bg-[#191111] border border-white/20 focus:border-cappuccino text-white rounded-xl px-3 py-2.5 text-xs focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={meetSubmitting}
                    className="px-7 py-3 bg-[#25D366] text-black font-extrabold text-xs uppercase tracking-wider rounded-full hover:bg-[#20ba5a] transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    <Radio size={15} />
                    <span>Publish Google Meet Link</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Meet Links */}
            <div className="space-y-4">
              <h4 className="font-serif text-lg font-bold text-coffee-dark">
                Active &amp; Scheduled Class Rooms ({meetings.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {meetings.map((meet) => (
                  <div
                    key={meet.id}
                    className="bg-white p-5 rounded-3xl border border-cream shadow-premium space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-cappuccino/20 text-coffee-dark text-[9px] font-bold uppercase tracking-wider">
                          {meet.course}
                        </span>
                        <span className="text-[11px] text-coffee-dark/60 font-medium">
                          {meet.batch}
                        </span>
                      </div>
                      <h5 className="font-bold text-sm text-coffee-dark mb-1">{meet.title}</h5>
                      <a
                        href={meet.meetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#25D366] hover:underline font-mono truncate block"
                      >
                        {meet.meetUrl}
                      </a>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-cream">
                      <a
                        href={meet.meetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-coffee-dark hover:text-cappuccino flex items-center gap-1.5"
                      >
                        <span>Test Link</span>
                        <ExternalLink size={13} />
                      </a>

                      <button
                        type="button"
                        onClick={() => handleDeleteMeet(meet.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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

        {/* Tab 3: YOUTUBE VIDEO MANAGER */}
        {activeTab === "videos" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Upload Video Form */}
            <div className="bg-[#241A1A] text-white p-6 sm:p-8 rounded-3xl border border-cappuccino/30 shadow-2xl space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cappuccino/20 text-cappuccino flex items-center justify-center">
                  <Video size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-white">Upload Training Video (YouTube)</h3>
                  <p className="text-xs text-white/60">Paste any YouTube training lesson URL to publish directly to students</p>
                </div>
              </div>

              <form onSubmit={handleAddVideo} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-white/70 font-bold block mb-1">
                      YouTube Video Link or ID
                    </label>
                    <input
                      type="text"
                      value={newVideo.youtubeUrl}
                      onChange={(e) => setNewVideo({ ...newVideo, youtubeUrl: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=... or ID"
                      className="w-full bg-[#191111] border border-white/20 focus:border-cappuccino text-white rounded-xl px-3 py-2.5 text-xs focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-white/70 font-bold block mb-1">
                      Video Lesson Title
                    </label>
                    <input
                      type="text"
                      value={newVideo.title}
                      onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                      placeholder="e.g. Silambam Kaalvari Stances & Basic Spin"
                      className="w-full bg-[#191111] border border-white/20 focus:border-cappuccino text-white rounded-xl px-3 py-2.5 text-xs focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-white/70 font-bold block mb-1">
                      Target Course
                    </label>
                    <select
                      value={newVideo.course}
                      onChange={(e) => setNewVideo({ ...newVideo, course: e.target.value })}
                      className="w-full bg-[#191111] border border-white/20 focus:border-cappuccino text-white rounded-xl px-3 py-2.5 text-xs focus:outline-none cursor-pointer"
                    >
                      {courseOptions.filter((c) => c !== "All Courses").map((c) => (
                        <option key={c} value={c} className="bg-[#191111] text-white">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-white/70 font-bold block mb-1">
                      Category / Module
                    </label>
                    <input
                      type="text"
                      value={newVideo.category}
                      onChange={(e) => setNewVideo({ ...newVideo, category: e.target.value })}
                      placeholder="e.g. Foundational Stances"
                      className="w-full bg-[#191111] border border-white/20 focus:border-cappuccino text-white rounded-xl px-3 py-2.5 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-white/70 font-bold block mb-1">
                    Lesson Guidance &amp; Instructions
                  </label>
                  <textarea
                    rows={2}
                    value={newVideo.description}
                    onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                    placeholder="Instructions for students to practice after class..."
                    className="w-full bg-[#191111] border border-white/20 focus:border-cappuccino text-white rounded-xl px-3 py-2.5 text-xs focus:outline-none resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={videoSubmitting}
                    className="px-7 py-3 bg-cappuccino text-coffee-dark font-extrabold text-xs uppercase tracking-wider rounded-full hover:bg-white transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    <Plus size={15} />
                    <span>Upload Video Lesson</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Videos */}
            <div className="space-y-4">
              <h4 className="font-serif text-lg font-bold text-coffee-dark">
                Uploaded Video Library ({videos.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {videos.map((vid) => (
                  <div
                    key={vid.id}
                    className="bg-white rounded-3xl border border-cream shadow-premium overflow-hidden flex flex-col justify-between"
                  >
                    <div className="relative aspect-video bg-coffee-dark">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://img.youtube.com/vi/${vid.youtubeId}/mqdefault.jpg`}
                        alt={vid.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-cappuccino text-coffee-dark px-2.5 py-0.5 rounded-full text-[8.5px] font-bold uppercase tracking-wider">
                        {vid.course}
                      </div>
                    </div>

                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-cappuccino font-bold block">
                          {vid.category}
                        </span>
                        <h5 className="font-bold text-sm text-coffee-dark line-clamp-1">{vid.title}</h5>
                        {vid.description && (
                          <p className="text-xs text-coffee-dark/70 line-clamp-2 mt-1">
                            {vid.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-cream flex items-center justify-between">
                        <a
                          href={`https://www.youtube.com/watch?v=${vid.youtubeId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-cappuccino hover:underline flex items-center gap-1"
                        >
                          <Play size={12} />
                          <span>Watch</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => handleDeleteVideo(vid.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Video"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 4: COACHING MESSAGING DESK */}
        {activeTab === "messages" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[#241A1A] rounded-3xl border border-cappuccino/30 shadow-2xl overflow-hidden h-[580px] grid grid-cols-1 md:grid-cols-3"
          >
            {/* Left Column: Students List */}
            <div className="border-r border-white/10 flex flex-col h-full bg-[#1D1414]">
              <div className="p-4 border-b border-white/10">
                <h4 className="font-serif font-bold text-sm text-white flex items-center gap-2">
                  <MessageSquare size={15} className="text-cappuccino" />
                  <span>Student Doubt Desks</span>
                </h4>
                <p className="text-[10px] text-white/50 mt-0.5">Select an enrolled student to message</p>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-white/5">
                {students.filter((s) => s.status === "APPROVED").length === 0 ? (
                  <div className="p-6 text-center text-white/40 text-xs space-y-2">
                    <p>No enrolled students yet.</p>
                    <p className="text-[10px] text-white/30">Approved students will appear here for direct feedback.</p>
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
                          className={`p-3 transition-all cursor-pointer flex items-center gap-3 ${
                            isSelected
                              ? "bg-cappuccino/20 border-l-4 border-cappuccino"
                              : "hover:bg-white/5"
                          }`}
                        >
                          <div className="w-9 h-9 rounded-full bg-cappuccino/20 text-cappuccino flex items-center justify-center font-bold text-xs shrink-0">
                            {std.name.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <h5 className="font-bold text-xs text-white truncate">{std.name}</h5>
                              <span className="text-[8.5px] text-white/40 font-mono">
                                {std.permanentCode}
                              </span>
                            </div>
                            <p className="text-[10px] text-cappuccino/90 truncate">{std.course}</p>
                            {lastMsg && (
                              <p className="text-[9.5px] text-white/50 truncate mt-0.5">
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
            <div className="col-span-1 md:col-span-2 flex flex-col h-full bg-[#130D0D]">
              {activeChatStudent ? (
                <>
                  <div className="p-3.5 bg-[#1D1414] border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-cappuccino text-coffee-dark font-serif font-bold flex items-center justify-center shrink-0">
                        {activeChatStudent.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-sm text-white flex items-center gap-2">
                          <span>{activeChatStudent.name}</span>
                          <span className="text-[9.5px] font-mono text-cappuccino font-bold">
                            ({activeChatStudent.permanentCode})
                          </span>
                        </h4>
                        <p className="text-[10px] text-white/60">
                          {activeChatStudent.course} • Batch: {activeChatStudent.batch}
                        </p>
                      </div>
                    </div>

                    <a
                      href={`https://wa.me/91${activeChatStudent.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] text-xs font-bold hover:bg-[#25D366] hover:text-black transition-all flex items-center gap-1.5"
                    >
                      <Phone size={12} />
                      <span>WhatsApp App</span>
                    </a>
                  </div>

                  <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3">
                    {activeChatMessages.length === 0 ? (
                      <div className="text-center py-20 text-white/40 space-y-2">
                        <MessageSquare size={32} className="mx-auto text-cappuccino/50" />
                        <p className="text-xs sm:text-sm">No messages yet with {activeChatStudent.name}.</p>
                        <p className="text-[11px]">Type instructions or posture feedback below.</p>
                      </div>
                    ) : (
                      activeChatMessages.map((msg) => {
                        const isAdmin = msg.sender === "admin";
                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[85%] sm:max-w-[70%] p-3 rounded-2xl text-xs leading-relaxed shadow-md ${
                                isAdmin
                                  ? "bg-[#241A1A] text-white border border-cappuccino/40 rounded-tr-none"
                                  : "bg-[#005c4b] text-white rounded-tl-none"
                              }`}
                            >
                              {!isAdmin && (
                                <span className="text-[10px] font-bold text-amber-300 block mb-0.5">
                                  {activeChatStudent.name}
                                </span>
                              )}
                              <p className="whitespace-pre-wrap">{msg.text}</p>
                              <div
                                className={`flex items-center justify-end gap-1 text-[9px] mt-1.5 ${
                                  isAdmin ? "text-white/50" : "text-white/70"
                                }`}
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
                    className="p-3 bg-[#1D1414] border-t border-white/10 flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Reply to ${activeChatStudent.name}...`}
                      className="flex-1 bg-[#130D0D] border border-white/10 focus:border-cappuccino text-white rounded-full px-4 py-2 text-xs focus:outline-none transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={messageSending || !replyText.trim()}
                      className="w-9 h-9 rounded-full bg-cappuccino hover:bg-white text-coffee-dark flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer shrink-0 shadow-md active:scale-95 font-bold"
                    >
                      <Send size={15} />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-white/40 text-xs">
                  Select a student from the left panel to begin chat.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </PortalDashboardLayout>
  );
}
