"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Upload, Link2, X, Eye, Image as ImageIcon, AlertCircle, Loader2, CheckCircle2, RotateCcw } from "lucide-react";
import { compressImageFile } from "@/lib/imageCompression";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  section?: string;
  previewAspect?: "video" | "square" | "portrait" | "banner";
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  onSave?: (url: string) => void;
  onCancel?: () => void;
  showSaveButton?: boolean;
}

export function ImageUploadField({
  label,
  value,
  onChange,
  onRemove,
  section = "general",
  previewAspect = "video",
  placeholder = "https://... or /photos/...",
  helpText,
  required = false,
  onSave,
  onCancel,
  showSaveButton = false,
}: ImageUploadFieldProps) {
  const [hasError, setHasError] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [previousUrl, setPreviousUrl] = useState<string>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectClass = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[4/5]",
    banner: "aspect-[21/9]",
  }[previewAspect];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (JPEG, PNG, WebP).");
      return;
    }

    // Save previous URL for revert/cancel
    setPreviousUrl(value);

    try {
      setIsUploading(true);
      setStatusMessage("Optimizing & uploading image from computer...");

      // 1. Client-side compression to web resolution
      const compResult = await compressImageFile(file, {
        maxDimension: 1400,
        quality: 0.82,
      });

      // 2. Upload to server-side endpoint (/api/upload)
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dataUrl: compResult.dataUrl,
          section: section || "general",
        }),
      });

      const uploadData = await uploadRes.json();

      if (uploadData.success && uploadData.url) {
        setHasError(false);
        onChange(uploadData.url);
        setStatusMessage(`Image uploaded successfully (${uploadData.filename})`);

        if (onSave) {
          onSave(uploadData.url);
        }

        setTimeout(() => {
          setStatusMessage(null);
        }, 5000);
      } else {
        // Fallback to dataUrl if upload endpoint fails
        onChange(compResult.dataUrl);
        setStatusMessage("Image saved to local session.");
      }
    } catch (err: any) {
      console.error("[Image Upload Error]", err);
      setHasError(true);
      setStatusMessage("Upload failed. Please check network or file format.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRevert = () => {
    onChange(previousUrl);
    setHasError(false);
    setStatusMessage("Reverted to previous photo.");
    setTimeout(() => setStatusMessage(null), 3000);
    if (onCancel) onCancel();
  };

  const handleRemove = () => {
    setPreviousUrl(value);
    onChange("");
    setHasError(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setStatusMessage("Photo removed.");
    setTimeout(() => setStatusMessage(null), 3000);
    if (onRemove) onRemove();
  };

  return (
    <div className="space-y-2 p-3.5 rounded-xl bg-[#06141B]/70 border border-[#253745]">
      {/* Field Label & Top Actions */}
      <div className="flex items-center justify-between">
        <label className="block text-[11px] uppercase tracking-wider font-bold text-[#CCD0CF]">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
        <div className="flex items-center gap-2 text-[10px]">
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[#9BA8AB] hover:text-[#CCD0CF] flex items-center gap-1 transition-colors"
          >
            <Link2 className="w-3 h-3" />
            <span>{showUrlInput ? "Hide URL Box" : "Direct URL / Path"}</span>
          </button>

          {previousUrl && previousUrl !== value && (
            <button
              type="button"
              onClick={handleRevert}
              className="text-amber-400 hover:text-amber-300 flex items-center gap-0.5 transition-colors"
              title="Cancel and revert to previous image"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Cancel</span>
            </button>
          )}

          {value && (
            <button
              type="button"
              onClick={handleRemove}
              className="text-rose-400 hover:text-rose-300 flex items-center gap-0.5 transition-colors"
              title="Remove this photo"
            >
              <X className="w-3 h-3" />
              <span>Remove</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Preview Frame & Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Preview Frame */}
        <div
          className={`sm:col-span-5 relative ${aspectClass} rounded-xl overflow-hidden bg-[#11212D] border border-[#4A5C6A] group flex items-center justify-center`}
        >
          {value && !hasError ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt={label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setHasError(true)}
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1.5 rounded-lg bg-[#253745] hover:bg-[#253745]/90 border border-[#4A5C6A] text-[10px] text-white font-bold flex items-center gap-1 shadow-lg"
                >
                  <Upload className="w-3 h-3" />
                  <span>Replace Photo</span>
                </button>
                {value.startsWith("/") && (
                  <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-[#11212D] border border-[#4A5C6A] text-white hover:text-[#CCD0CF]"
                    title="View full size"
                  >
                    <Eye className="w-3 h-3" />
                  </a>
                )}
              </div>
            </>
          ) : (
            <div className="text-center p-4 space-y-1 text-[#9BA8AB]">
              {hasError ? (
                <>
                  <AlertCircle className="w-6 h-6 mx-auto text-rose-400" />
                  <span className="text-[10px] text-rose-400 font-semibold block">Failed to load photo</span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[9px] text-[#CCD0CF] underline mt-1"
                  >
                    Select replacement
                  </button>
                </>
              ) : (
                <>
                  <ImageIcon className="w-6 h-6 mx-auto text-[#4A5C6A]" />
                  <span className="text-[10px] font-semibold block">No photo uploaded</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Upload & Controls Column */}
        <div className="sm:col-span-7 space-y-2.5">
          {/* File Picker input */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 rounded-xl bg-[#253745] hover:bg-[#253745]/80 border border-[#4A5C6A] text-xs text-[#CCD0CF] font-semibold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isUploading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#CCD0CF]" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              <span>{isUploading ? "Uploading to Server..." : value ? "Replace Photo From Computer" : "Select Photo From Computer"}</span>
            </button>

            {showSaveButton && onSave && (
              <button
                type="button"
                onClick={() => onSave(value)}
                className="px-3 py-2 rounded-xl bg-[#CCD0CF] hover:bg-white text-[#06141B] text-xs font-bold transition-colors"
              >
                Save Photo
              </button>
            )}
          </div>

          {/* Feedback & Status Message */}
          {statusMessage && (
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Direct URL input */}
          {(showUrlInput || !value) && (
            <div className="space-y-1 pt-1">
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder={placeholder}
                  value={value}
                  onChange={(e) => {
                    setHasError(false);
                    onChange(e.target.value);
                  }}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#11212D] border border-[#4A5C6A] text-xs text-white placeholder-[#9BA8AB]/50 focus:outline-none focus:border-[#CCD0CF]"
                />
              </div>
              <p className="text-[9px] text-[#9BA8AB]">
                Enter local path (e.g. <code className="text-[#CCD0CF]">/uploads/...</code> or <code className="text-[#CCD0CF]">/photos/...</code>) or image URL.
              </p>
            </div>
          )}

          {helpText && (
            <p className="text-[10px] text-[#9BA8AB] leading-relaxed">
              {helpText}
            </p>
          )}

          {/* Current Path Badge */}
          {value && (
            <div className="text-[9px] text-[#9BA8AB] truncate font-mono bg-[#11212D] px-2 py-1 rounded border border-[#253745]">
              Path: <span className="text-[#CCD0CF]">{value}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
