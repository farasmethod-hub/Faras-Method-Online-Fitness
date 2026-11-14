"use client";

import { useState, useEffect } from "react";
import { PACKAGES } from "@/data/packages";
import { TRANSFORMATIONS } from "@/data/transformations";
import { ARTICLES } from "@/data/articles";
import { TESTIMONIALS } from "@/data/testimonials";
import { FAQS } from "@/data/faq";
import { ANNOUNCEMENTS } from "@/data/announcements";
import { SERVICES, ServiceItem } from "@/data/services";
import { SITE_CONFIG } from "@/lib/config";
import { Package, Transformation, Article, Testimonial, FAQItem, Announcement, ConsultationFormData } from "@/types";
import { safeSetItem, safeGetItem, idbGet, purgeBloatedLocalStorage } from "@/lib/safeStorage";

export interface BookingLead extends ConsultationFormData {
  id: string;
  createdAt: string;
  status: "pending" | "contacted" | "enrolled" | "declined";
  notes?: string;
}

export interface ClientRecord {
  id: string;
  fullName: string;
  email: string;
  whatsappNumber: string;
  enrolledPackage: string;
  status: "active" | "paused" | "completed";
  enrolledDate: string;
  notes?: string;
}

export interface MediaAsset {
  id: string;
  title: string;
  url: string;
  bucket: string;
  fileSize: string;
  uploadedAt: string;
}

export interface TrainerProfile {
  name: string;
  fullName?: string;
  professionalTitle: string;
  tagline: string;
  bio: string;
  philosophy: string;
  experienceYears: string;
  startingWeight: string;
  currentWeight: string;
  weightGained: string;
  whatsappNumber: string;
  instagramUsername: string;
  instagramUrl: string;
  transformation?: {
    beforeImage: string;
    afterImage: string;
    afterImage2?: string;
    afterImage3?: string;
  };
  certification: {
    title: string;
    qualification: string;
    qualificationCode: string;
    nsqfLevel: string;
    assessmentStatus: string;
    standard: string;
    sectorCouncil: string;
    dateOfIssue: string;
    trainingAreas: string[];
    certificateImageUrl?: string;
  };
  certifications: string[];
  achievements: string[];
  photoUrl: string;
  isActive: boolean;
}

export interface WebsiteSettings {
  brandName: string;
  trainerName: string;
  whatsappNumber: string;
  instagramHandle: string;
  contactEmail: string;
  seoTitle: string;
  seoDescription: string;
  heroHeadingLine1?: string;
  heroHeadingLine2?: string;
  heroHeadingLine3?: string;
  heroSubtitle?: string;
  heroButtonPrimary?: string;
  heroButtonSecondary?: string;
  heroBackgroundImage?: string;
  footerTagline?: string;
  footerCopyright?: string;
}

export interface InstagramPostItem {
  id: string;
  image: string;
  likes: string;
  comments: string;
  caption: string;
  postUrl?: string;
  isPublished?: boolean;
}

export const INITIAL_INSTA_POSTS: InstagramPostItem[] = [
  {
    id: "post-1",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
    likes: "1,842",
    comments: "94",
    caption: "The dumbbell incline press angle matters. 30 degrees targets clavicular fibers with zero shoulder impingement.",
  },
  {
    id: "post-2",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
    likes: "2,410",
    comments: "148",
    caption: "Progressive overload doesn’t just mean adding weight. It means owning the eccentric phase for 3 seconds.",
  },
  {
    id: "post-3",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80",
    likes: "1,220",
    comments: "63",
    caption: "Protein pacing: 45g of quality protein post-workout. Simple, predictable, highly anabolic.",
  },
  {
    id: "post-4",
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80",
    likes: "3,110",
    comments: "210",
    caption: "From 56 kg to 69 kg. Consistency beats shortcuts every single time. Proper training, patience, and real progression.",
  },
];

