import {
  BarChart3,
  FileSpreadsheet,
  Settings,
  // Removed unused imports: Users, LayoutDashboard, AlertTriangle, Folder
  Search,
  ShoppingBag,
  Calculator,
  Mail,
  Users as UsersIcon,
  Edit,
  Package,
  Cloud,
  Warehouse,
  Key,
  Minimize,
  CheckCircle,
  TrendingUp,
  Award,
  PieChart,
  Lightbulb,
  DollarSign,
  Drill,
  Activity,
  Webhook,
  Wrench, // Added Wrench icon for Amazon Seller Tools
} from "lucide-react";


export const mainNavigation = [
  {
    name: "Amazon Seller Tools",
    icon: Wrench, // Using Wrench for Amazon Seller Tools
    href: "/tools", // Link to the main tools page
    children: [
      {
        name: "Analytics & Reporting",
        icon: BarChart3,
        children: [
          { name: 'ACOS Calculator', href: '/tools/acos-calculator', icon: Calculator },
          { name: 'Competitor Analyzer', href: '/tools/competitor-analyzer', icon: UsersIcon },
          { name: 'Market Share Analysis', href: '/tools/market-share-analysis', icon: PieChart },
          { name: 'PPC Campaign Auditor', href: '/tools/ppc-campaign-auditor', icon: DollarSign },
          { name: 'Profit Margin Calculator', href: '/tools/profit-margin-calculator', icon: DollarSign },
          { name: 'Sales Estimator', href: '/tools/sales-estimator', icon: Activity },
          { name: 'Sales Trend Analyzer', href: '/tools/sales-trend-analyzer', icon: Activity },
        ]
      },
      {
        name: "Listing & Keyword Tools",
        icon: Search,
        children: [
          { name: 'Description Editor', href: '/tools/description-editor', icon: Edit },
          { name: 'Keyword Analyzer', href: '/tools/keyword-analyzer', icon: Key },
          { name: 'Keyword Deduplicator', href: '/tools/keyword-deduplicator', icon: Minimize },
          { name: 'Keyword Index Checker', href: '/tools/keyword-index-checker', icon: CheckCircle },
          { name: 'Keyword Trend Analyzer', href: '/tools/keyword-trend-analyzer', icon: TrendingUp },
          { name: 'Listing Quality Checker', href: '/tools/listing-quality-checker', icon: Award },
          { name: 'Opportunity Finder', href: '/tools/opportunity-finder', icon: Lightbulb },
          { name: 'Reverse ASIN Keyword Miner', href: '/tools/reverse-asin-keyword-miner', icon: Drill },
        ]
      },
      {
        name: "Operations & Management",
        icon: ShoppingBag,
        children: [
          { name: 'Automated Email Follow-up', href: '/tools/automated-email-followup', icon: Mail },
          { name: 'FBA Calculator', href: '/tools/fba-calculator', icon: Package },
          { name: 'Inventory Management', href: '/tools/inventory-management', icon: Warehouse },
          { name: 'Webhook Manager', href: '/tools/webhook-manager', icon: Webhook },
        ]
      },
      {
        name: "Integrations",
        icon: Cloud,
        children: [
          { name: 'Google Workspace Integration', href: '/tools/google-workspace-integration', icon: Cloud },
          { name: 'Google Sheets', href: '/tools/sheets-integration', icon: FileSpreadsheet },
        ]
      },
    ]
  },
  { name: "Settings", href: "/settings", icon: Settings },
];

export const secondaryNavigation = {
  "/tools": {
    title: "Amazon Seller Tools",
    navigation: [
      { name: 'ACOS Calculator', href: '/tools/acos-calculator', icon: Calculator },
      { name: 'Competitor Analyzer', href: '/tools/competitor-analyzer', icon: UsersIcon },
      { name: 'Market Share Analysis', href: '/tools/market-share-analysis', icon: PieChart },
      { name: 'PPC Campaign Auditor', href: '/tools/ppc-campaign-auditor', icon: DollarSign },
      { name: 'Profit Margin Calculator', href: '/tools/profit-margin-calculator', icon: DollarSign },
      { name: 'Sales Estimator', href: '/tools/sales-estimator', icon: Activity },
      { name: 'Sales Trend Analyzer', href: '/tools/sales-trend-analyzer', icon: Activity },
      { name: 'Description Editor', href: '/tools/description-editor', icon: Edit },
      { name: 'Keyword Analyzer', href: '/tools/keyword-analyzer', icon: Key },
      { name: 'Keyword Deduplicator', href: '/tools/keyword-deduplicator', icon: Minimize },
      { name: 'Keyword Index Checker', href: '/tools/keyword-index-checker', icon: CheckCircle },
      { name: 'Keyword Trend Analyzer', href: '/tools/keyword-trend-analyzer', icon: TrendingUp },
      { name: 'Listing Quality Checker', href: '/tools/listing-quality-checker', icon: Award },
      { name: 'Opportunity Finder', href: '/tools/opportunity-finder', icon: Lightbulb },
      { name: 'Reverse ASIN Keyword Miner', href: '/tools/reverse-asin-keyword-miner', icon: Drill },
      { name: 'Automated Email Follow-up', href: '/tools/automated-email-followup', icon: Mail },
      { name: 'FBA Calculator', href: '/tools/fba-calculator', icon: Package },
      { name: 'Inventory Management', href: '/tools/inventory-management', icon: Warehouse },
      { name: 'Webhook Manager', href: '/tools/webhook-manager', icon: Webhook },
      { name: 'Google Workspace Integration', href: '/tools/google-workspace-integration', icon: Cloud },
      { name: 'Google Sheets', href: '/tools/sheets-integration', icon: FileSpreadsheet },
    ],
  },
};