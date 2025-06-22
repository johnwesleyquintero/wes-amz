"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "../components/ui/badge";
import FbaCalculator from "../components/amazon-seller-tools/fba-calculator";
import KeywordAnalyzer from "../components/amazon-seller-tools/keyword-analyzer";
import ListingQualityChecker from "../components/amazon-seller-tools/listing-quality-checker";
import PpcCampaignAuditor from "../components/amazon-seller-tools/ppc-campaign-auditor";
import DescriptionEditor from "../components/amazon-seller-tools/description-editor";
import KeywordDeduplicator from "../components/amazon-seller-tools/keyword-deduplicator";
import AcosCalculator from "../components/amazon-seller-tools/acos-calculator";
import SalesEstimator from "../components/amazon-seller-tools/sales-estimator";
import CompetitorAnalyzer from "../components/amazon-seller-tools/competitor-analyzer";
import KeywordTrendAnalyzer from "../components/amazon-seller-tools/keyword-trend-analyzer";
import ProfitMarginCalculator from "../components/amazon-seller-tools/profit-margin-calculator";
import {
  Calculator,
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
  Target,
} from "lucide-react";

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
      component: <CompetitorAnalyzer />,
      category: "Market Analysis",
    },
    {
      id: "keyword-trend-analyzer",
      name: "Keyword Trend Analyzer",
      description: "Track and analyze keyword performance trends over time",
      icon: <LineChart className="h-5 w-5" />,
      status: "active",
      version: "1.0.0",
      component: <KeywordTrendAnalyzer />,
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
      component: <ProfitMarginCalculator />,
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
      component: <FbaCalculator />,
      category: "Financial Analysis",
    },
    {
      id: "keyword-analyzer",
      name: "Keyword Analyzer",
      description: "Advanced keyword research and optimization tool",
      icon: <Search className="h-5 w-5" />,
      status: "active",
      version: "1.1.0",
      component: <KeywordAnalyzer />,
      category: "Keyword Optimization",
    },
    {
      id: "listing-quality-checker",
      name: "Listing Quality Checker",
      description: "Comprehensive listing analysis and optimization tool",
      icon: <CheckSquare className="h-5 w-5" />,
      status: "beta",
      version: "0.9.0",
      component: <ListingQualityChecker />,
      category: "Listing Optimization",
    },
    {
      id: "ppc-campaign-auditor",
      name: "PPC Campaign Auditor",
      description: "PPC campaign performance analysis and optimization",
      icon: <TrendingUp className="h-5 w-5" />,
      status: "active",
      version: "1.2.0",
      component: <PpcCampaignAuditor />,
      category: "PPC Management",
    },
    {
      id: "description-editor",
      name: "Description Editor",
      description: "Rich text editor for Amazon product descriptions",
      icon: <FileText className="h-5 w-5" />,
      status: "active",
      version: "1.0.1",
      component: <DescriptionEditor />,
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
      component: <KeywordDeduplicator />,
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
      component: <AcosCalculator />,
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
      component: <SalesEstimator />,
      category: "Market Analysis",
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
