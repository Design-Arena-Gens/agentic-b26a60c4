import { PLATFORM_IDS, type PlatformId } from "./constants";

const parseList = (value: string | undefined) =>
  value
    ?.split(",")
    .map((entry) => entry.trim())
    .filter(Boolean) ?? [];

export type PlatformConfig = {
  id: PlatformId;
  label: string;
  description: string;
  documentationUrl: string;
  isConfigured: boolean;
  metadata: Record<string, unknown>;
};

const configs: Record<PlatformId, PlatformConfig> = {
  whatsapp: {
    id: "whatsapp",
    label: "WhatsApp",
    description:
      "Send rich WhatsApp messages via Twilio or the official WhatsApp Business Cloud API.",
    documentationUrl:
      "https://developers.facebook.com/docs/whatsapp/cloud-api/get-started",
    isConfigured:
      Boolean(process.env.WHATSAPP_ACCOUNT_SID) &&
      Boolean(process.env.WHATSAPP_AUTH_TOKEN) &&
      Boolean(process.env.WHATSAPP_FROM) &&
      parseList(process.env.WHATSAPP_RECIPIENTS).length > 0,
    metadata: {
      from: process.env.WHATSAPP_FROM,
      recipients: parseList(process.env.WHATSAPP_RECIPIENTS),
    },
  },
  telegram: {
    id: "telegram",
    label: "Telegram",
    description:
      "Broadcast to channels or groups using a Telegram Bot token and chat IDs.",
    documentationUrl:
      "https://core.telegram.org/bots/features#sending-messages",
    isConfigured:
      Boolean(process.env.TELEGRAM_BOT_TOKEN) &&
      parseList(process.env.TELEGRAM_CHAT_IDS).length > 0,
    metadata: {
      chatIds: parseList(process.env.TELEGRAM_CHAT_IDS),
    },
  },
  arattai: {
    id: "arattai",
    label: "Arattai",
    description:
      "Send posts to Arattai groups using an incoming webhook integration.",
    documentationUrl: "https://www.arattai.in/",
    isConfigured: parseList(process.env.ARATTAI_WEBHOOK_URLS).length > 0,
    metadata: {
      webhooks: parseList(process.env.ARATTAI_WEBHOOK_URLS),
    },
  },
  twitter: {
    id: "twitter",
    label: "Twitter / X",
    description:
      "Publish inspirational tweets using the OAuth 1.0a credentials for your Automation app.",
    documentationUrl: "https://developer.twitter.com/en/docs/twitter-api",
    isConfigured:
      Boolean(process.env.TWITTER_APP_KEY) &&
      Boolean(process.env.TWITTER_APP_SECRET) &&
      Boolean(process.env.TWITTER_ACCESS_TOKEN) &&
      Boolean(process.env.TWITTER_ACCESS_SECRET),
    metadata: {},
  },
};

export const envConfig = {
  platformConfigs: configs,
  getPlatformConfig(id: PlatformId) {
    return configs[id];
  },
  listConfiguredIds() {
    return PLATFORM_IDS.filter((id) => configs[id].isConfigured);
  },
};

export const getEnvList = parseList;
