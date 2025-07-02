import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ErrorDisplayProps {
  error: string;
  details?: string;
  onRetry?: () => void;
  className?: string;
  supportEmail?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  details,
  onRetry,
  className,
  supportEmail,
}) => {
  return (
    <Alert variant="destructive" className={className}>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex flex-col items-start justify-start">
        <span>{error}</span>
        {details && <p className="text-sm mt-1">{details}</p>}
        <div className="flex items-center justify-between w-full mt-2">
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="ml-2"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          )}
          {supportEmail && (
            <Button variant="secondary" size="sm" asChild className="ml-2">
              <a href={`mailto:${supportEmail}`}>Contact Support</a>
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ErrorDisplay;
