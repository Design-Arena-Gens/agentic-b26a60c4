# PulseCast

PulseCast is a composable broadcast cockpit for wellness creators who want to deliver quotes, affirmations, yoga prompts, fitness nudges, and meditation cues directly to their WhatsApp groups, Telegram communities, Arattai channels, and Twitter (X) audience from one harmonised dashboard.

## ✨ Features

- Rich composer with headline, tone, focus-lane tags, and hashtag helpers
- Multi-platform selection with real-time connection status indicators
- Secure backend adapters for WhatsApp (Twilio), Telegram Bots, Arattai webhooks, and Twitter/X
- Responsive, glassmorphic interface optimised for desktop and tablet operations
- Broadcast report panel with per-platform success, failure, or skipped feedback

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## 🔐 Platform Configuration

Add credentials to `.env.local` before broadcasting:

```ini
# WhatsApp via Twilio
WHATSAPP_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
WHATSAPP_AUTH_TOKEN=your_twilio_auth_token
WHATSAPP_FROM=whatsapp:+14155238886
WHATSAPP_RECIPIENTS=whatsapp:+1234567890,whatsapp:+1987654321

# Telegram Bot
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
TELEGRAM_CHAT_IDS=-1001234567890,-100987654321

# Arattai (custom webhook integrations)
ARATTAI_WEBHOOK_URLS=https://hooks.example.com/arattai/team-a,https://hooks.example.com/arattai/team-b

# Twitter / X OAuth 1.0a
TWITTER_APP_KEY=your_app_key
TWITTER_APP_SECRET=your_app_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_SECRET=your_access_secret
```

Restart `npm run dev` after editing environment variables. Configure any platform to see it instantly marked as “Connected” in the UI.

## 🧪 Linting

```bash
npm run lint
```

## 📦 Deployment

Build with `npm run build`. PulseCast is designed for seamless deployment on Vercel.
