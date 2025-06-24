import { ComponentType, LazyExoticComponent, lazy } from "react";

// Define types for route configuration
export type LazyComponent = LazyExoticComponent<ComponentType<unknown>>;

export interface AppRouteConfig {
  path: string;
  component: LazyComponent;
  props?: Record<string, unknown>; // Optional props for components
  breadcrumbName?: string; // Optional name for breadcrumbs
}

// Define default suspense fallback

// Lazy-load components
export const DashboardContent = lazy(
  () => import("../pages/DashboardContent"),
);
export const Tools = lazy(() => import("../pages/Tools"));
export const AcosCalculator = lazy(
  () => import("../components/amazon-seller-tools/acos-calculator"),
);
export const AutomatedEmailFollowup = lazy(
  () => import("../components/amazon-seller-tools/automated-email-followup"),
);
export const CompetitorAnalyzer = lazy(
  () => import("../components/amazon-seller-tools/competitor-analyzer"),
);
export const DescriptionEditor = lazy(
  () => import("../components/amazon-seller-tools/description-editor"),
);
export const FbaCalculator = lazy(
  () => import("../components/amazon-seller-tools/fba-calculator"),
);
export const GoogleWorkspaceIntegration = lazy(
  () =>
    import("../components/amazon-seller-tools/google-workspace-integration"),
);
export const InventoryManagement = lazy(
  () => import("../components/amazon-seller-tools/inventory-management"),
);
export const KeywordAnalyzer = lazy(
  () => import("../components/amazon-seller-tools/keyword-analyzer"),
);
export const KeywordDeduplicator = lazy(
  () => import("../components/amazon-seller-tools/keyword-deduplicator"),
);
export const KeywordIndexChecker = lazy(
  () => import("../components/amazon-seller-tools/keyword-index-checker"),
);
export const KeywordTrendAnalyzer = lazy(
  () => import("../components/amazon-seller-tools/keyword-trend-analyzer"),
);
export const ListingHijackAlerts = lazy(
  () => import("../components/amazon-seller-tools/listing-hijack-alerts"),
);
export const ListingQualityChecker = lazy(
  () => import("../components/amazon-seller-tools/listing-quality-checker"),
);
export const MarketShareAnalysis = lazy(
  () => import("../components/amazon-seller-tools/market-share-analysis"),
);
export const OpportunityFinder = lazy(
  () => import("../components/amazon-seller-tools/opportunity-finder"),
);
export const PpcCampaignAuditor = lazy(
  () => import("../components/amazon-seller-tools/ppc-campaign-auditor"),
);
export const ProfitMarginCalculator = lazy(
  () => import("../components/amazon-seller-tools/profit-margin-calculator"),
);
export const ReverseASINKeywordMiner = lazy(
  () => import("../components/amazon-seller-tools/reverse-asin-keyword-miner"),
);
export const SalesEstimator = lazy(
  () => import("../components/amazon-seller-tools/sales-estimator"),
);
export const SalesTrendAnalyzer = lazy(
  () => import("../components/amazon-seller-tools/sales-trend-analyzer"),
);
export const WebhookManager = lazy(
  () => import("../components/amazon-seller-tools/webhook-manager"),
);
export const ProductResearch = lazy(
  () => import("../components/amazon-seller-tools/product-research"),
);
export const LandingPage = lazy(() => import("../pages/index"));
export const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy"));
export const TermsOfService = lazy(() => import("../pages/TermsOfService"));
export const Register = lazy(() => import("../pages/auth/register"));
export const Login = lazy(() => import("../pages/auth/login"));
export const ForgotPassword = lazy(
  () => import("../pages/auth/forgot-password"),
);
export const UpdatePassword = lazy(
  () => import("../pages/auth/update-password"),
);
export const ProfileManagement = lazy(
  () => import("../pages/settings/profile"),
);
export const OrganizationSettings = lazy(
  () => import("../pages/settings/organization"),
);
export const TeamManagement = lazy(() => import("../pages/settings/team"));
export const NotFound = lazy(() => import("../pages/NotFound"));
export const SettingsLayout = lazy(
  () => import("../pages/settings/SettingsLayout"),
);

// Define routes that use the MainLayout
