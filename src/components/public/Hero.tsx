"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, MessageCircle, ChevronDown, Award, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { Container } from "@/components/shared/Container";
import { useFitnessStore } from "@/lib/store";
import { buildGeneralWhatsAppUrl } from "@/lib/config";

export function Hero() {
  const { trainer, settings } = useFitnessStore();
  const whatsappUrl = buildGeneralWhatsAppUrl(
    `Hello Coach Faras, I am interested in FARAS METHOD Online Fitness Coaching and would like to get started.`,
    settings.whatsappNumber || "8138954423",
    trainer.name || "Faras"
  );

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const navOffset = 90;
      const pos = el.getBoundingClientRect().top + window.pageYOffset - navOffset;
      window.scrollTo({ top: pos, behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-36 pb-20 overflow-hidden bg-[#06141B]">
      {/* Background Photography with Disciplined Dark Navy / Deep Black Overlays */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={settings.heroBackgroundImage || "default-hero"}
          src={settings.heroBackgroundImage || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=2000&q=85"}
          alt="FARAS METHOD Online Fitness Coaching"
          className="w-full h-full object-cover object-center scale-105 transition-opacity duration-700"
        />
        {/* Deep Multi-layer Overlays strictly in #06141B and #11212D */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#06141B] via-[#06141B]/95 to-[#06141B]/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06141B] via-[#11212D]/40 to-[#06141B]/80" />
      </div>

      <Container className="relative z-10">
        <div className="max-w-3xl">
          {/* Brand Identification Bar */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full ios-glass-pill text-xs font-semibold uppercase tracking-widest text-[#CCD0CF] mb-6 shadow-lg shadow-black/40">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold tracking-wider text-[#CCD0CF]">{settings.brandName || "FARAS METHOD"}</span>
            <span className="text-[#4A5C6A]">•</span>
            <span className="text-[#9BA8AB] tracking-widest text-[11px]">ONLINE FITNESS COACHING</span>
          </div>

          {/* Official Tagline Heading */}
          <h1 className="heading-font text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-[#CCD0CF] leading-[0.95] mb-5 uppercase">
            {settings.heroHeadingLine1 || "TRAIN SMART."}
            <span className="block text-[#CCD0CF] mt-1">
              {settings.heroHeadingLine2 || "STAY CONSISTENT."}
            </span>
            <span className="block text-[#9BA8AB] mt-1">
              {settings.heroHeadingLine3 || "TRANSFORM YOURSELF."}
            </span>
          </h1>

          {/* Trainer Qualification & Transformation Pill */}
          <div className="inline-flex flex-wrap items-center gap-2 sm:gap-3 p-2 px-3.5 rounded-2xl ios-glass border border-[rgba(204,208,207,0.14)] mb-6 max-w-xl shadow-lg shadow-black/30">
            <span className="px-3 py-1 rounded-full bg-[#253745]/90 text-[#CCD0CF] text-xs font-semibold uppercase tracking-wider border border-[rgba(204,208,207,0.15)]">
              {trainer.experienceYears || "4+ Years"} Experience
            </span>
            <span className="text-xs text-[#CCD0CF] font-medium px-2 py-0.5">
              {trainer.startingWeight || "56 KG"} → {trainer.currentWeight || "69 KG"}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/70 text-emerald-300 text-[11px] font-bold uppercase tracking-wider border border-emerald-500/30">
              +{trainer.weightGained || "13 KG"} Gained*
            </span>
          </div>

          {/* Supporting Protocol Description */}
          <p className="text-base sm:text-lg text-[#9BA8AB] leading-relaxed mb-8 max-w-2xl font-normal">
            {settings.heroSubtitle || "Bespoke 1-on-1 online fitness coaching protocols designed for natural muscle building, body recomposition, and sustainable strength. Structured progressive overload, precise nutrition targets, and disciplined weekly accountability."}
          </p>

          {/* Key Trust Signals in iOS Glass Bar */}
          <div className="p-3.5 rounded-2xl ios-glass border border-[rgba(204,208,207,0.12)] grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-10 text-xs sm:text-sm text-[#CCD0CF] shadow-lg shadow-black/20">
            <div className="flex items-center gap-2 px-2 py-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Personalized Workout Splits</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1 sm:border-x sm:border-[rgba(204,208,207,0.1)]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Direct WhatsApp Guidance</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1">
              <Award className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Progressive Overload Protocols</span>
            </div>
          </div>

          {/* 3 Brand CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => handleScrollTo("contact")}
              className="gap-2.5 group font-bold tracking-wider uppercase text-xs sm:text-sm"
            >
              <span>{settings.heroButtonPrimary || "Start Your Transformation"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={() => handleScrollTo("packages")}
              className="font-semibold tracking-wider uppercase text-xs sm:text-sm"
            >
              Explore Packages
            </Button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto gap-2 border-[#4A5C6A] bg-[#11212D] text-[#CCD0CF] hover:bg-[#253745] font-semibold tracking-wider uppercase text-xs sm:text-sm"
              >
                <MessageCircle className="w-4 h-4 text-[#CCD0CF]" />
                <span>{settings.heroButtonSecondary || "Chat on WhatsApp"}</span>
              </Button>
            </a>
          </div>

          <p className="text-[11px] text-[#9BA8AB]/70 mt-5">
            *13 KG reflects Faras&apos;s personal natural transformation over 4+ years of training. Individual client progress depends on adherence and individual effort.
          </p>
        </div>
      </Container>

      {/* Subtle Scroll Down Indicator */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
        onClick={() => handleScrollTo("stats")}
      >
        <span className="text-[10px] tracking-widest uppercase text-[#9BA8AB]">Scroll to Explore</span>
        <ChevronDown className="w-4 h-4 text-[#CCD0CF] animate-bounce" />
      </div>
    </section>
  );
}
