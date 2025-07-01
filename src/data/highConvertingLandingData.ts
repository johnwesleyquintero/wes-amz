/**
 * Reusable interface for a simple link or CTA.
 */
interface LinkItem {
  text: string;
  href: string;
}

/**
 * Reusable interface for a Call To Action button.
 */
interface CallToAction {
  text: string;
  href: string;
}

/**
 * Interface for items representing metrics or simple text points in a list.
 */
interface MetricItem {
  id: string;
  text: string;
}

/**
 * Interface for items representing core value propositions with a headline and text.
 */
interface CoreValuePropItem {
  id: string;
  headline: string;
  text: string;
}

/**
 * Interface for the social proof section specifically when displaying metrics.
 */
interface SocialProofMetrics {
  type: "metrics";
  items: MetricItem[];
}

// Add interfaces for other social proof types here if needed in the future, e.g.:
// interface SocialProofTestimonials {
//   type: "testimonials";
//   items: { id: string; quote: string; author: string; date?: string; photo?: string }[];
// }
// interface SocialProofLogos {
//   type: "logos";
//   items: { id: string; visual: string; alt: string; link?: string }[];
// }

/**
 * Discriminated union type for the social proof section,
 * allowing different data structures based on the 'type' property.
 */
type SocialProofSection = SocialProofMetrics; // Union with other types if added above

/**
 * Interface for the header section data.
 */
interface HeaderData {
  logoText: string;
  navLinks: LinkItem[];
  primaryCta: CallToAction;
}

/**
 * Interface for the hero section data.
 */
interface HeroData {
  headline: string;
  subheadline: string;
  primaryCta: CallToAction;
  visual: string; // Path to hero image/visual
}

/**
 * Interface for the core value propositions section data.
 */
interface CoreValuePropsData {
  title: string;
  items: CoreValuePropItem[];
}

/**
 * Interface for the feature deep dive section data.
 */
interface FeatureDeepDiveData {
  headline: string;
  visual: string; // Path to feature image/GIF
  description: string;
  secondaryCta: CallToAction;
}

/**
 * Interface for the key metrics section data.
 */
interface KeyMetricsData {
  title: string;
  items: MetricItem[];
}

/**
 * Interface for the customer case study section data.
 */
interface CustomerCaseStudyData {
  headline: string;
  visual: string; // Path to customer logo or photo
  quote: string;
  results: string[]; // List of result bullet points
}

/**
 * Interface for the final call to action section data.
 */
interface FinalCtaData {
  headline: string;
  ctaButton: CallToAction;
}

/**
 * Interface for the footer section data.
 */
interface FooterData {
  links: LinkItem[];
}

/**
 * The main interface defining the structure for all landing page content data.
 */
export interface HighConvertingLandingData {
  header: HeaderData;
  hero: HeroData;
  socialProof: SocialProofSection;
  coreValueProps: CoreValuePropsData;
  featureDeepDive: FeatureDeepDiveData;
  keyMetrics: KeyMetricsData;
  customerCaseStudy: CustomerCaseStudyData;
  finalCta: FinalCtaData;
  footer: FooterData;
}

/**
 * The complete data object for the high-converting landing page.
 */
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
    visual: "/images/app-dashboard-screenshot.svg",
  },
  socialProof: {
    type: "metrics",
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
    visual: "/images/profit-dashboard-gif.svg",
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
    visual: "/images/customer-logo.svg",
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
