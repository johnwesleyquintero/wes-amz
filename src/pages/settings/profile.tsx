import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ApiError, AuthenticationError, ServerError } from "@/lib/api-errors";
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

interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  tier: "Free" | "Enterprise";
}

const formSchema = z.object({
  username: z.string().optional(),
  fullName: z.string().optional(),
  avatarUrl: z.string().url({ message: "Invalid URL" }).optional().or(z.literal("")),
});

/**
 * ProfileManagement component allows users to view and update their profile information.
 * It fetches user data from Supabase and provides a form for editing username, full name, and avatar URL.
 */
const ProfileManagement = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      fullName: "",
      avatarUrl: "",
    },
  });

  const { isSubmitting } = form.formState;

  /**
   * Fetches the user's profile data from Supabase.
   */
  const getProfile = useCallback(async () => {
    try {
      setLoading(true);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw new AuthenticationError(
          "Failed to get user session.",
          userError.status,
          userError,
        );
      }

      if (user) {
        const { data, error, status } = await supabase
          .from("profiles")
          .select(`id, username, full_name, avatar_url, tier`)
          .eq("id", user.id)
          .single();

        if (error && status !== 406) {
          const statusCode =
            error &&
            typeof error === "object" &&
            "status" in error &&
            typeof error.status === "number"
              ? error.status
              : 500;
          throw new ServerError(
            "Failed to fetch profile data.",
            statusCode,
            error,
          );
        }

        if (data) {
          setProfile(data);
          form.reset({
            username: data.username || "",
            fullName: data.full_name || "",
            avatarUrl: data.avatar_url || "",
          });
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
        title: `Error fetching profile: ${apiError.errorType || "Unknown"}`,
        description: apiError.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, setLoading, setProfile, form]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  /**
   * Handles the submission of the profile update form.
   * Updates the user's profile data in Supabase.
   */
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
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
          "Failed to get user session for update.",
          statusCode,
          userError,
        );
      }

      if (user) {
        const updates = {
          id: user.id,
          username: values.username,
          full_name: values.fullName,
          avatar_url: values.avatarUrl,
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase.from("profiles").upsert(updates);

        if (error) {
          const statusCode =
            error &&
            typeof error === "object" &&
            "status" in error &&
            typeof error.status === "number"
              ? error.status
              : 500;
          throw new ServerError("Failed to update profile.", statusCode, error);
        }

        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
        getProfile(); // Re-fetch profile to ensure latest data
      }
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
        title: `Error updating profile: ${apiError.errorType || "Unknown"}`,
        description: apiError.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const currentAvatarUrl = form.watch("avatarUrl");

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Profile Management</CardTitle>
          <CardDescription>
            Manage your personal details and subscription tier.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={currentAvatarUrl || "https://github.com/shadcn.png"}
                    alt="@shadcn"
                  />
                  <AvatarFallback>
                    {form.getValues("username")
                      ? form.getValues("username")[0].toUpperCase()
                      : "U"}
                  </AvatarFallback>
                </Avatar>
                <FormField
                  control={form.control}
                  name="avatarUrl"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Avatar URL</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="https://example.com/avatar.jpg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Your username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-2">
                <Label>Current Tier</Label>
                <Input
                  type="text"
                  value={profile?.tier || "N/A"}
                  readOnly
                  disabled
                />
              </div>
              {profile?.tier === "Free" && (
                <Button className="w-full">Upgrade to Enterprise</Button>
              )}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Profile"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileManagement;
