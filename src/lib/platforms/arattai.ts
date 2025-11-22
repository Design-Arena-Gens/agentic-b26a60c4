import { getEnvList } from "../env";
import type { PlatformResult } from "./types";

const webhooks = getEnvList(process.env.ARATTAI_WEBHOOK_URLS);

export const isArattaiConfigured = webhooks.length > 0;

export async function deliverArattaiMessage(
  message: string,
  header?: string
): Promise<PlatformResult> {
  if (!isArattaiConfigured) {
    return {
      platform: "arattai",
      status: "skipped",
      detail:
        "No Arattai webhooks configured. Set ARATTAI_WEBHOOK_URLS with comma separated webhook URLs.",
    };
  }

  try {
    const payload = {
      title: header ?? "PulseCast Broadcast",
      message,
      sentAt: new Date().toISOString(),
      source: "PulseCast Dashboard",
    };

    const responses = await Promise.all(
      webhooks.map(async (url) => {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(
            `Webhook returned ${response.status} ${response.statusText}: ${text}`
          );
        }

        return response.status;
      })
    );

    return {
      platform: "arattai",
      status: "sent",
      detail: `Delivered to ${responses.length} webhook${
        responses.length === 1 ? "" : "s"
      }`,
    };
  } catch (error) {
    const err = error as Error;
    return {
      platform: "arattai",
      status: "failed",
      detail: err.message,
    };
  }
}
