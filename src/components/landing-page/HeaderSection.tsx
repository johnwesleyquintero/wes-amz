"use client";

import React from "react";
import LazyImage from "@/components/shared/LazyImage";
import { Button } from "@/components/ui/button";

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

interface HeaderSectionProps {
  data: HeaderData;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ data }) => (
  <header className="bg-white shadow-md py-4">
    <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between items-center py-2">
      <div className="flex items-center">
        <LazyImage
          src="/logo.svg"
          alt={`${data.logoText} Logo`}
          className="h-8 w-8 mr-2"
        />
        <span className="text-2xl font-bold text-orange-500">
          {data.logoText}
        </span>
      </div>
      <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 md:mt-0">
        {data.navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-gray-700 hover:text-orange-500 text-sm md:text-base"
          >
            {link.text}
          </a>
        ))}
        <Button
          asChild
          className="bg-orange-500 hover:bg-orange-600 text-white text-sm md:text-base px-4 py-2"
        >
          <a href={data.primaryCta.href}>{data.primaryCta.text}</a>
        </Button>
      </nav>
    </div>
  </header>
);

export default HeaderSection;
