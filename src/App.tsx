import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import { SidebarProvider } from "./context/sidebar-context";
import MainLayout from "./components/layout/MainLayout";

const AmazonSellerTools = lazy(() => import("./pages/AmazonSellerTools"));
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SidebarProvider>
        <BrowserRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Index />} />
              <Route
                path="/tools"
                element={
                  <Suspense
                    fallback={<div>Loading Amazon Seller Tools...</div>}
                  >
                    <AmazonSellerTools />
                  </Suspense>
                }
              >
                {/* Nested routes for Amazon Seller Tools */}
                <Route
                  path="acos-calculator"
                  element={
                    <Suspense fallback={<div>Loading ACOS Calculator...</div>}>
                      <AcosCalculator />
                    </Suspense>
                  }
                />
                <Route
                  path="automated-email-followup"
                  element={
                    <Suspense
                      fallback={<div>Loading Automated Email Follow-up...</div>}
                    >
                      <AutomatedEmailFollowup />
                    </Suspense>
                  }
                />
                <Route
                  path="competitor-analyzer"
                  element={
                    <Suspense
                      fallback={<div>Loading Competitor Analyzer...</div>}
                    >
                      <CompetitorAnalyzer />
                    </Suspense>
                  }
                />
                <Route
                  path="description-editor"
                  element={
                    <Suspense
                      fallback={<div>Loading Description Editor...</div>}
                    >
                      <DescriptionEditor />
                    </Suspense>
                  }
                />
                <Route
                  path="fba-calculator"
                  element={
                    <Suspense fallback={<div>Loading FBA Calculator...</div>}>
                      <FbaCalculator />
                    </Suspense>
                  }
                />
                <Route
                  path="google-workspace-integration"
                  element={
                    <Suspense
                      fallback={
                        <div>Loading Google Workspace Integration...</div>
                      }
                    >
                      <GoogleWorkspaceIntegration />
                    </Suspense>
                  }
                />
                <Route
                  path="inventory-management"
                  element={
                    <Suspense
                      fallback={<div>Loading Inventory Management...</div>}
                    >
                      <InventoryManagement />
                    </Suspense>
                  }
                />
                <Route
                  path="keyword-analyzer"
                  element={
                    <Suspense fallback={<div>Loading Keyword Analyzer...</div>}>
                      <KeywordAnalyzer />
                    </Suspense>
                  }
                />
                <Route
                  path="keyword-deduplicator"
                  element={
                    <Suspense
                      fallback={<div>Loading Keyword Deduplicator...</div>}
                    >
                      <KeywordDeduplicator />
                    </Suspense>
                  }
                />
                <Route
                  path="keyword-index-checker"
                  element={
                    <Suspense
                      fallback={<div>Loading Keyword Index Checker...</div>}
                    >
                      <KeywordIndexChecker />
                    </Suspense>
                  }
                />
                <Route
                  path="keyword-trend-analyzer"
                  element={
                    <Suspense
                      fallback={<div>Loading Keyword Trend Analyzer...</div>}
                    >
                      <KeywordTrendAnalyzer />
                    </Suspense>
                  }
                />
                <Route
                  path="listing-hijack-alerts"
                  element={
                    <Suspense
                      fallback={<div>Loading Listing Hijack Alerts...</div>}
                    >
                      <ListingHijackAlerts />
                    </Suspense>
                  }
                />
                <Route
                  path="listing-quality-checker"
                  element={
                    <Suspense
                      fallback={<div>Loading Listing Quality Checker...</div>}
                    >
                      <ListingQualityChecker />
                    </Suspense>
                  }
                />
                <Route
                  path="market-share-analysis"
                  element={
                    <Suspense
                      fallback={<div>Loading Market Share Analysis...</div>}
                    >
                      <MarketShareAnalysis />
                    </Suspense>
                  }
                />
                <Route
                  path="opportunity-finder"
                  element={
                    <Suspense
                      fallback={<div>Loading Opportunity Finder...</div>}
                    >
                      <OpportunityFinder />
                    </Suspense>
                  }
                />
                <Route
                  path="ppc-campaign-auditor"
                  element={
                    <Suspense
                      fallback={<div>Loading PPC Campaign Auditor...</div>}
                    >
                      <PpcCampaignAuditor />
                    </Suspense>
                  }
                />
                <Route
                  path="profit-margin-calculator"
                  element={
                    <Suspense
                      fallback={<div>Loading Profit Margin Calculator...</div>}
                    >
                      <ProfitMarginCalculator />
                    </Suspense>
                  }
                />
                <Route
                  path="reverse-asin-keyword-miner"
                  element={
                    <Suspense
                      fallback={
                        <div>Loading Reverse ASIN Keyword Miner...</div>
                      }
                    >
                      <ReverseASINKeywordMiner />
                    </Suspense>
                  }
                />
                <Route
                  path="sales-estimator"
                  element={
                    <Suspense fallback={<div>Loading Sales Estimator...</div>}>
                      <SalesEstimator />
                    </Suspense>
                  }
                />
                <Route
                  path="sales-trend-analyzer"
                  element={
                    <Suspense
                      fallback={<div>Loading Sales Trend Analyzer...</div>}
                    >
                      <SalesTrendAnalyzer />
                    </Suspense>
                  }
                />
                <Route
                  path="webhook-manager"
                  element={
                    <Suspense fallback={<div>Loading Webhook Manager...</div>}>
                      <WebhookManager />
                    </Suspense>
                  }
                />
                {/* Set a default child route for /tools */}
                <Route
                  index
                  element={
                    <Suspense fallback={<div>Loading FBA Calculator...</div>}>
                      <FbaCalculator />
                    </Suspense>
                  }
                />
              </Route>
              <Route path="/search-analytics" element={<Index />} />
              <Route path="/campaign-manager" element={<Index />} />
              <Route path="/products" element={<Index />} />
              <Route path="/sheets-integration" element={<Index />} />
              <Route path="/team" element={<Index />} />
              <Route path="/settings" element={<Index />} />
              {/* Remove the duplicate /amazon-seller-tools route as /tools now handles it */}
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
