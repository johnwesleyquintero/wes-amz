import { useState, useCallback } from "react";
import { ApiError } from "@/lib/api-errors";
import { useToast } from "@/hooks/use-toast";

interface UseApiOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: ApiError) => void;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
}

export function useApi<T = unknown>(options: UseApiOptions = {}) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const { toast } = useToast();

  const execute = useCallback(
    async (apiCall: () => Promise<T>) => {
      try {
        setLoading(true);
        setError(null);

        const result = await apiCall();
        setData(result);

        if (options.onSuccess) {
          options.onSuccess(result);
        }

        if (options.showSuccessToast) {
          toast({
            title: "Success",
            description: "Operation completed successfully",
          });
        }

        return result;
      } catch (err) {
        const apiError =
          err instanceof ApiError
            ? err
            : new ApiError(
                "An unexpected error occurred",
                undefined,
                undefined,
                err,
              );

        setError(apiError);

        if (options.onError) {
          options.onError(apiError);
        }

        if (options.showErrorToast !== false) {
          toast({
            title: `Error: ${apiError.errorType || "Unknown"}`,
            description: apiError.message,
            variant: "destructive",
          });
        }

        throw apiError;
      } finally {
        setLoading(false);
      }
    },
    [options, toast],
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}
