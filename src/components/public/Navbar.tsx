"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, MessageCircle, ShieldCheck } from "lucide-react";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { Button } from "@/components/shared/Button";
import { useFitnessStore } from "@/lib/store";
import { buildGeneralWhatsAppUrl } from "@/lib/config";
import { Logo } from "@/components/shared/Logo";

const NAV_LINKS = [
  { name: "Home", href: "#hero" },
  { name: "About", href: "#about" },
  { name: "Training", href: "#services" },
  { name: "Transformations", href: "#transformations" },
  { name: "Packages", href: "#packages" },
  { name: "Fitness Tips", href: "#tips" },
  { name: "FAQ", href: "#faq" },
  { name: "Contact", href: "#contact" },
];

export function Navbar() {
  const { isScrolled } = useScrollPosition();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings } = useFitnessStore();

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const navOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const whatsappUrl = buildGeneralWhatsAppUrl();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#06141B]/90 backdrop-blur-md border-b border-[#253745]/80 py-3.5 shadow-lg shadow-black/20"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="shrink-0">
          <Logo size="sm" href="#hero" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-7">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="text-xs uppercase tracking-widest font-medium text-[#9BA8AB] hover:text-[#CCD0CF] transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right CTA / WhatsApp */}
        <div className="hidden sm:flex items-center gap-3">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="primary" size="sm" className="gap-2">
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Coach</span>
            </Button>
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-[#11212D] border border-[#253745] text-[#CCD0CF] hover:text-white focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#06141B]/95 backdrop-blur-xl border-b border-[#253745] px-4 pt-4 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className="px-3 py-2.5 rounded-md text-sm uppercase tracking-wider font-semibold text-[#CCD0CF] hover:bg-[#253745] hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-[#253745] flex flex-col gap-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button variant="primary" size="md" className="w-full gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </Button>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

