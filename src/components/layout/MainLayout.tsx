import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/context/sidebar-context";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileSidebar from "./MobileSidebar";

const MainLayout: React.FC = () => {
  const { isCollapsed } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {!isMobile && <Sidebar />}
      <div className={cn("flex flex-col flex-1 overflow-hidden")}>
        <TopBar />
        {isMobile && <MobileSidebar />}
        <main
          className={cn(
            "flex-1 overflow-y-auto p-6 transition-all duration-300 ease-in-out",
            !isMobile && (isCollapsed ? "ml-20" : "ml-64"),
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
