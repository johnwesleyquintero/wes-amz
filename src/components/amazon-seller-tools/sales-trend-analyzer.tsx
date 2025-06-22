import React from "react";
import { ToolContainer } from "./shared/ToolContainer";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

const SalesTrendAnalyzer: React.FC = () => {
  return (
    <ToolContainer
      title="Sales Trend Analyzer"
      description="Input any ASIN and see its historical sales and price data visualized over time."
    >
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="asin" className="text-right">
            ASIN
          </Label>
          <Input id="asin" defaultValue="B0XXXXXXX" className="col-span-3" />
        </div>
      </div>
      <Button className="w-full">Analyze Sales Trend</Button>
    </ToolContainer>
  );
};

export default SalesTrendAnalyzer;
