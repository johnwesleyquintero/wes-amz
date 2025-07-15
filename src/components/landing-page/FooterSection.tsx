"use client";

import React from "react";
import LazyImage from "@/components/shared/LazyImage";

interface FooterLink {
  text: string;
  href: string;
}

interface FooterData {
  links: FooterLink[];
}

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

export default FooterSection;
