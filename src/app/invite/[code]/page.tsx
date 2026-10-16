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
  return { description, openGraph: { title: ogTitle(), description } };
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
