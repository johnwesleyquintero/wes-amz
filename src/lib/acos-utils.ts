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

  // Calculate fundamental metrics: ACoS (Advertising Cost of Sales) and ROAS (Return on Ad Spend)
  const metrics: Omit<CampaignData, "campaign" | "adSpend" | "sales"> = {
    acos: (adSpend / sales) * 100, // ACoS = (Ad Spend / Sales) * 100
    roas: sales / adSpend, // ROAS = Sales / Ad Spend
  };

  // Calculate Click-Through Rate (CTR) if impressions and clicks data are available.
  // Includes an optional adjustment based on industry average CTR for more nuanced performance evaluation.
  if (impressions && clicks) {
    const rawCTR = (clicks / impressions) * 100;
    metrics.ctr = rawCTR;

    if (trendData?.industryAverageCTR) {
      // Adjust CTR score: A higher ratio to industry average means better performance,
      // which is weighted to influence the final CTR metric.
      const ctrPerformanceRatio = rawCTR / trendData.industryAverageCTR;
      metrics.ctr = rawCTR * (0.7 + ctrPerformanceRatio * 0.3); // Weighted adjustment
    }
  }

  // Calculate Conversion Rate and Cost Per Click (CPC) if clicks data is available.
  // Conversion rate also includes an optional adjustment based on industry average.
  if (clicks) {
    const rawConversionRate = (sales / clicks) * 100;
    metrics.conversionRate = rawConversionRate;

    if (trendData?.industryAverageConversion) {
      // Adjust conversion score: Similar to CTR, a better ratio to industry average
      // positively influences the conversion rate metric.
      const conversionPerformanceRatio =
        rawConversionRate / trendData.industryAverageConversion;
      metrics.conversionRate =
        rawConversionRate * (0.7 + conversionPerformanceRatio * 0.3); // Weighted adjustment
    }

    metrics.cpc = adSpend / clicks; // CPC = Ad Spend / Clicks
  }

  // Incorporate trend-based analysis to provide a more dynamic ACoS metric.
  // This section considers historical performance, seasonality, market trends, and competition.
  if (trendData) {
    const salesGrowth =
      ((sales - trendData.previousPeriodSales) /
        trendData.previousPeriodSales) *
      100;
    const adSpendGrowth =
      ((adSpend - trendData.previousPeriodAdSpend) /
        trendData.previousPeriodAdSpend) *
      100;

    // Define weights for different factors influencing the overall performance score.
    const performanceWeight = 0.6; // Primary weight for current performance
    const seasonalityWeight = 0.2; // Weight for seasonal impact
    const marketTrendWeight = 0.2; // Weight for general market direction

    // Calculate a base trend factor based on sales and ad spend growth.
    let trendFactor = 1 + (salesGrowth - adSpendGrowth) / 100;

    // Adjust trend factor based on seasonality.
    if (trendData.seasonalityFactor) {
      trendFactor *= 1 + (trendData.seasonalityFactor - 1) * seasonalityWeight;
    }

    // Adjust trend factor based on overall market trend.
    if (trendData.marketTrend) {
      const marketTrendImpact = {
        rising: 1.1, // Positive impact for rising markets
        stable: 1.0, // Neutral impact for stable markets
        declining: 0.9, // Negative impact for declining markets
      }[trendData.marketTrend];
      trendFactor *= 1 + (marketTrendImpact - 1) * marketTrendWeight;
    }

    // Adjust trend factor based on competition level.
    if (trendData.competitionLevel) {
      const competitionImpact = {
        low: 0.95, // Slightly positive for low competition
        medium: 1.0, // Neutral for medium competition
        high: 1.05, // Slightly negative for high competition
      }[trendData.competitionLevel];
      trendFactor *= competitionImpact;
    }

    // Calculate the final ACoS by blending the base ACoS with an adjusted ACoS
    // that incorporates the calculated trend factor. The Math.max/min ensures
    // the trend factor remains within a reasonable range to prevent extreme values.
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

export const getAcosColor = (
  acos: number,
): "green" | "emerald" | "yellow" | "orange" | "red" => {
  if (acos < 15) return "green";
  if (acos < 25) return "emerald";
  if (acos < 35) return "yellow";
  if (acos < 45) return "orange";
  return "red";
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
    color: "green",
  },
  {
    label: "Good",
    range: "15-25%",
    color: "emerald",
  },
  {
    label: "Average",
    range: "25-35%",
    color: "yellow",
  },
  {
    label: "Poor",
    range: "35-45%",
    color: "orange",
  },
  { label: "Critical", range: ">45%", color: "red" },
] as const;
