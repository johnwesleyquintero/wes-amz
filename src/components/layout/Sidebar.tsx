import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  FileSpreadsheet,
  Settings,
  Users,
  LayoutDashboard,
  Search,
  ShoppingBag,
  Wrench,
  Menu,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const Sidebar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Search Analytics", href: "/search-analytics", icon: Search },
    { name: "Campaign Manager", href: "/campaign-manager", icon: BarChart3 },
    { name: "Products", href: "/products", icon: ShoppingBag },
    { name: "Tools", href: "/tools", icon: Wrench },
    {
      name: "Google Sheets",
      href: "/sheets-integration",
      icon: FileSpreadsheet,
    },
    { name: "Team", href: "/team", icon: Users },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" className="h-8 w-8" alt="Alerion Logo" />
          <h1 className="text-xl font-bold">Alerion</h1>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "nav-link",
              location.pathname === item.href && "active",
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <span className="font-medium text-sm">JD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">John Doe</p>
            <p className="text-xs text-muted-foreground truncate">
              john@example.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return isMobile ? (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64">
        {sidebarContent}
      </SheetContent>
    </Sheet>
  ) : (
    <aside className="w-64 border-r border-border bg-background dark:bg-sidebar hidden lg:block">
      {sidebarContent}
    </aside>
  );
};

export default Sidebar;
