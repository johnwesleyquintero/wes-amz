import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { ApiError, ServerError, ClientError } from "@/lib/api-errors";

export interface Webhook {
  id: string;
  url: string;
  event_type: string;
  created_at?: string;
  user_id?: string;
  is_active?: boolean;
  last_triggered?: string;
  failure_count?: number;
}

export interface WebhookPayload {
  event: string;
  timestamp: string;
  data: Record<string, unknown>;
  webhook_id: string;
}

export const registerWebhook = async (
  url: string,
  eventType: string,
  userId: string,
) => {
  try {
    // Validate URL format
    try {
      new URL(url);
    } catch {
      throw new ClientError("Invalid webhook URL format", 400);
    }

    // Check if webhook already exists for this user and event type
    const { data: existingWebhook, error: checkError } = await supabase
      .from("webhooks")
      .select("id")
      .eq("user_id", userId)
      .eq("event_type", eventType)
      .eq("url", url)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      throw new ServerError(
        "Failed to check existing webhooks",
        500,
        checkError,
      );
    }

    if (existingWebhook) {
      throw new ClientError(
        "Webhook already exists for this URL and event type",
        409,
      );
    }

    const webhookId = uuidv4();
    const { data, error } = await supabase
      .from("webhooks")
      .insert([
        {
          id: webhookId,
          url,
          event_type: eventType,
          user_id: userId,
          is_active: true,
          failure_count: 0,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new ServerError("Failed to register webhook", 500, error);
    }

    return { success: true, id: webhookId, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error };
    }
    return {
      success: false,
      error: new ServerError(
        "Unexpected error during webhook registration",
        500,
        error,
      ),
    };
  }
};

export const sendWebhookPayload = async (
  webhookId: string,
  payload: Record<string, unknown>,
) => {
  try {
    // Get webhook details
    const { data: webhook, error: fetchError } = await supabase
      .from("webhooks")
      .select("url, is_active, failure_count")
      .eq("id", webhookId)
      .single();

    if (fetchError || !webhook) {
      throw new ClientError("Webhook not found", 404, fetchError);
    }

    if (!webhook.is_active) {
      throw new ClientError("Webhook is inactive", 400);
    }

    // Prepare webhook payload
    const webhookPayload: WebhookPayload = {
      event: "data_update",
      timestamp: new Date().toISOString(),
      data: payload,
      webhook_id: webhookId,
    };

    // Send webhook (in a real implementation, this would be done server-side)
    try {
      const response = await fetch(webhook.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Alerion-Webhook/1.0",
        },
        body: JSON.stringify(webhookPayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Update last triggered timestamp and reset failure count
      await supabase
        .from("webhooks")
        .update({
          last_triggered: new Date().toISOString(),
          failure_count: 0,
        })
        .eq("id", webhookId);

      return true;
    } catch (fetchError) {
      // Increment failure count
      const newFailureCount = (webhook.failure_count || 0) + 1;
      const updates: Partial<Webhook> = { failure_count: newFailureCount };

      // Deactivate webhook after 5 failures
      if (newFailureCount >= 5) {
        updates.is_active = false;
      }

      await supabase.from("webhooks").update(updates).eq("id", webhookId);

      throw new ServerError(
        `Failed to send webhook: ${fetchError.message}`,
        500,
        fetchError,
      );
    }
  } catch (error) {
    console.error("Webhook send error:", error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ServerError("Unexpected error sending webhook", 500, error);
  }
};

export const listWebhooks = async (userId: string): Promise<Webhook[]> => {
  try {
    const { data, error } = await supabase
      .from("webhooks")
      .select(
        "id, url, event_type, created_at, is_active, last_triggered, failure_count",
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new ServerError("Failed to fetch webhooks", 500, error);
    }

    return data as Webhook[];
  } catch (error) {
    console.error("Error listing webhooks:", error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ServerError("Unexpected error fetching webhooks", 500, error);
  }
};

export const deleteWebhook = async (webhookId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("webhooks")
      .delete()
      .eq("id", webhookId);

    if (error) {
      throw new ServerError("Failed to delete webhook", 500, error);
    }

    return true;
  } catch (error) {
    console.error("Error deleting webhook:", error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ServerError("Unexpected error deleting webhook", 500, error);
  }
};

export const toggleWebhookStatus = async (
  webhookId: string,
  isActive: boolean,
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("webhooks")
      .update({ is_active: isActive, failure_count: 0 })
      .eq("id", webhookId);

    if (error) {
      throw new ServerError("Failed to update webhook status", 500, error);
    }

    return true;
  } catch (error) {
    console.error("Error updating webhook status:", error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ServerError(
      "Unexpected error updating webhook status",
      500,
      error,
    );
  }
};

export const testWebhook = async (webhookId: string): Promise<boolean> => {
  const testPayload = {
    test: true,
    message: "This is a test webhook from Alerion",
    timestamp: new Date().toISOString(),
  };

  return await sendWebhookPayload(webhookId, testPayload);
};
