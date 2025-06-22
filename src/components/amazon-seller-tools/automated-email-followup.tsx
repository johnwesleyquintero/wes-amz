import React from "react";
import { ToolContainer } from "./shared/ToolContainer";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

const AutomatedEmailFollowup: React.FC = () => {
  return (
    <ToolContainer
      title="Automated Email Follow-up"
      description="Create automated email campaigns to buyers to request product reviews or seller feedback."
    >
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="campaignName" className="text-right">
            Campaign Name
          </Label>
          <Input
            id="campaignName"
            defaultValue="Review Request"
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="emailSubject" className="text-right">
            Email Subject
          </Label>
          <Input
            id="emailSubject"
            defaultValue="How was your recent purchase?"
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="emailBody" className="text-right">
            Email Body
          </Label>
          <Textarea
            id="emailBody"
            placeholder="Hi [Customer Name], we hope you're enjoying your product..."
            className="col-span-3"
          />
        </div>
      </div>
      <Button className="w-full">Create Campaign</Button>
    </ToolContainer>
  );
};

export default AutomatedEmailFollowup;
