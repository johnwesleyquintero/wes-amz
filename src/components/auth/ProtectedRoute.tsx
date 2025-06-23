import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";
import { ApiError, AuthenticationError } from "@/lib/api-errors";

const ProtectedRoute: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error) {
          const statusCode =
            error &&
            typeof error === "object" &&
            "status" in error &&
            typeof error.status === "number"
              ? error.status
              : 500;
          throw new AuthenticationError(
            "Failed to get user session.",
            statusCode,
            error,
          );
        }
        setIsAuthenticated(!!user);
        if (!user) {
          toast({
            title: "Authentication Required",
            description: "Please log in to access this page.",
            variant: "destructive",
          });
        }
      } catch (error) {
        const apiError =
          error instanceof ApiError
            ? error
            : new ApiError(
                "An unexpected error occurred during authentication check.",
                undefined,
                undefined,
                error,
              );
        toast({
          title: `Authentication Error: ${apiError.errorType || "Unknown"}`,
          description: apiError.message,
          variant: "destructive",
        });
        setIsAuthenticated(false); // Assume not authenticated on error
      }
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAuthenticated(!!session);
        if (!session) {
          toast({
            title: "Logged Out",
            description: "You have been logged out.",
            variant: "default",
          });
        }
      },
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [toast]);

  if (isAuthenticated === null) {
    // Optionally render a loading spinner or null while checking auth
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" />;
};

export default ProtectedRoute;
