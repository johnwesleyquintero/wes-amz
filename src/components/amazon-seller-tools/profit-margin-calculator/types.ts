// Define a more comprehensive ProductData type
export type ProductData = {
  product: string;
  cost: number;
  price: number;
  fees: number;
  profit?: number;
  roi?: number;
  margin?: number;
  // Add optional fields for more advanced calculations
  conversionRate?: number;
  sessions?: number;
  reviewRating?: number;
  reviewCount?: number;
  priceCompetitiveness?: number;
  inventoryHealth?: number;
  weight?: number;
  volume?: number;
  competitorPrices?: number[];
};

// Enum for product categories
export enum ProductCategory {
  STANDARD = "Standard",
  LARGE = "Large",
  HAZMAT = "Hazmat",
}
