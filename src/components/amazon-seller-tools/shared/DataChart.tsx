"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type ChartType = "bar" | "line";

interface DataPoint {
  [key: string]: string | number;
}

interface DataChartProps {
  data: DataPoint[];
  type?: ChartType;
  xAxisKey: string;
  yAxisKeys: string[];
  height?: number;
  colors?: string[];
  title?: string;
}

export function DataChart({
  data,
  type = "bar",
  xAxisKey,
  yAxisKeys,
  height = 300,
  colors = ["#2563eb", "#16a34a", "#dc2626", "#9333ea"],
  title,
}: DataChartProps) {
  const Chart = type === "bar" ? BarChart : LineChart;
  const DataComponent = type === "bar" ? Bar : Line;

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <Chart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {yAxisKeys.map((key, index) => (
            <DataComponent
              key={key}
              type="monotone"
              dataKey={key}
              fill={colors[index % colors.length]}
              stroke={colors[index % colors.length]}
            />
          ))}
        </Chart>
      </ResponsiveContainer>
    </div>
  );
}
