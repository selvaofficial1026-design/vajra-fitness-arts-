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

export default function StudentPortalPage() {
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState<"profile" | "videos" | "meet" | "doubt">("meet");

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
      const res = await fetch(`/api/portal/meet?course=${encodeURIComponent(std.course)}&batch=${encodeURIComponent(std.batch)}`);
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

  // Auto-refresh chat periodically
  useEffect(() => {
    if (!student) return;
    const interval = setInterval(() => {
      fetchMessages(student.id);
    }, 5000);
    return () => clearInterval(interval);
  }, [student]);

  // Send a Doubt / Message
  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = (customText || newMessageText).trim();
    if (!textToSend || !student) return;

    setChatSending(true);
    try {
      const res = await fetch("/api/portal/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: student.id,
          sender: "student",
          text: textToSend
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
      <div className="min-h-screen bg-background flex items-center justify-center text-cappuccino">
        Loading Student Portal...
      </div>
    );
  }

  // Active meeting for student's course/batch
  const activeMeeting = meetings.find((m) => m.isActive) || meetings[0];

  return (
    <main className="min-h-screen bg-background text-coffee-dark pt-24 pb-20 px-4 sm:px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Student Header Bar */}
        <div className="bg-[#241A1A] text-white p-5 sm:p-7 rounded-3xl border border-cappuccino/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cappuccino/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />

          <div className="flex items-center gap-4 z-10">
            <div className="w-14 h-14 rounded-2xl bg-cappuccino/20 border border-cappuccino/40 flex items-center justify-center text-cappuccino font-serif text-2xl font-bold shrink-0">
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-white leading-none">
                  {student.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-cappuccino/20 border border-cappuccino/50 text-cappuccino text-[10px] font-mono font-bold uppercase tracking-wider">
                  {student.permanentCode || "Approved"}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active Student
                </span>
              </div>
              <p className="text-xs text-white/70">
                Course: <strong className="text-cappuccino">{student.course}</strong> • Batch:{" "}
                <span className="text-white/90">{student.batch}</span>
              </p>
            </div>
          </div>

          {/* Quick Actions & Logout */}
          <div className="flex items-center gap-3 z-10 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/10 pt-3 md:pt-0">
            <div className="text-left md:text-right text-[11px] text-white/60">
              <span className="block text-white/40 uppercase tracking-widest text-[9px]">Class Slot</span>
              <span className="font-semibold text-cappuccino">{student.batch.split("(")[0]}</span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 bg-white/10 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/40 text-white/80 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-white/10 flex items-center gap-2 cursor-pointer"
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* 4 Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 bg-white p-2 rounded-2xl border border-cream shadow-premium">
          <button
            type="button"
            onClick={() => setActiveTab("meet")}
            className={`py-3 sm:py-3.5 px-3 rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "meet"
                ? "bg-[#241A1A] text-white shadow-md border border-cappuccino/40"
                : "text-coffee-dark/60 hover:text-coffee-dark hover:bg-cream/40"
            }`}
          >
            <Radio size={16} className={activeTab === "meet" ? "text-emerald-400 animate-pulse" : ""} />
            <span>Google Meet</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("videos")}
            className={`py-3 sm:py-3.5 px-3 rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "videos"
                ? "bg-[#241A1A] text-white shadow-md border border-cappuccino/40"
                : "text-coffee-dark/60 hover:text-coffee-dark hover:bg-cream/40"
            }`}
          >
            <Video size={16} className={activeTab === "videos" ? "text-cappuccino" : ""} />
            <span>YouTube Videos</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("doubt")}
            className={`py-3 sm:py-3.5 px-3 rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "doubt"
                ? "bg-[#241A1A] text-white shadow-md border border-cappuccino/40"
                : "text-coffee-dark/60 hover:text-coffee-dark hover:bg-cream/40"
            }`}
          >
            <MessageSquare size={16} className={activeTab === "doubt" ? "text-green-400" : ""} />
            <span>Ask Doubt</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`py-3 sm:py-3.5 px-3 rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "profile"
                ? "bg-[#241A1A] text-white shadow-md border border-cappuccino/40"
                : "text-coffee-dark/60 hover:text-coffee-dark hover:bg-cream/40"
            }`}
          >
            <User size={16} className={activeTab === "profile" ? "text-cappuccino" : ""} />
            <span>My Profile</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="min-h-[480px]">
          {/* 1. GOOGLE MEET SECTION */}
          {activeTab === "meet" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-[#241A1A] text-white p-6 sm:p-10 rounded-3xl border border-cappuccino/30 shadow-2xl relative overflow-hidden">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider mb-4">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Official Live Classroom</span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white mb-2">
                    {activeMeeting?.title || `${student.course} Daily Live Training`}
                  </h2>
                  <p className="text-xs sm:text-sm text-white/70 mb-6 leading-relaxed">
                    Live session with our Head Coach. Practice techniques with direct visual corrections, posture analysis, and step-by-step guidance.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <div className="p-4 rounded-2xl bg-[#191111] border border-white/10 space-y-1">
                      <span className="text-[10px] uppercase tracking-widest text-white/50 block">Your Batch Timing</span>
                      <p className="text-base font-bold text-cappuccino flex items-center gap-2">
                        <Clock size={16} />
                        <span>{student.batch}</span>
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#191111] border border-white/10 space-y-1">
                      <span className="text-[10px] uppercase tracking-widest text-white/50 block">Assigned Discipline</span>
                      <p className="text-base font-bold text-white flex items-center gap-2">
                        <Award size={16} className="text-cappuccino" />
                        <span>{student.course} Online</span>
                      </p>
                    </div>
                  </div>

                  {/* Join Button */}
                  {activeMeeting?.meetUrl ? (
                    <div className="space-y-4">
                      <a
                        href={activeMeeting.meetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-3 px-8 py-5 bg-[#25D366] hover:bg-[#20ba5a] text-black font-extrabold text-sm uppercase tracking-[0.2em] rounded-full transition-all shadow-[0_0_30px_rgba(37,211,102,0.4)] active:scale-95"
                      >
                        <Radio size={20} className="animate-pulse" />
                        <span>Join Live Google Meet</span>
                        <ExternalLink size={18} />
                      </a>

                      <p className="text-[11px] text-white/50">
                        Meeting URL: <span className="font-mono text-cappuccino">{activeMeeting.meetUrl}</span>
                      </p>
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-[#191111] text-center border border-white/10">
                      <p className="text-sm text-white/70">
                        Google Meet link will be published by the coach shortly before batch timing ({student.batch}).
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Online Class Protocol Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-cream shadow-premium space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-cappuccino/20 text-cappuccino flex items-center justify-center font-bold">
                    1
                  </div>
                  <h4 className="font-bold text-sm text-coffee-dark">Camera &amp; Space</h4>
                  <p className="text-xs text-coffee-dark/70 leading-relaxed">
                    Set up your phone/laptop camera with 6x6 feet of clear floor space so full body movements can be reviewed.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-cream shadow-premium space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-cappuccino/20 text-cappuccino flex items-center justify-center font-bold">
                    2
                  </div>
                  <h4 className="font-bold text-sm text-coffee-dark">Training Attire</h4>
                  <p className="text-xs text-coffee-dark/70 leading-relaxed">
                    Wear comfortable stretchable track pants and T-shirt. Keep a water bottle and yoga mat handy.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-cream shadow-premium space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-cappuccino/20 text-cappuccino flex items-center justify-center font-bold">
                    3
                  </div>
                  <h4 className="font-bold text-sm text-coffee-dark">Join 5 Mins Early</h4>
                  <p className="text-xs text-coffee-dark/70 leading-relaxed">
                    Please join the Google Meet room 5 minutes before your batch start time to complete warm-up drills on schedule.
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
              className="space-y-6"
            >
              {videos.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-cream text-center shadow-premium">
                  <VideoOff size={40} className="mx-auto text-coffee-dark/40 mb-3" />
                  <h3 className="text-lg font-serif font-bold text-coffee-dark">No Training Videos Yet</h3>
                  <p className="text-xs text-coffee-dark/60 mt-1">
                    Your coach has not uploaded recorded lessons for {student.course} yet. Check back soon!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Player Screen */}
                  <div className="lg:col-span-2 space-y-4">
                    {selectedVideo && (
                      <div className="bg-[#241A1A] p-4 sm:p-6 rounded-3xl border border-cappuccino/30 shadow-2xl space-y-4">
                        <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-inner">
                          <iframe
                            src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?rel=0&modestbranding=1`}
                            title={selectedVideo.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full border-0"
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="px-2.5 py-0.5 rounded-full bg-cappuccino text-coffee-dark text-[9px] font-bold uppercase tracking-wider">
                              {selectedVideo.category}
                            </span>
                            <span className="text-[10px] text-white/50">
                              Discipline: {selectedVideo.course}
                            </span>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-2">
                            {selectedVideo.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">
                            {selectedVideo.description || "Guided training video provided for regular practice and technique perfection."}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Video Playlist */}
                  <div className="space-y-3">
                    <h4 className="font-serif text-base font-bold text-coffee-dark">
                      {student.course} Lesson Library ({videos.length})
                    </h4>
                    <div className="space-y-2.5 max-h-[550px] overflow-y-auto pr-1">
                      {videos.map((vid) => {
                        const isSelected = selectedVideo?.id === vid.id;
                        return (
                          <div
                            key={vid.id}
                            onClick={() => setSelectedVideo(vid)}
                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex gap-3 items-center ${
                              isSelected
                                ? "bg-[#241A1A] text-white border-cappuccino shadow-md"
                                : "bg-white text-coffee-dark border-cream hover:border-cappuccino/40"
                            }`}
                          >
                            <div className="w-16 h-12 bg-coffee-dark/80 rounded-xl flex items-center justify-center shrink-0 relative overflow-hidden group">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={`https://img.youtube.com/vi/${vid.youtubeId}/mqdefault.jpg`}
                                alt={vid.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <Play size={14} className="text-white fill-white" />
                              </div>
                            </div>

                            <div className="min-w-0 flex-1">
                              <span className="text-[9px] uppercase tracking-wider text-cappuccino font-bold block truncate">
                                {vid.category}
                              </span>
                              <h5 className="font-bold text-xs truncate leading-snug">
                                {vid.title}
                              </h5>
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

          {/* 3. ASK DOUBT (WHATSAPP-STYLE TWO-WAY CHAT) */}
          {activeTab === "doubt" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-[#241A1A] rounded-3xl border border-cappuccino/30 shadow-2xl overflow-hidden flex flex-col h-[620px]">
                {/* WhatsApp Chat Header */}
                <div className="p-4 bg-[#1b1414] border-b border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-11 h-11 rounded-full bg-cappuccino/20 border border-cappuccino/50 flex items-center justify-center text-cappuccino font-bold text-lg shrink-0">
                        V
                      </div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#25D366] border-2 border-[#1b1414]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                        <span>Head Coach &amp; Master Desk</span>
                        <ShieldCheck size={14} className="text-cappuccino" />
                      </h4>
                      <p className="text-[11px] text-[#25D366] font-medium">
                        Online • Vajra Virtual Helpdesk
                      </p>
                    </div>
                  </div>

                  {/* Fallback Direct WhatsApp Link */}
                  <a
                    href={`https://wa.me/918778931958?text=${encodeURIComponent(
                      `Hello Master, I am ${student.name} (${student.permanentCode}), student of ${student.course}. I have a doubt regarding today's training.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] text-xs font-bold hover:bg-[#25D366] hover:text-black transition-all"
                  >
                    <MessageCircle size={14} />
                    <span>Open in WhatsApp</span>
                  </a>
                </div>

                {/* Quick Doubt Prompts */}
                <div className="px-4 py-2 bg-[#191111] border-b border-white/5 flex gap-2 overflow-x-auto scrollbar-none text-[11px]">
                  <span className="text-white/40 uppercase tracking-wider text-[9px] self-center shrink-0">
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
                      className="px-3 py-1 rounded-full bg-white/5 hover:bg-cappuccino hover:text-coffee-dark text-white/80 border border-white/10 whitespace-nowrap transition-all cursor-pointer shrink-0"
                    >
                      {quick}
                    </button>
                  ))}
                </div>

                {/* Messages Scroll Area */}
                <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 bg-[#130d0d] bg-opacity-95">
                  {messages.length === 0 ? (
                    <div className="text-center py-16 space-y-2 text-white/40">
                      <HelpCircle size={36} className="mx-auto text-cappuccino/60" />
                      <p className="text-sm">No doubts asked yet.</p>
                      <p className="text-xs text-white/30">
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
                            className={`max-w-[82%] sm:max-w-[70%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-md relative ${
                              isMe
                                ? "bg-[#005c4b] text-white rounded-tr-none"
                                : "bg-[#241A1A] text-white/95 rounded-tl-none border border-cappuccino/30"
                            }`}
                          >
                            {!isMe && (
                              <span className="text-[10px] font-bold text-cappuccino block mb-0.5">
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
                  className="p-3 bg-[#1b1414] border-t border-white/10 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    placeholder="Type your doubt or question for the Coach..."
                    className="flex-1 bg-[#120b0b] border border-white/10 focus:border-cappuccino text-white rounded-full px-5 py-3 text-xs sm:text-sm focus:outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={chatSending || !newMessageText.trim()}
                    className="w-11 h-11 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-black flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer shrink-0 shadow-lg active:scale-95"
                  >
                    <Send size={16} />
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
              className="max-w-3xl mx-auto space-y-6"
            >
              <div className="bg-white p-6 sm:p-10 rounded-3xl border border-cream shadow-premium space-y-6">
                <div className="flex items-center gap-4 pb-6 border-b border-cream">
                  <div className="w-16 h-16 rounded-2xl bg-coffee-dark text-cappuccino flex items-center justify-center font-serif text-3xl font-bold">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-coffee-dark">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-background border border-cream space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-coffee-dark/50 font-bold block">
                      Enrolled Discipline
                    </span>
                    <p className="text-sm font-bold text-coffee-dark flex items-center gap-2">
                      <Award size={16} className="text-cappuccino" />
                      <span>{student.course}</span>
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-background border border-cream space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-coffee-dark/50 font-bold block">
                      Batch Slot
                    </span>
                    <p className="text-sm font-bold text-coffee-dark flex items-center gap-2">
                      <Clock size={16} className="text-cappuccino" />
                      <span>{student.batch}</span>
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-background border border-cream space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-coffee-dark/50 font-bold block">
                      Phone Number (WhatsApp)
                    </span>
                    <p className="text-sm font-bold text-coffee-dark flex items-center gap-2">
                      <Phone size={16} className="text-cappuccino" />
                      <span>+91 {student.phone}</span>
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-background border border-cream space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-coffee-dark/50 font-bold block">
                      Location / City
                    </span>
                    <p className="text-sm font-bold text-coffee-dark flex items-center gap-2">
                      <MapPin size={16} className="text-cappuccino" />
                      <span>{student.city || "Ariyalur"}</span>
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#241A1A] text-white space-y-2">
                  <h4 className="font-bold text-sm text-cappuccino">
                    Vajra Fitness Arts Training Creed
                  </h4>
                  <p className="text-xs text-white/70 leading-relaxed font-light">
                    &ldquo;Consistency over intensity. Discipline over emotion. Respect for the ancient arts and dedication to daily physical mastery.&rdquo;
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
