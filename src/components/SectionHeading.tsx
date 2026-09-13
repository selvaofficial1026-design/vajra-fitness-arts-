"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  inverted?: boolean;
}

export default function SectionHeading({ title, subtitle, centered = true, className, inverted = false }: SectionHeadingProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn("mb-12 sm:mb-16 md:mb-20 px-2 sm:px-0", centered ? "text-center" : "text-left", className)}
    >
      {subtitle && (
        <span className={cn(
          "inline-block font-extrabold text-[9px] sm:text-[10px] md:text-xs tracking-[0.25em] sm:tracking-[0.4em] uppercase mb-3 sm:mb-5",
          inverted ? "text-cappuccino drop-shadow-sm" : "text-[#9E6530]"
        )}>
          {subtitle}
        </span>
      )}
      <h2 className={cn(
        "text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif leading-tight text-balance font-bold",
        inverted ? "text-white" : "text-coffee-dark",
        centered && "mx-auto max-w-3xl"
      )}>
        {title}
      </h2>
      <div className={cn(
        "flex items-center gap-3 sm:gap-4 mt-6 sm:mt-8",
        centered && "justify-center"
      )}>
        <div className={cn("h-[1px] w-8 sm:w-12", inverted ? "bg-cappuccino/40" : "bg-cappuccino/35")} />
        <div className="h-[5px] w-[5px] sm:h-[6px] sm:w-[6px] rounded-full bg-cappuccino shadow-[0_0_8px_rgba(200,149,95,0.7)]" />
        <div className={cn("h-[1px] w-8 sm:w-12", inverted ? "bg-cappuccino/40" : "bg-cappuccino/35")} />
      </div>
    </motion.div>
  );
}
