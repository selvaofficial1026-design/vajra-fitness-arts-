"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import SectionHeading from "@/components/SectionHeading";
import { Shield, Lock, Eye, Database } from "lucide-react";

export default function PrivacyPage() {
  const lastUpdated = "July 21, 2026";

  const policies = [
    {
      icon: Eye,
      title: "Information We Collect",
      content: "When you interact with Vajra Fitness Arts, we may collect personal information such as your name, phone number, and training interests. This occurs when you reach out via WhatsApp, phone, or our contact channels."
    },
    {
      icon: Database,
      title: "How We Use Your Data",
      content: "We utilize your information strictly for training inquiries: to respond to your questions, provide batch schedules, send session confirmations, and continuously improve our website and student experience."
    },
    {
      icon: Lock,
      title: "Data Protection & Security",
      content: "As a studio handling highly confidential intellectual property, we implement enterprise-grade security protocols. Your personal information is encrypted and stored in secure networks, accessible only by a limited number of authorized personnel who are required to keep the information confidential."
    },
    {
      icon: Shield,
      title: "Third-Party Disclosure",
      content: "We do not sell, trade, or otherwise transfer your Personally Identifiable Information to outside parties. This does not include trusted third parties who assist us in operating our website or conducting our business, so long as those parties agree to keep this information confidential."
    }
  ];

  return (
    <main className="min-h-screen flex flex-col pt-24 sm:pt-28 md:pt-32 bg-background relative overflow-hidden">
      
      {/* Background Decor - Warm Cappuccino Aura */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cappuccino/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-cappuccino/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />
      
      <section className="px-4 sm:px-6 md:px-12 py-12 sm:py-20 max-w-5xl mx-auto relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 sm:mb-16 md:mb-20"
        >
          <SectionHeading subtitle="Legal" title="Privacy Policy" className="mb-4 sm:mb-6" />
          <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.3em] font-bold text-coffee-dark/40 mt-4 sm:mt-6">
            Last Updated: {lastUpdated}
          </p>
        </motion.div>

        <div className="space-y-10 sm:space-y-12">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose prose-stone max-w-none text-coffee-dark/70 font-light text-sm sm:text-base md:text-lg leading-relaxed text-center max-w-3xl mx-auto mb-10 sm:mb-16"
          >
            <p>
              At Vajra Fitness Arts, we are committed to providing top-quality martial arts and fitness training while maintaining complete trust and transparency. This privacy policy outlines our commitment to protecting your personal information.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 md:gap-8">
            {policies.map((policy, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className={cn(
                  "group bg-white p-6 sm:p-8 md:p-10 rounded-2xl md:rounded-[2rem] border border-cream hover:border-cappuccino/40 focus-visible:border-cappuccino/60 shadow-premium hover:shadow-[0_20px_50px_rgba(200,149,95,0.15)] active:shadow-[0_20px_50px_rgba(200,149,95,0.15)] hover:-translate-y-1.5 sm:hover:-translate-y-2 active:-translate-y-1 transition-all duration-500 cursor-pointer focus:outline-none flex flex-col"
                )}
                tabIndex={0}
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl md:rounded-2xl bg-background flex items-center justify-center text-cappuccino mb-4 md:mb-6 group-hover:bg-cappuccino group-active:bg-cappuccino group-hover:text-white group-active:text-white transition-colors duration-500 shadow-sm shrink-0 border border-cappuccino/20">
                  <policy.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-serif italic text-coffee-dark mb-2 md:mb-3 leading-tight group-hover:text-cappuccino transition-colors">
                  {policy.title}
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-coffee-dark/70 font-light leading-relaxed flex-grow">
                  {policy.content}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="mt-12 sm:mt-16 md:mt-20 p-6 sm:p-10 md:p-12 bg-[#241A1A] border border-cappuccino/30 rounded-2xl sm:rounded-[2rem] text-white text-center shadow-[0_20px_50px_rgba(0,0,0,0.25)] hover:shadow-[0_20px_50px_rgba(200,149,95,0.2)] transition-all duration-500 relative overflow-hidden group"
          >
            {/* Real asset background with warm gradient */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/vajra_hero.jpg')] bg-cover bg-center opacity-15 group-hover:scale-105 transition-transform duration-1000 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#241A1A] via-[#241A1A]/90 to-transparent" />
            {/* Ambient cappuccino blur auras */}
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-cappuccino/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-cappuccino/15 rounded-full blur-2xl pointer-events-none" />
            
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-serif italic text-cappuccino mb-3 sm:mb-4">Questions About Privacy?</h2>
              <p className="text-white/80 font-light text-xs sm:text-sm md:text-base max-w-xl mx-auto mb-6 sm:mb-8">
                If you have any concerns about how your data is handled, our admissions and management team is here to help.
              </p>
              <Link 
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 sm:py-4 min-h-[44px] bg-cappuccino text-coffee-dark font-bold text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-white transition-colors shadow-[0_0_20px_rgba(200,149,95,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] text-center"
              >
                Contact Our Team
              </Link>
            </div>
          </motion.div>

        </div>
      </section>
    </main>
  );
}
