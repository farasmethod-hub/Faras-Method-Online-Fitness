"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowLeftRight, TrendingUp, Dumbbell, Calendar, CheckCircle2, ShieldCheck } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Badge } from "@/components/shared/Badge";
import { useFitnessStore } from "@/lib/store";

export function PersonalTransformation() {
  const { trainer } = useFitnessStore();
  const [sliderPosition, setSliderPosition] = useState(50);
  const [selectedAfterIdx, setSelectedAfterIdx] = useState(0);

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

        {/* Main Grid: Interactive Slider + Story Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Interactive Before & After Slider */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative w-full aspect-[3/4] max-w-lg mx-auto rounded-3xl overflow-hidden border border-[rgba(204,208,207,0.18)] shadow-2xl shadow-black/80 select-none bg-[#11212D]">
              {/* AFTER Image (Background) */}
              <Image
                src={activeAfterImage}
                alt={`Coach ${trainer.name} After Transformation - 69 KG`}
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute top-4 right-4 z-10 px-3.5 py-1.5 rounded-full ios-glass border border-[rgba(204,208,207,0.2)] text-xs font-black uppercase tracking-wider text-[#CCD0CF] shadow-lg">
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
                  <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full ios-glass border border-[rgba(204,208,207,0.2)] text-xs font-black uppercase tracking-wider text-[#9BA8AB] shadow-lg">
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

            {/* Slider Instructions and After Pose Selector */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-lg mx-auto px-2">
              <span className="text-[11px] text-[#9BA8AB] flex items-center gap-1.5">
                <ArrowLeftRight className="w-3.5 h-3.5 text-[#CCD0CF]" />
                Drag slider to inspect transformation
              </span>

              {/* Thumbnails to inspect after pose 1, 2, 3 */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold text-[#9BA8AB]">Pose:</span>
                {afterImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedAfterIdx(idx)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      selectedAfterIdx === idx
                        ? "bg-[#CCD0CF] text-[#06141B] shadow-md shadow-white/10"
                        : "ios-glass-pill text-[#9BA8AB] hover:text-[#CCD0CF]"
                    }`}
                  >
                    Pose {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Story Narrative & Natural Muscle Building Breakdown */}
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
    </section>
  );
}

