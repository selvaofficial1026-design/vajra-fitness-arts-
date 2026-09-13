"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/Hero";
import MenuItemCard from "@/components/MenuItemCard";
import SectionHeading from "@/components/SectionHeading";
import PortfolioSlider, { PortfolioItem } from "@/components/PortfolioSlider";
import VideoModal from "@/components/VideoModal";
import { Star, User2, ArrowRight, ShieldCheck, Flame, Compass } from "lucide-react";
import { motion } from "framer-motion";

const featuredCourses = [
  {
    name: "Fitness",
    description: "Full-body functional training, bodyweight calisthenics, core conditioning, and endurance exercises.",
    price: "Daily Batches",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop",
    category: "Fitness",
    tag: "Strength & Conditioning",
    youtubeId: "dQw4w9WgXcQ"
  },
  {
    name: "Silambam",
    description: "Traditional Tamil staff martial art focusing on rapid stick rotation, agility, and defensive forms.",
    price: "Kids & Adults",
    image: "/images/vajra_hero.jpg",
    category: "Silambam",
    tag: "Traditional Heritage",
    youtubeId: "dQw4w9WgXcQ"
  },
  {
    name: "Yoga",
    description: "Improve flexibility, joint health, breathing control, and mental focus with guided yoga sessions.",
    price: "Morning & Evening",
    image: "/images/yoga.jpg",
    category: "Yoga",
    tag: "Mind & Flexibility",
    youtubeId: "dQw4w9WgXcQ"
  },
  {
    name: "Martial Arts",
    description: "Practical striking, kickboxing combinations, defensive footwork, and personal safety techniques.",
    price: "All Levels",
    image: "/images/martial_arts.jpg",
    category: "Martial Arts",
    tag: "Striking & Defense",
    youtubeId: "dQw4w9WgXcQ"
  }
];

const trainingShowcase: PortfolioItem[] = [
  {
    name: "Silambam Staff Drills",
    description: "Traditional staff rotation, wrist strength, and agile footwork practice.",
    image: "/images/vajra_hero.jpg",
    category: "Silambam",
    is4K: true,
    videoId: "dQw4w9WgXcQ"
  },
  {
    name: "Yoga Balance & Flexibility",
    description: "Core balance postures and guided stretching for full-body wellness.",
    image: "/images/yoga.jpg",
    category: "Yoga",
    is4K: true,
    videoId: "dQw4w9WgXcQ"
  },
  {
    name: "Martial Arts Sparring",
    description: "Punch and kick combinations, defense blocks, and agility drills.",
    image: "/images/martial_arts.jpg",
    category: "Martial Arts",
    is4K: true,
    videoId: "dQw4w9WgXcQ"
  },
  {
    name: "Functional Fitness Training",
    description: "Bodyweight movements, cardio endurance, and overall muscle tone.",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop",
    category: "Fitness",
    is4K: true,
    videoId: "dQw4w9WgXcQ"
  },
  {
    name: "Youth Fitness & Discipline",
    description: "Active training helping children and teens build focus, fitness, and confidence.",
    image: "https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=1200&auto=format&fit=crop",
    category: "Fitness",
    is4K: true,
    videoId: "dQw4w9WgXcQ"
  }
];

const testimonials = [
  {
    name: "S. Karthikeyan",
    role: "Silambam Student",
    quote: "Vajra Fitness Arts helped me build great endurance, fast reflexes, and daily discipline. The instructors are patient, knowledgeable, and always encouraging."
  },
  {
    name: "Dr. Priyadarshini",
    role: "Yoga Student & Physician",
    quote: "The yoga classes at Vajra Fitness Arts improved my flexibility and gave me peace of mind after long work days. I highly recommend it for all ages."
  }
];

const disciplines = [
  "FITNESS", 
  "YOGA", 
  "MARTIAL ARTS", 
  "SILAMBAM"
];

