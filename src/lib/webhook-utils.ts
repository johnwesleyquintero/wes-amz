import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

export interface Webhook {
  id: string;
  url: string;
  event_type: string;
  created_at?: string;
  user_id?: string;
}

export const registerWebhook = async (
  url: string,
  eventType: string,
  userId: string,
) => {
  try {
    const { data, error } = await supabase.from("webhooks").insert([
      {
        id: uuidv4(),
        url,
        event_type: eventType,
        user_id: userId,
      },
    ]);

    if (error) {
      console.error("Error registering webhook:", error);
      return { success: false, error };
    }

    return { success: true, id: (data as { id: string }[])?.[0]?.id || uuidv4() };
  } catch (e) {
    console.error("Exception registering webhook:", e);
    return { success: false, error: e };
  }
};

export const sendWebhookPayload = async (
  webhookId: string,
  payload: unknown,
) => {
  console.log(`Sending payload for webhook ID: ${webhookId}`);
  // This should ideally be handled by a server-side function (e.g., Supabase Edge Function, Next.js API route)
  // to avoid CORS issues and expose API keys. For now, it's a client-side placeholder.
  try {
    const { data, error } = await supabase
      .from("webhooks")
      .select("url")
      .eq("id", webhookId)
      .single();

    if (error || !data) {
      console.error("Webhook not found or error fetching URL:", error);
      return false;
    }

    const webhookUrl = data.url;
    console.log(`Attempting to send payload to: ${webhookUrl}`);

    // In a real application, you would make a POST request to webhookUrl with the payload
    // For demonstration, we'll just log it.
    console.log("Payload to send:", JSON.stringify(payload, null, 2));
    alert(
      `Simulating webhook payload send to ${webhookUrl}. Check console for payload.`,
    );

    return true;
  } catch (e) {
    console.error("Exception sending webhook payload:", e);
    return false;
  }
};

export const listWebhooks = async (userId: string): Promise<Webhook[]> => {
  try {
    const { data, error } = await supabase
      .from("webhooks")
      .select("id, url, event_type, created_at")
      .eq("user_id", userId);

    if (error) {
      console.error("Error listing webhooks:", error);
      return [];
    }

    return data as Webhook[];
  } catch (e) {
    console.error("Exception listing webhooks:", e);
    return [];
  }
};

export const deleteWebhook = async (webhookId: string) => {
  try {
    const { error } = await supabase
      .from("webhooks")
      .delete()
      .eq("id", webhookId);

    if (error) {
      console.error("Error deleting webhook:", error);
      return false;
    }

    return true;
  } catch (e) {
    console.error("Exception deleting webhook:", e);
    return false;
  }
};
