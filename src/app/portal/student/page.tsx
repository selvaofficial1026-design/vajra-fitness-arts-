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
  AlertCircle
} from "lucide-react";
import { Student, ClassMeeting, VideoClass, ChatMessage } from "@/lib/portalStore";
import PortalNavbar, { PortalNavItem } from "@/components/portal/PortalNavbar";
import PortalLoadingScreen from "@/components/portal/PortalLoadingScreen";

export default function StudentPortalPage() {
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState<"meet" | "videos" | "doubt" | "profile">("meet");
  const [pageLoading, setPageLoading] = useState(true);

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

  // Navigation Items matching website navbar style
  const navItems: PortalNavItem[] = [
    { id: "meet", label: "Live Classroom", icon: Radio },
    { id: "videos", label: "Videos", icon: Video, badge: videos.length || undefined },
    { id: "doubt", label: "Ask Doubt", icon: MessageSquare, badge: messages.length || undefined },
    { id: "profile", label: "My Profile", icon: User }
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

  // Active meeting for student's course/batch
  const activeMeeting = meetings.find((m) => m.isActive) || meetings[0];

  return (
    <>
      {/* Luxury Loading Screen shown when opening portal */}
      <PortalLoadingScreen
        show={pageLoading}
        role="student"
        title="Vajra Student Classroom"
        subtitle={`Welcome back, ${student.name}. Connecting to ${student.course} live batch...`}
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
      />

      {/* Main Student Page Content */}
      <main className="min-h-screen bg-background text-coffee-dark pt-28 sm:pt-32 md:pt-36 pb-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Top Student Welcome Banner Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#241A1A] text-white p-5 sm:p-7 rounded-3xl border border-cappuccino/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-cappuccino/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />

            <div className="flex items-center gap-4 z-10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-cappuccino/20 border border-cappuccino/40 flex items-center justify-center text-cappuccino font-serif text-xl sm:text-2xl font-bold shrink-0">
                {student.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-xl sm:text-2xl font-serif font-bold text-white leading-none">
                    {student.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-cappuccino/20 border border-cappuccino/50 text-cappuccino text-[10px] font-mono font-bold uppercase tracking-wider">
                    {student.permanentCode || student.tempCode}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Active Student
                  </span>
                </div>
                <p className="text-xs text-white/70">
                  Discipline: <strong className="text-cappuccino">{student.course}</strong> • Batch Slot:{" "}
                  <span className="text-white/90">{student.batch}</span>
                </p>
              </div>
            </div>

            {/* Live Class Quick Pill on Banner */}
            <div className="z-10 w-full md:w-auto flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
              <div className="text-left md:text-right text-[11px] text-white/60">
                <span className="block text-white/40 uppercase tracking-widest text-[9px] font-bold">
                  Class Timing
                </span>
                <span className="font-semibold text-cappuccino font-mono">
                  {student.batch.split("(")[0]}
                </span>
              </div>

              {activeMeeting?.meetUrl ? (
                <a
                  href={activeMeeting.meetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#25D366] hover:bg-[#20ba5a] text-black font-extrabold text-xs uppercase tracking-wider rounded-full shadow-md transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <Radio size={14} className="animate-pulse" />
                  <span>Join Class</span>
                </a>
              ) : (
                <span className="px-3 py-1.5 rounded-full bg-white/10 text-white/70 text-[11px] font-mono">
                  Room Pending
                </span>
              )}
            </div>
          </motion.div>

          {/* Tab Content Display Area */}
          <div className="min-h-[480px]">
            {/* 1. GOOGLE MEET SECTION */}
            {activeTab === "meet" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="bg-[#241A1A] text-white p-6 sm:p-8 rounded-3xl border border-cappuccino/30 shadow-2xl relative overflow-hidden">
                  <div className="max-w-3xl space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>Official Live Classroom</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                      {activeMeeting?.title || `${student.course} Daily Live Training`}
                    </h2>
                    <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">
                      Live session guided by Head Coach. Practice techniques with direct visual corrections, posture analysis, and step-by-step master drills.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="p-4 rounded-2xl bg-[#191111] border border-white/10 space-y-1">
                        <span className="text-[10px] uppercase tracking-widest text-white/50 block font-bold">
                          Your Scheduled Batch
                        </span>
                        <p className="text-sm font-bold text-cappuccino flex items-center gap-2">
                          <Clock size={16} />
                          <span>{student.batch}</span>
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#191111] border border-white/10 space-y-1">
                        <span className="text-[10px] uppercase tracking-widest text-white/50 block font-bold">
                          Enrolled Discipline
                        </span>
                        <p className="text-sm font-bold text-white flex items-center gap-2">
                          <Award size={16} className="text-cappuccino" />
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
                            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#25D366] hover:bg-[#20ba5a] text-black font-extrabold text-xs sm:text-sm uppercase tracking-[0.2em] rounded-full transition-all shadow-[0_0_30px_rgba(37,211,102,0.4)] active:scale-95 cursor-pointer"
                          >
                            <Radio size={18} className="animate-pulse" />
                            <span>Join Live Google Meet</span>
                            <ExternalLink size={16} />
                          </a>

                          <p className="text-[11px] text-white/50 font-mono">
                            Room URL: <span className="text-cappuccino underline">{activeMeeting.meetUrl}</span>
                          </p>
                        </div>
                      ) : (
                        <div className="p-6 rounded-2xl bg-[#191111] text-center border border-white/10">
                          <p className="text-xs sm:text-sm text-white/70">
                            Google Meet link will be published by the coach shortly before your batch timing ({student.batch}).
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Class Guidelines Protocol */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-3xl border border-cream shadow-premium space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-cappuccino/20 text-cappuccino flex items-center justify-center font-bold text-xs">
                      1
                    </div>
                    <h4 className="font-serif font-bold text-sm text-coffee-dark">Camera &amp; Floor Space</h4>
                    <p className="text-xs text-coffee-dark/70 leading-relaxed">
                      Set up your camera with 6x6 feet of clear floor space so full body movements can be evaluated.
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-cream shadow-premium space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-cappuccino/20 text-cappuccino flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <h4 className="font-serif font-bold text-sm text-coffee-dark">Training Attire</h4>
                    <p className="text-xs text-coffee-dark/70 leading-relaxed">
                      Wear comfortable stretchable athletic gear. Keep a practice stick/mat and water bottle ready.
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-cream shadow-premium space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-cappuccino/20 text-cappuccino flex items-center justify-center font-bold text-xs">
                      3
                    </div>
                    <h4 className="font-serif font-bold text-sm text-coffee-dark">Join 5 Mins Early</h4>
                    <p className="text-xs text-coffee-dark/70 leading-relaxed">
                      Please join the Google Meet room 5 minutes prior to your batch start time to complete warm-up drills on schedule.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. VIDEOS FETCH FROM YOUTUBE */}
            {activeTab === "videos" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {videos.length === 0 ? (
                  <div className="bg-white p-12 rounded-3xl border border-cream text-center shadow-premium space-y-2">
                    <VideoOff size={36} className="mx-auto text-coffee-dark/40" />
                    <h3 className="text-lg font-serif font-bold text-coffee-dark">No Training Videos Yet</h3>
                    <p className="text-xs text-coffee-dark/60">
                      Your coach has not uploaded recorded lessons for {student.course} yet. Check back soon!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Main Video Player */}
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
                                  ? "bg-[#241A1A] text-white border-cappuccino/60 shadow-md"
                                  : "bg-[#FAF7F2] text-coffee-dark border-cream hover:border-cappuccino/40"
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

            {/* 3. DOUBT & CORRECTION DESK (WHATSAPP STYLE) */}
            {activeTab === "doubt" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
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
                          Online • Direct Guidance &amp; Posture Corrections
                        </p>
                      </div>
                    </div>

                    <a
                      href={`https://wa.me/918778931958?text=${encodeURIComponent(
                        `Hello Master, I am ${student.name} (${student.permanentCode}), student of ${student.course}. I have a doubt regarding today's training.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] text-xs font-bold hover:bg-[#25D366] hover:text-black transition-all cursor-pointer"
                    >
                      <MessageCircle size={13} />
                      <span>WhatsApp App</span>
                    </a>
                  </div>

                  {/* Quick Prompts */}
                  <div className="px-4 py-2 bg-[#170F0F] border-b border-white/5 flex gap-2 overflow-x-auto scrollbar-none text-[11px]">
                    <span className="text-white/40 uppercase tracking-wider text-[9px] self-center shrink-0 font-bold">
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
                        className="px-3 py-1 rounded-full bg-white/5 hover:bg-cappuccino hover:text-coffee-dark text-white/80 border border-white/10 whitespace-nowrap transition-all cursor-pointer shrink-0 text-[10.5px]"
                      >
                        {quick}
                      </button>
                    ))}
                  </div>

                  {/* Messages Canvas */}
                  <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 bg-[#130D0D]">
                    {messages.length === 0 ? (
                      <div className="text-center py-16 space-y-2 text-white/40">
                        <HelpCircle size={32} className="mx-auto text-cappuccino/60" />
                        <p className="text-xs sm:text-sm">No doubts asked yet.</p>
                        <p className="text-[11px] text-white/30">
                          Type your question below to chat directly with your instructor!
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
                                  Vajra Head Coach
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
                      placeholder="Type your doubt or question for the Coach..."
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

            {/* 4. STUDENT PROFILE SECTION */}
            {activeTab === "profile" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-3xl mx-auto space-y-6"
              >
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream shadow-premium space-y-6">
                  <div className="flex items-center gap-4 pb-6 border-b border-cream">
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
                          {student.permanentCode || student.tempCode}
                        </strong>
                      </p>
                    </div>
                  </div>

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
                        Batch Slot
                      </span>
                      <p className="text-sm font-bold text-coffee-dark flex items-center gap-2">
                        <Clock size={15} className="text-cappuccino" />
                        <span>{student.batch}</span>
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-cream space-y-1">
                      <span className="text-[10px] uppercase tracking-wider text-coffee-dark/50 font-bold block">
                        Phone Number (WhatsApp)
                      </span>
                      <p className="text-sm font-bold text-coffee-dark flex items-center gap-2">
                        <Phone size={15} className="text-cappuccino" />
                        <span>+91 {student.phone}</span>
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-cream space-y-1">
                      <span className="text-[10px] uppercase tracking-wider text-coffee-dark/50 font-bold block">
                        Location / City
                      </span>
                      <p className="text-sm font-bold text-coffee-dark flex items-center gap-2">
                        <MapPin size={15} className="text-cappuccino" />
                        <span>{student.city || "Ariyalur"}</span>
                      </p>
                    </div>
                  </div>

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
        </div>
      </main>
    </>
  );
}
