import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import Tools from "./pages/Tools";

const AmazonSellerTools = lazy(() => import("./pages/AmazonSellerTools"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Index />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/search-analytics" element={<Index />} />
          <Route path="/campaign-manager" element={<Index />} />
          <Route path="/products" element={<Index />} />
          <Route path="/sheets-integration" element={<Index />} />
          <Route path="/team" element={<Index />} />
          <Route path="/settings" element={<Index />} />
          <Route
            path="/amazon-seller-tools"
            element={
              <Suspense fallback={<div>Loading Amazon Seller Tools...</div>}>
                <AmazonSellerTools />
              </Suspense>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
