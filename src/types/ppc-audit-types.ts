export type CampaignData = {
  name: string;
  type: string;
  spend: number;
  sales: number;
  acos: number;
  impressions: number;
  clicks: number;
  ctr: number;
  conversionRate: number;
  issues: string[];
  recommendations: string[];
};

export type CsvCampaignRow = {
  name: string;
  type: string;
  spend: number;
  sales: number;
  impressions: number;
  clicks: number;
};
