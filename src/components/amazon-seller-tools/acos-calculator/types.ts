import { CampaignData } from "@/lib/acos-utils";

/**
 * Interface for manual campaign input.
 */
export interface ManualCampaignInput {
  campaign: string;
  adSpend: string;
  sales: string;
}

/**
 * Type alias for campaign data, re-exporting from acos-utils for consistency.
 */
export type AcosCampaignData = CampaignData;
