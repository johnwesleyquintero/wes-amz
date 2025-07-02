import {
  ProductData,
  ProductCategory,
} from "@/components/amazon-seller-tools/profit-margin-calculator/types";

// Placeholder for AmazonAlgorithms - replace with your actual implementation
const AmazonAlgorithms = {
  calculateProductScore: (params: {
    conversionRate: number;
    sessions: number;
    reviewRating: number;
    reviewCount: number;
    priceCompetitiveness: number;
    inventoryHealth: number;
    weight: number;
    volume: number;
    category: ProductCategory;
  }) => {
    const {
      conversionRate,
      sessions,
      reviewRating,
      reviewCount,
      priceCompetitiveness,
      inventoryHealth,
      weight,
      volume,
      category,
    } = params;

    const score =
      conversionRate * 0.2 +
      sessions * 0.1 +
      reviewRating * 0.3 +
      reviewCount * 0.1 +
      priceCompetitiveness * 0.1 +
      inventoryHealth * 0.1 +
      (category === ProductCategory.LARGE ? -10 : 0) +
      (category === ProductCategory.HAZMAT ? -20 : 0) -
      weight * 0.05 -
      volume * 0.05;

    return Math.max(0, Math.min(100, score));
  },
  calculateOptimalPrice: (
    currentPrice: number,
    competitorPrices: number[],
    productScore: number,
  ) => {
    const averageCompetitorPrice =
      competitorPrices.reduce((a, b) => a + b, 0) / competitorPrices.length;
    const priceDifference = currentPrice - averageCompetitorPrice;
    const adjustedPrice = currentPrice - priceDifference * (1 - productScore);
    return Math.max(0, adjustedPrice);
  },
};

/**
 * Calculates profit, margin, and ROI for a list of products.
 * @param data - An array of ProductData objects.
 * @returns An array of ProductData objects with calculated profit, margin, and ROI.
 */
export const calculateProfitMetrics = (data: ProductData[]): ProductData[] => {
  if (!data || data.length === 0) {
    return [];
  }

  return data.map((item) => {
    const productScore = AmazonAlgorithms.calculateProductScore({
      conversionRate: item.conversionRate || 15,
      sessions: item.sessions || 300,
      reviewRating: item.reviewRating || 4.5,
      reviewCount: item.reviewCount || 42,
      priceCompetitiveness: item.priceCompetitiveness || 0.92,
      inventoryHealth: item.inventoryHealth || 0.8,
      weight: item.weight || 1.2,
      volume: item.volume || 0.05,
      category: ProductCategory.STANDARD,
    });

    const adjustedPrice = AmazonAlgorithms.calculateOptimalPrice(
      item.price,
      item.competitorPrices || [item.price * 0.9, item.price * 1.1],
      productScore / 100,
    );

    const profit = adjustedPrice - item.cost - item.fees;
    const margin = (profit / item.price) * 100;
    const roi = (profit / item.cost) * 100;
    return {
      ...item,
      profit,
      margin: parseFloat(margin.toFixed(2)),
      roi: parseFloat(roi.toFixed(2)),
    };
  });
};
