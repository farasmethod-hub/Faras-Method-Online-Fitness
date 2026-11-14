"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  UserCheck,
  Dumbbell,
  Package as PackageIcon,
  BookOpen,
  Users,
  Camera,
  FileText,
  Star,
  CalendarCheck,
  FolderOpen,
  Megaphone,
  Settings,
  Search,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  ExternalLink,
  Download,
  AlertCircle,
  Eye,
  RefreshCw,
  X,
  Save,
  MessageCircle,
  Image as ImageIcon,
  Flame,
  Activity,
  Briefcase,
  HelpCircle,
  Copy,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { TransformationPhotoAdjuster, DEFAULT_FIT_SETTINGS } from "@/components/admin/TransformationPhotoAdjuster";
import { TransformationCardLivePreview } from "@/components/admin/TransformationCardLivePreview";
import { InstagramIcon } from "@/components/shared/InstagramIcon";
import { useFitnessStore, BookingLead, TrainerProfile, ClientRecord, MediaAsset, InstagramPostItem } from "@/lib/store";
import { Package, Transformation, Article, Testimonial, FAQItem, Announcement } from "@/types";
import { ServiceItem } from "@/data/services";
import { formatCurrency, formatDate } from "@/lib/utils";
import { purgeBloatedLocalStorage } from "@/lib/safeStorage";

type ActiveTab =
  | "overview"
  | "trainers"
  | "programs"
  | "packages"
  | "clients"
  | "transformations"
  | "articles"
  | "instagram"
  | "testimonials"
  | "faqs"
  | "bookings"
  | "media"
  | "announcements"
  | "settings";

