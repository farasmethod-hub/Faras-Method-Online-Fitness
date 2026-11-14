"use client";

import React from "react";
import Image from "next/image";
import { Dumbbell, Flame, ShieldCheck, Activity, Check, ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { useFitnessStore } from "@/lib/store";

export function Services() {
  const { services } = useFitnessStore();

  const getIcon = (name: string) => {
    switch (name) {
      case "Flame":
        return <Flame className="w-6 h-6 text-[#CCD0CF]" />;
      case "Activity":
        return <Activity className="w-6 h-6 text-[#CCD0CF]" />;
      case "ShieldCheck":
        return <ShieldCheck className="w-6 h-6 text-[#CCD0CF]" />;
      default:
        return <Dumbbell className="w-6 h-6 text-[#CCD0CF]" />;
    }
  };

  return (
    <section id="services" className="py-24 bg-[#06141B] relative">
      <Container>
        <SectionHeading
          badge="Coaching Disciplines"
          title="Training Disciplines & Focus Areas"
          subtitle="Structured programming tailored to your equipment, schedule, and primary fitness goals."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((svc) => (
            <Card
              key={svc.id}
              variant="glass"
              className="group overflow-hidden p-0 border border-[rgba(204,208,207,0.12)] flex flex-col justify-between"
            >
              {/* Service Hero Header Image */}
              <div className="relative h-52 w-full overflow-hidden">
                <Image
                  src={svc.image}
                  alt={svc.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-75 group-hover:brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#11212D] via-[#11212D]/60 to-transparent" />
                <div className="absolute top-4 left-4 p-2.5 rounded-xl ios-glass border border-[rgba(204,208,207,0.2)] shadow-lg">
                  {getIcon(svc.iconName)}
                </div>
              </div>

              {/* Service Content */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="heading-font text-2xl font-bold text-[#CCD0CF] group-hover:text-white transition-colors">
                    {svc.title}
                  </h3>
                  <p className="text-xs uppercase tracking-wider text-[#9BA8AB] font-bold mt-1 mb-3">
                    {svc.tagline}
                  </p>
                  <p className="text-sm text-[#9BA8AB] leading-relaxed mb-6 font-normal">
                    {svc.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-2 mb-6 pt-4 border-t border-[rgba(204,208,207,0.1)]">
                    {svc.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-[#CCD0CF]">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a href="#packages" className="pt-2">
                  <Button variant="secondary" size="sm" className="w-full justify-between group/btn border-[#4A5C6A]">
                    <span>View Matching Packages</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </a>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

