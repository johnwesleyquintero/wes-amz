"use client";

import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { FixedSizeList as List } from "react-window";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Progress } from "../ui/progress";
import { Upload, AlertCircle, Download, Percent } from "lucide-react";
import Papa from "papaparse";
import SampleCsvButton from "./sample-csv-button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { useToast } from "@/hooks/use-toast";

// Define a more comprehensive ProductData type
type ProductData = {
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
enum ProductCategory {
  STANDARD = "Standard",
  LARGE = "Large",
  HAZMAT = "Hazmat",
}

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
    // Placeholder implementation - replace with your actual logic
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

    // Example calculation - adjust as needed
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

    return Math.max(0, Math.min(100, score)); // Ensure score is between 0 and 100
  },
  calculateOptimalPrice: (
    currentPrice: number,
    competitorPrices: number[],
    productScore: number,
  ) => {
    // Placeholder implementation - replace with your actual logic
    const averageCompetitorPrice =
      competitorPrices.reduce((a, b) => a + b, 0) / competitorPrices.length;
    const priceDifference = currentPrice - averageCompetitorPrice;
    const adjustedPrice = currentPrice - priceDifference * (1 - productScore);
    return Math.max(0, adjustedPrice);
  },
};

export default function ProfitMarginCalculator() {
  const { toast } = useToast();
  const [results, setResults] = useState<ProductData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [manualProduct, setManualProduct] = useState<ProductData>({
    product: "",
    cost: 0,
    price: 0,
    fees: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (results.length > 0) {
      setError(null);
    }
  }, [results]);

  const calculateResults = useCallback(
    (data: ProductData[]) => {
      if (!data || data.length === 0) {
        setError("No valid data to calculate");
        toast({
          title: "Calculation Error",
          description: "No valid data to calculate",
          variant: "destructive",
        });
        return;
      }

      const calculated = data.map((item) => {
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

      if (calculated.length === 0) {
        setError("Failed to calculate results");
        toast({
          title: "Calculation Error",
          description: "Failed to calculate results",
          variant: "destructive",
        });
        return;
      }

      setResults(calculated);
    },
    [toast, setError, setResults],
  );

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setError(null);
      setIsLoading(true);
      const file = event.target.files?.[0];
      if (!file) {
        setIsLoading(false);
        return;
      }

      Papa.parse<ProductData>(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (result) => {
          try {
            // Validate required columns
            const requiredColumns = ["product", "cost", "price", "fees"];
            const missingColumns = requiredColumns.filter(
              (col) => !result.meta.fields.includes(col),
            );

            if (missingColumns.length > 0) {
              throw new Error(
                `Missing required columns: ${missingColumns.join(", ")}`,
              );
            }

            const processedData = result.data
              .filter(
                (item: ProductData) =>
                  item.product &&
                  !isNaN(Number(item.cost)) &&
                  !isNaN(Number(item.price)) &&
                  !isNaN(Number(item.fees)),
              )
              .map((item: ProductData) => ({
                product: String(item.product),
                cost: Number(item.cost),
                price: Number(item.price),
                fees: Number(item.fees),
              }));

            if (processedData.length === 0) {
              throw new Error("No valid data found in CSV");
            }

            calculateResults(processedData);
          } catch (err) {
            setError(`Error processing CSV file: ${err.message}`);
            toast({
              title: "CSV Error",
              description: `Error processing CSV file: ${err.message}`,
              variant: "destructive",
            });
          } finally {
            setIsLoading(false);
          }
        },
        error: (error) => {
          setError(`Error parsing CSV: ${error.message}`);
          toast({
            title: "CSV Error",
            description: `Error parsing CSV: ${error.message}`,
            variant: "destructive",
          });
          setIsLoading(false);
        },
      });
    },
    [calculateResults, toast, setIsLoading, setError],
  );

  const handleManualSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!manualProduct.product.trim()) {
        setError("Please enter a product name");
        toast({
          title: "Input Error",
          description: "Please enter a product name",
          variant: "destructive",
        });
        return;
      }

      const cost = Number(manualProduct.cost);
      const price = Number(manualProduct.price);
      const fees = Number(manualProduct.fees);

      if (isNaN(cost) || cost <= 0) {
        setError("Product cost must be a valid positive number");
        toast({
          title: "Input Error",
          description: "Product cost must be a valid positive number",
          variant: "destructive",
        });
        return;
      }

      if (isNaN(price) || price <= 0) {
        setError("Selling price must be a valid positive number");
        toast({
          title: "Input Error",
          description: "Selling price must be a valid positive number",
          variant: "destructive",
        });
        return;
      }

      if (isNaN(fees) || fees < 0) {
        setError("Fees must be a valid non-negative number");
        toast({
          title: "Input Error",
          description: "Fees must be a valid non-negative number",
          variant: "destructive",
        });
        return;
      }

      if (price <= cost + fees) {
        setError(
          "Selling price must be greater than the sum of cost and fees for a profitable margin",
        );
        toast({
          title: "Input Error",
          description:
            "Selling price must be greater than the sum of cost and fees for a profitable margin",
          variant: "destructive",
        });
        return;
      }

      const newProduct = {
        product: manualProduct.product.trim(),
        cost,
        price,
        fees,
      };

      calculateResults([newProduct]);
      setManualProduct({
        product: "",
        cost: 0,
        price: 0,
        fees: 0,
      });
    },
    [manualProduct, calculateResults, toast, setError, setManualProduct],
  );

  const handleExport = useCallback(() => {
    if (results.length === 0) {
      setError("No data to export");
      toast({
        title: "Export Error",
        description: "No data to export",
        variant: "destructive",
      });
      return;
    }

    const exportData = results.map((product) => ({
      product: product.product,
      cost: product.cost.toFixed(2),
      price: product.price.toFixed(2),
      fees: product.fees.toFixed(2),
      profit: product.profit?.toFixed(2) || "",
      margin: product.margin?.toFixed(2) || "",
      roi: product.roi?.toFixed(2) || "",
    }));

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "profit_margin_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Export Success",
      description: "Profit margin data exported successfully",
      variant: "default",
    });
  }, [results, toast, setError]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <Percent className="mr-2 h-6 w-6" />
        <CardTitle className="text-2xl font-bold">
          Profit Margin Calculator
        </CardTitle>
        <CardDescription>
          Calculate and analyze your product's profitability.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CSV Upload */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csv-upload">Upload CSV File</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload CSV
                </Button>
                <SampleCsvButton
                  dataType="fba"
                  fileName="sample-fba-calculator.csv"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                CSV should have columns: product, cost, price, fees
              </p>
            </div>
          </div>

          {/* Manual Input */}
          <div className="space-y-4">
            <h3 className="font-medium">Or Enter Manually</h3>
            <form onSubmit={handleManualSubmit} className="space-y-3">
              <div>
                <Label htmlFor="product">Product Name</Label>
                <Input
                  id="product"
                  value={manualProduct.product}
                  onChange={(e) =>
                    setManualProduct({
                      ...manualProduct,
                      product: e.target.value,
                    })
                  }
                  placeholder="Product name"
                />
              </div>
              <div>
                <Label htmlFor="cost">Product Cost ($)</Label>
                <Input
                  id="cost"
                  type="number"
                  value={manualProduct.cost || ""}
                  onChange={(e) =>
                    setManualProduct({
                      ...manualProduct,
                      cost: e.target.valueAsNumber,
                    })
                  }
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              <div>
                <Label htmlFor="price">Selling Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={manualProduct.price || ""}
                  onChange={(e) =>
                    setManualProduct({
                      ...manualProduct,
                      price: e.target.valueAsNumber,
                    })
                  }
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              <div>
                <Label htmlFor="fees">Fees ($)</Label>
                <Input
                  id="fees"
                  type="number"
                  value={manualProduct.fees || ""}
                  onChange={(e) =>
                    setManualProduct({
                      ...manualProduct,
                      fees: e.target.valueAsNumber,
                    })
                  }
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              <Button type="submit" className="w-full">
                Calculate
              </Button>
            </form>
          </div>
        </div>

        {/* Loading and Error States */}
        {isLoading && (
          <div className="space-y-2 py-4 text-center">
            <Progress value={33} className="h-2" />
            <p className="text-sm text-muted-foreground">Processing data...</p>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-100 p-3 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Results Section */}
        {results.length > 0 ? (
          <div className="space-y-6">
            <h3 className="font-medium">Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Bar Chart */}
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={results}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="product" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="profit" fill="#10b981" name="Profit ($)" />
                    <Bar dataKey="cost" fill="#ef4444" name="Cost ($)" />
                    <Bar dataKey="fees" fill="#f59e0b" name="Fees ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* Line Chart */}
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={results}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="product" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#ff7300"
                      name="Price"
                    />
                    <Line
                      type="monotone"
                      dataKey="cost"
                      stroke="#387908"
                      name="Cost"
                    />
                    <Line
                      type="monotone"
                      dataKey="fees"
                      stroke="#ff0000"
                      name="Fees"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Profit</TableHead>
                  <TableHead className="text-right">Margin</TableHead>
                  <TableHead className="text-right">ROI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <List
                  height={300}
                  itemCount={results.length}
                  itemSize={40}
                  width="100%"
                >
                  {({ index, style }) => (
                    <TableRow key={index} style={style}>
                      <TableCell>{results[index].product}</TableCell>
                      <TableCell className="text-right">
                        ${results[index].profit?.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        {results[index].margin}%
                      </TableCell>
                      <TableCell className="text-right">
                        {results[index].roi}%
                      </TableCell>
                    </TableRow>
                  )}
                </List>
              </TableBody>
            </Table>

            {/* Export Button */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export as CSV
              </Button>
            </div>
          </div>
        ) : (
          !isLoading &&
          !error && (
            <div className="text-center py-10 text-muted-foreground">
              <p className="mb-2">No profit margin data to display.</p>
              <p>
                Upload a CSV file or enter product details manually to get
                started.
              </p>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}
