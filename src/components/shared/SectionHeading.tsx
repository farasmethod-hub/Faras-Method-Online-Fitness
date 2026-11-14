import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export function SectionHeading({
  badge,
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeadingProps) {
  const alignment = {
    left: "text-left items-start",
    center: "text-center items-center mx-auto",
    right: "text-right items-end ml-auto",
  };

  return (
    <div className={cn("flex flex-col mb-12 sm:mb-16 max-w-3xl", alignment[align], className)}>
      {badge && (
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-[#CCD0CF] ios-glass-pill mb-3">
          <span className="h-1.5 w-1.5 rounded-full bg-[#CCD0CF]"></span>
          {badge}
        </span>
      )}
      <h2 className="heading-font text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#CCD0CF] uppercase">
        {title}
      </h2>
      <div className="w-16 h-0.5 bg-gradient-to-r from-[#4A5C6A] to-transparent my-3.5 rounded-full" />
      {subtitle && (
        <p className="text-base sm:text-lg text-[#9BA8AB] leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}

