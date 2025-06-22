import React, { useState, useCallback, useEffect } from "react";
import CsvUploader from "./CsvUploader";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import { AlertCircle } from "lucide-react";

interface ChartDataPoint {
  name: string;
  [key: string]: number | string;
}

interface CsvRow {
  date: string;
  [keyword: string]: string;
}

const KeywordTrendAnalyzer: React.FC = () => {
  const { toast } = useToast();
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasData, setHasData] = useState<boolean>(false);

  const handleFileUpload = useCallback(
    async (data: CsvRow[]) => {
      setIsLoading(true);
      setError(null);
      try {
        // Validate the data structure
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error("Invalid CSV data: Empty or not an array.");
        }

        // Check if each row has at least a date
        if (!data.every((row) => row.date)) {
          throw new Error("Invalid CSV data: Each row must contain a date.");
        }

        const response = await fetch("/api/amazon/keyword-trends", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Ensure server-side compression (e.g., Gzip) is enabled for responses.
            // Client-side fetch API typically handles Accept-Encoding automatically.
          },
          body: JSON.stringify({ csvData: data }),
          // For very large CSVs, consider implementing pagination for the request payload
          // and corresponding backend changes to process data in chunks.
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const trendData: ChartDataPoint[] = await response.json();
        setChartData(trendData);
        setHasData(true);
        toast({
          title: "Success",
          description: "Keyword trend data processed successfully.",
          variant: "default",
        });
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to process CSV data.";
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        console.error("Failed to process CSV data:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [toast],
  );

  const handleClearData = useCallback(() => {
    setChartData([]);
    setHasData(false);
    setError(null);
    toast({
      title: "Data Cleared",
      description: "Keyword trend data cleared",
      variant: "default",
    });
  }, [toast]);

  useEffect(() => {
    if (chartData.length > 0) {
      setHasData(true);
    }
  }, [chartData]);

  return (
    <div className="space-y-6">
      <CsvUploader
        onUploadSuccess={handleFileUpload}
        isLoading={isLoading}
        onClear={handleClearData}
        hasData={hasData}
        requiredColumns={["date"]}
        dataType="keyword"
        fileName="sample-keyword-trend.csv"
      />

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-100 p-3 text-red-800 dark:bg-red-900/30 dark:text-red-400">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {isLoading && (
        <div className="space-y-2 py-4 text-center">
          <Progress value={45} className="h-2" />
          <p className="text-sm text-muted-foreground">
            Analyzing keyword trends...
          </p>
        </div>
      )}

      {chartData.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {Object.keys(chartData[0])
                  .filter((key) => key !== "name")
                  .map((key) => (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={`#${Math.floor(Math.random() * 16777215).toString(
                        16,
                      )}`}
                    />
                  ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KeywordTrendAnalyzer;
