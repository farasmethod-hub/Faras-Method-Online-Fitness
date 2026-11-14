"use client";

import React from "react";
import Image from "next/image";
import {
  Check,
  ShieldCheck,
  Award,
  Dumbbell,
  MessageCircle,
  TrendingUp,
  Target,
} from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";
import { useFitnessStore } from "@/lib/store";
import { buildGeneralWhatsAppUrl } from "@/lib/config";

export function About() {
  const { trainer, settings } = useFitnessStore();

  const whatsappUrl = buildGeneralWhatsAppUrl(
    `Hello Coach ${trainer.name}, I read your personal fitness journey from 56kg to 69kg and would like to learn more about training under your guidance.`,
    settings.whatsappNumber,
    trainer.name
  );

  return (
    <section id="about" className="py-24 bg-[#06141B] relative">
      <Container>
        <SectionHeading
          badge="Head Coach Profile"
          title={`Meet ${trainer.fullName || "Mohammad Faras U"}`}
          subtitle={`${trainer.experienceYears || "4+ Years"} of Real-World Training • ${trainer.professionalTitle || "Online Fitness Coach"}`}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Trainer Portrait & Transformation Badge Frame */}
          <div className="lg:col-span-5 relative space-y-6">
            <div className="relative mx-auto max-w-md lg:max-w-none aspect-[4/5] min-h-[460px] sm:min-h-[520px] rounded-3xl overflow-hidden border border-[rgba(204,208,207,0.18)] shadow-2xl shadow-black/80 group bg-[#11212D] p-0">
              <Image
                src={trainer.photoUrl || "/photos/faras-after-1.jpeg"}
                alt={trainer.name}
                fill
                priority
                className="object-cover object-top filter brightness-95 group-hover:scale-105 transition-transform duration-700"
              />
              {/* Subtle gradient at the bottom so text is crisp without darkening Faras's face */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#06141B] via-[#06141B]/40 to-transparent" />

              {/* Clean Non-Obtrusive Top Status Badges */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#06141B]/85 backdrop-blur-md text-[#CCD0CF] border border-[rgba(204,208,207,0.2)] shadow-lg">
                  Level 4 Certified
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950/85 backdrop-blur-md text-emerald-300 border border-emerald-500/30 shadow-lg">
                  100% Natural
                </span>
              </div>

              {/* Unified Bottom Coach Identity & Progress Card - Never overlapping the portrait */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#11212D]/90 backdrop-blur-xl border border-[rgba(204,208,207,0.18)] shadow-2xl z-10 space-y-2.5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="heading-font text-lg sm:text-xl font-bold text-[#CCD0CF] uppercase tracking-wide leading-tight">
                      {trainer.fullName || "Mohammad Faras U"}
                    </h3>
                    <p className="text-xs text-[#9BA8AB] font-medium mt-0.5">
                      {trainer.professionalTitle || "Online Fitness Coach"} • {trainer.experienceYears || "4+ Years"} Dedicated
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-[#253745] border border-[rgba(204,208,207,0.18)] flex items-center justify-center text-emerald-400 shrink-0 shadow-md">
                    <Award className="w-4 h-4" />
                  </div>
                </div>

                <div className="pt-2 border-t border-[rgba(204,208,207,0.12)] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[#9BA8AB]">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-[11px] font-semibold text-[#CCD0CF]">Personal Journey:</span>
                  </div>
                  <strong className="heading-font text-xs text-emerald-400 tracking-wide font-bold">
                    {trainer.startingWeight || "56 KG"} → {trainer.currentWeight || "69 KG"} ({trainer.weightGained ? `+${trainer.weightGained}` : "+13 KG"})
                  </strong>
                </div>
              </div>
            </div>

            {/* Core Coaching Competencies Card */}
            <div className="p-6 sm:p-7 rounded-3xl ios-glass border border-[rgba(204,208,207,0.14)] space-y-4 shadow-xl shadow-black/40">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#253745] border border-[rgba(204,208,207,0.15)] flex items-center justify-center text-[#CCD0CF]">
                    <Dumbbell className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#9BA8AB] block">
                      Coaching Framework
                    </span>
                    <h4 className="heading-font text-base sm:text-lg font-bold text-[#CCD0CF] uppercase leading-snug">
                      Core Coaching Disciplines
                    </h4>
                  </div>
                </div>
                <Badge variant="outline" className="shrink-0 text-[10px] border-[rgba(204,208,207,0.2)] text-[#CCD0CF]">
                  Natural
                </Badge>
              </div>

              <div className="p-3.5 rounded-xl bg-[#06141B]/80 border border-[rgba(204,208,207,0.1)] text-xs text-[#CCD0CF] space-y-1">
                <p className="font-semibold text-[#CCD0CF]">Methodology: <span className="text-white">Evidence-Based Muscle Hypertrophy</span></p>
                <p className="text-[#9BA8AB] text-[11px] leading-relaxed font-normal">
                  Engineered protocols focused on progressive overload, sustainable nutritional balance, and habit discipline.
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#9BA8AB] block mb-2">
                  Training &amp; Guidance Disciplines:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs text-[#CCD0CF]">
                  {[
                    "Fitness Instruction",
                    "Workout Programming",
                    "Exercise Technique & Form",
                    "Client Accountability",
                  ].map((area, i) => (
                    <div key={i} className="flex items-center gap-1.5 p-2.5 rounded-xl bg-[#253745]/50 border border-[rgba(204,208,207,0.1)]">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-[11px] leading-tight text-[#CCD0CF]">{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Trainer Biography & Authentic Journey Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full ios-glass-pill text-[#CCD0CF] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{trainer.professionalTitle || "Online Fitness Coach"}</span>
            </div>

            <h3 className="heading-font text-3xl sm:text-4xl font-extrabold text-[#CCD0CF] leading-tight">
              &ldquo;I’ve Been A Beginner Myself. Now, I’m Here To Help You Make Your Own Progress.&rdquo;
            </h3>

            {/* 4 Quantitative Milestones */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
              <div className="p-3.5 rounded-2xl ios-glass ios-glass-interactive border border-[rgba(204,208,207,0.12)] text-center">
                <span className="text-[10px] uppercase text-[#9BA8AB] block font-semibold">Started At</span>
                <strong className="heading-font text-xl text-white">{trainer.startingWeight || "56 KG"}</strong>
                <span className="text-[9px] text-[#9BA8AB] block mt-0.5">Skinny Beginner</span>
              </div>
              <div className="p-3.5 rounded-2xl ios-glass ios-glass-interactive border border-[rgba(204,208,207,0.12)] text-center">
                <span className="text-[10px] uppercase text-[#9BA8AB] block font-semibold">Current</span>
                <strong className="heading-font text-xl text-emerald-400">{trainer.currentWeight || "69 KG"}</strong>
                <span className="text-[9px] text-[#9BA8AB] block mt-0.5">+{trainer.weightGained || "13 KG"} Gained*</span>
              </div>
              <div className="p-3.5 rounded-2xl ios-glass ios-glass-interactive border border-[rgba(204,208,207,0.12)] text-center">
                <span className="text-[10px] uppercase text-[#9BA8AB] block font-semibold">Experience</span>
                <strong className="heading-font text-xl text-[#CCD0CF]">{trainer.experienceYears || "4+ Years"}</strong>
                <span className="text-[9px] text-[#9BA8AB] block mt-0.5">Natural Training</span>
              </div>
              <div className="p-3.5 rounded-2xl ios-glass ios-glass-interactive border border-[rgba(204,208,207,0.12)] text-center">
                <span className="text-[10px] uppercase text-[#9BA8AB] block font-semibold">Approach</span>
                <strong className="heading-font text-xl text-[#CCD0CF]">100%</strong>
                <span className="text-[9px] text-[#9BA8AB] block mt-0.5">Natural Muscle Building</span>
              </div>
            </div>

            {/* Authentic User-Provided Biography Paragraphs */}
            <div className="space-y-4 text-sm sm:text-base text-[#CCD0CF] leading-relaxed font-normal">
              <p>
                I started my fitness journey as a skinny beginner with very little knowledge of training or nutrition. I made mistakes, struggled to see results, and had to learn through experience.
              </p>
              <p>
                Over the years, I gained 13 kg of body weight, developed my physique, and built a much deeper understanding of natural muscle building.
              </p>
              <p>
                More importantly, the journey taught me patience, discipline, and the value of consistency. I learned that progress isn&apos;t about finding shortcuts — it&apos;s about following the right approach and sticking with it.
              </p>
              <p>
                Today, as a <strong className="text-white font-bold">{trainer.professionalTitle || "Certified Fitness Coach"}</strong>, I use the knowledge and experience I&apos;ve gained to help others train with purpose, improve their nutrition, and work towards their fitness goals.
              </p>
              <p className="text-white font-medium">
                I&apos;ve been a beginner myself. Now, I&apos;m here to help you make your own progress with a clear plan and consistent guidance.
              </p>
            </div>

            {/* Philosophy Box */}
            <div className="p-5 sm:p-6 rounded-2xl ios-glass border border-[rgba(204,208,207,0.16)] relative overflow-hidden shadow-xl shadow-black/40">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#253745] border border-[rgba(204,208,207,0.18)] flex items-center justify-center text-[#CCD0CF] shrink-0 mt-0.5 shadow-md">
                  <Target className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="heading-font text-xs uppercase tracking-widest text-[#9BA8AB] font-bold mb-1">
                    My Coaching Philosophy
                  </h4>
                  <p className="heading-font text-lg sm:text-xl font-bold text-[#CCD0CF] tracking-wide">
                    &ldquo;{trainer.philosophy || "No shortcuts. No unrealistic promises. Just proper training, consistency and progress."}&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a href="#contact">
                <Button variant="primary" size="lg">
                  Start Your Journey
                </Button>
              </a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="lg" className="gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat with Faras on WhatsApp</span>
                </Button>
              </a>
            </div>

            <p className="text-[10px] text-[#4A5C6A] italic">
              *The 13 KG figure represents Faras&apos;s personal reported journey from 56 KG to 69 KG. It is not an automated or guaranteed result for clients; individual progress depends on personal consistency, starting point, and adherence to programming.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
