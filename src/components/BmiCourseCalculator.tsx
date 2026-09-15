"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Activity, 
  Sparkles, 
  ArrowRight, 
  MessageCircle, 
  Dumbbell, 
  HeartPulse,
  ArrowLeftRight,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import SectionHeading from "@/components/SectionHeading";

type GoalType = "fat_loss" | "muscle" | "flexibility" | "stamina";

export default function BmiCourseCalculator() {
  const [height, setHeight] = useState<number>(170); // cm
  const [weight, setWeight] = useState<number>(70);  // kg
  const [selectedGoal, setSelectedGoal] = useState<GoalType>("fat_loss");
  const [manualSwap, setManualSwap] = useState<boolean>(false);

  // Height & Weight helpers
  const feetInches = useMemo(() => {
    const totalInches = height / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}' ${inches}"`;
  }, [height]);

  const weightLbs = useMemo(() => Math.round(weight * 2.20462), [weight]);

  // BMI Math
  const { bmi, category, color, idealMin, idealMax, needlePosition } = useMemo(() => {
    const heightInM = height / 100;
    const val = Number((weight / (heightInM * heightInM)).toFixed(1));

    let cat = "Normal Weight";
    let col = "#34D399"; // Green

    if (val < 18.5) {
      cat = "Underweight";
      col = "#38BDF8"; // Blue
    } else if (val >= 18.5 && val < 25) {
      cat = "Normal Weight";
      col = "#34D399"; // Green
    } else if (val >= 25 && val < 30) {
      cat = "Overweight";
      col = "#FBBF24"; // Yellow
    } else {
      cat = "Obese";
      col = "#F87171"; // Red
    }

    const minWeight = Math.round(18.5 * heightInM * heightInM);
    const maxWeight = Math.round(24.9 * heightInM * heightInM);

    const clamped = Math.min(Math.max(val, 15), 35);
    const pct = ((clamped - 15) / (35 - 15)) * 100;

    return {
      bmi: val,
      category: cat,
      color: col,
      idealMin: minWeight,
      idealMax: maxWeight,
      needlePosition: Math.min(Math.max(pct, 4), 96)
    };
  }, [height, weight]);

  // Dynamic Course Recommender: Choices dynamically change based on BMI + Goal
  // - When Overweight (or Fat Loss / Muscle Goal): Fitness is 1st, Yoga is 2nd.
  // - When Normal / Flexibility Goal: Yoga is 1st, Fitness is 2nd.
  // - manualSwap allows instant 1-click manual flipping of 1st & 2nd choice.
  const isFitnessFirst = useMemo(() => {
    let fitnessPriority = true;
    if (selectedGoal === "flexibility") {
      fitnessPriority = false;
    } else if (selectedGoal === "fat_loss" || selectedGoal === "muscle") {
      fitnessPriority = true;
    } else {
      // Based purely on BMI
      fitnessPriority = bmi >= 25 || bmi < 18.5;
    }
    return manualSwap ? !fitnessPriority : fitnessPriority;
  }, [bmi, selectedGoal, manualSwap]);

  // Course Definitions (Simple, professional English)
  const fitnessCourse = useMemo(() => ({
    name: "Fitness & Calisthenics",
    tagline: "Strength, Fat Burn & Functional Stamina",
    description: bmi >= 25 
      ? "Daily bodyweight circuits and cardio to burn fat, boost metabolism, and improve stamina without joint strain."
      : "Functional strength training, core conditioning, and calisthenics to build lean muscle and athletic power.",
    benefits: ["Full-body fat burn & muscle tone", "Core stability & posture correction", "Morning & Evening daily batches"],
    enrollParam: "Fitness"
  }), [bmi]);

  const yogaCourse = useMemo(() => ({
    name: "Yoga & Flexibility",
    tagline: "Mobility, Balance & Mind-Body Health",
    description: bmi >= 25
      ? "Low-impact postures and guided breathwork to release joint tension, lower stress, and speed up body recovery."
      : "Traditional asanas and core balance drills to maximize flexibility, spinal health, and mental focus.",
    benefits: ["Deep joint mobility & back pain relief", "Pranayama breathing & stress control", "Guided sessions for all age groups"],
    enrollParam: "Yoga"
  }), [bmi]);

  const firstCourse = isFitnessFirst ? fitnessCourse : yogaCourse;
  const secondCourse = isFitnessFirst ? yogaCourse : fitnessCourse;

  // WhatsApp Link
  const whatsAppUrl = useMemo(() => {
    const text = `Hello Master Murali, I checked my BMI on vajrafitnessarts.com:
• Height: ${height} cm (${feetInches})
• Weight: ${weight} kg (${weightLbs} lbs)
• BMI: ${bmi} (${category})
• 1st Choice: ${firstCourse.name}
• 2nd Choice: ${secondCourse.name}

I would like to inquire about batch timings and admissions.`;
    return `https://wa.me/919047743533?text=${encodeURIComponent(text)}`;
  }, [height, weight, feetInches, weightLbs, bmi, category, firstCourse, secondCourse]);

  return (
    <section className="py-10 sm:py-14 px-4 sm:px-6 md:px-12 bg-gradient-to-b from-[#181111] via-[#201515] to-[#181111] relative z-10 text-white border-y border-cappuccino/20">
      <div className="max-w-6xl mx-auto">
        
        {/* Compact Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <span className="text-[10px] uppercase tracking-[0.3em] text-cappuccino font-extrabold block mb-1.5">
            Body Assessment &amp; Course Matcher
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-white font-bold mb-2">
            Calculate Your BMI &amp; Ideal Program
          </h2>
          <p className="text-xs sm:text-sm text-white/70">
            Enter your height and weight to see your BMI score and the best course combination recommended for you.
          </p>
        </div>

        {/* Compact 2-Column Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          
          {/* LEFT: Compact Calculator Card (5 Columns) */}
          <div className="lg:col-span-5 bg-[#251A1A]/90 p-5 sm:p-6 rounded-2xl border border-cappuccino/30 shadow-xl backdrop-blur-sm">
            
            {/* Height & Weight Inputs */}
            <div className="space-y-4">
              {/* Height */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                  <span className="text-white/80">Height: <span className="text-cappuccino font-normal">{feetInches}</span></span>
                  <div className="flex items-center gap-1 bg-black/40 px-2.5 py-0.5 rounded-lg border border-white/10">
                    <input
                      type="number"
                      min={110}
                      max={220}
                      value={height}
                      onChange={(e) => setHeight(Math.min(Math.max(Number(e.target.value) || 110, 100), 230))}
                      className="w-10 bg-transparent text-right font-bold text-xs text-white focus:outline-none"
                    />
                    <span className="text-[11px] text-white/50">cm</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={120}
                  max={215}
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full h-1.5 bg-white/15 rounded-lg appearance-none cursor-pointer accent-[#DDA922]"
                />
              </div>

              {/* Weight */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                  <span className="text-white/80">Weight: <span className="text-cappuccino font-normal">{weightLbs} lbs</span></span>
                  <div className="flex items-center gap-1 bg-black/40 px-2.5 py-0.5 rounded-lg border border-white/10">
                    <input
                      type="number"
                      min={35}
                      max={160}
                      value={weight}
                      onChange={(e) => setWeight(Math.min(Math.max(Number(e.target.value) || 35, 30), 180))}
                      className="w-10 bg-transparent text-right font-bold text-xs text-white focus:outline-none"
                    />
                    <span className="text-[11px] text-white/50">kg</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={35}
                  max={150}
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full h-1.5 bg-white/15 rounded-lg appearance-none cursor-pointer accent-[#DDA922]"
                />
              </div>
            </div>

            {/* Quick Goals Pill Row */}
            <div className="mt-4 pt-3 border-t border-white/10">
              <span className="text-[11px] text-white/70 block mb-2 font-medium">Your Goal:</span>
              <div className="grid grid-cols-2 gap-1.5">
                {(
                  [
                    { id: "fat_loss", label: "🔥 Fat Loss" },
                    { id: "muscle", label: "⚡ Build Muscle" },
                    { id: "flexibility", label: "🧘 Flexibility" },
                    { id: "stamina", label: "🏆 Overall Stamina" }
                  ] as const
                ).map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      setSelectedGoal(g.id);
                      setManualSwap(false);
                    }}
                    className={cn(
                      "py-1.5 px-2 rounded-lg text-left text-xs transition-all border",
                      selectedGoal === g.id
                        ? "bg-cappuccino/25 border-cappuccino text-white font-semibold"
                        : "bg-black/30 border-white/10 text-white/70 hover:bg-white/5"
                    )}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Compact BMI Output Result */}
            <div className="mt-4 p-3.5 rounded-xl bg-black/40 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-white/60 uppercase tracking-wider block">Your BMI</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-serif font-bold text-white">{bmi}</span>
                    <span className="text-[11px] text-white/50">kg/m²</span>
                  </div>
                </div>
                <div className="text-right">
                  <span 
                    className="text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider inline-block"
                    style={{ backgroundColor: `${color}25`, color: color, border: `1px solid ${color}50` }}
                  >
                    {category}
                  </span>
                  <span className="text-[10px] text-white/50 block mt-1">
                    Ideal: {idealMin}–{idealMax} kg
                  </span>
                </div>
              </div>

              {/* Progress Needle Bar */}
              <div className="relative mt-2.5 pt-1">
                <div className="h-2 w-full rounded-full bg-gradient-to-r from-[#38BDF8] via-[#34D399] via-50% via-[#FBBF24] to-[#F87171] relative">
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-4 bg-white rounded-sm shadow-md border border-black/50"
                    animate={{ left: `${needlePosition}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                </div>
                <div className="flex justify-between text-[8px] text-white/45 mt-1 font-medium">
                  <span>Under (&lt;18.5)</span>
                  <span>Normal (18.5-24.9)</span>
                  <span>Over (25+)</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: Course Recommendations (7 Columns) */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-4">
            
            {/* Top Control Bar with Swap Button */}
            <div className="flex items-center justify-between bg-cappuccino/10 border border-cappuccino/20 px-4 py-2 rounded-xl text-xs">
              <div className="flex items-center gap-1.5 text-white/90 font-medium">
                <Sparkles className="w-4 h-4 text-cappuccino shrink-0" />
                <span>Recommended Courses for You:</span>
              </div>
              
              <button
                type="button"
                onClick={() => setManualSwap(!manualSwap)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium transition-all"
                title="Switch 1st and 2nd choices"
              >
                <ArrowLeftRight className="w-3 h-3 text-cappuccino" />
                <span>Swap 1st &amp; 2nd</span>
              </button>
            </div>

            {/* 1st Choice Card */}
            <motion.div 
              key={`1st-${firstCourse.name}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-[#2D1F1F] to-[#1E1414] p-4 sm:p-5 rounded-2xl border-2 border-[#DDA922]/70 shadow-lg relative"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#DDA922] text-black">
                  🥇 1st Choice • Recommended
                </span>
                <span className="text-[11px] text-white/50 flex items-center gap-1">
                  {isFitnessFirst ? <Dumbbell className="w-3.5 h-3.5 text-cappuccino" /> : <HeartPulse className="w-3.5 h-3.5 text-cappuccino" />}
                  {firstCourse.name}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-serif font-bold text-white mb-0.5">
                {firstCourse.name}
              </h3>
              <p className="text-[11px] text-cappuccino font-medium uppercase tracking-wide mb-2">
                {firstCourse.tagline}
              </p>
              <p className="text-xs text-white/80 leading-relaxed mb-3">
                {firstCourse.description}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3 text-[11px] text-white/70">
                {firstCourse.benefits.map((b, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-[#DDA922]" />
                    {b}
                  </span>
                ))}
              </div>

              <div className="pt-2.5 border-t border-white/10 flex items-center justify-between gap-2">
                <span className="text-[10px] text-white/50">Daily Batches: Morning &amp; Evening</span>
                <Link
                  href={`/portal?tab=enroll&course=${firstCourse.enrollParam}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#DDA922] to-[#B57C1E] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all"
                >
                  <span>Enroll 1st Choice</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>

            {/* 2nd Choice Card */}
            <motion.div 
              key={`2nd-${secondCourse.name}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="bg-gradient-to-br from-[#241A1A] to-[#181111] p-4 sm:p-5 rounded-2xl border border-cappuccino/40 shadow-md relative"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cappuccino/25 text-cappuccino border border-cappuccino/40">
                  🥈 2nd Choice • Perfect Synergy
                </span>
                <span className="text-[11px] text-white/50 flex items-center gap-1">
                  {!isFitnessFirst ? <Dumbbell className="w-3.5 h-3.5 text-cappuccino" /> : <HeartPulse className="w-3.5 h-3.5 text-cappuccino" />}
                  {secondCourse.name}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-serif font-bold text-white mb-0.5">
                {secondCourse.name}
              </h3>
              <p className="text-[11px] text-cappuccino font-medium uppercase tracking-wide mb-2">
                {secondCourse.tagline}
              </p>
              <p className="text-xs text-white/80 leading-relaxed mb-3">
                {secondCourse.description}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3 text-[11px] text-white/70">
                {secondCourse.benefits.map((b, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-cappuccino" />
                    {b}
                  </span>
                ))}
              </div>

              <div className="pt-2.5 border-t border-white/10 flex items-center justify-between gap-2">
                <span className="text-[10px] text-white/50">Daily Batches: Morning &amp; Evening</span>
                <Link
                  href={`/portal?tab=enroll&course=${secondCourse.enrollParam}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cappuccino/20 hover:bg-cappuccino/30 text-cappuccino border border-cappuccino/40 font-bold text-xs uppercase tracking-wider transition-all"
                >
                  <span>Enroll 2nd Choice</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>

            {/* Compact WhatsApp Consultation CTA */}
            <div className="p-3 sm:p-3.5 rounded-xl bg-black/30 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left">
              <span className="text-[11px] text-white/70">
                Need guidance? You can also ask Master Murali directly for personal advice.
              </span>
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-xs uppercase tracking-wider transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Ask on WhatsApp</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
