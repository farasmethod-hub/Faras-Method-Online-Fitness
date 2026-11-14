"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "glass" | "liquid" | "bordered" | "accent";
  hoverable?: boolean;
}

export function Card({
  children,
  className,
  variant = "liquid",
  hoverable = true,
  onPointerMove,
  onPointerLeave,
  ...props
}: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (card) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
      card.style.setProperty("--card-glow", "1");
    }
    if (onPointerMove) onPointerMove(e);
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (card) {
      card.style.setProperty("--card-glow", "0");
    }
    if (onPointerLeave) onPointerLeave(e);
  };

  const variantStyles = {
    default: "ios-glass ios-glass-interactive",
    liquid: "ios-glass ios-glass-interactive",
    glass: "ios-glass ios-glass-interactive",
    bordered: "ios-glass ios-glass-interactive border-[rgba(204,208,207,0.18)]",
    accent: "ios-glass border border-[#CCD0CF] shadow-2xl shadow-black/60",
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn(
        "p-6 sm:p-7 rounded-2xl transition-all duration-300",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-4 flex flex-col space-y-1.5", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("heading-font text-xl font-bold tracking-wide text-[#CCD0CF]", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-[#9BA8AB] leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mt-6 flex items-center justify-between pt-4 border-t border-[#253745]", className)} {...props}>
      {children}
    </div>
  );
}
