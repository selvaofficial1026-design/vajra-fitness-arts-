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
  Loader2,
  Globe,
  Image as ImageIcon,
  BookOpen,
  Sliders,
  Edit3,
  UploadCloud,
  RotateCcw,
  Layout,
  Bell,
  MapPin,
  Mail
} from "lucide-react";
import { cn, extractYoutubeId, formatTimeAgo } from "@/lib/utils";
import {
  Student,
  ClassMeeting,
  VideoClass,
  ChatMessage,
  CourseItem,
  GalleryItem,
  SiteSettings,
  DEFAULT_COURSES,
  DEFAULT_GALLERY,
  DEFAULT_SITE_SETTINGS
} from "@/lib/cmsDefaults";
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
  const [activeTab, setActiveTab] = useState<"students" | "meet" | "videos" | "messages" | "cms">("students");
  const [pageLoading, setPageLoading] = useState(true);

  // --- WEBSITE CMS & MAIN PORTAL MANAGER STATE ---
  const [cmsSubTab, setCmsSubTab] = useState<"courses" | "gallery" | "settings">("courses");
  const [courses, setCourses] = useState<CourseItem[]>(DEFAULT_COURSES);
  const [gallery, setGallery] = useState<GalleryItem[]>(DEFAULT_GALLERY);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  // Course Form State
  const initialCourseForm = {
    id: "",
    name: "",
    subtitle: "",
    category: "Fitness",
    schedule: "Morning: 4:30 AM - 5:15 AM | Evening: 5:00 PM - 5:45 PM",
    level: "All Levels (Beginner to Advanced)",
    age: "Teens & Adults",
    image: "",
    videoId: "dQw4w9WgXcQ",
    description: "",
    syllabus: [
      "Foundational postures and warm-up routines",
      "Skill drills, speed, and endurance conditioning"
    ]
  };
  const [courseForm, setCourseForm] = useState(initialCourseForm);
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [courseSubmitting, setCourseSubmitting] = useState(false);
  const [courseUploading, setCourseUploading] = useState(false);
  const [newSyllabusItem, setNewSyllabusItem] = useState("");

  // Gallery Form State
  const initialGalleryForm = {
    id: "",
    title: "",
    category: "Silambam",
    image: "",
    description: ""
  };
  const [galleryForm, setGalleryForm] = useState(initialGalleryForm);
  const [gallerySubmitting, setGallerySubmitting] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState("All");

  // Settings Form State
  const [settingsSubmitting, setSettingsSubmitting] = useState(false);

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
    course: "All Courses",
    batch: "All Batches",
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
  const [isFetchingTitle, setIsFetchingTitle] = useState(false);
  const [titleFetchStatus, setTitleFetchStatus] = useState<"idle" | "fetching" | "success" | "error">("idle");
  const lastFetchedUrlRef = useRef<string>("");

  // Messaging State (Direct Academy Desk)
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

        if (data.courses && data.courses.length > 0) {
          setCourses(data.courses);
        }
        if (data.gallery && data.gallery.length > 0) {
          setGallery(data.gallery);
        }
        if (data.siteSettings) {
          setSiteSettings(data.siteSettings);
        }

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
          course: "All Courses",
          batch: "All Batches",
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

  // Automatically fetch YouTube video title when URL or ID is provided
  const fetchVideoTitle = async (rawUrl: string, force = false) => {
    const trimmed = rawUrl.trim();
    if (!trimmed) {
      setTitleFetchStatus("idle");
      return;
    }

    const videoId = extractYoutubeId(trimmed);
    if (!videoId || videoId.length !== 11) {
      return;
    }

    // Don't re-fetch if already fetched for this exact videoId unless forced
    if (!force && lastFetchedUrlRef.current === videoId) {
      return;
    }

    setIsFetchingTitle(true);
    setTitleFetchStatus("fetching");
    lastFetchedUrlRef.current = videoId;

    try {
      const res = await fetch(`/api/portal/fetch-youtube-title?url=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      if (data.success && data.title) {
        setNewVideo((prev) => ({
          ...prev,
          title: data.title
        }));
        setTitleFetchStatus("success");
      } else {
        setTitleFetchStatus("error");
      }
    } catch (err) {
      console.error("Failed to auto-fetch video title:", err);
      setTitleFetchStatus("error");
    } finally {
      setIsFetchingTitle(false);
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
        setTitleFetchStatus("idle");
        lastFetchedUrlRef.current = "";
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

  const handleSendReply = async (e?: React.FormEvent, customQuickText?: string) => {
    if (e) e.preventDefault();
    const textToSend = (customQuickText || replyText).trim();
    const targetStudentId = selectedStudentId || activeChatStudent?.id;
    if (!textToSend || !targetStudentId) return;

    setMessageSending(true);
    try {
      const res = await fetch("/api/portal/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: targetStudentId,
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

  // --- CMS HANDLERS ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: "course" | "gallery") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (target === "course") setCourseUploading(true);
    if (target === "gallery") setGalleryUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/portal/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        if (target === "course") {
          setCourseForm((prev) => ({ ...prev, image: data.url }));
        } else {
          setGalleryForm((prev) => ({ ...prev, image: data.url }));
        }
        setActionMessage("Image uploaded successfully!");
        setTimeout(() => setActionMessage(null), 3000);
      } else {
        alert(data.error || "Failed to upload image.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image. You can also paste an image URL directly.");
    } finally {
      if (target === "course") setCourseUploading(false);
      if (target === "gallery") setGalleryUploading(false);
    }
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.name.trim()) return;

    setCourseSubmitting(true);
    try {
      const res = await fetch("/api/portal/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "saveCourse",
          course: {
            ...courseForm,
            videoId: extractYoutubeId(courseForm.videoId) || "dQw4w9WgXcQ"
          }
        })
      });
      const data = await res.json();
      if (data.success && data.courses) {
        setCourses(data.courses);
        setActionMessage(isEditingCourse ? "Course updated on website!" : "New course published to website!");
        setTimeout(() => setActionMessage(null), 4000);
        setCourseForm(initialCourseForm);
        setIsEditingCourse(false);
      } else {
        alert(data.error || "Failed to save course.");
      }
    } catch (err) {
      console.error("Save course error:", err);
    } finally {
      setCourseSubmitting(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("Are you sure you want to remove this course from the main website?")) return;
    try {
      const res = await fetch("/api/portal/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deleteCourse", id: courseId })
      });
      const data = await res.json();
      if (data.success && data.courses) {
        setCourses(data.courses);
        setActionMessage("Course removed from website.");
        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch (err) {
      console.error("Delete course error:", err);
    }
  };

  const handleEditCourse = (course: CourseItem) => {
    setCourseForm({
      id: course.id,
      name: course.name,
      subtitle: course.subtitle,
      category: course.category,
      schedule: course.schedule,
      level: course.level,
      age: course.age,
      image: course.image,
      videoId: course.videoId,
      description: course.description,
      syllabus: course.syllabus || []
    });
    setIsEditingCourse(true);
    setCmsSubTab("courses");
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleAddSyllabusItem = () => {
    if (!newSyllabusItem.trim()) return;
    setCourseForm((prev) => ({
      ...prev,
      syllabus: [...prev.syllabus, newSyllabusItem.trim()]
    }));
    setNewSyllabusItem("");
  };

  const handleRemoveSyllabusItem = (index: number) => {
    setCourseForm((prev) => ({
      ...prev,
      syllabus: prev.syllabus.filter((_, i) => i !== index)
    }));
  };

  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.title.trim() || !galleryForm.image.trim()) return;

    setGallerySubmitting(true);
    try {
      const res = await fetch("/api/portal/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "saveGalleryItem",
          galleryItem: galleryForm
        })
      });
      const data = await res.json();
      if (data.success && data.gallery) {
        setGallery(data.gallery);
        setActionMessage("New photo added to gallery!");
        setTimeout(() => setActionMessage(null), 4000);
        setGalleryForm(initialGalleryForm);
      } else {
        alert(data.error || "Failed to save gallery photo.");
      }
    } catch (err) {
      console.error("Save gallery error:", err);
    } finally {
      setGallerySubmitting(false);
    }
  };

  const handleDeleteGallery = async (id: string | number) => {
    if (!confirm("Are you sure you want to remove this photo from the gallery?")) return;
    try {
      const res = await fetch("/api/portal/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deleteGalleryItem", id })
      });
      const data = await res.json();
      if (data.success && data.gallery) {
        setGallery(data.gallery);
        setActionMessage("Photo removed from gallery.");
        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch (err) {
      console.error("Delete gallery error:", err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSubmitting(true);
    try {
      const res = await fetch("/api/portal/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "saveSettings",
          settings: siteSettings
        })
      });
      const data = await res.json();
      if (data.success && data.siteSettings) {
        setSiteSettings(data.siteSettings);
        setActionMessage("Academy details & notice banner updated successfully!");
        setTimeout(() => setActionMessage(null), 4000);
      }
    } catch (err) {
      console.error("Save settings error:", err);
    } finally {
      setSettingsSubmitting(false);
    }
  };

  const handleResetCms = async (target: "courses" | "gallery" | "settings" | "all") => {
    if (!confirm(`Are you sure you want to reset ${target} back to academy defaults?`)) return;
    try {
      const res = await fetch("/api/portal/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "resetDefaults", target })
      });
      const data = await res.json();
      if (data.success) {
        if (data.courses) setCourses(data.courses);
        if (data.gallery) setGallery(data.gallery);
        if (data.siteSettings) setSiteSettings(data.siteSettings);
        setActionMessage("Reset to academy defaults completed.");
        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch (err) {
      console.error("Reset CMS error:", err);
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

  const activeChatStudent = students.find((s) => s.id === selectedStudentId) || approvedStudents[0];
  const activeChatMessages = activeChatStudent
    ? messages.filter((m) => m.studentId === activeChatStudent.id)
    : [];

  // Auto-mark student messages as read when admin views the active conversation
  useEffect(() => {
    if (activeTab === "messages" && activeChatStudent) {
      const hasUnread = messages.some(
        (m) => m.studentId === activeChatStudent.id && m.sender === "student" && !m.isRead
      );
      if (hasUnread) {
        setMessages((prev) =>
          prev.map((m) =>
            m.studentId === activeChatStudent.id && m.sender === "student"
              ? { ...m, isRead: true }
              : m
          )
        );
        fetch("/api/portal/messages", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId: activeChatStudent.id, sender: "student" })
        }).catch(console.error);
      }
    }
  }, [activeTab, activeChatStudent, messages]);

  // Only count unread messages sent by students (admin's own sent messages never trigger a badge)
  const unreadStudentMessages = messages.filter((m) => m.sender === "student" && !m.isRead);

  // Exact matching nav items - Only pending approvals and unread messages show badges in Admin Panel
  const navItems: PortalNavItem[] = [
    { id: "students", label: "Admissions", badge: pendingStudents.length || undefined },
    { id: "meet", label: "Google Meets" },
    { id: "videos", label: "Videos" },
    { id: "messages", label: "Message Desk", badge: unreadStudentMessages.length || undefined },
    { id: "cms", label: "Website Manager" }
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
      <main className="min-h-screen bg-background text-coffee-dark pt-28 sm:pt-32 md:pt-36 pb-16 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Top Admin Header - Sits directly on background without chunky boxes */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6 pb-6 border-b border-coffee-dark/10">
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-coffee-dark tracking-tight leading-[1.15] sm:leading-tight">
                Admissions &amp; Batch Operations
              </h1>
              <p className="text-xs sm:text-sm text-coffee-dark/65 font-light max-w-xl leading-relaxed pt-0.5">
                Approve new admissions, issue official permanent codes, broadcast live Google Meet classrooms, and manage student training inquiries.
              </p>
            </div>

            {/* Clean inline stat counters separated by hairlines - NO BOXES */}
            <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-7 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-coffee-dark/10">
              <div className="text-left flex-1 sm:flex-initial min-w-0">
                <span className="text-[8.5px] sm:text-[9px] uppercase tracking-wider text-coffee-dark/50 font-bold block truncate">Pending</span>
                <p className="font-mono font-bold text-lg sm:text-xl text-amber-600 mt-0.5 leading-none">
                  {pendingStudents.length}
                </p>
              </div>
              <div className="h-7 sm:h-8 w-[1px] bg-coffee-dark/15 shrink-0" />
              <div className="text-left flex-1 sm:flex-initial min-w-0">
                <span className="text-[8.5px] sm:text-[9px] uppercase tracking-wider text-coffee-dark/50 font-bold block truncate">Enrolled</span>
                <p className="font-mono font-bold text-lg sm:text-xl text-emerald-600 mt-0.5 leading-none">
                  {approvedStudents.length}
                </p>
              </div>
              <div className="h-7 sm:h-8 w-[1px] bg-coffee-dark/15 shrink-0" />
              <div className="text-left flex-1 sm:flex-initial min-w-0">
                <span className="text-[8.5px] sm:text-[9px] uppercase tracking-wider text-coffee-dark/50 font-bold block truncate">Live Rooms</span>
                <p className="font-mono font-bold text-lg sm:text-xl text-cappuccino mt-0.5 leading-none">
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
              className="p-3 sm:p-3.5 rounded-2xl bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center justify-between gap-3 shadow-sm"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <CheckCircle2 size={15} className="shrink-0 text-emerald-400" />
                <span className="break-words leading-snug">{actionMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setActionMessage(null)}
                className="w-8 h-8 min-w-[32px] min-h-[32px] -mr-1 rounded-full flex items-center justify-center text-emerald-400 hover:text-white hover:bg-emerald-900/50 text-lg cursor-pointer shrink-0 transition-colors"
                aria-label="Dismiss message"
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4 pb-3 border-b border-coffee-dark/10">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 sm:flex-wrap">
                  <button
                    type="button"
                    onClick={() => setStudentFilter("pending")}
                    className={cn(
                      "min-h-[40px] px-3.5 sm:px-4 py-2 sm:py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shrink-0 select-none active:scale-95",
                      studentFilter === "pending"
                        ? "bg-coffee-dark text-cappuccino shadow-sm"
                        : "text-coffee-dark/70 hover:text-coffee-dark hover:bg-coffee-dark/5"
                    )}
                  >
                    <Clock size={13} className="shrink-0" />
                    <span>Pending ({pendingStudents.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStudentFilter("approved")}
                    className={cn(
                      "min-h-[40px] px-3.5 sm:px-4 py-2 sm:py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shrink-0 select-none active:scale-95",
                      studentFilter === "approved"
                        ? "bg-coffee-dark text-cappuccino shadow-sm"
                        : "text-coffee-dark/70 hover:text-coffee-dark hover:bg-coffee-dark/5"
                    )}
                  >
                    <CheckCircle2 size={13} className="shrink-0" />
                    <span>Enrolled ({approvedStudents.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStudentFilter("all")}
                    className={cn(
                      "min-h-[40px] px-3.5 sm:px-4 py-2 sm:py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 select-none active:scale-95",
                      studentFilter === "all"
                        ? "bg-coffee-dark text-cappuccino shadow-sm"
                        : "text-coffee-dark/70 hover:text-coffee-dark hover:bg-coffee-dark/5"
                    )}
                  >
                    All ({students.length})
                  </button>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-coffee-dark/40 pointer-events-none" />
                  <input
                    type="text"
                    value={searchStudent}
                    onChange={(e) => setSearchStudent(e.target.value)}
                    placeholder="Search name, phone, code..."
                    className="w-full bg-coffee-dark/[0.03] sm:bg-transparent border border-coffee-dark/15 sm:border-0 sm:border-b sm:border-coffee-dark/20 focus:border-cappuccino rounded-xl sm:rounded-none text-coffee-dark pl-9 pr-8 py-2.5 sm:py-1 text-sm sm:text-xs outline-none placeholder:text-coffee-dark/40 transition-colors min-h-[40px] sm:min-h-0"
                  />
                  {searchStudent && (
                    <button
                      type="button"
                      onClick={() => setSearchStudent("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-coffee-dark/40 hover:text-coffee-dark rounded-full cursor-pointer"
                      title="Clear search"
                    >
                      <XCircle size={14} />
                    </button>
                  )}
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
                        className="py-5 sm:py-6 transition-colors hover:bg-coffee-dark/[0.02] -mx-2 sm:-mx-3 px-2 sm:px-3 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                      >
                        <div className="space-y-2.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                            <h3 className="text-base sm:text-lg font-serif font-bold text-coffee-dark break-words">
                              {std.name}
                            </h3>

                            {isPending ? (
                              <span className="shrink-0 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                <Clock size={11} className="shrink-0" />
                                <span>Pending Approval</span>
                              </span>
                            ) : (
                              <span className="shrink-0 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                <CheckCircle2 size={11} className="shrink-0" />
                                <span>ID: <strong className="font-mono">{std.permanentCode}</strong></span>
                              </span>
                            )}

                            <span className="shrink-0 whitespace-nowrap text-[10px] sm:text-[11px] text-coffee-dark/60 font-mono bg-coffee-dark/[0.04] border border-coffee-dark/10 px-2 py-0.5 rounded-md">
                              Temp: {std.tempCode}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-xs pt-1">
                            <div className="min-w-0">
                              <span className="block text-[9px] uppercase tracking-wider text-coffee-dark/50 font-semibold truncate">
                                Discipline
                              </span>
                              <strong className="text-cappuccino font-medium block text-[11px] sm:text-xs leading-snug break-words">
                                {std.course}
                              </strong>
                            </div>
                            <div className="min-w-0">
                              <span className="block text-[9px] uppercase tracking-wider text-coffee-dark/50 font-semibold truncate">
                                Batch Slot
                              </span>
                              <span className="text-coffee-dark/80 block text-[11px] sm:text-xs leading-snug break-words">
                                {std.batch}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <span className="block text-[9px] uppercase tracking-wider text-coffee-dark/50 font-semibold truncate">
                                Phone Number
                              </span>
                              <a
                                href={`tel:${std.phone}`}
                                className="text-coffee-dark hover:text-cappuccino font-mono font-medium block text-[11px] sm:text-xs truncate"
                              >
                                +91 {std.phone}
                              </a>
                            </div>
                            <div className="min-w-0">
                              <span className="block text-[9px] uppercase tracking-wider text-coffee-dark/50 font-semibold truncate">
                                Location / Age
                              </span>
                              <span className="text-coffee-dark/80 block text-[11px] sm:text-xs leading-snug break-words">
                                {std.city || "Ariyalur"} • {std.age || "N/A"} yrs
                              </span>
                            </div>
                          </div>

                          {std.notes && (
                            <p className="text-[11px] sm:text-xs italic text-coffee-dark/65 pt-0.5 break-words">
                              &ldquo;{std.notes}&rdquo;
                            </p>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto shrink-0 pt-2 lg:pt-0">
                          {isPending ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApproveStudent(std.id)}
                                className="flex-1 sm:flex-initial min-h-[42px] px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-full shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                              >
                                <CheckCircle2 size={14} className="shrink-0" />
                                <span>Approve &amp; Assign ID</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleRejectStudent(std.id)}
                                className="h-[42px] w-[42px] min-h-[42px] min-w-[42px] flex items-center justify-center text-red-500 hover:text-red-600 hover:bg-red-500/10 active:bg-red-500/20 rounded-full border border-red-500/20 transition-colors cursor-pointer shrink-0"
                                title="Reject enrollment"
                                aria-label="Reject enrollment"
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
                              className="w-full sm:w-auto min-h-[42px] px-4 py-2.5 bg-coffee-dark hover:bg-cappuccino text-white hover:text-coffee-dark font-bold text-xs uppercase tracking-wider rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                            >
                              <MessageSquare size={13} className="shrink-0" />
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
                      <label className="text-[10px] uppercase tracking-wider text-coffee-dark/60 font-bold block mb-1.5">
                        Discipline Course
                      </label>
                      <select
                        value={newMeet.course}
                        onChange={(e) => setNewMeet({ ...newMeet, course: e.target.value })}
                        className="w-full min-h-[44px] bg-white/60 focus:bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 py-2.5 sm:py-2 text-base sm:text-xs focus:outline-none cursor-pointer transition-colors shadow-sm"
                      >
                        <option value="All Courses">All Courses (All Students)</option>
                        {courseOptions.filter((c) => c !== "All Courses").map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-coffee-dark/60 font-bold block mb-1.5">
                        Target Batch Slot
                      </label>
                      <select
                        value={newMeet.batch}
                        onChange={(e) => setNewMeet({ ...newMeet, batch: e.target.value })}
                        className="w-full min-h-[44px] bg-white/60 focus:bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 py-2.5 sm:py-2 text-base sm:text-xs focus:outline-none cursor-pointer transition-colors shadow-sm"
                      >
                        <option value="All Batches">All Batches (Common Session)</option>
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
                      <label className="text-[10px] uppercase tracking-wider text-coffee-dark/60 font-bold block mb-1.5">
                        Class Topic / Title
                      </label>
                      <input
                        type="text"
                        value={newMeet.title}
                        onChange={(e) => setNewMeet({ ...newMeet, title: e.target.value })}
                        className="w-full min-h-[44px] bg-white/60 focus:bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 py-2.5 sm:py-2 text-base sm:text-xs focus:outline-none transition-colors shadow-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-coffee-dark/60 font-bold block mb-1.5">
                        Google Meet URL (https://meet.google.com/...)
                      </label>
                      <input
                        type="url"
                        value={newMeet.meetUrl}
                        onChange={(e) => setNewMeet({ ...newMeet, meetUrl: e.target.value })}
                        className="w-full min-h-[44px] bg-white/60 focus:bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 py-2.5 sm:py-2 text-base sm:text-xs font-mono focus:outline-none transition-colors shadow-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={meetSubmitting}
                      className="w-full sm:w-auto min-h-[44px] px-6 py-3 sm:py-2.5 bg-coffee-dark hover:bg-cappuccino text-white hover:text-coffee-dark font-bold text-xs uppercase tracking-wider rounded-full transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      <Radio size={14} className={cn(meetSubmitting && "animate-spin")} />
                      <span>{meetSubmitting ? "Publishing Room..." : "Publish Google Meet Room"}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Scheduled Classrooms List */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                  <h4 className="font-serif text-lg font-bold text-coffee-dark">
                    Active &amp; Scheduled Class Rooms ({meetings.length})
                  </h4>
                  <span className="text-[10px] uppercase tracking-wider text-coffee-dark/50 font-mono">
                    Updated Daily
                  </span>
                </div>

                {meetings.length === 0 ? (
                  <div className="py-8 text-center bg-coffee-dark/[0.02] rounded-2xl border border-dashed border-coffee-dark/15 px-4">
                    <Video className="w-8 h-8 mx-auto text-coffee-dark/30 mb-2" />
                    <p className="text-sm font-semibold text-coffee-dark/70">No active Google Meet rooms scheduled</p>
                    <p className="text-xs text-coffee-dark/50 mt-1">Publish a room link above for students to join daily live classes.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-coffee-dark/10">
                    {meetings.map((meet) => (
                      <div
                        key={meet.id}
                        className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 hover:bg-coffee-dark/[0.02] -mx-2 px-2 sm:px-3 rounded-xl transition-colors"
                      >
                        <div className="space-y-1.5 min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                            <span className="px-2 py-0.5 rounded-full bg-cappuccino/15 text-coffee-dark text-[9px] font-bold uppercase tracking-wider shrink-0">
                              {meet.course}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-coffee-dark/5 text-coffee-dark/70 text-[9px] font-semibold tracking-wide shrink-0">
                              {meet.batch}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-[9px] font-bold uppercase tracking-wider shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              {meet.scheduledTime || "Daily Class"}
                            </span>
                            {meet.createdAt && (
                              <span className="px-2 py-0.5 rounded-full bg-coffee-dark/5 text-coffee-dark/60 text-[9px] font-medium tracking-wide shrink-0">
                                {formatTimeAgo(meet.createdAt)}
                              </span>
                            )}
                          </div>
                          <h5 className="font-bold text-sm text-coffee-dark break-words">{meet.title}</h5>
                          <a
                            href={meet.meetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-emerald-700 hover:underline font-mono break-all sm:truncate block max-w-full"
                            title={meet.meetUrl}
                          >
                            {meet.meetUrl}
                          </a>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 shrink-0 pt-1 sm:pt-0 self-stretch sm:self-center justify-between sm:justify-end">
                          <a
                            href={meet.meetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 sm:flex-none min-h-[40px] px-4 py-2 rounded-full bg-coffee-dark/5 hover:bg-coffee-dark hover:text-white text-coffee-dark text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                          >
                            <span>Join / Test Room</span>
                            <ExternalLink size={13} />
                          </a>

                          <button
                            type="button"
                            onClick={() => handleDeleteMeet(meet.id)}
                            className="min-h-[40px] min-w-[40px] p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors cursor-pointer flex items-center justify-center active:scale-90 shrink-0"
                            title="Delete Meet link"
                            aria-label="Delete Meet link"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-coffee-dark leading-tight">
                    Upload Recorded YouTube Video Lesson
                  </h3>
                  <p className="text-xs text-coffee-dark/65 font-light leading-relaxed">
                    Paste any YouTube lesson URL or Video ID to make it directly available in student archives.
                  </p>
                </div>

                <form onSubmit={handleAddVideo} className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] sm:text-[10px] uppercase tracking-wider text-coffee-dark/75 font-bold block">
                          YouTube Video Link or ID
                        </label>
                        {isFetchingTitle && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-cappuccino font-semibold animate-pulse">
                            <Loader2 size={10} className="animate-spin shrink-0" />
                            <span>Fetching Title...</span>
                          </span>
                        )}
                        {!isFetchingTitle && titleFetchStatus === "success" && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                            <Sparkles size={10} className="shrink-0" />
                            <span>Title Auto-Fetched</span>
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={newVideo.youtubeUrl}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNewVideo((prev) => ({ ...prev, youtubeUrl: val }));
                            fetchVideoTitle(val);
                          }}
                          onPaste={(e) => {
                            const pasted = e.clipboardData.getData("text");
                            if (pasted) {
                              setNewVideo((prev) => ({ ...prev, youtubeUrl: pasted }));
                              fetchVideoTitle(pasted, true);
                            }
                          }}
                          onBlur={() => {
                            if (newVideo.youtubeUrl && !newVideo.title) {
                              fetchVideoTitle(newVideo.youtubeUrl, true);
                            }
                          }}
                          className="w-full bg-white/60 focus:bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 py-2.5 sm:py-2 text-sm sm:text-xs min-h-[42px] sm:min-h-0 focus:outline-none transition-colors shadow-sm pr-9"
                          required
                        />
                        {newVideo.youtubeUrl && (
                          <button
                            type="button"
                            onClick={() => fetchVideoTitle(newVideo.youtubeUrl, true)}
                            title="Re-fetch title from YouTube"
                            aria-label="Re-fetch title from YouTube"
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-coffee-dark/40 hover:text-cappuccino transition-colors p-1 cursor-pointer active:scale-90"
                          >
                            <RefreshCw size={13} className={cn(isFetchingTitle && "animate-spin text-cappuccino")} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] sm:text-[10px] uppercase tracking-wider text-coffee-dark/75 font-bold block">
                          Video Lesson Title
                        </label>
                        {newVideo.title && titleFetchStatus === "success" && (
                          <span className="text-[9.5px] text-coffee-dark/50 font-mono">
                            Auto-synced
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={newVideo.title}
                          onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                          className={cn(
                            "w-full bg-white/60 focus:bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 py-2.5 sm:py-2 text-sm sm:text-xs min-h-[42px] sm:min-h-0 focus:outline-none transition-colors shadow-sm",
                            isFetchingTitle && "animate-pulse bg-cappuccino/5 border-cappuccino/40"
                          )}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] sm:text-[10px] uppercase tracking-wider text-coffee-dark/75 font-bold block mb-1.5">
                        Target Course
                      </label>
                      <select
                        value={newVideo.course}
                        onChange={(e) => setNewVideo({ ...newVideo, course: e.target.value })}
                        className="w-full bg-white/60 focus:bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 py-2.5 sm:py-2 text-sm sm:text-xs min-h-[42px] sm:min-h-0 focus:outline-none cursor-pointer transition-colors shadow-sm"
                      >
                        <option value="All Courses">All Courses (All Students)</option>
                        {courseOptions.filter((c) => c !== "All Courses").map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] sm:text-[10px] uppercase tracking-wider text-coffee-dark/75 font-bold block mb-1.5">
                        Category / Module
                      </label>
                      <input
                        type="text"
                        value={newVideo.category}
                        onChange={(e) => setNewVideo({ ...newVideo, category: e.target.value })}
                        className="w-full bg-white/60 focus:bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 py-2.5 sm:py-2 text-sm sm:text-xs min-h-[42px] sm:min-h-0 focus:outline-none transition-colors shadow-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] sm:text-[10px] uppercase tracking-wider text-coffee-dark/75 font-bold block mb-1.5">
                      Lesson Guidance &amp; Instructions
                    </label>
                    <textarea
                      rows={3}
                      value={newVideo.description}
                      onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                      className="w-full max-w-full bg-white/60 focus:bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 py-2.5 sm:py-2 text-sm sm:text-xs focus:outline-none transition-colors shadow-sm resize-none leading-relaxed"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={videoSubmitting}
                      className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 bg-coffee-dark hover:bg-cappuccino text-white hover:text-coffee-dark font-bold text-xs uppercase tracking-wider rounded-full transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      <Plus size={15} className="shrink-0" />
                      <span>{videoSubmitting ? "Uploading Video..." : "Upload Video Lesson"}</span>
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
                  <span className="text-[10px] uppercase tracking-wider text-coffee-dark/50 font-mono">
                    Video Archives
                  </span>
                </div>

                {videos.length === 0 ? (
                  <div className="py-12 sm:py-16 px-4 text-center text-coffee-dark/50 space-y-3 rounded-2xl border border-dashed border-coffee-dark/15 bg-coffee-dark/[0.02]">
                    <div className="w-12 h-12 rounded-full bg-coffee-dark/5 mx-auto flex items-center justify-center text-coffee-dark/40">
                      <Video size={22} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-coffee-dark font-serif">No video lessons uploaded yet</p>
                      <p className="text-xs text-coffee-dark/60 font-light max-w-sm mx-auto leading-relaxed">
                        Add recorded lessons and practice sessions using the form above to populate the student archives.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((vid) => (
                      <div
                        key={vid.id}
                        className="group flex flex-col justify-between space-y-3 transition-all"
                      >
                        <div className="relative aspect-video rounded-2xl overflow-hidden bg-coffee-dark shadow-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`https://img.youtube.com/vi/${vid.youtubeId}/mqdefault.jpg`}
                            alt={vid.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2.5 left-2.5 bg-coffee-dark/85 backdrop-blur-sm text-cappuccino px-2.5 py-0.5 rounded-full text-[8.5px] font-bold uppercase tracking-wider max-w-[75%] truncate">
                            {vid.course}
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors pointer-events-none">
                            <div className="w-10 h-10 rounded-full bg-coffee-dark/70 text-cappuccino flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                              <Play size={16} fill="currentColor" className="ml-0.5" />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1 flex-1 min-w-0">
                          <span className="text-[9px] uppercase tracking-wider text-cappuccino font-bold block truncate">
                            {vid.category}
                          </span>
                          <h5 className="font-serif font-bold text-sm sm:text-base text-coffee-dark line-clamp-2 leading-snug">
                            {vid.title}
                          </h5>
                          {vid.description && (
                            <p className="text-xs text-coffee-dark/70 line-clamp-2 font-light leading-relaxed break-words pt-0.5">
                              {vid.description}
                            </p>
                          )}
                        </div>

                        <div className="pt-2 flex items-center justify-between gap-3 text-xs border-t border-coffee-dark/5">
                          <a
                            href={`https://www.youtube.com/watch?v=${vid.youtubeId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="min-h-[38px] px-3 py-1.5 -ml-1.5 rounded-xl font-bold text-coffee-dark hover:text-cappuccino hover:bg-coffee-dark/5 active:bg-coffee-dark/10 flex items-center gap-1.5 transition-all text-xs"
                          >
                            <Play size={12} fill="currentColor" className="shrink-0" />
                            <span>Watch on YouTube</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => handleDeleteVideo(vid.id)}
                            className="min-w-[38px] min-h-[38px] w-[38px] h-[38px] flex items-center justify-center text-red-500 hover:text-red-600 hover:bg-red-500/10 active:bg-red-500/20 rounded-full border border-red-500/20 transition-all cursor-pointer shrink-0"
                            title="Delete Video"
                            aria-label={`Delete video lesson: ${vid.title}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: VAJRA DIRECT CLASSROOM MESSAGING DESK (OPEN CANVAS - NO BOXES)     */}
          {/* ========================================================================= */}
          {activeTab === "messages" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Header Info Banner - Sits directly on background */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-coffee-dark/10">
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-coffee-dark flex items-center gap-2.5">
                    <MessageSquare size={20} className="text-cappuccino" />
                    <span>Direct Classroom Communication Desk</span>
                  </h3>
                  <p className="text-xs text-coffee-dark/65 font-light pt-1">
                    Direct real-time 1-on-1 private messaging channel between Head Coach and enrolled academy students.
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Internal Academy Desk</span>
                  </span>
                </div>
              </div>

              {/* Seamless Two-Column Workspace (No Card Boxes) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Column: Enrolled Students Directory (lg:col-span-4) */}
                <div className="lg:col-span-4 space-y-2.5">
                  <div className="flex items-center justify-between pb-2 border-b border-coffee-dark/10">
                    <span className="text-[10px] uppercase tracking-wider text-coffee-dark/60 font-bold flex items-center gap-1.5">
                      <span>Enrolled Students</span>
                      <span className="px-1.5 py-0.2 rounded-full bg-coffee-dark/5 text-[9px] font-mono text-coffee-dark/80">
                        {approvedStudents.length}
                      </span>
                    </span>
                    <span className="text-[9px] text-coffee-dark/40 font-mono">
                      Tap to select
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-[220px] sm:max-h-[260px] lg:max-h-[500px] overflow-y-auto pr-1">
                    {approvedStudents.length === 0 ? (
                      <div className="py-8 text-center text-coffee-dark/40 text-xs space-y-1">
                        <p>No enrolled students yet.</p>
                        <p className="text-[10px]">Approve admissions in the Admissions tab to message them here.</p>
                      </div>
                    ) : (
                      approvedStudents.map((std) => {
                        const isSelected = activeChatStudent?.id === std.id;
                        const lastMsg = messages
                          .filter((m) => m.studentId === std.id)
                          .slice(-1)[0];
                        const hasUnread = messages.some(
                          (m) => m.studentId === std.id && m.sender === "student" && !m.isRead
                        );

                        return (
                          <div
                            key={std.id}
                            onClick={() => setSelectedStudentId(std.id)}
                            className={cn(
                              "p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all cursor-pointer flex items-start gap-2.5 sm:gap-3 border select-none active:scale-[0.99]",
                              isSelected
                                ? "bg-white/85 border-cappuccino/60 shadow-xs ring-1 ring-cappuccino/30"
                                : "bg-white/30 hover:bg-white/60 border-coffee-dark/10"
                            )}
                          >
                            <div className="relative shrink-0 mt-0.5">
                              <div className="w-8 h-8 rounded-full bg-coffee-dark text-cappuccino font-serif font-bold flex items-center justify-center text-xs shrink-0">
                                {std.name.charAt(0).toUpperCase()}
                              </div>
                              {hasUnread && (
                                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-cappuccino border-2 border-white animate-pulse" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-baseline justify-between gap-1">
                                <h5 className="font-serif font-bold text-xs sm:text-sm text-coffee-dark truncate">
                                  {std.name}
                                </h5>
                                <span className="text-[8.5px] text-cappuccino font-mono font-bold shrink-0">
                                  {std.permanentCode || std.tempCode}
                                </span>
                              </div>
                              <p className="text-[10px] text-coffee-dark/70 font-medium truncate">
                                <strong className="text-cappuccino">{std.course}</strong> • {std.batch}
                              </p>
                              {lastMsg && (
                                <p className="text-[10.5px] text-coffee-dark/60 mt-0.5 line-clamp-1 leading-tight truncate">
                                  <strong className="text-coffee-dark/75">{lastMsg.sender === "admin" ? "You: " : ""}</strong>
                                  {lastMsg.text}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Right Column: Direct Conversation Stream (lg:col-span-8) */}
                <div className="lg:col-span-8 flex flex-col">
                  {activeChatStudent ? (
                    <div className="space-y-3">
                      {/* Active Conversation Top Info Bar - Sits on canvas */}
                      <div className="pb-3 border-b border-coffee-dark/10 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                          <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-coffee-dark text-cappuccino font-serif font-bold flex items-center justify-center text-xs sm:text-sm shrink-0">
                            {activeChatStudent.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                              <h4 className="font-serif font-bold text-xs sm:text-base text-coffee-dark leading-snug truncate">
                                {activeChatStudent.name}
                              </h4>
                              <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-cappuccino/20 border border-cappuccino/40 text-coffee-dark font-mono text-[8.5px] sm:text-[9px] font-bold shrink-0">
                                {activeChatStudent.permanentCode || activeChatStudent.tempCode}
                              </span>
                            </div>
                            <p className="text-[10.5px] sm:text-xs text-coffee-dark/65 pt-0.5 leading-snug break-words">
                              <span className="hidden sm:inline">Enrolled Discipline: </span>
                              <strong className="text-cappuccino">{activeChatStudent.course}</strong>
                              <span className="text-coffee-dark/40 mx-1">•</span>
                              <span className="hidden sm:inline">Batch Slot: </span>
                              <span>{activeChatStudent.batch}</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Chat Messages Stream */}
                      <div className="min-h-[280px] sm:min-h-[320px] max-h-[380px] sm:max-h-[440px] overflow-y-auto p-3 sm:p-5 space-y-3 rounded-2xl bg-white/40 border border-coffee-dark/10">
                        {activeChatMessages.length === 0 ? (
                          <div className="text-center py-12 sm:py-20 text-coffee-dark/40 space-y-1.5">
                            <MessageSquare size={28} className="mx-auto text-cappuccino/60" />
                            <p className="text-xs sm:text-sm font-semibold text-coffee-dark">No conversation history yet with {activeChatStudent.name}.</p>
                            <p className="text-[11px] sm:text-xs text-coffee-dark/50 max-w-xs mx-auto">Send guidance, corrections, or advice directly through this desk.</p>
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
                                    "max-w-[88%] sm:max-w-[75%] px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs",
                                    isAdmin
                                      ? "bg-coffee-dark text-white rounded-tr-xs"
                                      : "bg-white text-coffee-dark border border-coffee-dark/10 rounded-tl-xs"
                                  )}
                                >
                                  {!isAdmin && (
                                    <span className="text-[10px] font-bold text-cappuccino block mb-0.5">
                                      {activeChatStudent.name}
                                    </span>
                                  )}
                                  <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{msg.text}</p>
                                  <div
                                    className={cn(
                                      "flex items-center justify-end gap-1.5 text-[9px] mt-1.5",
                                      isAdmin ? "text-white/60" : "text-coffee-dark/50"
                                    )}
                                  >
                                    <span>
                                      {new Date(msg.timestamp).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                      })}
                                    </span>
                                    {isAdmin && <CheckCheck size={12} className="text-[#53bdeb] shrink-0" />}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                        <div ref={chatScrollRef} />
                      </div>

                      {/* Quick Coaching Guidance Chips */}
                      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1.5 touch-pan-x pr-2">
                        <span className="text-[9.5px] font-bold uppercase tracking-wider text-coffee-dark/40 shrink-0 select-none">
                          Quick:
                        </span>
                        {[
                          "Keep practicing daily!",
                          "Approved for today's class.",
                          "Keep your posture upright.",
                          "Join today's Google Meet live class."
                        ].map((quick) => (
                          <button
                            key={quick}
                            type="button"
                            onClick={(e) => handleSendReply(e, quick)}
                            className="px-3 sm:px-3.5 py-1.5 rounded-full bg-white hover:bg-cappuccino hover:text-coffee-dark text-coffee-dark/80 border border-coffee-dark/15 text-[10.5px] sm:text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0 min-h-[30px] flex items-center"
                          >
                            {quick}
                          </button>
                        ))}
                      </div>

                      {/* Send Message Input Bar (Sits cleanly on background) */}
                      <form
                        onSubmit={handleSendReply}
                        className="flex items-center gap-2 pt-1"
                      >
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type guidance or instructions..."
                          aria-label="Message to student"
                          className="flex-1 bg-white/70 focus:bg-white border border-coffee-dark/20 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 sm:px-4 py-2.5 text-base sm:text-sm focus:outline-none transition-colors shadow-xs"
                        />
                        <button
                          type="submit"
                          disabled={messageSending || !replyText.trim()}
                          className="px-3.5 sm:px-5 py-2.5 min-h-[42px] rounded-xl bg-coffee-dark hover:bg-cappuccino text-white hover:text-coffee-dark font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer shadow-xs active:scale-95 shrink-0"
                          title="Send Message"
                          aria-label="Send Message"
                        >
                          {messageSending ? (
                            <RefreshCw size={13} className="animate-spin" />
                          ) : (
                            <>
                              <span className="text-[11px] sm:text-xs">Send</span>
                              <Send size={13} />
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="py-20 text-center text-coffee-dark/40 text-xs">
                      Select an enrolled student from the left panel to begin private classroom communication.
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: WEBSITE CMS & MAIN PORTAL MANAGER                                  */}
          {/* ========================================================================= */}
          {activeTab === "cms" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 min-w-0"
            >
              {/* CMS Header & Sub-Navigation */}
              <div className="space-y-4 pb-6 border-b border-coffee-dark/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="p-1.5 rounded-lg bg-cappuccino/20 text-coffee-dark">
                        <Globe size={16} className="text-cappuccino" />
                      </span>
                      <h3 className="text-xl font-serif font-bold text-coffee-dark">
                        Website CMS &amp; Main Portal Manager
                      </h3>
                    </div>
                    <p className="text-xs text-coffee-dark/65 font-light">
                      Manage courses, upload course thumbnails &amp; syllabus, publish gallery photos, and update live website details.
                    </p>
                  </div>

                  {/* Sub-Tabs Selector */}
                  <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/70 border border-coffee-dark/15 self-start sm:self-center">
                    <button
                      type="button"
                      onClick={() => setCmsSubTab("courses")}
                      className={cn(
                        "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                        cmsSubTab === "courses"
                          ? "bg-coffee-dark text-white shadow-xs"
                          : "text-coffee-dark/70 hover:text-coffee-dark"
                      )}
                    >
                      <BookOpen size={13} />
                      <span>Courses ({courses.length})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCmsSubTab("gallery")}
                      className={cn(
                        "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                        cmsSubTab === "gallery"
                          ? "bg-coffee-dark text-white shadow-xs"
                          : "text-coffee-dark/70 hover:text-coffee-dark"
                      )}
                    >
                      <ImageIcon size={13} />
                      <span>Gallery ({gallery.length})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCmsSubTab("settings")}
                      className={cn(
                        "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                        cmsSubTab === "settings"
                          ? "bg-coffee-dark text-white shadow-xs"
                          : "text-coffee-dark/70 hover:text-coffee-dark"
                      )}
                    >
                      <Sliders size={13} />
                      <span>Notice &amp; Details</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* ----------------------------------------------------------------- */}
              {/* SUB-TAB 1: COURSES & SYLLABUS MANAGER                             */}
              {/* ----------------------------------------------------------------- */}
              {cmsSubTab === "courses" && (
                <div className="space-y-10">
                  {/* Course Form */}
                  <div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-white/70 border border-coffee-dark/15 space-y-6 shadow-sm">
                    <div className="flex items-center justify-between gap-3 border-b border-coffee-dark/10 pb-4">
                      <div>
                        <h4 className="font-serif text-lg font-bold text-coffee-dark">
                          {isEditingCourse ? "Edit Academy Course" : "Add New Course to Main Website"}
                        </h4>
                        <p className="text-xs text-coffee-dark/60 font-light">
                          {isEditingCourse
                            ? "Modify course metadata, thumbnail image, or syllabus details."
                            : "New courses will appear on the /course page, enrollment form, and home page."}
                        </p>
                      </div>
                      {isEditingCourse && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingCourse(false);
                            setCourseForm(initialCourseForm);
                          }}
                          className="px-3 py-1.5 rounded-full text-xs font-bold bg-coffee-dark/10 hover:bg-coffee-dark/20 text-coffee-dark transition-colors cursor-pointer"
                        >
                          Cancel Editing
                        </button>
                      )}
                    </div>

                    <form onSubmit={handleSaveCourse} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-coffee-dark/60 font-bold block mb-1.5">
                            Course Name *
                          </label>
                          <input
                            type="text"
                            value={courseForm.name}
                            onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                            placeholder="e.g. Silambam Advanced"
                            required
                            className="w-full min-h-[42px] bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 py-2 text-xs focus:outline-none transition-colors shadow-2xs"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-coffee-dark/60 font-bold block mb-1.5">
                            Subtitle / Tagline
                          </label>
                          <input
                            type="text"
                            value={courseForm.subtitle}
                            onChange={(e) => setCourseForm({ ...courseForm, subtitle: e.target.value })}
                            placeholder="e.g. Traditional Tamil Staff Heritage"
                            className="w-full min-h-[42px] bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 py-2 text-xs focus:outline-none transition-colors shadow-2xs"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-coffee-dark/60 font-bold block mb-1.5">
                            Discipline Category *
                          </label>
                          <select
                            value={courseForm.category}
                            onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                            className="w-full min-h-[42px] bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 py-2 text-xs focus:outline-none cursor-pointer transition-colors shadow-2xs"
                          >
                            <option value="Fitness">Fitness</option>
                            <option value="Silambam">Silambam</option>
                            <option value="Yoga">Yoga</option>
                            <option value="Martial Arts">Martial Arts</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-coffee-dark/60 font-bold block mb-1.5">
                            Batch Schedule Timings
                          </label>
                          <input
                            type="text"
                            value={courseForm.schedule}
                            onChange={(e) => setCourseForm({ ...courseForm, schedule: e.target.value })}
                            placeholder="e.g. Morning: 4:30 AM - 5:15 AM | Evening: 5:00 PM"
                            className="w-full min-h-[42px] bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 py-2 text-xs focus:outline-none transition-colors shadow-2xs"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-coffee-dark/60 font-bold block mb-1.5">
                            Target Age Group
                          </label>
                          <input
                            type="text"
                            value={courseForm.age}
                            onChange={(e) => setCourseForm({ ...courseForm, age: e.target.value })}
                            placeholder="e.g. Kids (6+) & Adults"
                            className="w-full min-h-[42px] bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 py-2 text-xs focus:outline-none transition-colors shadow-2xs"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-coffee-dark/60 font-bold block mb-1.5">
                            Skill Level
                          </label>
                          <input
                            type="text"
                            value={courseForm.level}
                            onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                            placeholder="e.g. Beginner to Advanced"
                            className="w-full min-h-[42px] bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 py-2 text-xs focus:outline-none transition-colors shadow-2xs"
                          />
                        </div>
                      </div>

                      {/* Course Thumbnail Image & YouTube Video */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                        {/* Thumbnail Image Picker / Uploader */}
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-wider text-coffee-dark/60 font-bold block">
                            Course Thumbnail Image *
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2.5">
                            <input
                              type="text"
                              value={courseForm.image}
                              onChange={(e) => setCourseForm({ ...courseForm, image: e.target.value })}
                              placeholder="Paste Image URL or upload below..."
                              required
                              className="flex-1 min-h-[42px] bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 py-2 text-xs focus:outline-none transition-colors shadow-2xs"
                            />
                            <label className="min-h-[42px] px-4 rounded-xl bg-coffee-dark hover:bg-cappuccino text-white hover:text-coffee-dark text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-2xs">
                              {courseUploading ? (
                                <RefreshCw size={14} className="animate-spin" />
                              ) : (
                                <UploadCloud size={14} />
                              )}
                              <span>{courseUploading ? "Uploading..." : "Upload File"}</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, "course")}
                                className="hidden"
                              />
                            </label>
                          </div>

                          {/* Live Thumbnail Preview */}
                          {courseForm.image && (
                            <div className="relative aspect-video max-w-xs rounded-xl overflow-hidden border border-coffee-dark/20 bg-coffee-dark/5 shadow-inner mt-2">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={courseForm.image}
                                alt="Course thumbnail preview"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = "none";
                                }}
                              />
                              <span className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[9px] px-2 py-0.5 rounded font-mono">
                                Live Preview
                              </span>
                            </div>
                          )}
                        </div>

                        {/* YouTube Demo Video */}
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-wider text-coffee-dark/60 font-bold block">
                            Demo Video (YouTube Link or ID)
                          </label>
                          <input
                            type="text"
                            value={courseForm.videoId}
                            onChange={(e) => setCourseForm({ ...courseForm, videoId: e.target.value })}
                            placeholder="e.g. https://youtu.be/... or video ID"
                            className="w-full min-h-[42px] bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none transition-colors shadow-2xs"
                          />
                          <p className="text-[10.5px] text-coffee-dark/50">
                            Plays in the HD syllabus video modal when students click &ldquo;Watch Demo&rdquo;.
                          </p>
                        </div>
                      </div>

                      {/* Course Description */}
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-coffee-dark/60 font-bold block mb-1.5">
                          Course Description
                        </label>
                        <textarea
                          rows={2}
                          value={courseForm.description}
                          onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                          placeholder="Brief overview of course benefits and training focus..."
                          className="w-full bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl p-3 text-xs focus:outline-none transition-colors shadow-2xs leading-relaxed"
                        />
                      </div>

                      {/* Syllabus Bullet Points */}
                      <div className="space-y-3 pt-2">
                        <label className="text-[10px] uppercase tracking-wider text-coffee-dark/60 font-bold block">
                          Course Syllabus Topics ({courseForm.syllabus.length})
                        </label>
                        <div className="space-y-2">
                          {courseForm.syllabus.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <span className="text-xs text-cappuccino font-bold w-5 shrink-0">
                                {index + 1}.
                              </span>
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => {
                                  const updated = [...courseForm.syllabus];
                                  updated[index] = e.target.value;
                                  setCourseForm({ ...courseForm, syllabus: updated });
                                }}
                                className="flex-1 bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3 py-1.5 text-xs focus:outline-none transition-colors"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveSyllabusItem(index)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Remove topic"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Add New Topic Row */}
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="text"
                            value={newSyllabusItem}
                            onChange={(e) => setNewSyllabusItem(e.target.value)}
                            placeholder="Add a new syllabus topic..."
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddSyllabusItem();
                              }
                            }}
                            className="flex-1 bg-white/60 focus:bg-white border border-dashed border-coffee-dark/25 focus:border-cappuccino text-coffee-dark rounded-xl px-3 py-2 text-xs focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleAddSyllabusItem}
                            className="px-3.5 py-2 rounded-xl bg-coffee-dark/10 hover:bg-coffee-dark hover:text-white text-coffee-dark text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Plus size={13} />
                            <span>Add Topic</span>
                          </button>
                        </div>
                      </div>

                      {/* Submit Actions */}
                      <div className="pt-3 border-t border-coffee-dark/10 flex items-center gap-3">
                        <button
                          type="submit"
                          disabled={courseSubmitting}
                          className="min-h-[44px] px-7 bg-coffee-dark hover:bg-cappuccino text-white hover:text-coffee-dark font-bold text-xs uppercase tracking-wider rounded-full transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                        >
                          {courseSubmitting ? (
                            <RefreshCw size={14} className="animate-spin" />
                          ) : (
                            <Check size={14} />
                          )}
                          <span>
                            {courseSubmitting
                              ? "Saving Course..."
                              : isEditingCourse
                              ? "Update Course on Website"
                              : "Publish Course to Website"}
                          </span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Active Courses Catalog Grid */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h4 className="font-serif text-lg font-bold text-coffee-dark">
                          Active Website Courses ({courses.length})
                        </h4>
                        <p className="text-xs text-coffee-dark/60 font-light">
                          Click Edit to modify details or thumbnail image.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleResetCms("courses")}
                        className="text-[11px] text-coffee-dark/50 hover:text-coffee-dark underline font-mono cursor-pointer"
                      >
                        Reset to Defaults
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {courses.map((course) => (
                        <div
                          key={course.id}
                          className="p-4 rounded-2xl bg-white/70 border border-coffee-dark/15 hover:border-cappuccino/50 transition-all flex flex-col justify-between gap-4 shadow-2xs"
                        >
                          <div className="flex gap-3.5">
                            <div className="relative w-28 aspect-video rounded-xl overflow-hidden bg-coffee-dark shrink-0 border border-coffee-dark/15">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={course.image}
                                alt={course.name}
                                className="w-full h-full object-cover"
                              />
                              <span className="absolute top-1 left-1 bg-cappuccino/90 text-coffee-dark text-[8px] font-bold px-1.5 py-0.2 rounded-full uppercase">
                                {course.category}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 space-y-1">
                              <h5 className="font-serif font-bold text-base text-coffee-dark truncate">
                                {course.name}
                              </h5>
                              <p className="text-[11px] text-cappuccino font-semibold truncate">
                                {course.subtitle || course.category}
                              </p>
                              <p className="text-[11px] text-coffee-dark/70 font-mono truncate">
                                {course.schedule}
                              </p>
                            </div>
                          </div>

                          <div className="text-[11px] text-coffee-dark/70 line-clamp-2 leading-relaxed">
                            {course.description}
                          </div>

                          <div className="pt-2 border-t border-coffee-dark/10 flex items-center justify-between gap-2">
                            <span className="text-[10px] text-coffee-dark/50 font-mono">
                              {course.syllabus?.length || 0} Syllabus Topics
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleEditCourse(course)}
                                className="px-3 py-1.5 rounded-lg bg-coffee-dark/5 hover:bg-coffee-dark hover:text-white text-coffee-dark text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Edit3 size={12} />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCourse(course.id)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Delete course"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------------- */}
              {/* SUB-TAB 2: GALLERY PHOTOS MANAGER                                 */}
              {/* ----------------------------------------------------------------- */}
              {cmsSubTab === "gallery" && (
                <div className="space-y-10">
                  {/* Add Gallery Photo Form */}
                  <div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-white/70 border border-coffee-dark/15 space-y-5 shadow-sm">
                    <div className="border-b border-coffee-dark/10 pb-4">
                      <h4 className="font-serif text-lg font-bold text-coffee-dark">
                        Add New Photo to Academy Gallery
                      </h4>
                      <p className="text-xs text-coffee-dark/60 font-light">
                        Upload or link training photographs. They will appear immediately on /gallery with category filters and lightbox view.
                      </p>
                    </div>

                    <form onSubmit={handleSaveGallery} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-coffee-dark/60 font-bold block mb-1.5">
                            Photo Title *
                          </label>
                          <input
                            type="text"
                            value={galleryForm.title}
                            onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                            placeholder="e.g. Silambam Fast Rotations"
                            required
                            className="w-full min-h-[42px] bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 py-2 text-xs focus:outline-none transition-colors shadow-2xs"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-coffee-dark/60 font-bold block mb-1.5">
                            Discipline Category *
                          </label>
                          <select
                            value={galleryForm.category}
                            onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                            className="w-full min-h-[42px] bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 py-2 text-xs focus:outline-none cursor-pointer transition-colors shadow-2xs"
                          >
                            <option value="Silambam">Silambam</option>
                            <option value="Martial Arts">Martial Arts</option>
                            <option value="Yoga">Yoga</option>
                            <option value="Fitness">Fitness</option>
                          </select>
                        </div>
                      </div>

                      {/* Photo Image URL & Upload */}
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-wider text-coffee-dark/60 font-bold block">
                          Photo Image File or URL *
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2.5">
                          <input
                            type="text"
                            value={galleryForm.image}
                            onChange={(e) => setGalleryForm({ ...galleryForm, image: e.target.value })}
                            placeholder="Paste Image URL or click Upload File..."
                            required
                            className="flex-1 min-h-[42px] bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 py-2 text-xs focus:outline-none transition-colors shadow-2xs"
                          />
                          <label className="min-h-[42px] px-4 rounded-xl bg-coffee-dark hover:bg-cappuccino text-white hover:text-coffee-dark text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-2xs">
                            {galleryUploading ? (
                              <RefreshCw size={14} className="animate-spin" />
                            ) : (
                              <UploadCloud size={14} />
                            )}
                            <span>{galleryUploading ? "Uploading..." : "Upload Photo"}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, "gallery")}
                              className="hidden"
                            />
                          </label>
                        </div>

                        {/* Live Photo Preview */}
                        {galleryForm.image && (
                          <div className="relative aspect-[4/3] max-w-xs rounded-xl overflow-hidden border border-coffee-dark/20 bg-coffee-dark/5 shadow-inner mt-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={galleryForm.image}
                              alt="Gallery preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                            <span className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[9px] px-2 py-0.5 rounded font-mono">
                              Preview
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Photo Description / Caption */}
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-coffee-dark/60 font-bold block mb-1.5">
                          Caption / Details
                        </label>
                        <textarea
                          rows={2}
                          value={galleryForm.description}
                          onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                          placeholder="Describe the drill, form, or context of this photo..."
                          className="w-full bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl p-3 text-xs focus:outline-none transition-colors shadow-2xs leading-relaxed"
                        />
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={gallerySubmitting}
                          className="min-h-[44px] px-6 bg-coffee-dark hover:bg-cappuccino text-white hover:text-coffee-dark font-bold text-xs uppercase tracking-wider rounded-full transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                        >
                          {gallerySubmitting ? (
                            <RefreshCw size={14} className="animate-spin" />
                          ) : (
                            <Plus size={14} />
                          )}
                          <span>{gallerySubmitting ? "Adding Photo..." : "Add Photo to Gallery"}</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Gallery Grid Display */}
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-serif text-lg font-bold text-coffee-dark">
                          Current Gallery Photos ({gallery.length})
                        </h4>
                        <p className="text-xs text-coffee-dark/60 font-light">
                          Filter by category or delete outdated photos.
                        </p>
                      </div>

                      {/* Category Filter Pills */}
                      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                        {["All", "Silambam", "Martial Arts", "Yoga", "Fitness"].map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setGalleryCategoryFilter(cat)}
                            className={cn(
                              "px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer",
                              galleryCategoryFilter === cat
                                ? "bg-coffee-dark text-cappuccino shadow-2xs"
                                : "bg-white/80 text-coffee-dark/60 hover:text-coffee-dark border border-coffee-dark/10"
                            )}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {gallery
                        .filter(
                          (g) =>
                            galleryCategoryFilter === "All" ||
                            g.category.toLowerCase() === galleryCategoryFilter.toLowerCase()
                        )
                        .map((item) => (
                          <div
                            key={item.id}
                            className="group relative rounded-2xl overflow-hidden bg-white border border-coffee-dark/15 shadow-2xs hover:shadow-md transition-all flex flex-col"
                          >
                            <div className="relative aspect-[4/3] bg-coffee-dark overflow-hidden">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <span className="absolute top-2 left-2 bg-black/70 text-cappuccino text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                                {item.category}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDeleteGallery(item.id)}
                                className="absolute top-2 right-2 p-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer shadow-md opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
                                title="Delete photo"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                            <div className="p-3 space-y-1 flex-1 flex flex-col justify-between">
                              <h5 className="font-bold text-xs text-coffee-dark line-clamp-1">{item.title}</h5>
                              <p className="text-[11px] text-coffee-dark/65 line-clamp-2 leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------------- */}
              {/* SUB-TAB 3: ACADEMY NOTICE & IMPORTANT SETTINGS                     */}
              {/* ----------------------------------------------------------------- */}
              {cmsSubTab === "settings" && (
                <form onSubmit={handleSaveSettings} className="space-y-8">
                  {/* Notice / Announcement Banner Card */}
                  <div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-white/70 border border-coffee-dark/15 space-y-5 shadow-sm">
                    <div className="flex items-center justify-between gap-3 border-b border-coffee-dark/10 pb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Bell size={16} className="text-cappuccino" />
                          <h4 className="font-serif text-lg font-bold text-coffee-dark">
                            Live Website Announcement Banner
                          </h4>
                        </div>
                        <p className="text-xs text-coffee-dark/60 font-light">
                          When active, a golden banner displays at the very top of the website with your custom message and action button.
                        </p>
                      </div>

                      {/* Active Toggle */}
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <span className="text-xs font-bold text-coffee-dark">
                          {siteSettings.announcementActive ? "Active on Site" : "Hidden"}
                        </span>
                        <input
                          type="checkbox"
                          checked={siteSettings.announcementActive}
                          onChange={(e) =>
                            setSiteSettings({ ...siteSettings, announcementActive: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-coffee-dark/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-coffee-dark/20 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 relative" />
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-coffee-dark/60 font-bold block mb-1.5">
                          Badge Label
                        </label>
                        <input
                          type="text"
                          value={siteSettings.announcementBadge}
                          onChange={(e) =>
                            setSiteSettings({ ...siteSettings, announcementBadge: e.target.value })
                          }
                          placeholder="e.g. Admissions Open"
                          className="w-full min-h-[42px] bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 py-2 text-xs focus:outline-none shadow-2xs"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[10px] uppercase tracking-wider text-coffee-dark/60 font-bold block mb-1.5">
                          Announcement Message Text
                        </label>
                        <input
                          type="text"
                          value={siteSettings.announcementText}
                          onChange={(e) =>
                            setSiteSettings({ ...siteSettings, announcementText: e.target.value })
                          }
                          placeholder="e.g. Admissions open for new morning & evening batches..."
                          className="w-full min-h-[42px] bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 py-2 text-xs focus:outline-none shadow-2xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-coffee-dark/60 font-bold block mb-1.5">
                        Target Page Link
                      </label>
                      <input
                        type="text"
                        value={siteSettings.announcementLink}
                        onChange={(e) =>
                          setSiteSettings({ ...siteSettings, announcementLink: e.target.value })
                        }
                        placeholder="e.g. /portal?tab=enroll or /contact"
                        className="w-full min-h-[42px] bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none shadow-2xs"
                      />
                    </div>

                    {/* Banner Live Simulation Preview */}
                    <div className="p-3 rounded-xl bg-coffee-dark text-white space-y-1 text-xs">
                      <span className="text-[9px] uppercase tracking-widest text-cappuccino font-bold block">
                        Live Preview on Site Header:
                      </span>
                      <div className="flex items-center gap-2 py-1">
                        <span className="px-2 py-0.5 rounded-full bg-cappuccino text-coffee-dark font-bold text-[9px] uppercase tracking-wider shrink-0">
                          {siteSettings.announcementBadge || "Notice"}
                        </span>
                        <span className="text-xs text-white/90 truncate">
                          {siteSettings.announcementText || "Announcement text here..."}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Academy Contact & Studio Information Card */}
                  <div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-white/70 border border-coffee-dark/15 space-y-5 shadow-sm">
                    <div className="border-b border-coffee-dark/10 pb-4">
                      <h4 className="font-serif text-lg font-bold text-coffee-dark">
                        Official Academy Contact &amp; Studio Details
                      </h4>
                      <p className="text-xs text-coffee-dark/60 font-light">
                        These details sync across the contact page, footer, and inquiry buttons on the main website.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-coffee-dark/60 font-bold block mb-1.5">
                          Admissions Telephone Line
                        </label>
                        <div className="relative">
                          <Phone size={14} className="absolute left-3.5 top-3 text-coffee-dark/40" />
                          <input
                            type="text"
                            value={siteSettings.phone}
                            onChange={(e) => setSiteSettings({ ...siteSettings, phone: e.target.value })}
                            className="w-full min-h-[42px] bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl pl-9 pr-3.5 py-2 text-xs font-mono focus:outline-none shadow-2xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-coffee-dark/60 font-bold block mb-1.5">
                          Direct WhatsApp Number
                        </label>
                        <div className="relative">
                          <Phone size={14} className="absolute left-3.5 top-3 text-emerald-600" />
                          <input
                            type="text"
                            value={siteSettings.whatsapp}
                            onChange={(e) =>
                              setSiteSettings({ ...siteSettings, whatsapp: e.target.value })
                            }
                            className="w-full min-h-[42px] bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl pl-9 pr-3.5 py-2 text-xs font-mono focus:outline-none shadow-2xs"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-coffee-dark/60 font-bold block mb-1.5">
                          Official Email Address
                        </label>
                        <div className="relative">
                          <Mail size={14} className="absolute left-3.5 top-3 text-coffee-dark/40" />
                          <input
                            type="email"
                            value={siteSettings.email}
                            onChange={(e) => setSiteSettings({ ...siteSettings, email: e.target.value })}
                            className="w-full min-h-[42px] bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl pl-9 pr-3.5 py-2 text-xs font-mono focus:outline-none shadow-2xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-coffee-dark/60 font-bold block mb-1.5">
                          Daily Training Hours Summary
                        </label>
                        <input
                          type="text"
                          value={siteSettings.trainingHours}
                          onChange={(e) =>
                            setSiteSettings({ ...siteSettings, trainingHours: e.target.value })
                          }
                          className="w-full min-h-[42px] bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 py-2 text-xs focus:outline-none shadow-2xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-coffee-dark/60 font-bold block mb-1.5">
                        Studio Physical Address
                      </label>
                      <div className="relative">
                        <MapPin size={14} className="absolute left-3.5 top-3 text-coffee-dark/40" />
                        <input
                          type="text"
                          value={siteSettings.address}
                          onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
                          className="w-full min-h-[42px] bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl pl-9 pr-3.5 py-2 text-xs focus:outline-none shadow-2xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-coffee-dark/60 font-bold block mb-1.5">
                        Google Maps Location URL
                      </label>
                      <input
                        type="url"
                        value={siteSettings.mapsUrl}
                        onChange={(e) => setSiteSettings({ ...siteSettings, mapsUrl: e.target.value })}
                        className="w-full min-h-[42px] bg-white border border-coffee-dark/15 focus:border-cappuccino text-coffee-dark rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Save Settings Action Button */}
                  <div className="flex items-center justify-between gap-4 pt-2">
                    <button
                      type="submit"
                      disabled={settingsSubmitting}
                      className="min-h-[44px] px-8 bg-coffee-dark hover:bg-cappuccino text-white hover:text-coffee-dark font-bold text-xs uppercase tracking-wider rounded-full transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      {settingsSubmitting ? (
                        <RefreshCw size={14} className="animate-spin" />
                      ) : (
                        <Check size={14} />
                      )}
                      <span>{settingsSubmitting ? "Saving Settings..." : "Save Academy Details"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleResetCms("settings")}
                      className="text-xs text-coffee-dark/50 hover:text-coffee-dark underline font-mono cursor-pointer"
                    >
                      Reset Details to Defaults
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </>
  );
}
