import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Trash2, Download, Edit, Archive } from "lucide-react";
import { cn } from "@/lib/utils";

interface BulkAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary";
  onClick: (selectedIds: string[]) => void;
}

interface BulkActionToolbarProps {
  selectedItems: string[];
  totalItems: number;
  onSelectAll: (checked: boolean) => void;
  onClearSelection: () => void;
  actions: BulkAction[];
  className?: string;
}

const BulkActionToolbar: React.FC<BulkActionToolbarProps> = ({
  selectedItems,
  totalItems,
  onSelectAll,
  onClearSelection,
  actions,
  className,
}) => {
  const isAllSelected = selectedItems.length === totalItems && totalItems > 0;
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < totalItems;

  if (selectedItems.length === 0) {
    return null;
  }

  return (
    <div className={cn(
      "flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg",
      className
    )}>
      <div className="flex items-center gap-4">
        <Checkbox
          checked={isAllSelected}
          ref={(el) => {
            if (el) el.indeterminate = isIndeterminate;
          }}
          onCheckedChange={onSelectAll}
        />
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {selectedItems.length} selected
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="text-xs"
          >
            Clear selection
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {actions.map((action) => (
          <Button
            key={action.id}
            variant={action.variant || "outline"}
            size="sm"
            onClick={() => action.onClick(selectedItems)}
            className="flex items-center gap-2"
          >
            {action.icon}
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default BulkActionToolbar;