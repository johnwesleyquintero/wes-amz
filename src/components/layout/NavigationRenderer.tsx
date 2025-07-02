import React, { useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  NavigationItem,
  NavigationCategory,
  MainNavigationItem,
} from "@/lib/navigation";

interface NavigationRendererProps {
  items: (NavigationItem | NavigationCategory | MainNavigationItem)[];
  isCollapsed?: boolean; // Optional for desktop sidebar
  onLinkClick?: () => void; // Callback for mobile sidebar to close
}

const NavigationRenderer: React.FC<NavigationRendererProps> = ({
  items,
  isCollapsed = false,
  onLinkClick,
}) => {
  const location = useLocation();

  const renderItems = useCallback(
    (
      navItems: (NavigationItem | NavigationCategory | MainNavigationItem)[],
      parentPath: string = "",
    ) => {
      return navItems.map((item) => {
        // Determine if the item is a MainNavigationItem or NavigationCategory with children
        const hasChildren =
          "children" in item && item.children && item.children.length > 0;
        const isLink = "href" in item && item.href !== undefined;

        const currentPath = isLink
          ? item.href
          : `${parentPath}/${item.name.toLowerCase().replace(/\s/g, "-")}`;
        const isActive =
          isLink && location.pathname.startsWith(item.href || "");

        if (hasChildren) {
          const defaultOpen = item.children.some(
            (child) =>
              "href" in child && location.pathname.startsWith(child.href || ""),
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
                  {renderItems(item.children, currentPath)}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        } else if (isLink) {
          const linkContent = (
            <Link
              to={item.href || "#"}
              className={cn(
                "flex items-center rounded-md transition-colors duration-200",
                isCollapsed ? "justify-center h-10 w-10" : "px-3 py-2",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
              onClick={onLinkClick}
            >
              {item.icon && (
                <item.icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
              )}
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );

          return isCollapsed ? (
            <TooltipProvider key={item.name}>
              <Tooltip>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right">{item.name}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <React.Fragment key={item.name}>{linkContent}</React.Fragment>
          );
        }
        return null; // Should not happen if types are correctly handled
      });
    },
    [location.pathname, isCollapsed, onLinkClick],
  );

  return <>{renderItems(items)}</>;
};

export default NavigationRenderer;
