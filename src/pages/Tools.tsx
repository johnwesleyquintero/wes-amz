//Tools.tsx

"use client";

import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";

export default function AmazonSellerTools() {
  return (
    <div>
      <div className="mb-6 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-sm text-muted-foreground">
          <p className="font-medium mb-2">
            Welcome to the Amazon Seller Tools!
          </p>
          <p>
            This page provides a suite of tools designed to help Amazon sellers
            optimize their listings, analyze performance, and maximize
            profitability.
          </p>
          <p className="mt-2">
            To navigate, use the sidebar on the left to select a specific tool.
            Each tool offers unique features and capabilities to assist you with
            various aspects of your Amazon selling journey.
          </p>
          <p className="mt-2">
            For detailed instructions and examples, please refer to the
            documentation provided with each tool.
          </p>
        </div>
      </div>
      <div className="flex h-full">
        <div className="flex-1 overflow-y-auto p-6">
          <Suspense fallback={<div>Loading tool...</div>}>
            <Outlet />
          </Suspense>
          <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-2">About These Tools:</p>
              <p>
                This comprehensive suite helps Amazon sellers optimize listings,
                analyze performance, and maximize profitability. All tools
                support CSV uploads for bulk processing and provide detailed
                analysis with actionable insights.
              </p>
              <p className="mt-2">
                For a demo, you can upload your own CSV files or use the manual
                entry options to see real-time calculations and analysis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