export default function Home() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <main className="min-h-screen flex flex-col pt-0 bg-background relative">
      <Hero />

      {/* Featured Courses Section */}
      <section className="py-14 sm:py-20 md:py-32 px-4 sm:px-6 md:px-12 bg-premium-gradient relative z-10">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            subtitle="Flagship Courses"
            title="Master the Arts of Strength &amp; Focus"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 max-w-4xl mx-auto">
            {featuredCourses.slice(0, 2).map((item, index) => (
              <MenuItemCard 
                key={index} 
                index={index} 
                {...item} 
                onPlay={(id) => setActiveVideo(id)}
              />
            ))}
          </div>
          <div className="mt-12 sm:mt-14 md:mt-16 text-center">
            <Link 
              href="/course" 
              className="w-full sm:w-auto px-6 sm:px-10 md:px-12 py-4 sm:py-5 bg-coffee-dark text-white rounded-full font-bold text-[11px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] hover:bg-cappuccino hover:text-coffee-dark transition-all shadow-premium hover:shadow-premium-hover active:scale-95 inline-flex items-center justify-center gap-3 group"
            >
              <span>View All Courses &amp; Batches</span>
              <ArrowRight size={16} className="shrink-0 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Condensed About Section */}
      <section id="about" className="py-14 sm:py-20 md:py-24 px-4 sm:px-6 md:px-12 bg-white overflow-hidden relative z-10">
        <div className="max-w-4xl mx-auto text-center">
           <span className="text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.5em] text-[#9E6530] font-extrabold mb-4 sm:mb-6 block">About Our Academy</span>
           <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif text-coffee-dark italic leading-tight mb-6 sm:mb-8 font-bold">
             Strength, Discipline, and Movement
           </h2>
           <p className="text-coffee-dark/80 leading-relaxed text-sm sm:text-base md:text-lg font-normal max-w-2xl mx-auto">
             At Vajra Fitness Arts, we offer structured training in Fitness, Yoga, Martial Arts, and Silambam. Our goal is simple: helping students of all ages build physical strength, healthy movement habits, and mental focus through proven movement arts.
           </p>

           <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 md:gap-8 mt-10 sm:mt-14 pt-8 sm:pt-12 border-t border-cream">
             <div className="flex flex-col items-center text-center px-2">
               <div className="w-12 h-12 rounded-full bg-cappuccino/15 flex items-center justify-center text-cappuccino mb-4 shrink-0 border border-cappuccino/30">
                 <ShieldCheck size={24} />
               </div>
               <h4 className="font-serif text-lg sm:text-xl font-bold text-coffee-dark mb-1">Direct Personal Coaching</h4>
               <p className="text-xs text-coffee-dark/70 leading-relaxed">All sessions are taught directly by our founder with personal attention.</p>
             </div>
             <div className="flex flex-col items-center text-center px-2">
               <div className="w-12 h-12 rounded-full bg-cappuccino/15 flex items-center justify-center text-cappuccino mb-4 shrink-0 border border-cappuccino/30">
                 <Flame size={24} />
               </div>
               <h4 className="font-serif text-lg sm:text-xl font-bold text-coffee-dark mb-1">Balanced Fitness</h4>
               <p className="text-xs text-coffee-dark/70 leading-relaxed">Practical workouts combining stamina, agility, and flexibility.</p>
             </div>
             <div className="flex flex-col items-center text-center px-2">
               <div className="w-12 h-12 rounded-full bg-cappuccino/15 flex items-center justify-center text-cappuccino mb-4 shrink-0 border border-cappuccino/30">
                 <Compass size={24} />
               </div>
               <h4 className="font-serif text-lg sm:text-xl font-bold text-coffee-dark mb-1">All Age Groups</h4>
               <p className="text-xs text-coffee-dark/70 leading-relaxed">Structured batches for kids, teens, adults, and working professionals.</p>
             </div>
           </div>
        </div>
      </section>

      {/* Continuous Capabilities Ticker */}
      <section className="py-8 sm:py-12 bg-coffee-dark overflow-hidden border-y border-white/10">
        <div className="flex w-max">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 32, repeat: Infinity }}
            className="flex items-center gap-8 sm:gap-12 whitespace-nowrap px-4 sm:px-6"
          >
            {[...disciplines, ...disciplines, ...disciplines, ...disciplines].map((cap, i) => (
              <React.Fragment key={i}>
                <span className="text-lg sm:text-2xl md:text-3xl font-bold font-serif italic text-white/90 tracking-widest">
                  {cap}
                </span>
                <span className="text-cappuccino text-2xl sm:text-3xl opacity-60">•</span>
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Action Slider Showcase */}
      <section className="py-14 sm:py-20 md:py-28 px-0 sm:px-4 md:px-12 bg-background relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 sm:mb-12">
          <SectionHeading
            subtitle="Training in Action"
            title="Inside Our Training Center"
          />
        </div>
        <div className="w-full relative px-2 sm:px-4">
          <PortfolioSlider 
            items={trainingShowcase} 
            onPlay={(videoId) => setActiveVideo(videoId)} 
            isPaused={!!activeVideo}
          />
        </div>
      </section>

      {/* Pro Level Parallax Divider */}
      <section className="relative h-[40vh] sm:h-[50vh] md:h-[60vh] overflow-hidden">
        <motion.div
          initial={{ y: -50 }}
          whileInView={{ y: 50 }}
          viewport={{ once: false }}
          transition={{ ease: "linear", duration: 0.1 }}
          className="absolute inset-0"
        >
          <Image
            src="/images/martial_arts.jpg"
            alt="Vajra Fitness Arts Center"
            fill
            sizes="100vw"
            className="object-cover opacity-90 brightness-[0.3]"
          />
        </motion.div>
        <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6">
          <div className="text-center">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.5em] text-white/80 font-bold mb-4 sm:mb-6 block drop-shadow-sm">The Vajra Standard</span>
            <h2 className="text-2xl sm:text-4xl md:text-7xl font-serif text-white italic drop-shadow-md">Discipline. Strength. Agility. Focus.</h2>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-14 sm:py-20 md:py-32 px-4 sm:px-6 md:px-12 bg-background relative z-10">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            subtitle="Voices of Discipline"
            title="Transformations &amp; Experiences"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {testimonials.map((test, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{ y: -10, scale: 1.02 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-gradient-to-br from-[#281C1C] to-[#1A1212] p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2rem] text-white flex flex-col justify-between shadow-premium hover:shadow-[0_20px_50px_rgba(200,160,120,0.25)] transition-all relative overflow-hidden group border border-cappuccino/25"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-cappuccino/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-cappuccino/20 transition-colors duration-500 blur-[40px] pointer-events-none" />
                <Star className="text-cappuccino absolute top-6 right-6 sm:top-8 sm:right-8 opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110 drop-shadow-[0_0_15px_rgba(200,149,95,0.7)]" size={20} fill="currentColor" />
                
                <p className="text-base sm:text-lg md:text-xl font-serif leading-relaxed mb-6 sm:mb-8 italic relative z-10 text-white drop-shadow-md pr-6 sm:pr-0">
                  &ldquo;{test.quote}&rdquo;
                </p>
                <div className="relative z-10 flex items-center gap-3.5 sm:gap-4">
                  <div className="w-10 h-10 rounded-full bg-cappuccino/20 flex items-center justify-center text-cappuccino shadow-lg group-hover:bg-cappuccino group-hover:text-coffee-dark transition-colors duration-500 shrink-0 border border-cappuccino/30">
                    <User2 size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-white">{test.name}</h4>
                    <p className="text-cappuccino font-sans text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">{test.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Admissions & WhatsApp CTA Section */}
      <section className="py-14 sm:py-20 md:py-28 px-4 sm:px-6 md:px-12 bg-white relative z-10 border-t border-cream">
        <div className="max-w-5xl mx-auto bg-[#241A1A] rounded-2xl sm:rounded-3xl md:rounded-[3rem] p-6 sm:p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl border border-cappuccino/30">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-cappuccino/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-cappuccino/15 rounded-full blur-3xl pointer-events-none" />
          <span className="text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.5em] text-cappuccino font-bold mb-3 sm:mb-4 block drop-shadow-sm">Take the First Step</span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif italic mb-4 sm:mb-6 text-white drop-shadow-md">Begin Your Training Journey</h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8 sm:mb-10 text-xs sm:text-sm md:text-base font-light leading-relaxed">
            Join us at our training center in Ariyalur for Fitness, Yoga, Martial Arts, or Silambam. Connect with us directly on WhatsApp to learn about admissions and batch timings.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://wa.me/918778931958?text=Hello%20Vajra%20Fitness%20Arts,%20I%20would%20like%20to%20know%20more%20about%20admissions%20and%20batch%20timings."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 sm:px-10 py-4 sm:py-5 bg-[#25D366] hover:bg-[#20ba5a] text-black font-bold text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] rounded-full transition-all shadow-premium hover:shadow-[0_0_30px_rgba(37,211,102,0.4)] inline-flex items-center justify-center gap-3 active:scale-95"
            >
              <span>Chat on WhatsApp</span>
              <ArrowRight size={16} />
            </a>
            <Link
              href="/course"
              className="w-full sm:w-auto px-6 sm:px-10 py-4 sm:py-5 border border-cappuccino/50 hover:bg-cappuccino hover:text-coffee-dark text-white font-bold text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] rounded-full transition-all backdrop-blur-sm shadow-premium inline-flex items-center justify-center gap-3 active:scale-95"
            >
              <span>Explore All Batches</span>
            </Link>
          </div>
        </div>
      </section>

      <VideoModal 
        isOpen={!!activeVideo} 
        videoId={activeVideo} 
        onClose={() => setActiveVideo(null)} 
      />
    </main>
  );
}
