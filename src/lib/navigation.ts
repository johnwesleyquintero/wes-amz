import {
  BarChart3,
  Settings,
  Scale,
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
  Wrench,
  LucideIcon,
  CreditCard, // Added for Billing example
  Bell, // Added for Notifications example
} from "lucide-react";

// Define interfaces for navigation structure
export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

export interface NavigationCategory {
  name: string;
  icon: LucideIcon;
  children: NavigationItem[];
}

export interface MainNavigationItem {
  name: string;
  icon: LucideIcon;
  href?: string; // Optional href for top-level items
  children?: NavigationCategory[]; // Optional children for nested structure
}

// Main application navigation data
export const mainNavigation: MainNavigationItem[] = [
  {
    name: "Amazon Seller Tools",
    icon: Wrench,
    href: "/tools", // Link to the main tools page
    children: [
      {
        name: "Analytics & Reporting",
        icon: BarChart3,
        children: [
          {
            name: "ACOS Calculator",
            href: "/tools/acos-calculator",
            icon: Calculator,
          },
          {
            name: "Competitor Analyzer",
            href: "/tools/competitor-analyzer",
            icon: UsersIcon,
          },
          {
            name: "Market Share Analysis",
            href: "/tools/market-share-analysis",
            icon: PieChart,
          },
          {
            name: "PPC Campaign Auditor",
            href: "/tools/ppc-campaign-auditor",
            icon: DollarSign,
          },
          {
            name: "Profit Margin Calculator",
            href: "/tools/profit-margin-calculator",
            icon: DollarSign,
          },
          {
            name: "Sales Estimator",
            href: "/tools/sales-estimator",
            icon: Activity,
          },
          {
            name: "Sales Trend Analyzer",
            href: "/tools/sales-trend-analyzer",
            icon: Activity,
          },
        ],
      },
      {
        name: "Listing & Keyword Tools",
        icon: Search,
        children: [
          {
            name: "Description Editor",
            href: "/tools/description-editor",
            icon: Edit,
          },
          {
            name: "Keyword Analyzer",
            href: "/tools/keyword-analyzer",
            icon: Key,
          },
          {
            name: "Keyword Deduplicator",
            href: "/tools/keyword-deduplicator",
            icon: Minimize,
          },
          {
            name: "Keyword Index Checker",
            href: "/tools/keyword-index-checker",
            icon: CheckCircle,
          },
          {
            name: "Keyword Trend Analyzer",
            href: "/tools/keyword-trend-analyzer",
            icon: TrendingUp,
          },
          {
            name: "Listing Quality Checker",
            href: "/tools/listing-quality-checker",
            icon: Award,
          },
          {
            name: "Opportunity Finder",
            href: "/tools/opportunity-finder",
            icon: Lightbulb,
          },
          {
            name: "Reverse ASIN Keyword Miner",
            href: "/tools/reverse-asin-keyword-miner",
            icon: Drill,
          },
        ],
      },
      {
        name: "Operations & Management",
        icon: ShoppingBag,
        children: [
          {
            name: "Automated Email Follow-up",
            href: "/tools/automated-email-followup",
            icon: Mail,
          },
          {
            name: "FBA Calculator",
            href: "/tools/fba-calculator",
            icon: Package,
          },
          {
            name: "Inventory Management",
            href: "/tools/inventory-management",
            icon: Warehouse,
          },
          {
            name: "Webhook Manager",
            href: "/tools/webhook-manager",
            icon: Webhook,
          },
        ],
      },
      {
        name: "Integrations",
        icon: Cloud,
        children: [
          {
            name: "Google Workspace Integration",
            href: "/tools/google-workspace-integration",
            icon: Cloud,
          },
          {
            name: "Gemini AI Chat",
            href: "/tools/gemini-ai-ai-chat",
            icon: Lightbulb,
          },
        ],
      },
    ],
  },
  {
    name: "Settings",
    icon: Settings,
    children: [
      // This array contains NavigationCategory, representing sections
      {
        // Profile Section
        name: "Profile",
        icon: UsersIcon, // Icon for the section
        children: [
          // This array contains NavigationItem, the links within the section
          {
            name: "My Profile", // Link for the profile page
            href: "/settings/profile",
            icon: UsersIcon, // Icon for the link (can be same as section or different)
          },
          // Add other profile-related links here if needed, e.g., "Appearance"
        ],
      },
      {
        // Account Section
        name: "Account",
        icon: Key,
        children: [
          {
            name: "Change Password",
            href: "/settings/account/change-password",
            icon: Key,
          },
          {
            name: "Email Preferences",
            href: "/settings/account/email-preferences",
            icon: Mail,
          },
          {
            name: "Delete Account", // Example of a more sensitive setting
            href: "/settings/account/delete-account",
            icon: UsersIcon, // Or a trash icon etc.
          },
        ],
      },
      {
        // Billing Section
        name: "Billing",
        icon: DollarSign, // Or CreditCard
        children: [
          {
            name: "Payment Methods",
            href: "/settings/billing/payment-methods",
            icon: CreditCard,
          },
          {
            name: "Subscription Plan",
            href: "/settings/billing/subscription",
            icon: Award,
          },
          {
            name: "Billing History",
            href: "/settings/billing/history",
            icon: BarChart3,
          },
        ],
      },
      {
        // Notifications Section
        name: "Notifications",
        icon: Bell,
        children: [
          {
            name: "Email Notifications",
            href: "/settings/notifications/email",
            icon: Mail,
          },
          {
            name: "App Notifications",
            href: "/settings/notifications/app",
            icon: Bell,
          },
        ],
      },
      {
        // Integrations Section (Settings specific)
        name: "Integrations",
        icon: Cloud,
        children: [
          {
            name: "Manage Connections",
            href: "/settings/integrations/manage",
            icon: Cloud,
          },
          // Note: If these settings control the tool integrations, maybe link from here
          // to specific integration settings pages, e.g., /settings/integrations/google-workspace
        ],
      },
      {
        // Security Section
        name: "Security",
        icon: Key,
        children: [
          {
            name: "Two-Factor Authentication",
            href: "/settings/security/2fa",
            icon: Key,
          },
          {
            name: "Login Activity",
            href: "/settings/security/activity",
            icon: Activity,
          },
        ],
      },
      {
        // Legal Section (structured correctly already)
        name: "Legal",
        icon: Scale,
        children: [
          {
            name: "Privacy Policy",
            href: "/privacy-policy", // Keep original paths if they aren't sub-pages of /settings/legal
            icon: Scale,
          },
          {
            name: "Terms of Service",
            href: "/terms-of-service", // Keep original paths
            icon: Scale,
          },
          // Note: If these are external links or generic pages, consider if they
          // truly belong in the *user settings* navigation vs. a general footer/help section.
          // Assuming they belong in settings for now.
        ],
      },
      // Add other settings sections as needed (e.g., Appearance, Plans, API Access)
    ],
  },
];

