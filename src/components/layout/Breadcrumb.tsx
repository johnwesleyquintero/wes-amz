import React from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Breadcrumb as BreadcrumbContainer,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { mainNavigation, secondaryNavigation } from "@/lib/navigation";

interface NavigationItem {
  name: string;
  href?: string;
  children?: NavigationItem[];
}

const findPathInNavigation = (
  path: string,
  navigation: NavigationItem[],
  currentBreadcrumbs: { name: string; href: string }[] = [],
): { name: string; href: string }[] | null => {
  for (const item of navigation) {
    const newBreadcrumbs = [
      ...currentBreadcrumbs,
      { name: item.name, href: item.href || "#" },
    ];

    if (item.href && path.startsWith(item.href)) {
      // If it's a direct match or a parent of the current path
      if (path === item.href) {
        return newBreadcrumbs;
      }
      // If it's a parent, continue searching in children
      if (item.children) {
        const childPath = findPathInNavigation(
          path,
          item.children,
          newBreadcrumbs,
        );
        if (childPath) {
          return childPath;
        }
      }
    } else if (item.children) {
      const childPath = findPathInNavigation(
        path,
        item.children,
        newBreadcrumbs,
      );
      if (childPath) {
        return childPath;
      }
    }
  }
  return null;
};

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const breadcrumbs: { name: string; href: string }[] = [
    { name: "Home", href: "/" },
  ];

  let currentPath = "";
  for (let i = 0; i < pathnames.length; i++) {
    const segment = pathnames[i];
    currentPath += `/${segment}`;

    // Try to find the segment name from mainNavigation or secondaryNavigation
    let foundName = segment
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    // Check main navigation
    const mainNavPath = findPathInNavigation(currentPath, mainNavigation);
    if (mainNavPath) {
      foundName = mainNavPath[mainNavPath.length - 1].name;
    } else {
      // Check secondary navigation if main navigation doesn't provide a direct match
      for (const key in secondaryNavigation) {
        if (currentPath.startsWith(key)) {
          const secondaryNavItems =
            secondaryNavigation[key as keyof typeof secondaryNavigation]
              .navigation;
          const secondaryNavPath = findPathInNavigation(
            currentPath,
            secondaryNavItems,
          );
          if (secondaryNavPath) {
            foundName = secondaryNavPath[secondaryNavPath.length - 1].name;
            break;
          }
        }
      }
    }
    breadcrumbs.push({ name: foundName, href: currentPath });
  }

  return (
    <BreadcrumbContainer>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.href}>
            <BreadcrumbItem>
              {index === breadcrumbs.length - 1 ? (
                <span className="text-foreground">{crumb.name}</span>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={crumb.href}>{crumb.name}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </BreadcrumbContainer>
  );
};

export default Breadcrumb;
