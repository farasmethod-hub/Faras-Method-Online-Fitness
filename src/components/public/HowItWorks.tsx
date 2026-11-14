"use client";

import React from "react";
import { ClipboardCheck, FileText, Video, TrendingUp } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";

const STEPS = [
  {
    step: "01",
    title: "Initial Assessment & Intake",
    description: "We review your training background, schedule, current body weight, available equipment, and fitness goals to establish a clear starting baseline.",
    icon: ClipboardCheck,
  },
  {
    step: "02",
    title: "Personalized Workout & Diet Plan",
    description: "Receive your tailored workout split with exact exercise selection, rep ranges, calorie targets, and nutrition guidelines built specifically for your goals.",
    icon: FileText,
  },
  {
    step: "03",
    title: "Daily Execution & Form Feedback",
    description: "Train with purpose. Send exercise videos on WhatsApp for technique reviews, form corrections, and answers to any questions during workouts.",
    icon: Video,
  },
  {
    step: "04",
    title: "Weekly Check-ins & Progression",
    description: "Review progress every week through weight tracking, physique updates, and Hevy app workout logs to make timely adjustments to your program.",
    icon: TrendingUp,
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-[#06141B] relative border-t border-[#4A5C6A]/50">
      <Container>
        <SectionHeading
          badge="Coaching Process"
          title="How Online Coaching Works"
          subtitle="A structured, high-accountability 4-step system designed to keep you consistent and progressing."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {STEPS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative flex flex-col p-6 sm:p-7 rounded-2xl ios-glass ios-glass-interactive border border-[rgba(204,208,207,0.12)] group shadow-xl shadow-black/30"
              >
                {/* Step Number */}
                <div className="flex items-center justify-between mb-4">
                  <span className="heading-font text-4xl font-black text-[#4A5C6A] group-hover:text-[#CCD0CF] transition-colors">
                    {item.step}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#253745] border border-[rgba(204,208,207,0.15)] flex items-center justify-center text-[#CCD0CF] group-hover:bg-[#CCD0CF] group-hover:text-[#06141B] transition-all duration-300 shadow-md">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="heading-font text-lg font-bold text-[#CCD0CF] mb-2 group-hover:text-white transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#9BA8AB] leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

