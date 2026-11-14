"use client";

import React, { useState } from "react";
import Image from "next/image";
import { BookOpen, Clock, Calendar, ArrowRight, X, Tag } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";
import { useFitnessStore } from "@/lib/store";
import { Article } from "@/types";
import { formatDate } from "@/lib/utils";

const CATEGORIES = [
  { label: "All Topics", value: "all" },
  { label: "Workout", value: "workout" },
  { label: "Nutrition", value: "nutrition" },
  { label: "Weight Loss", value: "weight-loss" },
  { label: "Muscle Building", value: "muscle-building" },
  { label: "Recovery", value: "recovery" },
];

export function FitnessTips() {
  const { articles, trainer } = useFitnessStore();
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const filteredArticles = activeCategory === "all"
    ? articles
    : articles.filter((a) => a.category === activeCategory);

  return (
    <section id="tips" className="py-24 bg-[#06141B] relative">
      <Container>
        <SectionHeading
          badge="Knowledge Base"
          title="Training & Nutrition Guides"
          subtitle={`Practical training, nutrition, and recovery advice to help you build sustainable fitness habits, written by Coach ${trainer.name || "Faras"}.`}
        />

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all duration-300 ${
                  isSelected
                    ? "bg-[#CCD0CF] text-[#06141B] shadow-md shadow-white/10"
                    : "ios-glass-pill text-[#9BA8AB] hover:text-[#CCD0CF]"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="rounded-3xl ios-glass ios-glass-interactive border border-[rgba(204,208,207,0.12)] overflow-hidden flex flex-col justify-between group shadow-xl shadow-black/30"
            >
              <div>
                {/* Article Cover Image */}
                <div className="relative h-52 w-full overflow-hidden bg-[#06141B]">
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-85 group-hover:brightness-100"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="default" className="ios-glass-pill text-[#CCD0CF]">
                      {article.category}
                    </Badge>
                  </div>
                </div>

                {/* Article Info */}
                <div className="p-6">
                  <div className="flex items-center gap-3 text-[11px] text-[#9BA8AB] mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#CCD0CF]" />
                      <span>{article.readTime}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(article.publishedAt)}</span>
                    </span>
                  </div>

                  <h3 className="heading-font text-xl font-bold text-[#CCD0CF] group-hover:text-white transition-colors mb-2.5 leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-[#9BA8AB] leading-relaxed line-clamp-3 font-light">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              {/* Read Article Trigger */}
              <div className="p-6 pt-0 border-t border-[#4A5C6A]/50 mt-4">
                <button
                  onClick={() => setSelectedArticle(article)}
                  className="w-full pt-4 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#CCD0CF] group/btn hover:text-white"
                >
                  <span>Read Full Article</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Article Reader Modal */}
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-[#11212D] border border-[#4A5C6A] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-10 shadow-2xl relative">
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-5 right-5 p-2 rounded-lg bg-[#253745] text-[#9BA8AB] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-4 flex items-center gap-2">
                <Badge variant="default" className="text-[#CCD0CF] border-[#4A5C6A]">
                  {selectedArticle.category}
                </Badge>
                <span className="text-xs text-[#9BA8AB]">•</span>
                <span className="text-xs text-[#9BA8AB]">{selectedArticle.readTime}</span>
                <span className="text-xs text-[#9BA8AB]">•</span>
                <span className="text-xs text-[#9BA8AB]">{formatDate(selectedArticle.publishedAt)}</span>
              </div>

              <h2 className="heading-font text-2xl sm:text-4xl font-extrabold text-[#CCD0CF] uppercase mb-4 leading-tight">
                {selectedArticle.title}
              </h2>

              <p className="text-sm text-[#CCD0CF] italic mb-6 pb-6 border-b border-[#4A5C6A]/50">
                {selectedArticle.excerpt}
              </p>

              <div className="relative h-64 sm:h-80 w-full rounded-xl overflow-hidden mb-8">
                <Image
                  src={selectedArticle.coverImage}
                  alt={selectedArticle.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="prose prose-invert max-w-none text-sm text-[#CCD0CF] leading-relaxed whitespace-pre-line space-y-4 font-light">
                {selectedArticle.content}
              </div>

              <div className="mt-10 pt-6 border-t border-[#4A5C6A]/50 flex items-center justify-between">
                <span className="text-xs text-[#9BA8AB]">
                  Author: <strong className="text-white">{selectedArticle.author || "Coach Faras"}</strong>
                </span>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedArticle(null)}
                >
                  Close Article
                </Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}

