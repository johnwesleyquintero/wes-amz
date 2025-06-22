import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { mainNavigation } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LucideIcon } from "lucide-react";

import { useSidebar } from "@/hooks/use-sidebar";


interface NavigationItem {
  name: string;
  href?: string;
  icon?: LucideIcon;
  children?: NavigationItem[];
}

const Sidebar: React.FC = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const location = useLocation();

  const renderNavigationItems = (items: NavigationItem[]) => {
    return items.map((item) => {
      if (item.children) {
        // Render as Accordion for categories with children
        return (
          <Accordion type="single" collapsible key={item.name}>
            <AccordionItem value={item.name}>
              <AccordionTrigger className={cn("py-2", isCollapsed ? "justify-center" : "")}>
                 {item.icon && (
                    <item.icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                  )}
                {!isCollapsed && <span>{item.name}</span>}
              </AccordionTrigger>
              <AccordionContent className="pl-4 space-y-1">
                {renderNavigationItems(item.children)} {/* Recursively render children */}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      } else {
        // Render as a regular Link for individual items
        return (
          <TooltipProvider key={item.name}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to={item.href || "#"} // Provide a default href for safety
                  className={cn(
                    "flex items-center rounded-md transition-colors duration-200",
                    isCollapsed ? "justify-center h-10 w-10" : "px-3 py-2",
                    location.pathname.startsWith(item.href || "no-match") // Handle potential undefined href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  {item.icon && (
                    <item.icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                  )}
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.name}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }
    });
  };

  return (
    <aside
      className={cn(
        "border-r border-border bg-background dark:bg-sidebar hidden lg:flex flex-col h-screen transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      <div
        className={cn(
          "p-4 border-b border-border flex items-center",
          isCollapsed ? "justify-center" : "justify-between",
        )}
      >
        <Link
          to="/"
          className={cn(
            "flex items-center gap-2",
            isCollapsed ? "justify-center" : "justify-between",
          )}
        >
          <img src="/logo.svg" className="h-8 w-8" alt="Alerion Logo" />
          {!isCollapsed && <span className="text-xl font-bold">Alerion</span>}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", isCollapsed ? "rotate-180" : "")}
          onClick={toggleSidebar}
          aria-label="Toggle main sidebar"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {renderNavigationItems(mainNavigation)}
      </nav>

      <div className={cn("p-4 border-t border-border flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center cursor-pointer">
                <span className="font-medium text-sm">JD</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground">john@example.com</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {!isCollapsed && (
          <div className="flex flex-col ml-3">
            <span className="font-medium text-sm">John Doe</span>
            <span className="text-xs text-muted-foreground">john@example.com</span>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
