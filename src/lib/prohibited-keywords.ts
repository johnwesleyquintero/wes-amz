interface ProhibitedKeywordsDB {
  keywords: string[];
  lastUpdated: string;
}

export class ProhibitedKeywords {
  private static readonly DB_PATH = "./data/prohibited-keywords.json";

  static async getAll(): Promise<string[]> {
    const response = await fetch(this.DB_PATH);
    const data: ProhibitedKeywordsDB = await response.json();
    return data.keywords;
  }

  static async add(keyword: string): Promise<void> {
    const keywords = await this.getAll();
    if (!keywords.includes(keyword)) {
      const updatedData: ProhibitedKeywordsDB = {
        keywords: [...keywords, keyword],
        lastUpdated: new Date().toISOString(),
      };
      await fetch("/api/prohibited-keywords", {
        method: "POST",
        body: JSON.stringify(updatedData),
      });
    }
  }
}
