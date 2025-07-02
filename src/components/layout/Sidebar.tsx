import React, { useCallback } from "react";
import { Link } from "react-router-dom";
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

import { useSidebar } from "@/context/sidebar-context";
import NavigationRenderer from "./NavigationRenderer";

const Sidebar: React.FC = React.memo(() => {
  Sidebar.displayName = "Sidebar";
  const { isCollapsed, toggleSidebar } = useSidebar();

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
        <NavigationRenderer items={mainNavigation} isCollapsed={isCollapsed} />
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
