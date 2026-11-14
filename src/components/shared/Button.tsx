import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "whatsapp" | "ghost" | "danger" | "liquid";
  size?: "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-bold tracking-wider transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#06141B] disabled:opacity-50 disabled:cursor-not-allowed uppercase text-xs select-none rounded-full";

    const variants = {
      primary:
        "liquid-glass-btn liquid-glass-btn-primary active:scale-[0.97]",
      liquid:
        "liquid-glass-btn liquid-glass-btn-primary active:scale-[0.97]",
      secondary:
        "liquid-glass-btn liquid-glass-btn-secondary active:scale-[0.97]",
      outline:
        "bg-transparent text-[#CCD0CF] border border-[#4A5C6A] hover:bg-[#253745] hover:border-[#CCD0CF] hover:text-white backdrop-blur-md focus:ring-[#CCD0CF]",
      whatsapp:
        "liquid-glass-btn liquid-glass-btn-whatsapp active:scale-[0.97]",
      ghost:
        "bg-transparent text-[#9BA8AB] hover:text-[#CCD0CF] hover:bg-[#253745]/60 focus:ring-[#4A5C6A]",
      danger:
        "bg-rose-900/80 text-[#CCD0CF] border border-rose-700/80 font-semibold hover:bg-rose-800 focus:ring-rose-500 active:scale-[0.98]",
    };

    const sizes = {
      sm: "px-3.5 py-1.5 text-[11px]",
      md: "px-5 py-2.5 text-xs",
      lg: "px-7 py-3 text-sm tracking-widest",
      xl: "px-9 py-4 text-base font-extrabold tracking-widest",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2.5 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
