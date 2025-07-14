import React, { Suspense } from "react";
import { Route } from "react-router-dom";
import { AuthComponents } from "./app-routes";
import { DEFAULT_SUSPENSE_FALLBACK } from "./routes";

export const authRoutes = (
  <Route path="/auth">
    <Route
      key="register"
      path="register"
      element={
        <Suspense fallback={DEFAULT_SUSPENSE_FALLBACK}>
          <AuthComponents.Register />
        </Suspense>
      }
    />
    <Route
      key="login"
      path="login"
      element={
        <Suspense fallback={DEFAULT_SUSPENSE_FALLBACK}>
          <AuthComponents.Login />
        </Suspense>
      }
    />
    <Route
      key="forgot-password"
      path="forgot-password"
      element={
        <Suspense fallback={DEFAULT_SUSPENSE_FALLBACK}>
          <AuthComponents.ForgotPassword />
        </Suspense>
      }
    />
    <Route
      key="update-password"
      path="update-password"
      element={
        <Suspense fallback={DEFAULT_SUSPENSE_FALLBACK}>
          <AuthComponents.UpdatePassword />
        </Suspense>
      }
    />
  </Route>
);
