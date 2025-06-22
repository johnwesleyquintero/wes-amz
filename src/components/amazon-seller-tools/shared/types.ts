// Common types used across Amazon Seller Tools

export interface BaseToolProps {
  title: string;
  description?: string;
}

export interface AnalysisResult {
  score: number;
  suggestions: string[];
  metrics: Record<string, number>;
}

export interface ProductData {
  product: string;
  asin?: string;
  price?: number;
  cost?: number;
  fees?: number;
  profit?: number;
  margin?: number;
  roi?: number;
}

export interface KeywordData {
  keyword: string;
  searchVolume?: number;
  competition?: string;
  relevance?: number;
  trend?: "up" | "down" | "stable";
  suggestions?: string[];
}

export interface CampaignData {
  campaignId: string;
  name: string;
  budget: number;
  spend: number;
  sales: number;
  acos: number;
  roas: number;
  impressions: number;
  clicks: number;
  conversions: number;
}

export interface CompetitorData {
  name: string;
  asin: string;
  price: number;
  rating: number;
  reviewCount: number;
  bsr?: number;
  categories?: string[];
}

export interface ExportOptions {
  format: "csv" | "json" | "txt";
  fileName?: string;
  fields?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface ChartData {
  label: string;
  value: number;
  category?: string;
  date?: string;
}

export interface ToolMetrics {
  totalProducts?: number;
  totalKeywords?: number;
  totalCampaigns?: number;
  averageScore?: number;
  lastUpdated?: Date;
}
