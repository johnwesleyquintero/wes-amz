import Papa from "papaparse";

type SampleDataType =
  | "fba"
  | "keyword"
  | "ppc"
  | "keyword-dedup"
  | "acos"
  | "description"
  | "sales-estimator";

interface SampleData {
  productName?: string;
  cost?: number;
  price?: number;
  fees?: number;
  keywords?: string;
  searchVolume?: number;
  competition?: string;
  clicks?: number;
  impressions?: number;
  ctr?: number;
  cpc?: number;
  spend?: number;
  acos?: number;
  campaign?: string;
  [key: string]: unknown;
  adSpend?: number;
  sales?: number;
  asin?: string;
  description?: string;
  name?: string;
  type?: string;
}

export function generateSampleCsv(dataType: SampleDataType): string {
  let data: SampleData[] = [];

  switch (dataType) {
    case "fba":
      data = [
        {
          productName: "Organic Facial Cleanser",
          cost: 4.5,
          price: 18.99,
          fees: 3.5,
        },
        {
          productName: "Vitamin C Serum",
          cost: 6.25,
          price: 24.99,
          fees: 4.25,
        },
        {
          productName: "Hydrating Face Mask",
          cost: 3.75,
          price: 14.99,
          fees: 3.0,
        },
        {
          productName: "Anti-Aging Eye Cream",
          cost: 7.5,
          price: 29.99,
          fees: 4.75,
        },
        {
          productName: "Natural Lip Balm",
          cost: 1.5,
          price: 7.99,
          fees: 2.0,
        },
        {
          productName: "Herbal Hair Growth Oil",
          cost: 5.0,
          price: 22.99,
          fees: 4.0,
        },
        {
          productName: "Bamboo Charcoal Soap",
          cost: 2.25,
          price: 9.99,
          fees: 2.5,
        },
        {
          productName: "Essential Oil Diffuser",
          cost: 10.5,
          price: 39.99,
          fees: 6.0,
        },
        {
          productName: "Collagen Boosting Cream",
          cost: 8.0,
          price: 34.99,
          fees: 5.25,
        },
        {
          productName: "Sunscreen SPF 50",
          cost: 4.0,
          price: 16.99,
          fees: 3.25,
        },
        {
          productName: "Exfoliating Body Scrub",
          cost: 3.5,
          price: 15.99,
          fees: 3.1,
        },
        {
          productName: "Nail Strengthener Polish",
          cost: 2.75,
          price: 11.99,
          fees: 2.75,
        },
        {
          productName: "Teeth Whitening Strips",
          cost: 6.75,
          price: 26.99,
          fees: 4.5,
        },
        {
          productName: "Aromatherapy Bath Bombs",
          cost: 2.0,
          price: 8.99,
          fees: 2.25,
        },
        {
          productName: "Makeup Brush Set",
          cost: 9.0,
          price: 32.99,
          fees: 5.0,
        },
      ];
      break;
    case "keyword":
      data = [
        {
          productName: "Organic Facial Cleanser",
          keywords:
            "organic face wash, natural cleanser, gentle facial cleanser, sensitive skin cleanser",
          searchVolume: 45000,
          competition: "Medium",
        },
        {
          productName: "Vitamin C Serum",
          keywords:
            "vitamin c serum, face serum, anti-aging serum, brightening serum, skin care",
          searchVolume: 68000,
          competition: "High",
        },
        {
          productName: "Hydrating Face Mask",
          keywords:
            "hydrating face mask, moisturizing mask, face mask for dry skin, sheet mask",
          searchVolume: 32000,
          competition: "Low",
        },
        {
          productName: "Anti-Aging Eye Cream",
          keywords:
            "anti-aging eye cream, wrinkle cream, dark circle treatment, eye care",
          searchVolume: 52000,
          competition: "Medium",
        },
        {
          productName: "Natural Lip Balm",
          keywords:
            "natural lip balm, organic lip balm, moisturizing lip balm, chapstick",
          searchVolume: 28000,
          competition: "Low",
        },
        {
          productName: "Herbal Hair Growth Oil",
          keywords:
            "hair growth oil, herbal hair oil, hair loss treatment, hair care",
          searchVolume: 40000,
          competition: "Medium",
        },
        {
          productName: "Bamboo Charcoal Soap",
          keywords: "charcoal soap, detox soap, acne treatment, natural soap",
          searchVolume: 25000,
          competition: "Low",
        },
        {
          productName: "Essential Oil Diffuser",
          keywords:
            "essential oil diffuser, aromatherapy diffuser, home fragrance",
          searchVolume: 60000,
          competition: "High",
        },
        {
          productName: "Collagen Boosting Cream",
          keywords: "collagen cream, anti-aging cream, skin firming cream",
          searchVolume: 48000,
          competition: "Medium",
        },
        {
          productName: "Sunscreen SPF 50",
          keywords:
            "sunscreen, spf 50, sun protection, broad spectrum sunscreen",
          searchVolume: 75000,
          competition: "High",
        },
        {
          productName: "Exfoliating Body Scrub",
          keywords:
            "body scrub, exfoliating scrub, skin exfoliation, natural scrub",
          searchVolume: 38000,
          competition: "Medium",
        },
        {
          productName: "Nail Strengthener Polish",
          keywords: "nail strengthener, nail polish, nail care, nail treatment",
          searchVolume: 22000,
          competition: "Low",
        },
        {
          productName: "Teeth Whitening Strips",
          keywords:
            "teeth whitening strips, teeth whitening, teeth care, smile care",
          searchVolume: 55000,
          competition: "High",
        },
        {
          productName: "Aromatherapy Bath Bombs",
          keywords:
            "bath bombs, aromatherapy bath, relaxing bath, bath fizzies",
          searchVolume: 30000,
          competition: "Low",
        },
        {
          productName: "Makeup Brush Set",
          keywords:
            "makeup brush set, makeup brushes, cosmetic brushes, beauty tools",
          searchVolume: 42000,
          competition: "Medium",
        },
      ];
      break;
    case "ppc":
      data = [
        {
          name: "Auto Campaign - Facial Cleanser",
          type: "Auto",
          spend: 120.5,
          sales: 650.0,
          impressions: 8500,
          clicks: 210,
        },
        {
          name: "Sponsored Products - Vitamin C",
          type: "Sponsored Products",
          spend: 180.0,
          sales: 950.0,
          impressions: 12000,
          clicks: 300,
        },
        {
          name: "Sponsored Brands - Face Mask",
          type: "Sponsored Brands",
          spend: 90.0,
          sales: 400.0,
          impressions: 6000,
          clicks: 150,
        },
        {
          name: "Auto Campaign - Eye Cream",
          type: "Auto",
          spend: 150.0,
          sales: 750.0,
          impressions: 9000,
          clicks: 220,
        },
        {
          name: "Sponsored Products - Lip Balm",
          type: "Sponsored Products",
          spend: 60.0,
          sales: 300.0,
          impressions: 4000,
          clicks: 100,
        },
        {
          name: "Sponsored Brands - Hair Oil",
          type: "Sponsored Brands",
          spend: 110.0,
          sales: 550.0,
          impressions: 7000,
          clicks: 180,
        },
        {
          name: "Auto Campaign - Charcoal Soap",
          type: "Auto",
          spend: 70.0,
          sales: 350.0,
          impressions: 5000,
          clicks: 120,
        },
        {
          name: "Sponsored Products - Diffuser",
          type: "Sponsored Products",
          spend: 200.0,
          sales: 1000.0,
          impressions: 13000,
          clicks: 320,
        },
        {
          name: "Sponsored Brands - Collagen Cream",
          type: "Sponsored Brands",
          spend: 160.0,
          sales: 800.0,
          impressions: 10000,
          clicks: 250,
        },
        {
          name: "Auto Campaign - Sunscreen",
          type: "Auto",
          spend: 100.0,
          sales: 500.0,
          impressions: 7500,
          clicks: 190,
        },
        {
          name: "Sponsored Products - Body Scrub",
          type: "Sponsored Products",
          spend: 80.0,
          sales: 400.0,
          impressions: 5500,
          clicks: 130,
        },
        {
          name: "Sponsored Brands - Nail Polish",
          type: "Sponsored Brands",
          spend: 50.0,
          sales: 250.0,
          impressions: 3500,
          clicks: 90,
        },
        {
          name: "Auto Campaign - Teeth Whitening",
          type: "Auto",
          spend: 130.0,
          sales: 650.0,
          impressions: 8000,
          clicks: 200,
        },
        {
          name: "Sponsored Products - Bath Bombs",
          type: "Sponsored Products",
          spend: 75.0,
          sales: 375.0,
          impressions: 4500,
          clicks: 110,
        },
        {
          name: "Sponsored Brands - Makeup Brushes",
          type: "Sponsored Brands",
          spend: 140.0,
          sales: 700.0,
          impressions: 9000,
          clicks: 230,
        },
      ];
      break;
    case "keyword-dedup":
      data = [
        {
          productName: "Organic Facial Cleanser",
          keywords:
            "organic face wash, face wash organic, natural cleanser, gentle facial cleanser, organic cleanser, facial cleanser, face wash",
        },
        {
          productName: "Vitamin C Serum",
          keywords:
            "vitamin c serum, face serum, serum vitamin c, anti-aging serum, brightening serum, skin care serum, serum",
        },
        {
          productName: "Hydrating Face Mask",
          keywords:
            "hydrating face mask, face mask hydrating, moisturizing mask, face mask for dry skin, sheet mask, mask",
        },
        {
          productName: "Anti-Aging Eye Cream",
          keywords:
            "anti-aging eye cream, eye cream anti-aging, wrinkle cream, dark circle treatment, eye care cream, eye cream",
        },
        {
          productName: "Natural Lip Balm",
          keywords:
            "natural lip balm, lip balm natural, organic lip balm, moisturizing lip balm, chapstick, lip balm",
        },
        {
          productName: "Herbal Hair Growth Oil",
          keywords:
            "hair growth oil, herbal hair oil, hair oil, hair loss treatment, hair care oil",
        },
        {
          productName: "Bamboo Charcoal Soap",
          keywords:
            "charcoal soap, detox soap, soap, acne treatment, natural soap",
        },
        {
          productName: "Essential Oil Diffuser",
          keywords:
            "essential oil diffuser, oil diffuser, aromatherapy diffuser, home fragrance",
        },
        {
          productName: "Collagen Boosting Cream",
          keywords:
            "collagen cream, anti-aging cream, skin firming cream, cream",
        },
        {
          productName: "Sunscreen SPF 50",
          keywords:
            "sunscreen, spf 50, sun protection, broad spectrum sunscreen, sunscreen spf",
        },
        {
          productName: "Exfoliating Body Scrub",
          keywords:
            "body scrub, exfoliating scrub, skin exfoliation, natural scrub, scrub",
        },
        {
          productName: "Nail Strengthener Polish",
          keywords:
            "nail strengthener, nail polish, nail care, nail treatment, polish",
        },
        {
          productName: "Teeth Whitening Strips",
          keywords:
            "teeth whitening strips, teeth whitening, teeth care, smile care, whitening strips",
        },
        {
          productName: "Aromatherapy Bath Bombs",
          keywords:
            "bath bombs, aromatherapy bath, relaxing bath, bath fizzies, bath",
        },
        {
          productName: "Makeup Brush Set",
          keywords:
            "makeup brush set, makeup brushes, cosmetic brushes, beauty tools, brushes",
        },
      ];
      break;
    case "acos":
      data = [
        {
          productName: "Organic Facial Cleanser",
          campaign: "Auto Campaign - Facial Cleanser",
          adSpend: 120.5,
          sales: 650.0,
          impressions: 8500,
          clicks: 210,
        },
        {
          productName: "Vitamin C Serum",
          campaign: "Sponsored Products - Vitamin C",
          adSpend: 180.0,
          sales: 950.0,
          impressions: 12000,
          clicks: 300,
        },
        {
          productName: "Hydrating Face Mask",
          campaign: "Sponsored Brands - Face Mask",
          adSpend: 90.0,
          sales: 400.0,
          impressions: 6000,
          clicks: 150,
        },
        {
          productName: "Anti-Aging Eye Cream",
          campaign: "Auto Campaign - Eye Cream",
          adSpend: 150.0,
          sales: 750.0,
          impressions: 9000,
          clicks: 220,
        },
        {
          productName: "Natural Lip Balm",
          campaign: "Sponsored Products - Lip Balm",
          adSpend: 60.0,
          sales: 300.0,
          impressions: 4000,
          clicks: 100,
        },
        {
          productName: "Herbal Hair Growth Oil",
          campaign: "Sponsored Brands - Hair Oil",
          adSpend: 110.0,
          sales: 550.0,
          impressions: 7000,
          clicks: 180,
        },
        {
          productName: "Bamboo Charcoal Soap",
          campaign: "Auto Campaign - Charcoal Soap",
          adSpend: 70.0,
          sales: 350.0,
          impressions: 5000,
          clicks: 120,
        },
        {
          productName: "Essential Oil Diffuser",
          campaign: "Sponsored Products - Diffuser",
          adSpend: 200.0,
          sales: 1000.0,
          impressions: 13000,
          clicks: 320,
        },
        {
          productName: "Collagen Boosting Cream",
          campaign: "Sponsored Brands - Collagen Cream",
          adSpend: 160.0,
          sales: 800.0,
          impressions: 10000,
          clicks: 250,
        },
        {
          productName: "Sunscreen SPF 50",
          campaign: "Auto Campaign - Sunscreen",
          adSpend: 100.0,
          sales: 500.0,
          impressions: 7500,
          clicks: 190,
        },
        {
          productName: "Exfoliating Body Scrub",
          campaign: "Sponsored Products - Body Scrub",
          adSpend: 80.0,
          sales: 400.0,
          impressions: 5500,
          clicks: 130,
        },
        {
          productName: "Nail Strengthener Polish",
          campaign: "Sponsored Brands - Nail Polish",
          adSpend: 50.0,
          sales: 250.0,
          impressions: 3500,
          clicks: 90,
        },
        {
          productName: "Teeth Whitening Strips",
          campaign: "Auto Campaign - Teeth Whitening",
          adSpend: 130.0,
          sales: 650.0,
          impressions: 8000,
          clicks: 200,
        },
        {
          productName: "Aromatherapy Bath Bombs",
          campaign: "Sponsored Products - Bath Bombs",
          adSpend: 75.0,
          sales: 375.0,
          impressions: 4500,
          clicks: 110,
        },
        {
          productName: "Makeup Brush Set",
          campaign: "Sponsored Brands - Makeup Brushes",
          adSpend: 140.0,
          sales: 700.0,
          impressions: 9000,
          clicks: 230,
        },
      ];
      break;
    case "description":
      data = [
        {
          productName: "Organic Facial Cleanser",
          asin: "B01ABCDEF1",
          description:
            "Our organic facial cleanser gently removes impurities and makeup, leaving your skin feeling refreshed and clean. Made with natural ingredients, it is perfect for all skin types.",
        },
        {
          productName: "Vitamin C Serum",
          asin: "B02ABCDEF2",
          description:
            "Brighten and rejuvenate your skin with our Vitamin C Serum. This powerful antioxidant serum helps reduce the appearance of fine lines and wrinkles while improving skin tone and texture.",
        },
        {
          productName: "Hydrating Face Mask",
          asin: "B03ABCDEF3",
          description:
            "Quench your skin's thirst with our Hydrating Face Mask. This mask provides deep hydration, leaving your skin soft, supple, and glowing.",
        },
        {
          productName: "Anti-Aging Eye Cream",
          asin: "B04ABCDEF4",
          description:
            "Turn back the clock with our Anti-Aging Eye Cream. This cream targets fine lines, wrinkles, and dark circles, giving you a more youthful appearance.",
        },
        {
          productName: "Natural Lip Balm",
          asin: "B05ABCDEF5",
          description:
            "Keep your lips soft and moisturized with our Natural Lip Balm. Made with organic ingredients, it provides long-lasting hydration and protection.",
        },
        {
          productName: "Herbal Hair Growth Oil",
          asin: "B06ABCDEF6",
          description:
            "Promote healthy hair growth with our Herbal Hair Growth Oil. This oil nourishes the scalp and strengthens hair follicles, leading to thicker, fuller hair.",
        },
        {
          productName: "Bamboo Charcoal Soap",
          asin: "B07ABCDEF7",
          description:
            "Detoxify your skin with our Bamboo Charcoal Soap. This soap draws out impurities and excess oil, leaving your skin clear and refreshed.",
        },
        {
          productName: "Essential Oil Diffuser",
          asin: "B08ABCDEF8",
          description:
            "Create a relaxing atmosphere with our Essential Oil Diffuser. This diffuser disperses your favorite essential oils, filling your home with a soothing aroma.",
        },
        {
          productName: "Collagen Boosting Cream",
          asin: "B09ABCDEF9",
          description:
            "Boost your skin's collagen production with our Collagen Boosting Cream. This cream helps improve skin elasticity and firmness, reducing the appearance of wrinkles.",
        },
        {
          productName: "Sunscreen SPF 50",
          asin: "B010ABCDEF0",
          description:
            "Protect your skin from harmful UV rays with our Sunscreen SPF 50. This broad-spectrum sunscreen provides high-level protection without feeling heavy or greasy.",
        },
        {
          productName: "Exfoliating Body Scrub",
          asin: "B011ABCDEF1",
          description:
            "Reveal smoother, brighter skin with our Exfoliating Body Scrub. This scrub gently removes dead skin cells, leaving your skin feeling soft and rejuvenated.",
        },
        {
          productName: "Nail Strengthener Polish",
          asin: "B012ABCDEF2",
          description:
            "Strengthen and protect your nails with our Nail Strengthener Polish. This polish helps prevent breakage and promotes healthy nail growth.",
        },
        {
          productName: "Teeth Whitening Strips",
          asin: "B013ABCDEF3",
          description:
            "Achieve a brighter smile with our Teeth Whitening Strips. These strips effectively remove stains and whiten teeth, giving you a confident smile.",
        },
        {
          productName: "Aromatherapy Bath Bombs",
          asin: "B014ABCDEF4",
          description:
            "Transform your bath into a spa experience with our Aromatherapy Bath Bombs. These bombs release soothing scents and skin-softening ingredients.",
        },
        {
          productName: "Makeup Brush Set",
          asin: "B015ABCDEF5",
          description:
            "Achieve flawless makeup application with our Makeup Brush Set. This set includes a variety of brushes for all your makeup needs.",
        },
      ];
      break;
    case "sales-estimator":
      data = [
        {
          productName: "Wireless Earbuds",
          category: "Electronics",
          price: 39.99,
          competition: "High",
        },
        {
          productName: "Phone Case",
          category: "Phone Accessories",
          price: 19.99,
          competition: "Medium",
        },
        {
          productName: "Running Shoes",
          category: "Apparel",
          price: 79.99,
          competition: "Low",
        },
      ];
      break;
    default:
      return "";
  }

  return Papa.unparse(data);
}

export function downloadSampleCsv(
  dataType: SampleDataType,
  fileName?: string,
): void {
  const csv = generateSampleCsv(dataType);
  if (!csv) return;

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName || `sample-${dataType}-data.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
