import React from "react";
import { BarChart3 } from "lucide-react";

interface SearchTerm {
  term: string;
  clicks: number;
  impressions: number;
  ctr: number;
  rank: number;
}

interface TopSearchTermsProps {
  terms: SearchTerm[];
}

const TopSearchTerms: React.FC<TopSearchTermsProps> = ({ terms }) => {
  return (
    <div className="analytics-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-shakespeare" />
          <span>Top Search Terms</span>
        </h3>
        <span className="text-xs px-2 py-1 bg-muted rounded-md">
          Last 30 days
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b border-border">
            <tr>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                Term
              </th>
              <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">
                Clicks
              </th>
              <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">
                Impressions
              </th>
              <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">
                CTR
              </th>
              <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">
                Avg. Rank
              </th>
            </tr>
          </thead>
          <tbody>
            {terms.map((term, i) => (
              <tr key={i} className="border-b border-border last:border-0">
                <td className="py-3 px-4 font-medium">{term.term}</td>
                <td className="text-right py-3 px-4">
                  {term.clicks.toLocaleString()}
                </td>
                <td className="text-right py-3 px-4">
                  {term.impressions.toLocaleString()}
                </td>
                <td className="text-right py-3 px-4">{term.ctr}%</td>
                <td className="text-right py-3 px-4 text-sm">
                  {term.rank.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopSearchTerms;
