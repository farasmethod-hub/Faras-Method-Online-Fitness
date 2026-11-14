"use client";

import React from "react";
import Image from "next/image";
import { Heart, MessageCircle, ExternalLink, ShieldCheck } from "lucide-react";
import { InstagramIcon } from "@/components/shared/InstagramIcon";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/shared/Button";
import { useFitnessStore, InstagramPostItem } from "@/lib/store";

const INSTA_POSTS: InstagramPostItem[] = [
  {
    id: "post-1",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
    likes: "1,842",
    comments: "94",
    caption: "The dumbbell incline press angle matters. 30 degrees targets clavicular fibers with zero shoulder impingement.",
  },
  {
    id: "post-2",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
    likes: "2,410",
    comments: "148",
    caption: "Progressive overload doesn’t just mean adding weight. It means owning the eccentric phase for 3 seconds.",
  },
  {
    id: "post-3",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80",
    likes: "1,220",
    comments: "63",
    caption: "Protein pacing: 45g of quality protein post-workout. Simple, predictable, highly anabolic.",
  },
  {
    id: "post-4",
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80",
    likes: "3,110",
    comments: "210",
    caption: "From 56 kg to 69 kg. Consistency beats shortcuts every single time. Proper training, patience, and real progression.",
  },
];

export function InstagramFeed() {
  const { settings, trainer, instagramPosts } = useFitnessStore();
  const handle = trainer.instagramUsername || settings.instagramHandle?.replace("@", "") || "itsfarasu";
  const profileUrl = trainer.instagramUrl || `https://www.instagram.com/${handle}/`;
  const posts = instagramPosts && instagramPosts.length > 0 ? instagramPosts : INSTA_POSTS;
  const publishedPosts = posts.filter((p) => p.isPublished !== false);

  return (
    <section className="py-24 bg-[#06141B] relative overflow-hidden">
      {/* iOS Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#253745]/15 rounded-full blur-[140px] pointer-events-none" />

      <Container className="relative z-10">
        <SectionHeading
          badge="Instagram"
          title="Follow Coach Faras On Instagram"
          subtitle="Daily exercise breakdowns, lifting technique tips, and nutrition advice from Coach Faras."
        />

        {/* Profile Card Header */}
        <div className="ios-glass max-w-2xl mx-auto mb-12 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border border-[#CCD0CF]/30 p-0.5 shadow-lg shadow-black/40 shrink-0">
              <Image
                src={trainer.photoUrl || "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=400&q=80"}
                alt={settings.instagramHandle}
                fill
                className="object-cover rounded-full"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="heading-font text-lg font-bold text-[#CCD0CF]">@{handle}</h4>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xs text-[#9BA8AB] mt-0.5">
                {trainer.name} • Certified Fitness Coach • Training Tips &amp; Updates
              </p>
            </div>
          </div>

          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button variant="primary" size="sm" className="w-full sm:w-auto gap-2">
              <InstagramIcon className="w-4 h-4" />
              <span>Follow On Instagram</span>
            </Button>
          </a>
        </div>

        {/* Instagram Post Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {publishedPosts.map((post) => (
            <a
              key={post.id}
              href={post.postUrl || profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ios-glass-interactive group relative aspect-square rounded-2xl overflow-hidden border border-[#253745]/60 bg-[#11212D]/40"
            >
              <Image
                src={post.image}
                alt="Instagram post"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
              />

              {/* Hover Overlay with Likes & Comments */}
              <div className="absolute inset-0 bg-[#06141B]/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                <div className="flex items-center justify-end">
                  <span className="w-7 h-7 rounded-full bg-[#11212D]/70 border border-[#CCD0CF]/20 flex items-center justify-center">
                    <ExternalLink className="w-3.5 h-3.5 text-[#CCD0CF]" />
                  </span>
                </div>

                <p className="text-[11px] text-[#CCD0CF] line-clamp-3 leading-snug">
                  {post.caption}
                </p>

                <div className="flex items-center gap-4 text-xs font-semibold text-[#CCD0CF] pt-2 border-t border-[#253745]/60">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-[#CCD0CF] fill-[#CCD0CF]" />
                    <span>{post.likes}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5 text-[#CCD0CF]" />
                    <span>{post.comments}</span>
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}

