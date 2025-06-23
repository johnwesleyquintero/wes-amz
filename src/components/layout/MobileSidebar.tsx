import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  mainNavigation,
  NavigationItem,
  NavigationCategory,
  MainNavigationItem,
} from "@/lib/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const MobileSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const renderNavigationItems = (
    items: (NavigationItem | NavigationCategory | MainNavigationItem)[],
  ) => {
    return items.map((item) => {
      if ("children" in item && item.children) {
        return (
          <Accordion type="single" collapsible key={item.name}>
            <AccordionItem value={item.name}>
              <AccordionTrigger className="py-2">
                {item.icon && <item.icon className="h-5 w-5 mr-3" />}
                <span>{item.name}</span>
              </AccordionTrigger>
              <AccordionContent className="pl-4 space-y-1">
                {/* Recursively render children, ensuring correct type assertion */}
                {renderNavigationItems(
                  item.children as (
                    | NavigationItem
                    | NavigationCategory
                    | MainNavigationItem
                  )[],
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      } else if ("href" in item && item.href) {
        return (
          <Link
            key={item.name}
            to={item.href || "#"}
            className={cn(
              "flex items-center px-3 py-2 rounded-md transition-colors duration-200",
              location.pathname.startsWith(item.href || "no-match")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
            onClick={() => setIsOpen(false)} // Close sidebar on navigation
          >
            {item.icon && <item.icon className="h-5 w-5 mr-3" />}
            <span>{item.name}</span>
          </Link>
        );
      }
      return null; // Handle cases where item is neither a category nor a link
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open mobile menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="p-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2">
            <img src="/logo.svg" className="h-8 w-8" alt="Alerion Logo" />
            <span className="text-xl font-bold">Alerion</span>
          </SheetTitle>
        </SheetHeader>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {renderNavigationItems(mainNavigation)}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
