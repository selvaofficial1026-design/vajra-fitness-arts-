"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Flame, 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  MessageCircle, 
  Award, 
  ShieldCheck, 
  Dumbbell, 
  HeartPulse,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import SectionHeading from "@/components/SectionHeading";

type FitnessGoal = "fat_loss" | "muscle_gain" | "flexibility" | "overall_stamina";

interface GoalOption {
  id: FitnessGoal;
  label: string;
  icon: string;
}

const goalOptions: GoalOption[] = [
  { id: "fat_loss", label: "Fat Loss & Toning", icon: "🔥" },
  { id: "muscle_gain", label: "Strength & Muscle", icon: "⚡" },
  { id: "flexibility", label: "Flexibility & Posture", icon: "🧘" },
  { id: "overall_stamina", label: "Athletic Stamina", icon: "🏆" },
];

export default function BmiCourseCalculator() {
  const [height, setHeight] = useState<number>(170); // cm
  const [weight, setWeight] = useState<number>(70);  // kg
  const [selectedGoal, setSelectedGoal] = useState<FitnessGoal>("fat_loss");

  // Conversions for user convenience
  const feetInches = useMemo(() => {
    const totalInches = height / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}' ${inches}"`;
  }, [height]);

  const weightInLbs = useMemo(() => {
    return Math.round(weight * 2.20462);
  }, [weight]);

  // BMI Calculation
  const { bmi, category, color, idealMin, idealMax, needlePosition } = useMemo(() => {
    const heightInM = height / 100;
    const calculatedBmi = Number((weight / (heightInM * heightInM)).toFixed(1));

    let cat = "Normal";
    let col = "#34D399"; // Emerald

    if (calculatedBmi < 18.5) {
      cat = "Underweight";
      col = "#38BDF8"; // Cyan/Blue
    } else if (calculatedBmi >= 18.5 && calculatedBmi < 25) {
      cat = "Healthy / Athletic";
      col = "#34D399"; // Emerald
    } else if (calculatedBmi >= 25 && calculatedBmi < 30) {
      cat = "Overweight";
      col = "#FBBF24"; // Amber
    } else {
      cat = "High Need / Obese";
      col = "#F87171"; // Rose
    }

    const minWeight = Math.round(18.5 * heightInM * heightInM);
    const maxWeight = Math.round(24.9 * heightInM * heightInM);

    // Calculate meter needle position percentage (clamped between 15 and 35 BMI)
    const clampedBmi = Math.min(Math.max(calculatedBmi, 15), 35);
    const percentage = ((clampedBmi - 15) / (35 - 15)) * 100;

    return {
      bmi: calculatedBmi,
      category: cat,
      color: col,
      idealMin: minWeight,
      idealMax: maxWeight,
      needlePosition: Math.min(Math.max(percentage, 3), 97)
    };
  }, [height, weight]);

  // Client's requested trick: 1st Choice is ALWAYS Fitness, 2nd Choice is ALWAYS Yoga,
  // customized with high professional scientific rationale for their exact BMI bracket!
  const recommendations = useMemo(() => {
    if (bmi >= 25) {
      // Overweight / High Need
      return {
        firstChoice: {
          title: "Vajra High-Burn Functional Fitness & Calisthenics",
          subtitle: "Targeted Fat Loss & Metabolic Reset",
          badge: "🥇 1st Choice • Essential Transformation",
          badgeColor: "from-[#DDA922] to-[#B57C1E]",
          categoryTag: "Fitness",
          whyItFits: `At a BMI of ${bmi}, high-intensity functional fitness is your most effective calorie burner. Our coach-supervised bodyweight circuits and cardiovascular conditioning elevate your basal metabolic rate (BMR) without damaging your joints.`,
          points: [
            "Cardio & Functional HIIT intervals for maximum fat oxidation",
            "Core stability drills to support posture and alleviate lower-back stress",
            "Progressive metabolic conditioning customized to your stamina"
          ],
          schedule: "Morning: 4:30 AM, 5:30 AM, 8:30 AM | Evening: 3:45 PM, 5:00 PM, 6:00 PM",
          courseParam: "Fitness"
        },
        secondChoice: {
          title: "Therapeutic Asana Yoga & Joint Mobility",
          subtitle: "Low-Impact Toning & Stress-Hormone Reset",
          badge: "🥈 2nd Choice • Recommended Synergy",
          badgeColor: "from-[#C8955F] to-[#9E6530]",
          categoryTag: "Yoga",
          whyItFits: `Pairing intense fitness with Yoga accelerates recovery, reduces cortisol (the primary fat-storing stress hormone), releases hip and lumbar tension, and drastically prevents post-workout fatigue.`,
          points: [
            "Low-impact flexibility postures to decompress joints and ligaments",
            "Pranayama breath control to regulate metabolism and digestion",
            "Gentle isometric holds to tone inner stabilizing muscles"
          ],
          schedule: "Morning: 4:30 AM, 5:30 AM, 8:30 AM | Evening: 3:45 PM, 5:00 PM, 6:00 PM",
          courseParam: "Yoga"
        }
      };
    } else if (bmi < 18.5) {
      // Underweight
      return {
        firstChoice: {
          title: "Vajra Hypertrophy & Calisthenics Strength Fitness",
          subtitle: "Lean Muscular Density & Structural Power",
          badge: "🥇 1st Choice • Essential Foundation",
          badgeColor: "from-[#DDA922] to-[#B57C1E]",
          categoryTag: "Fitness",
          whyItFits: `With a BMI of ${bmi}, your body requires progressive bodyweight resistance and calisthenics to build lean skeletal muscle, reinforce bone density, and enhance functional strength without excessive catabolic cardio.`,
          points: [
            "Progressive calisthenics (Push-ups, pull-ups, squats, dips) for solid mass",
            "Full-body strength loading to stimulate muscular hypertrophy",
            "Personal guidance on optimal training frequency and recovery"
          ],
          schedule: "Daily Morning & Evening Specialized Batches",
          courseParam: "Fitness"
        },
        secondChoice: {
          title: "Pranic Strength Yoga & Vitality Flow",
          subtitle: "Metabolic Fire (Agni) & Neuromuscular Focus",
          badge: "🥈 2nd Choice • Recommended Synergy",
          badgeColor: "from-[#C8955F] to-[#9E6530]",
          categoryTag: "Yoga",
          whyItFits: `Yoga stimulates your endocrine and digestive systems, ensuring your body efficiently absorbs nutrients and builds lasting endurance, core elasticity, and mental calm.`,
          points: [
            "Standing balance asanas to activate deep neuromuscular pathways",
            "Diaphragmatic breathwork to enhance circulation and vital energy",
            "Mindful relaxation techniques to optimize tissue repair"
          ],
          schedule: "Morning & Evening Dedicated Batches",
          courseParam: "Yoga"
        }
      };
    } else {
      // Normal / Healthy Athletic
      return {
        firstChoice: {
          title: "Vajra Elite Functional Fitness & Calisthenics",
          subtitle: "Prime Athletic Conditioning & Explosive Power",
          badge: "🥇 1st Choice • Prime Athletic Path",
          badgeColor: "from-[#DDA922] to-[#B57C1E]",
          categoryTag: "Fitness",
          whyItFits: `Your BMI of ${bmi} is in the ideal athletic zone! Functional Fitness will take your conditioning to championship levels—sharpening speed, explosive muscular endurance, and lean athletic definition.`,
          points: [
            "Advanced bodyweight calisthenics, core sculpting, and plyometrics",
            "High-tempo circuit conditioning for supreme stamina and agility",
            "Functional movement patterns for everyday power and injury resilience"
          ],
          schedule: "Morning: 4:30 AM, 5:30 AM, 8:30 AM | Evening: 3:45 PM, 5:00 PM, 6:00 PM",
          courseParam: "Fitness"
        },
        secondChoice: {
          title: "Dynamic Ashtanga Yoga & Core Elasticity",
          subtitle: "Spinal Flexibility & Mind-Body Mastery",
          badge: "🥈 2nd Choice • Recommended Synergy",
          badgeColor: "from-[#C8955F] to-[#9E6530]",
          categoryTag: "Yoga",
          whyItFits: `Even at an optimal weight, true physical mastery requires total flexibility and balance. Combining Fitness with Yoga prevents muscle stiffness, expands your range of motion, and sharpens mental focus.`,
          points: [
            "Dynamic Sun Salutations and warrior flows for spinal mobility",
            "Deep tendon and hamstring flexibility to unlock effortless agility",
            "Meditation and breath synchronization for laser-sharp focus"
          ],
          schedule: "Morning: 4:30 AM, 5:30 AM, 8:30 AM | Evening: 3:45 PM, 5:00 PM, 6:00 PM",
          courseParam: "Yoga"
        }
      };
    }
  }, [bmi]);

  // WhatsApp link generator with pre-filled assessment
  const whatsAppUrl = useMemo(() => {
    const text = `Hello Master Murali, I used the BMI & Course Recommender on vajrafitnessarts.com:
• Height: ${height} cm (${feetInches})
• Weight: ${weight} kg (${weightInLbs} lbs)
• Calculated BMI: ${bmi} (${category})
• Recommended Path:
  1st Choice: ${recommendations.firstChoice.title}
  2nd Choice: ${recommendations.secondChoice.title}

I would like to inquire about enrolling for these batches. Please guide me!`;
    return `https://wa.me/919047743533?text=${encodeURIComponent(text)}`;
  }, [height, weight, feetInches, weightInLbs, bmi, category, recommendations]);

  return (
    <section className="py-14 sm:py-20 md:py-28 px-4 sm:px-6 md:px-12 bg-gradient-to-b from-[#160E0E] via-[#1F1414] to-[#160E0E] relative z-10 overflow-hidden text-white border-y border-cappuccino/20">
      {/* Decorative Aura Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cappuccino/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#DDA922]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        {/* Section Heading */}
        <SectionHeading
          subtitle="Smart Body Intelligence & Course Matcher"
          title="Calculate Your BMI & Discover Your Ideal Training Path"
          inverted={true}
        />
        <p className="text-center text-white/70 max-w-2xl mx-auto -mt-6 mb-12 text-sm sm:text-base">
          Enter your height and weight below. Our intelligent assessment analyzes your physical baseline and recommends the scientifically optimal program combination crafted by Master Coach Murali.
        </p>

        {/* Main Grid: Calculator on Left, Recommendations on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* LEFT: Interactive BMI Calculator Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 bg-gradient-to-br from-[#261A1A] to-[#1B1111] p-6 sm:p-8 rounded-3xl border border-cappuccino/30 shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative overflow-hidden"
          >
            {/* Header Badge */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cappuccino/20 border border-cappuccino/40 flex items-center justify-center text-cappuccino">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">Physical Assessment</h3>
                  <p className="text-[11px] text-white/60">Live Reactive Calculation</p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-cappuccino/20 text-cappuccino border border-cappuccino/30">
                Instant Match
              </span>
            </div>

            {/* Height Slider & Input */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-white/80 flex items-center gap-1.5">
                  Height
                  <span className="text-[11px] text-cappuccino font-normal">({feetInches})</span>
                </label>
                <div className="flex items-center gap-1 bg-black/40 px-3 py-1 rounded-xl border border-white/10">
                  <input
                    type="number"
                    min={110}
                    max={230}
                    value={height}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (!isNaN(val)) setHeight(Math.min(Math.max(val, 100), 240));
                    }}
                    className="w-12 bg-transparent text-right font-bold text-sm text-white focus:outline-none"
                  />
                  <span className="text-xs text-white/50">cm</span>
                </div>
              </div>
              <input
                type="range"
                min={110}
                max={220}
                step={1}
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#DDA922]"
              />
              <div className="flex justify-between text-[10px] text-white/40 mt-1">
                <span>110 cm (3&apos;7&quot;)</span>
                <span>170 cm</span>
                <span>220 cm (7&apos;2&quot;)</span>
              </div>
            </div>

            {/* Weight Slider & Input */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-white/80 flex items-center gap-1.5">
                  Weight
                  <span className="text-[11px] text-cappuccino font-normal">({weightInLbs} lbs)</span>
                </label>
                <div className="flex items-center gap-1 bg-black/40 px-3 py-1 rounded-xl border border-white/10">
                  <input
                    type="number"
                    min={30}
                    max={180}
                    value={weight}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (!isNaN(val)) setWeight(Math.min(Math.max(val, 30), 200));
                    }}
                    className="w-12 bg-transparent text-right font-bold text-sm text-white focus:outline-none"
                  />
                  <span className="text-xs text-white/50">kg</span>
                </div>
              </div>
              <input
                type="range"
                min={35}
                max={160}
                step={1}
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#DDA922]"
              />
              <div className="flex justify-between text-[10px] text-white/40 mt-1">
                <span>35 kg</span>
                <span>75 kg</span>
                <span>160 kg</span>
              </div>
            </div>

            {/* Primary Fitness Goal Selector */}
            <div className="mb-6">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/80 block mb-2">
                Your Primary Focus
              </label>
              <div className="grid grid-cols-2 gap-2">
                {goalOptions.map((goal) => (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => setSelectedGoal(goal.id)}
                    className={cn(
                      "flex items-center gap-2 p-2.5 rounded-xl text-left text-xs transition-all border",
                      selectedGoal === goal.id
                        ? "bg-cappuccino/20 border-cappuccino text-white font-medium shadow-[0_0_15px_rgba(200,149,95,0.2)]"
                        : "bg-black/25 border-white/10 text-white/70 hover:bg-white/5"
                    )}
                  >
                    <span>{goal.icon}</span>
                    <span className="truncate">{goal.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live BMI Output Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-white/70 uppercase tracking-wider">Calculated BMI</span>
                <span 
                  className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider transition-colors duration-300"
                  style={{ backgroundColor: `${color}20`, color: color, border: `1px solid ${color}40` }}
                >
                  {category}
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-4xl sm:text-5xl font-serif font-bold text-white tracking-tight">
                  {bmi}
                </span>
                <span className="text-xs text-white/50">kg/m²</span>
              </div>

              {/* Color-Coded BMI Scale Meter */}
              <div className="relative pt-2 pb-1">
                <div className="h-3 w-full rounded-full bg-gradient-to-r from-[#38BDF8] via-[#34D399] via-50% via-[#FBBF24] to-[#F87171] relative overflow-visible">
                  {/* Position Needle Marker */}
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-6 bg-white rounded-sm shadow-[0_0_10px_rgba(255,255,255,0.8)] border border-black/40 flex items-center justify-center"
                    animate={{ left: `${needlePosition}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <div className="w-1 h-3 bg-primary rounded-full" />
                  </motion.div>
                </div>

                {/* Scale Labels */}
                <div className="flex justify-between text-[9px] text-white/50 mt-2 font-medium">
                  <span className="text-[#38BDF8]">Under (&lt;18.5)</span>
                  <span className="text-[#34D399]">Normal (18.5-24.9)</span>
                  <span className="text-[#FBBF24]">Over (25-29.9)</span>
                  <span className="text-[#F87171]">Obese (30+)</span>
                </div>
              </div>

              {/* Ideal Target Guidance */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-white/70">
                <Info className="w-4 h-4 text-cappuccino shrink-0" />
                <span>
                  Healthy weight range for your height: <strong className="text-white font-semibold">{idealMin} kg – {idealMax} kg</strong>
                </span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Tailored Course Recommendations (1st Choice & 2nd Choice) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Header / Intro banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-cappuccino/10 border border-cappuccino/20 px-5 py-3.5 rounded-2xl">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cappuccino shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-white/90">
                  Recommended Course Synergy based on BMI <strong className="text-cappuccino">{bmi}</strong>:
                </span>
              </div>
              <span className="text-[11px] uppercase tracking-wider text-cappuccino font-bold self-start sm:self-auto bg-cappuccino/20 px-2.5 py-0.5 rounded-md">
                Coaches&apos; Verdict
              </span>
            </div>

            {/* 1st Choice: Always Fitness (Customized) */}
            <motion.div
              key={`first-${bmi >= 25 ? 'over' : bmi < 18.5 ? 'under' : 'norm'}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-[#2A1D1D] to-[#1C1212] p-6 sm:p-7 rounded-3xl border-2 border-[#DDA922]/50 shadow-[0_15px_40px_rgba(221,169,34,0.15)] relative overflow-hidden group hover:border-[#DDA922] transition-all"
            >
              {/* Top Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <span className={cn(
                  "text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white bg-gradient-to-r shadow-md",
                  recommendations.firstChoice.badgeColor
                )}>
                  {recommendations.firstChoice.badge}
                </span>
                <span className="text-xs text-white/50 flex items-center gap-1">
                  <Dumbbell className="w-3.5 h-3.5 text-cappuccino" />
                  Discipline: Fitness &amp; Functional Training
                </span>
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-1 group-hover:text-cappuccino transition-colors">
                {recommendations.firstChoice.title}
              </h3>
              <p className="text-xs text-cappuccino font-medium tracking-wide uppercase mb-3">
                {recommendations.firstChoice.subtitle}
              </p>

              {/* Personalized Rationale */}
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-4">
                {recommendations.firstChoice.whyItFits}
              </p>

              {/* Key Highlights */}
              <div className="space-y-2 mb-5">
                {recommendations.firstChoice.points.map((pt, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-white/90">
                    <CheckCircle2 className="w-4 h-4 text-[#DDA922] shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-[11px] text-white/60">
                  Batches: Morning &amp; Evening Daily
                </span>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/portal?tab=enroll&course=Fitness`}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#DDA922] to-[#B57C1E] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-[0_5px_15px_rgba(221,169,34,0.3)] transition-all"
                  >
                    <span>Enroll 1st Choice</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* 2nd Choice: Always Yoga (Customized) */}
            <motion.div
              key={`second-${bmi >= 25 ? 'over' : bmi < 18.5 ? 'under' : 'norm'}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gradient-to-br from-[#241A1A] to-[#181010] p-6 sm:p-7 rounded-3xl border border-cappuccino/35 shadow-[0_12px_35px_rgba(0,0,0,0.3)] relative overflow-hidden group hover:border-cappuccino transition-all"
            >
              {/* Top Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <span className={cn(
                  "text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white bg-gradient-to-r shadow-md",
                  recommendations.secondChoice.badgeColor
                )}>
                  {recommendations.secondChoice.badge}
                </span>
                <span className="text-xs text-white/50 flex items-center gap-1">
                  <HeartPulse className="w-3.5 h-3.5 text-cappuccino" />
                  Discipline: Mind &amp; Flexibility Yoga
                </span>
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-1 group-hover:text-cappuccino transition-colors">
                {recommendations.secondChoice.title}
              </h3>
              <p className="text-xs text-cappuccino font-medium tracking-wide uppercase mb-3">
                {recommendations.secondChoice.subtitle}
              </p>

              {/* Personalized Rationale */}
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-4">
                {recommendations.secondChoice.whyItFits}
              </p>

              {/* Key Highlights */}
              <div className="space-y-2 mb-5">
                {recommendations.secondChoice.points.map((pt, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-white/90">
                    <CheckCircle2 className="w-4 h-4 text-cappuccino shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-[11px] text-white/60">
                  Batches: Morning 4:30 AM &amp; Evening 5:00 PM
                </span>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/portal?tab=enroll&course=Yoga`}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cappuccino/20 hover:bg-cappuccino/30 text-cappuccino border border-cappuccino/40 font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    <span>Enroll 2nd Choice</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Complementary Warrior Arts Note & WhatsApp Direct Consult */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#201515] to-[#2B1B1B] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Award className="w-4 h-4 text-[#DDA922]" />
                  <h4 className="text-xs sm:text-sm font-semibold text-white">
                    Looking for Ancient Warrior Skills &amp; Self-Defense?
                  </h4>
                </div>
                <p className="text-[11px] sm:text-xs text-white/70">
                  You can also integrate <strong className="text-white">Traditional Silambam</strong> or <strong className="text-white">Martial Arts</strong> for weapon coordination and agility.
                </p>
              </div>

              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Consult Master on WhatsApp</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
