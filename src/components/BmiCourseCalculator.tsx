"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  MessageCircle, 
  Dumbbell, 
  HeartPulse,
  CheckCircle2,
  Sparkles,
  Flame,
  Activity,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";

type GoalType = "fat_loss" | "muscle" | "flexibility" | "stamina";

export default function BmiCourseCalculator() {
  const [height, setHeight] = useState<number>(170); // cm
  const [weight, setWeight] = useState<number>(70);  // kg
  const [selectedGoal, setSelectedGoal] = useState<GoalType>("fat_loss");

  // Height & Weight helpers
  const feetInches = useMemo(() => {
    const totalInches = height / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}' ${inches}"`;
  }, [height]);

  const weightLbs = useMemo(() => Math.round(weight * 2.20462), [weight]);

  // BMI Math & Precision Categorization
  const { bmi, categoryConfig, idealMin, idealMax } = useMemo(() => {
    const heightInM = height / 100;
    const val = Number((weight / (heightInM * heightInM)).toFixed(1));

    const minWeight = Math.round(18.5 * heightInM * heightInM);
    const maxWeight = Math.round(24.9 * heightInM * heightInM);

    let config = {
      label: "Optimal Healthy Weight",
      badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
      dotClass: "bg-emerald-400",
      summary: "Balanced body mass index. Recommended: Agility, flexibility & sustained functional endurance."
    };

    if (val < 18.5) {
      config = {
        label: "Underweight Range",
        badgeClass: "bg-sky-500/15 text-sky-300 border-sky-500/30",
        dotClass: "bg-sky-400",
        summary: "Body mass deficit detected. Recommended: Progressive strength training & lean muscle conditioning."
      };
    } else if (val >= 18.5 && val < 25) {
      config = {
        label: "Optimal Healthy Weight",
        badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
        dotClass: "bg-emerald-400",
        summary: "Balanced body mass index. Recommended: Agility, core stability & martial discipline."
      };
    } else if (val >= 25 && val < 30) {
      config = {
        label: "Overweight Range",
        badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30",
        dotClass: "bg-amber-400",
        summary: "Surplus body mass. Recommended: High-metabolism circuits combined with joint-friendly yoga."
      };
    } else {
      config = {
        label: "High BMI Range",
        badgeClass: "bg-rose-500/15 text-rose-300 border-rose-500/30",
        dotClass: "bg-rose-400",
        summary: "Substantial mass surplus. Recommended: Safe, low-impact conditioning & spine mobility."
      };
    }

    return {
      bmi: val,
      categoryConfig: config,
      idealMin: minWeight,
      idealMax: maxWeight
    };
  }, [height, weight]);

  // Dynamic Course Recommender:
  // - Overweight (or Fat Loss / Muscle Goal) -> 1st: Fitness, 2nd: Yoga
  // - Normal Weight / Flexibility Goal -> 1st: Yoga, 2nd: Fitness
  const isFitnessFirst = useMemo(() => {
    if (selectedGoal === "flexibility") {
      return false;
    }
    if (selectedGoal === "fat_loss" || selectedGoal === "muscle") {
      return true;
    }
    return bmi >= 25 || bmi < 18.5;
  }, [bmi, selectedGoal]);

  // Course Definitions (Professional English)
  const fitnessCourse = useMemo(() => ({
    name: "Fitness & Calisthenics",
    tagline: "Strength, Fat Burn & Functional Stamina",
    description: bmi >= 25 
      ? "Daily bodyweight circuits and athletic conditioning to burn fat, activate metabolic rate, and build endurance safely without joint strain."
      : "Functional strength conditioning, core stability, and calisthenics to sculpt lean muscle and dynamic athletic resilience.",
    benefits: [
      "Full-body metabolic conditioning & core tone",
      "Corrective posture alignment & joint stability",
      "Direct guidance in morning & evening batches"
    ],
    enrollParam: "Fitness"
  }), [bmi]);

  const yogaCourse = useMemo(() => ({
    name: "Yoga & Flexibility",
    tagline: "Mobility, Balance & Mind-Body Health",
    description: bmi >= 25
      ? "Restorative postures and guided diaphragmatic breathwork to release spinal tension, lower systemic stress, and accelerate bodily recovery."
      : "Traditional asanas and balancing drills engineered to unlock deep flexibility, joint decompression, and unwavering mental focus.",
    benefits: [
      "Deep thoracic & hip mobility with back pain relief",
      "Pranayama breath control for stress management",
      "Structured progression suitable for all ages"
    ],
    enrollParam: "Yoga"
  }), [bmi]);

  const firstCourse = isFitnessFirst ? fitnessCourse : yogaCourse;
  const secondCourse = isFitnessFirst ? yogaCourse : fitnessCourse;

  // WhatsApp Link
  const whatsAppUrl = useMemo(() => {
    const text = `Hello Master Murali, I checked my BMI assessment on vajrafitnessarts.com:
• Height: ${height} cm (${feetInches})
• Weight: ${weight} kg (${weightLbs} lbs)
• BMI: ${bmi} (${categoryConfig.label})
• Primary Focus: ${firstCourse.name}
• Secondary Focus: ${secondCourse.name}

I would like to inquire about batch availability and admissions.`;
    return `https://wa.me/919047743533?text=${encodeURIComponent(text)}`;
  }, [height, weight, feetInches, weightLbs, bmi, categoryConfig.label, firstCourse, secondCourse]);

  const goals = [
    { id: "fat_loss", label: "Fat Loss & Conditioning", icon: Flame },
    { id: "muscle", label: "Strength & Muscle Tone", icon: Dumbbell },
    { id: "flexibility", label: "Mobility & Flexibility", icon: Sparkles },
    { id: "stamina", label: "Cardio & Stamina", icon: Activity }
  ] as const;

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 bg-[#1A1210] relative z-10 text-white border-y border-[#3E2B24] overflow-hidden">
      {/* Subtle luxury ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cappuccino/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#C8955F]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Professional Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 px-2">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-cappuccino font-extrabold block mb-2">
            Personalized Body Assessment
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif text-white font-bold mb-3 tracking-tight">
            Calculate Your BMI &amp; Ideal Program
          </h2>
          <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
            Enter your height and weight to assess your body mass index and receive a tailored, master-crafted training track.
          </p>
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="h-[1px] w-8 sm:w-12 bg-cappuccino/35" />
            <div className="h-[5px] w-[5px] rounded-full bg-cappuccino shadow-[0_0_8px_rgba(200,149,95,0.7)]" />
            <div className="h-[1px] w-8 sm:w-12 bg-cappuccino/35" />
          </div>
        </div>

        {/* 2-Column Assessment Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-7 items-start">
          
          {/* LEFT: Assessment Console */}
          <div className="lg:col-span-5 bg-[#231916] p-5 sm:p-7 rounded-3xl border border-[#3E2B24] shadow-2xl relative overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cappuccino/60 to-transparent" />

            {/* Height & Weight Sliders */}
            <div className="space-y-5">
              {/* Height */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/80 font-medium">Height</span>
                  <div className="flex items-center gap-2 bg-[#1A1210] px-3 py-1 rounded-xl border border-white/10 font-mono text-xs">
                    <span className="text-cappuccino font-bold">{height} cm</span>
                    <span className="text-white/40">•</span>
                    <span className="text-white/70">{feetInches}</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={120}
                  max={215}
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full h-2 bg-[#352520] rounded-lg appearance-none cursor-pointer accent-cappuccino"
                />
                <div className="flex justify-between text-[10px] text-white/40 font-mono">
                  <span>120 cm</span>
                  <span>170 cm</span>
                  <span>215 cm</span>
                </div>
              </div>

              {/* Weight */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/80 font-medium">Weight</span>
                  <div className="flex items-center gap-2 bg-[#1A1210] px-3 py-1 rounded-xl border border-white/10 font-mono text-xs">
                    <span className="text-cappuccino font-bold">{weight} kg</span>
                    <span className="text-white/40">•</span>
                    <span className="text-white/70">{weightLbs} lbs</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={35}
                  max={150}
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full h-2 bg-[#352520] rounded-lg appearance-none cursor-pointer accent-cappuccino"
                />
                <div className="flex justify-between text-[10px] text-white/40 font-mono">
                  <span>35 kg</span>
                  <span>75 kg</span>
                  <span>150 kg</span>
                </div>
              </div>
            </div>

            {/* Training Goal Selector */}
            <div className="mt-5 pt-4 border-t border-white/10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/70 block mb-2.5">
                Primary Fitness Priority:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {goals.map((g) => {
                  const Icon = g.icon;
                  const isSelected = selectedGoal === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setSelectedGoal(g.id)}
                      className={cn(
                        "p-2.5 rounded-xl text-left text-xs transition-all border flex items-center gap-2 cursor-pointer touch-manipulation",
                        isSelected
                          ? "bg-cappuccino/20 border-cappuccino text-white font-semibold shadow-xs"
                          : "bg-[#1A1210] border-white/10 text-white/70 hover:border-cappuccino/30 hover:text-white"
                      )}
                    >
                      <Icon className={cn("w-3.5 h-3.5 shrink-0", isSelected ? "text-cappuccino" : "text-white/50")} />
                      <span className="truncate">{g.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Precision BMI Metric Output Box */}
            <div className="mt-5 p-4 rounded-2xl bg-[#1A1210] border border-[#3E2B24] space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-white/50 uppercase tracking-wider font-semibold block">
                    Calculated Score
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                      {bmi}
                    </span>
                    <span className="text-xs text-white/50 font-mono">kg/m²</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border",
                    categoryConfig.badgeClass
                  )}>
                    <span className={cn("w-1.5 h-1.5 rounded-full", categoryConfig.dotClass)} />
                    <span>{categoryConfig.label}</span>
                  </span>
                  <span className="text-[11px] text-white/50 font-mono block mt-1">
                    Healthy Target: {idealMin}–{idealMax} kg
                  </span>
                </div>
              </div>

              {/* 4-Stage Precision Segmented Meter */}
              <div className="space-y-1.5 pt-1">
                <div className="grid grid-cols-4 gap-1.5 h-2 w-full">
                  <div className={cn(
                    "rounded-full transition-all duration-300",
                    bmi < 18.5 ? "bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.5)]" : "bg-sky-500/20"
                  )} />
                  <div className={cn(
                    "rounded-full transition-all duration-300",
                    bmi >= 18.5 && bmi < 25 ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" : "bg-emerald-500/20"
                  )} />
                  <div className={cn(
                    "rounded-full transition-all duration-300",
                    bmi >= 25 && bmi < 30 ? "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]" : "bg-amber-500/20"
                  )} />
                  <div className={cn(
                    "rounded-full transition-all duration-300",
                    bmi >= 30 ? "bg-rose-400 shadow-[0_0_10px_rgba(248,113,113,0.5)]" : "bg-rose-500/20"
                  )} />
                </div>

                <div className="grid grid-cols-4 text-[9px] font-medium text-center text-white/50 pt-0.5">
                  <span className={cn(bmi < 18.5 && "text-sky-300 font-bold")}>Under (&lt;18.5)</span>
                  <span className={cn(bmi >= 18.5 && bmi < 25 && "text-emerald-300 font-bold")}>Optimal (18.5–24.9)</span>
                  <span className={cn(bmi >= 25 && bmi < 30 && "text-amber-300 font-bold")}>Over (25–29.9)</span>
                  <span className={cn(bmi >= 30 && "text-rose-300 font-bold")}>High (30+)</span>
                </div>
              </div>

              <p className="text-[11px] text-white/70 font-light leading-relaxed pt-1 border-t border-white/5">
                {categoryConfig.summary}
              </p>
            </div>

          </div>

          {/* RIGHT: Tailored Course Recommendations */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* 1st Choice Card: Primary Recommended Focus */}
            <motion.div 
              key={`1st-${firstCourse.name}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="bg-gradient-to-br from-[#291D1A] to-[#1E1513] p-5 sm:p-6 rounded-3xl border border-cappuccino/45 shadow-xl relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-cappuccino/15 text-cappuccino border border-cappuccino/30 shadow-2xs">
                  <Sparkles size={12} className="text-cappuccino" />
                  <span>Primary Recommended Track</span>
                </span>
                <span className="text-xs font-bold text-white/60 flex items-center gap-1.5">
                  {isFitnessFirst ? <Dumbbell className="w-3.5 h-3.5 text-cappuccino" /> : <HeartPulse className="w-3.5 h-3.5 text-cappuccino" />}
                  <span>{firstCourse.name}</span>
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-1 tracking-tight group-hover:text-cappuccino transition-colors">
                {firstCourse.name}
              </h3>
              <p className="text-xs text-cappuccino font-semibold uppercase tracking-wider mb-2.5">
                {firstCourse.tagline}
              </p>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-4 font-light">
                {firstCourse.description}
              </p>

              <div className="space-y-1.5 mb-5 text-xs text-white/75">
                {firstCourse.benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cappuccino shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-[11px] text-white/50 font-mono">
                  Daily Batches: Morning &amp; Evening
                </span>
                <Link
                  href={`/portal?tab=enroll&course=${firstCourse.enrollParam}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-cappuccino hover:bg-[#b8824d] text-[#1A1210] font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg active:scale-95 transition-all text-center"
                >
                  <span>Enroll in Primary Track</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>

            {/* 2nd Choice Card: Complementary Discipline */}
            <motion.div 
              key={`2nd-${secondCourse.name}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="bg-[#211715] p-5 sm:p-6 rounded-3xl border border-white/10 hover:border-cappuccino/30 shadow-lg relative overflow-hidden transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-white/10 text-white/90 border border-white/15">
                  <Shield size={12} className="text-cappuccino" />
                  <span>Complementary Discipline</span>
                </span>
                <span className="text-xs font-bold text-white/60 flex items-center gap-1.5">
                  {!isFitnessFirst ? <Dumbbell className="w-3.5 h-3.5 text-cappuccino" /> : <HeartPulse className="w-3.5 h-3.5 text-cappuccino" />}
                  <span>{secondCourse.name}</span>
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-1 tracking-tight group-hover:text-cappuccino transition-colors">
                {secondCourse.name}
              </h3>
              <p className="text-xs text-cappuccino font-semibold uppercase tracking-wider mb-2.5">
                {secondCourse.tagline}
              </p>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-4 font-light">
                {secondCourse.description}
              </p>

              <div className="space-y-1.5 mb-5 text-xs text-white/75">
                {secondCourse.benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cappuccino/70 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-[11px] text-white/50 font-mono">
                  Daily Batches: Morning &amp; Evening
                </span>
                <Link
                  href={`/portal?tab=enroll&course=${secondCourse.enrollParam}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-transparent hover:bg-cappuccino/15 border border-cappuccino/40 text-cappuccino hover:border-cappuccino text-xs font-bold uppercase tracking-wider transition-all active:scale-95 text-center"
                >
                  <span>Enroll in Complementary Track</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>

            {/* Executive Consultation Strip with Head Coach Murali */}
            <div className="p-4 rounded-2xl bg-[#1A1210] border border-[#3E2B24] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cappuccino/15 border border-cappuccino/30 flex items-center justify-center text-cappuccino shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-white text-xs sm:text-sm">
                    Personal Batch &amp; Goal Consultation
                  </h4>
                  <p className="text-[11px] text-white/60 font-light">
                    Discuss your assessment directly with Head Coach Murali on WhatsApp.
                  </p>
                </div>
              </div>

              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-xs uppercase tracking-wider transition-all active:scale-95"
              >
                <span>Ask on WhatsApp</span>
                <ArrowRight size={13} />
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

