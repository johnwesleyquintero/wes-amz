import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/use-sidebar";

const MainLayout: React.FC = () => {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div
        className={cn(
          "flex flex-col flex-1 overflow-hidden",
        )}
      >
        <TopBar />
        <main
          className={cn(
            "flex-1 overflow-y-auto p-6 transition-all duration-300 ease-in-out",
            isCollapsed ? "ml-20" : "ml-64",
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
