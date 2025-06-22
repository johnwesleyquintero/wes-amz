import React from "react";
import { ToolContainer } from "./shared/ToolContainer";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

const KeywordIndexChecker: React.FC = () => {
  return (
    <ToolContainer
      title="Keyword Index Checker"
      description="Input your ASIN and a list of keywords to check if your product appears in the search results for each term."
    >
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="asin" className="text-right">
            ASIN
          </Label>
          <Input id="asin" defaultValue="B0XXXXXXX" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="keywords" className="text-right">
            Keywords (comma-separated)
          </Label>
          <Textarea
            id="keywords"
            placeholder="keyword1, keyword2, keyword3"
            className="col-span-3"
          />
        </div>
      </div>
      <Button className="w-full">Check Index</Button>
    </ToolContainer>
  );
};

export default KeywordIndexChecker;
