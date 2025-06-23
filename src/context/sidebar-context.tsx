import React, { useState, useMemo, useCallback, ReactNode } from "react";
import { SidebarContext } from "./sidebar-context";

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const memoizedValue = useMemo(
    () => ({
      isCollapsed,
      toggleSidebar,
    }),
    [isCollapsed, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={memoizedValue}>
      {children}
    </SidebarContext.Provider>
  );
};
