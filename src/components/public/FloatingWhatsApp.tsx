"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { buildGeneralWhatsAppUrl } from "@/lib/config";
import { useFitnessStore } from "@/lib/store";

export function FloatingWhatsApp() {
  const { settings, trainer } = useFitnessStore();
  const whatsappUrl = buildGeneralWhatsAppUrl(undefined, settings.whatsappNumber, trainer.name);
  const coachName = trainer.name || "Faras";

  return (
    <aside aria-label="WhatsApp quick chat" className="fixed bottom-6 right-6 z-40 flex items-center group">
      {/* Tooltip on hover */}
      <div className="hidden sm:block mr-3 px-3.5 py-1.5 rounded-full ios-glass-pill text-xs font-semibold text-white shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        Chat with Coach {coachName} on WhatsApp
      </div>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat with Coach ${coachName} on WhatsApp`}
        className="w-14 h-14 rounded-full bg-[#25D366] text-[#06141B] flex items-center justify-center shadow-2xl shadow-black/50 hover:brightness-110 active:scale-95 transition-all duration-300 focus:outline-none"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
      </a>
    </aside>
  );
}

