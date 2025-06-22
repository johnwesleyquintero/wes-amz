import React from "react";
import { ToolContainer } from "./shared/ToolContainer";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

const OpportunityFinder: React.FC = () => {
  return (
    <ToolContainer
      title="Opportunity Finder"
      description="Scan the Amazon catalog using advanced filters to find profitable products."
    >
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="minRevenue" className="text-right">
            Min Monthly Revenue
          </Label>
          <Input
            id="minRevenue"
            type="number"
            defaultValue="5000"
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="maxPrice" className="text-right">
            Max Price
          </Label>
          <Input
            id="maxPrice"
            type="number"
            defaultValue="50"
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="minReviews" className="text-right">
            Min Reviews
          </Label>
          <Input
            id="minReviews"
            type="number"
            defaultValue="100"
            className="col-span-3"
          />
        </div>
      </div>
      <Button className="w-full">Search Opportunities</Button>
    </ToolContainer>
  );
};

export default OpportunityFinder;
