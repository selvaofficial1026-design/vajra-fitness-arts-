"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import Magnetic from "./Magnetic";

export default function Hero() {
  const { scrollY } = useScroll();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Spring-smoothed Parallax: 0.25x background, subtle content counter-shift
  const rawYBg = useTransform(scrollY, [0, 800], [0, isMobile ? 0 : 160]);
  const rawYContent = useTransform(scrollY, [0, 800], [0, isMobile ? 0 : -60]);
  const yBg = useSpring(rawYBg, { stiffness: 90, damping: 25, restDelta: 0.001 });
  const yContent = useSpring(rawYContent, { stiffness: 90, damping: 25, restDelta: 0.001 });
  const opacity = useTransform(scrollY, [0, 450], [1, 0]);

  // Spring-smoothed 3D tilt with bounded ranges (max 5deg)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const tiltSpringConfig = { damping: 20, stiffness: 120 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), tiltSpringConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), tiltSpringConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    // Strictly clamp boundaries to [-0.5, 0.5]
    const normX = Math.max(-0.5, Math.min(0.5, clientX / innerWidth - 0.5));
    const normY = Math.max(-0.5, Math.min(0.5, clientY / innerHeight - 0.5));
    mouseX.set(normX);
    mouseY.set(normY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[100svh] sm:h-screen w-full flex items-center justify-center overflow-hidden p-0 perspective-1000 py-16 sm:py-0"
    >
      {/* Background Image with Pro Parallax & Rich Warm Cinematic Grade */}
      <motion.div 
        style={{ y: yBg }} 
        className="absolute -top-16 -bottom-16 inset-x-0 z-0 will-change-transform pointer-events-none"
      >
        <Image
          src="/images/logo_gold.jpeg"
          alt="Vajra Fitness Arts Logo"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover brightness-[0.36] scale-105"
        />
        {/* Warm vignette overlay and top shadow */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-[#241A1A]/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1212]/80 via-[#1A1212]/25 to-transparent pointer-events-none" />
      </motion.div>

      <motion.div 
        style={{ 
          y: yContent, 
          opacity,
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
        className="relative z-20 text-center px-4 xs:px-6 sm:px-12 max-w-5xl pt-16 sm:pt-24 md:pt-28 pb-14 sm:pb-0"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Prominent Golden Logo Crest with Warm Glow */}
          <div className="flex flex-col items-center justify-center mb-4 sm:mb-6">
            <div className="relative w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-cappuccino/80 shadow-[0_0_50px_rgba(200,149,95,0.7),0_0_20px_rgba(221,169,34,0.35)] ring-2 ring-cappuccino/30 bg-coffee-dark mb-3 sm:mb-4 hover:scale-105 transition-transform duration-500">
              <Image 
                src="/images/logo_gold.jpeg" 
                alt="Vajra Fitness Arts Logo" 
                fill 
                priority
                className="object-cover scale-110"
              />
            </div>
            <span className="inline-block px-3 xs:px-4 sm:px-5 py-1.5 sm:py-2 border border-cappuccino/50 rounded-full text-cappuccino text-[8px] sm:text-[10px] tracking-wider sm:tracking-[0.35em] uppercase backdrop-blur-md bg-[#1A1212]/80 shadow-lg max-w-full text-center font-bold">
              Vajra Fitness Arts • Fitness | Yoga | Martial Arts | Silambam
            </span>
          </div>

          {/* High-contrast readable typography */}
          <h1 className="text-3xl xs:text-4xl sm:text-6xl md:text-8xl font-serif text-white mb-4 sm:mb-8 md:mb-10 tracking-tight leading-[1.1] text-balance drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
            Ancient Disciplines. <br />
            <span className="italic font-normal text-cappuccino drop-shadow-[0_2px_12px_rgba(200,149,95,0.5)]">Modern Strength.</span>
          </h1>
          <p className="text-white/95 max-w-2xl mx-auto text-xs xs:text-sm sm:text-base md:text-lg font-normal leading-relaxed mb-6 sm:mb-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] px-2 sm:px-0">
            Build strength, discipline, and focus through professional training in Fitness, Yoga, Martial Arts, and Silambam.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-6 md:gap-8 w-full sm:w-auto max-w-xs sm:max-w-none mx-auto">
            <Magnetic className="w-full sm:w-auto">
              <Link
                href="/course"
                className="group relative w-full sm:w-auto px-8 sm:px-12 py-3.5 sm:py-5 bg-cappuccino text-coffee-dark rounded-full font-bold text-xs sm:text-sm tracking-widest uppercase overflow-hidden transition-all shadow-premium hover:shadow-[0_12px_35px_rgba(200,149,95,0.45)] active:scale-95 flex items-center justify-center"
              >
                <span className="relative z-10">Explore Courses</span>
                <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>
            </Magnetic>
            <Magnetic className="w-full sm:w-auto">
              <Link
                href="/contact"
                className="w-full sm:w-auto px-8 sm:px-12 py-3.5 sm:py-5 border-2 border-white/90 text-white rounded-full font-bold text-xs sm:text-sm tracking-widest uppercase hover:bg-white hover:text-coffee-dark transition-all backdrop-blur-sm shadow-premium active:scale-95 flex items-center justify-center"
              >
                Contact &amp; Admissions
              </Link>
            </Magnetic>
          </div>
        </motion.div>
      </motion.div>

      {/* Mobile-visible animated scroll indicator */}
      <motion.div 
        className="absolute bottom-3 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 sm:gap-2.5 z-20 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.3em] sm:tracking-[0.4em] text-white/80 font-bold whitespace-nowrap drop-shadow-md">
          Start Your Journey
        </span>
        <motion.div 
          animate={{ y: [0, 5, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1.5px] h-6 sm:h-12 md:h-16 bg-gradient-to-b from-cappuccino via-cappuccino/60 to-transparent rounded-full shadow-[0_0_8px_rgba(200,149,95,0.8)]"
        />
      </motion.div>
    </section>
  );
}
