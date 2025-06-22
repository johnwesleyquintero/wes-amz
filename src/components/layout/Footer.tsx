import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/lib/routes";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <div className="container mx-auto px-6 text-center">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="mb-4 md:mb-0">
            <Link
              to={ROUTES.LANDING}
              className="flex items-center justify-center md:justify-start gap-2"
            >
              <img src="/logo.svg" className="h-8 w-8" alt="Alerion Logo" />
              <span className="text-2xl font-bold text-white hover:text-burnt-sienna transition-colors">
                Alerion
              </span>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-lg">
            <Link
              to={ROUTES.DASHBOARD}
              className="hover:text-burnt-sienna transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to={ROUTES.TOOLS}
              className="hover:text-burnt-sienna transition-colors"
            >
              Seller Tools
            </Link>
            <a href="#" className="hover:text-burnt-sienna transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-burnt-sienna transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6 text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Alerion. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
