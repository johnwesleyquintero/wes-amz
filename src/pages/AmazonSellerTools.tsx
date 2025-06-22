"use client";

import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
// Removed SecondarySidebar import as it's handled by MainLayout
// import SecondarySidebar from "@/components/layout/SecondarySidebar";
// Removed amazonSellerToolsNavigation import as it's handled by MainLayout
// import { amazonSellerToolsNavigation } from "@/lib/amazon-seller-tools-routes";

export default function AmazonSellerTools() {
  return (
    <div className="flex h-full">
      {/* Removed SecondarySidebar component as it's rendered by MainLayout */}
      {/*
      <SecondarySidebar
        title="Amazon Seller Tools"
        navigation={amazonSellerToolsNavigation}
      />
      */}
      <div className="flex-1 overflow-y-auto p-6">
        <Suspense fallback={<div>Loading tool...</div>}>
          <Outlet />
        </Suspense>
        <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-2">About These Tools:</p>
            <p>
              This comprehensive suite helps Amazon sellers optimize listings,
              analyze performance, and maximize profitability. All tools support
              CSV uploads for bulk processing and provide detailed analysis with
              actionable insights.
            </p>
            <p className="mt-2">
              For a demo, you can upload your own CSV files or use the manual
              entry options to see real-time calculations and analysis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