/**
 * Flattens an array of NavigationCategory into a single array of NavigationItem.
 * @param navigationCategories An array of NavigationCategory objects.
 * @returns A flattened array of NavigationItem objects.
 */
export const getFlattenedNavigation = (
  navigationCategories: NavigationCategory[],
): NavigationItem[] => {
  if (!navigationCategories) {
    return [];
  }
  // Use flatMap for a cleaner flatten operation
  return navigationCategories.flatMap((category) => category.children);
};

/**
 * Finds a MainNavigationItem by its name and returns its children categories.
 * @param name The name of the MainNavigationItem to find.
 * @returns An array of NavigationCategory or undefined if not found or no children categories.
 */
const findNavigationCategoriesByName = (
  name: string,
): NavigationCategory[] | undefined => {
  const mainItem = mainNavigation.find((item) => item.name === name);
  // Safely check if the item exists, has children, and if children is an array of categories
  // No need for Array.isArray check if we trust the static type, but it adds runtime safety
  if (mainItem?.children && Array.isArray(mainItem.children)) {
    return mainItem.children; // children is already NavigationCategory[] based on type
  }
  return undefined;
};

// Create secondary navigation objects by finding main items and flattening their children
// NOTE: For settings, flattening loses the category structure.
// You will likely want to use `settingsCategories` directly to render a structured sidebar.
const toolsCategories = findNavigationCategoriesByName("Amazon Seller Tools");
const settingsCategories = findNavigationCategoriesByName("Settings");

export const secondaryNavigation = {
  "/tools": {
    title: "Amazon Seller Tools",
    navigation: toolsCategories ? getFlattenedNavigation(toolsCategories) : [],
  },
  "/settings": {
    title: "Settings",
    // For a settings sidebar, you likely DO NOT want to flatten.
    // You would pass settingsCategories directly to your rendering component.
    // This `secondaryNavigation["/settings"]` might be useful for a *flat*
    // list elsewhere, but not a typical settings sidebar structure.
    navigation: settingsCategories
      ? getFlattenedNavigation(settingsCategories)
      : [],
    // Consider adding the structured categories here as well if needed elsewhere
    structuredNavigation: settingsCategories,
  },
};
