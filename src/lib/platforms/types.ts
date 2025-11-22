import type { PlatformId } from "../constants";

export type PlatformStatus = "sent" | "skipped" | "failed";

export type PlatformResult = {
  platform: PlatformId;
  status: PlatformStatus;
  detail: string;
  metadata?: Record<string, unknown>;
};
