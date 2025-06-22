// src/components/ProfitsDashboard.tsx
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient"; // Adjust path if needed
import { subDays, format } from "date-fns"; // Great library for date manipulation
import { DataChart } from "./amazon-seller-tools/shared/DataChart"; // Import DataChart
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"; // Import Card components

// Define a TypeScript type for the data returned by our RPC function.
// This gives us type safety and autocompletion.
type ProfitSummary = {
  total_revenue: number;
  total_cogs: number;
  total_order_fees: number;
  total_ppc_spend: number;
  total_other_expenses: number;
  total_periodic_fees: number;
  net_profit: number;
  profit_margin: number;
};

// A simple helper component for displaying each metric
const MetricCard = ({
  title,
  value,
  isPositive = true,
}: {
  title: string;
  value: string;
  isPositive?: boolean;
}) => (
  <Card className="flex-1 min-w-[200px]">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p
        className={`text-2xl font-bold ${
          isPositive ? "text-green-600" : "text-red-600"
        }`}
      >
        {value}
      </p>
    </CardContent>
  </Card>
);

const ProfitsDashboard = () => {
  const [summary, setSummary] = useState<ProfitSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default to the last 30 days. This could be controlled by a date picker.
  const [dateRange] = useState({
    start: subDays(new Date(), 30),
    end: new Date(),
  });

  useEffect(() => {
    const fetchProfitSummary = async () => {
      setLoading(true);
      setError(null);

      // Call the database function using the Supabase client's rpc() method
      const { data, error } = await supabase.rpc("calculate_profit_summary", {
        p_start_date: format(dateRange.start, "yyyy-MM-dd"),
        p_end_date: format(dateRange.end, "yyyy-MM-dd"),
      });

      if (error) {
        console.error("Error fetching profit summary:", error);
        setError("Failed to fetch profit summary. Please try again later.");
      } else if (data && data.length > 0) {
        // The RPC returns an array, so we take the first (and only) element.
        setSummary(data[0]);
      } else {
        // Handle cases where no data is returned but no error occurred
        setSummary(null);
      }

      setLoading(false);
    };

    fetchProfitSummary();
  }, [dateRange]); // Re-fetch whenever the dateRange state changes

  // Helper to format numbers as currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (loading) {
    return <div>Loading Dashboard...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!summary) {
    return (
      <div>
        No profit data available for the selected period. You may need to add
        some data first.
      </div>
    );
  }

  // Calculate total costs for display
  const totalCosts =
    summary.total_cogs +
    summary.total_order_fees +
    summary.total_ppc_spend +
    summary.total_other_expenses +
    summary.total_periodic_fees;

  // Dummy data for chart visualization (replace with actual time-series data from backend)
  const chartData = [
    { name: "Day 1", revenue: 4000, profit: 2400, cogs: 1000, ppc: 600 },
    { name: "Day 2", revenue: 3000, profit: 1398, cogs: 800, ppc: 800 },
    { name: "Day 3", revenue: 2000, profit: 980, cogs: 500, ppc: 520 },
    { name: "Day 4", revenue: 2780, profit: 3908, cogs: 700, ppc: 600 },
    { name: "Day 5", revenue: 1890, profit: 4800, cogs: 400, ppc: 300 },
    { name: "Day 6", revenue: 2390, profit: 3800, cogs: 600, ppc: 400 },
    { name: "Day 7", revenue: 3490, profit: 4300, cogs: 900, ppc: 700 },
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">
        Unified Profits Dashboard
      </h2>
      <p className="text-muted-foreground">
        Showing data from {format(dateRange.start, "MMM d, yyyy")} to{" "}
        {format(dateRange.end, "MMM d, yyyy")}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(summary.total_revenue)}
        />
        <MetricCard
          title="Total Costs"
          value={formatCurrency(totalCosts)}
          isPositive={false}
        />
        <MetricCard
          title="Net Profit"
          value={formatCurrency(summary.net_profit)}
          isPositive={summary.net_profit >= 0}
        />
        <MetricCard
          title="Profit Margin"
          value={`${summary.profit_margin.toFixed(2)}%`}
          isPositive={summary.profit_margin >= 0}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profit Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <DataChart
            data={chartData}
            xAxisKey="name"
            yAxisKeys={["revenue", "profit"]}
            type="line"
            title="Revenue and Profit Over Time"
          />
        </CardContent>
      </Card>

      <h3 className="text-2xl font-semibold tracking-tight mt-6">
        Cost Breakdown
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          title="Cost of Goods (COGS)"
          value={formatCurrency(summary.total_cogs)}
          isPositive={false}
        />
        <MetricCard
          title="Amazon Fees"
          value={formatCurrency(summary.total_order_fees)}
          isPositive={false}
        />
        <MetricCard
          title="PPC Spend"
          value={formatCurrency(summary.total_ppc_spend)}
          isPositive={false}
        />
        <MetricCard
          title="Periodic Fees"
          value={formatCurrency(summary.total_periodic_fees)}
          isPositive={false}
        />
        <MetricCard
          title="Other Expenses"
          value={formatCurrency(summary.total_other_expenses)}
          isPositive={false}
        />
      </div>
    </div>
  );
};

export default ProfitsDashboard;
