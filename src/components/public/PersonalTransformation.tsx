"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ArrowLeftRight,
  TrendingUp,
  Dumbbell,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Columns2,
  Sliders,
  Maximize2,
  X,
} from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Badge } from "@/components/shared/Badge";
import { useFitnessStore } from "@/lib/store";

export function PersonalTransformation() {
  const { trainer } = useFitnessStore();
  const [viewMode, setViewMode] = useState<"side-by-side" | "slider">("side-by-side");
  const [sliderPosition, setSliderPosition] = useState(50);
  const [selectedAfterIdx, setSelectedAfterIdx] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string } | null>(null);

  const beforeImage = trainer.transformation?.beforeImage || "/photos/faras-before.jpeg";
  const afterImages = [
    trainer.transformation?.afterImage || "/photos/faras-after-1.jpeg",
    trainer.transformation?.afterImage2 || "/photos/faras-after-2.jpeg",
    trainer.transformation?.afterImage3 || "/photos/faras-after-3.jpeg",
  ];

  const activeAfterImage = afterImages[selectedAfterIdx] || afterImages[0];

  return (
    <section id="personal-transformation" className="py-24 bg-[#06141B] relative border-t border-[#4A5C6A]/50">
      <Container>
        {/* Section Heading with requested exact title and highlights */}
        <SectionHeading
          badge="Personal Journey"
          title="MY FITNESS TRANSFORMATION"
          subtitle={`${trainer.startingWeight || "56 KG"} → ${trainer.currentWeight || "69 KG"} • ${trainer.weightGained ? `${trainer.weightGained} BODY-WEIGHT GAIN` : "13 KG BODY-WEIGHT GAIN"} • ${trainer.experienceYears ? `${trainer.experienceYears.toUpperCase()} OF TRAINING` : "4+ YEARS OF TRAINING"}`}
        />

        {/* Highlight Banner Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto mb-12">
          <div className="p-5 sm:p-6 rounded-2xl ios-glass ios-glass-interactive border border-[rgba(204,208,207,0.14)] text-center shadow-xl shadow-black/30">
            <div className="w-10 h-10 rounded-xl bg-[#253745] border border-[rgba(204,208,207,0.15)] text-[#CCD0CF] flex items-center justify-center mx-auto mb-2 shadow-md">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-[10px] uppercase font-bold text-[#9BA8AB] tracking-widest block">The Progression</span>
            <strong className="heading-font text-2xl font-black text-white">
              {trainer.startingWeight || "56 KG"} → {trainer.currentWeight || "69 KG"}
            </strong>
            <span className="text-xs text-[#CCD0CF] block mt-0.5 font-semibold">13 KG Body-Weight Gain</span>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl ios-glass ios-glass-interactive border border-[rgba(204,208,207,0.14)] text-center shadow-xl shadow-black/30">
            <div className="w-10 h-10 rounded-xl bg-[#253745] border border-[rgba(204,208,207,0.15)] text-[#CCD0CF] flex items-center justify-center mx-auto mb-2 shadow-md">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-[10px] uppercase font-bold text-[#9BA8AB] tracking-widest block">Approach</span>
            <strong className="heading-font text-2xl font-black text-white">
              100% NATURAL
            </strong>
            <span className="text-xs text-[#9BA8AB] block mt-0.5 font-normal">Muscle Building &amp; Nutrition</span>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl ios-glass ios-glass-interactive border border-[rgba(204,208,207,0.14)] text-center shadow-xl shadow-black/30">
            <div className="w-10 h-10 rounded-xl bg-[#253745] border border-[rgba(204,208,207,0.15)] text-[#CCD0CF] flex items-center justify-center mx-auto mb-2 shadow-md">
              <Calendar className="w-5 h-5 text-[#CCD0CF]" />
            </div>
            <span className="text-[10px] uppercase font-bold text-[#9BA8AB] tracking-widest block">Dedication</span>
            <strong className="heading-font text-2xl font-black text-white">
              {trainer.experienceYears || "4+ YEARS"}
            </strong>
            <span className="text-xs text-[#9BA8AB] block mt-0.5 font-semibold">Consistent Training Experience</span>
          </div>
        </div>

        {/* Main Grid: Fully Visible Photos + Story Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Photo Section (Col 7) */}
          <div className="lg:col-span-7 space-y-4">
            {/* View Mode Toggle Pill Bar */}
            <div className="flex items-center justify-between pb-1">
              <div className="inline-flex items-center p-1 rounded-xl bg-[#11212D] border border-[rgba(204,208,207,0.15)] shadow-md">
                <button
                  type="button"
                  onClick={() => setViewMode("side-by-side")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === "side-by-side"
                      ? "bg-[#253745] text-white shadow-sm border border-[rgba(204,208,207,0.2)]"
                      : "text-[#9BA8AB] hover:text-[#CCD0CF]"
                  }`}
                >
                  <Columns2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Side-by-Side (Full View)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("slider")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === "slider"
                      ? "bg-[#253745] text-white shadow-sm border border-[rgba(204,208,207,0.2)]"
                      : "text-[#9BA8AB] hover:text-[#CCD0CF]"
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5 text-[#CCD0CF]" />
                  <span>Compare Slider</span>
                </button>
              </div>

              {/* Pose Selector (Always Available) */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold text-[#9BA8AB] hidden sm:inline">Pose:</span>
                {afterImages.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedAfterIdx(idx)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedAfterIdx === idx
                        ? "bg-emerald-400 text-[#06141B] shadow-md shadow-emerald-400/20"
                        : "bg-[#11212D] text-[#9BA8AB] hover:text-[#CCD0CF] border border-[rgba(204,208,207,0.15)]"
                    }`}
                  >
                    Pose {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* MODE 1: SIDE-BY-SIDE (FULL VIEW TYPE) - Default */}
            {viewMode === "side-by-side" && (
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {/* BEFORE PHOTO (100% Full View) */}
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#CCD0CF] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#9BA8AB]" />
                      BEFORE
                    </span>
                    <span className="text-[11px] font-bold text-[#CCD0CF] bg-[#11212D] px-2.5 py-0.5 rounded-full border border-[rgba(204,208,207,0.15)]">
                      {trainer.startingWeight || "56 KG"}
                    </span>
                  </div>

                  <div
                    onClick={() => setLightboxImage({ src: beforeImage, title: `Coach ${trainer.name} - Before (56 KG)` })}
                    className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-[rgba(204,208,207,0.18)] bg-[#11212D] group shadow-xl shadow-black/60 cursor-pointer"
                    title="Click to expand"
                  >
                    <Image
                      src={beforeImage}
                      alt={`Coach ${trainer.name} Before Transformation - 56 KG`}
                      fill
                      priority
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#06141B]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
                      <span className="text-[10px] text-white/90 bg-[#06141B]/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1 shadow-lg">
                        <Maximize2 className="w-3 h-3" /> Full View
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#9BA8AB] text-center font-medium">Skinny Beginner</span>
                </div>

                {/* AFTER PHOTO (100% Full View) */}
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#CCD0CF] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      AFTER
                    </span>
                    <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      {trainer.currentWeight || "69 KG"} (+13 KG)
                    </span>
                  </div>

                  <div
                    onClick={() => setLightboxImage({ src: activeAfterImage, title: `Coach ${trainer.name} - After Pose ${selectedAfterIdx + 1} (69 KG)` })}
                    className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-[rgba(204,208,207,0.18)] bg-[#11212D] group shadow-xl shadow-black/60 cursor-pointer"
                    title="Click to expand"
                  >
                    <Image
                      src={activeAfterImage}
                      alt={`Coach ${trainer.name} After Transformation - 69 KG`}
                      fill
                      priority
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#06141B]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
                      <span className="text-[10px] text-white/90 bg-[#06141B]/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1 shadow-lg">
                        <Maximize2 className="w-3 h-3" /> Full View
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] text-emerald-400 text-center font-medium">Natural Physique (Pose {selectedAfterIdx + 1})</span>
                </div>
              </div>
            )}

            {/* MODE 2: INTERACTIVE COMPARE SLIDER */}
            {viewMode === "slider" && (
              <div className="space-y-3">
                <div className="relative w-full aspect-[3/4] max-w-lg mx-auto rounded-3xl overflow-hidden border border-[rgba(204,208,207,0.18)] shadow-2xl shadow-black/80 select-none bg-[#11212D]">
                  {/* AFTER Image (Background) */}
                  <Image
                    src={activeAfterImage}
                    alt={`Coach ${trainer.name} After Transformation - 69 KG`}
                    fill
                    priority
                    className="object-cover object-center"
                  />
                  <div className="absolute top-4 right-4 z-10 px-3.5 py-1.5 rounded-full bg-[#06141B]/80 backdrop-blur-md border border-[rgba(204,208,207,0.2)] text-xs font-black uppercase tracking-wider text-[#CCD0CF] shadow-lg">
                    AFTER • 69 KG
                  </div>

                  {/* BEFORE Image (Clipped Overlay) */}
                  <div
                    className="absolute inset-0 overflow-hidden z-10"
                    style={{ width: `${sliderPosition}%` }}
                  >
                    <div className="relative w-full h-full min-w-full">
                      <Image
                        src={beforeImage}
                        alt={`Coach ${trainer.name} Before Transformation - 56 KG`}
                        fill
                        priority
                        className="object-cover object-center"
                      />
                      <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-[#06141B]/80 backdrop-blur-md border border-[rgba(204,208,207,0.2)] text-xs font-black uppercase tracking-wider text-[#9BA8AB] shadow-lg">
                        BEFORE • 56 KG
                      </div>
                    </div>
                  </div>

                  {/* Vertical Divider Line with Grab Handle */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-[#CCD0CF] shadow-md z-20 pointer-events-none"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#CCD0CF] text-[#06141B] flex items-center justify-center shadow-2xl border-2 border-[#11212D]">
                      <ArrowLeftRight className="w-5 h-5 stroke-[2.5]" />
                    </div>
                  </div>

                  {/* Range Input Control */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPosition}
                    onChange={(e) => setSliderPosition(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                    aria-label="Drag to compare Coach Faras before and after transformation"
                  />
                </div>
                <p className="text-[11px] text-[#9BA8AB] text-center flex items-center justify-center gap-1.5">
                  <ArrowLeftRight className="w-3.5 h-3.5 text-[#CCD0CF]" />
                  Drag the slider left or right to compare
                </p>
              </div>
            )}
          </div>

          {/* Story Narrative & Natural Muscle Building Breakdown (Col 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full ios-glass-pill text-[#CCD0CF] text-xs font-bold uppercase tracking-wider">
              <Dumbbell className="w-4 h-4 text-emerald-400" />
              <span>Coach Faras&apos;s Personal Journey</span>
            </div>

            <h3 className="heading-font text-3xl sm:text-4xl font-extrabold text-[#CCD0CF] leading-tight uppercase">
              From Skinny Beginner to Certified Coach
            </h3>

            <div className="space-y-4 text-sm text-[#CCD0CF] leading-relaxed font-light">
              <p>
                I started my fitness journey weighing just <strong className="text-white font-semibold">56 KG</strong> as a skinny beginner with very little knowledge of structured resistance training or metabolic nutrition. Like most beginners, I made mistakes, struggled to see results, and had to learn the hard way through years of trial and error.
              </p>
              <p>
                Over the course of <strong className="text-white font-semibold">4+ years of dedicated natural training</strong>, I gained <strong className="text-[#CCD0CF] font-bold">13 kg of body weight</strong>, sculpted my physique to a solid <strong className="text-white font-semibold">69 KG</strong>, and built a deep practical and scientific understanding of natural muscle building.
              </p>
              <p>
                More importantly, the journey taught me patience, discipline, and the true value of consistency. Progress isn&apos;t about finding shortcuts or miracle supplements — it&apos;s about following the right approach and sticking with it day after day.
              </p>
            </div>

            {/* Key Pillars */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#11212D] border border-[#4A5C6A]">
                <CheckCircle2 className="w-4 h-4 text-[#CCD0CF] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-white block font-semibold">100% Natural Progression</strong>
                  <span className="text-[#9BA8AB]">No shortcuts, no banned substances. Built through progressive overload and caloric surplus.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#11212D] border border-[#4A5C6A]">
                <CheckCircle2 className="w-4 h-4 text-[#CCD0CF] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-white block font-semibold">Firsthand Beginner Experience</strong>
                  <span className="text-[#9BA8AB]">I understand the exact struggles, frustrations, and plateaus beginners face in the gym.</span>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-3.5 rounded-xl bg-[#06141B] border border-[#4A5C6A] text-[11px] text-[#9BA8AB] italic leading-relaxed">
              *Notice: The 13 KG gain represents Faras&apos;s verified personal reported transformation over 4+ years of natural training (56 KG to 69 KG). It is presented to illustrate personal dedication and coaching experience, not as an automated guarantee for all client outcomes.
            </div>
          </div>
        </div>
      </Container>

      {/* Lightbox Full Size Preview Modal */}
      {lightboxImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-2xl w-full max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-3 text-sm text-[#CCD0CF]">
              <span className="font-bold uppercase tracking-wider">{lightboxImage.title}</span>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="p-1.5 rounded-full bg-[#11212D] hover:bg-[#253745] text-white transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-[rgba(204,208,207,0.2)] bg-[#06141B] shadow-2xl">
              <Image
                src={lightboxImage.src}
                alt={lightboxImage.title}
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