export default function AdminDashboardPage() {
  const router = useRouter();
  const store = useFitnessStore();
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState("");

  // Universal Confirmation Dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const openConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Media registration modal
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [newMediaAsset, setNewMediaAsset] = useState<{
    title: string;
    url: string;
    bucket: string;
  }>({
    title: "",
    url: "",
    bucket: "branding-assets",
  });
  const [mediaCategoryFilter, setMediaCategoryFilter] = useState("all");
  const [mediaHubView, setMediaHubView] = useState<"sections" | "library">("sections");
  const [mediaSectionFilter, setMediaSectionFilter] = useState("all");

  // Multi-Trainer management modal
  const [isNewTrainerModalOpen, setIsNewTrainerModalOpen] = useState(false);
  const [newTrainerProfile, setNewTrainerProfile] = useState<TrainerProfile>({
    name: "",
    fullName: "",
    professionalTitle: "Online Fitness Coach",
    tagline: "Train Smart. Stay Consistent. Transform Yourself.",
    bio: "Dedicated online fitness coach specializing in natural muscle building, progressive overload, and lifestyle accountability.",
    philosophy: "No shortcuts. No unrealistic promises. Just proper training, consistency and progress.",
    experienceYears: "4+ Years",
    startingWeight: "56 KG",
    currentWeight: "69 KG",
    weightGained: "13 KG",
    whatsappNumber: "918138954423",
    instagramUsername: "itsfarasu",
    instagramUrl: "https://www.instagram.com/itsfarasu/",
    photoUrl: "/photos/faras-after-1.jpeg",
    isActive: true,
    certification: {
      title: "Fitness Coaching Standards",
      qualification: "Certified Fitness Coach",
      qualificationCode: "NAT-HYP-01",
      nsqfLevel: "Advanced",
      assessmentStatus: "Verified",
      standard: "Evidence-Based Hypertrophy Standards",
      sectorCouncil: "Natural Strength & Conditioning",
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
      "Evidence-Based Resistance Training Protocols",
      "Custom Nutritional Architecture",
    ],
    achievements: [
      "4+ Years of Real-World Training Experience",
      "Specialist in Natural Muscle Building",
    ],
  });

  // Package modal states
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [isNewPackage, setIsNewPackage] = useState(false);

  // Transformation modal states
  const [editingTransformation, setEditingTransformation] = useState<Transformation | null>(null);
  const [isNewTransformation, setIsNewTransformation] = useState(false);

  // Article modal states
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isNewArticle, setIsNewArticle] = useState(false);

  // Program modal states
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isNewService, setIsNewService] = useState(false);

  // Testimonial modal states
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isNewTestimonial, setIsNewTestimonial] = useState(false);

  // FAQ modal states
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [isNewFaq, setIsNewFaq] = useState(false);

  // Client modal states
  const [editingClient, setEditingClient] = useState<ClientRecord | null>(null);
  const [isNewClient, setIsNewClient] = useState(false);

  // Instagram showcase modal states
  const [editingInstaPost, setEditingInstaPost] = useState<InstagramPostItem | null>(null);
  const [isNewInstaPost, setIsNewInstaPost] = useState(false);

  // Settings & Trainer local states
  const [localSettings, setLocalSettings] = useState(store.settings);
  const [localTrainer, setLocalTrainer] = useState<TrainerProfile>(store.trainer);

  useEffect(() => {
    if (store.isLoaded) {
      setLocalSettings(store.settings);
      setLocalTrainer(store.trainer);
    }
  }, [store.isLoaded, store.settings, store.trainer]);

  // Auth protection check
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth =
        localStorage.getItem("faras_method_admin_auth") === "true" ||
        localStorage.getItem("apex_admin_auth") === "true" ||
        document.cookie.includes("faras_admin_session=authenticated");
      if (!isAuth) {
        router.push("/admin/login");
      } else if (!document.cookie.includes("faras_admin_session=authenticated")) {
        // Upgrade legacy localStorage auth into cookie auth
        document.cookie = "faras_admin_session=authenticated; path=/; max-age=86400; SameSite=Lax";
      }
    }
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("faras_method_admin_auth");
      localStorage.removeItem("faras_method_admin_user");
      localStorage.removeItem("apex_admin_auth");
      localStorage.removeItem("apex_admin_user");
      document.cookie = "faras_admin_session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    }
    router.push("/admin/login");
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  };

  // CSV Export for Bookings
  const exportBookingsCSV = () => {
    const headers = "ID,Name,Age,Current Weight,Height,Goal,Package,WhatsApp,Status,Date,Notes\n";
    const rows = store.bookings
      .map(
        (b) =>
          `"${b.id}","${b.name}","${b.age}","${b.currentWeight}","${b.height || ""}","${b.fitnessGoal}","${
            b.preferredPackage
          }","${b.whatsappNumber}","${b.status}","${b.createdAt}","${(b.notes || "").replace(/"/g, '""')}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `faras_method_bookings_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Bookings exported to CSV successfully.");
  };

  // Save Trainer Profile
  const handleSaveTrainer = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateTrainer(localTrainer);
    showToast("Trainer profile updated! Public sections synchronized.");
  };

  // Save Website Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateSettings(localSettings);
    showToast("Website settings updated! Public sections synchronized.");
  };

  return (
    <div className="min-h-screen bg-[#06141B] text-[#CCD0CF] flex flex-col md:flex-row">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-[#CCD0CF] text-[#06141B] px-4 py-3 rounded-xl shadow-2xl font-bold text-xs flex items-center gap-2 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 ios-glass border-r border-[#253745]/70 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand header */}
          <div className="p-5 border-b border-[#253745]/70 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#253745]/80 border border-[#CCD0CF]/20 flex items-center justify-center font-black text-sm text-[#CCD0CF] shadow-inner">
                FM
              </div>
              <div>
                <h2 className="heading-font text-sm font-bold uppercase text-[#CCD0CF] tracking-wider leading-none">
                  FARAS METHOD
                </h2>
                <span className="text-[9px] uppercase tracking-widest text-[#9BA8AB] block mt-1 font-semibold">
                  ONLINE COACHING
                </span>
              </div>
            </div>

            <Link href="/" target="_blank" title="View Public Website" className="text-[#9BA8AB] hover:text-[#CCD0CF] p-1.5 rounded-lg hover:bg-white/5 transition-colors">
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                activeTab === "overview"
                  ? "bg-[#253745] text-[#CCD0CF] border border-[#CCD0CF]/20 font-bold shadow-sm"
                  : "text-[#9BA8AB] hover:bg-white/5 hover:text-white"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab("bookings")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === "bookings"
                  ? "bg-[#253745] text-[#CCD0CF] border border-[#4A5C6A] font-bold"
                  : "text-[#9BA8AB] hover:bg-[#06141B]/40 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <CalendarCheck className="w-4 h-4" />
                <span>Bookings & Leads</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#253745] text-[#CCD0CF] border border-[#4A5C6A]">
                {store.bookings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("clients")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === "clients"
                  ? "bg-[#253745] text-[#CCD0CF] border border-[#4A5C6A] font-bold"
                  : "text-[#9BA8AB] hover:bg-[#06141B]/40 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Client Roster</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#253745] text-[#CCD0CF] border border-[#4A5C6A]">
                {store.clients.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("packages")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === "packages"
                  ? "bg-[#253745] text-[#CCD0CF] border border-[#4A5C6A] font-bold"
                  : "text-[#9BA8AB] hover:bg-[#06141B]/40 hover:text-white"
              }`}
            >
              <PackageIcon className="w-4 h-4" />
              <span>Packages & Pricing</span>
            </button>

            <button
              onClick={() => setActiveTab("transformations")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === "transformations"
                  ? "bg-[#253745] text-[#CCD0CF] border border-[#4A5C6A] font-bold"
                  : "text-[#9BA8AB] hover:bg-[#06141B]/40 hover:text-white"
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Transformations</span>
            </button>

            <button
              onClick={() => setActiveTab("trainers")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === "trainers"
                  ? "bg-[#253745] text-[#CCD0CF] border border-[#4A5C6A] font-bold"
                  : "text-[#9BA8AB] hover:bg-[#06141B]/40 hover:text-white"
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Trainer Bio & Certs</span>
            </button>

            <button
              onClick={() => setActiveTab("programs")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === "programs"
                  ? "bg-[#253745] text-[#CCD0CF] border border-[#4A5C6A] font-bold"
                  : "text-[#9BA8AB] hover:bg-[#06141B]/40 hover:text-white"
              }`}
            >
              <Dumbbell className="w-4 h-4" />
              <span>Training Programs</span>
            </button>

            <button
              onClick={() => setActiveTab("articles")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === "articles"
                  ? "bg-[#253745] text-[#CCD0CF] border border-[#4A5C6A] font-bold"
                  : "text-[#9BA8AB] hover:bg-[#06141B]/40 hover:text-white"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Fitness Tips & Blog</span>
            </button>

            <button
              onClick={() => setActiveTab("instagram")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === "instagram"
                  ? "bg-[#253745] text-[#CCD0CF] border border-[#4A5C6A] font-bold"
                  : "text-[#9BA8AB] hover:bg-[#06141B]/40 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <InstagramIcon className="w-4 h-4 text-emerald-400" />
                <span>Instagram Showcase</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#253745] text-[#CCD0CF] border border-[#4A5C6A]">
                {store.instagramPosts?.length || 0}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("testimonials")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === "testimonials"
                  ? "bg-[#253745] text-[#CCD0CF] border border-[#4A5C6A] font-bold"
                  : "text-[#9BA8AB] hover:bg-[#06141B]/40 hover:text-white"
              }`}
            >
              <Star className="w-4 h-4" />
              <span>Reviews (Internal)</span>
            </button>

            <button
              onClick={() => setActiveTab("media")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === "media"
                  ? "bg-[#253745] text-[#CCD0CF] border border-[#4A5C6A] font-bold"
                  : "text-[#9BA8AB] hover:bg-[#06141B]/40 hover:text-white"
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              <span>Website Photos &amp; Media</span>
            </button>

            <button
              onClick={() => setActiveTab("announcements")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === "announcements"
                  ? "bg-[#253745] text-[#CCD0CF] border border-[#4A5C6A] font-bold"
                  : "text-[#9BA8AB] hover:bg-[#06141B]/40 hover:text-white"
              }`}
            >
              <Megaphone className="w-4 h-4" />
              <span>Announcements</span>
            </button>

            <button
              onClick={() => setActiveTab("faqs")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === "faqs"
                  ? "bg-[#253745] text-[#CCD0CF] border border-[#4A5C6A] font-bold"
                  : "text-[#9BA8AB] hover:bg-[#06141B]/40 hover:text-white"
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>FAQs Management</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === "settings"
                  ? "bg-[#253745] text-[#CCD0CF] border border-[#4A5C6A] font-bold"
                  : "text-[#9BA8AB] hover:bg-[#06141B]/40 hover:text-white"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Website Settings & SEO</span>
            </button>
          </nav>
        </div>

        {/* Bottom user profile & logout */}
        <div className="p-4 border-t border-[#253745] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#253745] flex items-center justify-center text-xs font-bold text-[#CCD0CF]">
              FM
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{store.trainer.name}</p>
              <span className="text-[10px] text-emerald-400">Head Coach (Admin)</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-1.5 rounded-lg text-[#9BA8AB] hover:text-rose-400 hover:bg-[#06141B] transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto max-h-screen">
        {/* Top bar with quick link */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#253745]">
          <div>
            <h1 className="heading-font text-2xl sm:text-3xl font-black uppercase text-white tracking-wide">
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "bookings" && "Consultation Enquiries & Bookings"}
              {activeTab === "clients" && "Active Coaching Roster"}
              {activeTab === "packages" && "Package & Pricing Management"}
              {activeTab === "transformations" && "Client Transformation Records"}
              {activeTab === "trainers" && "Head Coach Profile & Credentials"}
              {activeTab === "programs" && "Training Disciplines & Programs"}
              {activeTab === "articles" && "Fitness Tips & Knowledge Base"}
              {activeTab === "instagram" && "Instagram Feed & Community Showcase"}
              {activeTab === "testimonials" && "Verified Client Reviews (Internal Archive)"}
              {activeTab === "faqs" && "Frequently Asked Questions (FAQs)"}
              {activeTab === "media" && "Website Photos & Live Media Control Center"}
              {activeTab === "announcements" && "Announcements & Banners"}
              {activeTab === "settings" && "Website Settings & SEO Configuration"}
            </h1>
            <p className="text-xs text-[#9BA8AB] mt-1">
              Changes saved here instantly synchronize to the live public platform.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const count = purgeBloatedLocalStorage();
                setNotification(count > 0 ? `Cleaned ${count} oversized storage entries!` : "Storage cache is clean & healthy!");
                setTimeout(() => setNotification(""), 4000);
              }}
              title="Purge bloated base64 cache from browser storage"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#9BA8AB] hover:text-white bg-[#11212D] border border-[#253745] hover:border-[#4A5C6A] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Clean Storage Cache</span>
            </button>

            <Link href="/" target="_blank">
              <Button variant="secondary" size="sm" className="gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#CCD0CF]" />
                <span>View Public Site</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="ios-glass p-5 rounded-2xl">
                <span className="text-[11px] uppercase tracking-wider text-[#9BA8AB] font-bold block mb-1">
                  Total Leads / Bookings
                </span>
                <span className="heading-font text-3xl font-black text-white">{store.bookings.length}</span>
                <span className="text-[10px] text-emerald-400 block mt-1">Direct via WhatsApp & Form</span>
              </div>

              <div className="ios-glass p-5 rounded-2xl">
                <span className="text-[11px] uppercase tracking-wider text-[#9BA8AB] font-bold block mb-1">
                  Active Packages
                </span>
                <span className="heading-font text-3xl font-black text-[#CCD0CF]">{store.packages.length}</span>
                <span className="text-[10px] text-[#9BA8AB] block mt-1">Customizable Pricing Tiers</span>
              </div>

              <div className="ios-glass p-5 rounded-2xl">
                <span className="text-[11px] uppercase tracking-wider text-[#9BA8AB] font-bold block mb-1">
                  Transformations Published
                </span>
                <span className="heading-font text-3xl font-black text-white">{store.transformations.length}</span>
                <span className="text-[10px] text-amber-400 block mt-1">Interactive Before/After</span>
              </div>

              <div className="ios-glass p-5 rounded-2xl">
                <span className="text-[11px] uppercase tracking-wider text-[#9BA8AB] font-bold block mb-1">
                  Active Clients Enrolled
                </span>
                <span className="heading-font text-3xl font-black text-emerald-400">{store.clients.length}</span>
                <span className="text-[10px] text-sky-400 block mt-1">Dedicated 1-on-1 Cohort</span>
              </div>
            </div>

            {/* Recent Leads Table */}
            <div className="ios-glass p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="heading-font text-lg font-bold text-white uppercase">
                    Recent Consultation Applications
                  </h3>
                  <p className="text-xs text-[#9BA8AB]">Prospective clients waiting for WhatsApp response</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setActiveTab("bookings")}>
                  View All Leads
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#253745] text-[#9BA8AB] uppercase tracking-wider text-[10px]">
                      <th className="pb-3">Client</th>
                      <th className="pb-3">Goal</th>
                      <th className="pb-3">Package</th>
                      <th className="pb-3">WhatsApp</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#253745] text-[#CCD0CF]">
                    {store.bookings.slice(0, 5).map((lead) => (
                      <tr key={lead.id} className="hover:bg-[#06141B]/30">
                        <td className="py-3 font-semibold text-white">{lead.name}</td>
                        <td className="py-3 text-[#9BA8AB]">{lead.fitnessGoal}</td>
                        <td className="py-3 text-[#CCD0CF]">{lead.preferredPackage}</td>
                        <td className="py-3 font-mono text-[11px]">{lead.whatsappNumber}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              lead.status === "pending"
                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                : lead.status === "enrolled"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                            }`}
                          >
                            {lead.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <a
                            href={`https://wa.me/${lead.whatsappNumber.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-[#25D366] hover:underline"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PACKAGES & PRICING */}
        {activeTab === "packages" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="heading-font text-lg font-bold text-white uppercase">
                  Coaching Packages &amp; Pricing (INR ₹)
                </h3>
                <p className="text-xs text-[#9BA8AB]">
                  Genuine coaching tiers extracted from reference. Pricing, duration and perks synchronize live.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#9BA8AB] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search packages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-lg bg-[#11212D] border border-[#253745] text-xs text-white placeholder-[#9BA8AB]/50 focus:outline-none focus:border-[#CCD0CF]"
                  />
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  className="gap-1.5 shrink-0"
                  onClick={() => {
                    setIsNewPackage(true);
                    setEditingPackage({
                      id: "pkg-" + Date.now(),
                      slug: "new-custom-package",
                      name: "New Custom Package",
                      tagline: "Tailored coaching program",
                      price: 999,
                      originalPrice: 1499,
                      isPublished: true,
                      imageUrl: "",
                      currency: "INR",
                      duration: "Per month",
                      isPopular: false,
                      badge: "Custom Tier",
                      highlight: "Guaranteed Results",
                      rateNote: "₹999 / month",
                      whatsappMessage: "I want to start the new package for ₹999",
                      description: "Comprehensive coaching protocol designed for optimal client results.",
                      features: [
                        "Customized workout plan with ongoing adjustments",
                        "Customized diet plan with ongoing adjustments",
                        "Weekly check-ins & Hevy app tracking",
                        "Video form correction & full WhatsApp support",
                      ],
                      trainingInclusions: ["Periodized program", "Form reviews"],
                      nutritionGuidance: ["Macro calculations"],
                      progressTracking: ["Weekly check-in"],
                      coachingSupport: ["WhatsApp text"],
                      syllabus: [],
                    });
                  }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Package</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {store.packages
                .filter(
                  (pkg) =>
                    !searchQuery ||
                    pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    pkg.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (pkg.features || []).some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()))
                )
                .map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`p-6 rounded-2xl bg-[#11212D] border ${
                      pkg.isPopular ? "border-[#CCD0CF]" : "border-[#253745]"
                    } flex flex-col justify-between`}
                  >
                    <div>
                      {pkg.imageUrl && (
                        <div className="relative w-full h-28 rounded-xl overflow-hidden mb-3 border border-[#253745]">
                          <img
                            src={pkg.imageUrl}
                            alt={pkg.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="heading-font text-xl font-bold text-white uppercase">
                            {pkg.name}
                          </h4>
                          {pkg.badge && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#253745] text-[#CCD0CF] border border-[#4A5C6A]">
                              {pkg.badge}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const updated = { ...pkg, isPublished: pkg.isPublished === false ? true : false };
                              store.updatePackage(updated);
                              showToast(`"${pkg.name}" is now ${updated.isPublished ? "Published" : "Hidden (Draft)"}`);
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                              pkg.isPublished === false
                                ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            }`}
                            title="Click to toggle live website visibility"
                          >
                            {pkg.isPublished === false ? "Draft (Hidden)" : "Published"}
                          </button>
                          {pkg.isPopular && <Badge variant="popular">Most Popular</Badge>}
                        </div>
                      </div>

                      <p className="text-xs text-[#9BA8AB] mb-4">{pkg.tagline}</p>

                      <div className="flex items-baseline justify-between mb-4 p-3 rounded-lg bg-[#06141B] border border-[#253745]">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm font-bold text-[#CCD0CF]">
                            {pkg.currency === "USD" ? "$" : "₹"}
                          </span>
                          <span className="heading-font text-3xl font-black text-white">
                            {pkg.price.toLocaleString("en-IN")}
                          </span>
                          {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                            <span className="text-xs line-through text-[#9BA8AB]/70 font-semibold ml-1">
                              {pkg.currency === "USD" ? "$" : "₹"}{pkg.originalPrice.toLocaleString("en-IN")}
                            </span>
                          )}
                          <span className="text-xs text-[#9BA8AB] ml-1">/ {pkg.duration}</span>
                        </div>
                        {pkg.rateNote && (
                          <span className="text-xs text-[#CCD0CF] font-semibold">
                            {pkg.rateNote}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1.5 text-xs text-[#CCD0CF] mb-4">
                        {pkg.features.slice(0, 4).map((f, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <CheckCircle className="w-3.5 h-3.5 text-[#CCD0CF] shrink-0" />
                            <span className="truncate">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#253745] flex items-center justify-between gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setIsNewPackage(false);
                          setEditingPackage(pkg);
                        }}
                        className="gap-1 text-xs"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#CCD0CF]" />
                        <span>Edit Details &amp; Price</span>
                      </Button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            const duplicated: Package = {
                              ...pkg,
                              id: `pkg-${Date.now()}`,
                              name: `${pkg.name} (Copy)`,
                              slug: `${pkg.slug}-copy-${Date.now().toString().slice(-4)}`,
                              isPopular: false,
                            };
                            store.addPackage(duplicated);
                            showToast(`Duplicated package "${pkg.name}"`);
                          }}
                          className="p-2 rounded text-[#9BA8AB] hover:text-[#CCD0CF] hover:bg-[#06141B]"
                          title="Duplicate Package"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            openConfirm(
                              `Delete Package "${pkg.name}"?`,
                              `Are you sure you want to delete "${pkg.name}"? It will be immediately removed from the live website and booking options.`,
                              () => {
                                store.deletePackage(pkg.id);
                                showToast(`Package "${pkg.name}" deleted.`);
                              }
                            );
                          }}
                          className="p-2 rounded text-[#9BA8AB] hover:text-rose-400 hover:bg-[#06141B]"
                          title="Delete Package"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Edit / Create Package Modal */}
            {editingPackage && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                <div className="bg-[#11212D] border border-[#4A5C6A] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
                  <button
                    onClick={() => setEditingPackage(null)}
                    className="absolute top-4 right-4 p-1.5 rounded-lg text-[#9BA8AB] hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <h3 className="heading-font text-xl font-bold text-white uppercase mb-4">
                    {isNewPackage ? "Create Package" : `Edit ${editingPackage.name}`}
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">
                        Package Name
                      </label>
                      <input
                        type="text"
                        value={editingPackage.name}
                        onChange={(e) =>
                          setEditingPackage({ ...editingPackage, name: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-white"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">
                          Price (₹ INR)
                        </label>
                        <input
                          type="number"
                          value={editingPackage.price}
                          onChange={(e) =>
                            setEditingPackage({ ...editingPackage, price: Number(e.target.value) })
                          }
                          className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">
                          Original Price (Discount MRP)
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 799"
                          value={editingPackage.originalPrice || ""}
                          onChange={(e) =>
                            setEditingPackage({
                              ...editingPackage,
                              originalPrice: e.target.value ? Number(e.target.value) : undefined,
                            })
                          }
                          className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">
                          Duration (e.g. Per month)
                        </label>
                        <input
                          type="text"
                          value={editingPackage.duration}
                          onChange={(e) =>
                            setEditingPackage({ ...editingPackage, duration: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">
                          Badge
                        </label>
                        <input
                          type="text"
                          placeholder="Premium Tier"
                          value={editingPackage.badge || ""}
                          onChange={(e) =>
                            setEditingPackage({ ...editingPackage, badge: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">
                          Highlight
                        </label>
                        <input
                          type="text"
                          placeholder="Guaranteed Results"
                          value={editingPackage.highlight || ""}
                          onChange={(e) =>
                            setEditingPackage({ ...editingPackage, highlight: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">
                          Rate Note
                        </label>
                        <input
                          type="text"
                          placeholder="~₹833/month"
                          value={editingPackage.rateNote || ""}
                          onChange={(e) =>
                            setEditingPackage({ ...editingPackage, rateNote: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">
                        WhatsApp Booking Message
                      </label>
                      <input
                        type="text"
                        placeholder="I want to start the Base plan for ₹499"
                        value={editingPackage.whatsappMessage || ""}
                        onChange={(e) =>
                          setEditingPackage({ ...editingPackage, whatsappMessage: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">
                        Tagline / Summary
                      </label>
                      <input
                        type="text"
                        value={editingPackage.tagline}
                        onChange={(e) =>
                          setEditingPackage({ ...editingPackage, tagline: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">
                        Detailed Description
                      </label>
                      <textarea
                        rows={2}
                        value={editingPackage.description || ""}
                        onChange={(e) =>
                          setEditingPackage({ ...editingPackage, description: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">
                        Features (One per line)
                      </label>
                      <textarea
                        rows={4}
                        value={(editingPackage.features || []).join("\n")}
                        onChange={(e) =>
                          setEditingPackage({
                            ...editingPackage,
                            features: e.target.value.split("\n").filter((line) => line.trim().length > 0),
                          })
                        }
                        className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-white"
                      />
                    </div>

                    <div>
                      <ImageUploadField
                        label="Package Cover Photo (Optional)"
                        section={`package-${editingPackage.id || "new"}`}
                        value={editingPackage.imageUrl || ""}
                        onChange={(url) => setEditingPackage({ ...editingPackage, imageUrl: url })}
                        onRemove={() => setEditingPackage({ ...editingPackage, imageUrl: "" })}
                        previewAspect="video"
                        helpText="Upload a package banner or photo from your computer."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isPopularToggle"
                          checked={!!editingPackage.isPopular}
                          onChange={(e) =>
                            setEditingPackage({ ...editingPackage, isPopular: e.target.checked })
                          }
                          className="w-4 h-4 accent-[#CCD0CF]"
                        />
                        <label htmlFor="isPopularToggle" className="text-xs text-[#CCD0CF] font-medium">
                          Feature with &ldquo;Most Popular&rdquo; badge
                        </label>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isPublishedPackageToggle"
                          checked={editingPackage.isPublished !== false}
                          onChange={(e) =>
                            setEditingPackage({ ...editingPackage, isPublished: e.target.checked })
                          }
                          className="w-4 h-4 accent-[#CCD0CF]"
                        />
                        <label htmlFor="isPublishedPackageToggle" className="text-xs text-[#CCD0CF] font-medium">
                          Published on live website
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#253745]">
                      <Button variant="ghost" size="sm" onClick={() => setEditingPackage(null)}>
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          if (isNewPackage) {
                            store.addPackage(editingPackage);
                            showToast(`Created package "${editingPackage.name}"`);
                          } else {
                            store.updatePackage(editingPackage);
                            showToast(`Updated package "${editingPackage.name}"`);
                          }
                          setEditingPackage(null);
                        }}
                      >
                        Save &amp; Apply Changes
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BOOKINGS & LEADS */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="heading-font text-lg font-bold text-white uppercase">
                  All Client Inquiries & WhatsApp Leads
                </h3>
                <p className="text-xs text-[#9BA8AB]">
                  Submitted through the public consultation form and WhatsApp book now buttons.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="secondary" size="sm" onClick={exportBookingsCSV} className="gap-2">
                  <Download className="w-4 h-4 text-[#CCD0CF]" />
                  <span>Export CSV</span>
                </Button>
              </div>
            </div>

            <div className="bg-[#11212D] border border-[#253745] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#06141B] border-b border-[#253745] text-[#9BA8AB] uppercase tracking-wider text-[10px]">
                      <th className="p-4">Name & Age</th>
                      <th className="p-4">Metrics (Weight / Ht)</th>
                      <th className="p-4">Goal</th>
                      <th className="p-4">Package</th>
                      <th className="p-4">WhatsApp Contact</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#253745] text-[#CCD0CF]">
                    {store.bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-[#06141B]/30">
                        <td className="p-4">
                          <span className="font-bold text-white block">{booking.name}</span>
                          <span className="text-[10px] text-[#9BA8AB]">{booking.age} yrs old</span>
                        </td>

                        <td className="p-4 font-mono text-[11px]">
                          <div>{booking.currentWeight}</div>
                          {booking.height && <div className="text-[10px] text-[#9BA8AB]">{booking.height}</div>}
                        </td>

                        <td className="p-4 text-[#9BA8AB]">{booking.fitnessGoal}</td>

                        <td className="p-4 text-[#CCD0CF] font-semibold">{booking.preferredPackage}</td>

                        <td className="p-4 font-mono">
                          <a
                            href={`https://wa.me/${booking.whatsappNumber.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#25D366] hover:underline flex items-center gap-1"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>{booking.whatsappNumber}</span>
                          </a>
                        </td>

                        <td className="p-4">
                          <select
                            value={booking.status}
                            onChange={(e) => {
                              store.updateBookingStatus(
                                booking.id,
                                e.target.value as BookingLead["status"]
                              );
                              showToast(`Lead ${booking.name} status updated to ${e.target.value}`);
                            }}
                            className="bg-[#06141B] border border-[#253745] rounded px-2 py-1 text-[11px] text-white"
                          >
                            <option value="pending">Pending</option>
                            <option value="contacted">Contacted</option>
                            <option value="enrolled">Enrolled</option>
                            <option value="declined">Declined</option>
                          </select>
                        </td>

                        <td className="p-4 text-right">
                          <a
                            href={`https://wa.me/${booking.whatsappNumber.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="whatsapp" size="sm" className="text-[10px] py-1 px-2.5">
                              Message
                            </Button>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CLIENT ROSTER */}
        {activeTab === "clients" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="heading-font text-lg font-bold text-white uppercase">
                  Active Client Roster
                </h3>
                <p className="text-xs text-[#9BA8AB]">
                  Direct mentorship directory for active, paused, and graduated clients.
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                className="gap-1.5"
                onClick={() => {
                  setIsNewClient(true);
                  setEditingClient({
                    id: "client-" + Date.now(),
                    fullName: "",
                    email: "",
                    whatsappNumber: "",
                    enrolledPackage: store.packages[1]?.name || "Premium Plan",
                    status: "active",
                    enrolledDate: new Date().toISOString().slice(0, 10),
                    notes: "",
                  });
                }}
              >
                <Plus className="w-4 h-4" />
                <span>Enroll New Client</span>
              </Button>
            </div>

            <div className="bg-[#11212D] border border-[#253745] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#06141B] border-b border-[#253745] text-[#9BA8AB] uppercase tracking-wider text-[10px]">
                      <th className="p-4">Client Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">WhatsApp</th>
                      <th className="p-4">Active Plan</th>
                      <th className="p-4">Enrolled Since</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#253745] text-[#CCD0CF]">
                    {store.clients.map((client) => (
                      <tr key={client.id} className="hover:bg-[#06141B]/30">
                        <td className="p-4 font-bold text-white">{client.fullName}</td>
                        <td className="p-4 text-[#9BA8AB]">{client.email}</td>
                        <td className="p-4 font-mono">{client.whatsappNumber}</td>
                        <td className="p-4 text-[#CCD0CF] font-semibold">{client.enrolledPackage}</td>
                        <td className="p-4 text-[#9BA8AB]">{formatDate(client.enrolledDate)}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              client.status === "active"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            }`}
                          >
                            {client.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setIsNewClient(false);
                              setEditingClient(client);
                            }}
                            className="p-1.5 text-[#CCD0CF] hover:text-white"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remove client ${client.fullName}?`)) {
                                store.deleteClient(client.id);
                                showToast(`Client ${client.fullName} removed.`);
                              }
                            }}
                            className="p-1.5 text-rose-400 hover:text-rose-300"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Client Edit / Create Modal */}
            {editingClient && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                <div className="bg-[#11212D] border border-[#4A5C6A] rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
                  <button onClick={() => setEditingClient(null)} className="absolute top-4 right-4 text-[#9BA8AB] hover:text-white">
                    <X className="w-5 h-5" />
                  </button>

                  <h3 className="heading-font text-xl font-bold text-white uppercase mb-4">
                    {isNewClient ? "Enroll Client" : `Edit ${editingClient.fullName}`}
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">Full Name</label>
                      <input
                        type="text"
                        value={editingClient.fullName}
                        onChange={(e) => setEditingClient({ ...editingClient, fullName: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">Email</label>
                      <input
                        type="email"
                        value={editingClient.email}
                        onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">WhatsApp</label>
                      <input
                        type="text"
                        value={editingClient.whatsappNumber}
                        onChange={(e) => setEditingClient({ ...editingClient, whatsappNumber: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">Enrolled Package</label>
                      <select
                        value={editingClient.enrolledPackage}
                        onChange={(e) => setEditingClient({ ...editingClient, enrolledPackage: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-white"
                      >
                        {store.packages.map((p) => (
                          <option key={p.id} value={p.name}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">Status</label>
                      <select
                        value={editingClient.status}
                        onChange={(e) =>
                          setEditingClient({ ...editingClient, status: e.target.value as ClientRecord["status"] })
                        }
                        className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-white"
                      >
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#253745]">
                      <Button variant="ghost" size="sm" onClick={() => setEditingClient(null)}>
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          if (isNewClient) {
                            store.addClient(editingClient);
                            showToast(`Client ${editingClient.fullName} enrolled.`);
                          } else {
                            store.updateClient(editingClient);
                            showToast(`Client ${editingClient.fullName} updated.`);
                          }
                          setEditingClient(null);
                        }}
                      >
                        Save Client
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: TRANSFORMATIONS */}
        {/* TAB 5: TRANSFORMATIONS */}
        {activeTab === "transformations" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="heading-font text-lg font-bold text-white uppercase">
                  Client Transformations
                </h3>
                <p className="text-xs text-[#9BA8AB]">
                  Manage before/after photos and client metrics shown in the public slider.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#9BA8AB] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search transformations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-lg bg-[#11212D] border border-[#253745] text-xs text-white placeholder-[#9BA8AB]/50 focus:outline-none focus:border-[#CCD0CF]"
                  />
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  className="gap-1.5 shrink-0"
                  onClick={() => {
                    setIsNewTransformation(true);
                    setEditingTransformation({
                      id: "trans-" + Date.now(),
                      clientName: "New Client",
                      age: 28,
                      startingWeight: 88,
                      currentWeight: 74,
                      weightDiff: 14,
                      weightUnit: "kg",
                      duration: "16 Weeks",
                      fitnessGoal: "Body Recomposition",
                      story: "Dedicated adherence to progressive training split and personalized nutrition targets.",
                      beforeImage: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80",
                      afterImage: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
                      beforeFit: { mode: "auto", zoom: 1, panX: 50, panY: 50 },
                      afterFit: { mode: "auto", zoom: 1, panX: 50, panY: 50 },
                      isFeatured: true,
                    });
                  }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Transformation</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {store.transformations
                .filter(
                  (trans) =>
                    !searchQuery ||
                    trans.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    trans.fitnessGoal.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    trans.story.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((trans) => (
                  <div key={trans.id} className="p-5 rounded-2xl bg-[#11212D] border border-[#253745] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="heading-font text-base font-bold text-white">{trans.clientName}</h4>
                        <Badge variant="outline" className="text-[10px]">
                          -{trans.weightDiff} {trans.weightUnit}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-[#06141B] border border-[#4A5C6A]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={trans.beforeImage} alt="Before" className="w-full h-full object-cover" />
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-bold text-amber-400">
                            BEFORE
                          </span>
                        </div>
                        <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-[#06141B] border border-[#4A5C6A]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={trans.afterImage} alt="After" className="w-full h-full object-cover" />
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-bold text-emerald-400">
                            AFTER
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-[#9BA8AB] line-clamp-2 italic mb-2">
                        &ldquo;{trans.story}&rdquo;
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#253745] flex items-center justify-between">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setIsNewTransformation(false);
                          setEditingTransformation(trans);
                        }}
                        className="text-xs"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#CCD0CF]" />
                        <span>Edit</span>
                      </Button>

                      <button
                        onClick={() => {
                          openConfirm(
                            `Delete Transformation for ${trans.clientName}?`,
                            `Are you sure you want to delete this transformation record? This will immediately remove their before/after comparison from the public transformation gallery.`,
                            () => {
                              store.deleteTransformation(trans.id);
                              showToast("Transformation record deleted.");
                            }
                          );
                        }}
                        className="p-1.5 rounded text-[#9BA8AB] hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {/* Edit / Add Transformation Modal with Advanced Photo Fit & Live Preview */}
            {editingTransformation && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                <div className="bg-[#11212D] border border-[#4A5C6A] rounded-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative space-y-6">
                  <button
                    onClick={() => setEditingTransformation(null)}
                    className="absolute top-4 right-4 p-2 rounded-lg text-[#9BA8AB] hover:text-white hover:bg-[#06141B] transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div>
                    <h3 className="heading-font text-2xl font-bold text-white uppercase tracking-wide">
                      {isNewTransformation ? "Add Transformation Entry" : `Edit Transformation — ${editingTransformation.clientName}`}
                    </h3>
                    <p className="text-xs text-[#9BA8AB] mt-1">
                      Upload photos, adjust framing, zoom and positioning, and preview the live card before saving.
                    </p>
                  </div>

                  <div className="space-y-6 text-xs">
                    {/* Basic Client Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-xl bg-[#06141B] border border-[#253745]">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">
                          Client Display Name
                        </label>
                        <input
                          type="text"
                          value={editingTransformation.clientName}
                          onChange={(e) =>
                            setEditingTransformation({
                              ...editingTransformation,
                              clientName: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded bg-[#11212D] border border-[#253745] text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">
                          Fitness Goal
                        </label>
                        <input
                          type="text"
                          value={editingTransformation.fitnessGoal}
                          onChange={(e) =>
                            setEditingTransformation({
                              ...editingTransformation,
                              fitnessGoal: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded bg-[#11212D] border border-[#253745] text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">
                          Duration
                        </label>
                        <input
                          type="text"
                          value={editingTransformation.duration}
                          onChange={(e) =>
                            setEditingTransformation({
                              ...editingTransformation,
                              duration: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded bg-[#11212D] border border-[#253745] text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">
                          Age (Years)
                        </label>
                        <input
                          type="number"
                          value={editingTransformation.age || 28}
                          onChange={(e) =>
                            setEditingTransformation({
                              ...editingTransformation,
                              age: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 rounded bg-[#11212D] border border-[#253745] text-white"
                        />
                      </div>

                      <div className="sm:col-span-2 lg:col-span-4 grid grid-cols-3 gap-3 pt-2 border-t border-[#253745]">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">
                            Starting Weight ({editingTransformation.weightUnit || "kg"})
                          </label>
                          <input
                            type="number"
                            value={editingTransformation.startingWeight}
                            onChange={(e) =>
                              setEditingTransformation({
                                ...editingTransformation,
                                startingWeight: Number(e.target.value),
                                weightDiff: Math.abs(Number(e.target.value) - editingTransformation.currentWeight),
                              })
                            }
                            className="w-full px-3 py-2 rounded bg-[#11212D] border border-[#253745] text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">
                            Current Weight ({editingTransformation.weightUnit || "kg"})
                          </label>
                          <input
                            type="number"
                            value={editingTransformation.currentWeight}
                            onChange={(e) =>
                              setEditingTransformation({
                                ...editingTransformation,
                                currentWeight: Number(e.target.value),
                                weightDiff: Math.abs(editingTransformation.startingWeight - Number(e.target.value)),
                              })
                            }
                            className="w-full px-3 py-2 rounded bg-[#11212D] border border-[#253745] text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">
                            Calculated Difference
                          </label>
                          <div className="w-full px-3 py-2 rounded bg-[#11212D]/60 border border-[#253745] text-emerald-400 font-bold">
                            {editingTransformation.startingWeight > editingTransformation.currentWeight ? "-" : "+"}
                            {editingTransformation.weightDiff} {editingTransformation.weightUnit || "kg"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* PHOTO ADJUSTMENT SECTION (BEFORE & AFTER INDEPENDENT ADJUSTERS) */}
                    <div>
                      <div className="mb-3">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                          Photo Adjustment &amp; Framing Controls
                        </h4>
                        <p className="text-[11px] text-[#9BA8AB]">
                          Choose Auto Fit (unclipped full body), Crop to Fit (3:4 ratio), or Manual Position (drag &amp; zoom) independently for each photo.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <TransformationPhotoAdjuster
                          label="Before Photo Adjustment"
                          type="before"
                          imageUrl={editingTransformation.beforeImage}
                          onImageChange={(url) => setEditingTransformation({ ...editingTransformation, beforeImage: url })}
                          fit={editingTransformation.beforeFit || DEFAULT_FIT_SETTINGS}
                          onFitChange={(fit) => setEditingTransformation({ ...editingTransformation, beforeFit: fit })}
                          weightLabel={`${editingTransformation.startingWeight}`}
                          weightUnit={editingTransformation.weightUnit}
                          section={`transformation-${editingTransformation.id || "new"}`}
                        />

                        <TransformationPhotoAdjuster
                          label="After Photo Adjustment"
                          type="after"
                          imageUrl={editingTransformation.afterImage}
                          onImageChange={(url) => setEditingTransformation({ ...editingTransformation, afterImage: url })}
                          fit={editingTransformation.afterFit || DEFAULT_FIT_SETTINGS}
                          onFitChange={(fit) => setEditingTransformation({ ...editingTransformation, afterFit: fit })}
                          weightLabel={`${editingTransformation.currentWeight}`}
                          weightUnit={editingTransformation.weightUnit}
                          section={`transformation-${editingTransformation.id || "new"}`}
                        />
                      </div>
                    </div>

                    {/* LIVE CARD PREVIEW */}
                    <div className="space-y-2 pt-2">
                      <label className="block text-[11px] uppercase font-bold text-[#CCD0CF]">
                        Live Transformation Card Preview
                      </label>
                      <TransformationCardLivePreview transformation={editingTransformation} />
                    </div>

                    {/* Client Story */}
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">
                        Client Story / Testimonial Quote
                      </label>
                      <textarea
                        rows={3}
                        value={editingTransformation.story}
                        onChange={(e) =>
                          setEditingTransformation({
                            ...editingTransformation,
                            story: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-white"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#253745]">
                      <Button variant="ghost" size="sm" onClick={() => setEditingTransformation(null)}>
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          if (isNewTransformation) {
                            store.addTransformation(editingTransformation);
                            showToast("New transformation published to public site!");
                          } else {
                            store.updateTransformation(editingTransformation);
                            showToast("Transformation updated.");
                          }
                          setEditingTransformation(null);
                        }}
                      >
                        Save Transformation Record
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: TRAINING PROGRAMS */}
        {activeTab === "programs" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="heading-font text-lg font-bold text-white uppercase">
                  Training Disciplines &amp; Methodologies
                </h3>
                <p className="text-xs text-[#9BA8AB]">
                  Displayed in the public Training section with individual biomechanical highlights.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#9BA8AB] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search programs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-lg bg-[#11212D] border border-[#253745] text-xs text-white placeholder-[#9BA8AB]/50 focus:outline-none focus:border-[#CCD0CF]"
                  />
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  className="gap-1.5 shrink-0"
                  onClick={() => {
                    setIsNewService(true);
                    setEditingService({
                      id: "svc-" + Date.now(),
                      title: "New Training Discipline",
                      tagline: "Custom targeted protocol",
                      description: "High-yield biomechanically sound resistance training programming.",
                      iconName: "Dumbbell",
                      highlights: ["Custom exercise matrix", "Progressive overload"],
                      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
                    });
                  }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Program</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {store.services
                .filter(
                  (svc) =>
                    !searchQuery ||
                    svc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    svc.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    svc.description.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((svc) => (
                  <div key={svc.id} className="p-5 rounded-2xl bg-[#11212D] border border-[#253745] flex flex-col justify-between">
                    <div>
                      <div className="relative h-36 w-full rounded-xl overflow-hidden mb-3 border border-[#4A5C6A]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={svc.image} alt={svc.title} className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 p-1.5 rounded bg-black/70 text-[#CCD0CF]">
                          <Dumbbell className="w-4 h-4" />
                        </div>
                      </div>

                      <h4 className="heading-font text-lg font-bold text-white">{svc.title}</h4>
                      <p className="text-xs text-[#CCD0CF] font-semibold mb-2">{svc.tagline}</p>
                      <p className="text-xs text-[#9BA8AB] line-clamp-2 leading-relaxed mb-3">{svc.description}</p>
                    </div>

                    <div className="pt-3 border-t border-[#253745] flex items-center justify-between">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setIsNewService(false);
                          setEditingService(svc);
                        }}
                        className="text-xs"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#CCD0CF]" />
                        <span>Edit</span>
                      </Button>

                      <button
                        onClick={() => {
                          openConfirm(
                            `Delete Program "${svc.title}"?`,
                            `Are you sure you want to delete "${svc.title}"? This program will be removed from the public website immediately.`,
                            () => {
                              store.deleteService(svc.id);
                              showToast(`Program "${svc.title}" deleted.`);
                            }
                          );
                        }}
                        className="p-1.5 rounded text-[#9BA8AB] hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {/* Edit / Add Service Modal */}
            {editingService && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                <div className="bg-[#11212D] border border-[#4A5C6A] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
                  <button onClick={() => setEditingService(null)} className="absolute top-4 right-4 text-[#9BA8AB] hover:text-white">
                    <X className="w-5 h-5" />
                  </button>

                  <h3 className="heading-font text-xl font-bold text-white uppercase mb-4">
                    {isNewService ? "Add Program" : `Edit ${editingService.title}`}
                  </h3>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">Title</label>
                      <input
                        type="text"
                        value={editingService.title}
                        onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">Tagline</label>
                      <input
                        type="text"
                        value={editingService.tagline}
                        onChange={(e) => setEditingService({ ...editingService, tagline: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-white"
                      />
                    </div>

                    <ImageUploadField
                      label="Program Cover Image"
                      value={editingService.image}
                      onChange={(url) => setEditingService({ ...editingService, image: url })}
                      previewAspect="video"
                      helpText="Upload a local image file or enter an image URL. Live preview updates immediately."
                    />

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">Description</label>
                      <textarea
                        rows={3}
                        value={editingService.description}
                        onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-white"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#253745]">
                      <Button variant="ghost" size="sm" onClick={() => setEditingService(null)}>
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          if (isNewService) {
                            store.addService(editingService);
                            showToast(`Program "${editingService.title}" created.`);
                          } else {
                            store.updateService(editingService);
                            showToast(`Program "${editingService.title}" updated.`);
                          }
                          setEditingService(null);
                        }}
                      >
                        Save Program
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 7: FITNESS ARTICLES */}
        {activeTab === "articles" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="heading-font text-lg font-bold text-white uppercase">
                  Fitness Tips &amp; Guides
                </h3>
                <p className="text-xs text-[#9BA8AB]">
                  Published articles appear immediately in the public Fitness Tips section.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#9BA8AB] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-lg bg-[#11212D] border border-[#253745] text-xs text-white placeholder-[#9BA8AB]/50 focus:outline-none focus:border-[#CCD0CF]"
                  />
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  className="gap-1.5 shrink-0"
                  onClick={() => {
                    setIsNewArticle(true);
                    setEditingArticle({
                      id: "art-" + Date.now(),
                      slug: "new-article-guide-" + Date.now(),
                      title: "New Training or Nutrition Guide",
                      category: "workout",
                      readTime: "5 min read",
                      publishedAt: new Date().toISOString().slice(0, 10),
                      author: "Coach Faras",
                      excerpt: "A brief summary of the scientific insights covered.",
                      coverImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
                      content: "Full guide text here...",
                    });
                  }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish New Guide</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {store.articles
                .filter(
                  (art) =>
                    !searchQuery ||
                    art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    art.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    art.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((art) => (
                  <div key={art.id} className="p-5 rounded-2xl bg-[#11212D] border border-[#253745] flex flex-col justify-between">
                    <div>
                      <div className="relative h-36 w-full rounded-xl overflow-hidden mb-3 border border-[#4A5C6A]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={art.coverImage} alt={art.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-black/80 text-[#CCD0CF]">
                          {art.category}
                        </span>
                      </div>

                      <h4 className="heading-font text-base font-bold text-white line-clamp-2 mb-1">{art.title}</h4>
                      <span className="text-[10px] text-[#9BA8AB] block mb-2">{art.readTime} • {formatDate(art.publishedAt)}</span>
                      <p className="text-xs text-[#9BA8AB] line-clamp-2 leading-relaxed">{art.excerpt}</p>
                    </div>

                    <div className="pt-3 border-t border-[#253745] flex items-center justify-between">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setIsNewArticle(false);
                          setEditingArticle(art);
                        }}
                        className="text-xs"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#CCD0CF]" />
                        <span>Edit</span>
                      </Button>

                      <button
                        onClick={() => {
                          openConfirm(
                            `Delete Article "${art.title}"?`,
                            `Are you sure you want to delete this fitness article? This action cannot be undone.`,
                            () => {
                              store.deleteArticle(art.id);
                              showToast("Article deleted.");
                            }
                          );
                        }}
                        className="p-1.5 rounded text-[#9BA8AB] hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {/* Edit / Add Article Modal */}
            {editingArticle && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                <div className="bg-[#11212D] border border-[#4A5C6A] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
                  <button onClick={() => setEditingArticle(null)} className="absolute top-4 right-4 text-[#9BA8AB] hover:text-white">
                    <X className="w-5 h-5" />
                  </button>

                  <h3 className="heading-font text-xl font-bold text-white uppercase mb-4">
                    {isNewArticle ? "Publish Guide" : `Edit ${editingArticle.title}`}
                  </h3>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">Title</label>
                      <input
                        type="text"
                        value={editingArticle.title}
                        onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">Category</label>
                        <select
                          value={editingArticle.category}
                          onChange={(e) =>
                            setEditingArticle({ ...editingArticle, category: e.target.value as Article["category"] })
                          }
                          className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-white"
                        >
                          <option value="workout">Workout</option>
                          <option value="nutrition">Nutrition</option>
                          <option value="weight-loss">Weight Loss</option>
                          <option value="muscle-building">Muscle Building</option>
                          <option value="recovery">Recovery</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">Read Time</label>
                        <input
                          type="text"
                          value={editingArticle.readTime}
                          onChange={(e) => setEditingArticle({ ...editingArticle, readTime: e.target.value })}
                          className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-white"
                        />
                      </div>
                    </div>

                    <ImageUploadField
                      label="Cover Photograph"
                      value={editingArticle.coverImage}
                      onChange={(url) => setEditingArticle({ ...editingArticle, coverImage: url })}
                      previewAspect="video"
                      helpText="Upload a local image file or enter an image URL. Live preview updates immediately."
                    />

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">Excerpt</label>
                      <textarea
                        rows={2}
                        value={editingArticle.excerpt}
                        onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">Full Article Body</label>
                      <textarea
                        rows={6}
                        value={editingArticle.content}
                        onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-white"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#253745]">
                      <Button variant="ghost" size="sm" onClick={() => setEditingArticle(null)}>
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          if (isNewArticle) {
                            store.addArticle(editingArticle);
                            showToast("Article published!");
                          } else {
                            store.updateArticle(editingArticle);
                            showToast("Article updated.");
                          }
                          setEditingArticle(null);
                        }}
                      >
                        Publish Article
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 8: INSTAGRAM SHOWCASE */}
        {activeTab === "instagram" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="heading-font text-lg font-bold text-white uppercase flex items-center gap-2">
                  <InstagramIcon className="w-5 h-5 text-emerald-400" />
                  <span>Instagram Community Showcase</span>
                </h3>
                <p className="text-xs text-[#9BA8AB] mt-0.5">
                  Manage posts displayed on the live public Instagram showcase. Upload photos from your computer, edit engagement stats, reorder tiles, and customize post links.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => {
                    setIsNewInstaPost(true);
                    setEditingInstaPost({
                      id: "post-" + Date.now(),
                      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
                      likes: "1,500",
                      comments: "75",
                      caption: "Consistency over intensity. Train smart, stay disciplined, and track every session with Coach Faras.",
                      postUrl: "https://www.instagram.com/itsfarasu/",
                      isPublished: true,
                    });
                  }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Instagram Post</span>
                </Button>
              </div>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(store.instagramPosts || []).map((post, idx) => {
                const totalPosts = store.instagramPosts.length;
                return (
                  <div
                    key={post.id}
                    className="ios-glass p-5 rounded-2xl flex flex-col justify-between space-y-4 border border-[#253745]/70"
                  >
                    <div>
                      {/* Photo Preview Tile with Order Badge & Status */}
                      <div className="relative aspect-square rounded-xl overflow-hidden mb-3 border border-[#253745] bg-[#06141B] group">
                        <img
                          src={post.image}
                          alt="Instagram post preview"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#06141B]/80 backdrop-blur-md text-[#CCD0CF] border border-[#CCD0CF]/20">
                          #{idx + 1}
                        </div>
                        <div className="absolute top-2 right-2">
                          <button
                            onClick={() => {
                              const updated = { ...post, isPublished: post.isPublished === false ? true : false };
                              store.updateInstagramPost(updated);
                              showToast(`Post #${idx + 1} ${updated.isPublished ? "published" : "hidden from live site"}`);
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                              post.isPublished === false
                                ? "bg-rose-500/80 text-white"
                                : "bg-emerald-500/80 text-white"
                            }`}
                            title="Click to toggle publish status"
                          >
                            {post.isPublished === false ? "Hidden" : "Live"}
                          </button>
                        </div>

                        {/* Quick Stats Overlay at bottom of image */}
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2.5 flex items-center justify-between text-[11px] font-semibold text-white">
                          <span>❤️ {post.likes}</span>
                          <span>💬 {post.comments}</span>
                        </div>
                      </div>

                      {/* Caption */}
                      <p className="text-xs text-[#CCD0CF] line-clamp-3 leading-relaxed mb-3">
                        {post.caption}
                      </p>

                      {/* URL Preview */}
                      {post.postUrl && (
                        <a
                          href={post.postUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 mb-2 truncate"
                        >
                          <ExternalLink className="w-3 h-3 shrink-0" />
                          <span className="truncate">{post.postUrl}</span>
                        </a>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-[#253745]/60 flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-1">
                        {/* Reorder Buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            disabled={idx === 0}
                            onClick={() => {
                              if (idx === 0) return;
                              const currentList = [...store.instagramPosts];
                              const temp = currentList[idx - 1];
                              currentList[idx - 1] = currentList[idx];
                              currentList[idx] = temp;
                              store.reorderInstagramPosts(currentList);
                              showToast(`Moved post #${idx + 1} up.`);
                            }}
                            className="px-2 py-1 rounded bg-[#06141B] border border-[#253745] text-xs text-[#CCD0CF] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move Earlier in Showcase"
                          >
                            ▲
                          </button>
                          <button
                            disabled={idx === totalPosts - 1}
                            onClick={() => {
                              if (idx === totalPosts - 1) return;
                              const currentList = [...store.instagramPosts];
                              const temp = currentList[idx + 1];
                              currentList[idx + 1] = currentList[idx];
                              currentList[idx] = temp;
                              store.reorderInstagramPosts(currentList);
                              showToast(`Moved post #${idx + 1} down.`);
                            }}
                            className="px-2 py-1 rounded bg-[#06141B] border border-[#253745] text-xs text-[#CCD0CF] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move Later in Showcase"
                          >
                            ▼
                          </button>
                        </div>

                        {/* Edit Button */}
                        <Button
                          variant="secondary"
                          size="sm"
                          className="text-xs gap-1"
                          onClick={() => {
                            setIsNewInstaPost(false);
                            setEditingInstaPost(post);
                          }}
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </Button>

                        {/* Delete Button */}
                        <button
                          onClick={() => {
                            openConfirm(
                              `Delete Instagram Post #${idx + 1}?`,
                              `Are you sure you want to remove this post from the Instagram showcase?`,
                              () => {
                                store.deleteInstagramPost(post.id);
                                showToast(`Deleted Instagram post #${idx + 1}.`);
                              }
                            );
                          }}
                          className="p-1.5 rounded text-[#9BA8AB] hover:text-rose-400 hover:bg-[#06141B]"
                          title="Delete Post"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Edit / Add Modal */}
            {editingInstaPost && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                <div className="bg-[#11212D] border border-[#4A5C6A] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
                  <button
                    onClick={() => setEditingInstaPost(null)}
                    className="absolute top-4 right-4 p-1.5 rounded-lg text-[#9BA8AB] hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <h3 className="heading-font text-xl font-bold text-white uppercase mb-4 flex items-center gap-2">
                    <InstagramIcon className="w-5 h-5 text-emerald-400" />
                    <span>{isNewInstaPost ? "Add Instagram Showcase Post" : "Edit Instagram Showcase Post"}</span>
                  </h3>

                  <div className="space-y-4 text-xs">
                    {/* Image Upload Field */}
                    <ImageUploadField
                      label="Post Photograph"
                      section={`instagram-${editingInstaPost.id || "new"}`}
                      value={editingInstaPost.image || ""}
                      onChange={(url) => setEditingInstaPost({ ...editingInstaPost, image: url })}
                      previewAspect="square"
                      helpText="Upload a square or portrait photo from your computer (JPEG, PNG, WebP)."
                    />

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">
                        Post Caption / Training Advice
                      </label>
                      <textarea
                        rows={3}
                        value={editingInstaPost.caption}
                        onChange={(e) =>
                          setEditingInstaPost({ ...editingInstaPost, caption: e.target.value })
                        }
                        placeholder="Write fitness tip, coaching advice, or exercise explanation..."
                        className="w-full px-3 py-2 rounded-xl bg-[#06141B] border border-[#253745] text-white focus:outline-none focus:border-[#CCD0CF]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">
                          Likes Count
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 1,842"
                          value={editingInstaPost.likes}
                          onChange={(e) =>
                            setEditingInstaPost({ ...editingInstaPost, likes: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-[#06141B] border border-[#253745] text-white focus:outline-none focus:border-[#CCD0CF]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">
                          Comments Count
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 94"
                          value={editingInstaPost.comments}
                          onChange={(e) =>
                            setEditingInstaPost({ ...editingInstaPost, comments: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-[#06141B] border border-[#253745] text-white focus:outline-none focus:border-[#CCD0CF]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">
                        Specific Instagram Post URL (Optional)
                      </label>
                      <input
                        type="url"
                        placeholder="https://www.instagram.com/p/..."
                        value={editingInstaPost.postUrl || ""}
                        onChange={(e) =>
                          setEditingInstaPost({ ...editingInstaPost, postUrl: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-[#06141B] border border-[#253745] text-white focus:outline-none focus:border-[#CCD0CF]"
                      />
                      <p className="text-[10px] text-[#9BA8AB] mt-1">
                        Leave blank to default to Coach Faras&apos;s main Instagram profile.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="instaPublishedCheck"
                        checked={editingInstaPost.isPublished !== false}
                        onChange={(e) =>
                          setEditingInstaPost({ ...editingInstaPost, isPublished: e.target.checked })
                        }
                        className="w-4 h-4 accent-[#CCD0CF]"
                      />
                      <label htmlFor="instaPublishedCheck" className="text-xs text-[#CCD0CF] font-medium">
                        Published on public homepage showcase
                      </label>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#253745]">
                      <Button variant="ghost" size="sm" onClick={() => setEditingInstaPost(null)}>
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          if (!editingInstaPost.image) {
                            alert("Please select or upload an image for the post.");
                            return;
                          }
                          if (isNewInstaPost) {
                            store.addInstagramPost(editingInstaPost);
                            showToast("Instagram post created and added to showcase!");
                          } else {
                            store.updateInstagramPost(editingInstaPost);
                            showToast("Instagram post updated successfully!");
                          }
                          setEditingInstaPost(null);
                        }}
                      >
                        Save &amp; Publish
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 9: CLIENT TESTIMONIALS (INTERNAL ARCHIVE) */}
        {activeTab === "testimonials" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="heading-font text-lg font-bold text-white uppercase">
                    Client Reviews &amp; Experiences (Internal Archive)
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Hidden from public site
                  </span>
                </div>
                <p className="text-xs text-[#9BA8AB]">
                  Historical client feedback database. Preserved securely in storage and available for internal coaching records.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#9BA8AB] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search reviews..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-lg bg-[#11212D] border border-[#253745] text-xs text-white placeholder-[#9BA8AB]/50 focus:outline-none focus:border-[#CCD0CF]"
                  />
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  className="gap-1.5 shrink-0"
                  onClick={() => {
                    setIsNewTestimonial(true);
                    setEditingTestimonial({
                      id: "rev-" + Date.now(),
                      clientName: "New Client (Verified)",
                      clientTitle: "Executive / Athlete",
                      rating: 5,
                      reviewText: "Phenomenal coaching experience with outstanding physical results.",
                      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
                      packageUsed: "Premium Plan",
                    });
                  }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Review</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {store.testimonials
                .filter(
                  (test) =>
                    !searchQuery ||
                    test.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    test.clientTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    test.reviewText.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((test) => (
                  <div key={test.id} className="p-5 rounded-2xl bg-[#11212D] border border-[#253745] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#CCD0CF] shrink-0 bg-[#06141B]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={test.photoUrl} alt={test.clientName} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="heading-font text-base font-bold text-white">{test.clientName}</h4>
                          <span className="text-[11px] text-[#CCD0CF] block">{test.clientTitle}</span>
                          <span className="text-[10px] text-[#9BA8AB]">{test.packageUsed}</span>
                        </div>
                      </div>

                      <p className="text-xs text-[#CCD0CF] leading-relaxed italic mb-3">
                        &ldquo;{test.reviewText}&rdquo;
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#253745] flex items-center justify-between">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setIsNewTestimonial(false);
                          setEditingTestimonial(test);
                        }}
                        className="text-xs"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#CCD0CF]" />
                        <span>Edit</span>
                      </Button>

                      <button
                        onClick={() => {
                          openConfirm(
                            `Delete Review from ${test.clientName}?`,
                            `Are you sure you want to delete this client review? This will immediately remove it from the public testimonials section.`,
                            () => {
                              store.deleteTestimonial(test.id);
                              showToast("Review deleted.");
                            }
                          );
                        }}
                        className="p-1.5 rounded text-[#9BA8AB] hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {/* Edit / Add Testimonial Modal */}
            {editingTestimonial && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                <div className="bg-[#11212D] border border-[#4A5C6A] rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
                  <button onClick={() => setEditingTestimonial(null)} className="absolute top-4 right-4 text-[#9BA8AB] hover:text-white">
                    <X className="w-5 h-5" />
                  </button>

                  <h3 className="heading-font text-xl font-bold text-white uppercase mb-4">
                    {isNewTestimonial ? "Add Review" : `Edit Review`}
                  </h3>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">Client Name</label>
                      <input
                        type="text"
                        value={editingTestimonial.clientName}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, clientName: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">Title / Occupation</label>
                      <input
                        type="text"
                        value={editingTestimonial.clientTitle}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, clientTitle: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-white"
                      />
                    </div>

                    <ImageUploadField
                      label="Client Photograph"
                      value={editingTestimonial.photoUrl}
                      onChange={(url) => setEditingTestimonial({ ...editingTestimonial, photoUrl: url })}
                      previewAspect="square"
                      helpText="Upload a profile picture or avatar for the client."
                    />

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">Review Feedback</label>
                      <textarea
                        rows={3}
                        value={editingTestimonial.reviewText}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, reviewText: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-white"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#253745]">
                      <Button variant="ghost" size="sm" onClick={() => setEditingTestimonial(null)}>
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          if (isNewTestimonial) {
                            store.addTestimonial(editingTestimonial);
                            showToast("Review published!");
                          } else {
                            store.updateTestimonial(editingTestimonial);
                            showToast("Review updated.");
                          }
                          setEditingTestimonial(null);
                        }}
                      >
                        Save Review
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 9: MEDIA & WEBSITE PHOTOS CONTROL CENTER */}
        {activeTab === "media" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="heading-font text-lg font-bold text-white uppercase">
                  Website Photos &amp; Image Management
                </h3>
                <p className="text-xs text-[#9BA8AB]">
                  View, replace, upload from computer, preview, and save photographs across every section of the live website.
                </p>
              </div>

              {/* Hub Mode Toggle */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#11212D] border border-[#253745]">
                <button
                  type="button"
                  onClick={() => setMediaHubView("sections")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                    mediaHubView === "sections" ? "bg-[#253745] text-white border border-[#4A5C6A]" : "text-[#9BA8AB] hover:text-white"
                  }`}
                >
                  Live Website Photos
                </button>
                <button
                  type="button"
                  onClick={() => setMediaHubView("library")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                    mediaHubView === "library" ? "bg-[#253745] text-white border border-[#4A5C6A]" : "text-[#9BA8AB] hover:text-white"
                  }`}
                >
                  Raw Asset Library
                </button>
              </div>
            </div>

            {mediaHubView === "sections" ? (
              <div className="space-y-8">
                {/* Section Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                  {[
                    { id: "all", label: "All Sections" },
                    { id: "hero", label: "Homepage Hero (Priority)" },
                    { id: "trainer", label: "Trainer & Journey" },
                    { id: "transformations", label: "Client Results" },
                    { id: "programs", label: "Disciplines" },
                    { id: "articles", label: "Articles" },
                    { id: "testimonials", label: "Testimonials" },
                    { id: "instagram", label: "Instagram" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setMediaSectionFilter(cat.id)}
                      className={`px-3 py-1.5 rounded-lg font-semibold tracking-wider whitespace-nowrap transition-colors ${
                        mediaSectionFilter === cat.id
                          ? "bg-[#253745] text-white border border-[#4A5C6A]"
                          : "bg-[#11212D] text-[#9BA8AB] hover:text-white border border-[#253745]"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* 1. HOMEPAGE HERO MAIN PHOTO (HIGHEST PRIORITY) */}
                {(mediaSectionFilter === "all" || mediaSectionFilter === "hero") && (
                  <div className="p-6 rounded-2xl bg-[#11212D] border-2 border-[#4A5C6A] space-y-4 shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#253745]">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#CCD0CF] text-[#06141B]">
                            Highest Priority
                          </span>
                          <h4 className="heading-font text-base sm:text-lg font-bold text-white uppercase">
                            Homepage Main Hero Background Photography
                          </h4>
                        </div>
                        <p className="text-xs text-[#9BA8AB] mt-1">
                          This image serves as the full-screen background photography on the live public homepage.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href="/"
                          target="_blank"
                          className="px-3 py-1.5 rounded-lg bg-[#253745] hover:bg-[#253745]/80 border border-[#4A5C6A] text-xs text-[#CCD0CF] font-semibold flex items-center gap-1.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>View Live Homepage</span>
                        </Link>
                      </div>
                    </div>

                    <ImageUploadField
                      label="Homepage Hero Background Photo"
                      section="hero"
                      value={store.settings.heroBackgroundImage || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=2000&q=85"}
                      onChange={(url) => {
                        store.updateSettings({ ...store.settings, heroBackgroundImage: url });
                        setLocalSettings((prev) => ({ ...prev, heroBackgroundImage: url }));
                        showToast("Homepage Hero photo updated & active on live website!");
                      }}
                      previewAspect="video"
                      helpText="Select any gym/fitness photograph from your computer. The image is automatically uploaded to the server, compressed, and displayed immediately on the live homepage."
                    />
                  </div>
                )}

                {/* 2. TRAINER & PERSONAL TRANSFORMATION PHOTOS */}
                {(mediaSectionFilter === "all" || mediaSectionFilter === "trainer") && (
                  <div className="p-6 rounded-2xl bg-[#11212D] border border-[#253745] space-y-5">
                    <div>
                      <h4 className="heading-font text-base sm:text-lg font-bold text-white uppercase">
                        Coach Faras Profile &amp; Personal Transformation Photos
                      </h4>
                      <p className="text-xs text-[#9BA8AB] mt-1">
                        Each photo is independently replaceable. Updating the Before photo will not alter the After photos.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Trainer Profile Portrait */}
                      <div className="p-4 rounded-xl bg-[#06141B] border border-[#253745] space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#CCD0CF] block">
                          Coach Profile Portrait
                        </span>
                        <ImageUploadField
                          label="Coach Portrait Photo"
                          section="trainer-profile"
                          value={store.trainer.photoUrl || "/photos/faras-after-1.jpeg"}
                          onChange={(url) => {
                            store.updateTrainer({ ...store.trainer, photoUrl: url });
                            setLocalTrainer((prev) => ({ ...prev, photoUrl: url }));
                            showToast("Coach profile photo updated!");
                          }}
                          previewAspect="portrait"
                          helpText="Used across About, Hero trust cards, and social profiles."
                        />
                      </div>

                      {/* Faras Before Photo (56 KG) */}
                      <div className="p-4 rounded-xl bg-[#06141B] border border-[#253745] space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#CCD0CF] block">
                          Personal Transformation — Before (56 KG)
                        </span>
                        <ImageUploadField
                          label="Faras Before Photo (56 KG)"
                          section="faras-before"
                          value={store.trainer.transformation?.beforeImage || "/photos/faras-before.jpeg"}
                          onChange={(url) => {
                            const updated = {
                              ...store.trainer,
                              transformation: {
                                ...(store.trainer.transformation || {
                                  afterImage: "/photos/faras-after-1.jpeg",
                                }),
                                beforeImage: url,
                              },
                            };
                            store.updateTrainer(updated);
                            setLocalTrainer(updated);
                            showToast("Faras Before photo updated on personal transformation slider!");
                          }}
                          previewAspect="portrait"
                          helpText="Starting skinny beginner physique photo (56 KG)."
                        />
                      </div>

                      {/* Faras After Photo 1 (69 KG - Primary) */}
                      <div className="p-4 rounded-xl bg-[#06141B] border border-[#253745] space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#CCD0CF] block">
                          Personal Transformation — After 1 (69 KG)
                        </span>
                        <ImageUploadField
                          label="Faras After Photo 1 (Primary)"
                          section="faras-after"
                          value={store.trainer.transformation?.afterImage || "/photos/faras-after-1.jpeg"}
                          onChange={(url) => {
                            const updated = {
                              ...store.trainer,
                              transformation: {
                                ...(store.trainer.transformation || {
                                  beforeImage: "/photos/faras-before.jpeg",
                                }),
                                afterImage: url,
                              },
                            };
                            store.updateTrainer(updated);
                            setLocalTrainer(updated);
                            showToast("Faras After photo 1 updated!");
                          }}
                          previewAspect="portrait"
                          helpText="Primary transformed physique photo on slider."
                        />
                      </div>

                      {/* Faras After Photo 2 (Pose 2) */}
                      <div className="p-4 rounded-xl bg-[#06141B] border border-[#253745] space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#CCD0CF] block">
                          Personal Transformation — After Pose 2
                        </span>
                        <ImageUploadField
                          label="Faras After Photo (Pose 2)"
                          section="faras-after-2"
                          value={store.trainer.transformation?.afterImage2 || "/photos/faras-after-2.jpeg"}
                          onChange={(url) => {
                            const updated = {
                              ...store.trainer,
                              transformation: {
                                ...(store.trainer.transformation || {
                                  beforeImage: "/photos/faras-before.jpeg",
                                  afterImage: "/photos/faras-after-1.jpeg",
                                }),
                                afterImage2: url,
                              },
                            };
                            store.updateTrainer(updated);
                            setLocalTrainer(updated);
                            showToast("Faras After pose 2 photo updated!");
                          }}
                          previewAspect="portrait"
                          helpText="Secondary inspection pose on transformation slider."
                        />
                      </div>

                      {/* Faras After Photo 3 (Pose 3) */}
                      <div className="p-4 rounded-xl bg-[#06141B] border border-[#253745] space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#CCD0CF] block">
                          Personal Transformation — After Pose 3
                        </span>
                        <ImageUploadField
                          label="Faras After Photo (Pose 3)"
                          section="faras-after-3"
                          value={store.trainer.transformation?.afterImage3 || "/photos/faras-after-3.jpeg"}
                          onChange={(url) => {
                            const updated = {
                              ...store.trainer,
                              transformation: {
                                ...(store.trainer.transformation || {
                                  beforeImage: "/photos/faras-before.jpeg",
                                  afterImage: "/photos/faras-after-1.jpeg",
                                }),
                                afterImage3: url,
                              },
                            };
                            store.updateTrainer(updated);
                            setLocalTrainer(updated);
                            showToast("Faras After pose 3 photo updated!");
                          }}
                          previewAspect="portrait"
                          helpText="Tertiary inspection pose on transformation slider."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. TRAINEE / CLIENT TRANSFORMATION PHOTOS */}
                {(mediaSectionFilter === "all" || mediaSectionFilter === "transformations") && (
                  <div className="p-6 rounded-2xl bg-[#11212D] border border-[#253745] space-y-5">
                    <div>
                      <h4 className="heading-font text-base sm:text-lg font-bold text-white uppercase">
                        Client Body Transformation Photos (Per Trainee)
                      </h4>
                      <p className="text-xs text-[#9BA8AB] mt-1">
                        Replace or upload Before and After photos for individual clients. Changing one client does not affect others.
                      </p>
                    </div>

                    <div className="space-y-6">
                      {store.transformations.map((item) => (
                        <div
                          key={item.id}
                          className="p-5 rounded-xl bg-[#06141B] border border-[#253745] space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="heading-font text-sm font-bold text-white uppercase">
                                {item.clientName}
                              </h5>
                              <span className="text-[11px] text-[#9BA8AB]">
                                {item.fitnessGoal} • {item.duration} • {item.startingWeight}kg → {item.currentWeight}kg (-{item.weightDiff}kg)
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => setEditingTransformation(item)}
                              className="px-2.5 py-1 rounded text-xs font-semibold bg-[#253745] hover:bg-[#4A5C6A] text-[#CCD0CF] hover:text-white transition-colors"
                            >
                              Edit Full Record &amp; Story
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TransformationPhotoAdjuster
                              label={`Before Photo — ${item.clientName}`}
                              type="before"
                              imageUrl={item.beforeImage}
                              onImageChange={(url) => {
                                store.updateTransformation({ ...item, beforeImage: url });
                                showToast(`Updated Before photo for ${item.clientName}`);
                              }}
                              fit={item.beforeFit || DEFAULT_FIT_SETTINGS}
                              onFitChange={(fit) => {
                                store.updateTransformation({ ...item, beforeFit: fit });
                                showToast(`Saved fit adjustments for ${item.clientName} (Before)`);
                              }}
                              weightLabel={`${item.startingWeight}`}
                              weightUnit={item.weightUnit}
                              section={`trainee-${item.id}`}
                            />

                            <TransformationPhotoAdjuster
                              label={`After Photo — ${item.clientName}`}
                              type="after"
                              imageUrl={item.afterImage}
                              onImageChange={(url) => {
                                store.updateTransformation({ ...item, afterImage: url });
                                showToast(`Updated After photo for ${item.clientName}`);
                              }}
                              fit={item.afterFit || DEFAULT_FIT_SETTINGS}
                              onFitChange={(fit) => {
                                store.updateTransformation({ ...item, afterFit: fit });
                                showToast(`Saved fit adjustments for ${item.clientName} (After)`);
                              }}
                              weightLabel={`${item.currentWeight}`}
                              weightUnit={item.weightUnit}
                              section={`trainee-${item.id}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. TRAINING DISCIPLINES / SERVICES IMAGES */}
                {(mediaSectionFilter === "all" || mediaSectionFilter === "programs") && (
                  <div className="p-6 rounded-2xl bg-[#11212D] border border-[#253745] space-y-5">
                    <div>
                      <h4 className="heading-font text-base sm:text-lg font-bold text-white uppercase">
                        Training Disciplines &amp; Program Photography
                      </h4>
                      <p className="text-xs text-[#9BA8AB] mt-1">
                        Header photographs displayed in the Training Services grid on the public site.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {store.services.map((svc) => (
                        <div key={svc.id} className="p-4 rounded-xl bg-[#06141B] border border-[#253745] space-y-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#CCD0CF] block">
                            {svc.title}
                          </span>
                          <ImageUploadField
                            label={`${svc.title} Banner`}
                            section={`program-${svc.id}`}
                            value={svc.image}
                            onChange={(url) => {
                              store.updateService({ ...svc, image: url });
                              showToast(`Updated image for ${svc.title}`);
                            }}
                            previewAspect="video"
                            helpText={svc.tagline}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. FITNESS ARTICLES / KNOWLEDGE BASE COVERS */}
                {(mediaSectionFilter === "all" || mediaSectionFilter === "articles") && (
                  <div className="p-6 rounded-2xl bg-[#11212D] border border-[#253745] space-y-5">
                    <div>
                      <h4 className="heading-font text-base sm:text-lg font-bold text-white uppercase">
                        Knowledge Base Article Cover Photographs
                      </h4>
                      <p className="text-xs text-[#9BA8AB] mt-1">
                        Cover photographs displayed on article cards and reading modals.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {store.articles.map((art) => (
                        <div key={art.id} className="p-4 rounded-xl bg-[#06141B] border border-[#253745] space-y-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#CCD0CF] block truncate" title={art.title}>
                            {art.title}
                          </span>
                          <ImageUploadField
                            label={`Cover: ${art.title}`}
                            section={`article-${art.id}`}
                            value={art.coverImage}
                            onChange={(url) => {
                              store.updateArticle({ ...art, coverImage: url });
                              showToast(`Updated cover for ${art.title}`);
                            }}
                            previewAspect="video"
                            helpText={`Category: ${art.category} • ${art.readTime}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. CLIENT TESTIMONIAL AVATARS */}
                {(mediaSectionFilter === "all" || mediaSectionFilter === "testimonials") && (
                  <div className="p-6 rounded-2xl bg-[#11212D] border border-[#253745] space-y-5">
                    <div>
                      <h4 className="heading-font text-base sm:text-lg font-bold text-white uppercase">
                        Client Testimonial Avatars &amp; Headshots
                      </h4>
                      <p className="text-xs text-[#9BA8AB] mt-1">
                        Client photographs displayed in the public reviews carousel.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {store.testimonials.map((test) => (
                        <div key={test.id} className="p-4 rounded-xl bg-[#06141B] border border-[#253745] space-y-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#CCD0CF] block truncate">
                            {test.clientName}
                          </span>
                          <ImageUploadField
                            label={`Headshot: ${test.clientName}`}
                            section={`testimonial-${test.id}`}
                            value={test.photoUrl}
                            onChange={(url) => {
                              store.updateTestimonial({ ...test, photoUrl: url });
                              showToast(`Updated avatar for ${test.clientName}`);
                            }}
                            previewAspect="square"
                            helpText={test.clientTitle}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. INSTAGRAM SHOWCASE PHOTOS */}
                {(mediaSectionFilter === "all" || mediaSectionFilter === "instagram") && (
                  <div className="p-6 rounded-2xl bg-[#11212D] border border-[#253745] space-y-5">
                    <div>
                      <h4 className="heading-font text-base sm:text-lg font-bold text-white uppercase">
                        Instagram Feed Showcase Photos
                      </h4>
                      <p className="text-xs text-[#9BA8AB] mt-1">
                        Replace any of the 4 photos featured in the public Instagram community showcase.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {(store.instagramPosts || []).map((post, idx) => (
                        <div key={post.id} className="p-4 rounded-xl bg-[#06141B] border border-[#253745] space-y-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#CCD0CF] block">
                            Instagram Tile #{idx + 1}
                          </span>
                          <ImageUploadField
                            label={`Instagram Post ${idx + 1}`}
                            section={`instagram-${post.id}`}
                            value={post.image}
                            onChange={(url) => {
                              store.updateInstagramPost({ ...post, image: url });
                              showToast(`Updated Instagram tile #${idx + 1}`);
                            }}
                            previewAspect="square"
                            helpText={post.caption.slice(0, 70) + "..."}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* RAW ASSET STORAGE & UPLOADS */
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                    {[
                      { id: "all", label: "All Assets" },
                      { id: "branding-assets", label: "Hero & Branding" },
                      { id: "trainer-photos", label: "Trainer Photos" },
                      { id: "transformation-images", label: "Client Transformations" },
                      { id: "program-images", label: "Programs" },
                      { id: "article-images", label: "Articles" },
                      { id: "gallery-photos", label: "Gallery" },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setMediaCategoryFilter(cat.id)}
                        className={`px-3 py-1.5 rounded-lg font-semibold tracking-wider whitespace-nowrap transition-colors ${
                          mediaCategoryFilter === cat.id
                            ? "bg-[#253745] text-white border border-[#4A5C6A]"
                            : "bg-[#11212D] text-[#9BA8AB] hover:text-white border border-[#253745]"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-[#9BA8AB] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search media..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 pr-3 py-1.5 rounded-lg bg-[#11212D] border border-[#253745] text-xs text-white placeholder-[#9BA8AB]/50 focus:outline-none focus:border-[#CCD0CF]"
                      />
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      className="gap-1.5 shrink-0"
                      onClick={() => {
                        setNewMediaAsset({
                          title: "New Media Image",
                          url: "",
                          bucket: "branding-assets",
                        });
                        setIsMediaModalOpen(true);
                      }}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Upload Media Asset</span>
                    </Button>
                  </div>
                </div>

                {/* Media Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {store.media
                    .filter(
                      (asset) =>
                        (mediaCategoryFilter === "all" || asset.bucket === mediaCategoryFilter) &&
                        (!searchQuery ||
                          asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          asset.bucket.toLowerCase().includes(searchQuery.toLowerCase()))
                    )
                    .map((asset) => (
                      <div key={asset.id} className="p-3 rounded-xl bg-[#11212D] border border-[#253745] flex flex-col justify-between group">
                        <div>
                          <div className="relative aspect-video rounded-lg overflow-hidden bg-[#06141B] mb-2.5 border border-[#4A5C6A]/50">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={asset.url} alt={asset.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          </div>
                          <h5 className="heading-font text-xs font-bold text-white truncate" title={asset.title}>
                            {asset.title}
                          </h5>
                          <div className="flex items-center justify-between text-[10px] text-[#9BA8AB] mt-1">
                            <span className="capitalize">{asset.bucket.replace("-", " ")}</span>
                            <span>{asset.fileSize || "1 MB"}</span>
                          </div>
                        </div>

                        <div className="pt-2 mt-2 border-t border-[#253745] flex items-center justify-between text-[10px]">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(asset.url);
                              showToast("Asset URL copied to clipboard!");
                            }}
                            className="text-[#CCD0CF] hover:text-white flex items-center gap-1"
                            title="Copy image URL"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy URL</span>
                          </button>

                          <div className="flex items-center gap-2">
                            <a
                              href={asset.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#9BA8AB] hover:text-white"
                              title="Open preview"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </a>

                            <button
                              onClick={() => {
                                openConfirm(
                                  `Delete Media Asset "${asset.title}"?`,
                                  `Are you sure you want to delete this media asset? Any sections referencing this image URL will revert to default.`,
                                  () => {
                                    store.deleteMediaAsset(asset.id);
                                    showToast("Media asset deleted.");
                                  }
                                );
                              }}
                              className="text-[#9BA8AB] hover:text-rose-400 p-0.5"
                              title="Delete asset"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Upload / Register Media Modal */}
                {isMediaModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                    <div className="bg-[#11212D] border border-[#4A5C6A] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
                      <button onClick={() => setIsMediaModalOpen(false)} className="absolute top-4 right-4 text-[#9BA8AB] hover:text-white">
                        <X className="w-5 h-5" />
                      </button>

                      <h3 className="heading-font text-xl font-bold text-white uppercase mb-4">
                        Upload &amp; Register Media Asset
                      </h3>

                      <div className="space-y-4 text-xs">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">Asset Title</label>
                          <input
                            type="text"
                            placeholder="e.g. Hero High-Res Workout Banner"
                            value={newMediaAsset.title}
                            onChange={(e) => setNewMediaAsset({ ...newMediaAsset, title: e.target.value })}
                            className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">Destination Category</label>
                          <select
                            value={newMediaAsset.bucket}
                            onChange={(e) => setNewMediaAsset({ ...newMediaAsset, bucket: e.target.value })}
                            className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-white"
                          >
                            <option value="branding-assets">Homepage Hero &amp; Branding</option>
                            <option value="trainer-photos">Trainer Photographs</option>
                            <option value="transformation-images">Client Transformations</option>
                            <option value="program-images">Training Programs</option>
                            <option value="article-images">Fitness Articles</option>
                            <option value="gallery-photos">Gallery Photographs</option>
                          </select>
                        </div>

                        <ImageUploadField
                          label="Select Local Image File or Paste URL"
                          section="media-library"
                          value={newMediaAsset.url}
                          onChange={(url) => setNewMediaAsset({ ...newMediaAsset, url })}
                          previewAspect="video"
                          helpText="Choose a local file from your device (JPEG, PNG, WebP) or enter an image URL. Live preview appears immediately."
                        />

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#253745]">
                          <Button variant="ghost" size="sm" onClick={() => setIsMediaModalOpen(false)}>
                            Cancel
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            disabled={!newMediaAsset.url}
                            onClick={() => {
                              store.addMediaAsset({
                                id: "media-" + Date.now(),
                                title: newMediaAsset.title || "Uploaded Image Asset",
                                url: newMediaAsset.url,
                                bucket: newMediaAsset.bucket,
                                fileSize: newMediaAsset.url.startsWith("data:") ? "Local File" : "1.2 MB",
                                uploadedAt: new Date().toISOString().slice(0, 10),
                              });
                              setIsMediaModalOpen(false);
                              showToast("Media asset registered and saved!");
                            }}
                          >
                            Register Asset
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 10: ANNOUNCEMENTS */}
        {activeTab === "announcements" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="heading-font text-lg font-bold text-white uppercase">
                  Top Announcement Banners
                </h3>
                <p className="text-xs text-[#9BA8AB]">
                  Active banner message displayed at the top of the public website.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {store.announcements.map((ann) => (
                <div key={ann.id} className="p-5 rounded-2xl bg-[#11212D] border border-[#253745] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#CCD0CF] text-[#06141B] uppercase">
                        {ann.badge}
                      </span>
                      <h4 className="heading-font text-base font-bold text-white">{ann.title}</h4>
                      {ann.isActive && <Badge variant="popular">Active On Site</Badge>}
                    </div>
                    <p className="text-xs text-[#9BA8AB]">{ann.content}</p>
                  </div>

                  <Button
                    variant={ann.isActive ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => {
                      store.updateAnnouncement({ ...ann, isActive: !ann.isActive });
                      showToast(ann.isActive ? "Banner hidden from public site." : "Banner activated!");
                    }}
                  >
                    {ann.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 11: TRAINER BIO & CREDENTIALS */}
        {activeTab === "trainers" && (
          <div className="space-y-6 max-w-4xl">
            {/* Top Coach Roster & Management Bar */}
            <div className="p-5 rounded-2xl bg-[#11212D] border border-[#253745] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#9BA8AB] tracking-widest block">
                  Coach Profiles Management
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-[#CCD0CF]">Active Profile:</span>
                  <select
                    value={localTrainer.name}
                    onChange={(e) => {
                      const selected = (store.trainersList || []).find((t) => t.name === e.target.value);
                      if (selected) {
                        setLocalTrainer(selected);
                        store.updateTrainer(selected);
                        showToast(`Switched active profile to ${selected.name}`);
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#06141B] border border-[#4A5C6A] text-xs text-white font-bold"
                  >
                    {(store.trainersList || [store.trainer]).map((t, idx) => (
                      <option key={idx} value={t.name}>
                        {t.fullName || t.name} ({t.professionalTitle || "Coach"})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => setIsNewTrainerModalOpen(true)}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Coach</span>
                </Button>

                {(store.trainersList || []).length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      openConfirm(
                        `Delete Coach Profile "${localTrainer.name}"?`,
                        `Are you sure you want to delete this trainer profile? This cannot be undone.`,
                        () => {
                          store.deleteTrainerProfile(localTrainer.name);
                          const remaining = (store.trainersList || []).filter((t) => t.name !== localTrainer.name);
                          if (remaining.length > 0) {
                            setLocalTrainer(remaining[0]);
                            store.updateTrainer(remaining[0]);
                          }
                          showToast(`Trainer profile deleted.`);
                        }
                      );
                    }}
                    className="p-2 rounded-lg text-[#9BA8AB] hover:text-rose-400 hover:bg-[#06141B] border border-[#4A5C6A]/50 transition-colors"
                    title="Delete this profile"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Main Trainer Edit Form */}
            <form onSubmit={handleSaveTrainer} className="bg-[#11212D] border border-[#253745] rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#253745]">
                <div>
                  <h3 className="heading-font text-xl font-bold text-white uppercase">
                    Edit Coach Profile: {localTrainer.fullName || localTrainer.name}
                  </h3>
                  <p className="text-xs text-[#9BA8AB] mt-0.5">
                    Update personal biography, transformation metrics (56 KG → 69 KG), and coaching photographs.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="trainerActiveStatus"
                    checked={localTrainer.isActive ?? true}
                    onChange={(e) => setLocalTrainer({ ...localTrainer, isActive: e.target.checked })}
                    className="w-4 h-4 accent-[#CCD0CF]"
                  />
                  <label htmlFor="trainerActiveStatus" className="text-xs text-white font-medium cursor-pointer">
                    {localTrainer.isActive ?? true ? "Active & Published" : "Inactive (Hidden)"}
                  </label>
                </div>
              </div>

              {/* Core Identity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-[#CCD0CF] mb-1.5">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={localTrainer.fullName || "Mohammad Faras U"}
                    onChange={(e) => setLocalTrainer({ ...localTrainer, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#06141B] border border-[#253745] text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-[#CCD0CF] mb-1.5">
                    Display / Short Name
                  </label>
                  <input
                    type="text"
                    value={localTrainer.name}
                    onChange={(e) => setLocalTrainer({ ...localTrainer, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#06141B] border border-[#253745] text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-[#CCD0CF] mb-1.5">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    value={localTrainer.professionalTitle || "Online Fitness Coach"}
                    onChange={(e) => setLocalTrainer({ ...localTrainer, professionalTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#06141B] border border-[#253745] text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-[#CCD0CF] mb-1.5">
                  Professional Tagline
                </label>
                <input
                  type="text"
                  value={localTrainer.tagline}
                  onChange={(e) => setLocalTrainer({ ...localTrainer, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#06141B] border border-[#253745] text-xs text-white"
                />
              </div>

              {/* Metrics & Experience */}
              <div className="p-4 rounded-xl bg-[#06141B]/70 border border-[#253745] space-y-4">
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#CCD0CF] block">
                  Personal Transformation Journey &amp; Experience
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#9BA8AB] mb-1">Experience</label>
                    <input
                      type="text"
                      value={localTrainer.experienceYears || "4+ Years"}
                      onChange={(e) => setLocalTrainer({ ...localTrainer, experienceYears: e.target.value })}
                      className="w-full px-3 py-2 rounded bg-[#11212D] border border-[#253745] text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#9BA8AB] mb-1">Starting Weight</label>
                    <input
                      type="text"
                      value={localTrainer.startingWeight || "56 KG"}
                      onChange={(e) => setLocalTrainer({ ...localTrainer, startingWeight: e.target.value })}
                      className="w-full px-3 py-2 rounded bg-[#11212D] border border-[#253745] text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#9BA8AB] mb-1">Current Weight</label>
                    <input
                      type="text"
                      value={localTrainer.currentWeight || "69 KG"}
                      onChange={(e) => setLocalTrainer({ ...localTrainer, currentWeight: e.target.value })}
                      className="w-full px-3 py-2 rounded bg-[#11212D] border border-[#253745] text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#9BA8AB] mb-1">Weight Gained</label>
                    <input
                      type="text"
                      value={localTrainer.weightGained || "13 KG"}
                      onChange={(e) => setLocalTrainer({ ...localTrainer, weightGained: e.target.value })}
                      className="w-full px-3 py-2 rounded bg-[#11212D] border border-[#253745] text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Direct Contact Channels */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-[#CCD0CF] mb-1.5">
                    Coach WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={localTrainer.whatsappNumber || "918138954423"}
                    onChange={(e) => setLocalTrainer({ ...localTrainer, whatsappNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#06141B] border border-[#253745] text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-[#CCD0CF] mb-1.5">
                    Instagram Username
                  </label>
                  <input
                    type="text"
                    value={localTrainer.instagramUsername || "itsfarasu"}
                    onChange={(e) => setLocalTrainer({ ...localTrainer, instagramUsername: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#06141B] border border-[#253745] text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-[#CCD0CF] mb-1.5">
                    Instagram Profile URL
                  </label>
                  <input
                    type="text"
                    value={localTrainer.instagramUrl || "https://www.instagram.com/itsfarasu/"}
                    onChange={(e) => setLocalTrainer({ ...localTrainer, instagramUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#06141B] border border-[#253745] text-xs text-white"
                  />
                </div>
              </div>

              {/* Philosophy */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-[#CCD0CF] mb-1.5">
                  Core Coaching Philosophy
                </label>
                <input
                  type="text"
                  value={localTrainer.philosophy || "No shortcuts. No unrealistic promises. Just proper training, consistency and progress."}
                  onChange={(e) => setLocalTrainer({ ...localTrainer, philosophy: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#06141B] border border-[#253745] text-xs text-white"
                />
              </div>

              {/* Biography */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-[#CCD0CF] mb-1.5">
                  Biography (Shown in Public About Section)
                </label>
                <textarea
                  rows={5}
                  value={localTrainer.bio}
                  onChange={(e) => setLocalTrainer({ ...localTrainer, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#06141B] border border-[#253745] text-xs text-white font-mono leading-relaxed"
                />
              </div>

              {/* Photo Upload: Profile Photograph */}
              <div className="p-5 rounded-2xl bg-[#06141B]/70 border border-[#253745] space-y-4">
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#CCD0CF] block">
                  Coach Profile Photograph
                </span>
                <ImageUploadField
                  label="Profile Portrait"
                  value={localTrainer.photoUrl || "/photos/faras-after-1.jpeg"}
                  onChange={(url) => setLocalTrainer({ ...localTrainer, photoUrl: url })}
                  previewAspect="portrait"
                  helpText="Displayed in the Head Coach profile and about section."
                />
              </div>

              {/* Personal Before & After Photos (56 KG -> 69 KG) */}
              <div className="p-5 rounded-2xl bg-[#06141B]/70 border border-[#253745] space-y-6">
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#CCD0CF] block">
                  Faras&apos;s Personal Transformation Images (56 KG → 69 KG)
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ImageUploadField
                    label="Personal Before Photo (56 KG)"
                    value={localTrainer.transformation?.beforeImage || "/photos/faras-before.jpeg"}
                    onChange={(url) =>
                      setLocalTrainer({
                        ...localTrainer,
                        transformation: {
                          ...(localTrainer.transformation || {
                            beforeImage: "/photos/faras-before.jpeg",
                            afterImage: "/photos/faras-after-1.jpeg",
                          }),
                          beforeImage: url,
                        },
                      })
                    }
                    previewAspect="portrait"
                    helpText="Used on the left side of the interactive transformation slider."
                  />

                  <ImageUploadField
                    label="Personal After Photo - Primary (69 KG)"
                    value={localTrainer.transformation?.afterImage || "/photos/faras-after-1.jpeg"}
                    onChange={(url) =>
                      setLocalTrainer({
                        ...localTrainer,
                        transformation: {
                          ...(localTrainer.transformation || {
                            beforeImage: "/photos/faras-before.jpeg",
                            afterImage: "/photos/faras-after-1.jpeg",
                          }),
                          afterImage: url,
                        },
                      })
                    }
                    previewAspect="portrait"
                    helpText="Primary transformed physique photograph."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#253745]">
                  <ImageUploadField
                    label="Personal After Photo - Pose 2"
                    value={localTrainer.transformation?.afterImage2 || "/photos/faras-after-2.jpeg"}
                    onChange={(url) =>
                      setLocalTrainer({
                        ...localTrainer,
                        transformation: {
                          ...(localTrainer.transformation || {
                            beforeImage: "/photos/faras-before.jpeg",
                            afterImage: "/photos/faras-after-1.jpeg",
                          }),
                          afterImage2: url,
                        },
                      })
                    }
                    previewAspect="portrait"
                    helpText="Alternative comparison angle 2."
                  />

                  <ImageUploadField
                    label="Personal After Photo - Pose 3"
                    value={localTrainer.transformation?.afterImage3 || "/photos/faras-after-3.jpeg"}
                    onChange={(url) =>
                      setLocalTrainer({
                        ...localTrainer,
                        transformation: {
                          ...(localTrainer.transformation || {
                            beforeImage: "/photos/faras-before.jpeg",
                            afterImage: "/photos/faras-after-1.jpeg",
                          }),
                          afterImage3: url,
                        },
                      })
                    }
                    previewAspect="portrait"
                    helpText="Alternative comparison angle 3."
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary" size="md" className="gap-2">
                  <Save className="w-4 h-4" />
                  <span>Save &amp; Synchronize Trainer Profile</span>
                </Button>
              </div>
            </form>

            {/* Modal to Add New Trainer Profile */}
            {isNewTrainerModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                <div className="bg-[#11212D] border border-[#4A5C6A] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
                  <button onClick={() => setIsNewTrainerModalOpen(false)} className="absolute top-4 right-4 text-[#9BA8AB] hover:text-white">
                    <X className="w-5 h-5" />
                  </button>

                  <h3 className="heading-font text-xl font-bold text-white uppercase mb-4">
                    Add New Coach Profile
                  </h3>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">Full Legal Name</label>
                      <input
                        type="text"
                        placeholder="e.g. John Doe"
                        value={newTrainerProfile.fullName}
                        onChange={(e) => setNewTrainerProfile({ ...newTrainerProfile, fullName: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">Display Name</label>
                      <input
                        type="text"
                        placeholder="e.g. John"
                        value={newTrainerProfile.name}
                        onChange={(e) => setNewTrainerProfile({ ...newTrainerProfile, name: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">Professional Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Online Fitness Coach"
                        value={newTrainerProfile.professionalTitle}
                        onChange={(e) => setNewTrainerProfile({ ...newTrainerProfile, professionalTitle: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-white"
                      />
                    </div>

                    <ImageUploadField
                      label="Coach Profile Photograph"
                      value={newTrainerProfile.photoUrl}
                      onChange={(url) => setNewTrainerProfile({ ...newTrainerProfile, photoUrl: url })}
                      previewAspect="portrait"
                      helpText="Upload a local image file or enter an image URL."
                    />

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">Biography</label>
                      <textarea
                        rows={3}
                        value={newTrainerProfile.bio}
                        onChange={(e) => setNewTrainerProfile({ ...newTrainerProfile, bio: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-white"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#253745]">
                      <Button variant="ghost" size="sm" onClick={() => setIsNewTrainerModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={!newTrainerProfile.name}
                        onClick={() => {
                          store.addTrainerProfile(newTrainerProfile);
                          setLocalTrainer(newTrainerProfile);
                          store.updateTrainer(newTrainerProfile);
                          setIsNewTrainerModalOpen(false);
                          showToast(`Coach profile "${newTrainerProfile.name}" created!`);
                        }}
                      >
                        Create Coach Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 12: FAQS */}
        {activeTab === "faqs" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="heading-font text-lg font-bold text-white uppercase">
                  Frequently Asked Questions (FAQs)
                </h3>
                <p className="text-xs text-[#9BA8AB]">
                  Questions and answers displayed on the public website accordion.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#9BA8AB] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-lg bg-[#11212D] border border-[#253745] text-xs text-white placeholder-[#9BA8AB]/50 focus:outline-none focus:border-[#CCD0CF]"
                  />
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  className="gap-1.5 shrink-0"
                  onClick={() => {
                    setIsNewFaq(true);
                    setEditingFaq({
                      id: "faq-" + Date.now(),
                      question: "New Frequently Asked Question",
                      answer: "Detailed answer explaining the coaching protocol or logistics.",
                      category: "General",
                    });
                  }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add FAQ</span>
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {store.faqs
                .filter(
                  (faq) =>
                    !searchQuery ||
                    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (faq.category && faq.category.toLowerCase().includes(searchQuery.toLowerCase()))
                )
                .map((faq) => (
                  <div
                    key={faq.id}
                    className="p-5 rounded-2xl bg-[#11212D] border border-[#253745] flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#253745] text-[#CCD0CF] uppercase">
                          {faq.category || "General"}
                        </span>
                        <h4 className="heading-font text-base font-bold text-white leading-snug">
                          {faq.question}
                        </h4>
                      </div>
                      <p className="text-xs text-[#9BA8AB] leading-relaxed pl-1">
                        {faq.answer}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#253745] flex items-center justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setIsNewFaq(false);
                          setEditingFaq(faq);
                        }}
                        className="gap-1 text-xs"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#CCD0CF]" />
                        <span>Edit</span>
                      </Button>

                      <button
                        onClick={() => {
                          openConfirm(
                            `Delete FAQ "${faq.question}"?`,
                            `Are you sure you want to delete this FAQ? It will be removed from the public website accordion.`,
                            () => {
                              store.deleteFaq(faq.id);
                              showToast("FAQ removed.");
                            }
                          );
                        }}
                        className="p-2 rounded text-[#9BA8AB] hover:text-rose-400 hover:bg-[#06141B]"
                        title="Delete FAQ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {/* Edit / Add FAQ Modal */}
            {editingFaq && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                <div className="bg-[#11212D] border border-[#4A5C6A] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
                  <button
                    onClick={() => setEditingFaq(null)}
                    className="absolute top-4 right-4 p-1.5 rounded-lg text-[#9BA8AB] hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <h3 className="heading-font text-xl font-bold text-white uppercase mb-4">
                    {isNewFaq ? "Add New FAQ" : "Edit FAQ"}
                  </h3>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        value={editingFaq.category || ""}
                        onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                        placeholder="e.g. Booking, Nutrition, Support, Packages"
                        className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">
                        Question
                      </label>
                      <input
                        type="text"
                        value={editingFaq.question}
                        onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#CCD0CF] mb-1">
                        Answer
                      </label>
                      <textarea
                        rows={4}
                        value={editingFaq.answer}
                        onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-white"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#253745]">
                      <Button variant="ghost" size="sm" onClick={() => setEditingFaq(null)}>
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          if (isNewFaq) {
                            store.addFaq(editingFaq);
                            showToast("FAQ added!");
                          } else {
                            store.updateFaq(editingFaq);
                            showToast("FAQ updated.");
                          }
                          setEditingFaq(null);
                        }}
                      >
                        Save FAQ
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 13: SETTINGS & WEBSITE TEXT */}
        {activeTab === "settings" && (
          <form onSubmit={handleSaveSettings} className="max-w-3xl bg-[#11212D] border border-[#253745] rounded-2xl p-6 sm:p-8 space-y-8">
            <div>
              <h3 className="heading-font text-xl font-bold text-white uppercase">
                Website Text, Branding &amp; WhatsApp Configuration
              </h3>
              <p className="text-xs text-[#9BA8AB] mt-1">
                Customize brand identity, hero section copy, contact channels, and footer information.
              </p>
            </div>

            {/* SECTION 1: Brand Identity & Contacts */}
            <div className="space-y-4 pt-2 border-t border-[#253745]">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#CCD0CF] block">
                Brand Identity &amp; Contact Info
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-[#CCD0CF] mb-1.5">
                    Official Brand Name
                  </label>
                  <input
                    type="text"
                    value={localSettings.brandName}
                    onChange={(e) => setLocalSettings({ ...localSettings, brandName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#06141B] border border-[#253745] text-xs text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-[#CCD0CF] mb-1.5">
                    Trainer Display Name
                  </label>
                  <input
                    type="text"
                    value={localSettings.trainerName}
                    onChange={(e) => setLocalSettings({ ...localSettings, trainerName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#06141B] border border-[#253745] text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-[#CCD0CF] mb-1.5">
                    Coaching WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={localSettings.whatsappNumber}
                    onChange={(e) => setLocalSettings({ ...localSettings, whatsappNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#06141B] border border-[#253745] text-xs text-white"
                  />
                  <span className="text-[10px] text-[#9BA8AB] mt-1 block">
                    Format: 918138954423. All package buttons route inquiries to this number.
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-[#CCD0CF] mb-1.5">
                    Contact Email Address
                  </label>
                  <input
                    type="email"
                    value={localSettings.contactEmail}
                    onChange={(e) => setLocalSettings({ ...localSettings, contactEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#06141B] border border-[#253745] text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-[#CCD0CF] mb-1.5">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  value={localSettings.instagramHandle}
                  onChange={(e) => setLocalSettings({ ...localSettings, instagramHandle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#06141B] border border-[#253745] text-xs text-white"
                />
              </div>
            </div>

            {/* SECTION 2: Homepage Hero Copy */}
            <div className="space-y-4 pt-4 border-t border-[#253745]">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#CCD0CF] block">
                Homepage Hero Text &amp; CTAs
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#9BA8AB] mb-1">Heading Line 1</label>
                  <input
                    type="text"
                    value={localSettings.heroHeadingLine1 || "TRAIN SMART."}
                    onChange={(e) => setLocalSettings({ ...localSettings, heroHeadingLine1: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-xs text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#9BA8AB] mb-1">Heading Line 2</label>
                  <input
                    type="text"
                    value={localSettings.heroHeadingLine2 || "STAY CONSISTENT."}
                    onChange={(e) => setLocalSettings({ ...localSettings, heroHeadingLine2: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-xs text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#9BA8AB] mb-1">Heading Line 3</label>
                  <input
                    type="text"
                    value={localSettings.heroHeadingLine3 || "TRANSFORM YOURSELF."}
                    onChange={(e) => setLocalSettings({ ...localSettings, heroHeadingLine3: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-xs text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-[#CCD0CF] mb-1.5">
                  Hero Protocol Subtitle
                </label>
                <textarea
                  rows={3}
                  value={localSettings.heroSubtitle || ""}
                  onChange={(e) => setLocalSettings({ ...localSettings, heroSubtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#06141B] border border-[#253745] text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#9BA8AB] mb-1">Primary Button Label</label>
                  <input
                    type="text"
                    value={localSettings.heroButtonPrimary || "Start Your Transformation"}
                    onChange={(e) => setLocalSettings({ ...localSettings, heroButtonPrimary: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#9BA8AB] mb-1">Secondary Button Label</label>
                  <input
                    type="text"
                    value={localSettings.heroButtonSecondary || "Chat on WhatsApp"}
                    onChange={(e) => setLocalSettings({ ...localSettings, heroButtonSecondary: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#06141B] border border-[#253745] text-xs text-white"
                  />
                </div>
              </div>

              <ImageUploadField
                label="Hero Background Photography"
                value={localSettings.heroBackgroundImage || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=2000&q=85"}
                onChange={(url) => setLocalSettings({ ...localSettings, heroBackgroundImage: url })}
                previewAspect="video"
                helpText="Upload a high-resolution gym photograph or enter an image URL for the homepage background."
              />
            </div>

            {/* SECTION 3: Footer & SEO */}
            <div className="space-y-4 pt-4 border-t border-[#253745]">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#CCD0CF] block">
                Footer Copy &amp; SEO Metadata
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-[#CCD0CF] mb-1.5">
                    Footer Tagline
                  </label>
                  <input
                    type="text"
                    value={localSettings.footerTagline || "Train Smart. Stay Consistent. Transform Yourself."}
                    onChange={(e) => setLocalSettings({ ...localSettings, footerTagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#06141B] border border-[#253745] text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-[#CCD0CF] mb-1.5">
                    Footer Copyright Notice
                  </label>
                  <input
                    type="text"
                    value={localSettings.footerCopyright || "FARAS METHOD. All Rights Reserved. Online Fitness Coaching."}
                    onChange={(e) => setLocalSettings({ ...localSettings, footerCopyright: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#06141B] border border-[#253745] text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-[#CCD0CF] mb-1.5">
                  SEO Meta Title
                </label>
                <input
                  type="text"
                  value={localSettings.seoTitle}
                  onChange={(e) => setLocalSettings({ ...localSettings, seoTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#06141B] border border-[#253745] text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-[#CCD0CF] mb-1.5">
                  SEO Meta Description
                </label>
                <textarea
                  rows={3}
                  value={localSettings.seoDescription}
                  onChange={(e) => setLocalSettings({ ...localSettings, seoDescription: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#06141B] border border-[#253745] text-xs text-white"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="md" className="gap-2 mt-4">
              <Save className="w-4 h-4" />
              <span>Save &amp; Synchronize All Settings</span>
            </Button>
          </form>
        )}
      </main>

      {/* Universal Confirmation Modal */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
