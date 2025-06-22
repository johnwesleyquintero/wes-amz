"use client";

import React, { useState, lazy, Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Search,
  CheckSquare,
  TrendingUp,
  FileText,
  Filter,
  DollarSign,
  BarChart3,
  Users,
  LineChart,
  Percent,
  Package,
  LayoutDashboard,
  Lightbulb,
  AreaChart,
  Key,
  ShieldAlert,
  Mail,
} from "lucide-react";

// Lazy load components
const FbaCalculator = lazy(
  () => import("../components/amazon-seller-tools/fba-calculator"),
);
const KeywordAnalyzer = lazy(
  () => import("../components/amazon-seller-tools/keyword-analyzer"),
);
const ListingQualityChecker = lazy(
  () => import("../components/amazon-seller-tools/listing-quality-checker"),
);
const PpcCampaignAuditor = lazy(
  () => import("../components/amazon-seller-tools/ppc-campaign-auditor"),
);
const DescriptionEditor = lazy(
  () => import("../components/amazon-seller-tools/description-editor"),
);
const KeywordDeduplicator = lazy(
  () => import("../components/amazon-seller-tools/keyword-deduplicator"),
);
const AcosCalculator = lazy(
  () => import("../components/amazon-seller-tools/acos-calculator"),
);
const SalesEstimator = lazy(
  () => import("../components/amazon-seller-tools/sales-estimator"),
);
const CompetitorAnalyzer = lazy(
  () => import("../components/amazon-seller-tools/competitor-analyzer"),
);
const KeywordTrendAnalyzer = lazy(
  () => import("../components/amazon-seller-tools/keyword-trend-analyzer"),
);
const ProfitMarginCalculator = lazy(
  () => import("../components/amazon-seller-tools/profit-margin-calculator"),
);
const OpportunityFinder = lazy(
  () => import("../components/amazon-seller-tools/opportunity-finder"),
);
const SalesTrendAnalyzer = lazy(
  () => import("../components/amazon-seller-tools/sales-trend-analyzer"),
);
const ReverseASINKeywordMiner = lazy(
  () => import("../components/amazon-seller-tools/reverse-asin-keyword-miner"),
);
const MarketShareAnalysis = lazy(
  () => import("../components/amazon-seller-tools/market-share-analysis"),
);
const KeywordIndexChecker = lazy(
  () => import("../components/amazon-seller-tools/keyword-index-checker"),
);
const ListingHijackAlerts = lazy(
  () => import("../components/amazon-seller-tools/listing-hijack-alerts"),
);
const InventoryManagement = lazy(
  () => import("../components/amazon-seller-tools/inventory-management"),
);
const AutomatedEmailFollowup = lazy(
  () => import("../components/amazon-seller-tools/automated-email-followup"),
);
const HolisticProfitsDashboard = lazy(
  () => import("../components/dashboard/holistic-profits-dashboard"),
);

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: "active" | "beta";
  version: string;
  component: React.ReactNode;
  category: string;
}

