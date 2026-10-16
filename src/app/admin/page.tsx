import type { Metadata } from "next";
import { connection } from "next/server";
import { signOut } from "@/actions/guest-actions";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { TopBar } from "@/components/top-bar";
import { getEventSettings } from "@/lib/data/event-settings";
import { siteUrl } from "@/lib/event";
import type { Guest } from "@/lib/guest";
import { createSessionClient, getAdminEmail } from "@/lib/supabase/session-client";

export const instant = false;
export const metadata: Metadata = { title: "Lista de presença" };

function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="h-8 cursor-pointer rounded-full border border-transparent px-3.5 font-sans text-small font-medium text-pink-soft hover:bg-white/10"
      >
        Sair
      </button>
    </form>
  );
}

export default async function AdminPage() {
  await connection();
  const email = await getAdminEmail();

  if (!email) {
    return (
      <>
        <TopBar>
          <SignOutButton />
        </TopBar>
        <main className="flex flex-1 justify-center px-4 pt-8 pb-16">
          <section className="flex w-full max-w-[420px] flex-col gap-3.5 self-start rounded-card border border-line bg-panel p-6">
            <h1 className="m-0 font-sans text-title leading-[1.2] font-semibold tracking-tight text-ink">Sem acesso</h1>
            <p className="m-0 font-sans text-body leading-[1.6] text-body">Este email não está na lista de administradores da festa.</p>
          </section>
        </main>
      </>
    );
  }

  const supabase = await createSessionClient();
  const [{ data, error }, settings] = await Promise.all([
    supabase.from("guests").select("*").order("created_at", { ascending: true }),
    getEventSettings(),
  ]);
  if (error) throw error;

  return (
    <>
      <TopBar>
        <span className="font-sans text-micro text-pink-soft">{email}</span>
        <SignOutButton />
      </TopBar>
      <AdminDashboard guests={data as Guest[]} nowIso={new Date().toISOString()} baseUrl={siteUrl()} settings={settings} />
    </>
  );
}
