import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import Footer from "@/components/layout/Footer";

/**
 * Landing page component.
 * Displays introductory information and calls to action for the application.
 */
const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Navigation Bar */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Logo and App Name - Adjust if the logo/name should be a link */}
            <img
              src="/logo.svg"
              className="h-8 w-8"
              alt="Alerion application logo"
            />
            <span className="text-2xl font-bold text-foreground">Alerion</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to={ROUTES.DASHBOARD}>
              <Button size="lg" variant="outline" className="w-full sm:w-fit">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto px-6 py-20">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto space-y-8">
          <h1 className="text-6xl font-bold text-primary">
            Transform Your Amazon Ads Data
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Powerful analytics dashboard for monitoring and optimizing your
            Amazon advertising performance. Get started today and unlock the
            potential of your data.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to={ROUTES.DASHBOARD}>
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-foreground font-bold px-8 py-6 text-lg" // Specific styling for primary CTA
              >
                Open Dashboard <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature Card 1 */}
          <div className="bg-card p-8 rounded-xl hover:bg-muted transition-colors duration-300 border border-border shadow-lg">
            <h3 className="text-xl font-bold text-primary mb-4">
              Real-time Analytics
            </h3>
            <p className="text-muted-foreground">
              Monitor your Amazon advertising performance metrics in real-time
              with our intuitive dashboard.
            </p>
          </div>
          {/* Feature Card 2 */}
          <div className="bg-card p-8 rounded-xl hover:bg-muted transition-colors duration-300 border border-border shadow-lg">
            <h3 className="text-xl font-bold text-accent mb-4">
              Custom Reports
            </h3>
            <p className="text-muted-foreground">
              Generate detailed reports and export them in multiple formats for
              deeper insights.
            </p>
          </div>
          {/* Feature Card 3 */}
          <div className="bg-card p-8 rounded-xl hover:bg-muted transition-colors duration-300 border border-border shadow-lg">
            <h3 className="text-xl font-bold text-accent mb-4">
              Seller Tools Suite
            </h3>
            <p className="text-muted-foreground">
              Access our comprehensive suite of 11 specialized tools for Amazon
              sellers to optimize listings and increase profits.
            </p>
          </div>
        </section>

        {/* Final Call to Action Section */}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;
