import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Suspense, lazy } from "react";

const HolisticProfitsDashboard = lazy(
  () => import("../components/dashboard/holistic-profits-dashboard"),
);

const Index = () => {
  return (
    <MainLayout>
      <Suspense fallback={<div>Loading Dashboard...</div>}>
        <HolisticProfitsDashboard />
      </Suspense>
    </MainLayout>
  );
};

export default Index;
