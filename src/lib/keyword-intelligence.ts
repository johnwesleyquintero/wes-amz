import { ProhibitedKeywords } from "./prohibited-keywords";

interface KeywordAnalysis {
  keyword: string;
  isProhibited: boolean;
  score: number;
  confidence: number;
  matchType: "exact" | "fuzzy" | "pattern";
  reason?: string;
}

interface KeywordPattern {
  pattern: RegExp;
  category: string;
  score: number;
}

export class KeywordIntelligence {
  static async analyzeBatch(keywords: string[]): Promise<KeywordAnalysis[]> {
    return Promise.all(keywords.map((keyword) => this.analyzeKeyword(keyword)));
  }

  private static patterns: KeywordPattern[] = [
    // Pattern for superlatives or promotional claims
    {
      pattern: /\b(best|top|#1|number\s*one|\d+%\s*off)\b/i,
      category: "superlative",
      score: 0.8, // High score due to strong promotional nature
    },
    // Pattern for guarantees or promises
    {
      pattern: /\b(guarantee|warranty|lifetime|money\s*back)\b/i,
      category: "promise",
      score: 0.7, // Moderate score, often used in marketing
    },
    // Pattern for medical claims (e.g., for health products)
    {
      pattern: /\b(cure|treat|prevent|heal)\b/i,
      category: "medical",
      score: 0.9, // Very high score due to strict regulations on medical claims
    },
  ];

  /**
   * Calculates the Levenshtein distance similarity between two strings.
   * Returns a value between 0 and 1, where 1 means identical strings.
   * @param str1 The first string.
   * @param str2 The second string.
   * @returns The similarity score.
   */
  private static calculateSimilarity(str1: string, str2: string): number {
    const len1 = str1.length;
    const len2 = str2.length;
    // Initialize a matrix to store distances
    const matrix: number[][] = Array(len1 + 1)
      .fill(null)
      .map(() => Array(len2 + 1).fill(0));

    // Populate the first row and column
    for (let i = 0; i <= len1; i++) matrix[i][0] = i;
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;

    // Fill the matrix
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1; // Cost is 0 if characters are same, 1 otherwise
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // Deletion
          matrix[i][j - 1] + 1, // Insertion
          matrix[i - 1][j - 1] + cost, // Substitution
        );
      }
    }

    // Calculate similarity from the Levenshtein distance
    return 1 - matrix[len1][len2] / Math.max(len1, len2);
  }

  /**
   * Analyzes a single keyword for its prohibited status, score, and confidence.
   * Checks for exact matches, fuzzy matches (similarity), and pattern matches.
   * @param keyword The keyword to analyze.
   * @returns A Promise that resolves to a KeywordAnalysis object.
   */
  static async analyzeKeyword(keyword: string): Promise<KeywordAnalysis> {
    const prohibitedKeywords = await ProhibitedKeywords.getAll();
    const normalizedKeyword = keyword.toLowerCase().trim();

    // 1. Check for exact matches in the prohibited keywords list
    if (prohibitedKeywords.includes(normalizedKeyword)) {
      return {
        keyword,
        isProhibited: true,
        score: 1.0, // Highest score for exact match
        confidence: 1.0, // Highest confidence
        matchType: "exact",
        reason: "Exact match in prohibited keywords database",
      };
    }

    // 2. Check for fuzzy matches using Levenshtein similarity
    const fuzzyMatches = prohibitedKeywords.map((pk) => ({
      keyword: pk,
      similarity: this.calculateSimilarity(normalizedKeyword, pk.toLowerCase()),
    }));

    // Find the best fuzzy match (highest similarity)
    const bestFuzzyMatch = fuzzyMatches.reduce(
      (best, current) =>
        current.similarity > best.similarity ? current : best,
      { keyword: "", similarity: 0 },
    );

    // If similarity is above a certain threshold (e.g., 0.85), consider it a fuzzy match
    if (bestFuzzyMatch.similarity > 0.85) {
      return {
        keyword,
        isProhibited: true,
        score: bestFuzzyMatch.similarity,
        confidence: bestFuzzyMatch.similarity, // Confidence based on similarity
        matchType: "fuzzy",
        reason: `Similar to prohibited keyword: ${bestFuzzyMatch.keyword}`,
      };
    }

    // 3. Check for pattern matches against predefined regex patterns
    for (const pattern of this.patterns) {
      if (pattern.pattern.test(normalizedKeyword)) {
        return {
          keyword,
          isProhibited: true,
          score: pattern.score,
          confidence: pattern.score, // Confidence based on pattern's defined score
          matchType: "pattern",
          reason: `Matches ${pattern.category} pattern`,
        };
      }
    }

    // If no exact, fuzzy, or pattern match is found, the keyword is not prohibited
    return {
      keyword,
      isProhibited: false,
      score: 0,
      confidence: 1.0, // High confidence as no prohibition was found
      matchType: "exact", // Default to exact as it's not a fuzzy/pattern match
    };
  }
}
