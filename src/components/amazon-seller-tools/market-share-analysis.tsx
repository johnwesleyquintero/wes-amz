import React from "react";
import { ToolContainer } from "./shared/ToolContainer";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

const MarketShareAnalysis: React.FC = () => {
  return (
    <ToolContainer
      title="Market Share Analysis"
      description="Display the top 10-20 products for a primary keyword, their estimated monthly sales, review velocity, and calculated market share percentage."
    >
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="primaryKeyword" className="text-right">
            Primary Keyword
          </Label>
          <Input
            id="primaryKeyword"
            defaultValue="product keyword"
            className="col-span-3"
          />
        </div>
      </div>
      <Button className="w-full">Analyze Market Share</Button>
    </ToolContainer>
  );
};

export default MarketShareAnalysis;
