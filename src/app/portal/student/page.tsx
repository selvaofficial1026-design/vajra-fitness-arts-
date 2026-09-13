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
  Pause,
  ChevronLeft,
  ChevronRight,
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
import VideoModal from "@/components/VideoModal";

// Helper function to format "X mins ago" uploaded time
function formatTimeAgo(isoString?: string): string {
  if (!isoString) return "";
  const date = new Date(isoString);
  const now = new Date();
  const diffInSeconds = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));

  if (diffInSeconds < 60) {
    return "Uploaded just now";
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes === 1) {
    return "Uploaded 1 min ago";
  }
  if (diffInMinutes < 60) {
    return `Uploaded ${diffInMinutes} mins ago`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours === 1) {
    return "Uploaded 1 hour ago";
  }
  if (diffInHours < 24) {
    return `Uploaded ${diffInHours} hours ago`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return "Uploaded 1 day ago";
  }
  return `Uploaded ${diffInDays} days ago`;
}

export default function StudentPortalPage() {
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState<"meet" | "videos" | "doubt">("meet");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // Periodic timer tick to update "Uploaded X mins ago" continuously
  const [, setTimeTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTimeTick((t) => t + 1), 30000);
    return () => clearInterval(timer);
  }, []);

  // Video State & Compact Auto-Scroll Marquee
  const [videos, setVideos] = useState<VideoClass[]>([]);
  const [videosLoading, setVideosLoading] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [isVideoSliderHovered, setIsVideoSliderHovered] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const videoSliderRef = useRef<HTMLDivElement>(null);

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
      }
    } catch (err) {
      console.error(err);
    } finally {
      setVideosLoading(false);
    }

    // 3. Fetch Messages
    fetchMessages(std.id);
  };

  // Auto-scroll marquee for compact videos carousel (only runs when multiple lessons exist)
  useEffect(() => {
    if (
      activeTab !== "videos" ||
      isVideoPaused ||
      isVideoSliderHovered ||
      isVideoModalOpen ||
      videos.length <= 2
    ) {
      return;
    }

    const interval = setInterval(() => {
      if (videoSliderRef.current) {
        videoSliderRef.current.scrollLeft += 1;
        if (
          videoSliderRef.current.scrollLeft >=
          videoSliderRef.current.scrollWidth - videoSliderRef.current.clientWidth
        ) {
          videoSliderRef.current.scrollLeft = 0;
        }
      }
    }, 16);

    return () => clearInterval(interval);
  }, [activeTab, isVideoPaused, isVideoSliderHovered, isVideoModalOpen, videos.length]);

  // Manual scroll helper for video carousel buttons
  const handleScrollVideos = (direction: "left" | "right") => {
    if (videoSliderRef.current) {
      const scrollAmount = 320;
      videoSliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
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

      {/* YouTube Video Player Modal (Triggered by clicking any compact video card) */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoId={activeVideoId}
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
      <main className="min-h-screen bg-background text-coffee-dark pt-28 sm:pt-32 md:pt-36 pb-16 px-3 xs:px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Top Student Header - Sits directly on background without chunky boxes */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-5 pb-5 sm:pb-6 border-b border-coffee-dark/10">
            <div className="flex items-start xs:items-center gap-3 sm:gap-4 min-w-0 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(true)}
                className="w-12 h-12 min-w-[44px] min-h-[44px] sm:w-14 sm:h-14 rounded-2xl bg-coffee-dark border border-cappuccino/50 flex items-center justify-center text-cappuccino font-serif text-xl sm:text-2xl font-bold shrink-0 shadow-sm cursor-pointer hover:scale-105 active:scale-95 transition-transform touch-manipulation"
                title="View Student Profile"
                aria-label="View Student Profile"
              >
                {student.name.charAt(0).toUpperCase()}
              </button>
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
                  <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-serif font-bold text-coffee-dark tracking-tight leading-tight break-words min-w-0">
                    {student.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-cappuccino/15 border border-cappuccino/30 text-coffee-dark font-mono text-[10px] font-bold uppercase tracking-wider break-words max-w-full">
                    {student.permanentCode || student.tempCode}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 text-[10px] font-bold uppercase tracking-wider shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    Active Student
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-coffee-dark/70 break-words leading-relaxed">
                  Discipline: <strong className="text-coffee-dark font-bold">{student.course}</strong> • Batch Slot:{" "}
                  <span className="text-coffee-dark font-mono font-medium break-words">{student.batch}</span>
                </p>
              </div>
            </div>

            {/* Quick Class Timing & Live Class status on Header */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-coffee-dark/10 w-full md:w-auto">
              <div className="flex items-center justify-between sm:block text-left md:text-right text-[11px] text-coffee-dark/60 min-w-0">
                <span className="block text-coffee-dark/40 uppercase tracking-widest text-[9px] font-bold">
                  Daily Batch Slot
                </span>
                <span className="font-semibold text-coffee-dark font-mono break-words">
                  {student.batch}
                </span>
              </div>

              {activeMeeting?.meetUrl && (
                <div className="flex flex-col items-stretch sm:items-end gap-1 w-full sm:w-auto">
                  <a
                    href={activeMeeting.meetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto min-h-[40px] px-4 py-2 bg-coffee-dark hover:bg-cappuccino text-white hover:text-coffee-dark font-extrabold text-xs uppercase tracking-wider rounded-full shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shrink-0 touch-manipulation"
                  >
                    <Radio size={14} className="text-cappuccino animate-pulse shrink-0" />
                    <span>Join Class</span>
                  </a>
                  {activeMeeting.createdAt && (
                    <span className="text-[10px] text-emerald-700 font-semibold font-mono text-center sm:text-right">
                      {formatTimeAgo(activeMeeting.createdAt)}
                    </span>
                  )}
                </div>
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
                className="space-y-8 min-w-0"
              >
                {/* Main Classroom Header & Action - Sits directly on background */}
                <div className="space-y-4 pb-8 border-b border-coffee-dark/10 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-[11px] xs:text-xs font-bold uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      Official Live Classroom
                    </span>
                    {activeMeeting?.createdAt && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-900 border border-emerald-300/80 text-[11px] xs:text-xs font-bold font-mono">
                        <Clock size={12} className="text-emerald-700 shrink-0" />
                        <span>{formatTimeAgo(activeMeeting.createdAt)}</span>
                      </span>
                    )}
                    <span className="text-[11px] xs:text-xs text-coffee-dark/50 font-mono">
                      • Daily Virtual Training
                    </span>
                  </div>

                  <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-coffee-dark tracking-tight leading-tight break-words">
                    {activeMeeting?.title || `${student.course} Daily Live Training`}
                  </h2>

                  <p className="text-xs sm:text-sm text-coffee-dark/70 leading-relaxed font-light max-w-2xl break-words">
                    Live interactive session guided by Head Coach. Practice techniques with direct visual posture analysis, real-time corrections, and authentic master drills.
                  </p>

                  {/* Inline details metrics - No heavy boxes, clean minimal cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl pt-1">
                    <div className="p-3.5 rounded-2xl bg-white/60 border border-coffee-dark/10 space-y-1 min-w-0">
                      <span className="text-[9.5px] uppercase tracking-widest text-coffee-dark/50 block font-bold truncate">
                        Your Scheduled Batch
                      </span>
                      <p className="text-xs xs:text-sm font-bold text-coffee-dark flex items-center gap-2 font-mono min-w-0">
                        <Clock size={16} className="text-cappuccino shrink-0" />
                        <span className="truncate">{student.batch}</span>
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/60 border border-coffee-dark/10 space-y-1 min-w-0">
                      <span className="text-[9.5px] uppercase tracking-widest text-coffee-dark/50 block font-bold truncate">
                        Enrolled Discipline
                      </span>
                      <p className="text-xs xs:text-sm font-bold text-coffee-dark flex items-center gap-2 min-w-0">
                        <Award size={16} className="text-cappuccino shrink-0" />
                        <span className="truncate">{student.course} Academy</span>
                      </p>
                    </div>
                  </div>

                  {/* Join Google Meet CTA */}
                  <div className="pt-2 min-w-0">
                    {activeMeeting?.meetUrl ? (
                      <div className="space-y-3 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          <a
                            href={activeMeeting.meetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-full sm:w-auto min-h-[44px] items-center justify-center gap-2.5 px-6 py-3.5 bg-coffee-dark hover:bg-cappuccino text-white hover:text-coffee-dark font-extrabold text-xs sm:text-sm uppercase tracking-[0.18em] rounded-full transition-all shadow-md active:scale-95 cursor-pointer text-center"
                          >
                            <Radio size={16} className="text-cappuccino animate-pulse shrink-0" />
                            <span>Join Live Google Meet</span>
                            <ExternalLink size={15} className="shrink-0" />
                          </a>

                          {activeMeeting.createdAt && (
                            <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold w-fit">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                              <span className="font-bold">{formatTimeAgo(activeMeeting.createdAt)}</span>
                              <span className="text-emerald-700/40">•</span>
                              <span className="font-mono text-[11px] text-emerald-700">
                                Posted {new Date(activeMeeting.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                          )}
                        </div>

                        <p className="text-[11px] text-coffee-dark/60 font-mono break-all min-w-0">
                          Room URL:{" "}
                          <a
                            href={activeMeeting.meetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cappuccino underline hover:text-coffee-dark break-all"
                          >
                            {activeMeeting.meetUrl}
                          </a>
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 sm:p-5 rounded-2xl bg-white/50 border border-coffee-dark/10 text-center max-w-xl min-w-0">
                        <p className="text-xs sm:text-sm text-coffee-dark/70 break-words">
                          Google Meet room will be published by the coach shortly before your scheduled batch ({student.batch}).
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Class Guidelines Protocol - Editorial Grid (No chunky boxes) */}
                <div className="space-y-3 pt-2 min-w-0">
                  <h3 className="text-xs uppercase tracking-[0.2em] text-coffee-dark/50 font-bold">
                    Classroom Preparation Protocol
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    <div className="space-y-1.5 border-l-2 border-cappuccino pl-3.5 min-w-0">
                      <span className="text-[10px] uppercase tracking-wider text-cappuccino font-bold block">
                        01 • Camera &amp; Floor Space
                      </span>
                      <h4 className="font-serif font-bold text-sm text-coffee-dark">Clear Floor Area</h4>
                      <p className="text-xs text-coffee-dark/70 leading-relaxed break-words">
                        Position camera 6x6 feet away with clear floor space so head-to-toe postures and staff movements are visible.
                      </p>
                    </div>

                    <div className="space-y-1.5 border-l-2 border-cappuccino pl-3.5 min-w-0">
                      <span className="text-[10px] uppercase tracking-wider text-cappuccino font-bold block">
                        02 • Training Attire
                      </span>
                      <h4 className="font-serif font-bold text-sm text-coffee-dark">Athletic Gear</h4>
                      <p className="text-xs text-coffee-dark/70 leading-relaxed break-words">
                        Wear comfortable stretchable athletic gear. Keep your practice stick/mat and hydration bottle ready.
                      </p>
                    </div>

                    <div className="space-y-1.5 border-l-2 border-cappuccino pl-3.5 min-w-0">
                      <span className="text-[10px] uppercase tracking-wider text-cappuccino font-bold block">
                        03 • Punctuality
                      </span>
                      <h4 className="font-serif font-bold text-sm text-coffee-dark">Join 5 Mins Early</h4>
                      <p className="text-xs text-coffee-dark/70 leading-relaxed break-words">
                        Join the Google Meet room 5 minutes prior to your batch start time to complete warm-up drills on schedule.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. COMPACT AUTO-SCROLLING VIDEO VAULT WITH YOUTUBE MODAL (MATCHING MAIN WEBSITE) */}
            {activeTab === "videos" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Header & Controls Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-coffee-dark/10">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-cappuccino/20 border border-cappuccino/40 text-coffee-dark text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-2xs">
                        <Sparkles size={11} className="text-cappuccino shrink-0" />
                        <span>{student.course} Vault</span>
                      </span>
                      <span className="text-[11px] font-mono text-coffee-dark/60">
                        {videos.length} {videos.length === 1 ? "Lesson" : "Recorded Lessons"}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-coffee-dark break-words tracking-tight">
                      Technique Masterclasses
                    </h3>
                    <p className="text-xs sm:text-sm text-coffee-dark/65 font-light leading-relaxed">
                      Continuous auto-scrolling curriculum. Tap any lesson to stream in HD YouTube popup player.
                    </p>
                  </div>

                  {videos.length > 2 && (
                    <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                      <button
                        type="button"
                        onClick={() => setIsVideoPaused((prev) => !prev)}
                        aria-label={isVideoPaused ? "Resume auto-scrolling" : "Pause auto-scrolling"}
                        className="h-9 px-3.5 rounded-full bg-white/80 hover:bg-white border border-coffee-dark/15 text-coffee-dark text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95 select-none"
                      >
                        {isVideoPaused ? (
                          <>
                            <Play size={12} fill="currentColor" className="text-cappuccino shrink-0" />
                            <span>Resume</span>
                          </>
                        ) : (
                          <>
                            <Pause size={12} className="text-coffee-dark shrink-0" />
                            <span>Pause</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleScrollVideos("left")}
                          aria-label="Scroll videos left"
                          className="w-9 h-9 rounded-full bg-white/80 hover:bg-white border border-coffee-dark/15 text-coffee-dark flex items-center justify-center transition-all shadow-2xs cursor-pointer active:scale-90 select-none"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleScrollVideos("right")}
                          aria-label="Scroll videos right"
                          className="w-9 h-9 rounded-full bg-white/80 hover:bg-white border border-coffee-dark/15 text-coffee-dark flex items-center justify-center transition-all shadow-2xs cursor-pointer active:scale-90 select-none"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {videos.length === 0 ? (
                  <div className="py-12 sm:py-16 px-4 text-center space-y-2.5 max-w-md mx-auto">
                    <VideoOff size={36} className="mx-auto text-coffee-dark/40 shrink-0" />
                    <h3 className="text-base sm:text-lg font-serif font-bold text-coffee-dark break-words">
                      No Training Videos Yet
                    </h3>
                    <p className="text-xs text-coffee-dark/60 max-w-xs sm:max-w-sm mx-auto leading-relaxed break-words">
                      Your coach has not uploaded recorded lessons for {student.course} yet. Check back soon!
                    </p>
                  </div>
                ) : (
                  <div
                    className="relative group/slider w-full max-w-full overflow-hidden py-1"
                    onMouseEnter={() => setIsVideoSliderHovered(true)}
                    onMouseLeave={() => setIsVideoSliderHovered(false)}
                    onTouchStart={() => setIsVideoSliderHovered(true)}
                    onTouchEnd={() => setIsVideoSliderHovered(false)}
                  >
                    {/* Gradient Fade Edges for Luxury Marquee Feel when multiple videos */}
                    {videos.length > 2 && (
                      <>
                        <div className="pointer-events-none hidden sm:block absolute top-0 bottom-0 left-0 w-8 md:w-12 bg-gradient-to-r from-[#FAF7F2] to-transparent z-10" />
                        <div className="pointer-events-none hidden sm:block absolute top-0 bottom-0 right-0 w-8 md:w-12 bg-gradient-to-l from-[#FAF7F2] to-transparent z-10" />
                      </>
                    )}

                    {/* Videos Track */}
                    <div
                      ref={videoSliderRef}
                      className={cn(
                        "flex gap-4 sm:gap-6 py-2 px-1",
                        videos.length > 2
                          ? "overflow-x-auto [&::-webkit-scrollbar]:hidden touch-pan-x"
                          : "flex-wrap justify-start"
                      )}
                      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                      {videos.map((vid) => {
                        return (
                          <div
                            key={vid.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => {
                              setActiveVideoId(vid.youtubeId);
                              setIsVideoModalOpen(true);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setActiveVideoId(vid.youtubeId);
                                setIsVideoModalOpen(true);
                              }
                            }}
                            className="group/card relative w-[74vw] xs:w-[68vw] sm:w-[280px] md:w-[310px] shrink-0 bg-white rounded-2xl overflow-hidden border border-coffee-dark/10 hover:border-cappuccino/60 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer select-none active:scale-[0.98]"
                          >
                            {/* Poster / Thumbnail Area */}
                            <div className="relative aspect-[16/10] w-full overflow-hidden bg-coffee-dark">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={`https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg`}
                                alt={vid.title}
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-108 pointer-events-none"
                                loading="lazy"
                              />

                              {/* Vignette Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-coffee-dark/95 via-coffee-dark/25 to-transparent opacity-85 group-hover/card:opacity-100 transition-opacity duration-300" />

                              {/* Category Badge */}
                              <div className="absolute top-2.5 left-2.5 z-10">
                                <span className="px-2.5 py-0.5 rounded-full bg-coffee-dark/85 backdrop-blur-md text-cappuccino border border-cappuccino/30 text-[9px] font-bold uppercase tracking-wider shadow-sm">
                                  {vid.category || "Technique"}
                                </span>
                              </div>

                              {/* Course Tag */}
                              <div className="absolute top-2.5 right-2.5 z-10">
                                <span className="px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-coffee-dark text-[9px] font-semibold shadow-sm truncate max-w-[100px] block">
                                  {vid.course}
                                </span>
                              </div>

                              {/* Centered Glowing Play Button Overlay */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-cappuccino/90 backdrop-blur-md text-white flex items-center justify-center shadow-[0_0_20px_rgba(200,149,95,0.6)] group-hover/card:scale-110 group-hover/card:bg-white group-hover/card:text-coffee-dark transition-all duration-300">
                                  <Play size={18} fill="currentColor" className="ml-0.5" />
                                </div>
                              </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 gap-2.5 bg-white">
                              <div className="space-y-1">
                                <h4 className="font-serif font-bold text-sm sm:text-base text-coffee-dark group-hover/card:text-cappuccino line-clamp-2 transition-colors leading-snug break-words">
                                  {vid.title}
                                </h4>
                                <p className="text-[11px] sm:text-xs text-coffee-dark/65 line-clamp-2 leading-relaxed break-words font-light">
                                  {vid.description || "Master discipline drills and posture sequences with step-by-step video guidance."}
                                </p>
                              </div>

                              {/* Card Action Footer */}
                              <div className="flex items-center justify-between pt-2 border-t border-coffee-dark/10 text-[11px] font-semibold text-cappuccino">
                                <span className="group-hover/card:translate-x-0.5 transition-transform flex items-center gap-1">
                                  <span>Stream Lesson</span>
                                  <Play size={10} fill="currentColor" />
                                </span>
                                <span className="text-[10px] text-coffee-dark/40 font-mono">
                                  YouTube HD
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Bottom Helper Bar */}
                    <div className="pt-2.5 flex items-center justify-between text-[11px] text-coffee-dark/55 px-1 font-medium">
                      <span>
                        {videos.length > 2
                          ? "💡 Touch or hover cards to pause auto-scroll"
                          : "💡 Tap video card to stream full lesson in HD player"}
                      </span>
                      {videos.length > 2 && (
                        <span className="hidden sm:inline font-mono text-[10px] text-coffee-dark/45 uppercase tracking-wider">
                          Continuous Loop
                        </span>
                      )}
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
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
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
                    <div className="min-w-0">
                      <h4 className="font-serif font-bold text-base sm:text-lg text-coffee-dark flex flex-wrap items-center gap-1.5 leading-snug">
                        <span>Vajra Head Coach Direct Desk</span>
                        <ShieldCheck size={16} className="text-cappuccino shrink-0" />
                      </h4>
                      <p className="text-[11px] sm:text-xs text-coffee-dark/65 font-medium leading-relaxed">
                        Direct Guidance • Posture Corrections • Training Q&amp;A
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
                    <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      <span>Internal Academy Channel</span>
                    </span>
                  </div>
                </div>

                {/* Quick Prompts */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar touch-pan-x py-1">
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
                      className="px-3 py-1.5 rounded-full bg-white hover:bg-cappuccino hover:text-coffee-dark text-coffee-dark/80 border border-coffee-dark/15 whitespace-nowrap transition-all cursor-pointer shrink-0 text-[11px] font-medium shadow-2xs active:scale-95 min-h-[32px] inline-flex items-center justify-center"
                    >
                      {quick}
                    </button>
                  ))}
                </div>

                {/* Messages Canvas - Subtle open container */}
                <div className="min-h-[300px] max-h-[380px] sm:max-h-[460px] overflow-y-auto p-3.5 sm:p-6 space-y-3 rounded-2xl bg-white/40 border border-coffee-dark/10">
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
                              "max-w-[88%] sm:max-w-[75%] px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs break-words [overflow-wrap:anywhere]",
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
                            <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{msg.text}</p>
                            <div
                              className={cn(
                                "flex items-center justify-end gap-1 text-[9px] mt-1.5 shrink-0 select-none",
                                isMe ? "text-white/60" : "text-coffee-dark/50"
                              )}
                            >
                              <span>
                                {new Date(msg.timestamp).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })}
                              </span>
                              {isMe && <CheckCheck size={12} className="text-[#53bdeb] shrink-0" />}
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
                    placeholder="Ask coach your doubt..."
                    className="flex-1 min-h-[42px] bg-white/70 focus:bg-white border border-coffee-dark/20 focus:border-cappuccino text-coffee-dark placeholder:text-coffee-dark/40 rounded-xl px-3.5 sm:px-4 py-2 text-base sm:text-sm focus:outline-none transition-colors shadow-xs"
                  />
                  <button
                    type="submit"
                    disabled={chatSending || !newMessageText.trim()}
                    aria-label="Send doubt message"
                    className="min-h-[42px] px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-cappuccino hover:bg-[#d69f68] text-coffee-dark font-bold text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all disabled:opacity-40 cursor-pointer shrink-0 shadow-xs active:scale-95"
                  >
                    <Send size={15} className="shrink-0" />
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
