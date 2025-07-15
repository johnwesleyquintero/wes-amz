"use client";

import React from "react";
import { Check } from "lucide-react";
import LazyImage from "@/components/shared/LazyImage";

interface CustomerCaseStudyData {
  headline: string;
  visual: string; // Assuming visual is an image src (customer logo)
  quote: string;
  results: string[]; // Array of strings, some potentially starting with "<Icon: Check>"
}

interface CustomerCaseStudySectionProps {
  data: CustomerCaseStudyData;
}

const CustomerCaseStudySection: React.FC<CustomerCaseStudySectionProps> = ({
  data,
}) => (
  <section className="case-study-section py-20 px-6 bg-gray-50 animate-fade-in">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-4xl font-bold mb-10">{data.headline}</h2>
      <LazyImage
        src={data.visual}
        alt="Customer Logo" // More specific alt text if possible
        className="mx-auto mb-8 h-24 object-contain"
      />
      <blockquote className="text-2xl italic text-gray-700 mb-8">
        "{data.quote}"
      </blockquote>
      <ul className="list-none p-0 space-y-3 text-lg text-gray-800">
        {data.results.map((result, index) => (
          <li key={index} className="flex items-center justify-center">
            {/* Check if result string starts with the icon placeholder */}
            {result.startsWith("<Icon: Check>") && (
              <Check className="mr-2 text-green-500 text-xl flex-shrink-0" />
            )}
            {/* Render the text after the placeholder if it exists */}
            <span>{result.replace("<Icon: Check> ", "")}</span>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default CustomerCaseStudySection;
