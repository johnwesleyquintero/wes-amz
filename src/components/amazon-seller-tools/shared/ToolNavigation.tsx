"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
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
];

export function ToolNavigation() {
  const pathname = usePathname();

  return (
    <nav className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {tools.map((tool) => (
        <Link key={tool.id} href={tool.path} className="block">
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
