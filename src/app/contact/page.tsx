"use client";

import React, { useState } from "react";
import { MapPin, Phone, Building2, Clock, MessageCircle } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    course: "Fitness",
    batch: "4:30 AM - 5:15 AM (Morning)",
    message: ""
  });
  const [phoneError, setPhoneError] = useState("");
  const [nameError, setNameError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedName = formData.name.trim();
    const trimmedPhone = formData.phone.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName) {
      setNameError("Please enter your name.");
      return;
    }
    setNameError("");

    const digitsOnly = trimmedPhone.replace(/\D/g, "");
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      setPhoneError("Please enter a valid phone number (7 to 15 digits).");
      return;
    }
    setPhoneError("");

    const text = `Hello Vajra Fitness Arts,

I would like to inquire about admissions:
• Name: ${trimmedName}
• Phone: ${trimmedPhone}
• Course: ${formData.course}
• Preferred Batch: ${formData.batch}${trimmedMessage ? `\n• Notes/Goals: ${trimmedMessage}` : ""}`;

    const waUrl = `https://wa.me/919047743533?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  const contactItems = [
    {
      icon: MapPin,
      title: "Training Center",
      detail: "8/73B B, Periyar Nagar 1st Cross, Ariyalur - 621704, Tamil Nadu, India",
      sub: "Main Training Facility • Tap for Directions",
      href: "https://maps.google.com/?q=8/73B+B,+Periyar+Nagar+1st+Cross,+Ariyalur,+Tamil+Nadu+621704,+India",
      external: true
    },
    {
      icon: Phone,
      title: "Admissions Line",
      detail: "+91 90477 43533",
      sub: "Available 6:00 AM - 9:00 PM • Tap to Call Directly",
      href: "tel:+919047743533",
      external: false
    },
    {
      icon: Clock,
      title: "Daily Training Hours",
      detail: "Morning: 4:30 AM - 9:15 AM | Evening: 3:45 PM - 6:45 PM",
      sub: "6 Daily Batches: 4:30 AM, 5:30 AM, 8:30 AM & 3:45 PM, 5:00 PM, 6:00 PM",
      href: undefined,
      external: false
    }
  ];

  return (
    <main className="min-h-screen flex flex-col pt-0 bg-background relative overflow-hidden">
      {/* Immersive Warm Graded Contact Hero */}
      <section className="relative h-[42vh] sm:h-[48vh] md:h-[52vh] min-h-[320px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/vajra_hero.jpg"
            alt="Vajra Fitness Arts Admissions"
            fill
            priority
            className="object-cover brightness-[0.38] scale-105"
          />
          {/* Warm cinematic tone hero overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-coffee-dark/50 to-coffee-dark/80" />
          <div className="absolute inset-0 bg-gradient-to-b from-coffee-dark/60 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[#2A1D1D]/20 mix-blend-multiply pointer-events-none" />
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 pt-10 sm:pt-14 max-w-4xl mx-auto">
          <span className="inline-block px-4 sm:px-6 py-1.5 sm:py-2 mb-3 sm:mb-4 border border-cappuccino/40 rounded-full text-cappuccino text-[9px] sm:text-[10px] font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase backdrop-blur-md bg-white/5 shadow-lg">
            Direct Admissions &amp; WhatsApp
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif text-white mb-2.5 sm:mb-3 italic tracking-tight">
            Connect With Us
          </h1>
          <p className="text-white/70 max-w-xl mx-auto text-xs sm:text-sm md:text-base font-light px-2">
            Ask about batch timings, fees, or enroll directly via WhatsApp.
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 md:px-12 py-12 sm:py-20 md:py-28 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-20 items-stretch">
            {/* Primary Contact Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6 sm:space-y-8"
            >
              <div className="space-y-2.5 sm:space-y-3">
                <h3 className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.4em] text-cappuccino font-bold">
                  Direct Inquiries
                </h3>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif text-coffee-dark italic leading-tight">
                  Step onto the mat. <br className="hidden sm:inline" /> Awaken your strength.
                </h2>
                <p className="text-coffee-dark/70 text-xs sm:text-sm font-light leading-relaxed pt-1 sm:pt-2">
                  Have questions regarding batch timings, course curriculum, or beginner classes? Reach out directly via WhatsApp or call us.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3.5 sm:gap-4">
                {contactItems.map((item, i) => {
                  const content = (
                    <>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-background rounded-full flex items-center justify-center shrink-0 group-hover:bg-coffee-dark group-hover:text-white transition-all duration-500 text-cappuccino mt-0.5 sm:mt-0">
                        <item.icon className="w-5 h-5 sm:w-5 sm:h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-coffee-dark/60 mb-0.5 sm:mb-1 uppercase tracking-[0.2em] text-[8px] sm:text-[9px]">
                          {item.title}
                        </h4>
                        <p className="text-coffee-dark text-sm sm:text-base font-bold leading-snug break-words group-hover:text-cappuccino transition-colors">
                          {item.detail}
                        </p>
                        <p className="text-cappuccino text-[9px] sm:text-[10px] font-semibold mt-0.5 break-words">
                          {item.sub}
                        </p>
                      </div>
                    </>
                  );

                  return item.href ? (
                    <motion.a
                      key={i}
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="group flex items-start sm:items-center gap-3.5 sm:gap-4 p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-[1.5rem] bg-white border border-cream hover:border-cappuccino/40 transition-all duration-500 shadow-premium hover:shadow-premium-hover cursor-pointer"
                    >
                      {content}
                    </motion.a>
                  ) : (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="group flex items-start sm:items-center gap-3.5 sm:gap-4 p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-[1.5rem] bg-white border border-cream hover:border-cappuccino/40 transition-all duration-500 shadow-premium hover:shadow-premium-hover"
                    >
                      {content}
                    </motion.div>
                  );
                })}
              </div>

              {/* Quick WhatsApp Action */}
              <a
                href="https://wa.me/919047743533?text=Hello%20Vajra%20Fitness%20Arts,%20I%20would%20like%20to%20know%20more%20about%20admissions%20and%20batch%20timings."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 sm:gap-3 p-4 sm:p-5 rounded-2xl sm:rounded-[1.5rem] bg-[#1d3527] text-[#4ede80] hover:bg-[#15271d] border border-[#275338] transition-all duration-300 font-bold text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] shadow-lg text-center"
              >
                <MessageCircle className="w-5 h-5 shrink-0" />
                <span>Chat on WhatsApp Directly</span>
              </a>
            </motion.div>

            {/* Interactive Warm Harmonized WhatsApp Enquiry Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col justify-center"
            >
              <div className="w-full max-w-lg mx-auto bg-[#241A1A]/95 backdrop-blur-xl p-5 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_50px_rgba(200,149,95,0.2)] transition-all duration-500 relative overflow-hidden border border-cappuccino/30 group/form">
                {/* Warm Cappuccino Ambient Blur Circles */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-cappuccino/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-cappuccino/15 rounded-full translate-y-1/2 -translate-x-1/2 blur-[70px] pointer-events-none" />

                <div className="space-y-1.5 mb-5 sm:mb-6 relative z-10">
                  <div className="flex items-center gap-2">
                    <MessageCircle size={16} className="text-[#4ede80] shrink-0" />
                    <h3 className="text-[#4ede80] text-[9px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.4em] font-bold">
                      WhatsApp Quick Inquiry
                    </h3>
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-serif italic text-white">
                    Send Direct Message
                  </h2>
                  <p className="text-white/70 text-xs font-light">
                    Fill the form below to message us directly on WhatsApp for an immediate response.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4 relative z-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="user_name"
                        className="text-white/70 text-[10px] uppercase tracking-[0.2em] font-bold block"
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="user_name"
                        name="user_name"
                        required
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (nameError) setNameError("");
                        }}
                        className="w-full bg-[#191111] border border-white/20 focus:border-cappuccino text-white rounded-xl px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm min-h-[40px] focus:outline-none transition-colors placeholder:text-white/30"
                        placeholder="Your full name"
                      />
                      {nameError && (
                        <p className="text-red-400 text-[10px] pl-1">{nameError}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="user_phone"
                        className="text-white/70 text-[10px] uppercase tracking-[0.2em] font-bold block"
                      >
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        id="user_phone"
                        name="user_phone"
                        required
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          if (phoneError) setPhoneError("");
                        }}
                        className="w-full bg-[#191111] border border-white/20 focus:border-cappuccino text-white rounded-xl px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm min-h-[40px] focus:outline-none transition-colors placeholder:text-white/30"
                        placeholder="e.g. +91 98765 43210"
                      />
                      {phoneError && (
                        <p className="text-red-400 text-[10px] font-medium mt-1">{phoneError}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    {/* Course Selection */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="course_interest"
                        className="text-white/70 text-[10px] uppercase tracking-[0.2em] font-bold block"
                      >
                        Course Interest
                      </label>
                      <select
                        id="course_interest"
                        name="course_interest"
                        value={formData.course}
                        onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                        className="w-full bg-[#191111] border border-white/20 focus:border-cappuccino text-white rounded-xl px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm min-h-[40px] focus:outline-none transition-colors cursor-pointer"
                      >
                        <option value="Fitness" className="bg-[#191111] text-white">Fitness</option>
                        <option value="Yoga" className="bg-[#191111] text-white">Yoga</option>
                        <option value="Martial Arts" className="bg-[#191111] text-white">Martial Arts</option>
                        <option value="Silambam" className="bg-[#191111] text-white">Silambam</option>
                      </select>
                    </div>

                    {/* Preferred Batch */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="batch_preference"
                        className="text-white/70 text-[10px] uppercase tracking-[0.2em] font-bold block"
                      >
                        Preferred Batch
                      </label>
                      <select
                        id="batch_preference"
                        name="batch_preference"
                        value={formData.batch}
                        onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                        className="w-full bg-[#191111] border border-white/20 focus:border-cappuccino text-white rounded-xl px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm min-h-[40px] focus:outline-none transition-colors cursor-pointer"
                      >
                        <option value="4:30 AM - 5:15 AM (Morning)" className="bg-[#191111] text-white">4:30 AM - 5:15 AM (Morning)</option>
                        <option value="5:30 AM - 6:00 AM (Morning)" className="bg-[#191111] text-white">5:30 AM - 6:00 AM (Morning)</option>
                        <option value="8:30 AM - 9:15 AM (Morning)" className="bg-[#191111] text-white">8:30 AM - 9:15 AM (Morning)</option>
                        <option value="3:45 PM - 4:30 PM (Evening)" className="bg-[#191111] text-white">3:45 PM - 4:30 PM (Evening)</option>
                        <option value="5:00 PM - 5:45 PM (Evening)" className="bg-[#191111] text-white">5:00 PM - 5:45 PM (Evening)</option>
                        <option value="6:00 PM - 6:45 PM (Evening)" className="bg-[#191111] text-white">6:00 PM - 6:45 PM (Evening)</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="message"
                      className="text-white/70 text-[10px] uppercase tracking-[0.2em] font-bold block"
                    >
                      Prior Experience / Fitness Goals (Optional)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={2}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full min-h-[60px] bg-[#191111] border border-white/20 focus:border-cappuccino text-white rounded-xl px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm focus:outline-none transition-colors resize-none placeholder:text-white/30"
                      placeholder="Mention any goals, questions, or previous experience..."
                    />
                  </div>

                  <div className="pt-2 sm:pt-3">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-7 py-3 min-h-[44px] bg-[#25D366] text-black font-bold text-xs uppercase tracking-[0.2em] rounded-full hover:bg-[#20bd5a] transition-all shadow-[0_0_25px_rgba(37,211,102,0.4)] flex items-center justify-center gap-2.5 group/btn active:scale-95 cursor-pointer"
                    >
                      <MessageCircle size={17} className="shrink-0" />
                      <span>Send on WhatsApp</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>

          {/* Location Map Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="group mt-12 sm:mt-16 md:mt-20 flex flex-col sm:flex-row gap-6 sm:gap-8 items-center bg-white rounded-2xl sm:rounded-[2.5rem] md:rounded-[3rem] p-6 sm:p-8 md:p-10 lg:p-14 border border-cream hover:border-cappuccino/40 shadow-premium transition-all duration-500"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-background group-hover:bg-cappuccino rounded-full flex items-center justify-center shrink-0 border border-cappuccino/30 text-cappuccino group-hover:text-white transition-all duration-500">
              <Building2 className="w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9" />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-cappuccino text-[9px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.4em] font-bold mb-1.5 sm:mb-2">
                Visiting Our Center
              </h3>
              <h4 className="text-xl sm:text-2xl md:text-3xl font-serif text-coffee-dark italic mb-2">
                Vajra Fitness Arts Center
              </h4>
              <p className="text-coffee-dark/65 leading-relaxed font-light text-xs sm:text-sm max-w-2xl">
                Located conveniently at 8/73B B, Periyar Nagar 1st Cross in Ariyalur, our facility features dedicated practice spaces for Silambam, Yoga, Martial Arts, and Fitness.
              </p>
            </div>

            <div className="w-full sm:w-auto shrink-0 flex items-center justify-center">
              <a
                href="https://maps.google.com/?q=8/73B+B,+Periyar+Nagar+1st+Cross,+Ariyalur,+Tamil+Nadu+621704,+India"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto justify-center px-6 sm:px-8 py-3.5 sm:py-4 min-h-[44px] bg-coffee-dark text-white rounded-full font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-cappuccino transition-all flex items-center gap-2 text-center shadow-md hover:shadow-lg"
              >
                <MapPin size={16} className="shrink-0" /> <span>Open in Google Maps</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
