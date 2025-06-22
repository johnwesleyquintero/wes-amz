"use client";

export type CampaignData = {
  campaign: string;
  adSpend: number;
  sales: number;
  acos?: number;
  roas?: number;
  impressions?: number;
  clicks?: number;
  ctr?: number;
  cpc?: number;
  conversionRate?: number;
};

export interface TrendData {
  previousPeriodSales: number;
  previousPeriodAdSpend: number;
  industryAverageCTR?: number;
  industryAverageConversion?: number;
  seasonalityFactor?: number;
  marketTrend?: "rising" | "stable" | "declining";
  competitionLevel?: "low" | "medium" | "high";
}

export const calculateMetrics = (
  data: Pick<CampaignData, "adSpend" | "sales" | "impressions" | "clicks">,
  trendData?: TrendData,
): Omit<CampaignData, "campaign" | "adSpend" | "sales"> => {
  const { adSpend, sales, impressions, clicks } = data;

  // Calculate base metrics
  const metrics: Omit<CampaignData, "campaign" | "adSpend" | "sales"> = {
    acos: (adSpend / sales) * 100,
    roas: sales / adSpend,
  };

  // Enhanced CTR calculation with industry benchmark comparison
  if (impressions && clicks) {
    const rawCTR = (clicks / impressions) * 100;
    metrics.ctr = rawCTR;

    if (trendData?.industryAverageCTR) {
      // Adjust CTR score based on industry performance
      const ctrPerformanceRatio = rawCTR / trendData.industryAverageCTR;
      metrics.ctr = rawCTR * (0.7 + ctrPerformanceRatio * 0.3);
    }
  }

  // Enhanced conversion and cost metrics
  if (clicks) {
    const rawConversionRate = (sales / clicks) * 100;
    metrics.conversionRate = rawConversionRate;

    if (trendData?.industryAverageConversion) {
      // Adjust conversion score based on industry performance
      const conversionPerformanceRatio =
        rawConversionRate / trendData.industryAverageConversion;
      metrics.conversionRate =
        rawConversionRate * (0.7 + conversionPerformanceRatio * 0.3);
    }

    metrics.cpc = adSpend / clicks;
  }

  // Calculate trend-based metrics with advanced analysis
  if (trendData) {
    const salesGrowth =
      ((sales - trendData.previousPeriodSales) /
        trendData.previousPeriodSales) *
      100;
    const adSpendGrowth =
      ((adSpend - trendData.previousPeriodAdSpend) /
        trendData.previousPeriodAdSpend) *
      100;

    // Calculate weighted performance score
    const performanceWeight = 0.6; // Base performance weight
    const seasonalityWeight = 0.2; // Seasonality impact weight
    const marketTrendWeight = 0.2; // Market trend impact weight

    // Calculate base trend factor
    let trendFactor = 1 + (salesGrowth - adSpendGrowth) / 100;

    // Apply seasonality adjustment if available
    if (trendData.seasonalityFactor) {
      trendFactor *= 1 + (trendData.seasonalityFactor - 1) * seasonalityWeight;
    }

    // Apply market trend adjustment
    if (trendData.marketTrend) {
      const marketTrendImpact = {
        rising: 1.1,
        stable: 1.0,
        declining: 0.9,
      }[trendData.marketTrend];
      trendFactor *= 1 + (marketTrendImpact - 1) * marketTrendWeight;
    }

    // Apply competition level adjustment
    if (trendData.competitionLevel) {
      const competitionImpact = {
        low: 0.95,
        medium: 1.0,
        high: 1.05,
      }[trendData.competitionLevel];
      trendFactor *= competitionImpact;
    }

    // Calculate final ACOS with weighted performance score
    const baseAcos = metrics.acos;
    const adjustedAcos =
      baseAcos * (1 / Math.max(0.8, Math.min(1.2, trendFactor)));
    metrics.acos =
      baseAcos * (1 - performanceWeight) + adjustedAcos * performanceWeight;
  }

  return metrics;
};

export const getAcosRating = (acos: number): string => {
  if (acos < 15) return "Excellent";
  if (acos < 25) return "Good";
  if (acos < 35) return "Average";
  if (acos < 45) return "Poor";
  return "Critical";
};

export const getAcosColor = (acos: number): string => {
  if (acos < 15) return "text-green-600 dark:text-green-400";
  if (acos < 25) return "text-emerald-600 dark:text-emerald-400";
  if (acos < 35) return "text-yellow-600 dark:text-yellow-400";
  if (acos < 45) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
};

export const chartConfig = {
  acos: {
    label: "ACoS %",
    theme: { light: "#ef4444", dark: "#f87171" },
  },
  roas: {
    label: "ROAS",
    theme: { light: "#22c55e", dark: "#4ade80" },
  },
  ctr: {
    label: "CTR %",
    theme: { light: "#3b82f6", dark: "#60a5fa" },
  },
  cpc: {
    label: "CPC $",
    theme: { light: "#a855f7", dark: "#c084fc" },
  },
} as const;

export const acosRatingGuide = [
  {
    label: "Excellent",
    range: "<15%",
    color: "text-green-600 dark:text-green-400",
  },
  {
    label: "Good",
    range: "15-25%",
    color: "text-emerald-600 dark:text-emerald-400",
  },
  {
    label: "Average",
    range: "25-35%",
    color: "text-yellow-600 dark:text-yellow-400",
  },
  {
    label: "Poor",
    range: "35-45%",
    color: "text-orange-600 dark:text-orange-400",
  },
  { label: "Critical", range: ">45%", color: "text-red-600 dark:text-red-400" },
] as const;
