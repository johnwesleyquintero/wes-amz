import React from "react";
import { ToolContainer } from "./shared/ToolContainer";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";

const ListingHijackAlerts: React.FC = () => {
  return (
    <ToolContainer
      title="Listing Hijack & Change Alerts"
      description="Monitor your key listings for critical changes and receive immediate notifications."
    >
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="asin" className="text-right">
            ASIN to Monitor
          </Label>
          <Input id="asin" defaultValue="B0XXXXXXX" className="col-span-3" />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="titleChange" />
          <Label htmlFor="titleChange">
            Title, main image, or brand name changes
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="buyBoxLoss" />
          <Label htmlFor="buyBoxLoss">Loss of the Buy Box</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="negativeFeedback" />
          <Label htmlFor="negativeFeedback">
            New negative seller feedback or product reviews
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="listingSuppressed" />
          <Label htmlFor="listingSuppressed">
            Listing becoming suppressed or inactive
          </Label>
        </div>
      </div>
      <Button className="w-full">Set Alerts</Button>
    </ToolContainer>
  );
};

export default ListingHijackAlerts;
