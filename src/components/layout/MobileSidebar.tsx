import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { mainNavigation } from "@/lib/navigation";
import NavigationRenderer from "./NavigationRenderer";

const MobileSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

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
          <NavigationRenderer
            items={mainNavigation}
            onLinkClick={() => setIsOpen(false)}
          />
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
