import {
  MIN_CLICKS_FOR_ANALYSIS,
  MAX_ACOS_THRESHOLD,
  MIN_CTR_THRESHOLD,
  MIN_CONVERSION_RATE_THRESHOLD,
} from "@/lib/constants";
import type { CampaignData, CsvCampaignRow } from "@/types/ppc-audit-types";

/**
 * Analyzes a single campaign's performance data to identify issues and recommendations.
 */
export const analyzeCampaignData = (campaign: CsvCampaignRow): CampaignData => {
  const { spend, sales, impressions, clicks, type } = campaign;

  const acos = sales > 0 ? (spend / sales) * 100 : 0;
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
  const conversionRate = clicks > 0 ? (sales / clicks) * 100 : 0;

  const issues: string[] = [];
  const recommendations: string[] = [];

  if (clicks < MIN_CLICKS_FOR_ANALYSIS) {
    issues.push("Low Click Volume");
    recommendations.push(
      "Increase bids or budget to improve visibility and gather more data.",
    );
  } else {
    if (acos > MAX_ACOS_THRESHOLD) {
      issues.push("High ACoS");
      recommendations.push(
        "Review and reduce bids on keywords/targets with high ACoS. Consider adding negative keywords.",
      );
    }
    if (ctr < MIN_CTR_THRESHOLD) {
      issues.push("Low CTR");
      recommendations.push(
        "Test new ad copy, primary images, or video creative to improve click-through rate.",
      );
    }
    if (conversionRate < MIN_CONVERSION_RATE_THRESHOLD) {
      issues.push("Low Conversion Rate");
      recommendations.push(
        "Optimize product detail page (images, bullets, A+). Ensure targeting is highly relevant.",
      );
    }
  }

  if (type.toLowerCase() === "auto" && acos > 0 && acos < 25) {
    recommendations.push(
      "Good ACoS on Auto campaign: Harvest high-performing search terms into new manual campaigns for better control.",
    );
  }

  return {
    ...campaign,
    acos,
    ctr,
    conversionRate,
    issues,
    recommendations,
  };
};
