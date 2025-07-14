import { AuthComponents, AppRouteConfig } from "./app-routes";

export const authRoutes: AppRouteConfig[] = [
  {
    path: "register",
    component: AuthComponents.Register,
  },
  {
    path: "login",
    component: AuthComponents.Login,
  },
  {
    path: "forgot-password",
    component: AuthComponents.ForgotPassword,
  },
  {
    path: "update-password",
    component: AuthComponents.UpdatePassword,
  },
];
