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
  MessageCircle,
  HelpCircle,
  ShieldCheck,
  AlertCircle,
  ChevronRight,
  Flame,
  Zap
} from "lucide-react";
import { Student, ClassMeeting, VideoClass, ChatMessage } from "@/lib/portalStore";
import PortalDashboardLayout, { NavItem } from "@/components/portal/PortalDashboardLayout";

export default function StudentPortalPage() {
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState<"meet" | "videos" | "doubt" | "profile">("meet");
  const [searchQuery, setSearchQuery] = useState("");

  // Video State
  const [videos, setVideos] = useState<VideoClass[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoClass | null>(null);
  const [videosLoading, setVideosLoading] = useState(false);

  // Meet State
  const [meetings, setMeetings] = useState<ClassMeeting[]>([]);
  const [meetLoading, setMeetLoading] = useState(false);

  // Chat/Doubt State (WhatsApp style)
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [chatSending, setChatSending] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Load session from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("vajra_student_session");
    if (!saved) {
      router.push("/portal?tab=login");
      return;
    }
    try {
      const parsed: Student = JSON.parse(saved);
      setStudent(parsed);
      loadStudentData(parsed);
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

  if (!student) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-cappuccino font-serif">
        Loading Student Portal...
      </div>
    );
  }

  // Active meeting for student's course/batch
  const activeMeeting = meetings.find((m) => m.isActive) || meetings[0];

  // Filtered videos based on search
  const filteredVideos = videos.filter((v) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return v.title.toLowerCase().includes(q) || v.category.toLowerCase().includes(q);
  });

  // Navigation Items
  const navItems: NavItem[] = [
    { id: "meet", label: "Live Classroom", icon: Radio },
    { id: "videos", label: "Video Archive", icon: Video, badge: videos.length || undefined },
    { id: "doubt", label: "Coach Desk", icon: MessageSquare, badge: messages.length || undefined },
    { id: "profile", label: "My Profile", icon: User }
  ];

  // Breadcrumbs
  const tabTitles: Record<string, string> = {
    meet: "Live Google Meet Classroom",
    videos: "Recorded YouTube Training Library",
    doubt: "Instructor Doubt & Correction Desk",
    profile: "Student Enrollment Profile"
  };

  const breadcrumbs = [
    { label: "Vajra Portal", href: "/portal" },
    { label: "Student", href: "/portal/student" },
    { label: navItems.find((n) => n.id === activeTab)?.label || "Dashboard" }
  ];

  // Right Profile Widget
  const rightProfileWidget = (
    <div className="bg-white rounded-3xl border border-cream shadow-premium p-6 space-y-6 text-coffee-dark text-center">
      {/* Circular Avatar with Mastery Progress Ring */}
      <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
        {/* SVG Progress Ring */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="44"
            className="stroke-[#EDE4D8]"
            strokeWidth="6"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="44"
            className="stroke-cappuccino"
            strokeWidth="6"
            strokeDasharray={276}
            strokeDashoffset={276 * (1 - 0.86)}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Inner Avatar */}
        <div className="absolute inset-2 rounded-full bg-[#241A1A] border-2 border-cappuccino/60 flex items-center justify-center text-cappuccino font-serif text-2xl font-bold shadow-inner">
          {student.name.charAt(0).toUpperCase()}
        </div>

        {/* Verified Badge */}
        <span className="absolute bottom-1 right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-sm" title="Active Verified Student">
          <ShieldCheck size={14} />
        </span>
      </div>

      {/* Student Name & Course */}
      <div className="space-y-1">
        <h3 className="font-serif font-bold text-lg text-coffee-dark truncate">
          {student.name}
        </h3>
        <p className="text-xs text-cappuccino font-semibold tracking-wide">
          {student.course} Disciplines
        </p>
        <div className="pt-1">
          <span className="inline-block px-3 py-0.5 rounded-full bg-cappuccino/15 border border-cappuccino/35 text-cappuccino font-mono font-bold text-[10px] uppercase tracking-wider">
            {student.permanentCode || "Approved"}
          </span>
        </div>
      </div>

      {/* Stats Counter Boxes (Matching Reference Image) */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-cream">
        <div className="p-2.5 rounded-2xl bg-[#FAF7F2] border border-cream text-center">
          <span className="text-[9.5px] uppercase tracking-wider text-coffee-dark/50 font-bold block">
            Batch Slot
          </span>
          <p className="font-serif font-bold text-xs text-coffee-dark mt-0.5 truncate" title={student.batch}>
            {student.batch.split("(")[0]}
          </p>
        </div>

        <div className="p-2.5 rounded-2xl bg-[#FAF7F2] border border-cream text-center">
          <span className="text-[9.5px] uppercase tracking-wider text-coffee-dark/50 font-bold block">
            Status
          </span>
          <p className="font-serif font-bold text-xs text-emerald-600 mt-0.5 flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active</span>
          </p>
        </div>
      </div>

      {/* Contact Details List (Phone & WhatsApp) */}
      <div className="space-y-2.5 text-left text-xs border-t border-cream pt-4">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-[#FAF7F2] border border-cream">
          <div className="w-7 h-7 rounded-lg bg-cappuccino/15 text-cappuccino flex items-center justify-center shrink-0">
            <Phone size={13} />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[9px] uppercase tracking-wider text-coffee-dark/50 font-semibold block">Phone</span>
            <p className="font-mono font-bold text-coffee-dark text-[11px] truncate">+91 {student.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2 rounded-xl bg-[#FAF7F2] border border-cream">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
            <MessageCircle size={13} />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[9px] uppercase tracking-wider text-coffee-dark/50 font-semibold block">WhatsApp</span>
            <p className="font-mono font-bold text-coffee-dark text-[11px] truncate">+91 {student.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2 rounded-xl bg-[#FAF7F2] border border-cream">
          <div className="w-7 h-7 rounded-lg bg-cappuccino/15 text-cappuccino flex items-center justify-center shrink-0">
            <MapPin size={13} />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[9px] uppercase tracking-wider text-coffee-dark/50 font-semibold block">Campus</span>
            <p className="font-bold text-coffee-dark text-[11px] truncate">{student.city || "Ariyalur / Virtual"}</p>
          </div>
        </div>
      </div>

      {/* 3 Circular Mastery Progress Gauges (Matching Bottom Right of Reference Image) */}
      <div className="border-t border-cream pt-4 space-y-2">
        <span className="text-[9.5px] uppercase tracking-widest text-coffee-dark/40 font-bold block">
          Discipline Progress
        </span>

        <div className="grid grid-cols-3 gap-2 pt-1">
          {/* Gauge 1: Posture & Stance */}
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
                  strokeDashoffset={88 * (1 - 0.88)}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <span className="absolute text-[9px] font-bold text-coffee-dark font-mono">88%</span>
            </div>
            <span className="text-[8.5px] uppercase tracking-wider text-coffee-dark/70 font-semibold mt-1">
              Stance
            </span>
          </div>

          {/* Gauge 2: Flexibility */}
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
                  strokeDashoffset={88 * (1 - 0.74)}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <span className="absolute text-[9px] font-bold text-coffee-dark font-mono">74%</span>
            </div>
            <span className="text-[8.5px] uppercase tracking-wider text-coffee-dark/70 font-semibold mt-1">
              Flex
            </span>
          </div>

          {/* Gauge 3: Attendance */}
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
                  strokeDashoffset={88 * (1 - 0.95)}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <span className="absolute text-[9px] font-bold text-coffee-dark font-mono">95%</span>
            </div>
            <span className="text-[8.5px] uppercase tracking-wider text-coffee-dark/70 font-semibold mt-1">
              Batch
            </span>
          </div>
        </div>
      </div>

      {/* Direct Coach Hotline Link */}
      <div className="pt-2">
        <a
          href={`https://wa.me/918778931958?text=${encodeURIComponent(
            `Hello Master, I am ${student.name} (${student.permanentCode || student.tempCode}), enrolled in ${student.course}.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <MessageCircle size={15} />
          <span>Ask Coach on WhatsApp</span>
        </a>
      </div>
    </div>
  );

  return (
    <PortalDashboardLayout
      role="student"
      title={tabTitles[activeTab]}
      subtitle={`${student.course} • Batch: ${student.batch}`}
      breadcrumbs={breadcrumbs}
      navItems={navItems}
      activeNavId={activeTab}
      onNavChange={(id) => setActiveTab(id as typeof activeTab)}
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="Search lessons, drills, or notes..."
      user={{
        name: student.name,
        roleName: `${student.course} Student`,
        badgeCode: student.permanentCode || student.tempCode,
        avatarLetter: student.name.charAt(0),
        phone: student.phone,
        courseOrBatch: student.batch
      }}
      onLogout={handleLogout}
      notificationsCount={meetings.filter((m) => m.isActive).length}
      messagesCount={messages.length}
      rightWidget={rightProfileWidget}
    >
      {/* ========================================================================= */}
      {/* CENTER WORKSPACE CARD                                                    */}
      {/* ========================================================================= */}
      <div className="space-y-6">
        {/* 1. GOOGLE MEET LIVE CLASSROOM */}
        {activeTab === "meet" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Main Classroom Panel */}
            <div className="bg-[#241A1A] text-white p-6 sm:p-8 rounded-3xl border border-cappuccino/30 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-cappuccino/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />

              <div className="max-w-3xl relative z-10 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Live Interactive Classroom</span>
                  </div>

                  <span className="text-[11px] text-white/50 font-mono">
                    Slot: <strong className="text-cappuccino">{student.batch}</strong>
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
                  {activeMeeting?.title || `${student.course} Daily Virtual Class`}
                </h2>

                <p className="text-xs sm:text-sm text-white/75 leading-relaxed font-light">
                  Live session guided by Head Coach. Connect with direct visual corrections, posture analysis, stance feedback, and step-by-step master drills.
                </p>

                {/* Batch & Discipline Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-[#191111] border border-white/10 space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-white/50 block font-semibold">
                      Your Scheduled Batch
                    </span>
                    <p className="text-sm font-bold text-cappuccino flex items-center gap-2">
                      <Clock size={15} />
                      <span>{student.batch}</span>
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#191111] border border-white/10 space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-white/50 block font-semibold">
                      Training Discipline
                    </span>
                    <p className="text-sm font-bold text-white flex items-center gap-2">
                      <Award size={15} className="text-cappuccino" />
                      <span>{student.course} Academy</span>
                    </p>
                  </div>
                </div>

                {/* Join Button */}
                <div className="pt-3">
                  {activeMeeting?.meetUrl ? (
                    <div className="space-y-3">
                      <a
                        href={activeMeeting.meetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#25D366] hover:bg-[#20ba5a] text-black font-extrabold text-xs sm:text-sm uppercase tracking-[0.2em] rounded-full transition-all shadow-[0_0_30px_rgba(37,211,102,0.35)] active:scale-95 cursor-pointer"
                      >
                        <Radio size={18} className="animate-pulse" />
                        <span>Join Live Google Meet</span>
                        <ExternalLink size={16} />
                      </a>

                      <p className="text-[11px] text-white/50 font-mono">
                        Room Link: <span className="text-cappuccino underline">{activeMeeting.meetUrl}</span>
                      </p>
                    </div>
                  ) : (
                    <div className="p-5 rounded-2xl bg-[#191111] text-center border border-white/10">
                      <p className="text-xs sm:text-sm text-white/70">
                        Google Meet room will be launched by the coach 5 minutes before your batch timing ({student.batch}).
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Protocol Guidelines Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-cream shadow-premium space-y-2">
                <div className="w-8 h-8 rounded-xl bg-cappuccino/15 text-cappuccino flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h4 className="font-serif font-bold text-sm text-coffee-dark">Camera Angle &amp; Space</h4>
                <p className="text-xs text-coffee-dark/70 leading-relaxed">
                  Position your camera 6-8 feet away so your full stance, feet alignment, and hand movements are visible.
                </p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-cream shadow-premium space-y-2">
                <div className="w-8 h-8 rounded-xl bg-cappuccino/15 text-cappuccino flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h4 className="font-serif font-bold text-sm text-coffee-dark">Training Gear &amp; Water</h4>
                <p className="text-xs text-coffee-dark/70 leading-relaxed">
                  Wear flexible athletic gear. Keep a practice stick / mat and water bottle ready before login.
                </p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-cream shadow-premium space-y-2">
                <div className="w-8 h-8 rounded-xl bg-cappuccino/15 text-cappuccino flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <h4 className="font-serif font-bold text-sm text-coffee-dark">5-Min Early Warmup</h4>
                <p className="text-xs text-coffee-dark/70 leading-relaxed">
                  Join 5 minutes prior to class time to start joint mobility and breathing drills on schedule.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* 2. YOUTUBE LESSON LIBRARY */}
        {activeTab === "videos" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {filteredVideos.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-cream text-center shadow-premium space-y-3">
                <VideoOff size={36} className="mx-auto text-coffee-dark/40" />
                <h3 className="text-lg font-serif font-bold text-coffee-dark">No Training Videos Found</h3>
                <p className="text-xs text-coffee-dark/60 max-w-sm mx-auto">
                  {searchQuery
                    ? `No lessons matching "${searchQuery}". Try searching with different keywords.`
                    : `Your coach has not uploaded recorded lessons for ${student.course} yet. Check back soon!`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Main Video Player Screen */}
                <div className="lg:col-span-8 space-y-4">
                  {selectedVideo && (
                    <div className="bg-[#241A1A] p-4 sm:p-6 rounded-3xl border border-cappuccino/30 shadow-2xl space-y-4 text-white">
                      <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-inner">
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?rel=0&modestbranding=1`}
                          title={selectedVideo.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full border-0"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-cappuccino text-coffee-dark text-[9px] font-bold uppercase tracking-wider">
                            {selectedVideo.category}
                          </span>
                          <span className="text-[10px] text-white/50 font-mono">
                            Discipline: {selectedVideo.course}
                          </span>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                          {selectedVideo.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">
                          {selectedVideo.description ||
                            "Guided training video provided for regular practice and technique perfection."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Playlist Sidebar */}
                <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-cream shadow-premium space-y-3">
                  <div className="flex items-center justify-between border-b border-cream pb-3">
                    <h4 className="font-serif text-sm font-bold text-coffee-dark">
                      Lesson Playlist ({filteredVideos.length})
                    </h4>
                    <span className="text-[10px] font-mono text-cappuccino font-bold uppercase">
                      {student.course}
                    </span>
                  </div>

                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                    {filteredVideos.map((vid) => {
                      const isSelected = selectedVideo?.id === vid.id;
                      return (
                        <div
                          key={vid.id}
                          onClick={() => setSelectedVideo(vid)}
                          className={`
                            p-2.5 rounded-2xl border transition-all cursor-pointer flex gap-3 items-center
                            ${
                              isSelected
                                ? "bg-[#241A1A] text-white border-cappuccino/60 shadow-md"
                                : "bg-[#FAF7F2] text-coffee-dark border-cream hover:border-cappuccino/40"
                            }
                          `}
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

        {/* 3. DOUBT & CORRECTION DESK */}
        {activeTab === "doubt" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="bg-[#241A1A] rounded-3xl border border-cappuccino/30 shadow-2xl overflow-hidden flex flex-col h-[560px]">
              {/* Chat Header */}
              <div className="p-4 bg-[#1D1414] border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full border border-cappuccino/50 bg-[#241A1A] p-1 flex items-center justify-center shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/images/logo_gold.jpeg"
                        alt="Coach"
                        className="w-full h-full object-contain rounded-full"
                      />
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#25D366] border-2 border-[#1D1414]" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-white flex items-center gap-1.5">
                      <span>Vajra Head Coach Desk</span>
                      <ShieldCheck size={14} className="text-cappuccino" />
                    </h4>
                    <p className="text-[10px] text-[#25D366] font-medium">
                      Online • Direct Feedback &amp; Stance Corrections
                    </p>
                  </div>
                </div>

                <a
                  href={`https://wa.me/918778931958?text=${encodeURIComponent(
                    `Hello Master, I am ${student.name} (${student.permanentCode}), student of ${student.course}. I have a doubt regarding today's training.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] text-xs font-bold hover:bg-[#25D366] hover:text-black transition-all"
                >
                  <MessageCircle size={13} />
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* Quick Doubt Prompts */}
              <div className="px-4 py-2 bg-[#170F0F] border-b border-white/5 flex gap-2 overflow-x-auto scrollbar-none text-[11px]">
                <span className="text-white/40 uppercase tracking-wider text-[9px] self-center shrink-0 font-bold">
                  Quick Doubts:
                </span>
                {[
                  "How to correct wrist angle in Silambam?",
                  "Can I attend the evening batch today?",
                  "Please guide me on diet before morning class",
                  "My stance feels unbalanced during kicks"
                ].map((quick, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSendMessage(undefined, quick)}
                    className="px-3 py-1 rounded-full bg-white/5 hover:bg-cappuccino hover:text-coffee-dark text-white/80 border border-white/10 whitespace-nowrap transition-all cursor-pointer shrink-0 text-[10.5px]"
                  >
                    {quick}
                  </button>
                ))}
              </div>

              {/* Messages Display */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 bg-[#130D0D]">
                {messages.length === 0 ? (
                  <div className="text-center py-16 space-y-2 text-white/40">
                    <HelpCircle size={32} className="mx-auto text-cappuccino/60" />
                    <p className="text-xs sm:text-sm">No doubts asked yet.</p>
                    <p className="text-[11px] text-white/30">
                      Type your question below to receive direct guidance from your master coach!
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.sender === "student";
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[70%] p-3 rounded-2xl text-xs leading-relaxed shadow-md ${
                            isMe
                              ? "bg-[#005c4b] text-white rounded-tr-none"
                              : "bg-[#241A1A] text-white/95 rounded-tl-none border border-cappuccino/30"
                          }`}
                        >
                          {!isMe && (
                            <span className="text-[10px] font-bold text-cappuccino block mb-1">
                              Vajra Master Coach
                            </span>
                          )}
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                          <div
                            className={`flex items-center justify-end gap-1 text-[9px] mt-1.5 ${
                              isMe ? "text-white/70" : "text-white/40"
                            }`}
                          >
                            <span>
                              {new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </span>
                            {isMe && <CheckCheck size={13} className="text-[#53bdeb]" />}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 bg-[#1D1414] border-t border-white/10 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  placeholder="Type your question or technique doubt for the Coach..."
                  className="flex-1 bg-[#130D0D] border border-white/10 focus:border-cappuccino text-white rounded-full px-4 py-2 text-xs focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={chatSending || !newMessageText.trim()}
                  className="w-9 h-9 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-black flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer shrink-0 shadow-md active:scale-95"
                >
                  <Send size={15} />
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* 4. STUDENT ENROLLMENT PROFILE */}
        {activeTab === "profile" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream shadow-premium space-y-6">
              {/* Profile Card Header */}
              <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-cream">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#241A1A] text-cappuccino border border-cappuccino/40 flex items-center justify-center font-serif text-2xl font-bold">
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-coffee-dark">
                      {student.name}
                    </h3>
                    <p className="text-xs text-coffee-dark/60">
                      Permanent Student ID:{" "}
                      <strong className="text-cappuccino font-mono text-sm">
                        {student.permanentCode || "Approved"}
                      </strong>
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold uppercase tracking-wider">
                  Active Member
                </span>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-cream space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-coffee-dark/50 font-bold block">
                    Enrolled Discipline
                  </span>
                  <p className="text-sm font-bold text-coffee-dark flex items-center gap-2">
                    <Award size={15} className="text-cappuccino" />
                    <span>{student.course}</span>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-cream space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-coffee-dark/50 font-bold block">
                    Assigned Batch Timing
                  </span>
                  <p className="text-sm font-bold text-coffee-dark flex items-center gap-2">
                    <Clock size={15} className="text-cappuccino" />
                    <span>{student.batch}</span>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-cream space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-coffee-dark/50 font-bold block">
                    Phone (WhatsApp Registered)
                  </span>
                  <p className="text-sm font-bold text-coffee-dark flex items-center gap-2">
                    <Phone size={15} className="text-cappuccino" />
                    <span>+91 {student.phone}</span>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-cream space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-coffee-dark/50 font-bold block">
                    Location &amp; Campus
                  </span>
                  <p className="text-sm font-bold text-coffee-dark flex items-center gap-2">
                    <MapPin size={15} className="text-cappuccino" />
                    <span>{student.city || "Ariyalur"}</span>
                  </p>
                </div>
              </div>

              {/* Academy Creed */}
              <div className="p-5 rounded-2xl bg-[#241A1A] text-white space-y-2 border border-cappuccino/20">
                <h4 className="font-serif font-bold text-sm text-cappuccino">
                  Vajra Fitness Arts Training Creed
                </h4>
                <p className="text-xs text-white/75 leading-relaxed font-light">
                  &ldquo;Consistency over intensity. Discipline over emotion. Respect for the ancient arts and dedication to daily physical mastery.&rdquo;
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </PortalDashboardLayout>
  );
}
