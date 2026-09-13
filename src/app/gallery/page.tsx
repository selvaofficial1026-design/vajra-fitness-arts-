"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Maximize2, 
  X, 
  Sparkles, 
  Play, 
  Pause, 
  ArrowRight 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
}

const galleryCategories = [
  "All",
  "Fitness",
  "Yoga",
  "Martial Arts",
  "Silambam"
];

const galleryImages: GalleryItem[] = [
  // --- Silambam ---
  {
    id: 1,
    title: "Silambam Kaalvari Stance",
    category: "Silambam",
    image: "/images/vajra_hero.jpg",
    description: "Traditional footwork foundation and defensive readiness with the bamboo staff."
  },
  {
    id: 2,
    title: "Silambam Staff Defense",
    category: "Silambam",
    image: "/images/martial_arts.jpg",
    description: "Practicing rotational wrist spins, rapid strikes, and directional blocks with traditional weapons."
  },

  // --- Martial Arts ---
  {
    id: 3,
    title: "Shaolin Crane Guard & Balance",
    category: "Martial Arts",
    image: "/images/gallery/vajra_martial_arts_crane_guard.jpg",
    description: "Single-leg crane stance developing kinetic control, poise, and lightning-fast defensive reactions."
  },
  {
    id: 4,
    title: "Low Drop Stance Agility",
    category: "Martial Arts",
    image: "/images/gallery/vajra_martial_arts_drop_stance.jpg",
    description: "Deep crouching stance training ankle tendon resilience, inner leg flexibility, and low-line defense."
  },
  {
    id: 5,
    title: "Rooted Horse Stance Power",
    category: "Martial Arts",
    image: "/images/gallery/vajra_martial_arts_horse_stance.jpg",
    description: "Fundamental Ma Bu posture cultivating lower-body endurance, pelvic alignment, and centered focus."
  },
  {
    id: 6,
    title: "Forward Bow Stance Strike",
    category: "Martial Arts",
    image: "/images/gallery/vajra_martial_arts_bow_stance.jpg",
    description: "Forward linear driving stance delivering grounded palm thrusts and stable weight transfer."
  },

  // --- Yoga ---
  {
    id: 7,
    title: "Single-Leg Balance & Lateral Stretch",
    category: "Yoga",
    image: "/images/gallery/vajra_yoga_standing_balance.jpg",
    description: "Mastering single-leg stability, pelvic alignment, and lateral torso extension in open air."
  },
  {
    id: 8,
    title: "Guided Mindfulness & Dhyana",
    category: "Yoga",
    image: "/images/gallery/vajra_yoga_group_meditation.jpg",
    description: "Evening group meditation with Chin Mudra centering thoughts, reducing stress, and calming the mind."
  },
  {
    id: 9,
    title: "Pranayama Breathwork Mastery",
    category: "Yoga",
    image: "/images/gallery/vajra_yoga_pranayama_breathwork.jpg",
    description: "Systematic alternate nostril breathing improving respiratory lung capacity and mental clarity."
  },
  {
    id: 10,
    title: "Evening Group Tree Pose Circle",
    category: "Yoga",
    image: "/images/gallery/vajra_yoga_group_tree_night.jpg",
    description: "Community balance session developing focus, ankle stabilization, and poise under evening lights."
  },
  {
    id: 11,
    title: "Camel Pose Thoracic Extension",
    category: "Yoga",
    image: "/images/gallery/vajra_yoga_group_camel_pose.jpg",
    description: "Chest-expanding Ustrasana backbend releasing spinal tension and strengthening the back."
  },
  {
    id: 12,
    title: "Open-Air Balance & Posture Guidance",
    category: "Yoga",
    image: "/images/gallery/vajra_yoga_group_tree_coaching.jpg",
    description: "Personalized posture correction and balance coaching ensuring safe, aligned movement."
  },

  // --- Fitness ---
  {
    id: 13,
    title: "Full Ground Splits Mobility",
    category: "Fitness",
    image: "/images/gallery/vajra_fitness_full_splits.jpg",
    description: "Extreme 180° front-split hip flexibility, hamstring extension, and upright spinal control."
  },
  {
    id: 14,
    title: "Planar Core & Arm Suspension",
    category: "Fitness",
    image: "/images/gallery/vajra_fitness_horizontal_balance.jpg",
    description: "Advanced calisthenic bodyweight leverage demanding abdominal compression and wrist stability."
  },
  {
    id: 15,
    title: "Scapular & Shoulder Mobility",
    category: "Fitness",
    image: "/images/gallery/vajra_fitness_shoulder_mobility.jpg",
    description: "Targeted Gomukhasana shoulder clasp drill opening the rotator cuff and chest for injury prevention."
  },
  {
    id: 16,
    title: "Head Coach Strength & Conditioning",
    category: "Fitness",
    image: "/images/owner.jpg",
    description: "Dedicated personal training and athletic conditioning supervised directly by our founder."
  }
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const filteredItems = activeCategory === "All"
    ? galleryImages
    : galleryImages.filter((item) => item.category === activeCategory);

  // Seamless duplicated items for infinite auto-scroll
  const duplicatedItems = filteredItems.length < 4
    ? [...filteredItems, ...filteredItems, ...filteredItems, ...filteredItems]
    : [...filteredItems, ...filteredItems];

  // Auto-scroll loop
  useEffect(() => {
    if (!isAutoScrolling || isHovered || activeItem !== null) return;

    const interval = setInterval(() => {
      if (sliderRef.current) {
        sliderRef.current.scrollLeft += 1;
        // When scrolled past half the duplicated width, reset to 0 seamlessly
        if (sliderRef.current.scrollLeft >= sliderRef.current.scrollWidth / 2) {
          sliderRef.current.scrollLeft = 0;
        }
      }
    }, 12);

    return () => clearInterval(interval);
  }, [isAutoScrolling, isHovered, activeItem]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    if (sliderRef.current) {
      sliderRef.current.scrollLeft = 0;
    }
  };

  // Keyboard Escape listener for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveItem(null);
      }
    };
    if (activeItem) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeItem]);

  return (
    <main className="min-h-screen flex flex-col pt-0 bg-background relative overflow-hidden">
      {/* Immersive Warm Cinematic Gallery Hero */}
      <section className="relative h-[48vh] sm:h-[55vh] md:h-[65vh] min-h-[360px] sm:min-h-[420px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/martial_arts.jpg"
            alt="Vajra Gallery"
            fill
            priority
            className="object-cover brightness-[0.38] scale-105"
          />
          {/* Warm cinematic tone hero overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-coffee-dark/50 to-coffee-dark/80" />
          <div className="absolute inset-0 bg-gradient-to-b from-coffee-dark/60 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[#2A1D1D]/20 mix-blend-multiply pointer-events-none" />
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 pt-12 sm:pt-16">
          <span className="inline-block px-4 sm:px-6 py-1.5 sm:py-2 mb-4 sm:mb-6 border border-cappuccino/40 rounded-full text-cappuccino text-[9px] sm:text-[10px] font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase backdrop-blur-md bg-white/5 shadow-lg">
            Photo Gallery
          </span>
          <h1 className="text-3xl sm:text-6xl md:text-7xl font-serif text-white mb-3 sm:mb-4 italic leading-tight">
            Action Gallery
          </h1>
          <p className="text-white/70 max-w-xl mx-auto text-xs sm:text-sm md:text-base font-light px-2">
            Capturing the dedication, movement, and discipline at Vajra Fitness Arts.
          </p>
        </div>
      </section>

      {/* Gallery Showcase Section */}
      <section className="py-16 sm:py-20 md:py-28 px-3 sm:px-4 md:px-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            subtitle="Moments in Training"
            title="Focus in Every Movement"
            className="mb-8 sm:mb-12 md:mb-16"
          />

          {/* Compact 5 Categories: 3 on Top, 2 on Bottom */}
          <div className="flex flex-col items-center gap-2 sm:gap-2.5 mb-8 sm:mb-10 max-w-xl mx-auto px-2">
            {/* Top Row: 3 Categories */}
            <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-3">
              {["All", "Fitness", "Yoga"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={cn(
                    "relative py-2 px-3 sm:px-5 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase transition-all duration-300 overflow-hidden shadow-sm whitespace-nowrap",
                    activeCategory === cat
                      ? "bg-coffee-dark text-white border border-cappuccino shadow-md scale-105"
                      : "text-coffee-dark/70 hover:text-coffee-dark bg-white/80 hover:bg-white border border-cream hover:border-cappuccino/40"
                  )}
                >
                  <span className="relative z-10">{cat}</span>
                </button>
              ))}
            </div>

            {/* Bottom Row: 2 Categories */}
            <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-3">
              {["Martial Arts", "Silambam"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={cn(
                    "relative py-2 px-3 sm:px-5 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase transition-all duration-300 overflow-hidden shadow-sm whitespace-nowrap",
                    activeCategory === cat
                      ? "bg-coffee-dark text-white border border-cappuccino shadow-md scale-105"
                      : "text-coffee-dark/70 hover:text-coffee-dark bg-white/80 hover:bg-white border border-cream hover:border-cappuccino/40"
                  )}
                >
                  <span className="relative z-10">{cat}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AUTO-SCROLL CAROUSEL (UNIFORM SAME SIZE CARDS) */}
          <div
            className="relative w-full max-w-full overflow-hidden py-2 group/carousel"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
          >
            <div
              ref={sliderRef}
              className="flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto [&::-webkit-scrollbar]:hidden pl-3 sm:pl-4 pr-3 sm:pr-4 py-3 sm:py-4 touch-pan-x overscroll-x-contain"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {duplicatedItems.map((item, index) => (
                <motion.div
                  key={`${item.id}-${index}`}
                  onClick={() => setActiveItem(item)}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="w-[88vw] sm:w-[50vw] md:w-[380px] lg:w-[400px] shrink-0 bg-white rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-premium hover:shadow-[0_20px_50px_rgba(200,149,95,0.25)] border border-cream hover:border-cappuccino/40 transition-all duration-500 flex flex-col group cursor-pointer select-none"
                >
                  {/* Uniform Top Image Poster - Same Size */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-coffee-dark">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      quality={90}
                      sizes="(max-width: 640px) 88vw, (max-width: 1024px) 50vw, 400px"
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-coffee-dark/70 via-transparent to-transparent opacity-60 group-hover:opacity-85 transition-opacity" />
                    
                    {/* Category Pill */}
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10 bg-cappuccino text-coffee-dark px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-bold shadow-md">
                      {item.category}
                    </div>

                    {/* Zoom Button */}
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-cappuccino group-hover:text-coffee-dark transition-colors shadow-sm">
                      <Maximize2 size={13} />
                    </div>
                  </div>

                  {/* Uniform Body Details */}
                  <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-cappuccino font-bold block mb-1">
                        {item.category} Session
                      </span>
                      <h3 className="text-lg sm:text-xl font-serif text-coffee-dark font-bold mb-1.5 sm:mb-2 group-hover:text-cappuccino transition-colors leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-coffee-dark/70 text-xs md:text-sm font-light leading-relaxed line-clamp-2 mb-3 sm:mb-4">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-cream flex items-center justify-between text-xs">
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-cappuccino">
                        View Full Photo
                      </span>
                      <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-cream/50 flex items-center justify-center text-coffee-dark group-hover:bg-coffee-dark group-hover:text-white transition-all shadow-sm">
                        <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Status indicator & Pause/Resume */}
            <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 text-xs text-coffee-dark/50">
              <button
                type="button"
                onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                className="flex items-center gap-2 hover:text-coffee-dark transition-colors cursor-pointer"
                aria-label={isAutoScrolling ? "Pause auto-scroll" : "Resume auto-scroll"}
              >
                <span className={cn("w-2 h-2 rounded-full", isAutoScrolling && !isHovered ? "bg-green-500 animate-pulse" : "bg-coffee-dark/30")} />
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold">
                  {!isAutoScrolling ? "Paused (Click to Resume)" : isHovered ? "Paused on Hover" : "Auto-Scrolling"}
                </span>
                {isAutoScrolling ? <Pause size={12} className="ml-1 opacity-70" /> : <Play size={12} className="ml-1 opacity-70" />}
              </button>
              <span className="text-[10px] sm:text-[11px] font-light hidden sm:inline text-coffee-dark/40">
                Hover or touch to pause • Click card to preview
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal with Warm Espresso Grading and Cappuccino Aura */}
      <AnimatePresence>
        {activeItem && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setActiveItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#241A1A]/95 border border-cappuccino/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl overflow-hidden w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_25px_60px_rgba(0,0,0,0.5)] relative flex flex-col"
            >
              {/* Compact Close Button (Finger-friendly) */}
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-20 w-10 h-10 sm:w-9 sm:h-9 rounded-full bg-black/70 hover:bg-cappuccino active:scale-95 text-white hover:text-coffee-dark transition-all flex items-center justify-center shadow-lg border border-white/10"
                title="Close"
                aria-label="Close lightbox"
              >
                <X size={18} />
              </button>

              {/* Compact High-Quality Image Container with Warm Glow */}
              <div className="relative aspect-[4/3] w-full max-h-[260px] sm:max-h-[380px] bg-[#160E0E] flex items-center justify-center overflow-hidden shrink-0">
                {/* Warm ambient backdrop blur with cappuccino glow */}
                <div className="absolute inset-0 bg-radial from-cappuccino/30 via-cappuccino/10 to-transparent blur-2xl pointer-events-none" />
                <Image
                  src={activeItem.image}
                  alt=""
                  fill
                  className="object-cover blur-2xl opacity-40 scale-125 pointer-events-none saturate-150"
                />
                {/* High resolution authentic photo */}
                <Image
                  src={activeItem.image}
                  alt={activeItem.title}
                  fill
                  quality={98}
                  sizes="(max-width: 640px) 95vw, 512px"
                  className="object-contain relative z-10 p-1 sm:p-1.5 drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
                />
              </div>

              {/* Compact Content */}
              <div className="p-4 sm:p-6 text-white bg-transparent">
                <div className="flex items-center gap-1.5 mb-1.5 text-cappuccino">
                  <Sparkles size={13} />
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-bold">
                    {activeItem.category}
                  </span>
                </div>
                <h2 className="text-base sm:text-xl font-serif font-bold text-white mb-1.5 sm:mb-2 leading-snug">
                  {activeItem.title}
                </h2>
                <p className="text-white/75 text-xs sm:text-sm leading-relaxed font-light">
                  {activeItem.description}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