const STORAGE_KEYS = {
  PACKAGES: "faras_method_packages_v2",
  TRANSFORMATIONS: "faras_method_transformations_v1",
  ARTICLES: "faras_method_articles_v1",
  TESTIMONIALS: "faras_method_testimonials_v1",
  FAQS: "faras_method_faqs_v1",
  ANNOUNCEMENTS: "faras_method_announcements_v1",
  SERVICES: "faras_method_services_v1",
  BOOKINGS: "faras_method_bookings_v1",
  CLIENTS: "faras_method_clients_v1",
  MEDIA: "faras_method_media_v1",
  TRAINER: "faras_method_trainer_v2",
  TRAINERS_LIST: "faras_method_trainers_list_v2",
  SETTINGS: "faras_method_settings_v1",
  INSTAGRAM_POSTS: "faras_method_instagram_posts_v1",
};

export const INITIAL_TRAINER: TrainerProfile = {
  name: "Faras",
  fullName: "Mohammad Faras U",
  professionalTitle: "Online Fitness Coach",
  tagline: "Train Smart. Stay Consistent. Transform Yourself.",
  bio: "I started my fitness journey as a skinny beginner with very little knowledge of training or nutrition. I made mistakes, struggled to see results, and had to learn through experience.\n\nOver the years, I gained 13 kg of body weight, developed my physique, and built a much deeper understanding of natural muscle building.\n\nMore importantly, the journey taught me patience, discipline, and the value of consistency. I learned that progress isn't about finding shortcuts — it's about following the right approach and sticking with it.\n\nToday, as an Online Fitness Coach, I use the knowledge and experience I've gained to help others train with purpose, improve their nutrition, and work towards their fitness goals.\n\nI've been a beginner myself. Now, I'm here to help you make your own progress with a clear plan and consistent guidance.",
  philosophy: "No shortcuts. No unrealistic promises. Just proper training, consistency and progress.",
  experienceYears: "4+ Years",
  startingWeight: "56 KG",
  currentWeight: "69 KG",
  weightGained: "13 KG",
  whatsappNumber: "918138954423",
  instagramUsername: "itsfarasu",
  instagramUrl: "https://www.instagram.com/itsfarasu/",
  transformation: {
    beforeImage: "/photos/faras-before.jpeg",
    afterImage: "/photos/faras-after-1.jpeg",
    afterImage2: "/photos/faras-after-2.jpeg",
    afterImage3: "/photos/faras-after-3.jpeg",
  },
  certification: {
    title: "Core Coaching Competencies & Methodology",
    qualification: "Evidence-Based Fitness Coaching",
    qualificationCode: "NAT-HYP-01",
    nsqfLevel: "Advanced",
    assessmentStatus: "Verified",
    standard: "Evidence-Based Hypertrophy Standards",
    sectorCouncil: "Natural Bodybuilding & Strength Conditioning",
    dateOfIssue: "2026",
    trainingAreas: [
      "Fitness instruction",
      "Workout planning",
      "Exercise techniques",
      "Client fitness guidance",
    ],
    certificateImageUrl: "",
  },
  certifications: [
    "Evidence-Based Resistance Training & Hypertrophy Protocols",
    "4+ Years of Dedicated Real-World Natural Muscle Building",
    "Custom Nutritional Architecture & Macronutrient Programming",
    "Movement Mechanics & Video Form Analysis",
  ],
  achievements: [
    "4+ Years of Dedicated Real-World Training Experience",
    "Personal Reported Transformation: 56 KG → 69 KG (+13 KG Natural Body-Weight Gain)",
    "Specialist in Natural Muscle Building & Structured Beginner Guidance",
    "Evidence-Based Progressive Overload Protocols",
  ],
  photoUrl: "/photos/faras-after-1.jpeg",
  isActive: true,
};

