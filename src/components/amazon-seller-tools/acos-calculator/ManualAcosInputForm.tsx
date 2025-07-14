"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calculator } from "lucide-react";
import { ManualCampaignInput } from "./types";

interface ManualAcosInputFormProps {
  manualCampaign: ManualCampaignInput;
  manualErrors: { campaign: string; adSpend: string; sales: string };
  setManualCampaign: React.Dispatch<React.SetStateAction<ManualCampaignInput>>;
  setManualErrors: React.Dispatch<
    React.SetStateAction<{ campaign: string; adSpend: string; sales: string }>
  >;
  handleManualCalculate: () => void;
}

export default function ManualAcosInputForm({
  manualCampaign,
  manualErrors,
  setManualCampaign,
  setManualErrors,
  handleManualCalculate,
}: ManualAcosInputFormProps) {
  return (
    <Card className="flex-1">
      <CardContent className="p-4">
        <div className="space-y-4 p-2">
          <h3 className="text-lg font-medium">Manual Calculator</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Campaign Name</label>
              <Input
                value={manualCampaign.campaign}
                onChange={(e) => {
                  setManualCampaign({
                    ...manualCampaign,
                    campaign: e.target.value,
                  });
                  setManualErrors((prev) => ({ ...prev, campaign: "" }));
                }}
                placeholder="Enter campaign name"
                className={manualErrors.campaign ? "border-destructive" : ""}
              />
              {manualErrors.campaign && (
                <p className="text-destructive text-xs mt-1">
                  {manualErrors.campaign}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">Ad Spend ($)</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={manualCampaign.adSpend}
                onChange={(e) => {
                  setManualCampaign({
                    ...manualCampaign,
                    adSpend: e.target.value,
                  });
                  setManualErrors((prev) => ({ ...prev, adSpend: "" }));
                }}
                placeholder="Enter ad spend amount"
                className={manualErrors.adSpend ? "border-destructive" : ""}
              />
              {manualErrors.adSpend && (
                <p className="text-destructive text-xs mt-1">
                  {manualErrors.adSpend}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">Sales ($)</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={manualCampaign.sales}
                onChange={(e) => {
                  setManualCampaign({
                    ...manualCampaign,
                    sales: e.target.value,
                  });
                  setManualErrors((prev) => ({ ...prev, sales: "" }));
                }}
                placeholder="Enter sales amount"
                className={manualErrors.sales ? "border-destructive" : ""}
              />
              {manualErrors.sales && (
                <p className="text-destructive text-xs mt-1">
                  {manualErrors.sales}
                </p>
              )}
            </div>
            <Button onClick={handleManualCalculate} className="w-full">
              <Calculator className="mr-2 h-4 w-4" />
              Calculate ACoS
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
