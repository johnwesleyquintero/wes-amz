"use client";

import type React from "react";

import { useState } from "react";
import Papa from "papaparse";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, AlertCircle, Save, Eye } from "lucide-react";
import { ApiError, ClientError } from "@/lib/api-errors";

type ProductDescription = {
  product: string;
  asin?: string;
  description: string;
  characterCount: number;
  keywordCount: number;
  score?: number;
};

export default function DescriptionEditor() {
  const { toast } = useToast();
  const [products, setProducts] = useState<ProductDescription[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [targetKeywords, setTargetKeywords] = useState<string[]>([]);
  const [activeProduct, setActiveProduct] = useState<ProductDescription | null>(
    null,
  );
  const [showPreview, setShowPreview] = useState(false);
  const [newProduct, setNewProduct] = useState({
    product: "",
    asin: "",
    description: "",
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          interface ProductData {
            product: string;
            asin?: string;
            description: string;
          }

          const requiredColumns = ["product", "description"];
          const missingColumns = requiredColumns.filter((col) =>
            results.meta.fields ? !results.meta.fields.includes(col) : true,
          );
          if (missingColumns.length > 0) {
            throw new ClientError(
              `Missing required columns: ${missingColumns.join(", ")}`,
              400,
            );
          }

          const processedData: ProductDescription[] = results.data.map(
            (row: unknown) => {
              const productRow = row as ProductData;
              return {
                product: productRow.product,
                asin: productRow.asin || "",
                description: productRow.description,
                characterCount: productRow.description?.length || 0,
                keywordCount: (productRow.description?.match(/\b\w+\b/g) || [])
                  .length,
              };
            },
          );

          setProducts(processedData);
          setError(null);
          toast({
            title: "CSV Processed",
            description: `Loaded ${processedData.length} product descriptions`,
            variant: "default",
          });
        } catch (error) {
          const apiError =
            error instanceof ApiError
              ? error
              : new ClientError(
                  "An error occurred during processing.",
                  500,
                  error,
                );
          setError(apiError.message);
          toast({
            title: `Processing Failed: ${apiError.errorType || "Unknown"}`,
            description: apiError.message,
            variant: "destructive",
          });
        }
        setIsLoading(false);
      },
      error: (error) => {
        const apiError = new ClientError(
          `CSV parsing error: ${error.message}`,
          400,
          error,
        );
        setError(apiError.message);
        setIsLoading(false);
        toast({
          title: `Parsing Failed: ${apiError.errorType || "Unknown"}`,
          description: apiError.message,
          variant: "destructive",
        });
      },
    });
  };

  const handleDescriptionChange = (value: string) => {
    if (!activeProduct) return;

    const updatedProduct = {
      ...activeProduct,
      description: value,
      characterCount: value.length,
      keywordCount: countKeywords(value, targetKeywords),
      score: calculateScore(value, targetKeywords),
    };

    setActiveProduct(updatedProduct);

    // Update the product in the products array
    setProducts(
      products.map((p) =>
        p.product === activeProduct.product ? updatedProduct : p,
      ),
    );
  };

  const handleAddProduct = () => {
    if (!newProduct.product || !newProduct.description) {
      const error = new ClientError(
        "Please fill in both product name and description",
        400,
      );
      setError(error.message);
      toast({
        title: `Input Error: ${error.errorType || "Unknown"}`,
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    const productData: ProductDescription = {
      product: newProduct.product,
      asin: newProduct.asin || undefined,
      description: newProduct.description,
      characterCount: newProduct.description.length,
      keywordCount: countKeywords(newProduct.description, targetKeywords),
      score: calculateScore(newProduct.description, targetKeywords),
    };

    setProducts([...products, productData]);
    setActiveProduct(productData);
    setNewProduct({ product: "", asin: "", description: "" });
    setError(null); // Clear previous errors on successful add
  };

  const countKeywords = (text: string, targetKeywords: string[]): number => {
    // This is a simplified keyword counter
    // In a real app, you'd have a more sophisticated algorithm
    const stopWords = [
      "the",
      "a",
      "is",
      "are",
      "was",
      "were",
      "be",
      "been",
      "being",
      "have",
      "has",
      "had",
      "do",
      "does",
      "did",
      "an",
      "and",
      "but",
      "if",
      "or",
      "because",
      "as",
      "until",
      "while",
      "of",
      "at",
      "by",
      "for",
      "with",
      "about",
      "against",
      "between",
      "into",
      "through",
      "during",
      "before",
      "after",
      "above",
      "below",
      "to",
      "from",
      "up",
      "down",
      "in",
      "out",
      "on",
      "off",
      "over",
      "under",
      "again",
      "further",
      "then",
      "once",
      "here",
      "there",
      "when",
      "where",
      "why",
      "how",
      "all",
      "any",
      "both",
      "each",
      "few",
      "more",
      "most",
      "other",
      "some",
      "such",
      "no",
      "nor",
      "not",
      "only",
      "own",
      "same",
      "so",
      "than",
      "too",
      "very",
      "can",
      "will",
      "just",
    ];

    const stemWord = (word: string) => {
      word = word.replace(/ing$|ed$|s$/i, "");
      return word;
    };

    const cleanedText = text
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => !stopWords.includes(word))
      .join(" ");

    const stemmedKeywords = targetKeywords.map((keyword) =>
      stemWord(keyword.toLowerCase()),
    );

    let keywordCount = 0;
    stemmedKeywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "g");
      const matches = cleanedText.match(regex);
      keywordCount += matches ? matches.length : 0;
    });

    return keywordCount;
  };

  const calculateScore = (text: string, targetKeywords: string[]): number => {
    // This is a more sophisticated scoring algorithm
    let score = 0;

    // --- Keyword Density Score (0-30 points) ---
    const wordCount = text.split(/\s+/).length;
    const keywordCount = countKeywords(text, targetKeywords);
    const keywordDensity = wordCount > 0 ? keywordCount / wordCount : 0;

    if (keywordDensity >= 0.02 && keywordDensity <= 0.05) {
      score += 30;
    } else if (keywordDensity > 0.01 && keywordDensity < 0.06) {
      score += 20;
    } else {
      score += 10;
    }

    // --- Keyword Placement Score (0-20 points) ---
    const firstSentence = text.split(/[.!?]+/).filter(Boolean)[0] || "";
    let placementScore = 0;
    targetKeywords.forEach((keyword) => {
      if (firstSentence.toLowerCase().includes(keyword.toLowerCase())) {
        placementScore += 5;
      }
    });
    score += Math.min(placementScore, 20); // Cap at 20

    // --- Flesch-Kincaid Readability Score (0-30 points) ---
    const sentences = text.split(/[.!?]+/).filter(Boolean).length;
    const syllables = text
      .split(/\s+/)
      .reduce(
        (count, word) => count + (word.match(/[aeiouy]+/gi)?.length || 0),
        0,
      );

    const fleschKincaid =
      206.835 -
      1.015 * (wordCount / sentences) -
      84.6 * (syllables / wordCount);

    if (fleschKincaid > 90) {
      score += 30; // Very easy to read
    } else if (fleschKincaid > 70) {
      score += 20; // Easy to read
    } else if (fleschKincaid > 50) {
      score += 10; // Fairly easy to read
    }

    return Math.min(100, score);
  };

  return (
    <div className="space-y-6">
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
                  Upload a CSV file with your product descriptions
                </p>
              </div>
              <div className="w-full">
                <label className="relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/40 bg-background p-6 text-center hover:bg-primary/5">
                  <FileText className="mb-2 h-8 w-8 text-primary/60" />
                  <span className="text-sm font-medium">
                    Click to upload CSV
                  </span>
                  <span className="text-xs text-muted-foreground">
                    (CSV with product name, ASIN, and description)
                  </span>
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={isLoading}
                  />
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardContent className="p-4">
            <div className="space-y-4 p-2">
              <h3 className="text-lg font-medium">Add New Product</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Product Name</label>
                  <Input
                    value={newProduct.product}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, product: e.target.value })
                    }
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">ASIN (Optional)</label>
                  <Input
                    value={newProduct.asin}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, asin: e.target.value })
                    }
                    placeholder="Enter Amazon ASIN"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                    placeholder="Enter product description"
                    rows={3}
                  />
                </div>
                <Button onClick={handleAddProduct} className="w-full">
                  Add Product
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
            Processing your data...
          </p>
        </div>
      )}

      {products.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {products.map((product, index) => (
              <Badge
                key={index}
                variant={
                  activeProduct?.product === product.product
                    ? "default"
                    : "outline"
                }
                className="cursor-pointer"
                onClick={() => {
                  setActiveProduct(product);
                  setShowPreview(false);
                }}
              >
                {product.product}
              </Badge>
            ))}
          </div>

          {activeProduct && (
            <Card>
              <CardContent className="p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">
                      {activeProduct.product}
                    </h3>
                    {activeProduct.asin && (
                      <p className="text-sm text-muted-foreground">
                        ASIN: {activeProduct.asin}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPreview(!showPreview)}
                    >
                      {showPreview ? (
                        <>Edit</>
                      ) : (
                        <>
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </>
                      )}
                    </Button>
                    <Button size="sm">
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Target Keywords</label>
                  <Input
                    value={targetKeywords.join(", ")}
                    onChange={(e) =>
                      setTargetKeywords(
                        e.target.value
                          .split(",")
                          .map((keyword) => keyword.trim()),
                      )
                    }
                    placeholder="Enter keywords separated by commas"
                  />
                </div>

                <div className="mb-4 flex flex-wrap gap-3">
                  <div className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs">
                    <span className="font-medium">Characters:</span>
                    <span>{activeProduct.characterCount}</span>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs">
                    <span className="font-medium">Keywords:</span>
                    <span>{activeProduct.keywordCount}</span>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs">
                    <span className="font-medium">Score:</span>
                    <span
                      className={
                        (activeProduct.score || 0) >= 80
                          ? "text-green-600 dark:text-green-400"
                          : (activeProduct.score || 0) >= 50
                            ? "text-yellow-600 dark:text-yellow-400"
                            : "text-red-600 dark:text-red-400"
                      }
                    >
                      {activeProduct.score}/100
                    </span>
                  </div>
                </div>

                {showPreview ? (
                  <div className="rounded-lg border p-4">
                    <h4 className="mb-2 text-sm font-medium">Preview</h4>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      {activeProduct.description
                        .split("\n")
                        .map((paragraph, i) => (
                          <p key={i}>{paragraph}</p>
                        ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <Textarea
                      value={activeProduct.description}
                      onChange={(e) => handleDescriptionChange(e.target.value)}
                      placeholder="Enter product description"
                      rows={10}
                      className="font-mono text-sm"
                    />
                    <div className="mt-2 text-xs text-muted-foreground">
                      <span className="font-medium">Tip:</span> Aim for 1000+
                      characters with relevant keywords for better visibility.
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
{
  /* TODO: Fix this error */
}
