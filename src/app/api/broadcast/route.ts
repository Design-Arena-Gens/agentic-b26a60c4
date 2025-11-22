import { NextResponse } from "next/server";
import { BroadcastPayloadSchema } from "@/lib/schema";
import { PLATFORM_IDS, type PlatformId } from "@/lib/constants";
import { platformHandlers } from "@/lib/platforms";
import type { PlatformResult } from "@/lib/platforms/types";
import { envConfig } from "@/lib/env";

export async function GET() {
  const payload = PLATFORM_IDS.map((id) => {
    const config = envConfig.getPlatformConfig(id);
    return {
      id,
      label: config.label,
      description: config.description,
      documentationUrl: config.documentationUrl,
      isConfigured: config.isConfigured,
    };
  });

  return NextResponse.json({ platforms: payload });
}

export async function POST(request: Request) {
  let raw: unknown;

  try {
    raw = await request.json();
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid JSON payload.", detail: (error as Error).message },
      { status: 400 }
    );
  }

  const parsed = BroadcastPayloadSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Payload validation failed.",
        issues: parsed.error.flatten(),
      },
      { status: 422 }
    );
  }

  const { message, headline, platforms, categories, tone, hashtags } =
    parsed.data;

  const header = buildHeader({
    headline,
    categories,
    tone,
    hashtags,
  });

  const results = await dispatchToPlatforms(platforms, message, header);

  return NextResponse.json({
    ok: true,
    results,
  });
}

async function dispatchToPlatforms(
  platforms: PlatformId[],
  message: string,
  header?: string
) {
  const senders = platforms.map((id) => {
    const handler = platformHandlers[id];
    return handler
      ? handler.sender(message, header)
      : Promise.resolve<PlatformResult>({
          platform: id,
          status: "skipped",
          detail: "No handler registered for this platform.",
        });
  });

  const settled = await Promise.allSettled(senders);

  return settled.map((result, index) => {
    const platform = platforms[index];
    if (result.status === "fulfilled") {
      return result.value;
    }

    return {
      platform,
      status: "failed",
      detail: result.reason instanceof Error ? result.reason.message : String(result.reason),
    };
  });
}

function buildHeader({
  headline,
  categories,
  tone,
  hashtags,
}: {
  headline?: string;
  categories: string[];
  tone?: string;
  hashtags?: string[];
}) {
  const segments = [];

  if (headline) {
    segments.push(headline.trim());
  }

  const descriptors = [
    tone ? tone.toUpperCase() : null,
    categories.length ? categories.join(" • ") : null,
  ].filter(Boolean);

  if (descriptors.length) {
    segments.push(descriptors.join(" | "));
  }

  if (hashtags && hashtags.length) {
    segments.push(hashtags.map((tag) => (tag.startsWith("#") ? tag : `#${tag}`)).join(" "));
  }

  return segments.length ? segments.join("\n") : undefined;
}
