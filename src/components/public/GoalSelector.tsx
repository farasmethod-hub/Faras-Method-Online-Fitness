"use client";

import React, { useState } from "react";
import { Target, ArrowRight, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/shared/Button";
import { FITNESS_GOALS } from "@/data/goals";

export function GoalSelector() {
  const [selectedGoalId, setSelectedGoalId] = useState(FITNESS_GOALS[0].id);

  const activeGoal = FITNESS_GOALS.find((g) => g.id === selectedGoalId) || FITNESS_GOALS[0];

  const handleScrollToPackages = () => {
    const el = document.getElementById("packages");
    if (el) {
      const pos = el.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: pos, behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 bg-[#253745] border-y border-[#4A5C6A]/50 relative">
      <Container>
        <SectionHeading
          badge="Goal Assessment"
          title="What Is Your Primary Fitness Goal?"
          subtitle="Select your focus area to see our recommended coaching protocol and package."
        />

        {/* Goal Selector Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-10">
          {FITNESS_GOALS.map((goal) => {
            const isSelected = goal.id === selectedGoalId;
            return (
              <button
                key={goal.id}
                onClick={() => setSelectedGoalId(goal.id)}
                className={`flex flex-col items-center text-center p-4 rounded-2xl border transition-all duration-300 ${
                  isSelected
                    ? "ios-glass border-[rgba(204,208,207,0.35)] text-white scale-[1.03] shadow-xl shadow-black/40"
                    : "ios-glass-pill text-[#9BA8AB] hover:text-[#CCD0CF] hover:scale-[1.01]"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 transition-colors ${
                    isSelected ? "bg-[#CCD0CF] text-[#06141B] shadow-md shadow-white/20" : "bg-[#253745] text-[#9BA8AB]"
                  }`}
                >
                  <Target className="w-4 h-4" />
                </div>
                <span className="heading-font text-sm font-bold uppercase tracking-wider">
                  {goal.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Goal Highlight Card */}
        <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-2xl ios-glass border border-[rgba(204,208,207,0.18)] shadow-2xl shadow-black/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-[rgba(204,208,207,0.12)]">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#9BA8AB] font-bold">
                Goal Focus
              </span>
              <h3 className="heading-font text-2xl sm:text-3xl font-extrabold text-[#CCD0CF] uppercase">
                {activeGoal.title}
              </h3>
            </div>
            <div className="px-3.5 py-1.5 rounded-full ios-glass-pill text-xs font-semibold text-[#CCD0CF] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Recommended: {activeGoal.recommendedPackageSlug.replace(/-/g, " ").toUpperCase()}</span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-[#9BA8AB] leading-relaxed mb-6 font-light">
            {activeGoal.description}
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            <div className="text-xs text-[#CCD0CF]">
              <span className="text-[#9BA8AB] block">Realistic Target Metric:</span>
              <strong className="text-white text-sm">{activeGoal.metrics}</strong>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={handleScrollToPackages}
              className="gap-2 w-full sm:w-auto"
            >
              <span>View Recommended Plan</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

