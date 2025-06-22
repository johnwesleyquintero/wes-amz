// src/components/ProfitsDashboard.tsx
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient"; // Adjust path if needed
import { subDays, format } from "date-fns"; // Great library for date manipulation

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
  <div
    style={{
      border: "1px solid #ddd",
      padding: "16px",
      borderRadius: "8px",
      flex: "1",
      minWidth: "200px",
    }}
  >
    <h4 style={{ margin: "0 0 8px 0", color: "#555" }}>{title}</h4>
    <p
      style={{
        margin: 0,
        fontSize: "24px",
        fontWeight: "bold",
        color: isPositive ? "#28a745" : "#dc3545",
      }}
    >
      {value}
    </p>
  </div>
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
    return <div style={{ color: "#ED595B" }}>Error: {error}</div>;
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

  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px" }}>
      <h2 style={{ borderBottom: "2px solid #EDF2F7", paddingBottom: "10px" }}>
        Unified Profits Dashboard
      </h2>
      <p>
        Showing data from {format(dateRange.start, "MMM d, yyyy")} to{" "}
        {format(dateRange.end, "MMM d, yyyy")}
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
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

      <h3 style={{ marginTop: "30px" }}>Cost Breakdown</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
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
