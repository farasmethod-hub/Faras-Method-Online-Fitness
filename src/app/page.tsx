import React from "react";
import { LiquidGlassNav } from "@/components/public/LiquidGlassNav";
import { Hero } from "@/components/public/Hero";
import { Stats } from "@/components/public/Stats";
import { About } from "@/components/public/About";
import { PersonalTransformation } from "@/components/public/PersonalTransformation";
import { Services } from "@/components/public/Services";
import { HowItWorks } from "@/components/public/HowItWorks";
import { GoalSelector } from "@/components/public/GoalSelector";
import { Packages } from "@/components/public/Packages";
import { Transformations } from "@/components/public/Transformations";
import { FitnessTips } from "@/components/public/FitnessTips";
import { InstagramFeed } from "@/components/public/InstagramFeed";
import { FAQ } from "@/components/public/FAQ";
import { ConsultationForm } from "@/components/public/ConsultationForm";
import { FloatingWhatsApp } from "@/components/public/FloatingWhatsApp";
import { Footer } from "@/components/public/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#06141B] text-[#CCD0CF] relative selection:bg-[#CCD0CF] selection:text-[#06141B]">
      {/* Floating Liquid Glass Navigation Bar with Physics Tracking Lens */}
      <LiquidGlassNav />

      {/* Hero Section */}
      <Hero />

      {/* Quantitative Fitness Stats */}
      <Stats />

      {/* About The Coach */}
      <About />

      {/* Coach Faras's Personal Transformation (56kg -> 69kg) */}
      <PersonalTransformation />

      {/* Training Services */}
      <Services />

      {/* How Online Coaching Works (4-Step Flow) */}
      <HowItWorks />

      {/* Interactive Goal Selector */}
      <GoalSelector />

      {/* Packages & Comparison Table */}
      <Packages />

      {/* Client Transformations with Before/After Slider */}
      <Transformations />

      {/* Fitness Tips & Knowledge Base */}
      <FitnessTips />

      {/* Instagram Community Feed */}
      <InstagramFeed />

      {/* Frequently Asked Questions */}
      <FAQ />

      {/* 1-on-1 Consultation Questionnaire */}
      <ConsultationForm />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp />

      {/* Site Footer */}
      <Footer />
    </main>
  );
}

