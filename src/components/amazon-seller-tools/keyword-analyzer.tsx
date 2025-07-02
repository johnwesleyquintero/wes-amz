"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Download, Search, Info } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import Papa from "papaparse";
import SampleCsvButton from "./sample-csv-button";
import { useToast } from "@/hooks/use-toast";
import { KeywordIntelligence } from "@/lib/keyword-intelligence";
import { ToolContainer } from "./shared/ToolContainer"; // Import ToolContainer

type KeywordData = {
  product: string;
  keywords: string[];
  searchVolume?: number;
  competition?: string;
  suggestions?: string[];
  analysis?: { keyword: string; score: number }[];
};

const COMPETITION_LEVELS = ["Low", "Medium", "High"] as const;
type CompetitionLevel = (typeof COMPETITION_LEVELS)[number];

const DEFAULT_COMPETITION: CompetitionLevel = "Medium";

const MAX_SUGGESTIONS = 5;

export default function KeywordAnalyzer() {
  const { toast } = useToast();
  const [products, setProducts] = useState<KeywordData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clear error when products change
  useEffect(() => {
    if (products.length > 0) {
      setError(null);
    }
  }, [products]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    Papa.parse<KeywordData>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (result) => {
        if (result.errors.length > 0) {
          setError(
            `Error parsing CSV file: ${result.errors[0].message}. Please check the format.`,
          );
          toast({
            title: "CSV Error",
            description: `Error parsing CSV file: ${result.errors[0].message}. Please check the format.`,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        try {
          const processedData: KeywordData[] = await Promise.all(
            result.data
              .filter((item) => item.product && item.keywords)
              .map(async (item) => {
                interface KeywordItem {
                  product: string;
                  keywords?: string | string[];
                  searchVolume?: string | number;
                  competition?: string;
                  [key: string]: unknown;
                }

                const keywordArray =
                  typeof (item as KeywordItem).keywords === "string"
                    ? ((item as KeywordItem).keywords as string)
                        .split(",")
                        .map((k: string) => k.trim())
                    : Array.isArray((item as KeywordItem).keywords)
                      ? (item as KeywordItem).keywords
                      : [];

                const searchVolume = (item as KeywordItem).searchVolume
                  ? Number.parseInt(String((item as KeywordItem).searchVolume))
                  : undefined;

                const competition = (item as KeywordItem).competition
                  ? COMPETITION_LEVELS.includes(
                      item.competition as CompetitionLevel,
                    )
                    ? (item as CompetitionLevel)
                    : DEFAULT_COMPETITION
                  : undefined;

                const analysis = await KeywordIntelligence.analyzeBatch(
                  keywordArray as string[],
                );

                return {
                  product: String(item.product),
                  keywords: keywordArray || [],
                  searchVolume,
                  competition,
                  analysis,
                  suggestions: analysis
                    .map((a) => a.keyword)
                    .slice(0, MAX_SUGGESTIONS),
                };
              }),
          );

          if (processedData.length === 0) {
            setError(
              "No valid data found in CSV. Please ensure your CSV has columns: product, keywords",
            );
            toast({
              title: "CSV Error",
              description:
                "No valid data found in CSV. Please ensure your CSV has columns: product, keywords",
              variant: "destructive",
            });
            setIsLoading(false);
            return;
          }

          setProducts(processedData);
          toast({
            title: "CSV Processed",
            description: `Loaded ${processedData.length} product keywords`,
            variant: "default",
          });
          setIsLoading(false);
        } catch (err) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : "Failed to process CSV data. Please ensure your CSV has columns: product, keywords";
          setError(errorMessage);
          toast({
            title: "Processing Failed",
            description: errorMessage,
            variant: "destructive",
          });
          setIsLoading(false);
        }
      },
      error: (error) => {
        setError(`Error parsing CSV file: ${error.message}`);
        toast({
          title: "CSV Error",
          description: `Error parsing CSV file: ${error.message}`,
          variant: "destructive",
        });
        setIsLoading(false);
      },
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setError("Please enter a search term");
      toast({
        title: "Input Error",
        description: "Please enter a search term",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      const newProduct: KeywordData = {
        product: searchTerm,
        keywords: [searchTerm],
        suggestions: [
          `best ${searchTerm}`,
          `${searchTerm} for amazon`,
          `premium ${searchTerm}`,
          `affordable ${searchTerm}`,
          `${searchTerm} with free shipping`,
        ].slice(0, MAX_SUGGESTIONS),
        searchVolume: Math.floor(Math.random() * 100000),
        competition:
          COMPETITION_LEVELS[
            Math.floor(Math.random() * COMPETITION_LEVELS.length)
          ],
      };

      setProducts([...products, newProduct]);
      setSearchTerm("");
      setIsLoading(false);
    }, 1500);
  };

  const handleExport = () => {
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
      keywords: product.keywords.join(", "),
      suggestions: product.suggestions?.join(", "),
      searchVolume: product.searchVolume || "",
      competition: product.competition || "",
    }));

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "keyword_analysis.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Export Success",
      description: "Keyword analysis exported successfully",
      variant: "default",
    });
  };

  const clearData = () => {
    setProducts([]);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast({
      title: "Data Cleared",
      description: "Keyword data cleared",
      variant: "default",
    });
  };

  return (
    <ToolContainer
      title="Keyword Analyzer"
      description="Analyze keywords for your products, get search volume, competition, and suggestions."
      isLoading={isLoading}
      error={error}
    >
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-700 dark:text-blue-300">
          <p className="font-medium">CSV Format Requirements:</p>
          <p>
            Your CSV file should have the following columns:{" "}
            <code>product</code>, <code>keywords</code> (comma-separated)
          </p>
          <p>
            Optional columns: <code>searchVolume</code>,{" "}
            <code>competition</code> (Low, Medium, High)
          </p>
          <p className="mt-1">
            Example: <code>product,keywords,searchVolume,competition</code>
            <br />
            <code>
              Wireless Earbuds,"bluetooth earbuds, wireless headphones,
              earphones",135000,High
            </code>
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
                  Upload a CSV file with your product and keyword data
                </p>
              </div>
              <div className="w-full">
                <label className="relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/40 bg-background p-6 text-center hover:bg-primary/5">
                  <FileText className="mb-2 h-8 w-8 text-primary/60" />
                  <span className="text-sm font-medium">
                    Click to upload CSV
                  </span>
                  <span className="text-xs text-muted-foreground">
                    (CSV with columns: product, keywords)
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
                <div className="flex justify-center mt-4">
                  <SampleCsvButton
                    dataType="keyword"
                    fileName="sample-keyword-analyzer.csv"
                  />
                </div>
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
              <h3 className="text-lg font-medium">Search for Keywords</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">
                    Product or Keyword
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={searchTerm}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSearchTerm(e.target.value)
                      }
                      placeholder="Enter product or keyword"
                    />
                    <Button onClick={handleSearch} disabled={isLoading}>
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {products.length > 0 && (
        <>
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export Keywords
            </Button>
          </div>
          <div className="space-y-4">
            {products.map((product, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-semibold">{product.product}</h3>
                    {product.searchVolume && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          Search Volume:
                        </span>
                        <Badge variant="outline">
                          {product.searchVolume.toLocaleString()}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Competition:
                        </span>
                        <Badge
                          variant={
                            product.competition === "High"
                              ? "destructive"
                              : product.competition === "Medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {product.competition}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h4 className="mb-2 text-sm font-medium">
                        Current Keywords
                      </h4>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {product.keywords.map((keyword, i) => (
                          <Badge key={i} variant="outline">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                      {product.searchVolume && (
                        <div className="h-80 w-full">
                          <h4 className="mb-2 text-sm font-medium">
                            Keyword Performance
                          </h4>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={[
                                {
                                  name: product.product,
                                  "Search Volume": product.searchVolume,
                                  Competition:
                                    product.competition === "Low"
                                      ? 1
                                      : product.competition === "Medium"
                                        ? 2
                                        : product.competition === "High"
                                          ? 3
                                          : 0, // Map competition to numerical value
                                },
                              ]}
                              margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis
                                yAxisId="left"
                                orientation="left"
                                stroke="#8884d8"
                              />
                              <YAxis
                                yAxisId="right"
                                orientation="right"
                                stroke="#82ca9d"
                              />
                              <Tooltip />
                              <Legend />
                              <Bar
                                yAxisId="left"
                                dataKey="Search Volume"
                                fill="#8884d8"
                              />
                              <Bar
                                yAxisId="right"
                                dataKey="Competition"
                                fill="#82ca9d"
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                    {product.suggestions && (
                      <div>
                        <h4 className="mb-2 text-sm font-medium">
                          Suggested Keywords
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {product.suggestions.map((keyword, i) => (
                            <Badge key={i} variant="secondary">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </ToolContainer>
  );
}
