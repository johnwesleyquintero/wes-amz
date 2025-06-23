"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip as RechartsTooltip,
} from "recharts";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Info, FileText } from "lucide-react";
import { useIsMobile } from "../../hooks/use-mobile";
import { ChartDataPoint } from "@/lib/amazon-types";
import { Progress } from "../ui/progress";
import {
  // CsvRow,
  parseAndValidateCsv,
  ProcessedRow,
} from "@/lib/csv-utils";

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

type MetricType =
  | "price"
  | "reviews"
  | "rating"
  | "sales_velocity"
  | "inventory_levels"
  | "conversion_rate"
  | "click_through_rate";

const getChartColor = (metric: MetricType): string => {
  switch (metric) {
    case "price":
      return "#8884d8";
    case "reviews":
      return "#82ca9d";
    case "rating":
      return "#ffc658";
    case "sales_velocity":
      return "#a4de6c";
    case "inventory_levels":
      return "#d0ed57";
    case "conversion_rate":
      return "#cc79cd";
    case "click_through_rate":
      return "#7ac5d8";
    default:
      return "hsl(var(--foreground))";
  }
};

export default function CompetitorAnalyzer() {
  const { toast } = useToast();
  const [asin, setAsin] = useState("");
  const [metrics, setMetrics] = useState<MetricType[]>([
    "price",
    "reviews",
    "rating",
  ]);
  const [chartData, setChartData] = useState<ChartDataPoint[] | null>(null);
  const [sellerData, setSellerData] = useState<ProcessedRow | null>(null);
  const [competitorData, setCompetitorData] = useState<ProcessedRow[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<MetricType[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (chartData) {
      setSelectedMetrics(metrics);
    }
  }, [chartData, metrics]);

  const handleFileUpload = useCallback(
    async (
      event: React.ChangeEvent<HTMLInputElement>,
      setData: React.Dispatch<
        React.SetStateAction<ProcessedRow | ProcessedRow[] | null>
      >,
      type: "seller" | "competitor",
    ) => {
      const file = event.target.files?.[0];
      if (!file) {
        toast({
          title: "Error",
          description: "No file selected",
          variant: "destructive",
        });
        return;
      }

      if (!file.name.endsWith(".csv")) {
        toast({
          title: "Error",
          description: "Only CSV files are supported",
          variant: "destructive",
        });
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "Error",
          description: `File size exceeds the maximum limit of ${
            MAX_FILE_SIZE / (1024 * 1024)
          }MB`,
          variant: "destructive",
        });
        return;
      }

      if (file.size === 0) {
        toast({
          title: "Error",
          description: "The file is empty",
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);
      try {
        // parseAndValidateCsv already returns ProcessedRow[] and handles validation
        const { data, error } = await parseAndValidateCsv(file);

        if (error) {
          throw new Error(error);
        }

        // Data is already processed by parseAndValidateCsv
        if (type === "seller") {
          // Assuming seller data CSV contains only one row for the seller.
          setData(data.length > 0 ? data[0] : null);
        } else {
          setData(data);
        }
        toast({
          title: "Success",
          description: `${type} data (${file.name}) processed successfully`,
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: `Failed to process ${type} CSV (${file.name}): ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast],
  );

  const analyzeCompetitor = async () => {
    if (!sellerData && !competitorData && !asin) {
      toast({
        title: "Error",
        description: "Please upload data files or enter an ASIN",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // Data is already processed by handleFileUpload, no need to re-process here.
      // If no API call needed (using uploaded CSV data)
      if (sellerData && competitorData) {
        const formattedData = competitorData.map((row: ProcessedRow) => {
          const competitor = row.asin ?? row.niche ?? "N/A";
          const dataPoint: ChartDataPoint = {
            name: competitor,
          };

          metrics.forEach((metric) => {
            const value = row[metric as keyof ProcessedRow];
            if (value !== undefined) {
              dataPoint[metric] = value;
            }
          });

          return dataPoint;
        });

        if (formattedData.length > 0) {
          setChartData(formattedData);
          setIsAnalyzing(false);
          return;
        }
      }

      // Fallback to API call if no valid CSV data
      const response = await fetch("/api/amazon/competitor-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Ensure server-side compression (e.g., Gzip) is enabled for responses.
          // Client-side fetch API typically handles Accept-Encoding automatically.
        },
        body: JSON.stringify({
          asin,
          metrics,
          sellerData: sellerData,
          competitorData: competitorData,
          // For very large datasets, consider implementing pagination for the request payload
          // and corresponding backend changes to process data in chunks.
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch competitor data");
      }

      const data = (await response.json()) as {
        competitors: string[];
        metrics: Record<MetricType, number[]>;
      };

      // Ensure data has the expected structure
      if (!data || !data.competitors || !data.metrics) {
        throw new Error("Invalid response format from server");
      }

      const formattedData = data.competitors.map((competitor, index) => {
        const dataPoint: ChartDataPoint = {
          name: competitor,
        };

        // Safely map each metric
        metrics.forEach((metric) => {
          const metricData = data.metrics[metric];
          if (Array.isArray(metricData) && metricData[index] !== undefined) {
            dataPoint[metric] = Number(metricData[index]) || 0;
          } else {
            dataPoint[metric] = 0; // Default value if data is missing
          }
        });

        return dataPoint;
      });

      // Ensure we have data to render
      if (formattedData.length > 0) {
        setChartData(formattedData);
      } else {
        throw new Error("No data available to render");
      }

      setIsAnalyzing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setChartData(null);
      setIsAnalyzing(false);
    }
  };

  const isMobile = useIsMobile();

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>Competitor Analyzer</CardTitle>
        <CardDescription>
          Upload your data or enter an ASIN to analyze competitors.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-4`}
        >
          <div>
            <div className="flex items-center gap-2">
              <Label htmlFor="seller-csv">Seller Data CSV</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Upload a CSV with columns: asin, price, reviews, rating,
                      conversion_rate, click_through_rate, brands, keywords,
                      niche
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="relative">
              <Input
                id="seller-csv"
                type="file"
                accept=".csv"
                onChange={(e) => handleFileUpload(e, setSellerData, "seller")}
                className="cursor-pointer"
                disabled={isLoading}
              />
              <FileText className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Label htmlFor="competitor-csv">Competitor Data CSV</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Upload a CSV with columns: asin, price, reviews, rating,
                      conversion_rate, click_through_rate, brands, keywords,
                      niche
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="relative">
              <Input
                id="competitor-csv"
                type="file"
                accept=".csv"
                onChange={(e) =>
                  handleFileUpload(e, setCompetitorData, "competitor")
                }
                className="cursor-pointer"
                disabled={isLoading}
              />
              <FileText className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="asin">Or Enter Competitor ASIN</Label>
          <Input
            id="asin"
            value={asin}
            onChange={(e) => setAsin(e.target.value)}
            placeholder="Enter competitor ASIN or niche"
          />
        </div>

        <div>
          <Label htmlFor="metrics">Metrics to Compare</Label>
          <div className="flex flex-col gap-2">
            {[
              "price",
              "reviews",
              "rating",
              "sales_velocity",
              "inventory_levels",
              "conversion_rate",
              "click_through_rate",
            ].map((metric) => (
              <div key={metric} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={metric}
                  checked={metrics.includes(metric as MetricType)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setMetrics([...metrics, metric as MetricType]);
                    } else {
                      setMetrics(metrics.filter((m) => m !== metric));
                    }
                  }}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor={metric}>
                  {metric
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={analyzeCompetitor} disabled={isAnalyzing}>
            {isAnalyzing ? (
              <div className="flex items-center gap-2">
                <Progress value={50} className="h-4 w-16" />
                Analyzing...
              </div>
            ) : (
              "Analyze Competitor"
            )}
          </Button>
          <Button
            variant="outline"
            disabled={!chartData}
            onClick={() => {
              // Save analysis results to localStorage
              const timestamp = new Date().toISOString();
              const savedAnalyses = JSON.parse(
                localStorage.getItem("competitorAnalyses") || "[]",
              );
              savedAnalyses.push({
                id: timestamp,
                date: new Date().toLocaleString(),
                asin,
                metrics,
                chartData,
              });
              localStorage.setItem(
                "competitorAnalyses",
                JSON.stringify(savedAnalyses),
              );
              toast({
                title: "Success",
                description: "Analysis saved for future reference",
                variant: "default",
              });
            }}
          >
            Save Analysis
          </Button>
        </div>

        {chartData ? (
          <div className="mt-4 h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={isMobile ? 45 : 0}
                  textAnchor={isMobile ? "start" : "middle"}
                  tick={{ fontSize: isMobile ? 10 : 14 }}
                />
                <YAxis />
                <RechartsTooltip />
                <Legend wrapperStyle={{ paddingTop: 20 }} />
                {selectedMetrics.map((metric) => (
                  <Line
                    key={metric}
                    type="monotone"
                    dataKey={metric}
                    stroke={getChartColor(metric)}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
