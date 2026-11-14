"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Home,
  User,
  Dumbbell,
  TrendingUp,
  Package as PackageIcon,
  BookOpen,
  MessageCircle,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { useFitnessStore } from "@/lib/store";
import { buildGeneralWhatsAppUrl } from "@/lib/config";
import { Logo } from "@/components/shared/Logo";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { name: "Home", href: "#hero", icon: Home },
  { name: "About", href: "#about", icon: User },
  { name: "Training", href: "#services", icon: Dumbbell },
  { name: "Results", href: "#transformations", icon: TrendingUp },
  { name: "Packages", href: "#packages", icon: PackageIcon },
  { name: "Tips", href: "#tips", icon: BookOpen },
  { name: "Contact", href: "#contact", icon: MessageCircle },
];

export function LiquidGlassNav() {
  const { isScrolled } = useScrollPosition();
  const { settings } = useFitnessStore();
  const [activeIdx, setActiveIdx] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Physics animation state
  const stateRef = useRef({
    x: 0,
    target: 0,
    v: 0,
    width: 80,
    targetWidth: 80,
    hover: false,
    near: 0,
    tilt: 0,
    tiltT: 0,
  });

  const updateActiveByScroll = () => {
    const scrollPos = window.scrollY + 140;
    NAV_ITEMS.forEach((item, idx) => {
      const el = document.querySelector(item.href);
      if (el) {
        const top = (el as HTMLElement).offsetTop;
        const height = (el as HTMLElement).offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          setActiveIdx(idx);
        }
      }
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", updateActiveByScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateActiveByScroll);
  }, []);

  // Initialize lens position and physics loop
  useEffect(() => {
    const nav = navRef.current;
    const lens = lensRef.current;
    if (!nav || !lens) return;

    let animId: number;

    const getCenterAndWidth = (idx: number) => {
      const item = itemRefs.current[idx];
      if (!item) return { cx: 40, w: 80 };
      return {
        cx: item.offsetLeft + item.offsetWidth / 2,
        w: item.offsetWidth,
      };
    };

    const initial = getCenterAndWidth(activeIdx);
    stateRef.current.x = initial.cx;
    stateRef.current.target = initial.cx;
    stateRef.current.width = initial.w;
    stateRef.current.targetWidth = initial.w;

    const loop = () => {
      const st = stateRef.current;
      const k = st.hover ? 0.16 : 0.12;
      const dmp = st.hover ? 0.72 : 0.68;

      if (!st.hover) {
        const cur = getCenterAndWidth(activeIdx);
        st.target = cur.cx;
        st.targetWidth = cur.w;
      }

      // Spring physics for position
      st.v = (st.v + (st.target - st.x) * k) * dmp;
      st.x += st.v;

      // Spring interpolation for width
      st.width += (st.targetWidth - st.width) * 0.15;

      // 3D Perspective tilt
      st.tilt += (st.tiltT - st.tilt) * 0.12;
      nav.style.transform = `perspective(800px) rotateY(${st.tilt}deg)`;

      // Dynamic stretch on fast movement
      const stretch = Math.min(0.35, Math.abs(st.v) / 45);
      lens.style.width = `${st.width}px`;
      lens.style.transform = `translateX(${st.x - st.width / 2}px) scaleX(${1 + stretch}) scaleY(${1 - stretch * 0.35})`;

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animId);
  }, [activeIdx]);

  // Pointer interaction handlers
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const nav = navRef.current;
    if (!nav) return;
    const rect = nav.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    nav.style.setProperty("--mx", `${px}px`);
    nav.style.setProperty("--my", `${py}px`);
    nav.style.setProperty("--glow", "1");

    stateRef.current.hover = true;
    stateRef.current.tiltT = (px / rect.width - 0.5) * 8;

    // Find nearest item
    let nearestIdx = 0;
    let minDiff = Infinity;
    itemRefs.current.forEach((item, idx) => {
      if (!item) return;
      const cx = item.offsetLeft + item.offsetWidth / 2;
      const diff = Math.abs(cx - px);
      if (diff < minDiff) {
        minDiff = diff;
        nearestIdx = idx;
      }
    });

    stateRef.current.near = nearestIdx;
    const nearestItem = itemRefs.current[nearestIdx];
    if (nearestItem) {
      stateRef.current.target = nearestItem.offsetLeft + nearestItem.offsetWidth / 2;
      stateRef.current.targetWidth = nearestItem.offsetWidth;
    }
  };

  const handlePointerLeave = () => {
    const nav = navRef.current;
    if (nav) {
      nav.style.setProperty("--glow", "0");
    }
    stateRef.current.hover = false;
    stateRef.current.tiltT = 0;
  };

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string, idx: number) => {
    e.preventDefault();
    setActiveIdx(idx);
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const navOffset = 90;
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
    <header className="fixed top-0 left-0 right-0 z-50 py-3 px-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo in iOS Glass Pill */}
        <div className="px-4 py-2 rounded-full ios-glass border border-[rgba(204,208,207,0.15)] shadow-xl shadow-black/50 shrink-0">
          <Logo size="sm" href="#hero" />
        </div>

        {/* Center: Interactive Liquid Glass Navigation Dock (Desktop) */}
        <div className="hidden lg:flex items-center justify-center">
          <nav
            ref={navRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            className="liquid-nav-container"
          >
            {/* The Liquid Lens that glides across tabs */}
            <div ref={lensRef} className="liquid-lens" />

            {/* Nav items */}
            {NAV_ITEMS.map((item, idx) => {
              const Icon = item.icon;
              const isActive = activeIdx === idx;
              return (
                <a
                  key={item.name}
                  ref={(el) => {
                    itemRefs.current[idx] = el;
                  }}
                  href={item.href}
                  onClick={(e) => handleScrollTo(e, item.href, idx)}
                  className={`liquid-nav-item ${isActive ? "active text-[#CCD0CF]" : ""}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.name}</span>
                </a>
              );
            })}
          </nav>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2.5">
          {/* iOS Tactile Glass WhatsApp Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass-btn liquid-glass-btn-primary px-4 py-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider select-none shrink-0"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span className="hidden sm:inline">WhatsApp Coach</span>
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-full ios-glass-pill text-[#CCD0CF] hover:text-white transition-all active:scale-95"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile iOS Glass Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 max-w-md mx-auto rounded-2xl ios-glass border border-[rgba(204,208,207,0.18)] p-4 shadow-2xl animate-in slide-in-from-top-3 duration-200">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {NAV_ITEMS.map((item, idx) => {
              const Icon = item.icon;
              const isActive = activeIdx === idx;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleScrollTo(e, item.href, idx)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                    isActive
                      ? "bg-[#253745] text-[#CCD0CF] border border-[rgba(204,208,207,0.22)] shadow-md"
                      : "text-[#9BA8AB] bg-[#11212D]/60 hover:text-white hover:bg-[#11212D]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </a>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[rgba(204,208,207,0.1)] flex items-center justify-between gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-[#CCD0CF] text-[#06141B] text-xs font-bold text-center flex items-center justify-center gap-2 shadow-md uppercase tracking-wider hover:bg-white active:scale-95 transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

