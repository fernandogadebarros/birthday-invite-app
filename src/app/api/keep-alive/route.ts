import { connection } from "next/server";
import { createServiceClient } from "@/lib/supabase/service-client";

// Daily Vercel Cron: a tiny query keeps the free Supabase project from pausing.
export async function GET(request: Request) {
  await connection();
  if (request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { error } = await createServiceClient().from("guests").select("id", { head: true, count: "exact" });
  if (error) return Response.json({ ok: false }, { status: 500 });
  return Response.json({ ok: true });
}
