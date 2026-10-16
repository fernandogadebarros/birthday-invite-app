import { connection } from "next/server";
import { InviteScreen } from "@/components/invite/invite-screen";
import { TopBar } from "@/components/top-bar";
import { isRsvpClosed } from "@/lib/event";

// Generic link: same invite without a guest; confirming creates a new guest.
export const instant = false;

export default async function HomePage() {
  await connection();
  return (
    <>
      <TopBar />
      <InviteScreen guest={null} closed={isRsvpClosed()} />
    </>
  );
}
