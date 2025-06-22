import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { ModeToggle } from "@/components/theme/mode-toggle";
import MobileSidebar from "./MobileSidebar";
import Breadcrumb from "./Breadcrumb";

const TopBar = () => {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  const [notificationCount] = useState(3); // Simulate unread notifications

  return (
    <header className="border-b border-border bg-background dark:bg-sidebar h-16 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {isMobile && <MobileSidebar />}
        {/* Placeholder for Breadcrumb and Project Selector */}
        <div className="flex items-center gap-2">
          <Breadcrumb />
          {/* Project Selector will go here */}
          {/* <Button variant="ghost" size="icon"><ChevronDown className="h-4 w-4" /></Button> */}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-grow max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-input rounded-md bg-background w-full focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4 text-muted-foreground" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>

        {!isMobile && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="relative"
              onClick={() => alert("Navigate to notifications!")}
            >
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 flex items-center justify-center text-xs text-primary-foreground bg-primary rounded-full -mt-1 -mr-1">
                  {notificationCount}
                </span>
              )}
            </Button>

            <ModeToggle />

            <Link to="/">
              <Button
                variant="outline"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Landing Page
              </Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default TopBar;
