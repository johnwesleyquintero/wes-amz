"use client";

import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Calculator,
  Search,
  FileText,
  BarChart2,
  Percent,
  Users,
  TrendingUp,
  LineChart,
  DollarSign,
  Lightbulb,
  AreaChart,
  Key,
  ShieldAlert,
  Package,
  Mail,
  LayoutDashboard,
} from "lucide-react";

interface Tool {
  id: string;
  name: string;
  path: string;
  icon: React.ReactNode;
  description: string;
}

const tools: Tool[] = [
  {
    id: "fba-calculator",
    name: "FBA Calculator",
    path: "/tools/fba-calculator",
    icon: <Calculator className="w-5 h-5" />,
    description: "Calculate FBA fees and profit margins",
  },
  {
    id: "keyword-analyzer",
    name: "Keyword Analyzer",
    path: "/tools/keyword-analyzer",
    icon: <Search className="w-5 h-5" />,
    description: "Analyze keyword performance and trends",
  },
  {
    id: "description-editor",
    name: "Description Editor",
    path: "/tools/description-editor",
    icon: <FileText className="w-5 h-5" />,
    description: "Optimize product descriptions",
  },
  {
    id: "ppc-campaign-auditor",
    name: "PPC Campaign Auditor",
    path: "/tools/ppc-campaign-auditor",
    icon: <BarChart2 className="w-5 h-5" />,
    description: "Audit and optimize PPC campaigns",
  },
  {
    id: "acos-calculator",
    name: "ACoS Calculator",
    path: "/tools/acos-calculator",
    icon: <Percent className="w-5 h-5" />,
    description: "Calculate and optimize ACoS",
  },
  {
    id: "competitor-analyzer",
    name: "Competitor Analyzer",
    path: "/tools/competitor-analyzer",
    icon: <Users className="w-5 h-5" />,
    description: "Analyze competitor performance",
  },
  {
    id: "keyword-trend-analyzer",
    name: "Keyword Trend Analyzer",
    path: "/tools/keyword-trend-analyzer",
    icon: <TrendingUp className="w-5 h-5" />,
    description: "Track keyword trends over time",
  },
  {
    id: "sales-estimator",
    name: "Sales Estimator",
    path: "/tools/sales-estimator",
    icon: <LineChart className="w-5 h-5" />,
    description: "Estimate potential sales",
  },
  {
    id: "profit-margin-calculator",
    name: "Profit Margin Calculator",
    path: "/tools/profit-margin-calculator",
    icon: <DollarSign className="w-5 h-5" />,
    description: "Calculate profit margins",
  },
  {
    id: "opportunity-finder",
    name: "Opportunity Finder",
    path: "/tools/opportunity-finder",
    icon: <Lightbulb className="w-5 h-5" />,
    description: "Scan the Amazon catalog to find profitable products",
  },
  {
    id: "sales-trend-analyzer",
    name: "Sales Trend Analyzer",
    path: "/tools/sales-trend-analyzer",
    icon: <AreaChart className="w-5 h-5" />,
    description: "Analyze historical sales and price data for any ASIN",
  },
  {
    id: "reverse-asin-keyword-miner",
    name: "Reverse ASIN Keyword Miner",
    path: "/tools/reverse-asin-keyword-miner",
    icon: <Key className="w-5 h-5" />,
    description: "Extract keywords competitors are ranking for",
  },
  {
    id: "market-share-analysis",
    name: "Market Share Analysis",
    path: "/tools/market-share-analysis",
    icon: <Users className="w-5 h-5" />,
    description: "Analyze market share for a primary keyword",
  },
  {
    id: "keyword-index-checker",
    name: "Keyword Index Checker",
    path: "/tools/keyword-index-checker",
    icon: <Search className="w-5 h-5" />,
    description: "Check if your product is indexed for target keywords",
  },
  {
    id: "listing-hijack-alerts",
    name: "Listing Hijack & Change Alerts",
    path: "/tools/listing-hijack-alerts",
    icon: <ShieldAlert className="w-5 h-5" />,
    description: "Monitor listings for critical changes and hijack attempts",
  },
  {
    id: "inventory-management",
    name: "Inventory Management & Forecasting",
    path: "/tools/inventory-management",
    icon: <Package className="w-5 h-5" />,
    description: "Track inventory, sales velocity, and forecast stock-outs",
  },
  {
    id: "automated-email-followup",
    name: "Automated Email Follow-up",
    path: "/tools/automated-email-followup",
    icon: <Mail className="w-5 h-5" />,
    description: "Create automated email campaigns for reviews and feedback",
  },
  {
    id: "holistic-profits-dashboard",
    name: "Holistic Profits Dashboard",
    path: "/dashboard/holistic-profits-dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    description: "Central hub for real-time net profit and margin",
  },
];

export function ToolNavigation() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <nav className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {tools.map((tool) => (
        <Link key={tool.id} to={tool.path} className="block">
          <Button
            variant={pathname === tool.path ? "default" : "outline"}
            className="w-full h-full p-4 flex items-center gap-3 justify-start text-left"
          >
            {tool.icon}
            <div>
              <div className="font-medium">{tool.name}</div>
              <div className="text-sm text-muted-foreground">
                {tool.description}
              </div>
            </div>
          </Button>
        </Link>
      ))}
    </nav>
  );
}
