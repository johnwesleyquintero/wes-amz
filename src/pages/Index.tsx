"use client";

import React from "react";
import HeaderSection from "@/components/landing-page/HeaderSection";
import HeroSection from "@/components/landing-page/HeroSection";
import SocialProofSection from "@/components/landing-page/SocialProofSection";
import CoreValuePropsSection from "@/components/landing-page/CoreValuePropsSection";
import FeatureDeepDiveSection from "@/components/landing-page/FeatureDeepDiveSection";
import KeyMetricsSection from "@/components/landing-page/KeyMetricsSection";
import CustomerCaseStudySection from "@/components/landing-page/CustomerCaseStudySection";
import FinalCtaSection from "@/components/landing-page/FinalCtaSection";
import FooterSection from "@/components/landing-page/FooterSection";
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
