"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Award,
  FileCheck2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  X,
  Maximize2,
  Download,
} from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";
import { useFitnessStore } from "@/lib/store";

export function ProfessionalCertification() {
  const { trainer } = useFitnessStore();
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const cert = trainer.certification || {
    title: "Certified Level 4 General Fitness Trainer",
    qualification: "General Fitness Trainer",
    qualificationCode: "SPF/Q1107",
    nsqfLevel: "Level 4",
    assessmentStatus: "Successfully Cleared",
    standard: "National Occupational Standards",
    sectorCouncil: "Sports, Physical Education, Fitness & Leisure Skills Council (SPEFL-SC)",
    dateOfIssue: "29 April 2026",
    certificateImageUrl: "/certificate/mohammad-faras-u-certificate.svg",
    trainingAreas: [
      "Fitness instruction",
      "Workout planning",
      "Exercise techniques",
      "Client fitness guidance",
    ],
  };

  const certificateUrl = cert.certificateImageUrl || "/certificate/mohammad-faras-u-certificate.svg";
  const fullName = trainer.fullName || "Mohammad Faras U";

  return (
    <section id="certification" className="py-24 bg-[#253745] relative border-t border-[#4A5C6A]/50 overflow-hidden">
      <Container className="relative z-10">
        <SectionHeading
          badge="Verified Credentials"
          title="Professional Certification"
          subtitle="Conforming to NSQF Level 4 and the National Occupational Standards set by the Sports, Physical Education, Fitness & Leisure Skills Council (SPEFL-SC)."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center max-w-6xl mx-auto">
          {/* Left Column: Responsive Certificate Preview Preserving Exact 1200:850 Proportions */}
          <div className="lg:col-span-7">
            <div className="relative group rounded-3xl overflow-hidden border-2 border-[#4A5C6A] shadow-2xl shadow-black/80 bg-[#11212D] p-2 sm:p-3">
              {/* Preserves 1200 x 850 original aspect ratio */}
              <div className="relative w-full aspect-[1200/850] rounded-2xl overflow-hidden bg-[#06141B]">
                <Image
                  src={certificateUrl}
                  alt={`Official Certificate - ${cert.title} - ${fullName}`}
                  fill
                  className="object-contain p-1 group-hover:scale-[1.02] transition-transform duration-500"
                />

                {/* Hover Overlay with View Certificate trigger */}
                <div className="absolute inset-0 bg-[#06141B]/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setShowCertificateModal(true)}
                    className="gap-2 shadow-2xl"
                  >
                    <Maximize2 className="w-4 h-4" />
                    <span>View Fullscreen Certificate</span>
                  </Button>
                </div>
              </div>

              {/* Bottom bar inside preview frame */}
              <div className="flex items-center justify-between p-3 pt-4 text-xs text-[#9BA8AB]">
                <span className="flex items-center gap-1.5 text-[#CCD0CF] font-semibold">
                  <FileCheck2 className="w-4 h-4 text-[#CCD0CF]" />
                  Official Credential Preview
                </span>
                <button
                  onClick={() => setShowCertificateModal(true)}
                  className="text-xs text-[#CCD0CF] hover:text-white font-semibold flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Enlarge Viewer</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Qualification Matrix */}
          <div className="lg:col-span-5 space-y-6">
            {/* Level 4 Badge Header */}
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#11212D] border border-[#4A5C6A] text-[#CCD0CF]">
                NSQF {cert.nsqfLevel || "Level 4"}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#11212D] border border-[#4A5C6A] text-[#CCD0CF]">
                {cert.assessmentStatus || "Successfully Cleared"}
              </span>
            </div>

            <div>
              <span className="text-[11px] uppercase font-bold tracking-widest text-[#9BA8AB] block mb-1">
                Authoritative Qualification
              </span>
              <h3 className="heading-font text-2xl sm:text-3xl font-black text-[#CCD0CF] uppercase leading-snug">
                {cert.title || "Certified Level 4 General Fitness Trainer"}
              </h3>
              <p className="text-xs text-[#9BA8AB] mt-1">
                Issued to: <strong className="text-[#CCD0CF] font-semibold">{fullName}</strong>
              </p>
            </div>

            {/* Structured Criteria Card */}
            <div className="p-5 rounded-2xl bg-[#11212D] border border-[#4A5C6A] space-y-3.5 text-xs">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#4A5C6A]/40">
                <span className="text-[#9BA8AB] uppercase tracking-wider text-[10px] font-bold">Qualification Code</span>
                <span className="font-mono text-[#CCD0CF] font-bold bg-[#06141B] px-2 py-0.5 rounded border border-[#4A5C6A]">
                  {cert.qualificationCode || "SPF/Q1107"}
                </span>
              </div>

              <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#4A5C6A]/40">
                <span className="text-[#9BA8AB] uppercase tracking-wider text-[10px] font-bold">Sector Skill Council</span>
                <span className="text-right text-[#CCD0CF] font-semibold max-w-[240px]">
                  {cert.sectorCouncil || "Sports, Physical Education, Fitness & Leisure Skills Council (SPEFL-SC)"}
                </span>
              </div>

              <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#4A5C6A]/40">
                <span className="text-[#9BA8AB] uppercase tracking-wider text-[10px] font-bold">Certification Standard</span>
                <span className="text-right text-[#CCD0CF] font-semibold">
                  {cert.standard || "National Occupational Standards"}
                </span>
              </div>

              <div className="flex items-start justify-between gap-3">
                <span className="text-[#9BA8AB] uppercase tracking-wider text-[10px] font-bold">Date of Issue</span>
                <span className="text-[#CCD0CF] font-semibold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#CCD0CF]" />
                  {cert.dateOfIssue || "29 April 2026"}
                </span>
              </div>
            </div>

            {/* Core Competencies from Standards */}
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#9BA8AB] block mb-2">
                Conforming Competency Areas:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs text-[#CCD0CF]">
                {(cert.trainingAreas || [
                  "Fitness instruction",
                  "Workout planning",
                  "Exercise techniques",
                  "Client fitness guidance",
                ]).map((area, i) => (
                  <div key={i} className="flex items-center gap-1.5 p-2 rounded-lg bg-[#11212D] border border-[#4A5C6A]/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#CCD0CF] shrink-0" />
                    <span className="text-[11px] font-medium leading-tight">{area}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => setShowCertificateModal(true)}
                className="gap-2 w-full sm:w-auto"
              >
                <Maximize2 className="w-4 h-4" />
                <span>View Full Certificate Scan</span>
              </Button>
            </div>
          </div>
        </div>
      </Container>

      {/* Large Image Viewer Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative bg-[#06141B] border border-[#4A5C6A] rounded-3xl max-w-5xl w-full max-h-[95vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#4A5C6A] bg-[#11212D] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#253745] text-[#CCD0CF] flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="heading-font text-base sm:text-lg font-bold text-[#CCD0CF] uppercase leading-none">
                    {cert.title}
                  </h4>
                  <p className="text-[11px] text-[#9BA8AB] mt-1">
                    {fullName} • {cert.qualificationCode} • SPEFL-SC
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download="mohammad-faras-u-certificate.svg"
                  className="p-2 rounded-lg bg-[#253745] text-[#CCD0CF] hover:text-white transition-colors"
                  title="Open in new tab / download"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setShowCertificateModal(false)}
                  className="p-2 rounded-lg bg-[#253745] text-[#9BA8AB] hover:text-white transition-colors"
                  aria-label="Close certificate viewer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: High Resolution Responsive Certificate Display */}
            <div className="flex-1 p-4 sm:p-8 overflow-y-auto flex items-center justify-center bg-[#06141B]">
              <div className="relative w-full max-w-4xl aspect-[1200/850] shadow-2xl rounded-xl overflow-hidden border border-[#4A5C6A]">
                <Image
                  src={certificateUrl}
                  alt={`Official Certificate of ${fullName}`}
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 px-6 border-t border-[#4A5C6A] bg-[#11212D] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#9BA8AB] shrink-0">
              <span>
                Conforms to Level 4 National Occupational Standards (SPEFL-SC) • Issue Date: {cert.dateOfIssue}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowCertificateModal(false)}
              >
                Close Viewer
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

