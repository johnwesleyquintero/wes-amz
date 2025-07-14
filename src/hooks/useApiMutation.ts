import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api-errors";

// Define a more specific error structure that might come from an API
interface GenericApiError {
  message?: string;
  errorType?: string;
  statusCode?: number;
  details?: unknown; // Changed 'any' to 'unknown' for better type safety
}

interface UseApiMutationOptions<TData, TError = ApiError | GenericApiError> {
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successToastTitle?: string;
  successToastDescription?: string;
  errorToastTitle?: string;
}

export function useApiMutation<
  TData = unknown,
  TError = ApiError | GenericApiError,
>(
  apiCall: () => Promise<TData>,
  options: UseApiMutationOptions<TData, TError> = {},
) {
  const { toast } = useToast();

  const mutation = useMutation<TData, TError>({
    mutationFn: apiCall,
    onSuccess: (data) => {
      if (options.onSuccess) {
        options.onSuccess(data);
      }
      if (options.showSuccessToast) {
        toast({
          title: options.successToastTitle || "Success",
          description:
            options.successToastDescription ||
            "Operation completed successfully",
        });
      }
    },
    onError: (error) => {
      let errorMessage = "An unexpected error occurred";
      let errorType = "Unknown";

      if (error instanceof ApiError) {
        errorMessage = error.message;
        errorType = error.errorType || "Unknown";
      } else if (typeof error === "object" && error !== null) {
        // Attempt to extract info from a generic object error
        const genericError = error as GenericApiError;
        errorMessage = genericError.message || "An unexpected error occurred";
        errorType = genericError.errorType || "Unknown";
      } else if (typeof error === "string") {
        // Handle cases where the error is just a string
        errorMessage = error;
        errorType = "Error";
      }

      if (options.onError) {
        options.onError(error);
      }

      if (options.showErrorToast !== false) {
        toast({
          title: options.errorToastTitle || `Error: ${errorType}`,
          description: errorMessage,
          variant: "destructive",
        });
      }
    },
  });

  return {
    ...mutation,
    execute: mutation.mutate, // Alias mutate for consistency with previous hook
    reset: mutation.reset,
    data: mutation.data ?? null,
    error: mutation.error ?? null,
    loading: mutation.isPending,
  };
}
