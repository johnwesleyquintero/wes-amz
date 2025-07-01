"use client";

import React from "react";
import { Check } from "lucide-react";
import LazyImage from "@/components/shared/LazyImage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// Assuming the path to your data file is correct
import { highConvertingLandingData } from "../data/highConvertingLandingData";

// --- Data Interfaces ---

interface NavLink {
  text: string;
  href: string;
}

interface CtaButton {
  text: string;
  href: string;
}

interface HeaderData {
  logoText: string;
  navLinks: NavLink[];
  primaryCta: CtaButton;
}

interface HeroData {
  headline: string;
  subheadline: string;
  primaryCta: CtaButton;
  visual: string; // Assuming visual is an image src
}

interface SocialProofItem {
  id: string | number; // Use string | number for key flexibility
  text: string;
}

interface SocialProofData {
  items: SocialProofItem[];
  // Assuming the "Trusted by..." text is static or part of design, not dynamic data
  // trustedText?: string; // Could add if it were dynamic
}

interface CoreValuePropItem {
  id: string | number; // Use string | number for key flexibility
  headline: string;
  text: string;
}

interface CoreValuePropsData {
  title: string;
  items: CoreValuePropItem[];
}

interface FeatureDeepDiveData {
  headline: string;
  description: string;
  secondaryCta: CtaButton;
  visual: string; // Assuming visual is an image src
}

interface KeyMetricItem {
  id: string | number; // Use string | number for key flexibility
  text: string; // Contains both number and description, e.g., "10x Increase"
}

interface KeyMetricsData {
  title: string;
  items: KeyMetricItem[];
}

interface CustomerCaseStudyData {
  headline: string;
  visual: string; // Assuming visual is an image src (customer logo)
  quote: string;
  results: string[]; // Array of strings, some potentially starting with "<Icon: Check>"
}

interface FinalCtaData {
  headline: string;
  ctaButton: CtaButton;
}

interface FooterLink {
  text: string;
  href: string;
}

interface FooterData {
  links: FooterLink[];
  // Assuming logoText is reused from Header
}

interface LandingPageData {
  header: HeaderData;
  hero: HeroData;
  socialProof: SocialProofData;
  coreValueProps: CoreValuePropsData;
  featureDeepDive: FeatureDeepDiveData;
  keyMetrics: KeyMetricsData;
  customerCaseStudy: CustomerCaseStudyData;
  finalCta: FinalCtaData;
  footer: FooterData;
}

// --- Section Components ---

interface HeaderSectionProps {
  data: HeaderData;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ data }) => (
  <header className="bg-white shadow-md py-4">
    <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
      <div className="flex items-center">
        {/* Assuming logo src is static or handled outside this component */}
        <LazyImage
          src="/logo.svg"
          alt={`${data.logoText} Logo`}
          className="h-8 w-8 mr-2"
        />
        <span className="text-2xl font-bold text-orange-500">
          {data.logoText}
        </span>
      </div>
      <nav className="flex space-x-4">
        {data.navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-gray-700 hover:text-orange-500"
          >
            {link.text}
          </a>
        ))}
        {/* Using Button asChild for the primary CTA */}
        <Button
          asChild
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          <a href={data.primaryCta.href}>{data.primaryCta.text}</a>
        </Button>
      </nav>
    </div>
  </header>
);

interface HeroSectionProps {
  data: HeroData;
}

const HeroSection: React.FC<HeroSectionProps> = ({ data }) => (
  <section className="hero-section bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-20 px-6">
    <h1 className="text-5xl font-bold mb-4">{data.headline}</h1>
    <p className="text-xl mb-8 max-w-3xl mx-auto">{data.subheadline}</p>
    <Button
      asChild
      className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-4 rounded-full"
    >
      <a href={data.primaryCta.href}>{data.primaryCta.text}</a>
    </Button>
    <div className="mt-12">
      <LazyImage
        src={data.visual}
        alt={data.headline} // Use a more descriptive alt if possible, fallback to headline
        className="mx-auto rounded-lg shadow-2xl max-w-full h-auto"
      />
    </div>
  </section>
);

interface SocialProofSectionProps {
  data: SocialProofData;
}

const SocialProofSection: React.FC<SocialProofSectionProps> = ({ data }) => (
  <section className="social-proof-section py-16 bg-gray-50 text-center">
    {/* Hardcoded text - keep as is per original */}
    <h2 className="text-2xl font-semibold mb-8">
      Trusted by over 1,200+ Amazon Sellers
    </h2>
    <div className="flex justify-center items-center space-x-8 flex-wrap">
      {data.items.map((item) => (
        <span key={item.id} className="text-gray-600 text-lg font-medium">
          {item.text}
        </span>
      ))}
    </div>
  </section>
);

interface CoreValuePropsSectionProps {
  data: CoreValuePropsData;
}

