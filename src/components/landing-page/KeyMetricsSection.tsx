"use client";

import React from "react";

interface KeyMetricItem {
  id: string | number; // Use string | number for key flexibility
  text: string; // Contains both number and description, e.g., "10x Increase"
}

interface KeyMetricsData {
  title: string;
  items: KeyMetricItem[];
}

interface KeyMetricsSectionProps {
  data: KeyMetricsData;
}

const KeyMetricsSection: React.FC<KeyMetricsSectionProps> = ({ data }) => (
  <section className="key-metrics-section py-16 bg-white text-center animate-fade-in">
    <h2 className="text-4xl font-bold mb-12">{data.title}</h2>
    <div className="flex justify-center items-center space-x-12 flex-wrap">
      {data.items.map((item) => {
        // Logic to split text like "10x Increase"
        const parts = item.text.split(" ");
        const number = parts[0];
        const description = parts.slice(1).join(" ");
        return (
          <div key={item.id} className="text-center">
            <p className="text-5xl font-bold text-blue-600">{number}</p>
            <p className="text-xl text-gray-700">{description}</p>
          </div>
        );
      })}
    </div>
  </section>
);

export default KeyMetricsSection;
