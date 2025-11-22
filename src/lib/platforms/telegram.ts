import { getEnvList } from "../env";
import type { PlatformResult } from "./types";

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatIds = getEnvList(process.env.TELEGRAM_CHAT_IDS);

export const isTelegramConfigured = Boolean(token) && chatIds.length > 0;

const apiBase = token ? `https://api.telegram.org/bot${token}` : "";

async function postMessage(chatId: string, text: string) {
  const response = await fetch(`${apiBase}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Telegram responded with ${response.status}: ${response.statusText}. ${body}`
    );
  }
}

export async function deliverTelegramMessage(
  message: string,
  header?: string
): Promise<PlatformResult> {
  if (!isTelegramConfigured || !token) {
    return {
      platform: "telegram",
      status: "skipped",
      detail:
        "Telegram Bot credentials missing. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_IDS.",
    };
  }

  try {
    const payload = header ? `*${header}*\n\n${message}` : message;
    await Promise.all(chatIds.map((chatId) => postMessage(chatId, payload)));
    return {
      platform: "telegram",
      status: "sent",
      detail: `Delivered to ${chatIds.length} chat${
        chatIds.length === 1 ? "" : "s"
      }`,
    };
  } catch (error) {
    const err = error as Error;
    return {
      platform: "telegram",
      status: "failed",
      detail: err.message,
    };
  }
}