export const INITIAL_SETTINGS: WebsiteSettings = {
  brandName: "FARAS METHOD",
  trainerName: "Faras",
  whatsappNumber: "918138954423",
  instagramHandle: "itsfarasu",
  contactEmail: "coach@farasfitness.com",
  seoTitle: "FARAS METHOD | Online Fitness Coaching",
  seoDescription: "Train Smart. Stay Consistent. Transform Yourself. Online fitness coaching by Coach Mohammad Faras U.",
  heroHeadingLine1: "TRAIN SMART.",
  heroHeadingLine2: "STAY CONSISTENT.",
  heroHeadingLine3: "TRANSFORM YOURSELF.",
  heroSubtitle: "Bespoke 1-on-1 online fitness coaching protocols designed for natural muscle building, body recomposition, and sustainable strength. Structured progressive overload, precise nutrition targets, and disciplined weekly accountability.",
  heroButtonPrimary: "Start Your Transformation",
  heroButtonSecondary: "Chat on WhatsApp",
  heroBackgroundImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=2000&q=85",
  footerTagline: "Train Smart. Stay Consistent. Transform Yourself.",
  footerCopyright: "FARAS METHOD. All Rights Reserved. Evidence-Based Online Fitness Coaching.",
};

const INITIAL_BOOKINGS: BookingLead[] = [
  {
    id: "lead-1",
    name: "Marcus Sterling",
    age: "36",
    currentWeight: "94 kg",
    height: "182 cm",
    fitnessGoal: "Executive Recomp",
    preferredPackage: "Premium 3 Months",
    whatsappNumber: "+1 (555) 349-2910",
    message: "Travel 2 weeks per month. Need structured nutrition and gym workouts for hotel chains.",
    status: "pending",
    createdAt: "2026-11-13T14:30:00Z",
    notes: "Follow up via WhatsApp at 4 PM EST.",
  },
  {
    id: "lead-2",
    name: "Sophia Zhang",
    age: "29",
    currentWeight: "64 kg",
    height: "168 cm",
    fitnessGoal: "Lean Muscle & Strength",
    preferredPackage: "Premium Plan",
    whatsappNumber: "+1 (555) 891-2304",
    message: "Stuck at 50kg squat for 8 months. Want direct video form analysis.",
    status: "contacted",
    createdAt: "2026-11-12T09:15:00Z",
    notes: "Introductory WhatsApp call completed. Sending onboarding packet.",
  },
];

const INITIAL_CLIENTS: ClientRecord[] = [
  {
    id: "client-1",
    fullName: "Arthur Pendelton",
    email: "arthur.p@nexuscorp.com",
    whatsappNumber: "+1 (555) 234-8901",
    enrolledPackage: "Premium 6 Months",
    status: "active",
    enrolledDate: "2026-09-01",
    notes: "Phase 3 Hypertrophy block. Bench up 12kg.",
  },
  {
    id: "client-2",
    fullName: "Rachel Montgomery",
    email: "rachel.m@designstudio.io",
    whatsappNumber: "+1 (555) 890-1234",
    enrolledPackage: "Premium 3 Months",
    status: "active",
    enrolledDate: "2026-10-15",
    notes: "Metabolic fat loss protocol. Down 6.4kg body fat.",
  },
  {
    id: "client-3",
    fullName: "Derrick Hayes",
    email: "dhayes@vanguard.org",
    whatsappNumber: "+1 (555) 456-7890",
    enrolledPackage: "Base Plan",
    status: "completed",
    enrolledDate: "2026-06-10",
    notes: "Completed 16-week cycle. Maintained lean weight.",
  },
];

