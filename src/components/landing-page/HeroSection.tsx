"use client";

import React from "react";
import LazyImage from "@/components/shared/LazyImage";
import { Button } from "@/components/ui/button";

interface CtaButton {
  text: string;
  href: string;
}

interface HeroData {
  headline: string;
  subheadline: string;
  primaryCta: CtaButton;
  visual: string; // Assuming visual is an image src
}

interface HeroSectionProps {
  data: HeroData;
}

const HeroSection: React.FC<HeroSectionProps> = ({ data }) => (
  <section className="hero-section bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-20 px-6 animate-fade-in">
    <h1 className="text-5xl font-bold mb-4">{data.headline}</h1>
    <p className="text-xl mb-8 max-w-3xl mx-auto">{data.subheadline}</p>
    <Button
      asChild
      className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-4 rounded-full"
    >
      <a href={data.primaryCta.href}>{data.primaryCta.text}</a>
    </Button>
    <div className="mt-12">
      <LazyImage
        src={data.visual}
        alt={data.headline} // Use a more descriptive alt if possible, fallback to headline
        className="mx-auto rounded-lg shadow-2xl max-w-full h-auto"
      />
    </div>
  </section>
);

export default HeroSection;
