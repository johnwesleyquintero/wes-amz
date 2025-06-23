import { StackHandler, StackProvider, StackTheme } from "@stackframe/react";
import { Toaster } from "@/components/ui/toaster";
import EnvDisplay from "./components/shared/EnvDisplay";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, {
  Suspense,
  lazy,
  ComponentType,
  LazyExoticComponent,
} from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import NotFound from "./pages/NotFound";
import { SidebarProvider } from "./context/sidebar-context.tsx";
import MainLayout from "./components/layout/MainLayout";
import { stackClientApp } from "./stack";

// Define types for route configuration
type LazyComponent = LazyExoticComponent<ComponentType<unknown>>;

interface AppRouteConfig {
  path: string;
  component: LazyComponent;
  props?: Record<string, unknown>; // Optional props for components
}

// Define default suspense fallback
const DEFAULT_SUSPENSE_FALLBACK = <div>Loading...</div>; // A generic loading message is often sufficient

// Lazy-load components
const Dashboard = lazy(() => import("./pages/index.tsx"));
const Tools = lazy(() => import("./pages/Tools"));
const AcosCalculator = lazy(
  () => import("./components/amazon-seller-tools/acos-calculator"),
);
const AutomatedEmailFollowup = lazy(
  () => import("./components/amazon-seller-tools/automated-email-followup"),
);
const CompetitorAnalyzer = lazy(
  () => import("./components/amazon-seller-tools/competitor-analyzer"),
);
const DescriptionEditor = lazy(
  () => import("./components/amazon-seller-tools/description-editor"),
);
const FbaCalculator = lazy(
  () => import("./components/amazon-seller-tools/fba-calculator"),
);
const GoogleWorkspaceIntegration = lazy(
  () => import("./components/amazon-seller-tools/google-workspace-integration"),
);
const InventoryManagement = lazy(
  () => import("./components/amazon-seller-tools/inventory-management"),
);
const KeywordAnalyzer = lazy(
  () => import("./components/amazon-seller-tools/keyword-analyzer"),
);
const KeywordDeduplicator = lazy(
  () => import("./components/amazon-seller-tools/keyword-deduplicator"),
);
const KeywordIndexChecker = lazy(
  () => import("./components/amazon-seller-tools/keyword-index-checker"),
);
const KeywordTrendAnalyzer = lazy(
  () => import("./components/amazon-seller-tools/keyword-trend-analyzer"),
);
const ListingHijackAlerts = lazy(
  () => import("./components/amazon-seller-tools/listing-hijack-alerts"),
);
const ListingQualityChecker = lazy(
  () => import("./components/amazon-seller-tools/listing-quality-checker"),
);
const MarketShareAnalysis = lazy(
  () => import("./components/amazon-seller-tools/market-share-analysis"),
);
const OpportunityFinder = lazy(
  () => import("./components/amazon-seller-tools/opportunity-finder"),
);
const PpcCampaignAuditor = lazy(
  () => import("./components/amazon-seller-tools/ppc-campaign-auditor"),
);
const ProfitMarginCalculator = lazy(
  () => import("./components/amazon-seller-tools/profit-margin-calculator"),
);
const ReverseASINKeywordMiner = lazy(
  () => import("./components/amazon-seller-tools/reverse-asin-keyword-miner"),
);
const SalesEstimator = lazy(
  () => import("./components/amazon-seller-tools/sales-estimator"),
);
const SalesTrendAnalyzer = lazy(
  () => import("./components/amazon-seller-tools/sales-trend-analyzer"),
);
const WebhookManager = lazy(
  () => import("./components/amazon-seller-tools/webhook-manager"),
);
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const Register = lazy(() => import("./pages/auth/register"));
const Login = lazy(() => import("./pages/auth/login"));
const ForgotPassword = lazy(() => import("./pages/auth/forgot-password"));
const UpdatePassword = lazy(() => import("./pages/auth/update-password"));
const ProfileManagement = lazy(() => import("./pages/settings/profile"));
const OrganizationSettings = lazy(
  () => import("./pages/settings/organization"),
);
const TeamManagement = lazy(() => import("./pages/settings/team"));

