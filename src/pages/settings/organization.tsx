import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ApiError,
  AuthenticationError,
  ServerError,
  AuthorizationError,
} from "@/lib/api-errors";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

interface Organization {
  id: string;
  name: string;
  owner_id: string;
}

const formSchema = z.object({
  organizationName: z.string().min(1, { message: "Organization name is required." }),
});

/**
 * OrganizationSettings component allows Enterprise tier users to view and update their organization's details.
 * It fetches organization data from Supabase and provides a form for editing the organization name.
 */
const OrganizationSettings = () => {
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: "",
    },
  });

  const { isSubmitting } = form.formState;

  /**
   * Fetches the organization details for the current user's Enterprise organization.
   */
  const getOrganizationDetails = useCallback(async () => {
    try {
      setLoading(true);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        const statusCode =
          userError &&
          typeof userError === "object" &&
          "status" in userError &&
          typeof userError.status === "number"
            ? userError.status
            : 401;
        throw new AuthenticationError(
          "Failed to get user session.",
          statusCode,
          userError,
        );
      }

      if (user) {
        // First, get the user's profile to find their organization_id and tier
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("organization_id, tier")
          .eq("id", user.id)
          .single();

        if (profileError) {
          const statusCode =
            profileError &&
            typeof profileError === "object" &&
            "status" in profileError &&
            typeof profileError.status === "number"
              ? profileError.status
              : 500;
          throw new ServerError(
            "Failed to fetch user profile for organization check.",
            statusCode,
            profileError,
          );
        }

        if (
          profileData &&
          profileData.tier === "Enterprise" &&
          profileData.organization_id
        ) {
          // Then, fetch organization details using the organization_id
          const {
            data: orgData,
            error: orgError,
            status: orgStatus,
          } = await supabase
            .from("organizations")
            .select(`id, name, owner_id`)
            .eq("id", profileData.organization_id)
            .single();

          if (orgError && orgStatus !== 406) {
            const statusCode =
              orgError &&
              typeof orgError === "object" &&
              "status" in orgError &&
              typeof orgError.status === "number"
                ? orgError.status
                : 500;
            throw new ServerError(
              "Failed to fetch organization details.",
              statusCode,
              orgError,
            );
          }

          if (orgData) {
            setOrganization(orgData);
            form.reset({ organizationName: orgData.name });
          } else {
            // This case might indicate a data inconsistency or permission issue
            throw new AuthorizationError(
              "Organization not found or you do not have access.",
              403,
            );
          }
        } else {
          throw new AuthorizationError(
            "You are not part of an Enterprise organization.",
            403,
          );
        }
      }
    } catch (error) {
      const apiError =
        error instanceof ApiError
          ? error
          : new ApiError(
              "An unexpected error occurred.",
              undefined,
              undefined,
              error,
            );
      toast({
        title: `Error fetching organization details: ${apiError.errorType || "Unknown"}`,
        description: apiError.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [setLoading, setOrganization, toast, form]);

  useEffect(() => {
    getOrganizationDetails();
  }, [getOrganizationDetails]);

  /**
   * Handles the submission of the organization update form.
   * Updates the organization's name in Supabase.
   */
  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      setLoading(true);

      try {
        if (!organization) {
          throw new Error("No organization to update."); // Should not happen if fetched correctly
        }

        const updates = {
          id: organization.id,
          name: values.organizationName,
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase.from("organizations").upsert(updates);

        if (error) {
          const statusCode =
            error &&
            typeof error === "object" &&
            "status" in error &&
            typeof error.status === "number"
              ? error.status
              : 500;
          throw new ServerError(
            "Failed to update organization.",
            statusCode,
            error,
          );
        }

        toast({
          title: "Organization Updated",
          description: "Organization details have been successfully updated.",
        });
        getOrganizationDetails(); // Re-fetch to ensure latest data
      } catch (error) {
        const apiError =
          error instanceof ApiError
            ? error
            : new ApiError(
                "An unexpected error occurred during update.",
                undefined,
                undefined,
                error,
              );
        toast({
          title: `Error updating organization: ${apiError.errorType || "Unknown"}`,
          description: apiError.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [organization, setLoading, toast, getOrganizationDetails],
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p>Loading organization settings...</p>
      </div>
    );
  }

  if (!organization) {
    // This case is now handled by the error boundary or the catch block
    // but keeping a basic render for clarity if state is somehow null
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Organization Settings</CardTitle>
            <CardDescription>Access Denied</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              You do not have access to organization settings or are not part of
              an Enterprise tier organization.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Organization Settings</CardTitle>
          <CardDescription>Manage your organization's details.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="organizationName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Your Organization Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-2">
                <FormLabel htmlFor="billing-info">
                  Billing Information (Placeholder)
                </FormLabel>
                <Input
                  id="billing-info"
                  type="text"
                  placeholder="Integration with payment gateway (e.g., Stripe)"
                  disabled
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Organization Settings"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationSettings;
