import React, { useEffect, useCallback, useState } from "react";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
   * Fetches the user's profile data from Supabase using React Query.
   */
  const fetchProfile = useCallback(async (): Promise<Profile> => {
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

    if (!user) {
      throw new AuthenticationError("User not logged in.", 401);
    }

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
      throw new ServerError("Failed to fetch profile data.", statusCode, error);
    }

    return data as Profile;
  }, []);

  const {
    data: profile,
    isLoading,
    error: fetchError,
  } = useQuery<Profile, ApiError>({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // Data kept in cache for 10 minutes
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        username: profile.username || "",
        fullName: profile.full_name || "",
        avatarUrl: profile.avatar_url || "",
      });
    }
  }, [profile, form]);

  useEffect(() => {
    if (fetchError) {
      toast({
        title: `Error fetching profile: ${fetchError.errorType || "Unknown"}`,
        description: fetchError.message,
        variant: "destructive",
      });
    }
  }, [fetchError, toast]);

  const [geminiApiKey, setGeminiApiKey] = useState('');

  useEffect(() => {
    const fetchApiKey = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile, error: fetchProfileError } = await supabase
          .from('profiles')
          .select('gemini_api_key')
          .eq('id', user.id)
          .single();
        if (fetchProfileError) {
          console.error("Error fetching Gemini API key:", fetchProfileError);
          toast({
            title: "Error fetching API key",
            description: fetchProfileError.message,
            variant: "destructive",
          });
        } else if (profile && profile.gemini_api_key) {
          setGeminiApiKey(profile.gemini_api_key);
        }
      }
    };
    fetchApiKey();
  }, [toast]);

  /**
   * Handles the submission of the profile update form using React Query's useMutation.
   */
  const updateProfileMutation = useMutation<
    void,
    ApiError,
    z.infer<typeof formSchema>
  >({
    mutationFn: async (values) => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw new AuthenticationError(
          "Failed to get user session for update.",
          userError.status,
          userError,
        );
      }

      if (!user) {
        throw new AuthenticationError("User not logged in.", 401);
      }

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
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["profile"] }); // Invalidate cache to refetch latest data
    },
    onError: (error) => {
      toast({
        title: `Error updating profile: ${error.errorType || "Unknown"}`,
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    updateProfileMutation.mutate(values);
  };

  const handleSaveGeminiApiKey = async () => {
    const { data: { user } = {} } = await supabase.auth.getUser();
    if (user) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ gemini_api_key: geminiApiKey })
        .eq('id', user.id);

      if (updateError) {
        toast({
          title: "Error saving API key",
          description: updateError.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Gemini API key saved successfully.",
        });
      }
    }
  };

  const currentAvatarUrl = form.watch("avatarUrl");

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-destructive">Error: {fetchError.message}</p>
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
                    {profile?.username
                      ? profile.username[0].toUpperCase()
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
                          aria-label="Avatar URL"
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
                      <Input
                        type="text"
                        placeholder="Your username"
                        aria-label="Username"
                        {...field}
                      />
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
                      <Input
                        type="text"
                        placeholder="Your full name"
                        aria-label="Full Name"
                        {...field}
                      />
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
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || updateProfileMutation.isPending}
              >
                {isSubmitting || updateProfileMutation.isPending
                  ? "Saving..."
                  : "Save Profile"}
              </Button>
            </form>
          </Form>

          <h2 className="text-xl font-semibold mt-6 mb-4">AI Integration Settings</h2>
          <div className="grid gap-2">
            <Label htmlFor="gemini-api-key">Gemini API Key</Label>
            <Input
              id="gemini-api-key"
              type="password"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              placeholder="Enter your Gemini API Key"
            />
            <Button onClick={handleSaveGeminiApiKey} className="mt-2 w-fit">
              Save API Key
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileManagement;
