import React, { createContext, useState, ReactNode } from "react";

interface SidebarContextType {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export const SidebarContext = createContext<SidebarContextType | undefined>(
  undefined,
); // Export SidebarContext

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};
// Removed useSidebar hook as it's moved to src/hooks/use-sidebar.tsx