// Define routes that use the MainLayout
const appRoutes: AppRouteConfig[] = [
  { path: "/dashboard", component: Dashboard },
  {
    path: "/tools",
    component: Tools,
    props: {
      showCategories: true,
      showTable: true,
      showDetails: true,
      showCTA: true,
    },
  },
  { path: "/tools/acos-calculator", component: AcosCalculator },
  {
    path: "/tools/automated-email-followup",
    component: AutomatedEmailFollowup,
  },
  { path: "/tools/competitor-analyzer", component: CompetitorAnalyzer },
  { path: "/tools/description-editor", component: DescriptionEditor },
  { path: "/tools/fba-calculator", component: FbaCalculator },
  {
    path: "/tools/google-workspace-integration",
    component: GoogleWorkspaceIntegration,
  },
  { path: "/tools/inventory-management", component: InventoryManagement },
  { path: "/tools/keyword-analyzer", component: KeywordAnalyzer },
  { path: "/tools/keyword-deduplicator", component: KeywordDeduplicator },
  { path: "/tools/keyword-index-checker", component: KeywordIndexChecker },
  { path: "/tools/keyword-trend-analyzer", component: KeywordTrendAnalyzer },
  { path: "/tools/listing-hijack-alerts", component: ListingHijackAlerts },
  { path: "/tools/listing-quality-checker", component: ListingQualityChecker },
  { path: "/tools/market-share-analysis", component: MarketShareAnalysis },
  { path: "/tools/opportunity-finder", component: OpportunityFinder },
  { path: "/tools/ppc-campaign-auditor", component: PpcCampaignAuditor },
  {
    path: "/tools/profit-margin-calculator",
    component: ProfitMarginCalculator,
  },
  {
    path: "/tools/reverse-asin-keyword-miner",
    component: ReverseASINKeywordMiner,
  },
  { path: "/tools/sales-estimator", component: SalesEstimator },
  { path: "/tools/sales-trend-analyzer", component: SalesTrendAnalyzer },
  { path: "/tools/webhook-manager", component: WebhookManager },
  { path: "/privacy-policy", component: PrivacyPolicy },
  { path: "/terms-of-service", component: TermsOfService },
  // Routes that point to the Dashboard component
  { path: "/search-analytics", component: Dashboard },
  { path: "/campaign-manager", component: Dashboard },
  { path: "/products", component: Dashboard },
  { path: "/sheets-integration", component: Dashboard },
  { path: "/team", component: Dashboard },
  { path: "/settings", component: Dashboard },
];

const queryClient = new QueryClient();

function HandlerRoutes() {
  const location = useLocation();

  return (
    <StackHandler app={stackClientApp} location={location.pathname} fullPage />
  );
}

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
              <StackProvider app={stackClientApp}>
                <StackTheme>
                  <Routes>
                    <Route path="/handler/*" element={<HandlerRoutes />} />
                    <Route path="/" element={<Suspense fallback={DEFAULT_SUSPENSE_FALLBACK}><Dashboard /></Suspense>} />
                    {/* Authentication Routes - No MainLayout */}
                    <Route
                      path="/auth/register"
                      element={
                        <Suspense fallback={DEFAULT_SUSPENSE_FALLBACK}>
                          <Register />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/auth/login"
                      element={
                        <Suspense fallback={DEFAULT_SUSPENSE_FALLBACK}>
                          <Login />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/auth/forgot-password"
                      element={
                        <Suspense fallback={DEFAULT_SUSPENSE_FALLBACK}>
                          <ForgotPassword />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/auth/update-password"
                      element={
                        <Suspense fallback={DEFAULT_SUSPENSE_FALLBACK}>
                          <UpdatePassword />
                        </Suspense>
                      }
                    />

                    {/* Routes that use the MainLayout */}
                    <Route element={<MainLayout />}>
                      {/* Dynamically generate routes using the configuration array */}
                      {appRoutes.map(
                        ({ path, component: Component, props }) => (
                          <Route
                            key={path} // Use path as a key for unique routes
                            path={path}
                            element={
                              <Suspense fallback={DEFAULT_SUSPENSE_FALLBACK}>
                                <Component {...props} />
                              </Suspense>
                            }
                          />
                        ),
                      )}
                      {/* New Settings Routes */}
                      <Route
                        path="/settings/profile"
                        element={
                          <Suspense fallback={DEFAULT_SUSPENSE_FALLBACK}>
                            <ProfileManagement />
                          </Suspense>
                        }
                      />
                      <Route
                        path="/settings/organization"
                        element={
                          <Suspense fallback={DEFAULT_SUSPENSE_FALLBACK}>
                            <OrganizationSettings />
                          </Suspense>
                        }
                      />
                      <Route
                        path="/settings/team"
                        element={
                          <Suspense fallback={DEFAULT_SUSPENSE_FALLBACK}>
                            <TeamManagement />
                          </Suspense>
                        }
                      />
                    </Route>
                    {/* The catch-all route should be the last one */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </StackTheme>
              </StackProvider>
              <EnvDisplay />
            </BrowserRouter>
          </SidebarProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </Suspense>
  );
}

export default App;
