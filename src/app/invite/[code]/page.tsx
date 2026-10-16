import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { InviteScreen } from "@/components/invite/invite-screen";
import { TopBar } from "@/components/top-bar";
import { getPublicGuest } from "@/lib/data/public-guest";
import { getEventSettings } from "@/lib/data/event-settings";
import { isRsvpClosed, ogDescription, ogTitle } from "@/lib/event";

// Blocking render so an unknown code returns a real 404.
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const description = ogDescription(await getEventSettings());
  // Setting openGraph here replaces the one inherited from the layout, so the card image is repeated.
  const images = [{ url: "/images/og-card.jpg", width: 1200, height: 630, type: "image/jpeg" }];
  return {
    description,
    openGraph: { title: ogTitle(), description, images },
    twitter: { card: "summary_large_image", title: ogTitle(), description, images },
  };
}

export default async function InvitePage({ params }: PageProps<"/invite/[code]">) {
  const { code } = await params;
  await connection();
  const [guest, settings] = await Promise.all([getPublicGuest(code), getEventSettings()]);
  if (!guest) notFound();

  return (
    <>
      <TopBar />
      <InviteScreen guest={guest} closed={isRsvpClosed(settings.rsvpDeadline)} settings={settings} />
    </>
  );
}
