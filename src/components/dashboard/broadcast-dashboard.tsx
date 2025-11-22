"use client";

import { useMemo, useState } from "react";
import { clsx } from "clsx";
import {
  DEFAULT_HASHTAGS,
  MESSAGE_CATEGORIES,
  PLATFORM_IDS,
  TONE_OPTIONS,
  type MessageCategory,
  type PlatformId,
  type ToneOption,
} from "@/lib/constants";

type PlatformDescriptor = {
  id: PlatformId;
  label: string;
  description: string;
  isConfigured: boolean;
  documentationUrl: string;
};

type BroadcastDashboardProps = {
  platforms: PlatformDescriptor[];
};

type BroadcastResult = {
  platform: PlatformId;
  status: "sent" | "failed" | "skipped";
  detail: string;
};

const PROMPT_IDEAS = [
  "Every breath is a reset button. Inhale balance, exhale pressure.",
  "Mini challenge: 20 mindful squats while reciting your favorite mantra.",
  "Pause. Drop your shoulders. unclench your jaw. Smile at the next moment.",
  "Today’s affirmation: I give myself permission to heal, move, and glow.",
  "Yoga micro-flow: Cat, Cow, Thread-the-Needle. 3 breaths each. Reboot your spine.",
  "Meditation cue: Close your eyes, follow 10 heartbeats, whisper thank you.",
];

const categoryPalette: Record<MessageCategory, string> = {
  "Quote": "from-indigo-500/10 to-indigo-500/0 text-indigo-200 border-indigo-500/40",
  "One-Liner": "from-fuchsia-500/10 to-fuchsia-500/0 text-fuchsia-200 border-fuchsia-500/40",
  "Affirmation": "from-emerald-500/10 to-emerald-500/0 text-emerald-200 border-emerald-500/40",
  "Yoga Tip": "from-cyan-500/10 to-cyan-500/0 text-cyan-200 border-cyan-500/40",
  "Fitness Tip": "from-orange-500/10 to-orange-500/0 text-orange-200 border-orange-500/40",
  "Meditation Insight": "from-purple-500/10 to-purple-500/0 text-purple-200 border-purple-500/40",
  "Mindfulness Reminder": "from-lime-500/10 to-lime-500/0 text-lime-200 border-lime-500/40",
};

