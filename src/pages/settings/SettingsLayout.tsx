import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const settingsNavigation = [
  { name: "Profile", href: "/app/settings/profile" },
  { name: "Organization", href: "/app/settings/organization" },
  { name: "Team", href: "/app/settings/team" },
];

const SettingsLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gray-100 p-4 dark:bg-gray-900 lg:p-8">
      <Card className="w-full max-w-4xl">
        <div className="flex flex-col md:flex-row">
          <div className="w-full border-b p-4 md:w-1/4 md:border-b-0 md:border-r">
            <nav className="flex flex-col space-y-1">
              {settingsNavigation.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  className={cn(
                    "justify-start",
                    location.pathname === item.href &&
                      "bg-muted hover:bg-muted",
                  )}
                  asChild
                >
                  <Link to={item.href}>{item.name}</Link>
                </Button>
              ))}
            </nav>
          </div>
          <CardContent className="flex-1 p-6 md:p-8">
            <Outlet />
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default SettingsLayout;
