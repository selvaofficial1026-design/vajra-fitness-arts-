"use client";

import React, { useState, useEffect } from "react";
import SectionHeading from "@/components/SectionHeading";
import Image from "next/image";
import { motion } from "framer-motion";
import { Shield, Sparkles, Flame, Target, CheckCircle2, ArrowRight, MessageCircle } from "lucide-react";
import { DEFAULT_ABOUT_SETTINGS, AboutSettings } from "@/lib/cmsDefaults";

const defaultDisciplines = [
  {
    title: "Fitness",
    desc: "Full-body functional workouts, calisthenics, core stability, and cardio endurance tailored to each student."
  },
  {
    title: "Yoga",
    desc: "Guided flexibility training, posture alignment, joint mobility, and mindful breathing techniques."
  },
  {
    title: "Martial Arts",
    desc: "Practical striking techniques, boxing footwork, kick combinations, and real-world personal self-defense."
  },
  {
    title: "Silambam",
    desc: "Classical Tamil staff martial art, Kaalvari footwork, rapid double-hand stick spins, and combat drills."
  }
];

const pillars = [
  {
    icon: Shield,
    tamil: "ஒழுக்கம்",
    title: "Discipline",
    desc: "Daily consistency, mutual respect, and focus in every practice session."
  },
  {
    icon: Flame,
    tamil: "வேகம்",
    title: "Agility",
    desc: "Quick footwork, sharp reflexes, and smooth body movement."
  },
  {
    icon: Target,
    tamil: "வலிமை",
    title: "Strength",
    desc: "Functional strength and endurance built safely through guided training."
  },
  {
    icon: Sparkles,
    tamil: "அமைதி",
    title: "Inner Peace",
    desc: "A calm, positive mindset developed through breathing and mindfulness."
  }
];

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<AboutSettings>(DEFAULT_ABOUT_SETTINGS);

  useEffect(() => {
    fetch("/api/portal/cms?type=about")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.aboutSettings) {
          setAboutData(data.aboutSettings);
        }
      })
      .catch(() => {});
  }, []);

  const disciplines =
    aboutData.founderDisciplines && aboutData.founderDisciplines.length > 0
      ? aboutData.founderDisciplines
      : defaultDisciplines;

  return (
    <main className="min-h-screen flex flex-col pt-0 bg-background relative overflow-hidden">
      {/* Hero Section with Warm Cinematic Grade */}
      <section className="relative h-[48vh] sm:h-[55vh] md:h-[65vh] min-h-[360px] sm:min-h-[420px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={aboutData.heroImage || "/images/vajra_hero.jpg"}
            alt="Vajra Fitness Arts Story"
            fill
            priority
            className="object-cover brightness-[0.38] scale-105"
          />
          {/* Warm cinematic grade overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-[#241A1A]/40 to-transparent" />
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 pt-12 sm:pt-16">
          <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.35em] text-cappuccino block mb-3 drop-shadow-sm">
            About Our Academy
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif text-white mb-3 sm:mb-4 italic leading-tight">
            {aboutData.heroTitle || "The Vajra Journey"}
          </h1>
          <p className="text-white/70 max-w-xl mx-auto text-xs sm:text-sm md:text-base font-light px-2">
            {aboutData.heroSubtitle || "Promoting health, discipline, and traditional martial arts for modern everyday life."}
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 bg-white relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
            >
              <SectionHeading
                subtitle={aboutData.storySubtitle || "Our Background"}
                title={aboutData.storyTitle || "Building Strength and Character Through Movement Arts"}
                centered={false}
                className="mb-8 sm:mb-12 md:mb-16"
              />
              <p className="text-coffee-dark/80 text-base sm:text-lg md:text-xl font-light leading-relaxed mb-4 sm:mb-6">
                {aboutData.storyP1}
              </p>
              <p className="text-coffee-dark/65 leading-relaxed mb-6 sm:mb-8 text-xs sm:text-sm md:text-base font-light">
                {aboutData.storyP2}
              </p>

              {/* Stat Counters - Perfectly aligned across all viewports with elegant dividers */}
              <div className="grid grid-cols-3 gap-2 sm:gap-6 pt-6 sm:pt-8 border-t border-cream">
                <div className="text-left">
                  <h4 className="text-xl sm:text-3xl md:text-4xl font-serif text-coffee-dark italic mb-1 font-bold">
                    {aboutData.statStudents || "100+"}
                  </h4>
                  <p className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-wider sm:tracking-widest text-coffee-dark/60 font-bold">Students Trained</p>
                </div>
                <div className="text-left border-l border-cream pl-3 sm:pl-6">
                  <h4 className="text-xl sm:text-3xl md:text-4xl font-serif text-coffee-dark italic mb-1 font-bold">
                    {aboutData.statCoaching || "100%"}
                  </h4>
                  <p className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-wider sm:tracking-widest text-coffee-dark/60 font-bold">Direct Coaching</p>
                </div>
                <div className="text-left border-l border-cream pl-3 sm:pl-6">
                  <h4 className="text-xl sm:text-3xl md:text-4xl font-serif text-coffee-dark italic mb-1 font-bold">
                    {aboutData.statDisciplines || "4"}
                  </h4>
                  <p className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-wider sm:tracking-widest text-coffee-dark/60 font-bold">Disciplines</p>
                </div>
              </div>

              {/* Story Section Quote Block with Warm Cappuccino Accent Border */}
              <div className="mt-8 sm:mt-12 p-5 sm:p-7 bg-gradient-to-r from-cream/40 via-cream/15 to-transparent border-l-4 border-cappuccino rounded-r-2xl sm:rounded-r-3xl">
                <p className="text-base sm:text-lg md:text-xl font-serif text-coffee-dark italic leading-relaxed">
                  &ldquo;{aboutData.storyQuote}&rdquo;
                </p>
                <div className="mt-3 sm:mt-4 flex items-center gap-3 sm:gap-4">
                  <div className="w-8 sm:w-12 h-[1px] bg-cappuccino shrink-0" />
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] font-bold text-coffee-dark/70">
                    {aboutData.storyQuoteAuthor}
                  </span>
                </div>
              </div>
            </motion.div>

            <div className="relative aspect-[4/3] sm:aspect-square w-full max-w-md mx-auto lg:max-w-none rounded-2xl sm:rounded-[3rem] overflow-hidden shadow-premium hover:shadow-[0_20px_50px_rgba(200,149,95,0.25)] group transition-all duration-500 bg-coffee-dark border border-cream hover:border-cappuccino/50">
              <Image
                src={aboutData.storyImage || "/images/vajra_hero.jpg"}
                alt="Vajra Fitness Arts Training Academy"
                fill
                quality={100}
                unoptimized={Boolean(typeof aboutData.storyImage === "string" && aboutData.storyImage.startsWith("data:"))}
                className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Founder & Head Coach Section */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 bg-background relative z-10">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            subtitle={aboutData.founderRole || "Founder & Head Coach"}
            title="One Dedicated Trainer for All Disciplines"
            className="mb-8 sm:mb-12 md:mb-16"
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-8 sm:mt-16 bg-white rounded-2xl sm:rounded-[3rem] p-5 sm:p-8 md:p-14 border border-cream shadow-premium hover:shadow-[0_20px_50px_rgba(200,149,95,0.2)] transition-all duration-500 overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center">
              {/* Left Column: Founder Photo Card with Warm Cappuccino Border and Espresso Gradient */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="relative w-full max-w-[240px] sm:max-w-[280px] md:max-w-[300px] aspect-[4/5] rounded-2xl sm:rounded-[2.5rem] overflow-hidden shadow-2xl border-2 border-cappuccino/50 group bg-coffee-dark">
                  <Image
                    src={aboutData.founderPhoto || "/images/coach_murali_clean.jpg"}
                    alt={aboutData.founderName || "Vajra Fitness Arts Founder & Master Coach Murali"}
                    fill
                    priority
                    unoptimized={Boolean(typeof aboutData.founderPhoto === "string" && aboutData.founderPhoto.startsWith("data:"))}
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Espresso gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#241A1A]/90 via-[#241A1A]/25 to-transparent" />
                  <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
                    <span className="text-cappuccino text-[9px] uppercase tracking-[0.25em] sm:tracking-[0.3em] font-bold block mb-1">
                      {aboutData.founderRole || "Founder & Head Coach"}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif text-white italic font-bold">
                      {aboutData.founderName || "Vajra Fitness Arts"}
                    </h3>
                    <p className="text-white/80 text-[11px] sm:text-xs mt-1">
                      {aboutData.founderTagline || "Sole Master Trainer for All Disciplines"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 sm:mt-5 flex items-center justify-center gap-2.5 text-center">
                  <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-coffee-dark">
                    <span className="text-cappuccino">{aboutData.statCoaching || "100%"}</span> Direct Coaching
                  </span>
                  <span className="text-cappuccino/40 font-bold">•</span>
                  <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-coffee-dark">
                    All {aboutData.statDisciplines || "4"} Disciplines
                  </span>
                </div>
              </div>

              {/* Right Column: Founder Details & All 4 Disciplines */}
              <div className="lg:col-span-7 space-y-5 sm:space-y-6">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.4em] text-cappuccino font-bold block mb-1.5 sm:mb-2 text-center sm:text-left">
                    Personalized Training Approach
                  </span>
                  <h3 className="text-xl sm:text-3xl md:text-4xl font-serif text-coffee-dark italic font-bold leading-tight mb-3 sm:mb-4 text-center sm:text-left">
                    {aboutData.founderHeading || "Learn Directly from the Founder"}
                  </h3>
                  <p className="text-coffee-dark/75 leading-relaxed text-xs sm:text-sm md:text-base font-light text-center sm:text-left">
                    {aboutData.founderBio}
                  </p>
                </div>

                {/* 4 Disciplines Grid - Balanced and aligned with equal height and hover highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1 sm:pt-2">
                  {disciplines.map((disc, idx) => (
                    <div
                      key={idx}
                      className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-background/80 hover:bg-background border border-cream hover:border-cappuccino/50 transition-all duration-300 flex flex-col justify-start h-full shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                        <CheckCircle2 size={16} className="text-cappuccino shrink-0" />
                        <h4 className="font-serif font-bold text-coffee-dark text-sm sm:text-base">
                          {disc.title}
                        </h4>
                      </div>
                      <p className="text-[11px] sm:text-xs text-coffee-dark/75 font-light leading-relaxed">
                        {disc.desc}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Direct WhatsApp Coaching Action - Dedicated WhatsApp icon + bold font */}
                <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full">
                  <a
                    href={`https://wa.me/919047743533?text=${encodeURIComponent("Hello Vajra Fitness Arts, I would like to inquire about direct coaching with the Founder & Head Coach.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 sm:px-7 py-3.5 sm:py-4 bg-[#25D366] hover:bg-[#20bd5a] text-black rounded-2xl transition-all shadow-premium hover:shadow-[0_0_25px_rgba(37,211,102,0.4)] flex items-center justify-center gap-3 text-center active:scale-[0.98] cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-black/15 flex items-center justify-center shrink-0">
                      <MessageCircle size={18} className="text-black fill-black" />
                    </div>
                    <span className="font-black text-xs sm:text-sm uppercase tracking-wider text-black">
                      Chat with Head Coach on WhatsApp
                    </span>
                    <ArrowRight size={16} className="text-black shrink-0 ml-1 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <span className="text-xs text-coffee-dark/60 italic text-center sm:text-left">
                    Open for kids, teens, and adults.
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The 4 Pillars - Warm card backgrounds, icon circles with bg-cappuccino/15 text-cappuccino, and hover glow */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 bg-white border-t border-cream relative z-10">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            subtitle="Our Values"
            title="The Four Pillars of Vajra"
            className="mb-8 sm:mb-12 md:mb-16"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mt-8 sm:mt-16">
            {pillars.map((pillar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative p-5 sm:p-6 bg-gradient-to-b from-white to-[#FDFBF7] rounded-2xl sm:rounded-[2rem] border border-cream hover:border-cappuccino/50 shadow-premium hover:shadow-[0_20px_45px_rgba(200,149,95,0.22)] hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-500 overflow-hidden"
              >
                {/* Subtle ambient hover glow */}
                <div className="absolute -inset-px rounded-2xl sm:rounded-[2rem] bg-gradient-to-b from-cappuccino/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Icon circle */}
                <div className="w-10 h-10 rounded-full bg-cappuccino/15 text-cappuccino flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:bg-cappuccino group-hover:text-white transition-all duration-300">
                  <pillar.icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-serif text-cappuccino font-bold block mb-1">
                  {pillar.tamil}
                </span>
                <h4 className="text-base sm:text-lg font-bold text-coffee-dark mb-2 sm:mb-3 font-serif group-hover:text-cappuccino transition-colors">
                  {pillar.title}
                </h4>
                <p className="text-xs text-coffee-dark/70 leading-relaxed font-light">
                  {pillar.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
