import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wrench } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import Footer from "@/components/layout/Footer";

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" className="h-8 w-8" alt="Alerion Logo" />
            <span className="text-2xl font-bold text-foreground hover:text-primary transition-colors">
              Alerion
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to={ROUTES.TOOLS}>
              <Button size="lg" className="w-full sm:w-fit">
                Seller Tools
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to={ROUTES.DASHBOARD}>
              <Button size="lg" variant="outline" className="w-full sm:w-fit">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <h1 className="text-6xl font-bold mb-6 text-primary">
            Transform Your Amazon Ads Data
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Powerful analytics dashboard for monitoring and optimizing your
            Amazon advertising performance. Get started today and unlock the
            potential of your data.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to={ROUTES.DASHBOARD}>
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-foreground font-bold px-8 py-6 text-lg"
              >
                Open Dashboard <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
            <Link to={ROUTES.TOOLS}>
              <Button
                size="lg"
                variant="outline"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-3 text-lg"
              >
                Explore Seller Tools <Wrench className="ml-2 w-6 h-6" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card p-8 rounded-xl hover:bg-muted transition-colors duration-300 border border-border shadow-lg">
            <h3 className="text-xl font-bold text-primary mb-4">
              Real-time Analytics
            </h3>
            <p className="text-muted-foreground">
              Monitor your Amazon advertising performance metrics in real-time
              with our intuitive dashboard.
            </p>
          </div>
          <div className="bg-card p-8 rounded-xl hover:bg-muted transition-colors duration-300 border border-border shadow-lg">
            <h3 className="text-xl font-bold text-accent mb-4">
              Custom Reports
            </h3>
            <p className="text-muted-foreground">
              Generate detailed reports and export them in multiple formats for
              deeper insights.
            </p>
          </div>
          <div className="bg-card p-8 rounded-xl hover:bg-muted transition-colors duration-300 border border-border shadow-lg">
            <h3 className="text-xl font-bold text-accent mb-4">
              Seller Tools Suite
            </h3>
            <p className="text-muted-foreground">
              Access our comprehensive suite of 11 specialized tools for Amazon
              sellers to optimize listings and increase profits.
            </p>
          </div>
        </div>

        <div className="mt-16 pt-16 border-t border-border">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-primary mb-8">
              Start Optimizing Your Amazon Ads Today
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to={ROUTES.DASHBOARD}>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-3 text-lg">
                  Launch Dashboard
                </Button>
              </Link>
              <Link to={ROUTES.TOOLS}>
                <Button className="bg-accent hover:bg-accent/90 text-foreground font-bold px-6 py-3 text-lg">
                  View Seller Tools
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
