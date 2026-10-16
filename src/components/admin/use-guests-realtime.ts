"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser-client";

const DEBOUNCE_MS = 400;

/**
 * Refreshes the server-rendered admin page whenever a guest row changes
 * (new RSVP, invite sent, guest added). Realtime respects RLS, so only
 * allowlisted admins receive events. Bursts (e.g. bulk reminders) collapse
 * into a single refresh.
 */
export function useGuestsRealtime() {
  const router = useRouter();
  const routerRef = useRef(router);
  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  useEffect(() => {
    const supabase = createBrowserSupabase();
    let timer: ReturnType<typeof setTimeout> | undefined;
    const refresh = () => {
      clearTimeout(timer);
      timer = setTimeout(() => routerRef.current.refresh(), DEBOUNCE_MS);
    };

    // Never refresh on SUBSCRIBED: a refresh can remount the dashboard, which
    // would resubscribe and refresh again, forever.
    const channel = supabase
      .channel("admin-guests")
      .on("postgres_changes", { event: "*", schema: "public", table: "guests" }, refresh)
      .subscribe();

    // Catch up on anything missed while the tab was in the background or offline.
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      clearTimeout(timer);
      void supabase.removeChannel(channel);
    };
  }, []);
}
