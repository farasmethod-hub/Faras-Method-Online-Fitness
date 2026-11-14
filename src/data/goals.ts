import { FitnessGoal } from "@/types";

export const FITNESS_GOALS: FitnessGoal[] = [
  {
    id: "fat-loss",
    title: "Fat Loss & Definition",
    tagline: "Reduce body fat sustainably while preserving muscle",
    description: "Designed for individuals looking to lean down without extreme restriction. Uses calculated caloric targets and consistent resistance training to keep strength high.",
    recommendedPackageSlug: "premium-3-months",
    metrics: "Healthy rate of 0.5 - 1.0 kg fat loss per week",
  },
  {
    id: "muscle-gain",
    title: "Muscle Building",
    tagline: "Build lean muscle through progressive overload",
    description: "Focused on progressive tension, proper lifting mechanics, and structured surplus nutrition to add dense muscle mass naturally over time.",
    recommendedPackageSlug: "premium-plan",
    metrics: "Measurable strength and volume progression weekly",
  },
  {
    id: "body-recomp",
    title: "Body Recomposition",
    tagline: "Lose fat and build muscle simultaneously",
    description: "Targeted training and calibrated nutrition designed to build shape, tighten measurements, and improve posture simultaneously.",
    recommendedPackageSlug: "premium-6-months",
    metrics: "Visible reduction in waist size and improved tone",
  },
  {
    id: "technique-foundation",
    title: "Strength & Proper Technique",
    tagline: "Learn proper exercise execution and train with purpose",
    description: "For self-driven individuals who want a well-designed workout and diet plan to execute independently with baseline coach guidance.",
    recommendedPackageSlug: "base-plan",
    metrics: "Mastery of compound lifts and consistent gym habits",
  },
];
