export interface ServiceItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  iconName: string;
  highlights: string[];
  image: string;
}

export const SERVICES: ServiceItem[] = [
  {
    id: "hypertrophy",
    title: "Natural Muscle Building",
    tagline: "Build lean muscle through progressive overload",
    description: "Structured resistance training programs designed around proper exercise technique, controlled tempo, and steady load progression to maximize natural muscle growth.",
    iconName: "Dumbbell",
    highlights: [
      "Custom workout split tailored to your equipment",
      "Progressive overload tracking via Hevy app",
      "Form video critiques to ensure proper lifting mechanics",
    ],
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "fat-loss",
    title: "Fat Loss & Conditioning",
    tagline: "Reduce body fat while preserving lean muscle",
    description: "Calculated nutritional planning paired with consistent strength training to create a sustainable deficit without extreme starvation, muscle loss, or low energy.",
    iconName: "Flame",
    highlights: [
      "Realistic calorie and protein targets",
      "No starvation or crash diets",
      "Daily activity and step-count guidelines",
    ],
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "recomp",
    title: "Body Recomposition",
    tagline: "Lose fat and build muscle simultaneously",
    description: "Designed especially for beginners and those returning after a hiatus. Calibrates maintenance calories and training volume to build tone and drop inches.",
    iconName: "Activity",
    highlights: [
      "Optimal for beginners (skinny-fat or untrained)",
      "Targeted macros with high protein emphasis",
      "Weekly photo and measurement reviews",
    ],
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "strength-mobility",
    title: "Strength & Movement Mechanics",
    tagline: "Develop joint stability, posture, and core strength",
    description: "Focuses on lifting safely with strict execution. Corrects faulty movement patterns, strengthens stabilizers, and builds resilient strength for everyday life.",
    iconName: "ShieldCheck",
    highlights: [
      "Compound movement execution breakdown",
      "Joint-friendly exercise variations",
      "Warm-up and mobility routines included",
    ],
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
  },
];
