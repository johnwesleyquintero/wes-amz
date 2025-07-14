/**
 * Represents various identifiers for Amazon products or data points.
 */
export interface Identifier {
  /** The Amazon Standard Identification Number. */
  asin: string;
  /** The Seller SKU. */
  sku: string;
  /** The Universal Product Code. */
  upc: string;
  /** A relevant keyword. */
  keyword: string;
  /** The product niche. */
  niche: string;
  /** The brand name. */
  brand: string;
  /** The product category. */
  category: string;
}

/**
 * Represents a row of processed data, typically from a CSV or API response.
 */
export interface ProcessedRow {
  /** The Amazon Standard Identification Number. */
  asin: string;
  /** The product price. */
  price: number;
  /** The number of reviews. */
  reviews: number;
  /** The average rating. */
  rating: number;
  /** The conversion rate. */
  conversion_rate: number;
  /** The click-through rate. */
  click_through_rate: number;
}

/**
 * Represents detailed information about a product's performance and characteristics.
 */
export interface Product {
  /** The conversion rate of the product. */
  conversionRate: number;
  /** The number of sessions the product page received. */
  sessions: number;
  /** The average review rating of the product. */
  reviewRating: number;
  /** The total count of reviews for the product. */
  reviewCount: number;
  /** A metric indicating how competitive the product's price is. */
  priceCompetitiveness: number;
  /** A metric indicating the health of the product's inventory. */
  inventoryHealth: number;
  /** The weight of the product. */
  weight: number;
  /** The volume of the product. */
  volume: number;
  /** The category of the product. */
  category: ProductCategory;
  /** The date when the product data was last updated. */
  lastUpdated: Date;
}

/**
 * Defines the fee structure for various Amazon services.
 */
export interface FeeStructure {
  /** The base fee for a service. */
  baseFee: number;
  /** The fee per kilogram. */
  perKgFee: number;
  /** The weight threshold for certain fees. */
  weightThreshold: number;
  /** The monthly storage fee. */
  monthlyStorageFee: number;
  /** The referral fee percentage. */
  referralPercentage: number;
  /** A record of category-specific fees. */
  categoryFees: Record<ProductCategory, number>;
}

/**
 * Represents inventory-related data for a product.
 */
export interface InventoryData {
  /** Sales in the last 30 days. */
  salesLast30Days: number;
  /** Lead time for restocking in days. */
  leadTime: number;
  /** Current quantity of inventory. */
  currentInventory: number;
  /** Average daily sales. */
  averageDailySales: number;
  /** Safety stock level. */
  safetyStock: number;
  /** The health status of the inventory. */
  status: InventoryHealthStatus;
}

/**
 * Enum representing different product categories for Amazon.
 */
export enum ProductCategory {
  STANDARD = "standard",
  OVERSIZE = "oversize",
  HAZMAT = "hazmat",
  APPAREL = "apparel",
}

/**
 * Enum representing the health status of inventory.
 */
export enum InventoryHealthStatus {
  HEALTHY = "healthy",
  LOW = "low",
  EXCESS = "excess",
  CRITICAL = "critical",
}

/**
 * Defines the types of metrics that can be used.
 */
export type MetricType =
  | "price"
  | "reviews"
  | "rating"
  | "sales_velocity"
  | "inventory_levels"
  | "conversion_rate"
  | "click_through_rate";

/**
 * Represents a single data point for charting.
 */
export interface ChartDataPoint {
  /** The name or label for the data point. */
  name: string;
  /** Dynamic properties for various metric values. */
  [key: string]: string | number;
}

/**
 * Extends ProcessedRow with an optional name for competitor data.
 */
export interface CompetitorDataRow extends ProcessedRow {
  /** The name of the competitor product. */
  name?: string;
}

/**
 * Represents a product listed on Amazon, including cost and fee details.
 */
export interface AmazonProduct {
  /** The Amazon Standard Identification Number. */
  asin: string;
  /** The title of the product. */
  title: string;
  /** The selling price of the product. */
  price: number;
  /** The cost of the product. */
  cost: number;
  /** Fulfillment by Amazon (FBA) fees. */
  fbaFees: number;
  /** The referral fee charged by Amazon. */
  referralFee: number;
  /** The category of the product. */
  category: string;
  /** Optional dimensions of the product. */
  dimensions?: ProductDimensions;
}

/**
 * Represents the physical dimensions and weight of a product.
 */
export interface ProductDimensions {
  /** Length of the product. */
  length: number;
  /** Width of the product. */
  width: number;
  /** Height of the product. */
  height: number;
  /** Weight of the product. */
  weight: number;
  /** Unit of measurement for length, width, and height. */
  unit: "in" | "cm";
  /** Unit of measurement for weight. */
  weightUnit: "lb" | "kg";
}

/**
 * Represents sales data for a specific ASIN over a period.
 */
export interface SalesData {
  /** The Amazon Standard Identification Number. */
  asin: string;
  /** The date of the sales data. */
  date: string;
  /** The number of units sold. */
  units: number;
  /** The revenue generated. */
  revenue: number;
  /** Optional PPC (Pay-Per-Click) spend. */
  ppcSpend?: number;
  /** Optional organic sales. */
  organicSales?: number;
}

/**
 * Represents data for a specific keyword.
 */
export interface KeywordData {
  /** The keyword string. */
  keyword: string;
  /** The estimated search volume for the keyword. */
  searchVolume: number;
  /** The difficulty score for ranking on this keyword. */
  difficulty: number;
  /** The relevancy score of the keyword. */
  relevancy: number;
  /** The current organic rank for the keyword. */
  currentRank?: number;
}

/**
 * Represents data for a competitor's product.
 */
export interface CompetitorData {
  /** The Amazon Standard Identification Number of the competitor's product. */
  asin: string;
  /** The title of the competitor's product. */
  title: string;
  /** The price of the competitor's product. */
  price: number;
  /** Optional Best Seller Rank (BSR). */
  bsr?: number;
  /** The average rating of the competitor's product. */
  rating: number;
  /** The total count of reviews for the competitor's product. */
  reviewCount: number;
  /** The type of seller (FBA, FBM, or AMZ). */
  sellerType: "FBA" | "FBM" | "AMZ";
}

/**
 * Defines standard timeframes for reports.
 */
export type ReportTimeframe = "last7" | "last30" | "last90" | "custom";
