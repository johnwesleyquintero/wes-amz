import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className,
}) => {
  const sizeClasses = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4",
  };

  return (
    <div
      className={cn("flex items-center justify-center space-x-1", className)}
    >
      <div
        className={cn(
          "rounded-full bg-primary animate-bounce-slow",
          sizeClasses[size],
        )}
      />
      <div
        className={cn(
          "rounded-full bg-primary animate-bounce-slow delay-150",
          sizeClasses[size],
        )}
      />
      <div
        className={cn(
          "rounded-full bg-primary animate-bounce-slow delay-300",
          sizeClasses[size],
        )}
      />
    </div>
  );
};

export default LoadingSpinner;
