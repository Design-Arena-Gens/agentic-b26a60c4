import { deliverArattaiMessage, isArattaiConfigured } from "./arattai";
import { deliverTelegramMessage, isTelegramConfigured } from "./telegram";
import { deliverTweet, isTwitterConfigured } from "./twitter";
import { deliverWhatsAppMessage, isWhatsAppConfigured } from "./whatsapp";
import type { PlatformResult } from "./types";
import type { PlatformId } from "../constants";

export const platformHandlers: Record<
  PlatformId,
  {
    label: string;
    isConfigured: boolean;
    sender: (message: string, header?: string) => Promise<PlatformResult>;
  }
> = {
  whatsapp: {
    label: "WhatsApp",
    isConfigured: isWhatsAppConfigured,
    sender: deliverWhatsAppMessage,
  },
  telegram: {
    label: "Telegram",
    isConfigured: isTelegramConfigured,
    sender: deliverTelegramMessage,
  },
  arattai: {
    label: "Arattai",
    isConfigured: isArattaiConfigured,
    sender: deliverArattaiMessage,
  },
  twitter: {
    label: "Twitter / X",
    isConfigured: isTwitterConfigured,
    sender: deliverTweet,
  },
};
