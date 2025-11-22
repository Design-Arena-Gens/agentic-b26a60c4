import { z } from "zod";
import {
  MESSAGE_CATEGORIES,
  PLATFORM_IDS,
  TONE_OPTIONS,
  type PlatformId,
} from "./constants";

export const BroadcastPayloadSchema = z.object({
  message: z.string().min(5, "Please craft a message with at least 5 characters."),
  headline: z
    .string()
    .min(2, "Headline should be at least 2 characters.")
    .max(80, "Headline should be short and punchy.")
    .optional(),
  categories: z
    .array(z.enum(MESSAGE_CATEGORIES))
    .min(1, "Select at least one focus category."),
  tone: z.enum(TONE_OPTIONS).optional(),
  hashtags: z.array(z.string()).max(6).optional(),
  platforms: z
    .array(z.enum(PLATFORM_IDS))
    .nonempty("Select at least one platform to broadcast."),
});

export type BroadcastPayload = z.infer<typeof BroadcastPayloadSchema>;

export type BroadcastResult = {
  platform: PlatformId;
  status: "sent" | "failed" | "skipped";
  detail: string;
  metadata?: Record<string, unknown>;
};
