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

const TeamManagement = () => {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"Admin" | "Member">("Member");
  const { toast } = useToast();

  const fetchTeamMembers = useCallback(async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
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
          setOrganizationId(profileData.organization_id);

          // Check if the current user is an admin of this organization
          const { data: memberRoleData, error: memberRoleError } =
            await supabase
              .from("organization_members")
              .select("role")
              .eq("organization_id", profileData.organization_id)
              .eq("user_id", user.id)
              .single();

          if (memberRoleError) throw memberRoleError;

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

          if (membersError) throw membersError;
          setMembers(membersData || []);
        } else {
          toast({
            title: "Access Denied",
            description: "You are not part of an Enterprise organization.",
            variant: "destructive",
          });
          setMembers([]);
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Error fetching team members",
        description: errorMessage,
        variant: "destructive",
      });
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, [organizationId, setLoading, toast, supabase]);

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  const handleInviteMember = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!organizationId) return;

      setLoading(true);
      try {
        // In a real application, this would involve a secure backend endpoint
        // to send an invitation email and handle the user joining the organization.
        // For this example, we'll simulate adding a user directly if they exist.

        // First, find the user by email
        const { data: users, error: userError } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", inviteEmail)
          .single();

        if (userError || !users) {
          throw new Error(
            "User with this email not found. Please ensure they have registered.",
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
          throw existingMemberError;
        }

        if (existingMember) {
          throw new Error("User is already a member of this organization.");
        }

        // Add the user to organization_members
        const { error: insertError } = await supabase
          .from("organization_members")
          .insert({
            organization_id: organizationId,
            user_id: users.id,
            role: inviteRole,
          });

        if (insertError) throw insertError;

        toast({
          title: "Member Invited/Added",
          description: `${inviteEmail} has been added as a ${inviteRole}.`,
        });
        setInviteEmail("");
        setInviteRole("Member");
        fetchTeamMembers(); // Refresh the list
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        toast({
          title: "Error inviting member",
          description: errorMessage,
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
      supabase,
    ],
  );

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

        if (error) throw error;

        toast({
          title: "Member Removed",
          description:
            "Member has been successfully removed from the organization.",
        });
        fetchTeamMembers(); // Refresh the list
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        toast({
          title: "Error removing member",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [organizationId, setLoading, toast, fetchTeamMembers, supabase],
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p>Loading team management...</p>
      </div>
    );
  }

  if (!organizationId) {
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
