"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import VideoModal from "@/components/VideoModal";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Clock, Users, Award, CheckCircle2, ArrowRight, MessageCircle, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseItem {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  category: string;
  schedule: string;
  level: string;
  age: string;
  image: string;
  videoId: string;
  syllabus: string[];
}

const categories = [
  "All",
  "Fitness",
  "Yoga",
  "Martial Arts",
  "Silambam",
];

const courseCatalog: CourseItem[] = [
  {
    id: "fitness",
    name: "Fitness",
    subtitle: "Functional Strength & Conditioning",
    description: "Full-body functional fitness, bodyweight calisthenics, core stability, and cardio endurance for all fitness levels.",
    category: "Fitness",
    schedule: "Morning: 4:30-5:15 AM, 5:30-6:00 AM, 8:30-9:15 AM | Evening: 3:45-4:30 PM, 5:00-5:45 PM, 6:00-6:45 PM",
    level: "All Levels (Beginner to Advanced)",
    age: "Teens & Adults",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop",
    videoId: "dQw4w9WgXcQ",
    syllabus: [
      "Bodyweight training: Push-ups, pull-ups, squats, and core strength",
      "Functional kettlebell and dumbbell movements for muscle tone",
      "Circuit training and cardio intervals to boost stamina",
      "Full-body stretching, mobility, and post-workout recovery"
    ]
  },
  {
    id: "yoga",
    name: "Yoga",
    subtitle: "Flexibility, Balance & Mindfulness",
    description: "Guided yoga classes designed to improve body flexibility, release joint tension, build core balance, and calm the mind.",
    category: "Yoga",
    schedule: "Morning: 4:30-5:15 AM, 5:30-6:00 AM, 8:30-9:15 AM | Evening: 3:45-4:30 PM, 5:00-5:45 PM, 6:00-6:45 PM",
    level: "All Levels Welcome",
    age: "All Age Groups",
    image: "/images/yoga.jpg",
    videoId: "dQw4w9WgXcQ",
    syllabus: [
      "Sun Salutations (Surya Namaskar) for gentle warmups",
      "Standing, balancing, and seated yoga postures (Asanas)",
      "Guided breathing techniques for stress relief and focus",
      "Relaxation and guided mindfulness for everyday well-being"
    ]
  },
  {
    id: "martial-arts",
    name: "Martial Arts",
    subtitle: "Striking, Defense & Discipline",
    description: "Learn essential striking techniques, punch-kick combinations, defensive head movement, and practical self-defense.",
    category: "Martial Arts",
    schedule: "Morning: 4:30-5:15 AM, 5:30-6:00 AM, 8:30-9:15 AM | Evening: 3:45-4:30 PM, 5:00-5:45 PM, 6:00-6:45 PM",
    level: "Beginner to Advanced",
    age: "Youth & Adults",
    image: "/images/martial_arts.jpg",
    videoId: "dQw4w9WgXcQ",
    syllabus: [
      "Fundamental punches: Jab, cross, hook, and uppercut mechanics",
      "Kick techniques: Front kicks, low kicks, and roundhouse kicks",
      "Defensive guards, footwork, and evasion drills",
      "Practical self-defense awareness and partner sparring drills"
    ]
  },
  {
    id: "silambam",
    name: "Silambam",
    subtitle: "Traditional Tamil Staff Art",
    description: "Learn the traditional art of Silambam, featuring footwork drills, continuous stick rotations, speed training, and combat forms.",
    category: "Silambam",
    schedule: "Morning: 4:30-5:15 AM, 5:30-6:00 AM, 8:30-9:15 AM | Evening: 3:45-4:30 PM, 5:00-5:45 PM, 6:00-6:45 PM",
    level: "Beginner to Advanced",
    age: "Kids (6+) & Adults",
    image: "/images/vajra_hero.jpg",
    videoId: "dQw4w9WgXcQ",
    syllabus: [
      "Kaalvari: Foundational footwork and directional stances",
      "Veesu: Single and double-hand staff rotation techniques",
      "Speed drills, wrist conditioning, and balance exercises",
      "Traditional forms (Chuvadu) and controlled partner drills"
    ]
  }
];

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseItem[]>(courseCatalog);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);

  useEffect(() => {
    fetch("/api/portal/cms?type=courses")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.courses && data.courses.length > 0) {
          setCourses(data.courses);
        }
      })
      .catch(console.error);
  }, []);

  // Prevent background scrolling when syllabus modal is open
  useEffect(() => {
    if (selectedCourse) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedCourse]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedCourse) setSelectedCourse(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCourse]);

  const filteredCourses = activeCategory === "All"
    ? courses
    : courses.filter((item) => item.category === activeCategory);

  const getCategoryCount = (category: string) => {
    if (category === "All") return courses.length;
    return courses.filter((item) => item.category === category).length;
  };

  return (
    <main className="min-h-screen flex flex-col pt-0 bg-background relative overflow-hidden">
      {/* Immersive Course Hero with Warm Cinematic Grade */}
      <section className="relative min-h-[300px] h-[40vh] sm:h-[45vh] md:h-[50vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/vajra_hero.jpg"
            alt="Vajra Courses"
            fill
            priority
            className="object-cover brightness-[0.38] scale-105"
          />
          {/* Warm cinematic grade overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-[#241A1A]/40 to-transparent" />
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 pt-16 sm:pt-20">
          <span className="inline-block px-4 sm:px-6 py-1.5 sm:py-2 mb-4 sm:mb-6 border border-cappuccino/40 rounded-full text-cappuccino text-[9px] sm:text-[10px] font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase backdrop-blur-md bg-white/5 shadow-lg">
            Curriculum &amp; Programs
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif text-white mb-3 sm:mb-4 italic">
            Training Courses
          </h1>
          <p className="text-white/70 max-w-xl mx-auto text-xs sm:text-sm font-light px-2">
            Comprehensive programs in Fitness, Yoga, Martial Arts, and Silambam.
          </p>
        </div>
      </section>

      {/* Courses Catalog Section */}
      <section className="py-14 sm:py-20 md:py-28 px-4 sm:px-6 md:px-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            subtitle="Choose Your Path"
            title="Courses Designed for Every Skill Level"
          />

          {/* Premium Filter Tabs with active bg-coffee-dark and text-cappuccino */}
          <div className="flex items-center justify-start sm:justify-center gap-2.5 sm:gap-3 md:gap-5 mb-10 sm:mb-16 overflow-x-auto no-scrollbar py-2 px-1 sm:px-0 sm:flex-wrap scroll-smooth">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "relative py-2.5 sm:py-3 px-4 sm:px-6 md:px-8 rounded-full text-[10px] sm:text-xs font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase transition-all duration-500 overflow-hidden shrink-0 whitespace-nowrap min-h-[42px] sm:min-h-[44px] flex items-center justify-center cursor-pointer",
                    isActive
                      ? "text-cappuccino shadow-xl scale-105"
                      : "text-coffee-dark/60 hover:text-coffee-dark bg-white/70 hover:bg-white backdrop-blur-sm border border-cream hover:border-cappuccino/50 shadow-sm active:scale-95"
                  )}
                >
                  <span className="relative z-10 flex items-center">
                    {cat}
                    <span
                      className={cn(
                        "ml-1.5 text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-semibold transition-colors",
                        isActive ? "bg-cappuccino/20 text-cappuccino" : "bg-cream/60 text-coffee-dark/50"
                      )}
                    >
                      ({getCategoryCount(cat)})
                    </span>
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeCourseTab"
                      className="absolute inset-0 bg-coffee-dark"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Course Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto gap-6 sm:gap-7">
            <AnimatePresence mode="popLayout">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="group bg-white rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-premium hover:shadow-[0_20px_50px_rgba(200,149,95,0.2)] border border-cream hover:border-cappuccino/50 transition-all duration-500 flex flex-col"
                  >
                    {/* Image Poster */}
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={course.image}
                        alt={course.name}
                        fill
                        quality={90}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-coffee-dark/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                      {/* Category Pill */}
                      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10 bg-cappuccino/95 backdrop-blur-md text-coffee-dark px-3 sm:px-3.5 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-bold shadow-md">
                        {course.category}
                      </div>

                      {/* Play Video Button - responsive touch friendly */}
                      <button
                        type="button"
                        onClick={() => setActiveVideo(course.videoId)}
                        aria-label={`Preview ${course.name} demo video`}
                        className="absolute inset-0 flex items-center justify-center opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-500 scale-90 sm:scale-75 sm:group-hover:scale-100 cursor-pointer z-10"
                      >
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-cappuccino rounded-full flex items-center justify-center text-coffee-dark shadow-2xl hover:scale-110 hover:bg-white transition-all">
                          <Play size={20} fill="currentColor" className="ml-0.5 sm:ml-1" />
                        </div>
                      </button>
                    </div>

                    {/* Body Content */}
                    <div className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-cappuccino font-bold block mb-1">
                          {course.subtitle}
                        </span>
                        <h3 className="text-lg sm:text-xl font-serif text-coffee-dark font-bold mb-1.5 group-hover:text-cappuccino transition-colors leading-snug">
                          {course.name}
                        </h3>
                        <p className="text-coffee-dark/70 text-xs leading-relaxed font-light mb-4">
                          {course.description}
                        </p>

                        {/* Course Meta Info */}
                        <div className="space-y-2 sm:space-y-2.5 pt-4 border-t border-cream text-xs text-coffee-dark/80 mb-5 sm:mb-6">
                          <div className="flex items-start gap-2 sm:gap-2.5 min-w-0">
                            <Clock size={15} className="text-cappuccino shrink-0 mt-0.5" />
                            <span className="text-[11px] leading-relaxed break-words min-w-0">{course.schedule}</span>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-2.5">
                            <Award size={15} className="text-cappuccino shrink-0" />
                            <span className="text-[11px]">{course.level}</span>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-2.5">
                            <Users size={15} className="text-cappuccino shrink-0" />
                            <span className="text-[11px]">{course.age}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-4 border-t border-cream flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedCourse(course)}
                          className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-cappuccino hover:text-coffee-dark transition-colors py-1 cursor-pointer"
                        >
                          Curriculum Details +
                        </button>
                        <Link 
                          href={`/portal?tab=enroll&course=${encodeURIComponent(course.name)}`}
                          className="px-4 sm:px-5 py-2.5 bg-coffee-dark text-white rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-cappuccino transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                        >
                          <span>Enroll</span>
                          <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-16 text-center text-coffee-dark/60 font-serif italic text-lg">
                  No courses found in this category.
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Curriculum Details Modal with Backdrop Click Protection & Warm Blur */}
      <AnimatePresence>
        {selectedCourse && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-y-auto">
            {/* Warm cinematic backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#241A1A]/80 backdrop-blur-md cursor-pointer"
              onClick={() => setSelectedCourse(null)}
              aria-hidden="true"
            />

            {/* Modal Card Content (stops propagation to prevent premature closing) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 w-[95vw] sm:max-w-xl max-h-[85vh] overflow-y-auto shadow-2xl relative border border-cream z-10 my-auto"
            >
              <button
                type="button"
                onClick={() => setSelectedCourse(null)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 text-coffee-dark/50 hover:text-coffee-dark font-bold text-xs sm:text-sm tracking-widest uppercase p-2 transition-colors flex items-center gap-1.5 cursor-pointer"
                aria-label="Close syllabus modal"
              >
                <X size={16} />
                <span>Close</span>
              </button>

              <span className="text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.4em] text-cappuccino font-bold block mb-1.5 sm:mb-2">
                Course Syllabus
              </span>
              <h2 className="text-xl sm:text-2xl font-serif text-coffee-dark font-bold mb-2 pr-16">
                {selectedCourse.name}
              </h2>
              <p className="text-xs sm:text-sm text-coffee-dark/70 mb-5 sm:mb-6 leading-relaxed">
                {selectedCourse.description}
              </p>

              <h4 className="text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] font-bold text-coffee-dark mb-3 sm:mb-4">
                What You Will Learn:
              </h4>
              <div className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                {selectedCourse.syllabus.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-coffee-dark/85">
                    <CheckCircle2 size={16} className="text-cappuccino shrink-0 mt-0.5" />
                    <span className="leading-snug">{item}</span>
                  </div>
                ))}
              </div>

              <div className="p-3.5 sm:p-4 bg-background rounded-xl sm:rounded-2xl border border-cream mb-6 sm:mb-8 text-xs text-coffee-dark/80 space-y-1.5">
                <p><strong>Batch Timings:</strong> {selectedCourse.schedule}</p>
                <p><strong>Eligible Age:</strong> {selectedCourse.age}</p>
                <p><strong>Level:</strong> {selectedCourse.level}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-1">
                {/* Enroll in Online Portal */}
                <Link
                  href={`/portal?tab=enroll&course=${encodeURIComponent(selectedCourse.name)}`}
                  className="w-full sm:flex-1 py-3.5 sm:py-4 bg-[#241A1A] hover:bg-cappuccino hover:text-coffee-dark text-white font-extrabold text-xs uppercase tracking-[0.2em] transition-all shadow-premium text-center flex items-center justify-center gap-2 active:scale-[0.98] rounded-full cursor-pointer"
                >
                  <Sparkles size={16} className="text-cappuccino shrink-0" />
                  <span>Enroll in Online Class</span>
                </Link>

                {/* Authentic WhatsApp Button with green #25D366 and high contrast black text */}
                <a
                  href={`https://wa.me/919047743533?text=${encodeURIComponent(`Hello Vajra Fitness Arts, I would like to inquire about admissions for ${selectedCourse.name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 py-3.5 sm:py-4 bg-[#25D366] text-black font-extrabold text-xs uppercase tracking-[0.2em] hover:bg-[#20bd5a] transition-all shadow-premium text-center flex items-center justify-center gap-2 active:scale-[0.98] rounded-full cursor-pointer"
                >
                  <MessageCircle size={16} className="text-black shrink-0" />
                  <span>Inquire on WhatsApp</span>
                </a>

                {/* Watch Demo Video button */}
                <button
                  type="button"
                  onClick={() => {
                    const vid = selectedCourse.videoId;
                    setSelectedCourse(null);
                    setActiveVideo(vid);
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 sm:py-4 border border-cappuccino/50 hover:border-cappuccino rounded-full font-bold text-xs uppercase tracking-[0.2em] text-coffee-dark hover:bg-cream/40 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <Play size={14} />
                  <span>Watch Demo</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <VideoModal
        isOpen={!!activeVideo}
        videoId={activeVideo}
        onClose={() => setActiveVideo(null)}
      />
    </main>
  );
}
