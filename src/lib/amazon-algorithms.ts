type MarketStrategy = "premium" | "competitive" | "economy";

interface ProductPricingData {
  cost: number;
  targetMargin: number;
  seasonalityFactor?: number;
  marketStrategy?: MarketStrategy;
}

export function calculateOptimalPrice(
  productData: ProductPricingData,
  competitorPrices: number[],
): number {
  const {
    cost,
    targetMargin,
    seasonalityFactor = 1,
    marketStrategy = "competitive",
  } = productData;

  // Filter out outliers from competitor prices
  const sortedPrices = [...competitorPrices].sort((a, b) => a - b);
  const q1Index = Math.floor(sortedPrices.length * 0.25);
  const q3Index = Math.floor(sortedPrices.length * 0.75);
  const filteredPrices = sortedPrices.slice(q1Index, q3Index + 1);

  const averageCompetitorPrice =
    filteredPrices.reduce((a, b) => a + b, 0) / filteredPrices.length;

  // Calculate base price considering cost and target margin
  const basePrice = cost * (1 + targetMargin);

  // Apply market strategy adjustments
  let strategicPrice = averageCompetitorPrice;
  switch (marketStrategy) {
    case "premium":
      strategicPrice = averageCompetitorPrice * 1.1;
      break;
    case "competitive":
      strategicPrice = averageCompetitorPrice * 0.95;
      break;
    case "economy":
      strategicPrice = averageCompetitorPrice * 0.9;
      break;
  }

  // Apply seasonality factor
  const adjustedPrice = strategicPrice * seasonalityFactor;

  // Ensure price covers costs and desired margin
  return Math.max(basePrice, adjustedPrice);
}
