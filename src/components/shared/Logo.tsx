"use client";

import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  isLink?: boolean;
  href?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({
  className = "",
  isLink = true,
  href = "#hero",
  size = "md",
}: LogoProps) {
  const content = (
    <div className={`flex flex-col select-none group ${className}`}>
      {/* Primary Brand Text */}
      <span
        className={`heading-font font-black tracking-wider text-[#CCD0CF] group-hover:text-white transition-colors leading-none ${
          size === "sm"
            ? "text-base sm:text-lg"
            : size === "lg"
            ? "text-2xl sm:text-3xl"
            : "text-lg sm:text-xl"
        }`}
      >
        FARAS METHOD
      </span>

      {/* Secondary Subtitle */}
      <span
        className={`tracking-[0.22em] text-[#9BA8AB] uppercase font-bold mt-1 ${
          size === "sm"
            ? "text-[8px]"
            : size === "lg"
            ? "text-[11px]"
            : "text-[9px]"
        }`}
      >
        ONLINE FITNESS COACHING
      </span>
    </div>
  );

  if (isLink) {
    return (
      <Link href={href} aria-label="FARAS METHOD - Online Fitness Coaching">
        {content}
      </Link>
    );
  }

  return content;
}

