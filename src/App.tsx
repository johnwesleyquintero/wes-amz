import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { SidebarProvider } from "./context/sidebar-context.tsx";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import {
  LandingPage,
  DashboardContent,
  PrivacyPolicy,
  TermsOfService,
  Register,
  Login,
  ForgotPassword,
  UpdatePassword,
  ProfileManagement,
  OrganizationSettings,
  TeamManagement,
  NotFound,
  SettingsLayout,
} from "./lib/app-routes.tsx";
import {
  DEFAULT_SUSPENSE_FALLBACK,
  authenticatedAppRoutes,
} from "./lib/routes.tsx";

const queryClient = new QueryClient();

function App() {
  return (
    <Suspense fallback={null}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <SidebarProvider>
            <BrowserRouter
              future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
            >
              <Routes>
                {/* Public Routes */}
                <Route
                  path="/"
                  element={
                    <Suspense fallback={DEFAULT_SUSPENSE_FALLBACK}>
                      <LandingPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/privacy-policy"
                  element={
                    <Suspense fallback={DEFAULT_SUSPENSE_FALLBACK}>
                      <PrivacyPolicy />
                    </Suspense>
                  }
                />
                <Route
                  path="/terms-of-service"
                  element={
                    <Suspense fallback={DEFAULT_SUSPENSE_FALLBACK}>
                      <TermsOfService />
                    </Suspense>
                  }
                />

                {/* Authentication Routes - No MainLayout */}
                <Route path="/auth">
                  <Route
                    path="register"
                    element={
                      <Suspense fallback={DEFAULT_SUSPENSE_FALLBACK}>
                        <Register />
                      </Suspense>
                    }
                  />
                  <Route
                    path="login"
                    element={
                      <Suspense fallback={DEFAULT_SUSPENSE_FALLBACK}>
                        <Login />
                      </Suspense>
                    }
                  />
                  <Route
                    path="forgot-password"
                    element={
                      <Suspense fallback={DEFAULT_SUSPENSE_FALLBACK}>
                        <ForgotPassword />
                      </Suspense>
                    }
                  />
                  <Route
                    path="update-password"
                    element={
                      <Suspense fallback={DEFAULT_SUSPENSE_FALLBACK}>
                        <UpdatePassword />
                      </Suspense>
                    }
                  />
                </Route>

                {/* Protected Routes (within MainLayout) */}
                <Route element={<ProtectedRoute />}>
                  {/* Protected Routes (within MainLayout) */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<MainLayout />}>
                      <Route
                        index
                        element={
                          <Suspense fallback={DEFAULT_SUSPENSE_FALLBACK}>
                            <DashboardContent />
                          </Suspense>
                        }
                      />
                    </Route>

                    {/* Direct routes for tools and settings */}
                    <Route path="/" element={<MainLayout />}>
                      {authenticatedAppRoutes.map((route) => (
                        <Route
                          key={route.path}
                          path={route.path}
                          element={
                            <Suspense fallback={DEFAULT_SUSPENSE_FALLBACK}>
                              <route.component {...route.props} />
                            </Suspense>
                          }
                        />
                      ))}
                      {/* Settings Routes */}
                      <Route
                        path="settings"
                        element={
                          <Suspense fallback={DEFAULT_SUSPENSE_FALLBACK}>
                            <SettingsLayout />
                          </Suspense>
                        }
                      >
                        <Route
                          index
                          element={
                            <Suspense fallback={DEFAULT_SUSPENSE_FALLBACK}>
                              <ProfileManagement />
                            </Suspense>
                          }
                        />
                        <Route
                          path="profile"
                          element={
                            <Suspense fallback={DEFAULT_SUSPENSE_FALLBACK}>
                              <ProfileManagement />
                            </Suspense>
                          }
                        />
                        <Route
                          path="organization"
                          element={
                            <Suspense fallback={DEFAULT_SUSPENSE_FALLBACK}>
                              <OrganizationSettings />
                            </Suspense>
                          }
                        />
                        <Route
                          path="team"
                          element={
                            <Suspense fallback={DEFAULT_SUSPENSE_FALLBACK}>
                              <TeamManagement />
                            </Suspense>
                          }
                        />
                      </Route>
                    </Route>
                  </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </SidebarProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </Suspense>
  );
}

export default App;
