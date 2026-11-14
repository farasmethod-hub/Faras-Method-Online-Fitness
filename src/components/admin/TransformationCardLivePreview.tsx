"use client";

import React from "react";
import { TrendingDown, Clock, Target, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/shared/Badge";
import { ImageFitSettings, Transformation } from "@/types";

interface TransformationCardLivePreviewProps {
  transformation: Partial<Transformation>;
}

export function TransformationCardLivePreview({ transformation }: TransformationCardLivePreviewProps) {
  const {
    clientName = "Client Name",
    age = 30,
    startingWeight = 90,
    currentWeight = 75,
    weightDiff = 15,
    weightUnit = "kg",
    duration = "16 Weeks",
    fitnessGoal = "Fat Loss & Conditioning",
    story = "Client transformation story and feedback will appear here.",
    beforeImage = "",
    afterImage = "",
    beforeFit = { mode: "auto", zoom: 1, panX: 50, panY: 50 },
    afterFit = { mode: "auto", zoom: 1, panX: 50, panY: 50 },
  } = transformation;

  const renderFitStyle = (fit: ImageFitSettings = { mode: "auto", zoom: 1, panX: 50, panY: 50 }) => {
    const mode = fit.mode || "auto";
    const zoom = fit.zoom ?? 1;
    const panX = fit.panX ?? 50;
    const panY = fit.panY ?? 50;

    return {
      className: `w-full h-full select-none transition-transform duration-100 ${
        mode === "auto" ? "object-contain" : "object-cover"
      }`,
      style: {
        objectPosition: `${panX}% ${panY}%`,
        transform: `scale(${zoom})`,
      },
    };
  };

  const beforeStyle = renderFitStyle(beforeFit);
  const afterStyle = renderFitStyle(afterFit);

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[#11212D] border border-[#253745] shadow-2xl shadow-black/50 space-y-5">
      {/* Live Badge */}
      <div className="flex items-center justify-between pb-3 border-b border-[#253745]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
            Live Public Card Preview
          </span>
        </div>
        <span className="text-[10px] text-[#9BA8AB]">
          Matches exact public site appearance &amp; layout
        </span>
      </div>

      {/* Client Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="heading-font text-lg sm:text-xl font-black text-[#CCD0CF] tracking-wide">
            {clientName || "Client Name"}
          </h3>
          <p className="text-xs text-[#9BA8AB] mt-0.5 flex items-center gap-2">
            <span>{age} Years Old</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#CCD0CF]" />
              {duration}
            </span>
          </p>
        </div>

        <Badge variant="outline" className="text-xs px-2.5 py-1 border-[#4A5C6A] text-[#CCD0CF] bg-[#06141B]">
          <Target className="w-3 h-3 mr-1 text-emerald-400" />
          {fitnessGoal}
        </Badge>
      </div>

      {/* Side-by-Side Equal 50/50 Columns */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* BEFORE COLUMN */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-1 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#9BA8AB] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9BA8AB]" />
              BEFORE
            </span>
            <span className="text-[10px] font-semibold text-[#CCD0CF] bg-[#06141B] px-2 py-0.5 rounded border border-[#253745]">
              {startingWeight} {weightUnit}
            </span>
          </div>

          <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden border border-[#253745] bg-[#06141B]">
            {beforeImage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={beforeImage}
                alt="Before Preview"
                className={beforeStyle.className}
                style={beforeStyle.style}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#9BA8AB] text-xs">
                Before Photo
              </div>
            )}
            <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#06141B]/80 text-[8px] font-mono text-[#9BA8AB] uppercase">
              {beforeFit?.mode || "auto"}
            </div>
          </div>
        </div>

        {/* AFTER COLUMN */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-1 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#CCD0CF] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              AFTER
            </span>
            <span className="text-[10px] font-semibold text-emerald-400 bg-[#06141B] px-2 py-0.5 rounded border border-[#253745]">
              {currentWeight} {weightUnit}
            </span>
          </div>

          <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden border border-[#253745] bg-[#06141B]">
            {afterImage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={afterImage}
                alt="After Preview"
                className={afterStyle.className}
                style={afterStyle.style}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#9BA8AB] text-xs">
                After Photo
              </div>
            )}
            <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#06141B]/80 text-[8px] font-mono text-[#9BA8AB] uppercase">
              {afterFit?.mode || "auto"}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#06141B] border border-[#253745] text-center">
        <div>
          <span className="text-[9px] uppercase font-bold text-[#9BA8AB] tracking-wider block">
            Starting
          </span>
          <strong className="heading-font text-sm text-white">
            {startingWeight} {weightUnit}
          </strong>
        </div>

        <div className="border-x border-[#253745]">
          <span className="text-[9px] uppercase font-bold text-[#CCD0CF] tracking-wider block">
            Current
          </span>
          <strong className="heading-font text-sm text-emerald-400">
            {currentWeight} {weightUnit}
          </strong>
        </div>

        <div>
          <span className="text-[9px] uppercase font-bold text-[#CCD0CF] tracking-wider block flex items-center justify-center gap-1">
            <TrendingDown className="w-3 h-3 text-emerald-400" />
            Total Loss
          </span>
          <strong className="heading-font text-sm text-[#CCD0CF]">
            -{weightDiff} {weightUnit}
          </strong>
        </div>
      </div>

      {/* Story Quote Preview */}
      <div className="text-xs text-[#9BA8AB] leading-relaxed bg-[#06141B]/50 p-3 rounded-xl border border-[#253745]/70 italic line-clamp-2">
        &ldquo;{story}&rdquo;
      </div>
    </div>
  );
}

