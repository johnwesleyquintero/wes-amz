import { useQuery, UseQueryOptions, QueryKey } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api-errors";

// Define a more specific error structure that might come from an API
interface GenericApiError {
  message?: string;
  errorType?: string;
  statusCode?: number;
  details?: unknown;
}

// Define the custom options
interface CustomApiQueryOptions {
  showErrorToast?: boolean;
  errorToastTitle?: string;
}

// Define the combined options type
interface UseApiQueryOptions<TData, TError> {
  custom?: CustomApiQueryOptions;
  reactQuery?: UseQueryOptions<TData, TError, TData, QueryKey> & {
    onError?: (error: TError) => void;
  }; // Add onError explicitly
}

export function useApiQuery<TData, TError = ApiError | GenericApiError>(
  queryKey: QueryKey,
  fetcher: () => Promise<TData>,
  options?: UseApiQueryOptions<TData, TError>,
) {
  const { toast } = useToast();

  // Extract custom options and react-query options
  const customOptions = options?.custom;
  const queryResult = useQuery<TData, TError, TData, QueryKey>({
    queryKey: queryKey,
    queryFn: async () => {
      try {
        const data = await fetcher();
        return data;
      } catch (error: unknown) {
        // Catch the error here
        // Call the user's provided onError first, if it exists
        if (
          options?.reactQuery?.onError &&
          typeof options.reactQuery.onError === "function"
        ) {
          options.reactQuery.onError(error as TError); // Pass the error to user's callback
        }

        let errorMessage = "An unexpected error occurred";
        let errorType = "Unknown";

        if (error instanceof ApiError) {
          errorMessage = error.message;
          errorType = error.errorType || "Unknown";
        } else if (typeof error === "object" && error !== null) {
          const genericError = error as GenericApiError;
          errorMessage = genericError.message || "An unexpected error occurred";
          errorType = genericError.errorType || "Unknown";
        } else if (typeof error === "string") {
          errorMessage = error;
          errorType = "Error";
        }

        // Show toast if showErrorToast is true in custom options
        if (customOptions?.showErrorToast !== false) {
          // Default to true if not specified
          toast({
            title: customOptions?.errorToastTitle || `Error: ${errorType}`,
            description: errorMessage,
            variant: "destructive",
          });
        }
        throw error as TError; // Re-throw the error so useQuery can still mark it as an error
      }
    },
    ...(options?.reactQuery || {}), // Spread reactQuery options
  });
  return {
    ...queryResult,
    data: queryResult.data ?? null,
    error: queryResult.error ?? null,
    loading: queryResult.isLoading,
  };
}
