import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

export function LoadingSpinner({
  size = "md",
  className,
  label = "Loading...",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center p-8 gap-3", className)}>
      <div
        className={cn(
          "rounded-full border-[#4A5C6A] border-t-[#CCD0CF] animate-spin",
          sizeClasses[size]
        )}
      ></div>
      {label && <p className="text-xs uppercase tracking-widest text-[#9BA8AB]">{label}</p>}
    </div>
  );
}

