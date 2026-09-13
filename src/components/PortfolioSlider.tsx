"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PortfolioItem {
  name: string;
  description: string;
  image: string;
  category: string;
  videoId?: string;
  is4K?: boolean;
}

interface PortfolioSliderProps {
  items: PortfolioItem[];
  onPlay: (videoId: string) => void;
  isPaused?: boolean;
}

export default function PortfolioSlider({ items, onPlay, isPaused = false }: PortfolioSliderProps) {
  const [isSliderHovered, setIsSliderHovered] = useState(false);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPaused || isSliderHovered) return;

    const interval = setInterval(() => {
      if (sliderRef.current) {
        // Incrementing by 1.5 makes it 50% faster, but scrollLeft truncates.
        // So we increment by 2 every 25ms (which is faster than 1 every 20ms) or just 1 every 10ms.
        // Let's use 1 pixel every 10ms (approx 100fps or 100px/sec)
        sliderRef.current.scrollLeft += 1;
        
        // Reset scroll position for infinite loop effect
        if (sliderRef.current.scrollLeft >= sliderRef.current.scrollWidth / 2) {
          sliderRef.current.scrollLeft = 0;
        }
      }
    }, 10); // 10ms interval (approx 100px/sec) for faster, smooth scrolling

    return () => clearInterval(interval);
  }, [isPaused, isSliderHovered]);

  if (items.length === 0) {
    return (
      <div className="flex justify-center py-20 text-coffee-dark/40 font-serif italic text-xl">
        No projects found in this category.
      </div>
    );
  }

  // Duplicate items for seamless infinite scrolling
  const duplicatedItems = items.length < 4 
    ? [...items, ...items, ...items, ...items] 
    : [...items, ...items];

  return (
    <div 
      className="relative group/slider w-full max-w-full overflow-hidden px-0 py-10 pb-16"
      onMouseEnter={() => setIsSliderHovered(true)}
      onMouseLeave={() => {
        setIsSliderHovered(false);
        setHoveredCardIndex(null);
      }}
      onTouchStart={() => setIsSliderHovered(true)}
      onTouchEnd={() => {
        setIsSliderHovered(false);
        setHoveredCardIndex(null);
      }}
    >
      
      {/* Continuous Marquee Container */}
      <div 
        ref={sliderRef}
        className="flex gap-8 pl-8 overflow-x-auto [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {duplicatedItems.map((item, index) => {
          const isCardHovered = hoveredCardIndex === index;
          const isAnotherCardHovered = hoveredCardIndex !== null && hoveredCardIndex !== index;

          return (
            <motion.div
              key={item.name + index}
              onMouseEnter={() => setHoveredCardIndex(index)}
              onMouseLeave={() => setHoveredCardIndex(null)}
              animate={{
                scale: isCardHovered ? 1.05 : isAnotherCardHovered ? 0.98 : 1,
                opacity: isAnotherCardHovered ? 0.7 : 1,
                y: isCardHovered ? -15 : 0,
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={cn(
                "w-[85vw] sm:w-[45vw] md:w-[380px] lg:w-[420px] xl:w-[30vw] shrink-0 relative transition-all duration-300",
                isCardHovered ? "z-30" : "z-10"
              )}
            >
              <div 
                onClick={() => item.videoId && onPlay(item.videoId)}
                className={cn(
                  "group/card bg-white rounded-2xl overflow-hidden cursor-pointer h-full flex flex-col transition-all duration-500 border border-cream/50",
                  isCardHovered ? "shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-cappuccino/50" : "shadow-lg"
                )}
              >
                {/* Glow Effect behind the card (VFX style) */}
                {isCardHovered && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -inset-1 bg-gradient-to-r from-cappuccino/40 to-cream/40 blur-xl z-[-1]"
                  />
                )}

                {/* Poster Image Area */}
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    quality={100}
                    sizes="(max-width: 768px) 80vw, 33vw"
                    className="object-cover transition-transform duration-[2000ms] ease-out pointer-events-none group-hover/card:scale-110"
                  />
                  
                  {/* Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-coffee-dark/95 via-coffee-dark/20 to-transparent opacity-80 group-hover/card:opacity-100 transition-opacity duration-500" />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all duration-500 transform group-hover/card:scale-100 scale-50">
                    <div className="w-16 h-16 bg-cappuccino/90 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(200,160,120,0.6)] hover:scale-110 hover:bg-white hover:text-cappuccino transition-all duration-300">
                      <Play fill="currentColor" size={24} className="ml-1" />
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: isCardHovered ? 1 : 0.8, x: 0 }}
                      className="bg-cappuccino/95 backdrop-blur-md text-coffee-dark px-3 py-1 rounded-full text-[9px] uppercase tracking-[0.2em] font-bold shadow-lg w-fit"
                    >
                      {item.category}
                    </motion.div>
                  </div>

                  {item.is4K && (
                    <div className="absolute top-3 right-3 z-10 bg-white/95 backdrop-blur-md px-2 py-1 rounded-md shadow-xl flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full border border-green-600 flex items-center justify-center">
                        <div className="w-1 h-1 rounded-full bg-green-600" />
                      </div>
                      <span className="text-[8px] font-bold uppercase tracking-widest text-green-700">4K</span>
                    </div>
                  )}
                  
                  {/* Title inside poster */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 transform translate-y-2 group-hover/card:translate-y-0 transition-transform duration-500">
                    <h3 className="text-lg md:text-2xl font-serif text-white font-bold mb-1 drop-shadow-lg leading-tight">
                      {item.name}
                    </h3>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: isCardHovered ? "2rem" : "0rem" }}
                      className="h-[2px] bg-cappuccino transition-all duration-500" 
                    />
                  </div>
                </div>

                {/* Description Area */}
                <div className="p-4 flex-1 flex flex-col justify-between bg-white z-20">
                  <p className="text-coffee-dark/80 text-xs font-sans line-clamp-2 leading-relaxed font-normal group-hover/card:text-coffee-dark transition-colors">
                    {item.description}
                  </p>
                  <div className="mt-4 pt-3 border-t border-cream flex justify-between items-center">
                    <p className="text-[8px] uppercase tracking-[0.3em] text-coffee-dark/40 font-bold">
                      Vajra Fitness Arts
                    </p>
                    <motion.span 
                      animate={{ x: isCardHovered ? 5 : 0 }}
                      className="text-[9px] uppercase tracking-widest font-bold text-cappuccino flex items-center gap-1"
                    >
                      Play <Play size={8} fill="currentColor" />
                    </motion.span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
    </div>
  );
}
