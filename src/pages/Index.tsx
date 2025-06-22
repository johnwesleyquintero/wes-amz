import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import StatCard from "@/components/dashboard/StatCard";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import TopSearchTerms from "@/components/dashboard/TopSearchTerms";
import CampaignStatus from "@/components/dashboard/CampaignStatus";
import { DollarSign, ShoppingBag, Users, BarChart3 } from "lucide-react";

// Sample data for the demo
const performanceData = [
  { name: "Jan 1", impressions: 4000, revenue: 2400 },
  { name: "Jan 2", impressions: 3000, revenue: 1398 },
  { name: "Jan 3", impressions: 2000, revenue: 9800 },
  { name: "Jan 4", impressions: 2780, revenue: 3908 },
  { name: "Jan 5", impressions: 1890, revenue: 4800 },
  { name: "Jan 6", impressions: 2390, revenue: 3800 },
  { name: "Jan 7", impressions: 3490, revenue: 4300 },
];

const searchTerms = [
  {
    term: "wireless earbuds",
    clicks: 2456,
    impressions: 34567,
    ctr: 7.1,
    rank: 2.3,
  },
  {
    term: "bluetooth speaker",
    clicks: 1932,
    impressions: 28456,
    ctr: 6.8,
    rank: 3.1,
  },
  {
    term: "phone charger",
    clicks: 1854,
    impressions: 25678,
    ctr: 7.2,
    rank: 2.7,
  },
  { term: "hdmi cable", clicks: 1542, impressions: 21456, ctr: 7.2, rank: 1.9 },
  {
    term: "laptop stand",
    clicks: 1298,
    impressions: 19876,
    ctr: 6.5,
    rank: 3.4,
  },
];

// Fixed campaign data with properly typed status values
const campaigns = [
  {
    id: "1",
    name: "Holiday Special",
    status: "active" as const,
    budget: 5000,
    spent: 3200,
  },
  {
    id: "2",
    name: "New Product Launch",
    status: "warning" as const,
    budget: 10000,
    spent: 9800,
  },
  {
    id: "3",
    name: "Clearance Sale",
    status: "paused" as const,
    budget: 3000,
    spent: 1500,
  },
];

const Index = () => {
  return (
    <MainLayout>
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Welcome to My Amazon Analytics</h1>
          <p className="text-muted-foreground">
            View your analytics dashboard and insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Total Sales"
            value="$34,568"
            change={12.5}
            icon={<DollarSign className="h-5 w-5 text-shakespeare" />}
          />
          <StatCard
            title="Products"
            value="243"
            change={3.2}
            icon={<ShoppingBag className="h-5 w-5 text-shakespeare" />}
          />
          <StatCard
            title="Conversion Rate"
            value="3.2%"
            change={-0.8}
            icon={<BarChart3 className="h-5 w-5 text-shakespeare" />}
          />
          <StatCard
            title="Active Campaigns"
            value="12"
            change={5}
            icon={<Users className="h-5 w-5 text-shakespeare" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <PerformanceChart data={performanceData} />
          </div>
          <div>
            <CampaignStatus campaigns={campaigns} />
          </div>
        </div>

        <div className="mb-6">
          <TopSearchTerms terms={searchTerms} />
        </div>

        <div className="bg-gradient-to-r from-burnt-sienna to-shakespeare p-6 rounded-lg text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">
                Connect to Google Sheets
              </h2>
              <p className="mb-4 md:mb-0">
                Sync your Amazon data with Google Sheets for advanced analysis
              </p>
            </div>
            <button className="bg-white text-burnt-sienna font-medium px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors">
              Connect Now
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
