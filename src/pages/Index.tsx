"use client";

import React from "react";
import { Check } from "lucide-react";
import LazyImage from "@/components/shared/LazyImage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { highConvertingLandingData } from "../data/highConvertingLandingData";

const Landing = () => {
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
  } = highConvertingLandingData;

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header & Navigation */}
      <header className="bg-white shadow-md py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center">
            <LazyImage
              src="/logo.svg"
              alt="Alerion Logo"
              className="h-8 w-8 mr-2"
            />
            <span className="text-2xl font-bold text-orange-500">
              {header.logoText}
            </span>
          </div>
          <nav className="flex space-x-4">
            {header.navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-orange-500"
              >
                {link.text}
              </a>
            ))}
            <Button
              asChild
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <a href={header.primaryCta.href}>{header.primaryCta.text}</a>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-20 px-6">
        <h1 className="text-5xl font-bold mb-4">{hero.headline}</h1>
        <p className="text-xl mb-8 max-w-3xl mx-auto">{hero.subheadline}</p>
        <Button
          asChild
          className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-4 rounded-full"
        >
          <a href={hero.primaryCta.href}>{hero.primaryCta.text}</a>
        </Button>
        <div className="mt-12">
          <LazyImage
            src={hero.visual}
            alt="App Dashboard Screenshot"
            className="mx-auto rounded-lg shadow-2xl max-w-full h-auto"
          />
        </div>
      </section>

      {/* Social Proof */}
      <section className="social-proof-section py-16 bg-gray-50 text-center">
        <h2 className="text-2xl font-semibold mb-8">
          Trusted by over 1,200+ Amazon Sellers
        </h2>
        <div className="flex justify-center items-center space-x-8 flex-wrap">
          {socialProof.items.map((item) => (
            <span key={item.id} className="text-gray-600 text-lg font-medium">
              {item.text}
            </span>
          ))}
        </div>
      </section>

      {/* Core Value Propositions */}
      <section
        id="features"
        className="core-values-section py-20 px-6 bg-white"
      >
        <h2 className="text-4xl font-bold text-center mb-12">
          {coreValueProps.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {coreValueProps.items.map((item) => (
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

      {/* Feature Deep Dive */}
      <section className="feature-deep-dive-section py-20 px-6 bg-gray-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="md:order-2">
            <LazyImage
              src={featureDeepDive.visual}
              alt="Feature Visual"
              className="rounded-lg shadow-xl max-w-full h-auto"
            />
          </div>
          <div className="md:order-1 text-left">
            <h2 className="text-4xl font-bold mb-6">
              {featureDeepDive.headline}
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              {featureDeepDive.description}
            </p>
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 rounded-full"
            >
              <a href={featureDeepDive.secondaryCta.href}>
                {featureDeepDive.secondaryCta.text}
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="key-metrics-section py-16 bg-white text-center">
        <h2 className="text-4xl font-bold mb-12">{keyMetrics.title}</h2>
        <div className="flex justify-center items-center space-x-12 flex-wrap">
          {keyMetrics.items.map((item) => (
            <div key={item.id} className="text-center">
              <p className="text-5xl font-bold text-blue-600">
                {item.text.split(" ")[0]}
              </p>
              <p className="text-xl text-gray-700">
                {item.text.substring(item.text.indexOf(" ") + 1)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Case Study */}
      <section className="case-study-section py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-10">
            {customerCaseStudy.headline}
          </h2>
          <LazyImage
            src={customerCaseStudy.visual}
            alt="Customer Logo"
            className="mx-auto mb-8 h-24 object-contain"
          />
          <blockquote className="text-2xl italic text-gray-700 mb-8">
            "{customerCaseStudy.quote}"
          </blockquote>
          <ul className="list-none p-0 space-y-3 text-lg text-gray-800">
            {customerCaseStudy.results.map((result, index) => (
              <li key={index} className="flex items-center justify-center">
                {result.startsWith("<Icon: Check>") ? (
                  <Check className="mr-2 text-green-500 text-xl" />
                ) : null}
                {result.replace("<Icon: Check> ", "")}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Final Call-to-Action */}
      <section className="final-cta-section bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-20 px-6">
        <h2 className="text-4xl font-bold mb-8">{finalCta.headline}</h2>
        <Button
          asChild
          className="bg-orange-500 hover:bg-orange-600 text-white text-xl px-10 py-5 rounded-full"
        >
          <a href={finalCta.ctaButton.href}>{finalCta.ctaButton.text}</a>
        </Button>
      </section>

      {/* Footer */}
      <footer className="footer-section bg-gray-800 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <LazyImage
              src="/logo.svg"
              alt="Alerion Logo"
              className="h-6 w-6 mr-2"
            />
            <span className="text-lg font-bold">{header.logoText}</span>
          </div>
          <nav className="flex flex-wrap space-x-6">
            {footer.links.map((link) => (
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
    </div>
  );
};

export default Landing;