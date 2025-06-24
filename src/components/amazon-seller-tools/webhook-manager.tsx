import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  registerWebhook,
  sendWebhookPayload,
  listWebhooks,
  deleteWebhook,
  Webhook, // Import the interface from webhook-utils
} from "../../lib/webhook-utils";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useToast } from "../ui/use-toast"; // Assuming useToast is available

const WebhookManager: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [eventType, setEventType] = useState("");
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [payload, setPayload] = useState("");
  const [sendWebhookId, setSendWebhookId] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoadingWebhooks, setIsLoadingWebhooks] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSendingPayload, setIsSendingPayload] = useState(false);
  const [deletingWebhookId, setDeletingWebhookId] = useState<string | null>(
    null,
  );
  const { toast } = useToast();

  useEffect(() => {
    const getUserId = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        toast({
          title: "Authentication Error",
          description: "User not logged in. Cannot manage webhooks.",
          variant: "destructive",
        });
        setIsLoadingWebhooks(false); // Stop loading if no user
      }
    };
    getUserId();
  }, [toast]);

  const fetchWebhooks = useCallback(async () => {
    if (!userId) return;
    setIsLoadingWebhooks(true);
    try {
      const fetched = await listWebhooks(userId);
      setWebhooks(fetched);
    } catch (error) {
      console.error("Failed to fetch webhooks:", error);
      toast({
        title: "Error",
        description: "Failed to load webhooks.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingWebhooks(false);
    }
  }, [userId, toast]);

  useEffect(() => {
    if (userId) {
      fetchWebhooks();
    }
  }, [userId, fetchWebhooks]);

  const handleRegisterWebhook = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "User not authenticated.",
        variant: "destructive",
      });
      return;
    }
    setIsRegistering(true);
    try {
      const result = await registerWebhook(webhookUrl, eventType, userId);
      if (result.success) {
        toast({
          title: "Webhook Registered",
          description: `Webhook registered with ID: ${result.id}`,
        });
        setWebhookUrl("");
        setEventType("");
        fetchWebhooks();
      } else {
        toast({
          title: "Error",
          description: `Failed to register webhook: ${result.error?.message || "Unknown error"}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error registering webhook:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during registration.",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleSendPayload = async () => {
    setIsSendingPayload(true);
    try {
      const parsedPayload = JSON.parse(payload);
      const success = await sendWebhookPayload(sendWebhookId, parsedPayload);
      if (success) {
        toast({
          title: "Payload Sent",
          description: "Payload sent successfully (check console for details).",
        });
        setPayload("");
        setSendWebhookId("");
      } else {
        toast({
          title: "Error",
          description: "Failed to send payload.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid JSON payload.",
        variant: "destructive",
      });
    } finally {
      setIsSendingPayload(false);
    }
  };

  const handleDeleteWebhook = async (id: string) => {
    setDeletingWebhookId(id);
    try {
      const success = await deleteWebhook(id);
      if (success) {
        toast({
          title: "Webhook Deleted",
          description: `Webhook ${id} deleted.`,
        });
        fetchWebhooks();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete webhook.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting webhook:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during deletion.",
        variant: "destructive",
      });
    } finally {
      setDeletingWebhookId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Webhook Manager</CardTitle>
        <CardDescription>
          Manage your custom webhook integrations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Register New Webhook</h3>
          <div>
            <Label htmlFor="webhookUrl">Webhook URL</Label>
            <Input
              id="webhookUrl"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="Enter Webhook URL"
            />
          </div>
          <div>
            <Label htmlFor="eventType">Event Type</Label>
            <Input
              id="eventType"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              placeholder="e.g., campaign_update, listing_change"
            />
          </div>
          <Button onClick={handleRegisterWebhook} disabled={isRegistering}>
            {isRegistering ? "Registering..." : "Register Webhook"}
          </Button>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Send Webhook Payload</h3>
          <div>
            <Label htmlFor="sendWebhookId">Webhook ID</Label>
            <Input
              id="sendWebhookId"
              value={sendWebhookId}
              onChange={(e) => setSendWebhookId(e.target.value)}
              placeholder="Enter Webhook ID"
              disabled={isSendingPayload}
            />
          </div>
          <div>
            <Label htmlFor="payload">Payload (JSON)</Label>
            <Input
              id="payload"
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              placeholder="Enter JSON payload"
              disabled={isSendingPayload}
            />
          </div>
          <Button onClick={handleSendPayload} disabled={isSendingPayload}>
            {isSendingPayload ? "Sending..." : "Send Payload"}
          </Button>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Registered Webhooks</h3>
          {isLoadingWebhooks ? (
            <p>Loading webhooks...</p>
          ) : webhooks.length === 0 ? (
            <p>No webhooks registered yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Event Type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {webhooks.map((webhook) => (
                  <TableRow key={webhook.id}>
                    <TableCell>{webhook.id}</TableCell>
                    <TableCell>{webhook.url}</TableCell>
                    <TableCell>{webhook.event_type}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteWebhook(webhook.id)}
                        disabled={deletingWebhookId === webhook.id}
                      >
                        {deletingWebhookId === webhook.id ? "Deleting..." : "Delete"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhookManager;
