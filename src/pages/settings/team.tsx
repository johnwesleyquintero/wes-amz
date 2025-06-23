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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  ApiError,
  AuthenticationError,
  ServerError,
  ClientError,
  AuthorizationError,
} from "@/lib/api-errors";

interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: "Admin" | "Member";
  joined_at: string;
  profiles: Array<{
    email: string;
    full_name: string | null;
    username: string | null;
  }> | null;
}

/**
 * TeamManagement component allows Enterprise organization admins to manage team members.
 * It fetches organization members from Supabase, displays them in a table,
 * and provides functionality to invite and remove members.
 */
const TeamManagement = () => {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"Admin" | "Member">("Member");
  const { toast } = useToast();

  /**
   * Fetches the team members for the current user's Enterprise organization.
   * Also checks if the current user has admin privileges.
   */
  const fetchTeamMembers = useCallback(async () => {
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
            "Failed to fetch user profile for team check.",
            statusCode,
            profileError,
          );
        }

        if (
          profileData &&
          profileData.tier === "Enterprise" &&
          profileData.organization_id
        ) {
          setOrganizationId(profileData.organization_id);

          // Check if the current user is an admin of this organization
          const { data: memberRoleData, error: memberRoleError } =
            await supabase
              .from("organization_members")
              .select("role")
              .eq("organization_id", profileData.organization_id)
              .eq("user_id", user.id)
              .single();

          if (memberRoleError) {
            const statusCode =
              memberRoleError &&
              typeof memberRoleError === "object" &&
              "status" in memberRoleError &&
              typeof memberRoleError.status === "number"
                ? memberRoleError.status
                : 500;
            throw new ServerError(
              "Failed to check user's organization role.",
              statusCode,
              memberRoleError,
            );
          }

          if (memberRoleData && memberRoleData.role === "Admin") {
            setIsUserAdmin(true);
          }

          const { data: membersData, error: membersError } = await supabase
            .from("organization_members")
            .select(
              `
              id,
              organization_id,
              user_id,
              role,
              joined_at,
              profiles (
                email,
                full_name,
                username
              )
            `,
            )
            .eq("organization_id", profileData.organization_id);

          if (membersError) {
            const statusCode =
              membersError &&
              typeof membersError === "object" &&
              "status" in membersError &&
              typeof membersError.status === "number"
                ? membersError.status
                : 500;
            throw new ServerError(
              "Failed to fetch team members.",
              statusCode,
              membersError,
            );
          }
          setMembers(membersData || []);
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
        title: `Error fetching team members: ${apiError.errorType || "Unknown"}`,
        description: apiError.message,
        variant: "destructive",
      });
      setMembers([]); // Clear members on error
    } finally {
      setLoading(false);
    }
  }, [setLoading, toast]);

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  /**
   * Handles inviting a new member to the organization.
   * Note: In a real application, this would involve a secure backend endpoint
   * to send an invitation email and handle the user joining the organization.
   * For this example, we simulate adding a user directly if they exist.
   * @param e - The form submission event.
   */
  const handleInviteMember = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!organizationId) return;

      setLoading(true);
      try {
        // First, find the user by email
        const { data: users, error: userError } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", inviteEmail)
          .single();

        if (userError || !users) {
          const statusCode =
            userError &&
            typeof userError === "object" &&
            "status" in userError &&
            typeof userError.status === "number"
              ? userError.status
              : 404;
          throw new ClientError(
            "User with this email not found. Please ensure they have registered.",
            statusCode,
            userError,
          );
        }

        // Check if user is already a member
        const { data: existingMember, error: existingMemberError } =
          await supabase
            .from("organization_members")
            .select("id")
            .eq("organization_id", organizationId)
            .eq("user_id", users.id)
            .single();

        if (existingMemberError && existingMemberError.code !== "PGRST116") {
          // PGRST116 means no rows found
          const statusCode =
            existingMemberError &&
            typeof existingMemberError === "object" &&
            "status" in existingMemberError &&
            typeof existingMemberError.status === "number"
              ? existingMemberError.status
              : 500;
          throw new ServerError(
            "Failed to check existing membership.",
            statusCode,
            existingMemberError,
          );
        }

        if (existingMember) {
          throw new ClientError(
            "User is already a member of this organization.",
            409,
          ); // 409 Conflict
        }

        // Add the user to organization_members
        const { error: insertError } = await supabase
          .from("organization_members")
          .insert({
            organization_id: organizationId,
            user_id: users.id,
            role: inviteRole,
          });

        if (insertError) {
          const statusCode =
            insertError &&
            typeof insertError === "object" &&
            "status" in insertError &&
            typeof insertError.status === "number"
              ? insertError.status
              : 500;
          throw new ServerError(
            "Failed to add member to organization.",
            statusCode,
            insertError,
          );
        }

        toast({
          title: "Member Invited/Added",
          description: `${inviteEmail} has been added as a ${inviteRole}.`,
        });
        setInviteEmail("");
        setInviteRole("Member");
        fetchTeamMembers(); // Refresh the list
      } catch (error) {
        const apiError =
          error instanceof ApiError
            ? error
            : new ApiError(
                "An unexpected error occurred during invitation.",
                undefined,
                undefined,
                error,
              );
        toast({
          title: `Error inviting member: ${apiError.errorType || "Unknown"}`,
          description: apiError.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [
      inviteEmail,
      inviteRole,
      organizationId,
      setLoading,
      toast,
      fetchTeamMembers,
    ],
  );

  /**
   * Handles removing a member from the organization.
   * @param memberId - The ID of the organization member to remove.
   */
  const handleRemoveMember = useCallback(
    async (memberId: string) => {
      if (!organizationId) return;

      setLoading(true);
      try {
        const { error } = await supabase
          .from("organization_members")
          .delete()
          .eq("id", memberId)
          .eq("organization_id", organizationId); // Ensure only members of the current org can be removed

        if (error) {
          const statusCode =
            error &&
            typeof error === "object" &&
            "status" in error &&
            typeof error.status === "number"
              ? error.status
              : 500;
          throw new ServerError("Failed to remove member.", statusCode, error);
        }

        toast({
          title: "Member Removed",
          description:
            "Member has been successfully removed from the organization.",
        });
        fetchTeamMembers(); // Refresh the list
      } catch (error) {
        const apiError =
          error instanceof ApiError
            ? error
            : new ApiError(
                "An unexpected error occurred during removal.",
                undefined,
                undefined,
                error,
              );
        toast({
          title: `Error removing member: ${apiError.errorType || "Unknown"}`,
          description: apiError.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [setLoading, toast, fetchTeamMembers, organizationId],
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p>Loading team management...</p>
      </div>
    );
  }

  if (!organizationId) {
    // This case is now handled by the error boundary or the catch block
    // but keeping a basic render for clarity if state is somehow null
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Team Management</CardTitle>
            <CardDescription>Access Denied</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              You do not have access to team management or are not part of an
              Enterprise tier organization.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Team Management</CardTitle>
          <CardDescription>Manage your organization's members.</CardDescription>
        </CardHeader>
        <CardContent>
          {isUserAdmin && (
            <div className="mb-6 space-y-4 rounded-md border p-4">
              <h3 className="text-lg font-semibold">Invite New Member</h3>
              <form
                onSubmit={handleInviteMember}
                className="flex flex-col gap-4 md:flex-row"
              >
                <div className="flex-1">
                  <Label htmlFor="invite-email">Email</Label>
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="member@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="w-full md:w-1/3">
                  <Label htmlFor="invite-role">Role</Label>
                  <Select
                    value={inviteRole}
                    onValueChange={(value) =>
                      setInviteRole(value as "Admin" | "Member")
                    }
                  >
                    <SelectTrigger id="invite-role">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Member">Member</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  className="md:self-end"
                  disabled={loading}
                >
                  {loading ? "Inviting..." : "Invite Member"}
                </Button>
              </form>
            </div>
          )}

          <h3 className="mb-4 text-lg font-semibold">Current Members</h3>
          {members.length === 0 ? (
            <p>No members found for this organization.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined At</TableHead>
                    {isUserAdmin && (
                      <TableHead className="text-right">Actions</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        {member.profiles?.[0]?.email || "N/A"}
                      </TableCell>
                      <TableCell>
                        {member.profiles?.[0]?.full_name || "N/A"}
                      </TableCell>
                      <TableCell>
                        {member.profiles?.[0]?.username || "N/A"}
                      </TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>
                        {new Date(member.joined_at).toLocaleDateString()}
                      </TableCell>
                      {isUserAdmin && (
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="sm"
                                disabled={loading}
                              >
                                Remove
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Confirm Removal</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to remove{" "}
                                  {member.profiles?.[0]?.email || "this member"}{" "}
                                  from the organization?
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleRemoveMember(member.id)}
                                  disabled={loading}
                                >
                                  {loading ? "Removing..." : "Remove"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamManagement;
