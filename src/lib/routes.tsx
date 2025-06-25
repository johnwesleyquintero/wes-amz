import React from "react";
import { AppRouteConfig } from "./app-routes";
import {
  Pages,
  AmazonSellerTools,
  SettingsComponents,
} from "./app-routes";

export const ROUTES = {
  DASHBOARD: "/dashboard",
  TOOLS: "/tools",
  LANDING: "/",
};

export const DEFAULT_SUSPENSE_FALLBACK = <div>Loading...</div>;

export const authenticatedAppRoutes: AppRouteConfig[] = [
  {
    path: "tools", // Relative path for the main dashboard
    component: Pages.Tools,
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
    component: AmazonSellerTools.AcosCalculator,
    breadcrumbName: "ACoS Calculator",
  },
  {
    path: "tools/automated-email-followup",
    component: AmazonSellerTools.AutomatedEmailFollowup,
    breadcrumbName: "Automated Email Followup",
  },
  {
    path: "tools/competitor-analyzer",
    component: AmazonSellerTools.CompetitorAnalyzer,
    breadcrumbName: "Competitor Analyzer",
  },
  {
    path: "tools/description-editor",
    component: AmazonSellerTools.DescriptionEditor,
    breadcrumbName: "Description Editor",
  },
  {
    path: "tools/fba-calculator",
    component: AmazonSellerTools.FbaCalculator,
    breadcrumbName: "FBA Calculator",
  },
  {
    path: "tools/google-workspace-integration",
    component: AmazonSellerTools.GoogleWorkspaceIntegration,
    breadcrumbName: "Google Workspace Integration",
  },
  {
    path: "tools/inventory-management",
    component: AmazonSellerTools.InventoryManagement,
    breadcrumbName: "Inventory Management",
  },
  {
    path: "tools/keyword-analyzer",
    component: AmazonSellerTools.KeywordAnalyzer,
    breadcrumbName: "Keyword Analyzer",
  },
  {
    path: "tools/keyword-deduplicator",
    component: AmazonSellerTools.KeywordDeduplicator,
    breadcrumbName: "Keyword Deduplicator",
  },
  {
    path: "tools/keyword-index-checker",
    component: AmazonSellerTools.KeywordIndexChecker,
    breadcrumbName: "Keyword Index Checker",
  },
  {
    path: "tools/keyword-trend-analyzer",
    component: AmazonSellerTools.KeywordTrendAnalyzer,
    breadcrumbName: "Keyword Trend Analyzer",
  },
  {
    path: "tools/listing-hijack-alerts",
    component: AmazonSellerTools.ListingHijackAlerts,
    breadcrumbName: "Listing Hijack Alerts",
  },
  {
    path: "tools/listing-quality-checker",
    component: AmazonSellerTools.ListingQualityChecker,
    breadcrumbName: "Listing Quality Checker",
  },
  {
    path: "tools/market-share-analysis",
    component: AmazonSellerTools.MarketShareAnalysis,
    breadcrumbName: "Market Share Analysis",
  },
  {
    path: "tools/opportunity-finder",
    component: AmazonSellerTools.OpportunityFinder,
    breadcrumbName: "Opportunity Finder",
  },
  {
    path: "tools/ppc-campaign-auditor",
    component: AmazonSellerTools.PpcCampaignAuditor,
    breadcrumbName: "PPC Campaign Auditor",
  },
  {
    path: "tools/profit-margin-calculator",
    component: AmazonSellerTools.ProfitMarginCalculator,
    breadcrumbName: "Profit Margin Calculator",
  },
  {
    path: "tools/reverse-asin-keyword-miner",
    component: AmazonSellerTools.ReverseASINKeywordMiner,
    breadcrumbName: "Reverse ASIN Keyword Miner",
  },
  {
    path: "tools/sales-estimator",
    component: AmazonSellerTools.SalesEstimator,
    breadcrumbName: "Sales Estimator",
  },
  {
    path: "tools/sales-trend-analyzer",
    component: AmazonSellerTools.SalesTrendAnalyzer,
    breadcrumbName: "Sales Trend Analyzer",
  },
  {
    path: "tools/webhook-manager",
    component: AmazonSellerTools.WebhookManager,
    breadcrumbName: "Webhook Manager",
  },
  {
    path: "tools/product-research",
    component: AmazonSellerTools.ProductResearch,
    breadcrumbName: "Product Research",
  },
  { path: "settings", component: SettingsComponents.SettingsLayout, breadcrumbName: "Settings" }, // Parent route for settings
  {
    path: "settings/profile",
    component: SettingsComponents.ProfileManagement,
    breadcrumbName: "Profile",
  },
  {
    path: "settings/organization",
    component: SettingsComponents.OrganizationSettings,
    breadcrumbName: "Organization",
  },
  { path: "settings/team", component: SettingsComponents.TeamManagement, breadcrumbName: "Team" },
  {
    path: "tools/gemini-ai-chat",
    component: Pages.GeminiAIChat,
    breadcrumbName: "Gemini AI Chat",
  },
];

export const appRoutes = authenticatedAppRoutes;
