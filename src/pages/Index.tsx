// index.tsx

"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { landingContent, ContentItem } from "../data/landingContent";

const Landing = () => {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">
        {landingContent.welcomeTitle}
      </h1>
      <p className="mb-4">{landingContent.welcomeText}</p>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>{landingContent.announcementsTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 mb-4">
            {landingContent.announcements.map((item: ContentItem) => (
              <li key={item.id}>
                [{item.date}] - {item.text}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>{landingContent.featureUpdatesTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 mb-4">
            {landingContent.featureUpdates.map((item: ContentItem) => (
              <li key={item.id}>
                [{item.date}] - {item.text}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>{landingContent.navigationTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{landingContent.navigationText}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Landing;
