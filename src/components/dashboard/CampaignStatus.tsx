import React from "react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Campaign {
  id: string;
  name: string;
  status: "active" | "paused" | "warning";
  budget: number;
  spent: number;
}

interface CampaignStatusProps {
  campaigns: Campaign[];
}

const CampaignStatus: React.FC<CampaignStatusProps> = ({ campaigns }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-primary" />;
      case "paused":
        return <XCircle className="h-4 w-4 text-secondary" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-accent" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "paused":
        return "Paused";
      case "warning":
        return "Warning";
      default:
        return "";
    }
  };

  return (
    <div className="analytics-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Campaign Status</h3>
        <button className="text-xs text-primary hover:underline">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="p-3 border border-border rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                  <span className="text-sm font-bold">
                    {campaign.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-medium">{campaign.name}</h4>
                  <div className="flex items-center gap-1 mt-1">
                    {getStatusIcon(campaign.status)}
                    <span
                      className={cn(
                        "text-xs",
                        campaign.status === "active"
                          ? "text-primary"
                          : campaign.status === "paused"
                            ? "text-secondary"
                            : "text-accent",
                      )}
                    >
                      {getStatusText(campaign.status)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-medium">
                  ${campaign.spent.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  of ${campaign.budget.toLocaleString()} budget
                </p>
              </div>
            </div>

            <div className="mt-3">
              <div className="h-2 bg-muted rounded-full">
                <div
                  className={cn(
                    "h-full rounded-full",
                    campaign.status === "active"
                      ? "bg-primary"
                      : campaign.status === "paused"
                        ? "bg-secondary"
                        : "bg-accent",
                  )}
                  style={{
                    width: `${Math.min(100, (campaign.spent / campaign.budget) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignStatus;