const CoreValuePropsSection: React.FC<CoreValuePropsSectionProps> = ({
  data,
}) => (
  <section id="features" className="core-values-section py-20 px-6 bg-white">
    <h2 className="text-4xl font-bold text-center mb-12">{data.title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {data.items.map((item) => (
        <Card
          key={item.id}
          className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <CardHeader>
            <CardTitle className="text-2xl font-semibold mb-2">
              {item.headline}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{item.text}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </section>
);

interface FeatureDeepDiveSectionProps {
  data: FeatureDeepDiveData;
}

const FeatureDeepDiveSection: React.FC<FeatureDeepDiveSectionProps> = ({
  data,
}) => (
  <section className="feature-deep-dive-section py-20 px-6 bg-gray-100">
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      {/* Image on right on desktop, left on mobile */}
      <div className="md:order-2">
        <LazyImage
          src={data.visual}
          alt={data.headline} // Use a more descriptive alt if possible, fallback to headline
          className="rounded-lg shadow-xl max-w-full h-auto"
        />
      </div>
      {/* Text content on left on desktop, right on mobile */}
      <div className="md:order-1 text-left">
        <h2 className="text-4xl font-bold mb-6">{data.headline}</h2>
        <p className="text-lg text-gray-700 mb-8">{data.description}</p>
        <Button
          asChild
          className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 rounded-full"
        >
          <a href={data.secondaryCta.href}>{data.secondaryCta.text}</a>
        </Button>
      </div>
    </div>
  </section>
);

interface KeyMetricsSectionProps {
  data: KeyMetricsData;
}

const KeyMetricsSection: React.FC<KeyMetricsSectionProps> = ({ data }) => (
  <section className="key-metrics-section py-16 bg-white text-center">
    <h2 className="text-4xl font-bold mb-12">{data.title}</h2>
    <div className="flex justify-center items-center space-x-12 flex-wrap">
      {data.items.map((item) => {
        // Logic to split text like "10x Increase"
        const parts = item.text.split(" ");
        const number = parts[0];
        const description = parts.slice(1).join(" ");
        return (
          <div key={item.id} className="text-center">
            <p className="text-5xl font-bold text-blue-600">{number}</p>
            <p className="text-xl text-gray-700">{description}</p>
          </div>
        );
      })}
    </div>
  </section>
);

interface CustomerCaseStudySectionProps {
  data: CustomerCaseStudyData;
}

const CustomerCaseStudySection: React.FC<CustomerCaseStudySectionProps> = ({
  data,
}) => (
  <section className="case-study-section py-20 px-6 bg-gray-50">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-4xl font-bold mb-10">{data.headline}</h2>
      <LazyImage
        src={data.visual}
        alt="Customer Logo" // More specific alt text if possible
        className="mx-auto mb-8 h-24 object-contain"
      />
      <blockquote className="text-2xl italic text-gray-700 mb-8">
        "{data.quote}"
      </blockquote>
      <ul className="list-none p-0 space-y-3 text-lg text-gray-800">
        {data.results.map((result, index) => (
          <li key={index} className="flex items-center justify-center">
            {/* Check if result string starts with the icon placeholder */}
            {result.startsWith("<Icon: Check>") && (
              <Check className="mr-2 text-green-500 text-xl flex-shrink-0" />
            )}
            {/* Render the text after the placeholder if it exists */}
            <span>{result.replace("<Icon: Check> ", "")}</span>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

interface FinalCtaSectionProps {
  data: FinalCtaData;
}

const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ data }) => (
  <section className="final-cta-section bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-20 px-6">
    <h2 className="text-4xl font-bold mb-8">{data.headline}</h2>
    <Button
      asChild
      className="bg-orange-500 hover:bg-orange-600 text-white text-xl px-10 py-5 rounded-full"
    >
      <a href={data.ctaButton.href}>{data.ctaButton.text}</a>
    </Button>
  </section>
);

interface FooterSectionProps {
  data: FooterData;
  logoText: string; // Pass logoText explicitly if needed in the footer
}

const FooterSection: React.FC<FooterSectionProps> = ({ data, logoText }) => (
  <footer className="footer-section bg-gray-800 text-white py-12 px-6">
    <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center">
      <div className="flex items-center mb-4 md:mb-0">
        {/* Assuming logo src is static or handled outside this component */}
        <LazyImage
          src="/logo.svg"
          alt={`${logoText} Logo`}
          className="h-6 w-6 mr-2"
        />
        <span className="text-lg font-bold">{logoText}</span>
      </div>
      <nav className="flex flex-wrap space-x-6">
        {data.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-gray-300 hover:text-white text-sm"
          >
            {link.text}
          </a>
        ))}
      </nav>
    </div>
  </footer>
);

// --- Main Component ---

const Landing: React.FC = () => {
  // Type assert the imported data for safety, assuming its shape matches the interfaces
  const landingData = highConvertingLandingData as LandingPageData;

  const {
    header,
    hero,
    socialProof,
    coreValueProps,
    featureDeepDive,
    keyMetrics,
    customerCaseStudy,
    finalCta,
    footer,
  } = landingData;

  return (
    <div className="flex-1 overflow-y-auto">
      <HeaderSection data={header} />
      <HeroSection data={hero} />
      <SocialProofSection data={socialProof} />
      <CoreValuePropsSection data={coreValueProps} />
      <FeatureDeepDiveSection data={featureDeepDive} />
      <KeyMetricsSection data={keyMetrics} />
      <CustomerCaseStudySection data={customerCaseStudy} />
      <FinalCtaSection data={finalCta} />
      {/* Pass logoText specifically to Footer if needed */}
      <FooterSection data={footer} logoText={header.logoText} />
    </div>
  );
};

export default Landing;
