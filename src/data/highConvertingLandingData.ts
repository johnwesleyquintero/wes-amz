export interface ContentItem {
  id: string;
  date?: string;
  text: string;
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  visual?: string;
  logo?: string;
  quote?: string;
  results?: string[];
}

export interface HighConvertingLandingData {
  header: {
    logoText: string;
    navLinks: { text: string; href: string }[];
    primaryCta: { text: string; href: string };
  };
  hero: {
    headline: string;
    subheadline: string;
    primaryCta: { text: string; href: string };
    visual: string;
  };
  socialProof: {
    type: "logos" | "testimonials" | "metrics";
    items: ContentItem[];
  };
  coreValueProps: {
    title: string;
    items: ContentItem[];
  };
  featureDeepDive: {
    headline: string;
    visual: string;
    description: string;
    secondaryCta: { text: string; href: string };
  };
  keyMetrics: {
    title: string;
    items: ContentItem[];
  };
  customerCaseStudy: {
    headline: string;
    visual: string;
    quote: string;
    results: string[];
  };
  finalCta: {
    headline: string;
    ctaButton: { text: string; href: string };
  };
  footer: {
    links: { text: string; href: string }[];
  };
}

export const highConvertingLandingData: HighConvertingLandingData = {
  header: {
    logoText: "Alerion",
    navLinks: [
      { text: "Features", href: "#features" },
      { text: "Pricing", href: "#pricing" },
      { text: "Log In", href: "/auth/login" },
    ],
    primaryCta: { text: "Start Free Trial", href: "/auth/register" },
  },
  hero: {
    headline: "Stop Guessing. Start Growing on Amazon.",
    subheadline:
      "The powerful analytics and optimization suite for Amazon sellers who want to increase sales, lower their ACoS, and save dozens of hours every week.",
    primaryCta: { text: "Start My 14-Day Free Trial", href: "/auth/register" },
    visual: "/images/app-dashboard-screenshot.svg", // Placeholder for app screenshot
  },
  socialProof: {
    type: "metrics", // Can be 'logos', 'testimonials', or 'metrics'
    items: [
      { id: "metric-1", text: "$15M+ in sales optimized for our clients" },
      { id: "metric-2", text: "1,200+ Active Sellers" },
      { id: "metric-3", text: "25% Average ACoS Reduction" },
    ],
  },
  coreValueProps: {
    title: "Unlock Your True Amazon Profit Potential.",
    items: [
      {
        id: "value-1",
        headline: "Automate Your Reporting",
        text: "Eliminate manual tasks like downloading and combining spreadsheets, saving you valuable time.",
      },
      {
        id: "value-2",
        headline: "Optimize Your PPC Bids",
        text: "Make more money and reduce ad spend by intelligently optimizing your PPC campaigns.",
      },
      {
        id: "value-3",
        headline: "Uncover Hidden Keywords",
        text: "Gain a competitive advantage by finding high-potential keywords your competitors are missing.",
      },
    ],
  },
  featureDeepDive: {
    headline: "Go from Data Overload to Clear Actions.",
    visual: "/images/profit-dashboard-gif.svg", // Placeholder for GIF/screenshot
    description:
      "Our Profit Dashboard instantly connects to your Seller Central account to give you a real-time view of your business health, so you know exactly where to focus.",
    secondaryCta: { text: "Explore All Features", href: "#features" },
  },
  keyMetrics: {
    title: "Results That Speak For Themselves",
    items: [
      { id: "metric-1", text: "$15M+ in sales optimized for our clients" },
      { id: "metric-2", text: "1,200+ Active Sellers" },
      { id: "metric-3", text: "25% Average ACoS Reduction" },
    ],
  },
  customerCaseStudy: {
    headline: "How ScaleSmart Increased Their Revenue by 40% in 3 Months.",
    visual: "/images/customer-logo.svg", // Placeholder for customer logo/photo
    quote:
      '"Alerion transformed our Amazon business. We saw incredible growth and efficiency gains almost immediately."',
    results: [
      "<Icon: Check> +40% increase in total sales",
      "<Icon: Check> From 35% to 18% ACoS",
      "<Icon: Check> Saved 10+ hours per week on reporting",
    ],
  },
  finalCta: {
    headline: "Ready to Build a More Profitable Amazon Business?",
    ctaButton: { text: "Start Your Free Trial Now", href: "/auth/register" },
  },
  footer: {
    links: [
      { text: "About", href: "#about" },
      { text: "Features", href: "#features" },
      { text: "Pricing", href: "#pricing" },
      { text: "Contact", href: "#contact" },
      { text: "Privacy Policy", href: "#privacy" },
      { text: "Terms of Service", href: "#terms" },
    ],
  },
};
