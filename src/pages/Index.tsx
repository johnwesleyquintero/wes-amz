// index.tsx

"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContentItem {
  date: string;
  text: string;
}

interface LandingContent {
  welcomeTitle: string;
  welcomeText: string;
  announcementsTitle: string;
  announcements: ContentItem[];
  featureUpdatesTitle: string;
  featureUpdates: ContentItem[];
  navigationTitle: string;
  navigationText: string;
}

const today = new Date().toLocaleDateString();

const landingContent: LandingContent = {
  welcomeTitle: "Welcome to the Dashboard!",
  welcomeText:
    "Here you can find all the tools you need to manage your Amazon business.",
  announcementsTitle: "Announcements",
  announcements: [
    { date: today, text: "New feature: PPC Campaign Auditor!" },
    { date: today, text: "Improved Sales Trend Analyzer." },
  ],
  featureUpdatesTitle: "Feature Updates",
  featureUpdates: [
    { date: today, text: "Added support for multiple Amazon marketplaces." },
    { date: today, text: "Enhanced Keyword Analyzer with more data sources." },
  ],
  navigationTitle: "Navigation",
  navigationText:
    "Use the sidebar to navigate to different tools and features.",
};

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
            {landingContent.announcements.map(
              (item: ContentItem, index: number) => (
                // Note: Using index as key is acceptable for static lists that don't change order or get filtered/added/removed
                <li key={index}>
                  [{item.date}] - {item.text}
                </li>
              ),
            )}
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>{landingContent.featureUpdatesTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 mb-4">
            {landingContent.featureUpdates.map(
              (item: ContentItem, index: number) => (
                // Note: Using index as key is acceptable for static lists that don't change order or get filtered/added/removed
                <li key={index}>
                  [{item.date}] - {item.text}
                </li>
              ),
            )}
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
