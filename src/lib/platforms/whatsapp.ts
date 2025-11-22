import twilio from "twilio";
import { getEnvList } from "../env";
import type { PlatformResult } from "./types";

const accountSid = process.env.WHATSAPP_ACCOUNT_SID;
const authToken = process.env.WHATSAPP_AUTH_TOKEN;
const fromNumber = process.env.WHATSAPP_FROM;
const recipients = getEnvList(process.env.WHATSAPP_RECIPIENTS);

export const isWhatsAppConfigured =
  Boolean(accountSid) &&
  Boolean(authToken) &&
  Boolean(fromNumber) &&
  recipients.length > 0;

export async function deliverWhatsAppMessage(
  message: string,
  header?: string
): Promise<PlatformResult> {
  if (!isWhatsAppConfigured) {
    return {
      platform: "whatsapp",
      status: "skipped",
      detail:
        "WhatsApp credentials are missing. Set WHATSAPP_ACCOUNT_SID, WHATSAPP_AUTH_TOKEN, WHATSAPP_FROM and WHATSAPP_RECIPIENTS.",
    };
  }

  try {
    const client = twilio(accountSid!, authToken!);
    const body = header ? `${header}\n\n${message}` : message;
    const responses = await Promise.all(
      recipients.map((recipient) =>
        client.messages.create({
          from: fromNumber!,
          to: recipient.startsWith("whatsapp:")
            ? recipient
            : `whatsapp:${recipient}`,
          body,
        })
      )
    );

    return {
      platform: "whatsapp",
      status: "sent",
      detail: `Delivered to ${responses.length} recipient${
        responses.length === 1 ? "" : "s"
      }`,
      metadata: {
        sids: responses.map((response) => response.sid),
      },
    };
  } catch (error) {
    const err = error as Error;
    return {
      platform: "whatsapp",
      status: "failed",
      detail: err.message,
    };
  }
}
