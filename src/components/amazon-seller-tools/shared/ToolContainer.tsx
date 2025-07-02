"use client";

import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle } from "lucide-react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

interface ToolContainerProps {
  title: string;
  description?: string;
  status?: string;
  progress?: number;
  error?: string | null;
  isLoading?: boolean;
  loadingMessage?: string;
  children: ReactNode;
}

export function ToolContainer({
  title,
  description,
  status,
  progress = 0,
  error = null,
  isLoading = false,
  loadingMessage,
  children,
}: ToolContainerProps) {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">{title}</h2>
          {status && (
            <Badge variant="secondary" className="ml-2">
              {status}
            </Badge>
          )}
        </div>
        {description && <p className="text-gray-600 mb-4">{description}</p>}

        {isLoading && loadingMessage && (
          <div className="mb-4 flex items-center">
            <LoadingSpinner size="sm" className="mr-2" />
            <span>{loadingMessage}</span>
          </div>
        )}

        {isLoading && !loadingMessage && (
          <div className="mb-4">
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-4 mb-4 text-red-600 bg-red-50 rounded-md">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-4">{children}</div>
      </CardContent>
    </Card>
  );
}
