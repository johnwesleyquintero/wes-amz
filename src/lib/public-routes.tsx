import { Pages, AppRouteConfig } from "./app-routes";

export const publicRoutes: AppRouteConfig[] = [
  {
    path: "/",
    component: Pages.LandingPage,
  },
  {
    path: "/privacy-policy",
    component: Pages.PrivacyPolicy,
  },
  {
    path: "/terms-of-service",
    component: Pages.TermsOfService,
  },
];
