import React from "react";
import { Link } from "react-router-dom";
import { Bell, Search, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

const TopBar = () => {
  return (
    <header className="border-b border-border bg-white dark:bg-sidebar h-16 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <h2 className="text-xl font-semibold">Dashboard</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-input rounded-md bg-background w-64 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-burnt-sienna"></span>
        </Button>

        <Link to="/tools">
          <Button
            variant="outline"
            className="bg-gold text-black hover:bg-gold/90"
          >
            <Wrench className="mr-2 h-4 w-4" />
            Seller Tools
          </Button>
        </Link>

        <Button
          variant="outline"
          className="bg-shakespeare text-white hover:bg-shakespeare/90"
        >
          Connect Google Sheets
        </Button>

        <Link to="/">
          <Button
            variant="outline"
            className="bg-burnt-sienna text-white hover:bg-burnt-sienna/90"
          >
            Landing Page
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default TopBar;
