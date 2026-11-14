"use client";

import React, { useState } from "react";
import { Megaphone, X, ArrowRight } from "lucide-react";
import { useFitnessStore } from "@/lib/store";

export function Announcements() {
  const { announcements } = useFitnessStore();
  const [isDismissed, setIsDismissed] = useState(false);

  const activeAnnouncement = announcements.find((a) => a.isActive);

  if (!activeAnnouncement || isDismissed) return null;

  return (
    <div className="relative bg-[#11212D] border-b border-[#4A5C6A] py-2.5 px-4 text-xs text-[#CCD0CF] z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 mx-auto text-center overflow-hidden">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#CCD0CF] text-[#06141B] shrink-0">
            <Megaphone className="w-3 h-3" />
            {activeAnnouncement.badge}
          </span>
          <span className="font-medium text-white truncate">
            {activeAnnouncement.title}:
          </span>
          <span className="text-[#9BA8AB] hidden sm:inline truncate max-w-md">
            {activeAnnouncement.content}
          </span>
          {activeAnnouncement.linkUrl && (
            <a
              href={activeAnnouncement.linkUrl}
              className="text-[#CCD0CF] hover:text-white font-bold inline-flex items-center gap-0.5 shrink-0 ml-1 underline"
            >
              <span>Explore</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          )}
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="text-[#9BA8AB] hover:text-white p-1 shrink-0"
          aria-label="Dismiss announcement banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

