export const PLATFORM_IDS = [
  "whatsapp",
  "telegram",
  "arattai",
  "twitter",
] as const;

export type PlatformId = (typeof PLATFORM_IDS)[number];

export const MESSAGE_CATEGORIES = [
  "Quote",
  "One-Liner",
  "Affirmation",
  "Yoga Tip",
  "Fitness Tip",
  "Meditation Insight",
  "Mindfulness Reminder",
] as const;

export type MessageCategory = (typeof MESSAGE_CATEGORIES)[number];

export const TONE_OPTIONS = [
  "Calming",
  "Motivational",
  "Playful",
  "Grounding",
  "Uplifting",
  "Reflective",
] as const;

export type ToneOption = (typeof TONE_OPTIONS)[number];

export const DEFAULT_HASHTAGS = [
  "#Mindfulness",
  "#Wellness",
  "#DailyAffirmation",
  "#YogaJourney",
  "#FitnessFlow",
  "#MeditationMoments",
] as const;
