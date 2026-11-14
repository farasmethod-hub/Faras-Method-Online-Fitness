export interface PackageSyllabusWeek {
  week: string;
  title: string;
  focus: string;
  details: string[];
}

export interface Package {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  currency: string;
  duration: string;
  isPopular?: boolean;
  isPublished?: boolean;
  imageUrl?: string;
  badge?: string;
  highlight?: string;
  rateNote?: string;
  whatsappMessage?: string;
  description: string;
  features: string[];
  trainingInclusions: string[];
  nutritionGuidance: string[];
  progressTracking: string[];
  coachingSupport: string[];
  syllabus: PackageSyllabusWeek[];
}

export interface ConsultationFormData {
  name: string;
  age: string;
  currentWeight: string;
  height: string;
  fitnessGoal: string;
  preferredPackage: string;
  whatsappNumber: string;
  message: string;
}

export interface ImageFitSettings {
  mode: "auto" | "crop" | "manual"; // auto = Auto Fit (contain, full person visible); crop = Crop to Fit (cover 3:4); manual = Manual Position & Zoom
  zoom?: number; // 0.8 to 2.5 (default 1)
  panX?: number; // 0 to 100% (default 50 = center)
  panY?: number; // 0 to 100% (default 50 = center, or 15-20 = focus on upper body/head)
}

export interface Transformation {
  id: string;
  clientName: string;
  age?: number;
  startingWeight: number;
  currentWeight: number;
  weightDiff: number;
  weightUnit: string;
  duration: string;
  fitnessGoal: string;
  story: string;
  beforeImage: string;
  afterImage: string;
  beforeFit?: ImageFitSettings;
  afterFit?: ImageFitSettings;
  isFeatured?: boolean;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: "workout" | "nutrition" | "weight-loss" | "muscle-building" | "recovery";
  readTime: string;
  coverImage: string;
  publishedAt: string;
  author?: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientTitle: string;
  rating: number;
  reviewText: string;
  photoUrl: string;
  packageUsed: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface Announcement {
  id: string;
  title: string;
  badge: string;
  content: string;
  linkUrl?: string;
  isActive: boolean;
}

export interface FitnessGoal {
  id: string;
  title: string;
  tagline: string;
  description: string;
  recommendedPackageSlug: string;
  metrics: string;
}

