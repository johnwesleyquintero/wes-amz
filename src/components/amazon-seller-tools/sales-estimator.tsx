"use client";

import type React from "react";
import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Import table components
import {
  Upload,
  FileText,
  AlertCircle,
  Download,
  TrendingUp,
  Info,
} from "lucide-react";
import Papa from "papaparse";
import SampleCsvButton from "./sample-csv-button";
import { useToast } from "@/hooks/use-toast";
import { FixedSizeList as List } from "react-window"; // Import FixedSizeList

type ProductData = {
  product: string;
  category: string;
  price: number;
  competition: "Low" | "Medium" | "High";
  estimatedSales: number;
  estimatedRevenue: number;
  confidence: "Low" | "Medium" | "High";
};

const COMPETITION_LEVELS = ["Low", "Medium", "High"] as const;
type CompetitionLevel = (typeof COMPETITION_LEVELS)[number];

const DEFAULT_COMPETITION: CompetitionLevel = "Medium";

export default function SalesEstimator() {
  const { toast } = useToast();
  const [products, setProducts] = useState<ProductData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualProduct, setManualProduct] = useState({
    product: "",
    category: "",
    price: "",
    competition: DEFAULT_COMPETITION,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const estimateSales = useCallback(
    (
      category: string,
      price: number,
      competition: CompetitionLevel,
    ): {
      estimatedSales: number;
      estimatedRevenue: number;
      confidence: "Low" | "Medium" | "High";
    } => {
      let baseSales = 0;

      if (category === "Electronics") baseSales = 150;
      else if (category === "Phone Accessories") baseSales = 200;
      else baseSales = 100;

      const priceFactor = price < 20 ? 1.5 : price < 50 ? 1.0 : 0.7;
      const competitionFactor =
        competition === "Low" ? 1.3 : competition === "Medium" ? 1.0 : 0.7;

      const estimatedSales = Math.round(
        baseSales * priceFactor * competitionFactor,
      );
      const estimatedRevenue = estimatedSales * price;

      let confidence: "Low" | "Medium" | "High" = "Medium";
      if (competition === "Low" && price < 30) confidence = "High";
      else if (competition === "High" && price > 50) confidence = "Low";

      return { estimatedSales, estimatedRevenue, confidence };
    },
    [],
  );

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsLoading(true);
      setError(null);

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            interface ProductDataCSV {
              product: string;
              category: string;
              price: string;
              competition: string;
            }

            const requiredColumns = [
              "product",
              "category",
              "price",
              "competition",
            ];
            const missingColumns = requiredColumns.filter((col) =>
              results.meta.fields ? !results.meta.fields.includes(col) : true,
            );
            if (missingColumns.length > 0) {
              throw new Error(
                `Missing required columns: ${missingColumns.join(", ")}`,
              );
            }

            const processedData: ProductData[] = results.data
              .filter((row: unknown) => {
                const productRow = row as ProductDataCSV;
                return (
                  productRow.product &&
                  productRow.category &&
                  !isNaN(Number(productRow.price)) &&
                  COMPETITION_LEVELS.includes(
                    productRow.competition as CompetitionLevel,
                  )
                );
              })
              .map((row: unknown) => {
                const productRow = row as ProductDataCSV;
                const price = Number(productRow.price);
                const competition = productRow.competition as CompetitionLevel;
                const { estimatedSales, estimatedRevenue, confidence } =
                  estimateSales(productRow.category, price, competition);

                return {
                  product: productRow.product,
                  category: productRow.category,
                  price,
                  competition,
                  estimatedSales,
                  estimatedRevenue,
                  confidence,
                };
              });

            if (processedData.length === 0) {
              throw new Error("No valid data found in CSV");
            }

            setProducts(processedData);
            toast({
              title: "CSV Processed",
              description: `Loaded ${processedData.length} product data`,
              variant: "default",
            });
          } catch (error) {
            setError(
              error instanceof Error ? error.message : "An error occurred",
            );
            toast({
              title: "Processing Failed",
              description: error.message,
              variant: "destructive",
            });
          }
          setIsLoading(false);
        },
        error: (error) => {
          setError(error.message);
          setIsLoading(false);
        },
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [estimateSales, toast, setIsLoading, setError, setProducts],
  );

  const handleManualEstimate = useCallback(() => {
    if (
      !manualProduct.product ||
      !manualProduct.category ||
      !manualProduct.price
    ) {
      setError("Please fill in all fields");
      toast({
        title: "Input Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const price = Number.parseFloat(manualProduct.price);

    if (isNaN(price)) {
      setError("Please enter a valid price");
      toast({
        title: "Input Error",
        description: "Please enter a valid price",
        variant: "destructive",
      });
      return;
    }

    const { estimatedSales, estimatedRevenue, confidence } = estimateSales(
      manualProduct.category,
      price,
      manualProduct.competition,
    );

    const newProduct: ProductData = {
      product: manualProduct.product,
      category: manualProduct.category,
      price,
      competition: manualProduct.competition,
      estimatedSales,
      estimatedRevenue,
      confidence,
    };

    setProducts((prevProducts) => [...prevProducts, newProduct]);
    setManualProduct({
      product: "",
      category: "",
      price: "",
      competition: DEFAULT_COMPETITION,
    });
    setError(null);
    toast({
      title: "Product Added",
      description: "Product added successfully",
      variant: "default",
    });
  }, [manualProduct, estimateSales, toast, setProducts, setError]);

  const handleExport = useCallback(() => {
    if (products.length === 0) {
      setError("No data to export");
      toast({
        title: "Export Error",
        description: "No data to export",
        variant: "destructive",
      });
      return;
    }

    const exportData = products.map((product) => ({
      product: product.product,
      category: product.category,
      price: product.price.toFixed(2),
      competition: product.competition,
      estimatedSales: product.estimatedSales,
      estimatedRevenue: product.estimatedRevenue.toFixed(2),
      confidence: product.confidence,
    }));

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sales_estimates.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Export Success",
      description: "Sales estimates exported successfully",
      variant: "default",
    });
  }, [products, toast, setError]);

  const clearData = useCallback(() => {
    setProducts([]);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast({
      title: "Data Cleared",
      description: "Sales estimates data cleared",
      variant: "default",
    });
  }, [setProducts, setError, fileInputRef, toast]);

  // Row renderer for react-window
  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const product = products[index];
    return (
      <TableRow key={index} style={style}>
        <TableCell>{product.product}</TableCell>
        <TableCell>{product.category}</TableCell>
        <TableCell className="text-right">
          ${product.price.toFixed(2)}
        </TableCell>
        <TableCell className="text-center">
          <Badge
            variant={
              product.competition === "Low"
                ? "default"
                : product.competition === "Medium"
                  ? "secondary"
                  : "destructive"
            }
          >
            {product.competition}
          </Badge>
        </TableCell>
        <TableCell className="text-right font-medium">
          {product.estimatedSales.toLocaleString()} units
        </TableCell>
        <TableCell className="text-right font-medium">
          ${product.estimatedRevenue.toFixed(2)}
        </TableCell>
        <TableCell className="text-center">
          <Badge
            variant={
              product.confidence === "High"
                ? "default"
                : product.confidence === "Medium"
                  ? "secondary"
                  : "outline"
            }
          >
            {product.confidence}
          </Badge>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-700 dark:text-blue-300">
          <p className="font-medium">CSV Format Requirements:</p>
          <p>
            Your CSV file should have the following columns:{" "}
            <code>product</code>, <code>category</code>, <code>price</code>,{" "}
            <code>competition</code> (Low, Medium, High)
          </p>
          <p className="mt-1">
            Example: <code>product,category,price,competition</code>
            <br />
            <code>Wireless Earbuds,Electronics,39.99,High</code>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Card className="flex-1">
          <CardContent className="p-4">
            <div className="flex flex-col items-center justify-center gap-4 p-6 text-center">
              <div className="rounded-full bg-primary/10 p-3">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Upload CSV</h3>
                <p className="text-sm text-muted-foreground">
                  Upload a CSV file with your product data
                </p>
              </div>
              <div className="w-full">
                <label className="relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/40 bg-background p-6 text-center hover:bg-primary/5">
                  <FileText className="mb-2 h-8 w-8 text-primary/60" />
                  <span className="text-sm font-medium">
                    Click to upload CSV
                  </span>
                  <span className="text-xs text-muted-foreground">
                    (CSV with product name, category, price, and competition
                    level)
                  </span>
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={isLoading}
                    ref={fileInputRef}
                  />
                </label>
                <SampleCsvButton
                  dataType="sales-estimator"
                  fileName="sales_estimator_data.csv"
                />
                {products.length > 0 && (
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={clearData}
                  >
                    Clear Data
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardContent className="p-4">
            <div className="space-y-4 p-2">
              <h3 className="text-lg font-medium">Manual Estimate</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Product Name</label>
                  <Input
                    value={manualProduct.product}
                    onChange={(e) =>
                      setManualProduct({
                        ...manualProduct,
                        product: e.target.value,
                      })
                    }
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Input
                    value={manualProduct.category}
                    onChange={(e) =>
                      setManualProduct({
                        ...manualProduct,
                        category: e.target.value,
                      })
                    }
                    placeholder="Enter product category"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Price ($)</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={manualProduct.price}
                    onChange={(e) =>
                      setManualProduct({
                        ...manualProduct,
                        price: e.target.value,
                      })
                    }
                    placeholder="Enter product price"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Competition Level
                  </label>
                  <select
                    value={manualProduct.competition}
                    onChange={(e) =>
                      setManualProduct({
                        ...manualProduct,
                        competition: e.target.value as CompetitionLevel,
                      })
                    }
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {COMPETITION_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
                <Button onClick={handleManualEstimate} className="w-full">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Estimate Sales
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-100 p-3 text-red-800 dark:bg-red-900/30 dark:text-red-400">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {isLoading && (
        <div className="space-y-2 py-4 text-center">
          <Progress value={45} className="h-2" />
          <p className="text-sm text-muted-foreground">
            Estimating sales potential...
          </p>
        </div>
      )}

      {products.length > 0 ? (
        <>
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export Estimates
            </Button>
          </div>

          <div className="rounded-lg border">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-center">Competition</TableHead>
                    <TableHead className="text-right">
                      Est. Monthly Sales
                    </TableHead>
                    <TableHead className="text-right">
                      Est. Monthly Revenue
                    </TableHead>
                    <TableHead className="text-center">Confidence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <List
                    height={300} // Set a fixed height for the virtualized list
                    itemCount={products.length}
                    itemSize={40} // Approximate height of each row
                    width="100%"
                  >
                    {Row}
                  </List>
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/20 p-4">
            <h3 className="mb-2 text-sm font-medium">Estimation Methodology</h3>
            <p className="text-sm text-muted-foreground">
              These estimates are based on category averages, price points, and
              competition levels. Actual sales may vary based on additional
              factors such as listing quality, reviews, advertising, and
              seasonality. High confidence estimates are more likely to be
              accurate.
            </p>
          </div>
        </>
      ) : (
        !isLoading &&
        !error && (
          <div className="text-center py-10 text-muted-foreground">
            <p className="mb-2">No sales estimates to display.</p>
            <p>
              Upload a CSV file or enter product details manually to get
              started.
            </p>
          </div>
        )
      )}
    </div>
  );
}
