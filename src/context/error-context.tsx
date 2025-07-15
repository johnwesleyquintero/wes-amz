"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useToast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api-errors";

interface ErrorContextType {
  error: ApiError | null;
  setError: (error: ApiError | null) => void;
  showError: (title: string, description: string, error?: unknown) => void;
  clearError: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [error, setInternalError] = useState<ApiError | null>(null);
  const { toast } = useToast();

  const setError = useCallback((err: ApiError | null) => {
    setInternalError(err);
  }, []);

  const showError = useCallback(
    (title: string, description: string, err?: unknown) => {
      const apiError =
        err instanceof ApiError
          ? err
          : new ApiError(description, undefined, undefined, err);
      setInternalError(apiError);
      toast({
        title: title,
        description: apiError.message,
        variant: "destructive",
      });
    },
    [toast],
  );

  const clearError = useCallback(() => {
    setInternalError(null);
  }, []);

  return (
    <ErrorContext.Provider value={{ error, setError, showError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
};
