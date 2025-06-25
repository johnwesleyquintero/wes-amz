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
  () => import("../pages/DashboardContent.tsx"),
);
export const Tools = lazy(() => import("../pages/Tools.tsx"));
export const AcosCalculator = lazy(
  () => import("../components/amazon-seller-tools/acos-calculator.tsx"),
);
export const AutomatedEmailFollowup = lazy(
  () => import("../components/amazon-seller-tools/automated-email-followup.tsx"),
);
export const CompetitorAnalyzer = lazy(
  () => import("../components/amazon-seller-tools/competitor-analyzer.tsx"),
);
export const DescriptionEditor = lazy(
  () => import("../components/amazon-seller-tools/description-editor.tsx"),
);
export const FbaCalculator = lazy(
  () => import("../components/amazon-seller-tools/fba-calculator.tsx"),
);
export const GoogleWorkspaceIntegration = lazy(
  () =>
    import("../components/amazon-seller-tools/google-workspace-integration.tsx"),
);
export const InventoryManagement = lazy(
  () => import("../components/amazon-seller-tools/inventory-management.tsx"),
);
export const KeywordAnalyzer = lazy(
  () => import("../components/amazon-seller-tools/keyword-analyzer.tsx"),
);
export const KeywordDeduplicator = lazy(
  () => import("../components/amazon-seller-tools/keyword-deduplicator.tsx"),
);
export const KeywordIndexChecker = lazy(
  () => import("../components/amazon-seller-tools/keyword-index-checker.tsx"),
);
export const KeywordTrendAnalyzer = lazy(
  () => import("../components/amazon-seller-tools/keyword-trend-analyzer.tsx"),
);
export const ListingHijackAlerts = lazy(
  () => import("../components/amazon-seller-tools/listing-hijack-alerts.tsx"),
);
export const ListingQualityChecker = lazy(
  () => import("../components/amazon-seller-tools/listing-quality-checker.tsx"),
);
export const MarketShareAnalysis = lazy(
  () => import("../components/amazon-seller-tools/market-share-analysis.tsx"),
);
export const OpportunityFinder = lazy(
  () => import("../components/amazon-seller-tools/opportunity-finder.tsx"),
);
export const PpcCampaignAuditor = lazy(
  () => import("../components/amazon-seller-tools/ppc-campaign-auditor.tsx"),
);
export const ProfitMarginCalculator = lazy(
  () => import("../components/amazon-seller-tools/profit-margin-calculator.tsx"),
);
export const ReverseASINKeywordMiner = lazy(
  () => import("../components/amazon-seller-tools/reverse-asin-keyword-miner.tsx"),
);
export const SalesEstimator = lazy(
  () => import("../components/amazon-seller-tools/sales-estimator.tsx"),
);
export const SalesTrendAnalyzer = lazy(
  () => import("../components/amazon-seller-tools/sales-trend-analyzer.tsx"),
);
export const WebhookManager = lazy(
  () => import("../components/amazon-seller-tools/webhook-manager.tsx"),
);
export const ProductResearch = lazy(
  () => import("../components/amazon-seller-tools/product-research/index.tsx"),
);
export const LandingPage = lazy(() => import("../pages/index.tsx"));
export const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy.tsx"));
export const TermsOfService = lazy(() => import("../pages/TermsOfService.tsx"));
export const Register = lazy(() => import("../pages/auth/register.tsx"));
export const Login = lazy(() => import("../pages/auth/login.tsx"));
export const ForgotPassword = lazy(
  () => import("../pages/auth/forgot-password.tsx"),
);
export const UpdatePassword = lazy(
  () => import("../pages/auth/update-password.tsx"),
);
export const ProfileManagement = lazy(
  () => import("../pages/settings/profile.tsx"),
);
export const OrganizationSettings = lazy(
  () => import("../pages/settings/organization.tsx"),
);
export const TeamManagement = lazy(() => import("../pages/settings/team.tsx"));
export const NotFound = lazy(() => import("../pages/NotFound.tsx"));
export const SettingsLayout = lazy(
  () => import("../pages/settings/SettingsLayout.tsx"),
);
export const GeminiAIChat = lazy(() => import("../pages/GeminiAIChat.tsx"));

// Define routes that use the MainLayout
