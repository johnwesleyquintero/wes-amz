import React from "react";
import { AppRouteConfig } from "./app-routes.tsx";
import {
  Tools,
  AcosCalculator,
  AutomatedEmailFollowup,
  CompetitorAnalyzer,
  DescriptionEditor,
  FbaCalculator,
  GoogleWorkspaceIntegration,
  InventoryManagement,
  KeywordAnalyzer,
  KeywordDeduplicator,
  KeywordIndexChecker,
  KeywordTrendAnalyzer,
  ListingHijackAlerts,
  ListingQualityChecker,
  MarketShareAnalysis,
  OpportunityFinder,
  PpcCampaignAuditor,
  ProfitMarginCalculator,
  ReverseASINKeywordMiner,
  SalesEstimator,
  SalesTrendAnalyzer,
  WebhookManager,
  ProductResearch,
  SettingsLayout,
  ProfileManagement,
  OrganizationSettings,
  TeamManagement,
} from "./app-routes.tsx";

export const ROUTES = {
  DASHBOARD: "/dashboard",
  TOOLS: "/tools",
  LANDING: "/",
};

export const DEFAULT_SUSPENSE_FALLBACK = <div>Loading...</div>;

export const authenticatedAppRoutes: AppRouteConfig[] = [
  {
    path: "tools", // Relative path for the main dashboard
    component: Tools,
    props: {
      showCategories: true,
      showTable: true,
      showDetails: true,
      showCTA: true,
    },
    breadcrumbName: "Tools",
  },
  // Other tool routes, adjusted to be relative to /app
  {
    path: "tools/acos-calculator",
    component: AcosCalculator,
    breadcrumbName: "ACoS Calculator",
  },
  {
    path: "tools/automated-email-followup",
    component: AutomatedEmailFollowup,
    breadcrumbName: "Automated Email Followup",
  },
  {
    path: "tools/competitor-analyzer",
    component: CompetitorAnalyzer,
    breadcrumbName: "Competitor Analyzer",
  },
  {
    path: "tools/description-editor",
    component: DescriptionEditor,
    breadcrumbName: "Description Editor",
  },
  {
    path: "tools/fba-calculator",
    component: FbaCalculator,
    breadcrumbName: "FBA Calculator",
  },
  {
    path: "tools/google-workspace-integration",
    component: GoogleWorkspaceIntegration,
    breadcrumbName: "Google Workspace Integration",
  },
  {
    path: "tools/inventory-management",
    component: InventoryManagement,
    breadcrumbName: "Inventory Management",
  },
  {
    path: "tools/keyword-analyzer",
    component: KeywordAnalyzer,
    breadcrumbName: "Keyword Analyzer",
  },
  {
    path: "tools/keyword-deduplicator",
    component: KeywordDeduplicator,
    breadcrumbName: "Keyword Deduplicator",
  },
  {
    path: "tools/keyword-index-checker",
    component: KeywordIndexChecker,
    breadcrumbName: "Keyword Index Checker",
  },
  {
    path: "tools/keyword-trend-analyzer",
    component: KeywordTrendAnalyzer,
    breadcrumbName: "Keyword Trend Analyzer",
  },
  {
    path: "tools/listing-hijack-alerts",
    component: ListingHijackAlerts,
    breadcrumbName: "Listing Hijack Alerts",
  },
  {
    path: "tools/listing-quality-checker",
    component: ListingQualityChecker,
    breadcrumbName: "Listing Quality Checker",
  },
  {
    path: "tools/market-share-analysis",
    component: MarketShareAnalysis,
    breadcrumbName: "Market Share Analysis",
  },
  {
    path: "tools/opportunity-finder",
    component: OpportunityFinder,
    breadcrumbName: "Opportunity Finder",
  },
  {
    path: "tools/ppc-campaign-auditor",
    component: PpcCampaignAuditor,
    breadcrumbName: "PPC Campaign Auditor",
  },
  {
    path: "tools/profit-margin-calculator",
    component: ProfitMarginCalculator,
    breadcrumbName: "Profit Margin Calculator",
  },
  {
    path: "tools/reverse-asin-keyword-miner",
    component: ReverseASINKeywordMiner,
    breadcrumbName: "Reverse ASIN Keyword Miner",
  },
  {
    path: "tools/sales-estimator",
    component: SalesEstimator,
    breadcrumbName: "Sales Estimator",
  },
  {
    path: "tools/sales-trend-analyzer",
    component: SalesTrendAnalyzer,
    breadcrumbName: "Sales Trend Analyzer",
  },
  {
    path: "tools/webhook-manager",
    component: WebhookManager,
    breadcrumbName: "Webhook Manager",
  },
  {
    path: "tools/product-research",
    component: ProductResearch,
    breadcrumbName: "Product Research",
  },
  { path: "settings", component: SettingsLayout, breadcrumbName: "Settings" }, // Parent route for settings
  {
    path: "settings/profile",
    component: ProfileManagement,
    breadcrumbName: "Profile",
  },
  {
    path: "settings/organization",
    component: OrganizationSettings,
    breadcrumbName: "Organization",
  },
  { path: "settings/team", component: TeamManagement, breadcrumbName: "Team" },
];

export const appRoutes = authenticatedAppRoutes;
