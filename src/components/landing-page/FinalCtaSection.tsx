"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface CtaButton {
  text: string;
  href: string;
}

interface FinalCtaData {
  headline: string;
  ctaButton: CtaButton;
}

interface FinalCtaSectionProps {
  data: FinalCtaData;
}

const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ data }) => (
  <section className="final-cta-section bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-20 px-6 animate-fade-in">
    <h2 className="text-4xl font-bold mb-8">{data.headline}</h2>
    <Button
      asChild
      className="bg-orange-500 hover:bg-orange-600 text-white text-xl px-10 py-5 rounded-full"
    >
      <a href={data.ctaButton.href}>{data.ctaButton.text}</a>
    </Button>
  </section>
);

export default FinalCtaSection;
