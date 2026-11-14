"use client";

import React from "react";
import { Container } from "@/components/shared/Container";
import { useFitnessStore } from "@/lib/store";

export function Stats() {
  const { trainer } = useFitnessStore();

  const dynamicStats = [
    {
      value: trainer.experienceYears || "4+ Years",
      label: "Training Experience",
      sublabel: "Dedicated lifting, nutrition & practical coaching",
    },
    {
      value: trainer.startingWeight || "56 KG",
      label: "Starting Weight",
      sublabel: "Where the journey began as a skinny beginner",
    },
    {
      value: trainer.currentWeight || "69 KG",
      label: "Current Weight",
      sublabel: "Developed natural physique through consistency",
    },
    {
      value: `${trainer.weightGained || "13 KG"}`,
      label: "Weight Gained",
      sublabel: "Trainer's personal reported transformation*",
    },
  ];

  return (
    <section id="stats" className="py-12 bg-[#06141B] border-y border-[#4A5C6A]/50 relative z-20">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {dynamicStats.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center p-6 sm:p-7 rounded-2xl ios-glass ios-glass-interactive border border-[rgba(204,208,207,0.12)] group"
            >
              <span className="heading-font text-3xl sm:text-4xl lg:text-5xl font-black text-[#CCD0CF] group-hover:text-white transition-colors duration-300">
                {stat.value}
              </span>
              <span className="heading-font text-sm sm:text-base font-bold text-[#CCD0CF] uppercase tracking-wider mt-2.5 mb-1">
                {stat.label}
              </span>
              <span className="text-xs text-[#9BA8AB] font-normal leading-snug">
                {stat.sublabel}
              </span>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-center text-[#9BA8AB]/70 mt-4">
          *The 13 KG figure reflects Faras&apos;s personal reported transformation over 4+ years of natural training; client results depend on individual adherence and effort.
        </p>
      </Container>
    </section>
  );
}
