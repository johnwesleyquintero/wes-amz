import React from "react";
import { ToolContainer } from "./shared/ToolContainer";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

const ReverseASINKeywordMiner: React.FC = () => {
  return (
    <ToolContainer
      title="Reverse ASIN Keyword Miner"
      description="Input one or more competitor ASINs and extract all the organic and sponsored keywords they are ranking for."
    >
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="asins" className="text-right">
            ASINs (comma-separated)
          </Label>
          <Textarea
            id="asins"
            placeholder="B0XXXXXXX, B0YYYYYYY"
            className="col-span-3"
          />
        </div>
      </div>
      <Button className="w-full">Mine Keywords</Button>
    </ToolContainer>
  );
};

export default ReverseASINKeywordMiner;
