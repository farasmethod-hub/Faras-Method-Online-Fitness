import React from "react";
import { FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  className,
  icon,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-[#4A5C6A] bg-[#11212D]/40",
        className
      )}
    >
      <div className="w-14 h-14 rounded-full bg-[#253745] flex items-center justify-center text-[#9BA8AB] mb-4">
        {icon || <FolderOpen className="w-7 h-7" />}
      </div>
      <h3 className="heading-font text-lg font-bold text-[#CCD0CF] mb-1.5">{title}</h3>
      <p className="text-sm text-[#9BA8AB] max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