const INITIAL_MEDIA: MediaAsset[] = [
  {
    id: "media-faras-before",
    title: "Trainer Faras - Before Transformation (56 KG)",
    url: "/photos/faras-before.jpeg",
    bucket: "trainer-photos",
    fileSize: "408 KB",
    uploadedAt: "2026-11-14",
  },
  {
    id: "media-faras-after-1",
    title: "Trainer Faras - After Transformation (69 KG - Primary)",
    url: "/photos/faras-after-1.jpeg",
    bucket: "trainer-photos",
    fileSize: "3.6 MB",
    uploadedAt: "2026-11-14",
  },
  {
    id: "media-faras-after-2",
    title: "Trainer Faras - After Transformation (Physique Pose 2)",
    url: "/photos/faras-after-2.jpeg",
    bucket: "trainer-photos",
    fileSize: "4.8 MB",
    uploadedAt: "2026-11-14",
  },
  {
    id: "media-faras-after-3",
    title: "Trainer Faras - After Transformation (Physique Pose 3)",
    url: "/photos/faras-after-3.jpeg",
    bucket: "trainer-photos",
    fileSize: "4.7 MB",
    uploadedAt: "2026-11-14",
  },
  {
    id: "media-faras-certificate",
    title: "SPEFL-SC Level 4 General Fitness Trainer Certificate (Mohammad Faras U)",
    url: "/certificate/mohammad-faras-u-certificate.svg",
    bucket: "trainer-certificates",
    fileSize: "12 KB",
    uploadedAt: "2026-11-14",
  },
  {
    id: "media-1",
    title: "Coach Faras Profile Image",
    url: "/photos/faras-after-1.jpeg",
    bucket: "trainer-photos",
    fileSize: "3.6 MB",
    uploadedAt: "2026-11-14",
  },
  {
    id: "media-2",
    title: "Hero Background Gym",
    url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=2000&q=85",
    bucket: "branding-assets",
    fileSize: "2.8 MB",
    uploadedAt: "2026-10-20",
  },
  {
    id: "media-3",
    title: "Alex R Transformation Before/After",
    url: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
    bucket: "transformation-images",
    fileSize: "950 KB",
    uploadedAt: "2026-11-05",
  },
  {
    id: "media-4",
    title: "Nutrition Article Banner",
    url: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80",
    bucket: "article-images",
    fileSize: "1.4 MB",
    uploadedAt: "2026-10-25",
  },
];

