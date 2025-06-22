import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SecondarySidebarProps {
  title: string;
  navigation: NavigationItem[];
}

interface NavigationItem {
  name: string;
  href: string;
  icon?: LucideIcon;
}

const SecondarySidebar: React.FC<SecondarySidebarProps> = ({
  title,
  navigation,
}) => {
  const location = useLocation();

  return (
    <aside className="w-64 border-r border-border bg-background dark:bg-sidebar flex flex-col h-screen">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "flex items-center rounded-md px-3 py-2 transition-colors duration-200",
              location.pathname.startsWith(item.href)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            {item.icon && <item.icon className="h-5 w-5 mr-3" />}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default SecondarySidebar;