"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { useFitnessStore } from "@/lib/store";

export function FAQ() {
  const { faqs } = useFitnessStore();
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 bg-[#06141B] relative border-t border-[#4A5C6A]/50">
      <Container>
        <SectionHeading
          badge="FAQ"
          title="Frequently Asked Questions"
          subtitle="Common questions about coaching plans, workout tracking, nutrition guidance, and enrollment."
        />

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl ios-glass border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "border-[rgba(204,208,207,0.28)] shadow-xl shadow-black/40"
                    : "border-[rgba(204,208,207,0.1)] hover:border-[rgba(204,208,207,0.2)]"
                }`}
              >
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="heading-font text-base sm:text-lg font-bold text-[#CCD0CF] leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`p-1.5 rounded-full ios-glass-pill text-[#CCD0CF] shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-[#CCD0CF] text-[#06141B]" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-0 text-xs sm:text-sm text-[#9BA8AB] leading-relaxed border-t border-[rgba(204,208,207,0.08)] mt-1 animate-in fade-in duration-200 font-normal">
                    <p className="pt-3">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

