"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { useFitnessStore } from "@/lib/store";

export function Testimonials() {
  const { testimonials } = useFitnessStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((prevIdx) => (prevIdx === 0 ? testimonials.length - 1 : prevIdx - 1));
  };

  const next = () => {
    setCurrentIndex((prevIdx) => (prevIdx === testimonials.length - 1 ? 0 : prevIdx + 1));
  };

  const current = testimonials[currentIndex] || testimonials[0];

  return (
    <section className="py-24 bg-[#06141B] relative">
      <Container>
        <SectionHeading
          badge="Client Feedback"
          title="Client Reviews & Experiences"
          subtitle="Honest feedback from individuals who have trained under Coach Faras's guidance."
        />

        {/* Featured Testimonial Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl ios-glass border border-[rgba(204,208,207,0.16)] p-8 sm:p-12 shadow-2xl shadow-black/50">
            <Quote className="absolute top-6 right-8 w-16 h-16 text-[#253745]/30 pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Client Photo */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[rgba(204,208,207,0.22)] shadow-xl shadow-black/40 shrink-0">
                <Image
                  src={current.photoUrl}
                  alt={current.clientName}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Review Content */}
              <div className="flex-1 text-center md:text-left">
                {/* 5-star rating */}
                <div className="flex items-center justify-center md:justify-start gap-1 text-[#CCD0CF] mb-3">
                  {[...Array(current.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                  ))}
                </div>

                <p className="text-base sm:text-lg text-[#CCD0CF] leading-relaxed italic mb-4 font-normal">
                  &ldquo;{current.reviewText}&rdquo;
                </p>

                <div>
                  <h4 className="heading-font text-lg font-bold text-[#CCD0CF] uppercase">
                    {current.clientName}
                  </h4>
                  <p className="text-xs text-[#9BA8AB]">
                    {current.clientTitle} • <span className="text-emerald-400/90 font-medium">{current.packageUsed}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-[rgba(204,208,207,0.1)]">
              <button
                onClick={prev}
                className="p-2.5 rounded-full ios-glass-pill text-[#CCD0CF] hover:text-white transition-all active:scale-95"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1.5">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === currentIndex ? "w-6 bg-[#CCD0CF]" : "w-2 bg-[#253745]"
                    }`}
                    aria-label={`Go to review ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="p-2.5 rounded-full ios-glass-pill text-[#CCD0CF] hover:text-white transition-all active:scale-95"
                aria-label="Next review"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

