"use client";

import React from "react";

interface SocialProofItem {
  id: string | number; // Use string | number for key flexibility
  text: string;
}

interface SocialProofData {
  items: SocialProofItem[];
}

interface SocialProofSectionProps {
  data: SocialProofData;
}

const SocialProofSection: React.FC<SocialProofSectionProps> = ({ data }) => (
  <section className="social-proof-section py-16 bg-gray-50 text-center animate-fade-in">
    {/* Hardcoded text - keep as is per original */}
    <h2 className="text-2xl font-semibold mb-8">
      Trusted by over 1,200+ Amazon Sellers
    </h2>
    <div className="flex justify-center items-center space-x-8 flex-wrap">
      {data.items.map((item) => (
        <span key={item.id} className="text-gray-600 text-lg font-medium">
          {item.text}
        </span>
      ))}
    </div>
  </section>
);

export default SocialProofSection;
