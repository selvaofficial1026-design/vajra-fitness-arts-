"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Video,
  VideoOff,
  Radio,
  MessageSquare,
  LogOut,
  ExternalLink,
  Send,
  Sparkles,
  CheckCircle2,
  Clock,
  Award,
  Play,
  Calendar,
  Phone,
  MapPin,
  CheckCheck,
  HelpCircle,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { Student, ClassMeeting, VideoClass, ChatMessage } from "@/lib/portalStore";
import { cn } from "@/lib/utils";
import PortalNavbar, { PortalNavItem } from "@/components/portal/PortalNavbar";
import PortalLoadingScreen from "@/components/portal/PortalLoadingScreen";
import StudentProfileModal from "@/components/portal/StudentProfileModal";

export default function StudentPortalPage() {
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState<"meet" | "videos" | "doubt">("meet");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // Video State
  const [videos, setVideos] = useState<VideoClass[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoClass | null>(null);
  const [videosLoading, setVideosLoading] = useState(false);

  // Meet State
  const [meetings, setMeetings] = useState<ClassMeeting[]>([]);
  const [meetLoading, setMeetLoading] = useState(false);

  // Chat/Doubt State (Internal Academy Direct Channel)
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [chatSending, setChatSending] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Load session from localStorage on mount with luxury loading screen duration
  useEffect(() => {
    const startTime = Date.now();
    const saved = localStorage.getItem("vajra_student_session");
    if (!saved) {
      router.push("/portal?tab=login");
      return;
    }

    try {
      const parsed: Student = JSON.parse(saved);
      setStudent(parsed);
      loadStudentData(parsed);

      // Ensure loading screen is visible for a minimum of 1200ms for smooth luxury feel
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(1200 - elapsed, 400);
      const timer = setTimeout(() => {
        setPageLoading(false);
      }, remaining);
      return () => clearTimeout(timer);
    } catch {
      router.push("/portal?tab=login");
    }
  }, [router]);

  // Load videos, meetings, messages for this student
  const loadStudentData = async (std: Student) => {
    // 1. Fetch Meet links
    setMeetLoading(true);
    try {
      const res = await fetch(
        `/api/portal/meet?course=${encodeURIComponent(std.course)}&batch=${encodeURIComponent(std.batch)}`
      );
      const data = await res.json();
      if (data.success) {
        setMeetings(data.meetings || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setMeetLoading(false);
    }

    // 2. Fetch YouTube Videos
    setVideosLoading(true);
    try {
      const res = await fetch(`/api/portal/videos?course=${encodeURIComponent(std.course)}`);
      const data = await res.json();
      if (data.success) {
        setVideos(data.videos || []);
        if (data.videos?.length > 0) {
          setSelectedVideo(data.videos[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setVideosLoading(false);
    }

    // 3. Fetch Messages
    fetchMessages(std.id);
  };

  // Fetch chat messages
  const fetchMessages = async (studentId: string) => {
    try {
      const res = await fetch(`/api/portal/messages?studentId=${encodeURIComponent(studentId)}`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Scroll to bottom of chat when messages update
  useEffect(() => {
    if (activeTab === "doubt") {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeTab]);

  // Auto-mark coach messages as read when student views the doubt desk
  useEffect(() => {
    if (activeTab === "doubt" && student) {
      const hasUnread = messages.some(
        (m) => m.studentId === student.id && m.sender === "admin" && !m.isRead
      );
      if (hasUnread) {
        setMessages((prev) =>
          prev.map((m) =>
            m.studentId === student.id && m.sender === "admin" ? { ...m, isRead: true } : m
          )
        );
        fetch("/api/portal/messages", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId: student.id, sender: "admin" })
        }).catch(console.error);
      }
    }
  }, [activeTab, student, messages]);

  // Send message
  const handleSendMessage = async (e?: React.FormEvent, presetText?: string) => {
    if (e) e.preventDefault();
    const text = (presetText || newMessageText).trim();
    if (!text || !student) return;

    setChatSending(true);
    try {
      const res = await fetch("/api/portal/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: student.id,
          sender: "student",
          senderName: student.name,
          text
        })
      });
      const data = await res.json();
      if (data.success && data.message) {
        setMessages((prev) => [...prev, data.message]);
        setNewMessageText("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setChatSending(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("vajra_student_session");
    router.push("/portal?tab=login");
  };

  // Only count unread messages sent by coach/admin (Student's own sent messages never trigger a badge)
  const unreadCoachMessages = messages.filter((m) => m.sender === "admin" && !m.isRead);

  // Navigation Items matching website navbar style
  const navItems: PortalNavItem[] = [
    { id: "meet", label: "Live Classroom", icon: Radio },
    { id: "videos", label: "Videos", icon: Video, badge: videos.length || undefined },
    { id: "doubt", label: "Ask Doubt", icon: MessageSquare, badge: unreadCoachMessages.length || undefined }
  ];

  if (!student) {
    return (
      <PortalLoadingScreen
        show={true}
        role="student"
        title="Vajra Student Classroom"
        subtitle="Verifying enrollment credentials..."
      />
    );
  }

  // Active meeting for student's course/batch or academy-wide All session
  const activeMeeting =
    meetings.find((m) => {
      const courseMatch =
        m.course.toLowerCase() === "all" ||
        m.course.toLowerCase() === "all courses" ||
        m.course.toLowerCase() === student.course.toLowerCase();
      const batchMatch =
        m.batch.toLowerCase() === "all" ||
        m.batch.toLowerCase() === "all batches" ||
        m.batch.toLowerCase() === student.batch.toLowerCase();
      return courseMatch && batchMatch;
    }) ||
    meetings.find(
      (m) => m.course.toLowerCase() === "all" || m.course.toLowerCase() === "all courses"
    ) ||
    meetings[0];

  return (
    <>
      {/* Luxury Loading Screen shown when opening portal */}
      <PortalLoadingScreen
        show={pageLoading}
        role="student"
        title="Vajra Student Classroom"
        subtitle={`Welcome back, ${student.name}. Connecting to ${student.course} live batch...`}
      />

      {/* Student Profile Modal (Triggered by clicking Student Avatar) */}
      <StudentProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        student={student}
        onLogout={handleLogout}
      />

      {/* Dedicated Portal Floating Navbar (Matching Website Navbar Style) */}
      <PortalNavbar
        role="student"
        navItems={navItems}
        activeNavId={activeTab}
        onNavChange={(id) => setActiveTab(id as typeof activeTab)}
        user={{
          name: student.name,
          roleName: `${student.course} Student`,
          badgeCode: student.permanentCode || student.tempCode,
          avatarLetter: student.name.charAt(0)
        }}
        onLogout={handleLogout}
        onProfileClick={() => setIsProfileModalOpen(true)}
      />

      {/* Main Student Page Content - SEAMLESS OPEN CANVAS (NO HEAVY BOXES) */}
      <main className="min-h-screen bg-background text-coffee-dark pt-28 sm:pt-32 md:pt-36 pb-16 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Top Student Header - Sits directly on background without chunky boxes */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-6 border-b border-coffee-dark/10">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(true)}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-coffee-dark border border-cappuccino/50 flex items-center justify-center text-cappuccino font-serif text-xl sm:text-2xl font-bold shrink-0 shadow-sm cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                title="View Student Profile"
              >
                {student.name.charAt(0).toUpperCase()}
              </button>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-coffee-dark tracking-tight leading-tight">
                    {student.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-cappuccino/15 border border-cappuccino/30 text-coffee-dark font-mono text-[10px] font-bold uppercase tracking-wider">
                    {student.permanentCode || student.tempCode}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active Student
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-coffee-dark/70">
                  Discipline: <strong className="text-coffee-dark font-bold">{student.course}</strong> • Batch Slot:{" "}
                  <span className="text-coffee-dark font-mono font-medium">{student.batch}</span>
                </p>
              </div>
            </div>

            {/* Quick Class Timing & Live Class status on Header */}
            <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-coffee-dark/10">
              <div className="text-left md:text-right text-[11px] text-coffee-dark/60">
                <span className="block text-coffee-dark/40 uppercase tracking-widest text-[9px] font-bold">
                  Daily Batch Slot
                </span>
                <span className="font-semibold text-coffee-dark font-mono">
                  {student.batch}
                </span>
              </div>

              {activeMeeting?.meetUrl ? (
                <a
                  href={activeMeeting.meetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-coffee-dark hover:bg-cappuccino text-white hover:text-coffee-dark font-extrabold text-xs uppercase tracking-wider rounded-full shadow-sm transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer shrink-0"
                >
                  <Radio size={14} className="text-cappuccino animate-pulse" />
                  <span>Join Class</span>
                </a>
              ) : (
                <span className="px-3 py-1.5 rounded-full bg-coffee-dark/5 text-coffee-dark/60 text-[11px] font-mono border border-coffee-dark/10">
                  Room Pending
                </span>
              )}
            </div>
          </div>

          {/* Tab Content Display Area */}
          <div className="min-h-[480px]">
            {/* 1. GOOGLE MEET SECTION (OPEN CANVAS - NO CHUNKY BOXES) */}
            {activeTab === "meet" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Main Classroom Header & Action - Sits directly on background */}
                <div className="space-y-4 pb-8 border-b border-coffee-dark/10">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Official Live Classroom
                    </span>
                    <span className="text-xs text-coffee-dark/50 font-mono">
                      • Daily Virtual Training
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-coffee-dark tracking-tight leading-tight">
                    {activeMeeting?.title || `${student.course} Daily Live Training`}
                  </h2>

                  <p className="text-xs sm:text-sm text-coffee-dark/70 leading-relaxed font-light max-w-2xl">
                    Live interactive session guided by Head Coach. Practice techniques with direct visual posture analysis, real-time corrections, and authentic master drills.
                  </p>

                  {/* Inline details metrics - No heavy boxes, clean minimal cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl pt-1">
                    <div className="p-3.5 rounded-2xl bg-white/60 border border-coffee-dark/10 space-y-1">
                      <span className="text-[9.5px] uppercase tracking-widest text-coffee-dark/50 block font-bold">
                        Your Scheduled Batch
                      </span>
                      <p className="text-sm font-bold text-coffee-dark flex items-center gap-2 font-mono">
                        <Clock size={16} className="text-cappuccino" />
                        <span>{student.batch}</span>
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/60 border border-coffee-dark/10 space-y-1">
                      <span className="text-[9.5px] uppercase tracking-widest text-coffee-dark/50 block font-bold">
                        Enrolled Discipline
                      </span>
                      <p className="text-sm font-bold text-coffee-dark flex items-center gap-2">
                        <Award size={16} className="text-cappuccino" />
                        <span>{student.course} Academy</span>
                      </p>
                    </div>
                  </div>

                  {/* Join Google Meet CTA */}
                  <div className="pt-2">
                    {activeMeeting?.meetUrl ? (
                      <div className="space-y-2.5">
                        <a
                          href={activeMeeting.meetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-coffee-dark hover:bg-cappuccino text-white hover:text-coffee-dark font-extrabold text-xs sm:text-sm uppercase tracking-[0.18em] rounded-full transition-all shadow-md active:scale-95 cursor-pointer"
                        >
                          <Radio size={16} className="text-cappuccino animate-pulse" />
                          <span>Join Live Google Meet</span>
                          <ExternalLink size={15} />
                        </a>

                        <p className="text-[11px] text-coffee-dark/60 font-mono break-all">
                          Room URL: <a href={activeMeeting.meetUrl} target="_blank" rel="noopener noreferrer" className="text-cappuccino underline hover:text-coffee-dark">{activeMeeting.meetUrl}</a>
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 sm:p-5 rounded-2xl bg-white/50 border border-coffee-dark/10 text-center max-w-xl">
                        <p className="text-xs sm:text-sm text-coffee-dark/70">
                          Google Meet room will be published by the coach shortly before your scheduled batch ({student.batch}).
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Class Guidelines Protocol - Editorial Grid (No chunky boxes) */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs uppercase tracking-[0.2em] text-coffee-dark/50 font-bold">
                    Classroom Preparation Protocol
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1.5 border-l-2 border-cappuccino pl-3.5">
                      <span className="text-[10px] uppercase tracking-wider text-cappuccino font-bold block">
                        01 • Camera &amp; Floor Space
                      </span>
                      <h4 className="font-serif font-bold text-sm text-coffee-dark">Clear Floor Area</h4>
                      <p className="text-xs text-coffee-dark/70 leading-relaxed">
                        Position camera 6x6 feet away with clear floor space so head-to-toe postures and staff movements are visible.
                      </p>
                    </div>

                    <div className="space-y-1.5 border-l-2 border-cappuccino pl-3.5">
                      <span className="text-[10px] uppercase tracking-wider text-cappuccino font-bold block">
                        02 • Training Attire
                      </span>
                      <h4 className="font-serif font-bold text-sm text-coffee-dark">Athletic Gear</h4>
                      <p className="text-xs text-coffee-dark/70 leading-relaxed">
                        Wear comfortable stretchable athletic gear. Keep your practice stick/mat and hydration bottle ready.
                      </p>
                    </div>

                    <div className="space-y-1.5 border-l-2 border-cappuccino pl-3.5">
                      <span className="text-[10px] uppercase tracking-wider text-cappuccino font-bold block">
                        03 • Punctuality
                      </span>
                      <h4 className="font-serif font-bold text-sm text-coffee-dark">Join 5 Mins Early</h4>
                      <p className="text-xs text-coffee-dark/70 leading-relaxed">
                        Join the Google Meet room 5 minutes prior to your batch start time to complete warm-up drills on schedule.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. VIDEOS FETCH FROM YOUTUBE (OPEN CANVAS - NO CHUNKY BOXES) */}
            {activeTab === "videos" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {videos.length === 0 ? (
                  <div className="py-16 text-center space-y-2">
                    <VideoOff size={36} className="mx-auto text-coffee-dark/40" />
                    <h3 className="text-lg font-serif font-bold text-coffee-dark">No Training Videos Yet</h3>
                    <p className="text-xs text-coffee-dark/60">
                      Your coach has not uploaded recorded lessons for {student.course} yet. Check back soon!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Main Video Player */}
                    <div className="lg:col-span-8 space-y-4">
                      {selectedVideo && (
                        <div className="space-y-4">
                          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-lg border border-coffee-dark/15">
                            <iframe
                              src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?rel=0&modestbranding=1`}
                              title={selectedVideo.title}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full border-0"
                            />
                          </div>

                          <div className="space-y-2 pt-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2.5 py-0.5 rounded-full bg-cappuccino text-coffee-dark text-[9px] font-bold uppercase tracking-wider">
                                {selectedVideo.category}
                              </span>
                              <span className="text-[11px] text-coffee-dark/60 font-mono">
                                Discipline: <strong className="text-coffee-dark">{selectedVideo.course}</strong>
                              </span>
                            </div>

                            <h3 className="text-xl sm:text-2xl font-serif font-bold text-coffee-dark">
                              {selectedVideo.title}
                            </h3>

                            <p className="text-xs sm:text-sm text-coffee-dark/70 leading-relaxed font-light">
                              {selectedVideo.description ||
                                "Guided training video provided for regular practice and technique perfection."}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Playlist Sidebar - Open Canvas */}
                    <div className="lg:col-span-4 space-y-3">
                      <div className="flex items-center justify-between pb-3 border-b border-coffee-dark/10">
                        <h4 className="font-serif text-sm font-bold text-coffee-dark">
                          {student.course} Library ({videos.length})
                        </h4>
                        <span className="text-[10px] font-mono text-cappuccino font-bold uppercase">
                          Official Drills
                        </span>
                      </div>

                      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                        {videos.map((vid) => {
                          const isSelected = selectedVideo?.id === vid.id;
                          return (
                            <div
                              key={vid.id}
                              onClick={() => setSelectedVideo(vid)}
                              className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex gap-3 items-center ${
                                isSelected
                                  ? "bg-coffee-dark text-white border-cappuccino/60 shadow-md"
                                  : "bg-white/60 hover:bg-white text-coffee-dark border-coffee-dark/10 hover:border-cappuccino/40"
                              }`}
                            >
                              <div className="w-10 h-10 rounded-xl bg-cappuccino/20 flex items-center justify-center shrink-0 text-cappuccino">
                                <Play size={16} fill="currentColor" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-serif font-bold text-xs truncate leading-tight">
                                  {vid.title}
                                </p>
                                <span
                                  className={`text-[9px] uppercase tracking-wider font-semibold ${
                                    isSelected ? "text-cappuccino" : "text-coffee-dark/50"
                                  }`}
                                >
                                  {vid.category}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ========================================================================= */}
            {/* TAB 3: VAJRA DIRECT CLASSROOM DOUBT DESK (OPEN CANVAS - NO BOXES)         */}
            {/* ========================================================================= */}
            {activeTab === "doubt" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Header Info Banner - Sits directly on background */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-coffee-dark/10">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full border border-cappuccino/50 bg-coffee-dark p-1 flex items-center justify-center shadow-xs">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/images/logo_gold.jpeg"
                          alt="Coach"
                          className="w-full h-full object-contain rounded-full"
                        />
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#FAF7F2]" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-base sm:text-lg text-coffee-dark flex items-center gap-1.5">
                        <span>Vajra Head Coach Direct Desk</span>
                        <ShieldCheck size={16} className="text-cappuccino" />
                      </h4>
                      <p className="text-xs text-coffee-dark/65 font-medium">
                        Direct Guidance • Posture Corrections • Training Q&amp;A
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Internal Academy Channel</span>
                    </span>
                  </div>
                </div>

                {/* Quick Prompts */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  <span className="text-[10px] uppercase tracking-wider text-coffee-dark/50 font-bold shrink-0">
                    Quick Ask:
                  </span>
                  {[
                    "How to correct my wrist angle in Silambam?",
                    "Can I attend the evening batch today?",
                    "Please guide me on diet before morning class",
                    "My stance feels unbalanced during kicks"
                  ].map((quick, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSendMessage(undefined, quick)}
                      className="px-3 py-1.5 rounded-full bg-white hover:bg-cappuccino hover:text-coffee-dark text-coffee-dark/80 border border-coffee-dark/15 whitespace-nowrap transition-all cursor-pointer shrink-0 text-[11px] font-medium shadow-2xs active:scale-95"
                    >
                      {quick}
                    </button>
                  ))}
                </div>

                {/* Messages Canvas - Subtle open container */}
                <div className="min-h-[360px] max-h-[460px] overflow-y-auto p-4 sm:p-6 space-y-3 rounded-2xl bg-white/40 border border-coffee-dark/10">
                  {messages.length === 0 ? (
                    <div className="text-center py-20 space-y-2 text-coffee-dark/40">
                      <HelpCircle size={36} className="mx-auto text-cappuccino/60" />
                      <p className="text-sm font-semibold text-coffee-dark">No doubts asked yet.</p>
                      <p className="text-xs text-coffee-dark/60">
                        Type your question below to chat directly with your instructor!
                      </p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.sender === "student";
                      return (
                        <div
                          key={msg.id}
                          className={cn("flex", isMe ? "justify-end" : "justify-start")}
                        >
                          <div
                            className={cn(
                              "max-w-[88%] sm:max-w-[75%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs",
                              isMe
                                ? "bg-coffee-dark text-white rounded-tr-xs"
                                : "bg-white text-coffee-dark border border-coffee-dark/10 rounded-tl-xs"
                            )}
                          >
                            {!isMe && (
                              <span className="text-[10px] font-bold text-cappuccino block mb-0.5">
                                Vajra Head Coach
                              </span>
                            )}
                            <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                            <div
                              className={cn(
                                "flex items-center justify-end gap-1 text-[9px] mt-1.5",
                                isMe ? "text-white/60" : "text-coffee-dark/50"
                              )}
                            >
                              <span>
                                {new Date(msg.timestamp).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })}
                              </span>
                              {isMe && <CheckCheck size={12} className="text-[#53bdeb]" />}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={chatBottomRef} />
                </div>

                {/* Chat Input Bar - Sits cleanly on canvas */}
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-center gap-2 pt-1"
                >
                  <input
                    type="text"
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    className="flex-1 bg-white/70 focus:bg-white border border-coffee-dark/20 focus:border-cappuccino text-coffee-dark rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none transition-colors shadow-xs"
                  />
                  <button
                    type="submit"
                    disabled={chatSending || !newMessageText.trim()}
                    className="px-5 py-2.5 rounded-xl bg-cappuccino hover:bg-[#d69f68] text-coffee-dark font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 cursor-pointer shrink-0 shadow-xs active:scale-95"
                  >
                    <Send size={15} />
                    <span>Send</span>
                  </button>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