export default function FeaturedToolsSection() {
  const [activeTab, setActiveTab] = useState<string>("fba-calculator");

  const tools: Tool[] = [
    {
      id: "competitor-analyzer",
      name: "Competitor Analyzer",
      description:
        "Analyze competitor listings, pricing strategies, and market positioning",
      icon: <Users className="h-5 w-5" />,
      status: "beta", // Changed to "beta"
      version: "0.9.0", // Updated version
      component: (
        <Suspense fallback={<div>Loading Competitor Analyzer...</div>}>
          <CompetitorAnalyzer />
        </Suspense>
      ),
      category: "Market Analysis",
    },
    {
      id: "keyword-trend-analyzer",
      name: "Keyword Trend Analyzer",
      description: "Track and analyze keyword performance trends over time",
      icon: <LineChart className="h-5 w-5" />,
      status: "active",
      version: "1.0.0",
      component: (
        <Suspense fallback={<div>Loading Keyword Trend Analyzer...</div>}>
          <KeywordTrendAnalyzer />
        </Suspense>
      ),
      category: "Keyword Optimization",
    },
    {
      id: "profit-margin-calculator",
      name: "Profit Margin Calculator",
      description:
        "Calculate and analyze profit margins with detailed breakdowns",
      icon: <Percent className="h-5 w-5" />,
      status: "active",
      version: "1.0.0",
      component: (
        <Suspense fallback={<div>Loading Profit Margin Calculator...</div>}>
          <ProfitMarginCalculator />
        </Suspense>
      ),
      category: "Financial Analysis",
    },
    {
      id: "fba-calculator",
      name: "FBA Calculator",
      description:
        "Calculate profitability for FBA products with real-time ROI analysis",
      icon: <Package className="h-5 w-5" />,
      status: "active",
      version: "1.0.0",
      component: (
        <Suspense fallback={<div>Loading FBA Calculator...</div>}>
          <FbaCalculator />
        </Suspense>
      ),
      category: "Financial Analysis",
    },
    {
      id: "keyword-analyzer",
      name: "Keyword Analyzer",
      description: "Advanced keyword research and optimization tool",
      icon: <Search className="h-5 w-5" />,
      status: "active",
      version: "1.1.0",
      component: (
        <Suspense fallback={<div>Loading Keyword Analyzer...</div>}>
          <KeywordAnalyzer />
        </Suspense>
      ),
      category: "Keyword Optimization",
    },
    {
      id: "listing-quality-checker",
      name: "Listing Quality Checker",
      description: "Comprehensive listing analysis and optimization tool",
      icon: <CheckSquare className="h-5 w-5" />,
      status: "beta",
      version: "0.9.0",
      component: (
        <Suspense fallback={<div>Loading Listing Quality Checker...</div>}>
          <ListingQualityChecker />
        </Suspense>
      ),
      category: "Listing Optimization",
    },
    {
      id: "ppc-campaign-auditor",
      name: "PPC Campaign Auditor",
      description: "PPC campaign performance analysis and optimization",
      icon: <TrendingUp className="h-5 w-5" />,
      status: "active",
      version: "1.2.0",
      component: (
        <Suspense fallback={<div>Loading PPC Campaign Auditor...</div>}>
          <PpcCampaignAuditor />
        </Suspense>
      ),
      category: "PPC Management",
    },
    {
      id: "description-editor",
      name: "Description Editor",
      description: "Rich text editor for Amazon product descriptions",
      icon: <FileText className="h-5 w-5" />,
      status: "active",
      version: "1.0.1",
      component: (
        <Suspense fallback={<div>Loading Description Editor...</div>}>
          <DescriptionEditor />
        </Suspense>
      ),
      category: "Listing Optimization",
    },
    {
      id: "keyword-deduplicator",
      name: "Keyword Deduplicator",
      description:
        "Identifies and removes duplicate keywords with enhanced metrics",
      icon: <Filter className="h-5 w-5" />,
      status: "active",
      version: "1.0.0",
      component: (
        <Suspense fallback={<div>Loading Keyword Deduplicator...</div>}>
          <KeywordDeduplicator />
        </Suspense>
      ),
      category: "Keyword Optimization",
    },
    {
      id: "acos-calculator",
      name: "ACoS Calculator",
      description:
        "Advertising Cost of Sales analysis tool with advanced metrics",
      icon: <DollarSign className="h-5 w-5" />,
      status: "active",
      version: "1.0.0",
      component: (
        <Suspense fallback={<div>Loading ACoS Calculator...</div>}>
          <AcosCalculator />
        </Suspense>
      ),
      category: "PPC Management",
    },
    {
      id: "sales-estimator",
      name: "Sales Estimator",
      description:
        "Sales volume and revenue estimation tool with confidence indicators",
      icon: <BarChart3 className="h-5 w-5" />,
      status: "beta",
      version: "0.8.0",
      component: (
        <Suspense fallback={<div>Loading Sales Estimator...</div>}>
          <SalesEstimator />
        </Suspense>
      ),
      category: "Market Analysis",
    },
    {
      id: "opportunity-finder",
      name: "Opportunity Finder",
      description: "Scan the Amazon catalog to find profitable products.",
      icon: <Lightbulb className="h-5 w-5" />,
      status: "beta",
      version: "0.1.0",
      component: (
        <Suspense fallback={<div>Loading Opportunity Finder...</div>}>
          <OpportunityFinder />
        </Suspense>
      ),
      category: "Product Research",
    },
    {
      id: "sales-trend-analyzer",
      name: "Sales Trend Analyzer",
      description:
        "Input any ASIN and see its historical sales and price data visualized over time.",
      icon: <AreaChart className="h-5 w-5" />,
      status: "beta",
      version: "0.1.0",
      component: (
        <Suspense fallback={<div>Loading Sales Trend Analyzer...</div>}>
          <SalesTrendAnalyzer />
        </Suspense>
      ),
      category: "Product Research",
    },
    {
      id: "reverse-asin-keyword-miner",
      name: "Reverse ASIN Keyword Miner",
      description:
        "Input one or more competitor ASINs and extract all the organic and sponsored keywords they are ranking for.",
      icon: <Key className="h-5 w-5" />,
      status: "beta",
      version: "0.1.0",
      component: (
        <Suspense fallback={<div>Loading Reverse ASIN Keyword Miner...</div>}>
          <ReverseASINKeywordMiner />
        </Suspense>
      ),
      category: "Keyword Optimization",
    },
    {
      id: "market-share-analysis",
      name: "Market Share Analysis",
      description:
        "Display the top 10-20 products for a primary keyword, their estimated monthly sales, review velocity, and calculated market share percentage.",
      icon: <Users className="h-5 w-5" />,
      status: "beta",
      version: "0.1.0",
      component: (
        <Suspense fallback={<div>Loading Market Share Analysis...</div>}>
          <MarketShareAnalysis />
        </Suspense>
      ),
      category: "Market Analysis",
    },
    {
      id: "keyword-index-checker",
      name: "Keyword Index Checker",
      description:
        "Input your ASIN and a list of keywords to check if your product appears in the search results for each term.",
      icon: <Search className="h-5 w-5" />,
      status: "beta",
      version: "0.1.0",
      component: (
        <Suspense fallback={<div>Loading Keyword Index Checker...</div>}>
          <KeywordIndexChecker />
        </Suspense>
      ),
      category: "Listing Optimization",
    },
    {
      id: "listing-hijack-alerts",
      name: "Listing Hijack & Change Alerts",
      description:
        "Monitor your key listings for critical changes and receive immediate notifications.",
      icon: <ShieldAlert className="h-5 w-5" />,
      status: "beta",
      version: "0.1.0",
      component: (
        <Suspense
          fallback={<div>Loading Listing Hijack & Change Alerts...</div>}
        >
          <ListingHijackAlerts />
        </Suspense>
      ),
      category: "Listing Monitoring",
    },
    {
      id: "inventory-management",
      name: "Inventory Management & Forecasting",
      description:
        "Track inventory levels, calculate sales velocity, and forecast stock-out dates.",
      icon: <Package className="h-5 w-5" />,
      status: "beta",
      version: "0.1.0",
      component: (
        <Suspense
          fallback={<div>Loading Inventory Management & Forecasting...</div>}
        >
          <InventoryManagement />
        </Suspense>
      ),
      category: "Operations & Automation",
    },
    {
      id: "automated-email-followup",
      name: "Automated Email Follow-up",
      description:
        "Create automated email campaigns to buyers to request product reviews or seller feedback.",
      icon: <Mail className="h-5 w-5" />,
      status: "beta",
      version: "0.1.0",
      component: (
        <Suspense fallback={<div>Loading Automated Email Follow-up...</div>}>
          <AutomatedEmailFollowup />
        </Suspense>
      ),
      category: "Operations & Automation",
    },
    {
      id: "holistic-profits-dashboard",
      name: "Holistic Profits Dashboard",
      description:
        "A central hub for a seller's financial health, showing real-time Net Profit and Margin with trends over time.",
      icon: <LayoutDashboard className="h-5 w-5" />,
      status: "beta",
      version: "0.1.0",
      component: (
        <Suspense fallback={<div>Loading Holistic Profits Dashboard...</div>}>
          <HolisticProfitsDashboard />
        </Suspense>
      ),
      category: "Financial Analysis",
    },
  ];

  // Group tools by category
  const categorizedTools = tools.reduce(
    (acc, tool) => {
      if (!acc[tool.category]) {
        acc[tool.category] = [];
      }
      acc[tool.category].push(tool);
      return acc;
    },
    {} as { [key: string]: Tool[] },
  );

  const categories = Object.keys(categorizedTools);

  return (
    <section
      id="tools"
      className="py-16 md:py-24 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="container px-4 md:px-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden group">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="flex flex-col gap-8">
                {/* Render Tabs by Category */}
                {categories.map((category) => (
                  <div key={category} className="flex justify-center">
                    <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {categorizedTools[category].map((tool) => (
                        <TabsTrigger
                          key={tool.id}
                          value={tool.id}
                          className="flex items-center gap-2 hover:bg-accent/50 transition-colors duration-300"
                        >
                          {tool.icon}
                          <span className="hidden md:inline">{tool.name}</span>
                          {tool.status === "beta" && (
                            <Badge
                              variant="secondary"
                              className="ml-1 px-1.5 py-0.5 text-xs"
                            >
                              Beta
                            </Badge>
                          )}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>
                ))}
              </div>

              {/* Render Tab Contents */}
              {tools.map((tool) => (
                <TabsContent key={tool.id} value={tool.id} className="mt-4">
                  <Card className="hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {tool.icon}
                          <CardTitle>{tool.name}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              tool.status === "active" ? "default" : "secondary"
                            }
                          >
                            {tool.status === "active" ? "Active" : "Beta"}
                          </Badge>
                          <Badge variant="outline">v{tool.version}</Badge>
                        </div>
                      </div>
                      <CardDescription>{tool.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="group-hover:bg-accent/10 transition-colors duration-300">
                      {tool.component}
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
          <div className="p-6 bg-gray-50 dark:bg-gray-800/50">
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-2">About These Tools:</p>
              <p>
                This comprehensive suite helps Amazon sellers optimize listings,
                analyze performance, and maximize profitability. All tools
                support CSV uploads for bulk processing and provide detailed
                analysis with actionable insights.
              </p>
              <p className="mt-2">
                For a demo, you can upload your own CSV files or use the manual
                entry options to see real-time calculations and analysis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
