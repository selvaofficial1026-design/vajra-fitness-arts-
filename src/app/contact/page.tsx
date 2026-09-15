"use client";

import React from "react";
import { MapPin, Phone, Building2, Clock, MessageCircle, ArrowRight, ShieldCheck, UserCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ContactPage() {
  const contactCards = [
    {
      icon: Phone,
      title: "Admissions Hotline",
      detail: "+91 90477 43533",
      sub: "Available 6:00 AM – 9:00 PM • Tap to Call Directly",
      actionText: "Call Admissions",
      href: "tel:+919047743533",
      external: false,
      badge: "Fastest Response"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Chat",
      detail: "Master Coach Murali",
      sub: "Direct chat for course fees, syllabus, and batch availability",
      actionText: "Chat on WhatsApp",
      href: "https://wa.me/919047743533?text=Hello%20Master%20Murali,%20I%20would%20like%20to%20inquire%20about%20admissions%20and%20batches%20at%20Vajra%20Fitness%20Arts.",
      external: true,
      badge: "WhatsApp Direct",
      isHighlight: true
    },
    {
      icon: Clock,
      title: "Daily Training Hours",
      detail: "Morning: 4:30 AM – 9:15 AM",
      sub: "Evening: 3:45 PM – 6:45 PM • 6 Batches Daily",
      actionText: "View Course Schedule",
      href: "/course",
      external: false,
      badge: "All Batches Active"
    },
    {
      icon: UserCheck,
      title: "Online Admissions Portal",
      detail: "Student Registration",
      sub: "Submit your student admission form or track your application",
      actionText: "Open Student Portal",
      href: "/portal?tab=enroll",
      external: false,
      badge: "Instant Registration"
    }
  ];

  return (
    <main className="min-h-screen flex flex-col pt-0 bg-background relative overflow-hidden">
      {/* Immersive Warm Graded Contact Hero */}
      <section className="relative h-[40vh] sm:h-[46vh] min-h-[300px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/vajra_hero.jpg"
            alt="Vajra Fitness Arts Admissions"
            fill
            priority
            className="object-cover brightness-[0.35] scale-105"
          />
          {/* Warm cinematic tone hero overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-coffee-dark/50 to-coffee-dark/80" />
          <div className="absolute inset-0 bg-gradient-to-b from-coffee-dark/60 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[#2A1D1D]/20 mix-blend-multiply pointer-events-none" />
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 pt-10 sm:pt-14 max-w-4xl mx-auto">
          <span className="inline-block px-4 sm:px-6 py-1.5 sm:py-2 mb-3 sm:mb-4 border border-cappuccino/40 rounded-full text-cappuccino text-[9px] sm:text-[10px] font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase backdrop-blur-md bg-white/5 shadow-lg">
            Direct Admissions &amp; Inquiries
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif text-white mb-2.5 sm:mb-3 italic tracking-tight font-bold">
            Connect With Us
          </h1>
          <p className="text-white/80 max-w-xl mx-auto text-xs sm:text-sm md:text-base font-light px-2">
            Reach out directly for batch timings, admission fees, or studio visits.
          </p>
        </div>
      </section>

      {/* Main Contact Grid (No Form) */}
      <section className="px-4 sm:px-6 md:px-12 py-12 sm:py-16 md:py-20 relative z-10">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <span className="text-[10px] uppercase tracking-[0.3em] text-cappuccino font-extrabold block mb-2">
              Fast &amp; Direct Communication
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif text-coffee-dark italic leading-tight font-bold">
              Speak Directly with Our Founder &amp; Coach
            </h2>
            <p className="text-coffee-dark/70 text-xs sm:text-sm font-light leading-relaxed mt-2">
              We provide direct personal coaching for every student. Choose the easiest way to connect with us below.
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {contactCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`p-6 sm:p-7 rounded-2xl sm:rounded-3xl border transition-all flex flex-col justify-between shadow-premium ${
                  card.isHighlight
                    ? "bg-gradient-to-br from-[#1C2C20] to-[#152018] text-white border-[#2E5E3A] hover:border-[#4EDE80]"
                    : "bg-white text-coffee-dark border-cream hover:border-cappuccino/50"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                      card.isHighlight
                        ? "bg-[#275338]/50 text-[#4ede80] border-[#36754E]"
                        : "bg-cappuccino/15 text-cappuccino border-cappuccino/30"
                    }`}>
                      <card.icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full border ${
                      card.isHighlight
                        ? "bg-[#25D366]/20 text-[#4ede80] border-[#25D366]/40"
                        : "bg-cream/60 text-coffee-dark/70 border-cream"
                    }`}>
                      {card.badge}
                    </span>
                  </div>

                  <h3 className={`text-lg sm:text-xl font-serif font-bold mb-1 ${
                    card.isHighlight ? "text-white" : "text-coffee-dark"
                  }`}>
                    {card.title}
                  </h3>
                  <p className={`text-sm sm:text-base font-bold mb-1.5 ${
                    card.isHighlight ? "text-[#4ede80]" : "text-cappuccino"
                  }`}>
                    {card.detail}
                  </p>
                  <p className={`text-xs leading-relaxed mb-6 font-light ${
                    card.isHighlight ? "text-white/70" : "text-coffee-dark/65"
                  }`}>
                    {card.sub}
                  </p>
                </div>

                <div>
                  {card.external ? (
                    <a
                      href={card.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full py-3 px-5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all inline-flex items-center justify-center gap-2 shadow-sm ${
                        card.isHighlight
                          ? "bg-[#25D366] hover:bg-[#20bd5a] text-black hover:shadow-[0_0_20px_rgba(37,211,102,0.4)]"
                          : "bg-coffee-dark hover:bg-cappuccino text-white hover:text-coffee-dark"
                      }`}
                    >
                      <span>{card.actionText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  ) : (
                    <Link
                      href={card.href}
                      className="w-full py-3 px-5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all inline-flex items-center justify-center gap-2 bg-coffee-dark hover:bg-cappuccino text-white hover:text-coffee-dark shadow-sm"
                    >
                      <span>{card.actionText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Location Center Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-6 sm:gap-8 items-center bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-cream shadow-premium"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-cappuccino/15 rounded-2xl flex items-center justify-center shrink-0 border border-cappuccino/30 text-cappuccino">
              <Building2 className="w-7 h-7" />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <span className="text-cappuccino text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-bold block mb-1">
                Studio Location
              </span>
              <h3 className="text-xl sm:text-2xl font-serif text-coffee-dark italic font-bold mb-1.5">
                Vajra Fitness Arts Academy
              </h3>
              <p className="text-coffee-dark/75 leading-relaxed font-light text-xs sm:text-sm max-w-2xl">
                8/73B B, Periyar Nagar 1st Cross, Ariyalur – 621704, Tamil Nadu, India.
              </p>
              <p className="text-coffee-dark/60 text-[11px] mt-1">
                Equipped training facility for Traditional Silambam, Yoga, Martial Arts, and Functional Fitness.
              </p>
            </div>

            <div className="w-full sm:w-auto shrink-0 flex items-center justify-center">
              <a
                href="https://maps.google.com/?q=8/73B+B,+Periyar+Nagar+1st+Cross,+Ariyalur,+Tamil+Nadu+621704,+India"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 bg-coffee-dark text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-cappuccino hover:text-coffee-dark transition-all inline-flex items-center justify-center gap-2 shadow-sm"
              >
                <MapPin size={16} className="shrink-0" />
                <span>Open in Google Maps</span>
              </a>
            </div>
          </motion.div>

        </div>
      </section>
    </main>
  );
}
