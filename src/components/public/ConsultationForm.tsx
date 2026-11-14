"use client";

import React, { useState } from "react";
import { Send, MessageCircle, Mail, MapPin, CheckCircle2, ShieldCheck } from "lucide-react";
import { InstagramIcon } from "@/components/shared/InstagramIcon";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/shared/Button";
import { useFitnessStore } from "@/lib/store";
import { buildWhatsAppBookingUrl } from "@/lib/config";
import { ConsultationFormData } from "@/types";

export function ConsultationForm() {
  const { packages, settings, trainer, addBooking } = useFitnessStore();

  const [formData, setFormData] = useState<ConsultationFormData>({
    name: "",
    age: "",
    currentWeight: "",
    height: "",
    fitnessGoal: "Fat Loss & Definition",
    preferredPackage: packages[1]?.name || "Premium Plan",
    whatsappNumber: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Validation
    if (!formData.name.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!formData.age || Number(formData.age) < 16 || Number(formData.age) > 85) {
      setErrorMsg("Please enter a valid age between 16 and 85.");
      return;
    }
    if (!formData.currentWeight.trim()) {
      setErrorMsg("Please enter your current weight.");
      return;
    }
    if (!formData.whatsappNumber.trim() || formData.whatsappNumber.length < 7) {
      setErrorMsg("Please provide a valid WhatsApp phone number with country code.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Save lead locally / to Supabase state
      addBooking(formData);

      // Find selected package details for price
      const selectedPkg = packages.find((p) => p.name === formData.preferredPackage);

      // Generate prefilled WhatsApp booking URL
      const whatsappUrl = buildWhatsAppBookingUrl({
        customerName: formData.name,
        packageName: formData.preferredPackage,
        duration: selectedPkg?.duration,
        price: selectedPkg?.price,
        fitnessGoal: formData.fitnessGoal,
      });

      setIsSubmitting(false);
      setIsSuccess(true);

      // Automatically open WhatsApp in a new tab for seamless user conversion
      setTimeout(() => {
        window.open(whatsappUrl, "_blank");
      }, 600);
    } catch {
      setIsSubmitting(false);
      setErrorMsg("An unexpected error occurred while saving your application. Please message directly on WhatsApp.");
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#06141B] relative">
      <Container>
        <SectionHeading
          badge="Contact & Intake"
          title="Apply For Online Coaching"
          subtitle="Complete the short intake form below or message Coach Faras directly on WhatsApp."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
          {/* Left Column: Direct Channels & Confidence */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl ios-glass border border-[rgba(204,208,207,0.14)] shadow-xl shadow-black/40">
              <h3 className="heading-font text-xl font-bold text-[#CCD0CF] uppercase mb-2">
                Direct Communication
              </h3>
              <p className="text-xs text-[#9BA8AB] mb-6 leading-relaxed font-normal">
                We respect your time. Once submitted, Coach {trainer.name || "Faras"} personally reviews your intake metrics within 24 hours.
              </p>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3 text-[#CCD0CF]">
                  <div className="p-2.5 rounded-xl bg-[#253745] border border-[rgba(204,208,207,0.15)] text-[#CCD0CF] shrink-0 shadow-md">
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-[#9BA8AB] block font-bold">WhatsApp Direct</span>
                    <span className="font-semibold text-white">{settings.whatsappNumber || "8138954423"}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-[#CCD0CF]">
                  <div className="p-2.5 rounded-xl bg-[#253745] border border-[rgba(204,208,207,0.15)] text-[#CCD0CF] shrink-0 shadow-md">
                    <Mail className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-[#9BA8AB] block font-bold">Inquiry Email</span>
                    <span className="font-semibold text-white">{settings.contactEmail || "contact@farasmethod.com"}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-[#CCD0CF]">
                  <div className="p-2.5 rounded-xl bg-[#253745] border border-[rgba(204,208,207,0.15)] text-[#CCD0CF] shrink-0 shadow-md">
                    <InstagramIcon className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-[#9BA8AB] block font-bold">Instagram Direct</span>
                    <span className="font-semibold text-white">@{settings.instagramHandle?.replace("@", "") || "itsfarasu"}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-[#CCD0CF]">
                  <div className="p-2.5 rounded-xl bg-[#253745] border border-[rgba(204,208,207,0.15)] text-[#CCD0CF] shrink-0 shadow-md">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-[#9BA8AB] block font-bold">HQ Location</span>
                    <span className="font-semibold text-white">FARAS METHOD • Online Fitness Coaching</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[rgba(204,208,207,0.1)] flex items-center gap-2 text-xs text-[#9BA8AB]">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Your privacy is protected. Zero spam. Strict confidentiality.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Full Intake Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-10 rounded-3xl ios-glass border border-[rgba(204,208,207,0.16)] shadow-2xl shadow-black/50">
              {isSuccess ? (
                <div className="text-center py-10 space-y-4 animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-[#253745] text-[#CCD0CF] flex items-center justify-center mx-auto border border-[#4A5C6A]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="heading-font text-2xl font-bold text-[#CCD0CF] uppercase">
                    Application Received & Forwarded!
                  </h3>
                  <p className="text-xs sm:text-sm text-[#9BA8AB] max-w-md mx-auto leading-relaxed font-light">
                    Thank you, <strong className="text-white">{formData.name}</strong>. Your consultation details have been recorded and your prefilled WhatsApp inquiry opened. Coach {trainer.name || "Faras"} will review your profile shortly.
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setIsSuccess(false);
                      setFormData({
                        name: "",
                        age: "",
                        currentWeight: "",
                        height: "",
                        fitnessGoal: "Aggressive Fat Loss",
                        preferredPackage: packages[1]?.name || "Premium Plan",
                        whatsappNumber: "",
                        message: "",
                      });
                    }}
                  >
                    Submit Another Application
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/40 text-rose-400 text-xs">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-[#CCD0CF] mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="e.g. John Doe"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#06141B] border border-[#4A5C6A] text-xs text-[#CCD0CF] placeholder-[#9BA8AB]/50 focus:outline-none focus:border-[#CCD0CF]"
                      />
                    </div>

                    {/* Age */}
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-[#CCD0CF] mb-1.5">
                        Age *
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                        placeholder="e.g. 26"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#06141B] border border-[#4A5C6A] text-xs text-[#CCD0CF] placeholder-[#9BA8AB]/50 focus:outline-none focus:border-[#CCD0CF]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Current Weight */}
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-[#CCD0CF] mb-1.5">
                        Current Weight (kg / lbs) *
                      </label>
                      <input
                        type="text"
                        name="currentWeight"
                        value={formData.currentWeight}
                        onChange={handleChange}
                        required
                        placeholder="e.g. 70 kg"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#06141B] border border-[#4A5C6A] text-xs text-[#CCD0CF] placeholder-[#9BA8AB]/50 focus:outline-none focus:border-[#CCD0CF]"
                      />
                    </div>

                    {/* Height (Optional) */}
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-[#CCD0CF] mb-1.5">
                        Height (Optional)
                      </label>
                      <input
                        type="text"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        placeholder="e.g. 175 cm / 5'9&quot;"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#06141B] border border-[#4A5C6A] text-xs text-[#CCD0CF] placeholder-[#9BA8AB]/50 focus:outline-none focus:border-[#CCD0CF]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Fitness Goal */}
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-[#CCD0CF] mb-1.5">
                        Primary Fitness Goal *
                      </label>
                      <select
                        name="fitnessGoal"
                        value={formData.fitnessGoal}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#06141B] border border-[#4A5C6A] text-xs text-[#CCD0CF] focus:outline-none focus:border-[#CCD0CF]"
                      >
                        <option value="Fat Loss & Definition">Fat Loss & Definition</option>
                        <option value="Muscle Building & Hypertrophy">Muscle Building & Hypertrophy</option>
                        <option value="Body Recomposition">Body Recomposition</option>
                        <option value="Strength & Technique Foundation">Strength & Technique Foundation</option>
                        <option value="General Health & Conditioning">General Health & Conditioning</option>
                      </select>
                    </div>

                    {/* Preferred Package */}
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-[#CCD0CF] mb-1.5">
                        Preferred Coaching Tier *
                      </label>
                      <select
                        id="package-select"
                        name="preferredPackage"
                        value={formData.preferredPackage}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#06141B] border border-[#4A5C6A] text-xs text-[#CCD0CF] focus:outline-none focus:border-[#CCD0CF]"
                      >
                        {packages.map((pkg) => (
                          <option key={pkg.id} value={pkg.name}>
                            {pkg.name} ({pkg.currency === "USD" ? "$" : "₹"}{pkg.price.toLocaleString("en-IN")} - {pkg.duration})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* WhatsApp Number */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-[#CCD0CF] mb-1.5">
                      Your WhatsApp Number (With Country Code) *
                    </label>
                    <input
                      type="tel"
                      name="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={handleChange}
                      required
                      placeholder="e.g. +91 9876543210"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#06141B] border border-[#4A5C6A] text-xs text-[#CCD0CF] placeholder-[#9BA8AB]/50 focus:outline-none focus:border-[#CCD0CF]"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-[#CCD0CF] mb-1.5">
                      Your Past Challenges or Current Situation
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={`Tell Coach ${trainer.name || "Faras"} about your current training schedule, past injuries, or dietary constraints...`}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#06141B] border border-[#4A5C6A] text-xs text-[#CCD0CF] placeholder-[#9BA8AB]/50 focus:outline-none focus:border-[#CCD0CF]"
                    ></textarea>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isSubmitting}
                    className="w-full gap-2 mt-2 font-bold uppercase tracking-wider"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit & Proceed to WhatsApp Booking</span>
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

