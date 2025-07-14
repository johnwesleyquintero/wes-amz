//Tools.tsx

"use client";

import React, { Suspense } from "react";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import { Outlet } from "react-router-dom";
import TextBlock from "@/components/shared/TextBlock";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

export default function AmazonSellerTools() {
  const introText = [
    "This page provides a suite of tools designed to help Amazon sellers optimize their listings, analyze performance, and maximize profitability.",
    "To navigate, use the sidebar on the left to select a specific tool. Each tool offers unique features and capabilities to assist you with various aspects of your Amazon selling journey.",
    "For detailed instructions and examples, please refer to the documentation provided with each tool.",
  ];

  const aboutText = [
    "This comprehensive suite helps Amazon sellers optimize listings, analyze performance, and maximize profitability. All tools support CSV uploads for bulk processing and provide detailed analysis with actionable insights.",
    "For a demo, you can upload your own CSV files or use the manual entry options to see real-time calculations and analysis.",
  ];

  return (
    <div>
      <TextBlock
        title="Welcome to the Amazon Seller Tools!"
        paragraphs={introText}
      />
      <div className="flex h-full">
        <div className="flex-1 overflow-y-auto p-6">
          <ErrorBoundary>
            <Suspense
              fallback={
                <LoadingSkeleton count={5} height="h-8" className="w-3/4" />
              }
            >
              <Outlet />
            </Suspense>
          </ErrorBoundary>
          <TextBlock title="About These Tools:" paragraphs={aboutText} />
        </div>
      </div>
    </div>
  );
}
