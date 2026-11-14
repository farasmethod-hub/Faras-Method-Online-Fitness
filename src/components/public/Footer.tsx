"use client";

import React from "react";
import Link from "next/link";
import { MessageCircle, Mail, ChevronUp } from "lucide-react";
import { InstagramIcon } from "@/components/shared/InstagramIcon";
import { Container } from "@/components/shared/Container";
import { Logo } from "@/components/shared/Logo";
import { useFitnessStore } from "@/lib/store";
import { buildGeneralWhatsAppUrl } from "@/lib/config";

export function Footer() {
  const { settings, trainer } = useFitnessStore();
  const whatsappUrl = buildGeneralWhatsAppUrl(
    undefined,
    settings.whatsappNumber || "8138954423",
    trainer.name || "Faras"
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#06141B] border-t border-[#4A5C6A]/60 text-xs text-[#9BA8AB] relative z-20">
      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" href="#hero" />

            <p className="text-xs text-[#CCD0CF] font-medium italic">
              &quot;Train Smart. Stay Consistent. Transform Yourself.&quot;
            </p>

            <p className="text-xs text-[#9BA8AB] leading-relaxed max-w-sm font-light">
              Evidence-based 1-on-1 online fitness coaching, structured progressive overload, and disciplined nutrition guidance by Coach {trainer.name || "Faras"}.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full ios-glass-pill flex items-center justify-center text-[#CCD0CF] hover:text-white hover:scale-105 active:scale-95 transition-all shadow-md"
                aria-label="WhatsApp Coach"
                title="WhatsApp Coach"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
              </a>

              <a
                href={trainer.instagramUrl || `https://instagram.com/${(settings.instagramHandle || "itsfarasu").replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full ios-glass-pill flex items-center justify-center text-[#CCD0CF] hover:text-white hover:scale-105 active:scale-95 transition-all shadow-md"
                aria-label="Instagram"
                title="Instagram @itsfarasu"
              >
                <InstagramIcon className="w-4 h-4 text-emerald-400" />
              </a>

              <a
                href={`mailto:${settings.contactEmail || "contact@farasmethod.com"}`}
                className="w-10 h-10 rounded-full ios-glass-pill flex items-center justify-center text-[#CCD0CF] hover:text-white hover:scale-105 active:scale-95 transition-all shadow-md"
                aria-label="Email"
                title="Email FARAS METHOD"
              >
                <Mail className="w-4 h-4 text-emerald-400" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="heading-font text-xs uppercase tracking-widest text-[#CCD0CF] font-bold mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#hero" className="hover:text-[#CCD0CF] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#CCD0CF] transition-colors">
                  About Coach {trainer.name || "Faras"}
                </a>
              </li>
              <li>
                <a href="#personal-transformation" className="hover:text-[#CCD0CF] transition-colors">
                  Faras&apos;s Transformation
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#CCD0CF] transition-colors">
                  Training Disciplines
                </a>
              </li>
              <li>
                <a href="#transformations" className="hover:text-[#CCD0CF] transition-colors">
                  Client Results
                </a>
              </li>
              <li>
                <a href="#packages" className="hover:text-[#CCD0CF] transition-colors">
                  Packages & Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="heading-font text-xs uppercase tracking-widest text-[#CCD0CF] font-bold mb-4">
              Resources & Insights
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#tips" className="hover:text-[#CCD0CF] transition-colors">
                  Fitness Tips & Guides
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#CCD0CF] transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#CCD0CF] transition-colors">
                  Intake Questionnaire
                </a>
              </li>
            </ul>
          </div>

          {/* Standards & Legal */}
          <div>
            <h4 className="heading-font text-xs uppercase tracking-widest text-[#CCD0CF] font-bold mb-4">
              Standards & Legal
            </h4>
            <p className="text-[11px] leading-relaxed text-[#9BA8AB] mb-3 font-light">
              All fitness and nutrition guidance is structured for natural muscle building, physical conditioning, and body recomposition. Consult your physician before embarking on intense training.
            </p>
            <span className="text-[10px] uppercase text-[#CCD0CF] font-semibold block">
              100% Natural • Evidence-Based Programming
            </span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#4A5C6A]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-[#9BA8AB]">
            {settings.footerCopyright ? `© ${new Date().getFullYear()} ${settings.footerCopyright}` : `© ${new Date().getFullYear()} FARAS METHOD. All rights reserved. Online Fitness Coaching.`}
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#9BA8AB] hover:text-[#CCD0CF] transition-colors"
          >
            <span>Back To Top</span>
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      </Container>
    </footer>
  );
}

