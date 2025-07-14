import React, { Suspense } from "react";
import { Route } from "react-router-dom";
import { Pages } from "./app-routes";
import { DEFAULT_SUSPENSE_FALLBACK } from "./routes";

export const publicRoutes = [
  <Route
    key="landing"
    path="/"
    element={
      <Suspense fallback={DEFAULT_SUSPENSE_FALLBACK}>
        <Pages.LandingPage />
      </Suspense>
    }
  />,
  <Route
    key="privacy-policy"
    path="/privacy-policy"
    element={
      <Suspense fallback={DEFAULT_SUSPENSE_FALLBACK}>
        <Pages.PrivacyPolicy />
      </Suspense>
    }
  />,
  <Route
    key="terms-of-service"
    path="/terms-of-service"
    element={
      <Suspense fallback={DEFAULT_SUSPENSE_FALLBACK}>
        <Pages.TermsOfService />
      </Suspense>
    }
  />,
];
