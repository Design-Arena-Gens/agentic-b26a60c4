import { TwitterApi } from "twitter-api-v2";
import type { PlatformResult } from "./types";

const appKey = process.env.TWITTER_APP_KEY;
const appSecret = process.env.TWITTER_APP_SECRET;
const accessToken = process.env.TWITTER_ACCESS_TOKEN;
const accessSecret = process.env.TWITTER_ACCESS_SECRET;

export const isTwitterConfigured =
  Boolean(appKey) && Boolean(appSecret) && Boolean(accessToken) && Boolean(accessSecret);

export async function deliverTweet(
  message: string,
  header?: string
): Promise<PlatformResult> {
  if (!isTwitterConfigured) {
    return {
      platform: "twitter",
      status: "skipped",
      detail:
        "Twitter credentials missing. Set TWITTER_APP_KEY, TWITTER_APP_SECRET, TWITTER_ACCESS_TOKEN and TWITTER_ACCESS_SECRET.",
    };
  }

  try {
    const client = new TwitterApi({
      appKey: appKey!,
      appSecret: appSecret!,
      accessToken: accessToken!,
      accessSecret: accessSecret!,
    });

    const status = header ? `${header}\n\n${message}` : message;
    if (status.length > 280) {
      throw new Error(
        `Tweet exceeds 280 characters (${status.length}). Shorten your message or remove the header.`
      );
    }

    const tweet = await client.v2.tweet(status);
    return {
      platform: "twitter",
      status: "sent",
      detail: "Published tweet successfully",
      metadata: {
        tweetId: tweet.data.id,
      },
    };
  } catch (error) {
    const err = error as Error;
    return {
      platform: "twitter",
      status: "failed",
      detail: err.message,
    };
  }
}
