import { notFound } from "next/navigation";
import { connection } from "next/server";
import { InviteScreen } from "@/components/invite/invite-screen";
import { TopBar } from "@/components/top-bar";
import { getPublicGuest } from "@/lib/data/public-guest";
import { isRsvpClosed } from "@/lib/event";

// Blocking render so an unknown code returns a real 404.
export const instant = false;

export default async function InvitePage({ params }: PageProps<"/invite/[code]">) {
  const { code } = await params;
  await connection();
  const guest = await getPublicGuest(code);
  if (!guest) notFound();

  return (
    <>
      <TopBar />
      <InviteScreen guest={guest} closed={isRsvpClosed()} />
    </>
  );
}
