"use client";

import React, { useState } from "react";
import { ArrowLeftRight, TrendingDown, Clock, Target, ChevronDown, ChevronUp, Columns, Layers } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Badge } from "@/components/shared/Badge";
import { useFitnessStore } from "@/lib/store";
import { Transformation, ImageFitSettings } from "@/types";

interface BeforeAfterComparisonProps {
  beforeImage: string;
  afterImage: string;
  clientName: string;
  startingWeight?: number | string;
  currentWeight?: number | string;
  weightUnit?: string;
  beforeFit?: ImageFitSettings;
  afterFit?: ImageFitSettings;
}

function BeforeAfterComparison({
  beforeImage,
  afterImage,
  clientName,
  startingWeight,
  currentWeight,
  weightUnit = "kg",
  beforeFit,
  afterFit,
}: BeforeAfterComparisonProps) {
  // "side-by-side" (default on desktop/tablet), "slider" (interactive overlay comparison)
  const [viewMode, setViewMode] = useState<"side-by-side" | "slider">("side-by-side");
  const [sliderPosition, setSliderPosition] = useState(50);
  const [beforeError, setBeforeError] = useState(false);
  const [afterError, setAfterError] = useState(false);

  const getFitStyle = (fit?: ImageFitSettings) => {
    const mode = fit?.mode || "auto";
    const zoom = fit?.zoom ?? 1;
    const panX = fit?.panX ?? 50;
    const panY = fit?.panY ?? 50;

    return {
      className: `w-full h-full transition-transform duration-300 ${
        mode === "auto" ? "object-contain" : "object-cover"
      }`,
      style: {
        objectPosition: `${panX}% ${panY}%`,
        transform: `scale(${zoom})`,
      },
    };
  };

  const beforeStyle = getFitStyle(beforeFit);
  const afterStyle = getFitStyle(afterFit);

  return (
    <div className="space-y-3">
      {/* View Switcher Pill Header */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] uppercase font-bold text-[#9BA8AB] tracking-wider">
          Visual Comparison
        </span>
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#06141B] border border-[#253745] text-[11px]">
          <button
            type="button"
            onClick={() => setViewMode("side-by-side")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded font-semibold transition-colors ${
              viewMode === "side-by-side"
                ? "bg-[#253745] text-[#CCD0CF] shadow"
                : "text-[#9BA8AB] hover:text-white"
            }`}
          >
            <Columns className="w-3 h-3" />
            <span>Side-by-Side</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("slider")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded font-semibold transition-colors ${
              viewMode === "slider"
                ? "bg-[#253745] text-[#CCD0CF] shadow"
                : "text-[#9BA8AB] hover:text-white"
            }`}
          >
            <ArrowLeftRight className="w-3 h-3" />
            <span>Interactive Slider</span>
          </button>
        </div>
      </div>

      {viewMode === "side-by-side" ? (
        /* Equal 50% width columns on sm+ with stacked fallback on mobile to prevent narrow squeezing */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* BEFORE COLUMN */}
          <div className="flex flex-col">
            {/* Dedicated Label Placed Clearly Above the Photo */}
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#9BA8AB] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#9BA8AB]" />
                BEFORE
              </span>
              {startingWeight && (
                <span className="text-[11px] font-semibold text-[#CCD0CF] bg-[#06141B] px-2 py-0.5 rounded border border-[#253745]">
                  {startingWeight} {weightUnit}
                </span>
              )}
            </div>

            {/* Photo Container: 50% width, aspect-[3/4] ensures head-to-toe physique visibility */}
            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden border border-[#253745] bg-[#06141B] group shadow-inner">
              {beforeImage && !beforeError ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={beforeImage}
                  alt={`${clientName} Before Transformation`}
                  className={beforeStyle.className}
                  style={beforeStyle.style}
                  onError={() => setBeforeError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#9BA8AB] text-xs">
                  Photo Pending
                </div>
              )}
            </div>
          </div>

          {/* AFTER COLUMN */}
          <div className="flex flex-col">
            {/* Dedicated Label Placed Clearly Above the Photo */}
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#CCD0CF] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                AFTER
              </span>
              {currentWeight && (
                <span className="text-[11px] font-semibold text-emerald-400 bg-[#06141B] px-2 py-0.5 rounded border border-[#253745]">
                  {currentWeight} {weightUnit}
                </span>
              )}
            </div>

            {/* Photo Container: 50% width, aspect-[3/4] ensures head-to-toe physique visibility */}
            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden border border-[#253745] bg-[#06141B] group shadow-inner">
              {afterImage && !afterError ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={afterImage}
                  alt={`${clientName} After Transformation`}
                  className={afterStyle.className}
                  style={afterStyle.style}
                  onError={() => setAfterError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#9BA8AB] text-xs">
                  Photo Pending
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Interactive Overlay Slider with Labels Above */
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1 text-[11px] font-semibold text-[#9BA8AB]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#9BA8AB]" />
              BEFORE {startingWeight ? `(${startingWeight} ${weightUnit})` : ""}
            </span>
            <span className="flex items-center gap-1.5 text-[#CCD0CF]">
              AFTER {currentWeight ? `(${currentWeight} ${weightUnit})` : ""}
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </span>
          </div>

          <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] rounded-xl overflow-hidden select-none border border-[#253745] bg-[#06141B] shadow-inner">
            {/* AFTER Image (Background) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={afterImage}
              alt={`${clientName} After Transformation`}
              className={afterStyle.className}
              style={afterStyle.style}
            />
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-[#06141B]/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-[#CCD0CF] border border-[#4A5C6A]">
              AFTER
            </div>

            {/* BEFORE Image (Clipped Overlay) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <div className="relative w-full h-full min-w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={beforeImage}
                  alt={`${clientName} Before Transformation`}
                  className={beforeStyle.className}
                  style={beforeStyle.style}
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#06141B]/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-[#9BA8AB] border border-[#4A5C6A]">
                  BEFORE
                </div>
              </div>
            </div>

            {/* Slider Dividing Line & Knob */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-[#CCD0CF] shadow-md pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#CCD0CF] text-[#06141B] flex items-center justify-center shadow-lg">
                <ArrowLeftRight className="w-4 h-4" />
              </div>
            </div>

            {/* Drag Input */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
              aria-label="Drag before and after transformation slider"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function Transformations() {
  const { transformations } = useFitnessStore();
  const [expandedStoryId, setExpandedStoryId] = useState<string | null>(null);

  const toggleStory = (id: string) => {
    setExpandedStoryId(expandedStoryId === id ? null : id);
  };

  return (
    <section id="transformations" className="py-24 bg-[#06141B] relative border-t border-[#4A5C6A]/50">
      {/* 
        EXPANDED CONTAINER:
        92-95% available viewport width, capped at 1500px.
        Removes narrow 1280px container constraint so transformation cards can breathe.
      */}
      <div className="w-[92%] sm:w-[94%] max-w-[1500px] mx-auto px-2 sm:px-4 lg:px-6">
        <SectionHeading
          badge="Transformations"
          title="Client Results & Progress"
          subtitle="Real transformations achieved through structured progressive overload, disciplined nutrition protocols, and weekly 1-on-1 accountability."
        />

        {/* Notice of sample illustrative data */}
        <div className="max-w-2xl mx-auto mb-12 p-3.5 px-6 rounded-full ios-glass border border-[rgba(204,208,207,0.14)] text-center shadow-lg shadow-black/20">
          <p className="text-xs text-[#9BA8AB]">
            <span className="text-[#CCD0CF] font-bold uppercase tracking-wider mr-1.5">Note:</span>
            Client transformation case studies are displayed for illustration. Client results vary based on starting point, consistency, and adherence to programming.
          </p>
        </div>

        {/* 
          TRANSFORMATION CARDS GRID:
          Desktop (lg+): 2 wide cards per row (approx. 650px - 720px wide each).
          Inside each card, Before and After photos sit side by side at 50% width each.
          Tablet (md): 1 wide card per row (approx. 720px wide) with photos side by side.
          Mobile (<sm): 1 card per row with stacked photos or interactive slider to prevent narrow squeezing.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-10">
          {transformations.map((item) => {
            const isExpanded = expandedStoryId === item.id;
            return (
              <div
                key={item.id}
                className="rounded-3xl ios-glass border border-[rgba(204,208,207,0.14)] p-6 sm:p-8 flex flex-col justify-between shadow-2xl shadow-black/40 transition-all duration-300 hover:border-[rgba(204,208,207,0.28)]"
              >
                <div>
                  {/* Client Header Info */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-[rgba(204,208,207,0.1)]">
                    <div>
                      <h3 className="heading-font text-xl sm:text-2xl font-black text-[#CCD0CF] tracking-wide">
                        {item.clientName}
                      </h3>
                      <p className="text-xs text-[#9BA8AB] mt-0.5 flex items-center gap-2">
                        <span>{item.age} Years Old</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#CCD0CF]" />
                          {item.duration}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs px-2.5 py-1 border-[rgba(204,208,207,0.18)] text-[#CCD0CF] bg-[#06141B]/60">
                        <Target className="w-3 h-3 mr-1 text-emerald-400" />
                        {item.fitnessGoal}
                      </Badge>
                    </div>
                  </div>

                  {/* Before/After Dual-Mode Comparison with Labels Clearly Above Photos */}
                  <BeforeAfterComparison
                    beforeImage={item.beforeImage}
                    afterImage={item.afterImage}
                    clientName={item.clientName}
                    startingWeight={item.startingWeight}
                    currentWeight={item.currentWeight}
                    weightUnit={item.weightUnit}
                    beforeFit={item.beforeFit}
                    afterFit={item.afterFit}
                  />

                  {/* Quantitative Stats Row */}
                  <div className="grid grid-cols-3 gap-2 p-3.5 sm:p-4 rounded-2xl bg-[#06141B]/70 border border-[rgba(204,208,207,0.1)] text-center my-5 shadow-inner">
                    <div>
                      <span className="text-[10px] sm:text-[11px] uppercase font-bold text-[#9BA8AB] tracking-wider block">
                        Starting Weight
                      </span>
                      <strong className="heading-font text-base sm:text-lg text-white">
                        {item.startingWeight} {item.weightUnit}
                      </strong>
                    </div>

                    <div className="border-x border-[rgba(204,208,207,0.1)]">
                      <span className="text-[10px] sm:text-[11px] uppercase font-bold text-[#CCD0CF] tracking-wider block">
                        Current Weight
                      </span>
                      <strong className="heading-font text-base sm:text-lg text-emerald-400">
                        {item.currentWeight} {item.weightUnit}
                      </strong>
                    </div>

                    <div>
                      <span className="text-[10px] sm:text-[11px] uppercase font-bold text-[#CCD0CF] tracking-wider block flex items-center justify-center gap-1">
                        <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                        Total Loss
                      </span>
                      <strong className="heading-font text-base sm:text-lg text-[#CCD0CF]">
                        -{item.weightDiff} {item.weightUnit}
                      </strong>
                    </div>
                  </div>

                  {/* Client Story Quote */}
                  <div className="text-xs sm:text-sm text-[#9BA8AB] leading-relaxed font-normal bg-[#06141B]/50 p-4 rounded-2xl border border-[rgba(204,208,207,0.08)]">
                    <p className={isExpanded ? "" : "line-clamp-2"}>
                      &ldquo;{item.story}&rdquo;
                    </p>
                  </div>
                </div>

                {/* View Full Story Toggle */}
                <div className="pt-4 mt-4 border-t border-[rgba(204,208,207,0.1)]">
                  <button
                    onClick={() => toggleStory(item.id)}
                    className="w-full text-xs font-semibold text-[#CCD0CF] hover:text-white flex items-center justify-center gap-1.5 transition-colors py-1"
                  >
                    <span>{isExpanded ? "Collapse Story" : "View Full Transformation Story"}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
