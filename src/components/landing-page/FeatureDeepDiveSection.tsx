"use client";

import React from "react";
import LazyImage from "@/components/shared/LazyImage";
import { Button } from "@/components/ui/button";

interface CtaButton {
  text: string;
  href: string;
}

interface FeatureDeepDiveData {
  headline: string;
  description: string;
  secondaryCta: CtaButton;
  visual: string; // Assuming visual is an image src
}

interface FeatureDeepDiveSectionProps {
  data: FeatureDeepDiveData;
}

const FeatureDeepDiveSection: React.FC<FeatureDeepDiveSectionProps> = ({
  data,
}) => (
  <section className="feature-deep-dive-section py-20 px-6 bg-gray-100 animate-fade-in">
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      {/* Image on right on desktop, left on mobile */}
      <div className="md:order-2">
        <LazyImage
          src={data.visual}
          alt={data.headline} // Use a more descriptive alt if possible, fallback to headline
          className="rounded-lg shadow-xl max-w-full h-auto"
        />
      </div>
      {/* Text content on left on desktop, right on mobile */}
      <div className="md:order-1 text-left">
        <h2 className="text-4xl font-bold mb-6">{data.headline}</h2>
        <p className="text-lg text-gray-700 mb-8">{data.description}</p>
        <Button
          asChild
          className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 rounded-full"
        >
          <a href={data.secondaryCta.href}>{data.secondaryCta.text}</a>
        </Button>
      </div>
    </div>
  </section>
);

export default FeatureDeepDiveSection;