export function BroadcastDashboard({ platforms }: BroadcastDashboardProps) {
  const [headline, setHeadline] = useState("Daily Dose of Calm Energy");
  const [message, setMessage] = useState(
    "Breathe in for 4, hold for 4, exhale for 6. Feel how your body softens when you lengthen the out-breath. Try it twice today and let the ripples steady you."
  );
  const [categories, setCategories] = useState<MessageCategory[]>([
    "Mindfulness Reminder",
    "Yoga Tip",
  ]);
  const [tone, setTone] = useState<ToneOption>("Calming");
  const [hashtags, setHashtags] = useState<string[]>([
    "#Mindfulness",
    "#YogaJourney",
    "#DailyAffirmation",
  ]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>(
    platforms.filter((platform) => platform.isConfigured).map((p) => p.id)
  );
  const [isSending, setIsSending] = useState(false);
  const [results, setResults] = useState<BroadcastResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const configuredCount = useMemo(
    () => platforms.filter((platform) => platform.isConfigured).length,
    [platforms]
  );

  const toggleCategory = (category: MessageCategory) => {
    setCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const togglePlatform = (platformId: PlatformId) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((item) => item !== platformId)
        : [...prev, platformId]
    );
  };

  const toggleHashtag = (tag: string) => {
    setHashtags((prev) =>
      prev.includes(tag)
        ? prev.filter((item) => item !== tag)
        : [...prev, tag]
    );
  };

  const pickIdea = (idea: string) => {
    setMessage(idea);
  };

  const handleBroadcast = async () => {
    setIsSending(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch("/api/broadcast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          headline,
          message,
          categories,
          tone,
          hashtags,
          platforms: selectedPlatforms,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(
          payload?.message ??
            "Failed to broadcast message. Please review your configuration."
        );
      }

      const payload = (await response.json()) as {
        results: BroadcastResult[];
      };

      setResults(payload.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSending(false);
    }
  };

  const disableSend =
    !message.trim().length ||
    !headline?.trim().length ||
    categories.length === 0 ||
    selectedPlatforms.length === 0 ||
    isSending;

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-6 rounded-3xl border border-white/5 bg-black/30 p-10 shadow-card backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.4rem] text-white/60">
              Multichannel Mindfulness Broadcasting
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
              PulseCast Control Center
            </h1>
            <p className="mt-3 max-w-2xl text-base text-white/70">
              Craft grounded affirmations, yoga wisdom, and focused fitness
              cues, then deliver them instantly to your vibrant WhatsApp,
              Telegram, Arattai, and Twitter communities.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-white/70 backdrop-blur">
            <p className="text-sm uppercase tracking-widest text-white/50">
              Active Channels
            </p>
            <p className="mt-2 text-3xl font-semibold text-brand-secondary">
              {configuredCount}/{PLATFORM_IDS.length}
            </p>
            <p className="text-xs text-white/50">
              Connect credentials to broadcast everywhere.
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-3xl border border-white/5 bg-white/[0.04] p-8 shadow-card backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-medium text-white">
                1. Shape the message
              </h2>
              <button
                type="button"
                onClick={() =>
                  pickIdea(
                    PROMPT_IDEAS[Math.floor(Math.random() * PROMPT_IDEAS.length)]
                  )
                }
                className="rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-white/70 transition hover:border-brand-primary/60 hover:text-white"
              >
                Surprise me ✨
              </button>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <label
                  htmlFor="headline"
                  className="block text-xs uppercase tracking-[0.35rem] text-white/50"
                >
                  Headline
                </label>
                <input
                  id="headline"
                  value={headline}
                  onChange={(event) => setHeadline(event.target.value)}
                  placeholder="Breathe + Flow Reset"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-brand-primary/70 focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-xs uppercase tracking-[0.35rem] text-white/50"
                >
                  Core message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={6}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-base leading-relaxed text-white placeholder:text-white/40 focus:border-brand-primary/70 focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                  placeholder="Compose your mindful nudge..."
                />
              </div>

              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.35rem] text-white/50">
                  Focus lanes
                </p>
                <div className="flex flex-wrap gap-3">
                  {MESSAGE_CATEGORIES.map((category) => {
                    const isActive = categories.includes(category);
                    return (
                      <button
                        type="button"
                        key={category}
                        onClick={() => toggleCategory(category)}
                        className={clsx(
                          "rounded-full border px-4 py-2 text-sm transition",
                          "bg-gradient-to-r",
                          categoryPalette[category],
                          isActive
                            ? "scale-100 border-white/40 text-white shadow-lg shadow-black/40"
                            : "opacity-60 hover:opacity-100"
                        )}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-[1fr,1fr] sm:items-center">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.35rem] text-white/50">
                    Tone
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {TONE_OPTIONS.map((option) => {
                      const isActive = tone === option;
                      return (
                        <button
                          type="button"
                          key={option}
                          onClick={() => setTone(option)}
                          className={clsx(
                            "rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-widest transition",
                            isActive
                              ? "bg-brand-primary/80 text-white shadow-lg shadow-brand-primary/40"
                              : "bg-white/[0.03] text-white/60 hover:text-white"
                          )}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.35rem] text-white/50">
                    Hashtags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {DEFAULT_HASHTAGS.map((tag) => {
                      const isActive = hashtags.includes(tag);
                      return (
                        <button
                          type="button"
                          key={tag}
                          onClick={() => toggleHashtag(tag)}
                          className={clsx(
                            "rounded-full border border-white/10 px-3 py-2 text-sm transition",
                            isActive
                              ? "bg-white/15 text-white shadow-md shadow-white/20"
                              : "bg-black/30 text-white/60 hover:text-white"
                          )}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="custom-tags"
                  className="block text-xs uppercase tracking-[0.35rem] text-white/50"
                >
                  Custom hashtags (comma separated)
                </label>
                <input
                  id="custom-tags"
                  placeholder="#TeamCalm, #StretchBreak"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-brand-primary/70 focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                  onBlur={(event) => {
                    const extra = event.target.value
                      .split(",")
                      .map((entry) => entry.trim())
                      .filter(Boolean);
                    if (extra.length) {
                      setHashtags((prev) =>
                        Array.from(
                          new Set([
                            ...prev,
                            ...extra.map((tag) =>
                              tag.startsWith("#") ? tag : `#${tag}`
                            ),
                          ])
                        )
                      );
                      event.target.value = "";
                    }
                  }}
                />
                <p className="mt-2 text-xs text-white/40">
                  Blur the input or press tab to add hashtags.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-8 shadow-card backdrop-blur">
            <h2 className="text-lg font-medium text-white">
              2. Preview headline packet
            </h2>
            <div className="mt-4 space-y-4 rounded-2xl border border-white/10 bg-black/50 p-5 text-sm leading-relaxed text-white/80">
              <div>
                <p className="text-xs uppercase tracking-[0.35rem] text-brand-primary/80">
                  Header
                </p>
                <p className="mt-1 text-base font-medium text-white">
                  {headline}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35rem] text-brand-primary/80">
                  Message
                </p>
                <p className="mt-1 whitespace-pre-line">{message}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs text-white/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-8">
          <div className="rounded-3xl border border-white/5 bg-white/[0.04] p-6 shadow-card backdrop-blur">
            <h2 className="text-lg font-medium text-white">
              3. Choose destinations
            </h2>
            <div className="mt-4 space-y-4">
              {platforms.map((platform) => {
                const isActive = selectedPlatforms.includes(platform.id);
                return (
                  <button
                    key={platform.id}
                    type="button"
                    onClick={() => togglePlatform(platform.id)}
                    className={clsx(
                      "w-full rounded-2xl border px-4 py-4 text-left transition hover:shadow-md",
                      platform.isConfigured
                        ? "border-white/10 bg-black/40 text-white/80 hover:border-brand-primary/60"
                        : "border-dashed border-white/20 bg-black/30 text-white/40 hover:border-white/30",
                      isActive && platform.isConfigured
                        ? "border-brand-secondary/70 bg-brand-secondary/20 text-white"
                        : null
                    )}
                    disabled={!platform.isConfigured}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-base font-medium text-white">
                          {platform.label}
                        </p>
                        <p className="mt-1 text-xs text-white/60">
                          {platform.description}
                        </p>
                      </div>
                      <span
                        className={clsx(
                          "rounded-full px-3 py-1 text-xs uppercase tracking-widest",
                          platform.isConfigured
                            ? "bg-brand-secondary/80 text-white shadow shadow-brand-secondary/50"
                            : "bg-white/10 text-white/50"
                        )}
                      >
                        {platform.isConfigured ? "Connected" : "Setup"}
                      </span>
                    </div>
                    {!platform.isConfigured && (
                      <p className="mt-3 text-xs text-white/40">
                        Add credentials in environment: see{" "}
                        <a
                          className="text-brand-primary hover:underline"
                          href={platform.documentationUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          docs
                        </a>
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-brand-primary/20 bg-brand-primary/5 p-6 shadow-card backdrop-blur">
            <h2 className="text-lg font-medium text-white">
              4. Launch broadcast
            </h2>
            <p className="mt-2 text-sm text-white/60">
              PulseCast will trigger platform APIs instantly using the secure
              credentials you configure.
            </p>
            <button
              type="button"
              onClick={handleBroadcast}
              disabled={disableSend}
              className={clsx(
                "mt-6 w-full rounded-full px-6 py-3 text-base font-medium transition focus:outline-none focus:ring-4 focus:ring-brand-primary/40",
                disableSend
                  ? "cursor-not-allowed border border-white/10 bg-white/5 text-white/40"
                  : "border border-brand-primary/60 bg-brand-primary/90 text-white shadow-lg shadow-brand-primary/40 hover:bg-brand-primary"
              )}
            >
              {isSending ? "Broadcasting..." : "Send to selected channels"}
            </button>
            <p className="mt-3 text-xs text-white/40">
              Ensure you comply with each platform’s automation policies.
            </p>
          </div>

          <div className="rounded-3xl border border-white/5 bg-black/50 p-6 text-sm text-white/70 shadow-card backdrop-blur">
            <h3 className="text-white text-base font-medium">
              Broadcast health
            </h3>
            {error && (
              <p className="mt-3 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </p>
            )}
            {results && (
              <ul className="mt-4 space-y-3">
                {results.map((result) => (
                  <li
                    key={result.platform}
                    className={clsx(
                      "rounded-2xl border px-4 py-3",
                      result.status === "sent" &&
                        "border-emerald-500/40 bg-emerald-500/10 text-emerald-100",
                      result.status === "failed" &&
                        "border-red-500/40 bg-red-500/10 text-red-200",
                      result.status === "skipped" &&
                        "border-yellow-500/40 bg-yellow-500/10 text-yellow-200"
                    )}
                  >
                    <p className="text-sm font-medium capitalize">
                      {result.platform}
                    </p>
                    <p className="text-xs mt-1 opacity-80">{result.detail}</p>
                  </li>
                ))}
              </ul>
            )}
            {!results && !error && (
              <p className="mt-3 text-xs text-white/40">
                Broadcast insights will appear here after you send.
              </p>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}
