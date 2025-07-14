import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ChartDataPoint } from "@/lib/amazon-types";
import { parseAndValidateCsv, ProcessedRow } from "@/lib/csv-utils";
import {
  ApiError,
  ClientError,
  ServerError,
  NetworkError,
} from "@/lib/api-errors";
import { useApiMutation } from "@/hooks/useApiMutation"; // Import useApiMutation

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

export const useCompetitorAnalyzerLogic = () => {
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
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);

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

      setIsLoadingFiles(true);
      try {
        const { data, error } = await parseAndValidateCsv(file);

        if (error) {
          throw new ClientError(`CSV validation failed: ${error}`, 400, error);
        }

        if (type === "seller") {
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
        const apiError =
          error instanceof ApiError
            ? error
            : new ClientError(
                `Failed to process ${type} CSV (${file.name})`,
                400,
                error,
              );
        toast({
          title: `File Upload Error: ${apiError.errorType || "Unknown"}`,
          description: apiError.message,
          variant: "destructive",
        });
      } finally {
        setIsLoadingFiles(false);
      }
    },
    [toast],
  );

  const formatClientDataForChart = useCallback(
    (
      competitorData: ProcessedRow[],
      metrics: MetricType[],
    ): ChartDataPoint[] => {
      return competitorData.map((row: ProcessedRow) => {
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
    },
    [],
  );

  const fetchCompetitorAnalysis = useCallback(async () => {
    if (!asin && (!sellerData || competitorData.length === 0)) {
      throw new ClientError(
        "Please upload data files or enter an ASIN to analyze.",
        400,
      );
    }

    const response = await fetch("/api/amazon/competitor-analysis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        asin,
        metrics,
        sellerData: sellerData,
        competitorData: competitorData,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      const errorMessage =
        errorBody?.message || `Request failed with status ${response.status}`;

      if (response.status >= 400 && response.status < 500) {
        throw new ClientError(errorMessage, response.status, errorBody);
      } else if (response.status >= 500) {
        throw new ServerError(errorMessage, response.status, errorBody);
      } else {
        throw new ApiError(
          errorMessage,
          response.status,
          "UNKNOWN_API_ERROR",
          errorBody,
        );
      }
    }

    const data = (await response.json()) as {
      competitors: string[];
      metrics: Record<MetricType, number[]>;
    };

    if (!data || !data.competitors || !data.metrics) {
      throw new ServerError(
        "Invalid response format from server",
        response.status,
        data,
      );
    }
    return data;
  }, [asin, metrics, sellerData, competitorData]);

  const { execute: analyzeCompetitorApi, loading: isAnalyzing } =
    useApiMutation<
      { competitors: string[]; metrics: Record<MetricType, number[]> },
      ApiError | ClientError | ServerError | NetworkError
    >(
      async () => {
        if (sellerData && competitorData.length > 0) {
          const formattedData = formatClientDataForChart(
            competitorData,
            metrics,
          );
          if (formattedData.length > 0) {
            setChartData(formattedData);
            const dummyMetrics: Record<MetricType, number[]> = {
              price: [],
              reviews: [],
              rating: [],
              sales_velocity: [],
              inventory_levels: [],
              conversion_rate: [],
              click_through_rate: [],
            };
            return { competitors: [], metrics: dummyMetrics };
          }
        }
        return fetchCompetitorAnalysis();
      },
      {
        onSuccess: (data) => {
          if (
            data.competitors.length === 0 &&
            Object.keys(data.metrics).length === 0
          ) {
            return;
          }

          const formattedData = data.competitors.map((competitor, index) => {
            const dataPoint: ChartDataPoint = {
              name: competitor,
            };

            metrics.forEach((metric) => {
              const metricData = data.metrics[metric];
              if (
                Array.isArray(metricData) &&
                metricData[index] !== undefined
              ) {
                dataPoint[metric] = Number(metricData[index]) || 0;
              } else {
                dataPoint[metric] = 0;
              }
            });

            return dataPoint;
          });

          if (formattedData.length > 0) {
            setChartData(formattedData);
          } else {
            toast({
              title: "No Data",
              description:
                "No data available to render based on the provided input.",
              variant: "default",
            });
            setChartData(null);
          }
        },
        onError: (error) => {
          toast({
            title: `Analysis Error: ${error.errorType || "Unknown"}`,
            description: error.message,
            variant: "destructive",
          });
          setChartData(null);
        },
        showErrorToast: false,
        showSuccessToast: false,
      },
    );

  const handleAnalyze = useCallback(() => {
    analyzeCompetitorApi();
  }, [analyzeCompetitorApi]);

  const handleSaveAnalysis = useCallback(() => {
    if (!chartData) {
      toast({
        title: "Save Error",
        description: "No analysis data to save.",
        variant: "destructive",
      });
      return;
    }
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
    localStorage.setItem("competitorAnalyses", JSON.stringify(savedAnalyses));
    toast({
      title: "Success",
      description: "Analysis saved for future reference",
      variant: "default",
    });
  }, [asin, metrics, chartData, toast]);

  return {
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
  };
};
