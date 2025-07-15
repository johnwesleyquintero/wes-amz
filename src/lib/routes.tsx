import React from "react";
import LoadingSpinner from "@/components/shared/LoadingSpinner"; // Import LoadingSpinner

export const ROUTES = {
  DASHBOARD: "/dashboard",
  TOOLS: "/tools",
  LANDING: "/",
};

export const DEFAULT_SUSPENSE_FALLBACK = (
  <div className="flex justify-center items-center h-screen">
    <LoadingSpinner size="lg" />
  </div>
);
