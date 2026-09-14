"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Play, Clock } from "lucide-react";

interface MenuItemCardProps {
  name: string;
  description: string;
  price: string;
  schedule?: string;
  image: string;
  category?: string;
  is4K?: boolean;
  tag?: string;
  youtubeId?: string;
  index?: number;
  onPlay?: (youtubeId: string) => void;
}

export default function MenuItemCard({
  name,
  description,
  price,
  schedule,
  image,
  category,
  is4K,
  tag,
  youtubeId,
  index = 0,
  onPlay
}: MenuItemCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push("/course");
  };

  return (
    <motion.div
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ duration: 0.5, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="group bg-white rounded-2xl sm:rounded-premium overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-500 border border-cappuccino/30 w-full cursor-pointer flex flex-col justify-between"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          quality={100}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
        />
        {/* Warm rich cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#241A1A]/85 via-[#241A1A]/30 to-transparent group-hover:from-[#241A1A]/95 transition-colors duration-500 pointer-events-none" />
        
        {/* Dedicated Video Trigger with Stop Propagation */}
        {youtubeId && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 z-10 pointer-events-none">
            <button
              type="button"
              aria-label={`Watch ${name} video preview`}
              onClick={(e) => {
                e.stopPropagation();
                if (onPlay) onPlay(youtubeId);
              }}
              className="w-12 h-12 sm:w-14 sm:h-14 bg-cappuccino hover:bg-[#d6a570] text-coffee-dark rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(200,149,95,0.7)] border border-white/40 hover:scale-110 active:scale-95 transition-all pointer-events-auto cursor-pointer"
            >
              <Play className="text-coffee-dark ml-0.5 fill-coffee-dark" size={20} />
            </button>
          </div>
        )}
        
        {/* Harmonious Warm Tag Badges */}
        <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 right-16 flex flex-wrap gap-1.5 sm:gap-2 pointer-events-none">
          {category && (
            <div className="bg-cappuccino/95 backdrop-blur-md text-coffee-dark px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[9px] uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold shadow-md w-fit border border-cappuccino/30">
              {category}
            </div>
          )}
          {tag && (
            <div className="bg-[#241A1A]/90 backdrop-blur-md text-white px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[9px] uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold shadow-md w-fit truncate max-w-[140px] sm:max-w-none border border-cappuccino/30">
              {tag}
            </div>
          )}
        </div>

        {is4K !== undefined && (
          <div className="absolute top-2.5 sm:top-3 right-2.5 sm:right-3 bg-[#241A1A]/85 backdrop-blur-md px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg shadow-xl border border-cappuccino/30 flex items-center gap-1 sm:gap-1.5">
            <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full border-2 ${is4K ? 'border-green-500' : 'border-amber-500'} flex items-center justify-center`}>
              <div className={`w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full ${is4K ? 'bg-green-500' : 'bg-amber-500'}`} />
            </div>
            <span className={`text-[7px] sm:text-[8px] font-bold uppercase tracking-widest ${is4K ? 'text-green-400' : 'text-amber-300'}`}>
              {is4K ? '4K' : 'HD'}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Header row with Name and Badge */}
          <div className="flex justify-between items-baseline gap-2 mb-2">
            <h3 className="text-base sm:text-lg font-serif text-coffee-dark font-bold group-hover:text-cappuccino transition-colors duration-300 line-clamp-1">
              {name}
            </h3>
            <span className="text-cappuccino font-bold font-sans text-xs shrink-0 px-2.5 py-0.5 rounded-full bg-cappuccino/10 border border-cappuccino/30 max-w-[130px] truncate">
              {price && price.length > 20 ? "Daily Batches" : price}
            </span>
          </div>
          <p className="text-coffee-dark/80 text-xs font-sans line-clamp-2 leading-relaxed font-normal min-h-[2.5rem]">
            {description}
          </p>

          {/* Dedicated responsive Batch Timings box that fits cleanly on all mobile screens */}
          {(schedule || (price && price.length > 20)) && (
            <div className="mt-3 p-2.5 rounded-xl bg-cappuccino/10 border border-cappuccino/20 flex items-start gap-2">
              <Clock size={13} className="text-cappuccino shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <span className="text-[9px] uppercase tracking-wider text-coffee-dark/60 font-bold block">
                  Batch Timings:
                </span>
                <p className="text-[10.5px] text-coffee-dark/85 font-medium leading-snug break-words">
                  {schedule || price}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-cappuccino/20 flex justify-between items-center gap-2">
          <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-coffee-dark/50 font-bold truncate">
            Vajra Fitness Arts
          </p>
          <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-cappuccino font-bold group-hover:text-[#a06935] group-hover:translate-x-0.5 transition-all shrink-0">
            View Course →
          </span>
        </div>
      </div>
    </motion.div>
  );
}
