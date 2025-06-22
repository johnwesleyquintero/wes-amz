export interface Identifier {
  asin: string;
  sku: string;
  upc: string;
  keyword: string;
  niche: string;
  brand: string;
  category: string;
}

export interface ProcessedRow {
  asin: string;
  price: number;
  reviews: number;
  rating: number;
  conversion_rate: number;
  click_through_rate: number;
}

export interface Product {
  conversionRate: number;
  sessions: number;
  reviewRating: number;
  reviewCount: number;
  priceCompetitiveness: number;
  inventoryHealth: number;
  weight: number;
  volume: number;
  category: ProductCategory;
  lastUpdated: Date;
}

export interface FeeStructure {
  baseFee: number;
  perKgFee: number;
  weightThreshold: number;
  monthlyStorageFee: number;
  referralPercentage: number;
  categoryFees: Record<ProductCategory, number>;
}

export interface InventoryData {
  salesLast30Days: number;
  leadTime: number;
  currentInventory: number;
  averageDailySales: number;
  safetyStock: number;
  status: InventoryHealthStatus;
}

export enum ProductCategory {
  STANDARD = "standard",
  OVERSIZE = "oversize",
  HAZMAT = "hazmat",
  APPAREL = "apparel",
}

export enum InventoryHealthStatus {
  HEALTHY = "healthy",
  LOW = "low",
  EXCESS = "excess",
  CRITICAL = "critical",
}

export type MetricType =
  | "price"
  | "reviews"
  | "rating"
  | "conversion_rate"
  | "click_through_rate";

export interface ChartDataPoint {
  name: string;
  [key: string]: string | number;
}

export interface CompetitorDataRow extends ProcessedRow {
  name?: string;
}

export interface AmazonProduct {
  asin: string;
  title: string;
  price: number;
  cost: number;
  fbaFees: number;
  referralFee: number;
  category: string;
  dimensions?: ProductDimensions;
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  weight: number;
  unit: "in" | "cm";
  weightUnit: "lb" | "kg";
}

export interface SalesData {
  asin: string;
  date: string;
  units: number;
  revenue: number;
  ppcSpend?: number;
  organicSales?: number;
}

export interface KeywordData {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  relevancy: number;
  currentRank?: number;
}

export interface CompetitorData {
  asin: string;
  title: string;
  price: number;
  bsr?: number;
  rating: number;
  reviewCount: number;
  sellerType: "FBA" | "FBM" | "AMZ";
}

export type ReportTimeframe = "last7" | "last30" | "last90" | "custom";
