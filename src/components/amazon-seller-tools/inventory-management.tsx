import React from "react";
import { ToolContainer } from "./shared/ToolContainer";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

const InventoryManagement: React.FC = () => {
  return (
    <ToolContainer
      title="Inventory Management & Forecasting"
      description="Track inventory levels, calculate sales velocity, and forecast stock-out dates."
    >
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="asin" className="text-right">
            ASIN
          </Label>
          <Input id="asin" defaultValue="B0XXXXXXX" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="currentStock" className="text-right">
            Current Stock
          </Label>
          <Input
            id="currentStock"
            type="number"
            defaultValue="1000"
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="avgDailySales" className="text-right">
            Avg Daily Sales
          </Label>
          <Input
            id="avgDailySales"
            type="number"
            defaultValue="50"
            className="col-span-3"
          />
        </div>
      </div>
      <Button className="w-full">Calculate Forecast</Button>
    </ToolContainer>
  );
};

export default InventoryManagement;
