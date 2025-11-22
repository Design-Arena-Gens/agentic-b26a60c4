import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "PulseCast | Multichannel Mindfulness Broadcaster",
  description:
    "Curate and deliver uplifting messages, yoga tips, fitness inspo, and affirmations to WhatsApp, Telegram, Arattai, and Twitter communities from one dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="relative min-h-screen overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-60" />
          <div className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-br from-brand-dark via-[#101231] to-black opacity-90" />
          {children}
        </div>
      </body>
    </html>
  );
}
