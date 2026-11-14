"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Upload,
  Link2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Move,
  Maximize2,
  Crop,
  Sliders,
  Check,
  AlertCircle,
  Loader2,
  User,
  Sparkles,
} from "lucide-react";
import { ImageFitSettings } from "@/types";
import { compressImageFile } from "@/lib/imageCompression";

interface TransformationPhotoAdjusterProps {
  label: string;
  type: "before" | "after";
  imageUrl: string;
  onImageChange: (url: string) => void;
  fit: ImageFitSettings;
  onFitChange: (fit: ImageFitSettings) => void;
  weightLabel?: string;
  weightUnit?: string;
  section?: string;
}

export const DEFAULT_FIT_SETTINGS: ImageFitSettings = {
  mode: "auto",
  zoom: 1,
  panX: 50,
  panY: 50,
};

export function TransformationPhotoAdjuster({
  label,
  type,
  imageUrl,
  onImageChange,
  fit = DEFAULT_FIT_SETTINGS,
  onFitChange,
  weightLabel,
  weightUnit = "kg",
  section = "transformation",
}: TransformationPhotoAdjusterProps) {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState(imageUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mode = fit.mode || "auto";
  const zoom = fit.zoom ?? 1;
  const panX = fit.panX ?? 50;
  const panY = fit.panY ?? 50;

  // Sync url input with incoming value
  useEffect(() => {
    setUrlInput(imageUrl);
  }, [imageUrl]);

  const updateFit = (patch: Partial<ImageFitSettings>) => {
    onFitChange({
      ...DEFAULT_FIT_SETTINGS,
      ...fit,
      ...patch,
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (JPEG, PNG, WebP).");
      return;
    }

    try {
      setIsUploading(true);
      setStatusMessage("Optimizing and uploading photo from computer...");

      const compressed = await compressImageFile(file, {
        maxDimension: 1600,
        quality: 0.85,
      });

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dataUrl: compressed.dataUrl,
          section: `${section}-${type}`,
        }),
      });

      const data = await res.json();
      if (data.success && data.url) {
        setHasError(false);
        onImageChange(data.url);
        setStatusMessage("Photo uploaded successfully.");
        setTimeout(() => setStatusMessage(null), 4000);
      } else {
        onImageChange(compressed.dataUrl);
        setStatusMessage("Saved to current session.");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setStatusMessage("Upload failed. Try entering a URL directly.");
    } finally {
      setIsUploading(false);
    }
  };

  // Interactive Drag & Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (mode === "auto") return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX,
      panY,
    };
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !dragStartRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;

      // Invert delta so dragging moves image in user's direction
      const sensitivity = 100 / zoom;
      const newPanX = Math.min(100, Math.max(0, dragStartRef.current.panX - (deltaX / rect.width) * sensitivity));
      const newPanY = Math.min(100, Math.max(0, dragStartRef.current.panY - (deltaY / rect.height) * sensitivity));

      updateFit({
        panX: Math.round(newPanX),
        panY: Math.round(newPanY),
      });
    },
    [isDragging, zoom, updateFit]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragStartRef.current = null;
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Touch handlers for mobile / tablet drag
  const handleTouchStart = (e: React.TouchEvent) => {
    if (mode === "auto" || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setIsDragging(true);
    dragStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      panX,
      panY,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !dragStartRef.current || !containerRef.current || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const deltaX = touch.clientX - dragStartRef.current.x;
    const deltaY = touch.clientY - dragStartRef.current.y;

    const sensitivity = 100 / zoom;
    const newPanX = Math.min(100, Math.max(0, dragStartRef.current.panX - (deltaX / rect.width) * sensitivity));
    const newPanY = Math.min(100, Math.max(0, dragStartRef.current.panY - (deltaY / rect.height) * sensitivity));

    updateFit({
      panX: Math.round(newPanX),
      panY: Math.round(newPanY),
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  return (
    <div className="p-4 rounded-xl bg-[#06141B] border border-[#253745] space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-[#253745]">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              type === "before" ? "bg-[#9BA8AB]" : "bg-emerald-400"
            }`}
          />
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#CCD0CF]">
            {label}
          </h4>
          {weightLabel && (
            <span className="text-[10px] font-semibold text-[#9BA8AB] bg-[#11212D] px-2 py-0.5 rounded border border-[#253745]">
              {weightLabel} {weightUnit}
            </span>
          )}
        </div>

        {/* Upload & Link Buttons */}
        <div className="flex items-center gap-1.5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold bg-[#253745] hover:bg-[#4A5C6A] text-[#CCD0CF] hover:text-white transition-colors"
          >
            {isUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
            <span>Upload Photo</span>
          </button>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="p-1 rounded text-[#9BA8AB] hover:text-[#CCD0CF] hover:bg-[#11212D] transition-colors"
            title="Toggle URL Input"
          >
            <Link2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* URL Direct Input (Optional) */}
      {showUrlInput && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://... or /photos/..."
            className="flex-1 px-2.5 py-1.5 rounded text-xs bg-[#11212D] border border-[#253745] text-white focus:outline-none focus:border-[#4A5C6A]"
          />
          <button
            type="button"
            onClick={() => {
              onImageChange(urlInput);
              setHasError(false);
            }}
            className="px-3 py-1.5 rounded text-xs font-semibold bg-[#253745] text-[#CCD0CF] hover:text-white"
          >
            Apply
          </button>
        </div>
      )}

      {statusMessage && (
        <p className="text-[11px] text-emerald-400 font-medium">{statusMessage}</p>
      )}

      {/* Fit Mode Selector Pills */}
      <div>
        <label className="block text-[10px] uppercase font-bold text-[#9BA8AB] tracking-wider mb-1.5">
          Image Fit Mode
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-lg bg-[#11212D] border border-[#253745] text-[11px]">
          <button
            type="button"
            onClick={() => updateFit({ mode: "auto", zoom: 1, panX: 50, panY: 50 })}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded font-semibold transition-colors ${
              mode === "auto"
                ? "bg-[#253745] text-white shadow"
                : "text-[#9BA8AB] hover:text-[#CCD0CF]"
            }`}
            title="Fits complete image inside column with zero clipping (preserves full body)"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Auto Fit</span>
          </button>

          <button
            type="button"
            onClick={() => updateFit({ mode: "crop", zoom: 1, panX: 50, panY: 20 })}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded font-semibold transition-colors ${
              mode === "crop"
                ? "bg-[#253745] text-white shadow"
                : "text-[#9BA8AB] hover:text-[#CCD0CF]"
            }`}
            title="Fills the 3:4 column edge-to-edge with adjustable focus"
          >
            <Crop className="w-3 h-3" />
            <span>Crop to Fit</span>
          </button>

          <button
            type="button"
            onClick={() => updateFit({ mode: "manual" })}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded font-semibold transition-colors ${
              mode === "manual"
                ? "bg-[#253745] text-white shadow"
                : "text-[#9BA8AB] hover:text-[#CCD0CF]"
            }`}
            title="Freely drag, pan and zoom to center person's physique"
          >
            <Sliders className="w-3 h-3" />
            <span>Manual Position</span>
          </button>
        </div>
      </div>

      {/* Interactive Photo Canvas */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px] text-[#9BA8AB] px-0.5">
          <span>{mode === "auto" ? "Full Image Display (Unclipped)" : "Click & drag image to reposition"}</span>
          <span>Aspect 3:4 Column</span>
        </div>

        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={`relative aspect-[3/4] w-full rounded-xl overflow-hidden border border-[#253745] bg-[#06141B] select-none ${
            mode !== "auto" ? "cursor-grab active:cursor-grabbing" : "cursor-default"
          }`}
        >
          {imageUrl && !hasError ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={imageUrl}
              alt={label}
              draggable={false}
              className={`w-full h-full pointer-events-none transition-transform duration-75 ${
                mode === "auto" ? "object-contain" : "object-cover"
              }`}
              style={{
                objectPosition: `${panX}% ${panY}%`,
                transform: `scale(${zoom})`,
              }}
              onError={() => setHasError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#9BA8AB] text-xs gap-1">
              <AlertCircle className="w-5 h-5 text-[#4A5C6A]" />
              <span>{hasError ? "Unable to load image" : "No photo uploaded yet"}</span>
            </div>
          )}

          {/* Guide Overlay Grid when Adjusting */}
          {mode !== "auto" && (
            <div className="absolute inset-0 pointer-events-none border border-dashed border-[#CCD0CF]/20 grid grid-cols-3 grid-rows-3 opacity-40">
              <div className="border-r border-b border-[#CCD0CF]/20" />
              <div className="border-r border-b border-[#CCD0CF]/20" />
              <div className="border-b border-[#CCD0CF]/20" />
              <div className="border-r border-b border-[#CCD0CF]/20" />
              <div className="border-r border-b border-[#CCD0CF]/20" />
              <div className="border-b border-[#CCD0CF]/20" />
              <div className="border-r border-[#CCD0CF]/20" />
              <div className="border-r border-[#CCD0CF]/20" />
              <div />
            </div>
          )}

          {/* Position Indicator Badge */}
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#06141B]/85 backdrop-blur text-[9px] font-mono text-[#CCD0CF] border border-[#253745] pointer-events-none">
            {mode.toUpperCase()} • {zoom.toFixed(2)}x • {panX}%, {panY}%
          </div>
        </div>
      </div>

      {/* Manual Fine-Tuning Controls (Visible for Crop & Manual) */}
      {mode !== "auto" && (
        <div className="p-3 rounded-lg bg-[#11212D] border border-[#253745] space-y-3">
          {/* Zoom Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#9BA8AB]">
              <span className="flex items-center gap-1">
                <ZoomIn className="w-3 h-3 text-[#CCD0CF]" />
                Zoom Level
              </span>
              <span className="font-mono text-[#CCD0CF]">{zoom.toFixed(2)}x</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateFit({ zoom: Math.max(0.8, Number((zoom - 0.1).toFixed(2))) })}
                className="p-1 rounded bg-[#06141B] border border-[#253745] text-[#CCD0CF] hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <input
                type="range"
                min="0.8"
                max="2.5"
                step="0.05"
                value={zoom}
                onChange={(e) => updateFit({ zoom: Number(e.target.value) })}
                className="flex-1 accent-[#CCD0CF] cursor-pointer"
              />
              <button
                type="button"
                onClick={() => updateFit({ zoom: Math.min(2.5, Number((zoom + 0.1).toFixed(2))) })}
                className="p-1 rounded bg-[#06141B] border border-[#253745] text-[#CCD0CF] hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Pan X Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#9BA8AB]">
              <span className="flex items-center gap-1">
                <Move className="w-3 h-3 text-[#CCD0CF]" />
                Horizontal Pan (X)
              </span>
              <span className="font-mono text-[#CCD0CF]">{panX}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={panX}
              onChange={(e) => updateFit({ panX: Number(e.target.value) })}
              className="w-full accent-[#CCD0CF] cursor-pointer"
            />
          </div>

          {/* Pan Y Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#9BA8AB]">
              <span className="flex items-center gap-1">
                <Move className="w-3 h-3 text-[#CCD0CF]" />
                Vertical Pan (Y)
              </span>
              <span className="font-mono text-[#CCD0CF]">{panY}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={panY}
              onChange={(e) => updateFit({ panY: Number(e.target.value) })}
              className="w-full accent-[#CCD0CF] cursor-pointer"
            />
          </div>

          {/* Quick Presets Bar */}
          <div className="pt-2 border-t border-[#253745] flex flex-wrap items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => updateFit({ panX: 50, panY: 15 })}
                className="px-2 py-1 rounded text-[10px] font-semibold bg-[#06141B] border border-[#253745] text-[#CCD0CF] hover:text-white"
                title="Focus on head and torso"
              >
                Head/Upper Focus
              </button>
              <button
                type="button"
                onClick={() => updateFit({ panX: 50, panY: 50 })}
                className="px-2 py-1 rounded text-[10px] font-semibold bg-[#06141B] border border-[#253745] text-[#CCD0CF] hover:text-white"
                title="Center torso"
              >
                Centre Image
              </button>
            </div>

            <button
              type="button"
              onClick={() => updateFit({ mode: "auto", zoom: 1, panX: 50, panY: 50 })}
              className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold text-rose-400 hover:text-rose-300 hover:bg-[#06141B]"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Fit</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

