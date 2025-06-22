import React, { useState, useEffect } from "react";
import {
  registerWebhook,
  sendWebhookPayload,
  listWebhooks,
  deleteWebhook,
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

interface Webhook {
  id: string;
  url: string;
  eventType: string;
}

const WebhookManager: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [eventType, setEventType] = useState("");
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [payload, setPayload] = useState("");
  const [sendWebhookId, setSendWebhookId] = useState("");

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = () => {
    const fetched = listWebhooks();
    setWebhooks(fetched);
  };

  const handleRegisterWebhook = () => {
    const result = registerWebhook(webhookUrl, eventType);
    if (result.success) {
      alert(`Webhook registered with ID: ${result.id}`);
      setWebhookUrl("");
      setEventType("");
      fetchWebhooks();
    } else {
      alert("Failed to register webhook (placeholder)");
    }
  };

  const handleSendPayload = () => {
    try {
      const parsedPayload = JSON.parse(payload);
      const success = sendWebhookPayload(sendWebhookId, parsedPayload);
      if (success) {
        alert("Payload sent successfully (placeholder)");
        setPayload("");
        setSendWebhookId("");
      } else {
        alert("Failed to send payload (placeholder)");
      }
    } catch (_e) {
      alert("Invalid JSON payload");
    }
  };

  const handleDeleteWebhook = (id: string) => {
    const success = deleteWebhook(id);
    if (success) {
      alert(`Webhook ${id} deleted (placeholder)`);
      fetchWebhooks();
    } else {
      alert("Failed to delete webhook (placeholder)");
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
          <Button onClick={handleRegisterWebhook}>Register Webhook</Button>
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
            />
          </div>
          <div>
            <Label htmlFor="payload">Payload (JSON)</Label>
            <Input
              id="payload"
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              placeholder="Enter JSON payload"
            />
          </div>
          <Button onClick={handleSendPayload}>Send Payload</Button>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Registered Webhooks</h3>
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
                  <TableCell>{webhook.eventType}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteWebhook(webhook.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhookManager;
