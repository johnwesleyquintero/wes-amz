import { ComponentType, LazyExoticComponent, lazy } from "react";

// Define a common type for lazy components for clarity
// Using 'any' for ComponentType props as lazy does not strictly type props,
// allowing flexibility for different component prop types. 'unknown' is also an option.
export type LazyComponent = LazyExoticComponent<ComponentType<unknown>>;

// Define type for route configuration, which uses the LazyComponent type
export interface AppRouteConfig {
  path: string;
  component: LazyComponent; // The component to be lazy-loaded for this route
  props?: Record<string, unknown>; // Optional props to pass to the component
  breadcrumbName?: string; // Optional name for breadcrumbs generated from routes
}

// Grouped lazy-loaded components for better organization and maintainability.
// This approach requires static import paths for lazy() calls, which is a
// limitation of dynamic import() and bundlers like Webpack or Rollup.

export const Pages = {
  DashboardContent: lazy(
    () => import("../pages/DashboardContent.tsx"),
  ) as LazyComponent,
  Tools: lazy(() => import("../pages/Tools.tsx")) as LazyComponent,
  LandingPage: lazy(() => import("../pages/Index.tsx")) as LazyComponent,
  PrivacyPolicy: lazy(
    () => import("../pages/PrivacyPolicy.tsx"),
  ) as LazyComponent,
  TermsOfService: lazy(
    () => import("../pages/TermsOfService.tsx"),
  ) as LazyComponent,
  NotFound: lazy(() => import("../pages/NotFound.tsx")) as LazyComponent,
  GeminiAIChat: lazy(
    () => import("../pages/GeminiAIChat.tsx"),
  ) as LazyComponent,
};

export const AmazonSellerTools = {
  AcosCalculator: lazy(
    () => import("../components/amazon-seller-tools/acos-calculator.tsx"),
  ) as LazyComponent,
  AutomatedEmailFollowup: lazy(
    () =>
      import("../components/amazon-seller-tools/automated-email-followup.tsx"),
  ) as LazyComponent,
  CompetitorAnalyzer: lazy(
    () => import("../components/amazon-seller-tools/competitor-analyzer.tsx"),
  ) as LazyComponent,
  DescriptionEditor: lazy(
    () => import("../components/amazon-seller-tools/description-editor.tsx"),
  ) as LazyComponent,
  FbaCalculator: lazy(
    () => import("../components/amazon-seller-tools/fba-calculator.tsx"),
  ) as LazyComponent,
  GoogleWorkspaceIntegration: lazy(
    () =>
      import(
        "../components/amazon-seller-tools/google-workspace-integration.tsx"
      ),
  ) as LazyComponent,
  InventoryManagement: lazy(
    () => import("../components/amazon-seller-tools/inventory-management.tsx"),
  ) as LazyComponent,
  KeywordAnalyzer: lazy(
    () => import("../components/amazon-seller-tools/keyword-analyzer.tsx"),
  ) as LazyComponent,
  KeywordDeduplicator: lazy(
    () => import("../components/amazon-seller-tools/keyword-deduplicator.tsx"),
  ) as LazyComponent,
  KeywordIndexChecker: lazy(
    () => import("../components/amazon-seller-tools/keyword-index-checker.tsx"),
  ) as LazyComponent,
  KeywordTrendAnalyzer: lazy(
    () =>
      import("../components/amazon-seller-tools/keyword-trend-analyzer.tsx"),
  ) as LazyComponent,
  ListingHijackAlerts: lazy(
    () => import("../components/amazon-seller-tools/listing-hijack-alerts.tsx"),
  ) as LazyComponent,
  ListingQualityChecker: lazy(
    () =>
      import("../components/amazon-seller-tools/listing-quality-checker.tsx"),
  ) as LazyComponent,
  MarketShareAnalysis: lazy(
    () => import("../components/amazon-seller-tools/market-share-analysis.tsx"),
  ) as LazyComponent,
  OpportunityFinder: lazy(
    () => import("../components/amazon-seller-tools/opportunity-finder.tsx"),
  ) as LazyComponent,
  PpcCampaignAuditor: lazy(
    () => import("../components/amazon-seller-tools/ppc-campaign-auditor.tsx"),
  ) as LazyComponent,
  ProfitMarginCalculator: lazy(
    () =>
      import("../components/amazon-seller-tools/profit-margin-calculator.tsx"),
  ) as LazyComponent,
  ReverseASINKeywordMiner: lazy(
    () =>
      import(
        "../components/amazon-seller-tools/reverse-asin-keyword-miner.tsx"
      ),
  ) as LazyComponent,
  SalesEstimator: lazy(
    () => import("../components/amazon-seller-tools/sales-estimator.tsx"),
  ) as LazyComponent,
  SalesTrendAnalyzer: lazy(
    () => import("../components/amazon-seller-tools/sales-trend-analyzer.tsx"),
  ) as LazyComponent,
  WebhookManager: lazy(
    () => import("../components/amazon-seller-tools/webhook-manager.tsx"),
  ) as LazyComponent,
  ProductResearch: lazy(
    () =>
      import("../components/amazon-seller-tools/product-research/index.tsx"),
  ) as LazyComponent,
};

export const AuthComponents = {
  Register: lazy(() => import("../pages/auth/register.tsx")) as LazyComponent,
  Login: lazy(() => import("../pages/auth/login.tsx")) as LazyComponent,
  ForgotPassword: lazy(
    () => import("../pages/auth/forgot-password.tsx"),
  ) as LazyComponent,
  UpdatePassword: lazy(
    () => import("../pages/auth/update-password.tsx"),
  ) as LazyComponent,
};

export const SettingsComponents = {
  ProfileManagement: lazy(
    () => import("../pages/settings/profile.tsx"),
  ) as LazyComponent,
  OrganizationSettings: lazy(
    () => import("../pages/settings/organization.tsx"),
  ) as LazyComponent,
  TeamManagement: lazy(
    () => import("../pages/settings/team.tsx"),
  ) as LazyComponent,
  SettingsLayout: lazy(
    () => import("../pages/settings/SettingsLayout.tsx"),
  ) as LazyComponent,
};

// Optional: A combined object could be exported if convenient for route configurations
// export const LazyAppComponents = {
//   ...Pages,
//   ...AmazonSellerTools,
//   ...AuthComponents,
//   ...SettingsComponents,
// };

// The commented-out line about MainLayout routes implies this file is used elsewhere
// to define route configurations, where these grouped objects can be imported
// and used like: { path: '/dashboard', component: Pages.DashboardContent }
