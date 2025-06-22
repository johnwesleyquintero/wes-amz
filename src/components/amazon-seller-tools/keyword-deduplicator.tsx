"use client";

import type React from "react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  FileText,
  AlertCircle,
  Download,
  Filter,
  Info,
} from "lucide-react";
import Papa from "papaparse";
import SampleCsvButton from "./sample-csv-button";
import { useToast } from "@/hooks/use-toast";

type KeywordData = {
  product: string;
  originalKeywords: string[];
  cleanedKeywords: string[];
  duplicatesRemoved: number;
};

export default function KeywordDeduplicator() {
  const { toast } = useToast();
  const [products, setProducts] = useState<KeywordData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualKeywords, setManualKeywords] = useState("");
  const [manualProduct, setManualProduct] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  interface RawKeywordData {
    product: string;
    keywords: string | string[];
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    Papa.parse<RawKeywordData>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
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
          const processedData: KeywordData[] = result.data
            .filter((item) => item.product && item.keywords)
            .map((item) => {
              const originalKeywords =
                typeof item.keywords === "string"
                  ? item.keywords.split(",").map((k: string) => k.trim())
                  : Array.isArray(item.keywords)
                    ? item.keywords.map((k: string) => k.trim())
                    : [];

              const cleanedKeywords = [...new Set(originalKeywords)];

              return {
                product: String(item.product),
                originalKeywords,
                cleanedKeywords,
                duplicatesRemoved:
                  originalKeywords.length - cleanedKeywords.length,
              };
            });

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

  const handleManualProcess = () => {
    if (!manualKeywords.trim()) {
      setError("Please enter keywords to process");
      toast({
        title: "Input Error",
        description: "Please enter keywords to process",
        variant: "destructive",
      });
      return;
    }

    const originalKeywords = manualKeywords.split(",").map((k) => k.trim());
    const cleanedKeywords = [...new Set(originalKeywords)];

    const result: KeywordData = {
      product: manualProduct || "Manual Entry",
      originalKeywords,
      cleanedKeywords,
      duplicatesRemoved: originalKeywords.length - cleanedKeywords.length,
    };

    setProducts([...products, result]);
    setManualKeywords("");
    setManualProduct("");
    setError(null);
    toast({
      title: "Keywords Processed",
      description: "Keywords deduplicated successfully",
      variant: "default",
    });
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
      originalKeywords: product.originalKeywords.join(", "),
      cleanedKeywords: product.cleanedKeywords.join(", "),
      duplicatesRemoved: product.duplicatesRemoved,
    }));

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "deduplicated_keywords.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Export Success",
      description: "Keywords exported successfully",
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
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-700 dark:text-blue-300">
          <p className="font-medium">CSV Format Requirements:</p>
          <p>
            Your CSV file should have the following columns:{" "}
            <code>product</code>, <code>keywords</code> (comma-separated)
          </p>
          <p className="mt-1">
            Example: <code>product,keywords</code>
            <br />
            <code>
              Wireless Earbuds,&quot;bluetooth earbuds, wireless earbuds,
              earbuds bluetooth, wireless headphones, bluetooth earbuds&quot;
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
                  Upload a CSV file with your product keywords
                </p>
              </div>
              <div className="w-full">
                <label className="relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/40 bg-background p-6 text-center hover:bg-primary/5">
                  <FileText className="mb-2 h-8 w-8 text-primary/60" />
                  <span className="text-sm font-medium">
                    Click to upload CSV
                  </span>
                  <span className="text-xs text-muted-foreground">
                    (CSV with product name and comma-separated keywords)
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
                    dataType="keyword-dedup"
                    fileName="sample-keyword-deduplicator.csv"
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
              <h3 className="text-lg font-medium">Manual Entry</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">
                    Product Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={manualProduct}
                    onChange={(e) => setManualProduct(e.target.value)}
                    placeholder="Enter product name"
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Keywords</label>
                  <Textarea
                    value={manualKeywords}
                    onChange={(e) => setManualKeywords(e.target.value)}
                    placeholder="Enter comma-separated keywords"
                    rows={4}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Enter keywords separated by commas
                  </p>
                </div>
                <Button onClick={handleManualProcess} className="w-full">
                  <Filter className="mr-2 h-4 w-4" />
                  Remove Duplicates
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
            Processing your keywords...
          </p>
        </div>
      )}

      {products.length > 0 && (
        <>
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export Cleaned Keywords
            </Button>
          </div>

          <div className="space-y-4">
            {products.map((product, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-medium">{product.product}</h3>
                    <Badge
                      variant={
                        product.duplicatesRemoved > 0 ? "default" : "secondary"
                      }
                    >
                      {product.duplicatesRemoved} duplicates removed
                    </Badge>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="mb-2 text-sm font-medium">
                        Original Keywords ({product.originalKeywords.length})
                      </h4>
                      <div className="rounded-lg border p-3">
                        <div className="flex flex-wrap gap-2">
                          {product.originalKeywords.map((keyword, i) => (
                            <Badge key={i} variant="outline">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-2 text-sm font-medium">
                        Cleaned Keywords ({product.cleanedKeywords.length})
                      </h4>
                      <div className="rounded-lg border p-3">
                        <div className="flex flex-wrap gap-2">
                          {product.cleanedKeywords.map((keyword, i) => (
                            <Badge key={i} variant="secondary">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
