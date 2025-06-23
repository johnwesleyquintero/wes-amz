import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Organization {
  id: string;
  name: string;
  owner_id: string;
}

const OrganizationSettings = () => {
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [organizationName, setOrganizationName] = useState("");
  const { toast } = useToast();

  const getOrganizationDetails = useCallback(async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // First, get the user's profile to find their organization_id and tier
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("organization_id, tier")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;

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
            throw orgError;
          }

          if (orgData) {
            setOrganization(orgData);
            setOrganizationName(orgData.name);
          } else {
            toast({
              title: "Error",
              description: "Organization not found or you do not have access.",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Access Denied",
            description: "You are not part of an Enterprise organization.",
            variant: "destructive",
          });
          // Optionally redirect non-enterprise users
          // navigate('/');
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Error fetching organization details",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [setLoading, setOrganization, setOrganizationName, toast]);

  useEffect(() => {
    getOrganizationDetails();
  }, [getOrganizationDetails]);

  const updateOrganization = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setLoading(true);

      try {
        if (!organization) {
          toast({
            title: "Error",
            description: "No organization to update.",
            variant: "destructive",
          });
          return;
        }

        const updates = {
          id: organization.id,
          name: organizationName,
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase.from("organizations").upsert(updates);

        if (error) throw error;

        toast({
          title: "Organization Updated",
          description: "Organization details have been successfully updated.",
        });
        getOrganizationDetails(); // Re-fetch to ensure latest data
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        toast({
          title: "Error updating organization",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [organization, organizationName, setLoading, toast],
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p>Loading organization settings...</p>
      </div>
    );
  }

  if (!organization) {
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
          <form onSubmit={updateOrganization} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="organization-name">Organization Name</Label>
              <Input
                id="organization-name"
                type="text"
                placeholder="Your Organization Name"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="billing-info">
                Billing Information (Placeholder)
              </Label>
              <Input
                id="billing-info"
                type="text"
                placeholder="Integration with payment gateway (e.g., Stripe)"
                disabled
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Save Organization Settings"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationSettings;
