"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CoreValuePropItem {
  id: string | number; // Use string | number for key flexibility
  headline: string;
  text: string;
}

interface CoreValuePropsData {
  title: string;
  items: CoreValuePropItem[];
}

interface CoreValuePropsSectionProps {
  data: CoreValuePropsData;
}

const CoreValuePropsSection: React.FC<CoreValuePropsSectionProps> = ({
  data,
}) => (
  <section
    id="features"
    className="core-values-section py-20 px-6 bg-white animate-fade-in"
  >
    <h2 className="text-4xl font-bold text-center mb-12">{data.title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {data.items.map((item) => (
        <Card
          key={item.id}
          className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <CardHeader>
            <CardTitle className="text-2xl font-semibold mb-2">
              {item.headline}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{item.text}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </section>
);

export default CoreValuePropsSection;
