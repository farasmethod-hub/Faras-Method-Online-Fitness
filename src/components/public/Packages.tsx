"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Check, MessageCircle, BookOpen, ArrowRight, X, ChevronRight } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";
import { useFitnessStore } from "@/lib/store";
import { buildWhatsAppBookingUrl } from "@/lib/config";
import { Package } from "@/types";

export function Packages() {
  const { packages, settings, trainer } = useFitnessStore();
  const [selectedPackageForSyllabus, setSelectedPackageForSyllabus] = useState<Package | null>(null);

  const handleBookViaForm = (pkg: Package) => {
    const el = document.getElementById("contact");
    if (el) {
      const select = document.getElementById("package-select") as HTMLSelectElement | null;
      if (select) select.value = pkg.name;
      const pos = el.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: pos, behavior: "smooth" });
    }
  };

  return (
    <section id="packages" className="py-24 bg-[#06141B] relative">
      <Container>
        <SectionHeading
          badge="Coaching Plans"
          title="Coaching Packages & Pricing"
          subtitle="Clear, structured coaching plans. Choose the level of guidance that matches your goals and training routine."
        />

        {/* 4 Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {(packages || []).filter((p) => p.isPublished !== false).map((pkg) => {
            const isPopular = pkg.isPopular;
            const currencySymbol = pkg.currency === "USD" ? "$" : "₹";
            const whatsappUrl = buildWhatsAppBookingUrl({
              packageName: pkg.name,
              duration: pkg.duration,
              price: pkg.price,
              currency: pkg.currency || "INR",
              customMessage: pkg.whatsappMessage,
              customNumber: settings.whatsappNumber,
              coachName: trainer.name,
            });

            return (
              <div
                key={pkg.id}
                className={`relative rounded-3xl flex flex-col justify-between transition-all duration-300 p-6 sm:p-7 ${
                  isPopular
                    ? "ios-glass border-2 border-[#CCD0CF] shadow-2xl shadow-black/60 lg:-translate-y-2 scale-[1.01]"
                    : "ios-glass ios-glass-interactive border border-[rgba(204,208,207,0.14)] shadow-xl shadow-black/30"
                }`}
              >
                {/* Popular or Feature Badge */}
                {isPopular ? (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="inline-flex items-center px-4 py-1 rounded-full bg-[#CCD0CF] text-[#06141B] text-xs font-black uppercase tracking-wider shadow-xl shadow-white/10">
                      {pkg.badge || "Most Popular"}
                    </span>
                  </div>
                ) : pkg.badge ? (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="inline-flex items-center px-3.5 py-0.5 rounded-full ios-glass-pill text-[#CCD0CF] text-[11px] font-bold uppercase tracking-wider shadow">
                      {pkg.badge}
                    </span>
                  </div>
                ) : null}

                <div>
                  {/* Optional Package Cover Image */}
                  {pkg.imageUrl && (
                    <div className="relative w-full h-32 rounded-2xl overflow-hidden mb-4 border border-[rgba(204,208,207,0.1)]">
                      <Image
                        src={pkg.imageUrl}
                        alt={pkg.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Package Header */}
                  <div className="mb-4">
                    <h3 className="heading-font text-2xl font-bold text-[#CCD0CF] uppercase">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-[#9BA8AB] mt-1 leading-snug line-clamp-2 font-normal">
                      {pkg.tagline}
                    </p>
                    {pkg.highlight && (
                      <span className="inline-block mt-2 px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wide ios-glass-pill text-[#CCD0CF]">
                        {pkg.highlight}
                      </span>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="mb-6 pb-4 border-b border-[rgba(204,208,207,0.1)]">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-semibold text-[#CCD0CF]">{currencySymbol}</span>
                      <span className="heading-font text-4xl sm:text-5xl font-black text-white">
                        {pkg.price.toLocaleString("en-IN")}
                      </span>
                      {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                        <span className="text-xs line-through text-[#9BA8AB]/70 ml-2 font-medium">
                          {currencySymbol}{pkg.originalPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs mt-1">
                      <span className="uppercase tracking-wider text-[#9BA8AB] font-medium">
                        {pkg.duration}
                      </span>
                      {pkg.rateNote && (
                        <span className="text-[11px] text-emerald-400 font-semibold">
                          {pkg.rateNote}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 mb-6">
                    <p className="text-[11px] uppercase tracking-wider text-[#9BA8AB] font-bold">
                      Program Highlights:
                    </p>
                    {pkg.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-[#CCD0CF]">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-[rgba(204,208,207,0.1)] space-y-2.5">
                  {/* Syllabus Preview Button */}
                  {pkg.syllabus && pkg.syllabus.length > 0 && (
                    <button
                      onClick={() => setSelectedPackageForSyllabus(pkg)}
                      className="w-full py-2 px-3 rounded-xl ios-glass-pill hover:text-white text-xs text-[#CCD0CF] font-semibold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Preview Syllabus Phases</span>
                    </button>
                  )}

                  {/* Book Now Button */}
                  <Button
                    variant={isPopular ? "primary" : "secondary"}
                    size="md"
                    onClick={() => handleBookViaForm(pkg)}
                    className="w-full text-xs font-bold uppercase tracking-wider"
                  >
                    <span>Book Now</span>
                  </Button>

                  {/* Separate WhatsApp Direct Button */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs gap-1.5 border-[rgba(204,208,207,0.18)] bg-transparent text-[#CCD0CF] hover:bg-[#253745]/60 hover:text-white"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Book on WhatsApp</span>
                    </Button>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Package Comparison Table */}
        <div className="mt-16 pt-16 border-t border-[rgba(204,208,207,0.12)]">
          <div className="text-center mb-8">
            <h3 className="heading-font text-2xl sm:text-3xl font-bold text-[#CCD0CF] uppercase">
              Side-by-Side Comparison
            </h3>
            <p className="text-xs sm:text-sm text-[#9BA8AB] mt-1 font-normal">
              Complete breakdown of authentic coaching deliverables across all FARAS METHOD tiers
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[rgba(204,208,207,0.14)] ios-glass shadow-2xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[rgba(204,208,207,0.12)] bg-[#06141B]/80">
                  <th className="p-4 font-bold text-[#CCD0CF] uppercase">Deliverable</th>
                  <th className="p-4 font-bold text-[#CCD0CF] uppercase">Base Plan</th>
                  <th className="p-4 font-bold text-[#CCD0CF] uppercase">Premium Plan</th>
                  <th className="p-4 font-bold text-[#CCD0CF] uppercase">Premium 3 Month</th>
                  <th className="p-4 font-bold text-[#CCD0CF] uppercase">Premium 6 Month</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#4A5C6A]/50 text-[#9BA8AB]">
                <tr>
                  <td className="p-4 font-semibold text-[#CCD0CF]">Custom Workout Plan</td>
                  <td className="p-4 text-[#CCD0CF]">Fixed Plan</td>
                  <td className="p-4 text-[#CCD0CF]">Ongoing Adjustments</td>
                  <td className="p-4 text-[#CCD0CF]">Ongoing Adjustments</td>
                  <td className="p-4 text-[#CCD0CF]">Ongoing Adjustments</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#CCD0CF]">Custom Diet Plan</td>
                  <td className="p-4 text-[#CCD0CF]">Fixed Plan</td>
                  <td className="p-4 text-[#CCD0CF]">Ongoing Adjustments</td>
                  <td className="p-4 text-[#CCD0CF]">Ongoing Adjustments</td>
                  <td className="p-4 text-[#CCD0CF]">Ongoing Adjustments</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#CCD0CF]">Check-ins &amp; Accountability</td>
                  <td className="p-4">2 Quick Photo Check-ins</td>
                  <td className="p-4 text-[#CCD0CF]">Weekly Check-ins</td>
                  <td className="p-4 text-[#CCD0CF]">Weekly Check-ins</td>
                  <td className="p-4 text-[#CCD0CF]">Weekly Check-ins</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#CCD0CF]">Workout Tracking (Hevy App)</td>
                  <td className="p-4">Self-guided (DIY)</td>
                  <td className="p-4 text-[#CCD0CF]">Weekly Tracking</td>
                  <td className="p-4 text-[#CCD0CF]">Weekly Tracking</td>
                  <td className="p-4 text-[#CCD0CF]">Weekly Tracking</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#CCD0CF]">Exercise Form Correction</td>
                  <td className="p-4">-</td>
                  <td className="p-4 text-[#CCD0CF]">Send Video, Get Feedback</td>
                  <td className="p-4 text-[#CCD0CF]">Send Video, Get Feedback</td>
                  <td className="p-4 text-[#CCD0CF]">Send Video, Get Feedback</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#CCD0CF]">Coach-Recorded Video Demos</td>
                  <td className="p-4">-</td>
                  <td className="p-4 text-[#CCD0CF]">For Any Exercise in Doubt</td>
                  <td className="p-4 text-[#CCD0CF]">For Any Exercise in Doubt</td>
                  <td className="p-4 text-[#CCD0CF]">For Any Exercise in Doubt</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#CCD0CF]">Grocery &amp; Supplement Advice</td>
                  <td className="p-4">-</td>
                  <td className="p-4 text-[#CCD0CF]">Included</td>
                  <td className="p-4 text-[#CCD0CF]">Included</td>
                  <td className="p-4 text-[#CCD0CF]">Included</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#CCD0CF]">Full WhatsApp Support</td>
                  <td className="p-4">Basic Support</td>
                  <td className="p-4 text-[#CCD0CF]">Full WhatsApp Support</td>
                  <td className="p-4 text-[#CCD0CF]">Full WhatsApp Support</td>
                  <td className="p-4 text-[#CCD0CF]">Full WhatsApp Support</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#CCD0CF]">Guaranteed Results</td>
                  <td className="p-4">-</td>
                  <td className="p-4">-</td>
                  <td className="p-4 font-bold text-[#CCD0CF]">Guaranteed Results</td>
                  <td className="p-4 font-bold text-[#CCD0CF]">Guaranteed Results</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#CCD0CF]">Rate Structure</td>
                  <td className="p-4">Standard Monthly</td>
                  <td className="p-4">Standard Monthly</td>
                  <td className="p-4 text-[#CCD0CF] font-medium">Locked-in (~₹833/mo)</td>
                  <td className="p-4 text-[#CCD0CF] font-medium">Locked-in (~₹750/mo)</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#CCD0CF]">Investment</td>
                  <td className="p-4 font-bold text-[#CCD0CF]">₹499 / month</td>
                  <td className="p-4 font-bold text-[#CCD0CF]">₹999 / month</td>
                  <td className="p-4 font-bold text-white">₹2,499 (3 Months)</td>
                  <td className="p-4 font-bold text-[#CCD0CF]">₹4,499 (6 Months)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Syllabus Preview Modal */}
        {selectedPackageForSyllabus && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-[#11212D] border border-[#4A5C6A] rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
              <button
                onClick={() => setSelectedPackageForSyllabus(null)}
                className="absolute top-5 right-5 p-2 rounded-lg bg-[#253745] text-[#9BA8AB] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <span className="text-xs uppercase tracking-widest text-[#9BA8AB] font-bold">
                  Curriculum & Mesocycle Blueprint
                </span>
                <h3 className="heading-font text-2xl sm:text-3xl font-extrabold text-[#CCD0CF] uppercase mt-1">
                  {selectedPackageForSyllabus.name} — Syllabus
                </h3>
                <p className="text-xs text-[#9BA8AB] mt-1 font-light">
                  Structured progression phases designed to eliminate plateaus and optimize recovery.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {selectedPackageForSyllabus.syllabus.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#06141B] border border-[#4A5C6A]">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#253745] text-[#CCD0CF] border border-[#4A5C6A]">
                        {item.week}
                      </span>
                      <h4 className="heading-font text-base font-bold text-[#CCD0CF]">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-xs text-[#9BA8AB] mb-3 leading-relaxed font-light">
                      {item.focus}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#CCD0CF]">
                      {item.details.map((d, di) => (
                        <div key={di} className="flex items-center gap-1.5">
                          <ChevronRight className="w-3.5 h-3.5 text-[#CCD0CF]" />
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-[#4A5C6A]/50">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedPackageForSyllabus(null)}
                >
                  Close Preview
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    handleBookViaForm(selectedPackageForSyllabus);
                    setSelectedPackageForSyllabus(null);
                  }}
                >
                  Apply For This Plan
                </Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}

