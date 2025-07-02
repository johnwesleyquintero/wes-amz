import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  registerWebhook,
  sendWebhookPayload,
  listWebhooks,
  deleteWebhook,
  toggleWebhookStatus,
  testWebhook,
  Webhook,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { useToast } from "../ui/use-toast";
import { useApi } from "@/hooks/use-api";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorDisplay from "@/components/shared/ErrorDisplay";
import {
  Webhook as WebhookIcon,
  Plus,
  Trash2,
  TestTube,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";

const WebhookManager: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [eventType, setEventType] = useState("");
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const {
    loading: isLoadingWebhooks,
    error: webhooksError,
    execute: executeListWebhooks,
  } = useApi<Webhook[]>({
    onSuccess: (data) => setWebhooks(data),
    showErrorToast: true,
  });

  const { loading: isRegistering, execute: executeRegisterWebhook } = useApi({
    onSuccess: () => {
      toast({
        title: "Webhook Registered",
        description: "Webhook has been successfully registered.",
      });
      setWebhookUrl("");
      setEventType("");
      setIsDialogOpen(false);
      fetchWebhooks();
    },
    showErrorToast: true,
  });

  const { loading: isDeleting, execute: executeDeleteWebhook } = useApi({
    onSuccess: () => {
      toast({
        title: "Webhook Deleted",
        description: "Webhook has been successfully deleted.",
      });
      fetchWebhooks();
    },
    showErrorToast: true,
  });

  const { loading: isTesting, execute: executeTestWebhook } = useApi({
    onSuccess: () => {
      toast({
        title: "Test Successful",
        description: "Test webhook sent successfully.",
      });
    },
    showErrorToast: true,
  });

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
      }
    };
    getUserId();
  }, [toast]);

  const fetchWebhooks = useCallback(async () => {
    if (!userId) return;
    await executeListWebhooks(() => listWebhooks(userId));
  }, [userId, executeListWebhooks]);

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

    if (!webhookUrl.trim() || !eventType.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    await executeRegisterWebhook(() =>
      registerWebhook(webhookUrl.trim(), eventType.trim(), userId),
    );
  };

  const handleDeleteWebhook = async (id: string) => {
    await executeDeleteWebhook(() => deleteWebhook(id));
  };

  const handleTestWebhook = async (id: string) => {
    await executeTestWebhook(() => testWebhook(id));
  };

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      await toggleWebhookStatus(id, isActive);
      toast({
        title: "Status Updated",
        description: `Webhook ${isActive ? "activated" : "deactivated"} successfully.`,
      });
      fetchWebhooks();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update webhook status.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (webhook: Webhook) => {
    if (!webhook.is_active) {
      return <Badge variant="secondary">Inactive</Badge>;
    }

    if (webhook.failure_count && webhook.failure_count > 0) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          {webhook.failure_count} failures
        </Badge>
      );
    }

    return (
      <Badge variant="default" className="flex items-center gap-1">
        <CheckCircle className="h-3 w-3" />
        Active
      </Badge>
    );
  };

  if (isLoadingWebhooks) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" />
        <span className="ml-2">Loading webhooks...</span>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <WebhookIcon className="h-5 w-5" />
              Webhook Manager
            </CardTitle>
            <CardDescription>
              Manage your custom webhook integrations for real-time
              notifications.
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Webhook
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Register New Webhook</DialogTitle>
                <DialogDescription>
                  Add a new webhook endpoint to receive real-time notifications.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://your-domain.com/webhook"
                    type="url"
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
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleRegisterWebhook}
                  disabled={isRegistering}
                >
                  {isRegistering ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Registering...
                    </>
                  ) : (
                    "Register Webhook"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {webhooksError && (
          <ErrorDisplay error={webhooksError.message} onRetry={fetchWebhooks} />
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Registered Webhooks</h3>
          {webhooks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <WebhookIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No webhooks registered</p>
              <p className="text-sm">
                Add your first webhook to get started with real-time
                notifications.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>URL</TableHead>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Triggered</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {webhooks.map((webhook) => (
                    <TableRow key={webhook.id}>
                      <TableCell className="font-mono text-sm max-w-xs truncate">
                        {webhook.url}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{webhook.event_type}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(webhook)}</TableCell>
                      <TableCell>
                        {webhook.last_triggered ? (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {new Date(
                              webhook.last_triggered,
                            ).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Never
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={webhook.is_active || false}
                            onCheckedChange={(checked) =>
                              handleToggleStatus(webhook.id, checked)
                            }
                            disabled={isDeleting}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTestWebhook(webhook.id)}
                            disabled={isTesting || !webhook.is_active}
                          >
                            <TestTube className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteWebhook(webhook.id)}
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Webhook Information</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>
              • Webhooks will be automatically disabled after 5 consecutive
              failures
            </li>
            <li>• Test your webhooks to ensure they're working correctly</li>
            <li>
              • Webhook payloads include event type, timestamp, and relevant
              data
            </li>
            <li>• Use HTTPS URLs for secure webhook endpoints</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhookManager;
