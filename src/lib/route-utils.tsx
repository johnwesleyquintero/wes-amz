import React, { Suspense } from "react";
import { Route } from "react-router-dom";
import { AppRouteConfig, LazyComponent, Pages } from "./app-routes";
import { DEFAULT_SUSPENSE_FALLBACK } from "./constants";

interface RouteDefinition {
  path: string;
  component: LazyComponent;
  props?: Record<string, unknown>;
  index?: boolean;
}

/**
 * Creates a React Router Route component with Suspense fallback.
 * @param {RouteDefinition} definition - The route definition.
 * @returns {JSX.Element} A React Router Route component.
 */
const createRoute = (definition: RouteDefinition): JSX.Element => {
  const { path, component: Component, props, index } = definition;
  return (
    <Route
      key={path}
      path={path}
      index={index}
      element={
        <Suspense fallback={DEFAULT_SUSPENSE_FALLBACK}>
          <Component {...props} />
        </Suspense>
      }
    />
  );
};

/**
 * Generates an array of React Router Route components from an array of AppRouteConfig.
 * @param {AppRouteConfig[]} routesConfig - An array of route configurations.
 * @returns {JSX.Element[]} An array of React Router Route components.
 */
export const generateRoutes = (
  routesConfig: AppRouteConfig[],
): JSX.Element[] => {
  return routesConfig.map((route) => createRoute(route));
};

/**
 * Generates a nested React Router Route component for authenticated application routes.
 * This is useful for routes that share a common layout or protection.
 * @param {AppRouteConfig[]} authenticatedRoutes - An array of authenticated route configurations.
 * @param {LazyComponent} LayoutComponent - The layout component to wrap the routes.
 * @param {LazyComponent} ProtectedComponent - The component to handle route protection.
 * @returns {JSX.Element} A nested React Router Route component.
 */
export const generateAuthenticatedAppRoutes = (
  authenticatedRoutes: AppRouteConfig[],
  LayoutComponent: LazyComponent,
  ProtectedComponent: LazyComponent,
): JSX.Element => {
  return (
    <Route element={<ProtectedComponent />}>
      <Route path="/dashboard" element={<LayoutComponent />}>
        {createRoute({
          path: "",
          component:
            authenticatedRoutes.find((r) => r.path === "dashboard")
              ?.component || Pages.DashboardContent,
          index: true,
        })}
      </Route>
      <Route path="/" element={<LayoutComponent />}>
        {generateRoutes(
          authenticatedRoutes.filter((r) => r.path !== "dashboard"),
        )}
      </Route>
    </Route>
  );
};