export function useFitnessStore() {
  const [packages, setPackages] = useState<Package[]>(PACKAGES);
  const [transformations, setTransformations] = useState<Transformation[]>(TRANSFORMATIONS);
  const [articles, setArticles] = useState<Article[]>(ARTICLES);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(TESTIMONIALS);
  const [faqs, setFaqs] = useState<FAQItem[]>(FAQS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(ANNOUNCEMENTS);
  const [services, setServices] = useState<ServiceItem[]>(SERVICES);
  const [bookings, setBookings] = useState<BookingLead[]>(INITIAL_BOOKINGS);
  const [clients, setClients] = useState<ClientRecord[]>(INITIAL_CLIENTS);
  const [media, setMedia] = useState<MediaAsset[]>(INITIAL_MEDIA);
  const [trainer, setTrainer] = useState<TrainerProfile>(INITIAL_TRAINER);
  const [trainersList, setTrainersList] = useState<TrainerProfile[]>([INITIAL_TRAINER]);
  const [settings, setSettings] = useState<WebsiteSettings>(INITIAL_SETTINGS);
  const [instagramPosts, setInstagramPosts] = useState<InstagramPostItem[]>(INITIAL_INSTA_POSTS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from LocalStorage or IndexedDB
  useEffect(() => {
    try {
      // Auto-purge any bloated legacy base64 data to ensure clean storage quota
      purgeBloatedLocalStorage();

      const storedPkgs = safeGetItem(STORAGE_KEYS.PACKAGES);
      if (storedPkgs) setPackages(JSON.parse(storedPkgs));
      else idbGet<string>(STORAGE_KEYS.PACKAGES).then((val) => val && setPackages(JSON.parse(val)));

      const storedTrans = safeGetItem(STORAGE_KEYS.TRANSFORMATIONS);
      if (storedTrans) setTransformations(JSON.parse(storedTrans));
      else idbGet<string>(STORAGE_KEYS.TRANSFORMATIONS).then((val) => val && setTransformations(JSON.parse(val)));

      const storedArts = safeGetItem(STORAGE_KEYS.ARTICLES);
      if (storedArts) setArticles(JSON.parse(storedArts));
      else idbGet<string>(STORAGE_KEYS.ARTICLES).then((val) => val && setArticles(JSON.parse(val)));

      const storedTests = safeGetItem(STORAGE_KEYS.TESTIMONIALS);
      if (storedTests) setTestimonials(JSON.parse(storedTests));
      else idbGet<string>(STORAGE_KEYS.TESTIMONIALS).then((val) => val && setTestimonials(JSON.parse(val)));

      const storedFaqs = safeGetItem(STORAGE_KEYS.FAQS);
      if (storedFaqs) setFaqs(JSON.parse(storedFaqs));
      else idbGet<string>(STORAGE_KEYS.FAQS).then((val) => val && setFaqs(JSON.parse(val)));

      const storedAnn = safeGetItem(STORAGE_KEYS.ANNOUNCEMENTS);
      if (storedAnn) setAnnouncements(JSON.parse(storedAnn));
      else idbGet<string>(STORAGE_KEYS.ANNOUNCEMENTS).then((val) => val && setAnnouncements(JSON.parse(val)));

      const storedServ = safeGetItem(STORAGE_KEYS.SERVICES);
      if (storedServ) setServices(JSON.parse(storedServ));
      else idbGet<string>(STORAGE_KEYS.SERVICES).then((val) => val && setServices(JSON.parse(val)));

      const storedBookings = safeGetItem(STORAGE_KEYS.BOOKINGS);
      if (storedBookings) setBookings(JSON.parse(storedBookings));
      else idbGet<string>(STORAGE_KEYS.BOOKINGS).then((val) => val && setBookings(JSON.parse(val)));

      const storedClients = safeGetItem(STORAGE_KEYS.CLIENTS);
      if (storedClients) setClients(JSON.parse(storedClients));
      else idbGet<string>(STORAGE_KEYS.CLIENTS).then((val) => val && setClients(JSON.parse(val)));

      const storedMedia = safeGetItem(STORAGE_KEYS.MEDIA);
      if (storedMedia) setMedia(JSON.parse(storedMedia));
      else idbGet<string>(STORAGE_KEYS.MEDIA).then((val) => val && setMedia(JSON.parse(val)));

      const storedTrainer = safeGetItem(STORAGE_KEYS.TRAINER);
      if (storedTrainer) setTrainer(JSON.parse(storedTrainer));
      else idbGet<string>(STORAGE_KEYS.TRAINER).then((val) => val && setTrainer(JSON.parse(val)));

      const storedTrainersList = safeGetItem(STORAGE_KEYS.TRAINERS_LIST);
      if (storedTrainersList) setTrainersList(JSON.parse(storedTrainersList));
      else idbGet<string>(STORAGE_KEYS.TRAINERS_LIST).then((val) => val && setTrainersList(JSON.parse(val)));

      const storedSettings = safeGetItem(STORAGE_KEYS.SETTINGS);
      if (storedSettings) setSettings(JSON.parse(storedSettings));
      else idbGet<string>(STORAGE_KEYS.SETTINGS).then((val) => val && setSettings(JSON.parse(val)));

      const storedInsta = safeGetItem(STORAGE_KEYS.INSTAGRAM_POSTS);
      if (storedInsta) setInstagramPosts(JSON.parse(storedInsta));
      else idbGet<string>(STORAGE_KEYS.INSTAGRAM_POSTS).then((val) => val && setInstagramPosts(JSON.parse(val)));
    } catch (e) {
      console.warn("Could not load from storage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync listener across tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.PACKAGES && e.newValue) setPackages(JSON.parse(e.newValue));
      if (e.key === STORAGE_KEYS.TRANSFORMATIONS && e.newValue) setTransformations(JSON.parse(e.newValue));
      if (e.key === STORAGE_KEYS.ARTICLES && e.newValue) setArticles(JSON.parse(e.newValue));
      if (e.key === STORAGE_KEYS.TESTIMONIALS && e.newValue) setTestimonials(JSON.parse(e.newValue));
      if (e.key === STORAGE_KEYS.FAQS && e.newValue) setFaqs(JSON.parse(e.newValue));
      if (e.key === STORAGE_KEYS.ANNOUNCEMENTS && e.newValue) setAnnouncements(JSON.parse(e.newValue));
      if (e.key === STORAGE_KEYS.SERVICES && e.newValue) setServices(JSON.parse(e.newValue));
      if (e.key === STORAGE_KEYS.BOOKINGS && e.newValue) setBookings(JSON.parse(e.newValue));
      if (e.key === STORAGE_KEYS.CLIENTS && e.newValue) setClients(JSON.parse(e.newValue));
      if (e.key === STORAGE_KEYS.MEDIA && e.newValue) setMedia(JSON.parse(e.newValue));
      if (e.key === STORAGE_KEYS.TRAINER && e.newValue) setTrainer(JSON.parse(e.newValue));
      if (e.key === STORAGE_KEYS.TRAINERS_LIST && e.newValue) setTrainersList(JSON.parse(e.newValue));
      if (e.key === STORAGE_KEYS.SETTINGS && e.newValue) setSettings(JSON.parse(e.newValue));
      if (e.key === STORAGE_KEYS.INSTAGRAM_POSTS && e.newValue) setInstagramPosts(JSON.parse(e.newValue));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Packages CRUD
  const updatePackage = (updatedPkg: Package) => {
    setPackages((prev) => {
      const next = prev.map((p) => (p.id === updatedPkg.id ? updatedPkg : p));
      safeSetItem(STORAGE_KEYS.PACKAGES, JSON.stringify(next));
      return next;
    });
  };

  const addPackage = (newPkg: Package) => {
    setPackages((prev) => {
      const next = [...prev, newPkg];
      safeSetItem(STORAGE_KEYS.PACKAGES, JSON.stringify(next));
      return next;
    });
  };

  const deletePackage = (id: string) => {
    setPackages((prev) => {
      const next = prev.filter((p) => p.id !== id);
      safeSetItem(STORAGE_KEYS.PACKAGES, JSON.stringify(next));
      return next;
    });
  };

  // Transformations CRUD
  const updateTransformation = (item: Transformation) => {
    setTransformations((prev) => {
      const next = prev.map((t) => (t.id === item.id ? item : t));
      safeSetItem(STORAGE_KEYS.TRANSFORMATIONS, JSON.stringify(next));
      return next;
    });
  };

  const addTransformation = (item: Transformation) => {
    setTransformations((prev) => {
      const next = [item, ...prev];
      safeSetItem(STORAGE_KEYS.TRANSFORMATIONS, JSON.stringify(next));
      return next;
    });
  };

  const deleteTransformation = (id: string) => {
    setTransformations((prev) => {
      const next = prev.filter((t) => t.id !== id);
      safeSetItem(STORAGE_KEYS.TRANSFORMATIONS, JSON.stringify(next));
      return next;
    });
  };

  // Articles CRUD
  const updateArticle = (item: Article) => {
    setArticles((prev) => {
      const next = prev.map((a) => (a.id === item.id ? item : a));
      safeSetItem(STORAGE_KEYS.ARTICLES, JSON.stringify(next));
      return next;
    });
  };

  const addArticle = (item: Article) => {
    setArticles((prev) => {
      const next = [item, ...prev];
      safeSetItem(STORAGE_KEYS.ARTICLES, JSON.stringify(next));
      return next;
    });
  };

  const deleteArticle = (id: string) => {
    setArticles((prev) => {
      const next = prev.filter((a) => a.id !== id);
      safeSetItem(STORAGE_KEYS.ARTICLES, JSON.stringify(next));
      return next;
    });
  };

  // Training Programs (Services) CRUD
  const updateService = (item: ServiceItem) => {
    setServices((prev) => {
      const next = prev.map((s) => (s.id === item.id ? item : s));
      safeSetItem(STORAGE_KEYS.SERVICES, JSON.stringify(next));
      return next;
    });
  };

  const addService = (item: ServiceItem) => {
    setServices((prev) => {
      const next = [...prev, item];
      safeSetItem(STORAGE_KEYS.SERVICES, JSON.stringify(next));
      return next;
    });
  };

  const deleteService = (id: string) => {
    setServices((prev) => {
      const next = prev.filter((s) => s.id !== id);
      safeSetItem(STORAGE_KEYS.SERVICES, JSON.stringify(next));
      return next;
    });
  };

  // Testimonials CRUD
  const updateTestimonial = (item: Testimonial) => {
    setTestimonials((prev) => {
      const next = prev.map((t) => (t.id === item.id ? item : t));
      safeSetItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(next));
      return next;
    });
  };

  const addTestimonial = (item: Testimonial) => {
    setTestimonials((prev) => {
      const next = [item, ...prev];
      safeSetItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(next));
      return next;
    });
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials((prev) => {
      const next = prev.filter((t) => t.id !== id);
      safeSetItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(next));
      return next;
    });
  };

  // Announcements CRUD
  const updateAnnouncement = (item: Announcement) => {
    setAnnouncements((prev) => {
      const next = prev.map((a) => (a.id === item.id ? item : a));
      safeSetItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(next));
      return next;
    });
  };

  const addAnnouncement = (item: Announcement) => {
    setAnnouncements((prev) => {
      const next = [item, ...prev];
      safeSetItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(next));
      return next;
    });
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => {
      const next = prev.filter((a) => a.id !== id);
      safeSetItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(next));
      return next;
    });
  };

  // Clients CRUD
  const addClient = (record: ClientRecord) => {
    setClients((prev) => {
      const next = [record, ...prev];
      safeSetItem(STORAGE_KEYS.CLIENTS, JSON.stringify(next));
      return next;
    });
  };

  const updateClient = (record: ClientRecord) => {
    setClients((prev) => {
      const next = prev.map((c) => (c.id === record.id ? record : c));
      safeSetItem(STORAGE_KEYS.CLIENTS, JSON.stringify(next));
      return next;
    });
  };

  const deleteClient = (id: string) => {
    setClients((prev) => {
      const next = prev.filter((c) => c.id !== id);
      safeSetItem(STORAGE_KEYS.CLIENTS, JSON.stringify(next));
      return next;
    });
  };

  // Media Library CRUD
  const addMediaAsset = (asset: MediaAsset) => {
    setMedia((prev) => {
      const next = [asset, ...prev];
      safeSetItem(STORAGE_KEYS.MEDIA, JSON.stringify(next));
      return next;
    });
  };

  const deleteMediaAsset = (id: string) => {
    setMedia((prev) => {
      const next = prev.filter((m) => m.id !== id);
      safeSetItem(STORAGE_KEYS.MEDIA, JSON.stringify(next));
      return next;
    });
  };

  // Bookings CRUD
  const addBooking = (formData: ConsultationFormData): BookingLead => {
    const newBooking: BookingLead = {
      ...formData,
      id: "booking-" + Date.now(),
      createdAt: new Date().toISOString(),
      status: "pending",
    };
    setBookings((prev) => {
      const next = [newBooking, ...prev];
      safeSetItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(next));
      return next;
    });
    return newBooking;
  };

  const updateBookingStatus = (id: string, status: BookingLead["status"], notes?: string) => {
    setBookings((prev) => {
      const next = prev.map((b) => (b.id === id ? { ...b, status, notes: notes !== undefined ? notes : b.notes } : b));
      safeSetItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(next));
      return next;
    });
  };

  // FAQs CRUD
  const updateFaq = (item: FAQItem) => {
    setFaqs((prev) => {
      const next = prev.map((f) => (f.id === item.id ? item : f));
      safeSetItem(STORAGE_KEYS.FAQS, JSON.stringify(next));
      return next;
    });
  };

  const addFaq = (item: FAQItem) => {
    setFaqs((prev) => {
      const next = [...prev, item];
      safeSetItem(STORAGE_KEYS.FAQS, JSON.stringify(next));
      return next;
    });
  };

  const deleteFaq = (id: string) => {
    setFaqs((prev) => {
      const next = prev.filter((f) => f.id !== id);
      safeSetItem(STORAGE_KEYS.FAQS, JSON.stringify(next));
      return next;
    });
  };

  // Trainer Profiles CRUD
  const updateTrainer = (updated: TrainerProfile) => {
    setTrainer(updated);
    safeSetItem(STORAGE_KEYS.TRAINER, JSON.stringify(updated));
    setTrainersList((prev) => {
      const idx = prev.findIndex((t) => t.name.toLowerCase() === updated.name.toLowerCase());
      const next = idx >= 0 ? prev.map((t, i) => (i === idx ? updated : t)) : [...prev, updated];
      safeSetItem(STORAGE_KEYS.TRAINERS_LIST, JSON.stringify(next));
      return next;
    });
  };

  const addTrainerProfile = (item: TrainerProfile) => {
    setTrainersList((prev) => {
      const next = [...prev, item];
      safeSetItem(STORAGE_KEYS.TRAINERS_LIST, JSON.stringify(next));
      return next;
    });
  };

  const deleteTrainerProfile = (name: string) => {
    setTrainersList((prev) => {
      const next = prev.filter((t) => t.name !== name);
      safeSetItem(STORAGE_KEYS.TRAINERS_LIST, JSON.stringify(next));
      return next;
    });
  };

  const updateSettings = (updated: WebsiteSettings) => {
    setSettings(updated);
    safeSetItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  };

  const updateInstagramPost = (updated: InstagramPostItem) => {
    setInstagramPosts((prev) => {
      const next = prev.map((p) => (p.id === updated.id ? updated : p));
      safeSetItem(STORAGE_KEYS.INSTAGRAM_POSTS, JSON.stringify(next));
      return next;
    });
  };

  const addInstagramPost = (item: InstagramPostItem) => {
    setInstagramPosts((prev) => {
      const next = [...prev, item];
      safeSetItem(STORAGE_KEYS.INSTAGRAM_POSTS, JSON.stringify(next));
      return next;
    });
  };

  const deleteInstagramPost = (id: string) => {
    setInstagramPosts((prev) => {
      const next = prev.filter((p) => p.id !== id);
      safeSetItem(STORAGE_KEYS.INSTAGRAM_POSTS, JSON.stringify(next));
      return next;
    });
  };

  const reorderInstagramPosts = (newOrder: InstagramPostItem[]) => {
    setInstagramPosts(newOrder);
    safeSetItem(STORAGE_KEYS.INSTAGRAM_POSTS, JSON.stringify(newOrder));
  };

  return {
    isLoaded,
    packages,
    transformations,
    articles,
    testimonials,
    faqs,
    announcements,
    services,
    bookings,
    clients,
    media,
    trainer,
    trainersList,
    settings,
    instagramPosts,
    updatePackage,
    addPackage,
    deletePackage,
    updateTransformation,
    addTransformation,
    deleteTransformation,
    updateArticle,
    addArticle,
    deleteArticle,
    updateService,
    addService,
    deleteService,
    updateTestimonial,
    addTestimonial,
    deleteTestimonial,
    updateAnnouncement,
    addAnnouncement,
    deleteAnnouncement,
    updateFaq,
    addFaq,
    deleteFaq,
    addClient,
    updateClient,
    deleteClient,
    addMediaAsset,
    deleteMediaAsset,
    addBooking,
    updateBookingStatus,
    updateTrainer,
    addTrainerProfile,
    deleteTrainerProfile,
    updateSettings,
    updateInstagramPost,
    addInstagramPost,
    deleteInstagramPost,
    reorderInstagramPosts,
  };
}
