import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { LazyExoticComponent, lazy } from "react";
import type { FC } from "react";
import { ThemeProvider } from "./components/theme/theme-provider.tsx";

const MainLayout: LazyExoticComponent<FC> = lazy(
  () => import("./components/layout/MainLayout"),
);
const ProtectedRoute: LazyExoticComponent<FC> = lazy(
  () => import("./components/auth/ProtectedRoute"),
);
import { ErrorBoundary } from "./components/shared/ErrorBoundary";
import { Pages, SettingsComponents } from "./lib/app-routes.tsx";
import { DEFAULT_SUSPENSE_FALLBACK } from "./lib/routes"; // Corrected import path
import { authenticatedAppRoutes } from "./lib/route-config.tsx";
import { queryClient } from "./lib/queryClient.ts";
import { publicRoutes } from "./lib/public-routes.tsx";
import { authRoutes } from "./lib/auth-routes.tsx";
import {
  generateAuthenticatedAppRoutes,
  generateRoutes,
} from "./lib/route-utils.tsx";
import { ErrorProvider } from "./context/error-context.tsx"; // Import ErrorProvider

function App() {
  return (
    <Suspense fallback={null}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <ErrorProvider>
              {" "}
              {/* Wrap ErrorBoundary with ErrorProvider */}
              <ErrorBoundary>
                <BrowserRouter
                  future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                  }}
                >
                  <Routes>
                    {/* Public Routes */}
                    {generateRoutes(publicRoutes)}

                    {/* Authentication Routes - No MainLayout */}
                    <Route path="/auth">{generateRoutes(authRoutes)}</Route>

                    {/* Protected Routes (within MainLayout) */}
                    {generateAuthenticatedAppRoutes(
                      authenticatedAppRoutes,
                      MainLayout,
                      ProtectedRoute,
                    )}

                    {/* Settings Routes */}
                    <Route
                      path="settings"
                      element={
                        <Suspense fallback={DEFAULT_SUSPENSE_FALLBACK}>
                          <SettingsComponents.SettingsLayout />
                        </Suspense>
                      }
                    >
                      {generateRoutes([
                        {
                          path: "",
                          component: SettingsComponents.ProfileManagement,
                          index: true,
                        },
                        {
                          path: "profile",
                          component: SettingsComponents.ProfileManagement,
                        },
                        {
                          path: "organization",
                          component: SettingsComponents.OrganizationSettings,
                        },
                        {
                          path: "team",
                          component: SettingsComponents.TeamManagement,
                        },
                      ])}
                    </Route>

                    <Route path="*" element={<Pages.NotFound />} />
                  </Routes>
                </BrowserRouter>
              </ErrorBoundary>
            </ErrorProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Suspense>
  );
}

export default App;
