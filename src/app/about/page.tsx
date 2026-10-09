"use client";

import React, { useState, useEffect } from "react";
import SectionHeading from "@/components/SectionHeading";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Sparkles,
  Flame,
  Target,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Clock,
  Calendar,
  X,
  Image as ImageIcon
} from "lucide-react";
import { DEFAULT_ABOUT_SETTINGS, AboutSettings, ArticleItem, DEFAULT_ARTICLES } from "@/lib/cmsDefaults";

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
  const [articles, setArticles] = useState<ArticleItem[]>(DEFAULT_ARTICLES);
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);

  useEffect(() => {
    fetch("/api/portal/cms")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.aboutSettings) setAboutData(data.aboutSettings);
          if (data.articles && data.articles.length > 0) setArticles(data.articles);
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

      {/* Coach Murali's Journal & Articles Section */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 bg-[#FCFAF6] border-t border-cream relative z-10">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            subtitle="Founder's Knowledge & Insights"
            title="Articles & Training Philosophy by Coach Murali"
            centered={true}
            className="mb-10 sm:mb-16"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {articles.map((article, idx) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="group flex flex-col bg-white rounded-3xl border border-cream hover:border-cappuccino/60 shadow-premium hover:shadow-[0_20px_45px_rgba(200,149,95,0.22)] transition-all duration-500 overflow-hidden cursor-pointer"
                onClick={() => setSelectedArticle(article)}
              >
                {/* Cover Image */}
                <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-coffee-dark/5">
                  <Image
                    src={article.coverImage || "/images/vajra_hero.jpg"}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Category Pill */}
                  <span className="absolute top-4 left-4 bg-coffee-dark/90 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    {article.category}
                  </span>

                  {/* Read Time */}
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white/90 text-[10px] font-mono px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Clock size={11} className="text-cappuccino" />
                    <span>{article.readTime || "4 min read"}</span>
                  </div>

                  {article.galleryImages && article.galleryImages.length > 0 && (
                    <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-white/20">
                      <ImageIcon size={12} className="text-cappuccino" />
                      <span>{article.galleryImages.length} Photos Attached</span>
                    </div>
                  )}
                </div>

                {/* Article Info */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-[11px] text-coffee-dark/55 font-medium">
                      <Calendar size={12} className="text-cappuccino shrink-0" />
                      <span>{article.publishedAt}</span>
                      <span>•</span>
                      <span className="text-coffee-dark/70 font-semibold">{article.author || "Coach Murali"}</span>
                    </div>

                    <h3 className="font-serif text-lg sm:text-xl font-bold text-coffee-dark group-hover:text-cappuccino transition-colors leading-snug line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-coffee-dark/70 font-light leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>

                  {/* Read More Trigger */}
                  <div className="pt-4 border-t border-cream flex items-center justify-between text-xs font-bold text-coffee-dark group-hover:text-cappuccino transition-colors">
                    <span className="uppercase tracking-wider">Read Full Article</span>
                    <div className="w-8 h-8 rounded-full bg-cream/60 group-hover:bg-cappuccino group-hover:text-white transition-all flex items-center justify-center shrink-0">
                      <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
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

      {/* Full Article Reader Modal with Rich In-Article Photos */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 xs:p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-cream overflow-hidden flex flex-col z-10 my-auto"
            >
              {/* Sticky Modal Top Bar */}
              <div className="p-4 sm:p-5 border-b border-cream bg-white/95 backdrop-blur-md flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-cappuccino/15 text-cappuccino rounded-full text-xs font-bold uppercase tracking-wider">
                    {selectedArticle.category}
                  </span>
                  <span className="text-xs text-coffee-dark/40 hidden xs:inline">•</span>
                  <span className="text-xs text-coffee-dark/60 font-mono hidden xs:inline flex items-center gap-1">
                    <Clock size={12} className="text-cappuccino" />
                    {selectedArticle.readTime || "4 min read"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="w-9 h-9 rounded-full bg-coffee-dark/5 hover:bg-coffee-dark/15 text-coffee-dark transition-all flex items-center justify-center cursor-pointer touch-manipulation"
                  title="Close article"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Article Body */}
              <div className="overflow-y-auto p-5 sm:p-8 md:p-10 space-y-6 sm:space-y-8">
                {/* Hero Banner */}
                <div className="relative w-full aspect-video sm:aspect-[21/9] rounded-2xl overflow-hidden bg-coffee-dark/10 shadow-md">
                  <Image
                    src={selectedArticle.coverImage || "/images/vajra_hero.jpg"}
                    alt={selectedArticle.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Article Header */}
                <div className="space-y-3 border-b border-cream pb-6">
                  <div className="flex items-center gap-2 text-xs text-coffee-dark/60">
                    <Calendar size={13} className="text-cappuccino" />
                    <span>Published on {selectedArticle.publishedAt}</span>
                  </div>
                  <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-coffee-dark leading-tight">
                    {selectedArticle.title}
                  </h1>
                  <p className="text-coffee-dark/75 text-sm sm:text-base font-medium leading-relaxed italic border-l-4 border-cappuccino pl-3 sm:pl-4 py-1.5 bg-[#FDFBF7] rounded-r-xl">
                    "{selectedArticle.excerpt}"
                  </p>
                </div>

                {/* Author Card */}
                <div className="flex items-center gap-3.5 p-3.5 bg-[#FDFBF7] rounded-2xl border border-cream">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-cream shrink-0 bg-coffee-dark/5">
                    <Image
                      src={aboutData.founderPhoto || "/images/coach_murali_clean.jpg"}
                      alt={selectedArticle.author || "Coach Murali"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-coffee-dark">
                      {selectedArticle.author || "Coach Murali"}
                    </h4>
                    <p className="text-[11px] text-coffee-dark/60">
                      Founder &amp; Head Coach • Vajra Fitness Arts
                    </p>
                  </div>
                </div>

                {/* Article Content Paragraphs */}
                <div className="space-y-4 text-coffee-dark/85 text-sm sm:text-base leading-relaxed font-light">
                  {selectedArticle.content.split("\n\n").map((para, i) => (
                    <p key={i} className="whitespace-pre-line">
                      {para}
                    </p>
                  ))}
                </div>

                {/* In-Article Demonstration Photos Showcase */}
                {selectedArticle.galleryImages && selectedArticle.galleryImages.length > 0 && (
                  <div className="pt-6 border-t border-cream space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-lg font-bold text-coffee-dark flex items-center gap-2">
                        <ImageIcon size={18} className="text-cappuccino" />
                        <span>Step-by-Step Technique &amp; Demonstration Photos</span>
                      </h3>
                      <span className="text-xs text-coffee-dark/50 font-mono">
                        {selectedArticle.galleryImages.length} photos
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedArticle.galleryImages.map((img, idx) => (
                        <div
                          key={idx}
                          className="group relative rounded-2xl overflow-hidden border border-cream bg-[#FDFBF7] shadow-sm hover:shadow-md transition-all flex flex-col"
                        >
                          <div className="relative aspect-[4/3] w-full overflow-hidden bg-coffee-dark/10">
                            <Image
                              src={img.url}
                              alt={img.caption || `Demonstration ${idx + 1}`}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          {img.caption && (
                            <div className="p-3 bg-white border-t border-cream text-xs text-coffee-dark/80 font-medium leading-snug">
                              <span className="text-cappuccino font-bold mr-1.5 font-mono">#{idx + 1}</span>
                              {img.caption}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Article Footer & Direct WhatsApp CTA */}
                <div className="pt-6 border-t border-cream bg-gradient-to-r from-cream/40 via-cream/15 to-transparent p-5 sm:p-7 rounded-2xl border-l-4 border-cappuccino space-y-4">
                  <div>
                    <h4 className="font-serif text-base sm:text-lg font-bold text-coffee-dark">
                      Have questions or wish to learn this discipline?
                    </h4>
                    <p className="text-xs sm:text-sm text-coffee-dark/70 font-light mt-1">
                      Discuss training techniques, batch timings, or personalized coaching directly with Head Coach Murali.
                    </p>
                  </div>

                  <a
                    href={`https://wa.me/919047743533?text=${encodeURIComponent(`Hello Coach Murali, I just read your article "${selectedArticle.title}" on Vajra Fitness Arts website and would like to inquire more.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
                  >
                    <MessageCircle size={17} className="fill-black" />
                    <span>Discuss on WhatsApp with Coach</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
