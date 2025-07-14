"use client";

import { useEffect } from "react";
import { useCompetitorAnalyzerLogic } from "./competitor-analyzer/hooks/use-competitor-analyzer-logic";
import { MetricType } from "@/lib/amazon-types";
import { getChartColor } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import {
  ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip as RechartsTooltip,
} from "recharts";
import { ComposedChart, Brush, Area, ReferenceLine } from "recharts";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Info, FileText } from "lucide-react";
import { useIsMobile } from "../../hooks/use-mobile";
import { Progress } from "../ui/progress";
import { ChartDataPoint } from "@/lib/amazon-types";

export default function CompetitorAnalyzer() {
  const {
    asin,
    setAsin,
    metrics,
    setMetrics,
    chartData,
    sellerData,
    setSellerData,
    competitorData,
    setCompetitorData,
    selectedMetrics,
    isLoadingFiles,
    isAnalyzing,
    handleFileUpload,
    handleAnalyze,
    handleSaveAnalysis,
  } = useCompetitorAnalyzerLogic();

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
                disabled={isLoadingFiles}
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
                disabled={isLoadingFiles}
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
          <Button onClick={handleAnalyze} disabled={isAnalyzing}>
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
            onClick={handleSaveAnalysis}
          >
            Save Analysis
          </Button>
        </div>

        {chartData ? (
          <div className="mt-4 h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                width={500}
                height={400}
                data={chartData}
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 20,
                }}
              >
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="name" scale="band" />
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
                <Brush dataKey="name" height={30} stroke="#8884d8" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
