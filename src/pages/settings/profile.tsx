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

interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  tier: "Free" | "Enterprise";
}

/**
 * ProfileManagement component allows users to view and update their profile information.
 * It fetches user data from Supabase and provides a form for editing username, full name, and avatar URL.
 */
const ProfileManagement = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const { toast } = useToast();

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
          // 406 means no data found, which is okay if profile doesn't exist yet
          // Safely access status if it exists, otherwise default to 500
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
          setUsername(data.username || "");
          setFullName(data.full_name || "");
          setAvatarUrl(data.avatar_url || "");
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
  }, [toast, setLoading, setProfile, setUsername, setFullName, setAvatarUrl]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  /**
   * Handles the submission of the profile update form.
   * Updates the user's profile data in Supabase.
   * @param event - The form submission event.
   */
  async function updateProfile(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        // Safely access status if it exists, otherwise default to 401
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
          username,
          full_name: fullName,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase.from("profiles").upsert(updates);

        if (error) {
          // Safely access status if it exists, otherwise default to 500
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
  }

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
          <form onSubmit={updateProfile} className="space-y-4">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={avatarUrl || "https://github.com/shadcn.png"}
                  alt="@shadcn"
                />
                <AvatarFallback>
                  {username ? username[0].toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="grid w-full gap-2">
                <Label htmlFor="avatar-url">Avatar URL</Label>
                <Input
                  id="avatar-url"
                  type="text"
                  placeholder="https://example.com/avatar.jpg"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input
                id="full-name"
                type="text"
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
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
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileManagement;
