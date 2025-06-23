import React from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Breadcrumb as BreadcrumbContainer,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { authenticatedAppRoutes } from "@/lib/routes.tsx";

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

    // Find the route configuration for the current path segment
    const routeConfig = authenticatedAppRoutes.find(
      (route) =>
        `/app/${route.path}` === currentPath ||
        `/dashboard/${route.path}` === currentPath,
    );

    // Use the breadcrumbName from the route config if available, otherwise
    // format the segment (e.g., "acos-calculator" becomes "Acos Calculator")
    const breadcrumbName =
      routeConfig?.breadcrumbName ||
      segment
        .replace(/-/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    breadcrumbs.push({ name: breadcrumbName, href: currentPath });
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

export { Breadcrumb };
