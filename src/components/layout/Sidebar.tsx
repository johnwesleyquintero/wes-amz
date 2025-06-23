import React, { useCallback } from "react";
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

import { useSidebar } from "@/hooks/use-sidebar";

interface NavigationItem {
  name: string;
  href?: string;
  icon?: React.ElementType;
  children?: NavigationItem[];
}

const Sidebar: React.FC = React.memo(() => {
  Sidebar.displayName = "Sidebar";
  const { isCollapsed, toggleSidebar } = useSidebar();
  const location = useLocation();

  const renderNavigationItems = useCallback(
    (items: NavigationItem[], parentPath: string = "") => {
      return items.map((item) => {
        const currentPath =
          item.href ||
          `${parentPath}/${item.name.toLowerCase().replace(/\s/g, "-")}`;
        const isActive = location.pathname.startsWith(currentPath);

        if (item.children) {
          const defaultOpen = item.children.some((child) =>
            location.pathname.startsWith(child.href || ""),
          );

          return (
            <Accordion
              type="single"
              collapsible
              key={item.name}
              defaultValue={defaultOpen ? item.name : undefined}
            >
              <AccordionItem value={item.name}>
                <AccordionTrigger
                  className={cn("py-2", isCollapsed ? "justify-center" : "")}
                >
                  {item.icon && (
                    <item.icon
                      className={cn("h-5 w-5", !isCollapsed && "mr-3")}
                    />
                  )}
                  {!isCollapsed && <span>{item.name}</span>}
                </AccordionTrigger>
                <AccordionContent className="pl-4 space-y-1">
                  {renderNavigationItems(item.children, currentPath)}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        } else {
          return (
            <TooltipProvider key={item.name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to={item.href || "#"}
                    className={cn(
                      "flex items-center rounded-md transition-colors duration-200",
                      isCollapsed ? "justify-center h-10 w-10" : "px-3 py-2",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    {item.icon && (
                      <item.icon
                        className={cn("h-5 w-5", !isCollapsed && "mr-3")}
                      />
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
    },
    [location.pathname, isCollapsed],
  );

  const getSidebarWidthClasses = useCallback(
    () => cn(isCollapsed ? "w-20" : "w-64"),
    [isCollapsed],
  );

  const getAlignmentClasses = useCallback(
    () => cn(isCollapsed ? "justify-center" : "justify-between"),
    [isCollapsed],
  );

  return (
    <aside
      className={cn(
        "border-r border-border bg-background dark:bg-sidebar hidden lg:flex flex-col h-screen transition-all duration-300 ease-in-out",
        getSidebarWidthClasses(),
      )}
    >
      <div
        className={cn(
          "p-4 border-b border-border flex items-center",
          getAlignmentClasses(),
        )}
      >
        <Link
          to="/"
          className={cn("flex items-center gap-2", getAlignmentClasses())}
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
        {renderNavigationItems(mainNavigation, "")}
      </nav>

      <div
        className={cn(
          "p-4 border-t border-border flex items-center",
          getAlignmentClasses(),
        )}
      >
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
            <span className="text-xs text-muted-foreground">
              john@example.com
            </span>
          </div>
        )}
      </div>
    </aside>
  );
});

export default Sidebar;
