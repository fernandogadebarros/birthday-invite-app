import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ageLabel, event, ogTitle, siteUrl } from "@/lib/event";
import "./globals.css";

// Same woff2 files Google Fonts serves to browsers (and the prototype uses).
// next/font/google downloads a Fredoka build with a width axis that renders
// ~6% wider than the design.
const fredoka = localFont({
  src: "./fonts/fredoka-latin.woff2",
  weight: "300 700",
  variable: "--font-fredoka",
});

const greatVibes = localFont({
  src: "./fonts/great-vibes-latin.woff2",
  weight: "400",
  variable: "--font-great-vibes",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: `${event.copy.brand} · ${event.celebrant.age} ${ageLabel()}`,
  description: `Confirme sua presença na festa da ${event.celebrant.nickname}`,
  openGraph: {
    title: ogTitle(),
    description: `Confirme sua presença na festa da ${event.celebrant.nickname}`,
    type: "website",
    locale: "pt_BR",
    images: [{ url: "/images/og-card.jpg", width: 1200, height: 630, type: "image/jpeg" }],
  },
  twitter: { card: "summary_large_image", images: ["/images/og-card.jpg"] },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#3d2a32",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${fredoka.variable} ${greatVibes.variable} antialiased`}>
      <body className="bg-dots flex min-h-screen flex-col bg-page">{children}</body>
    </html>
  );
}
