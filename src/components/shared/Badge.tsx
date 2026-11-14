import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "popular" | "success" | "warning" | "outline";
}

export function Badge({
  children,
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variants = {
    default: "ios-glass-pill text-[#CCD0CF] text-[11px]",
    popular: "bg-[#CCD0CF] text-[#06141B] font-bold border border-white shadow-md shadow-white/10 text-[11px]",
    success: "ios-glass-pill text-emerald-400 border-emerald-500/30 text-[11px]",
    warning: "ios-glass-pill text-amber-400 border-amber-500/30 text-[11px]",
    outline: "border border-[rgba(204,208,207,0.18)] text-[#9BA8AB] bg-transparent backdrop-blur-md text-[11px]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wider uppercase",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

