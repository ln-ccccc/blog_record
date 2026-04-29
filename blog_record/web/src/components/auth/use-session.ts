"use client";

import { useEffect, useState } from "react";
import type { Session, SupabaseClient, User } from "@supabase/supabase-js";
import { getSupabaseBrowser } from "@/lib/supabase/browser";

export function useSession() {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const client = getSupabaseBrowser();
    setSupabase(client);
    if (!client) {
      setReady(true);
      return;
    }
    client.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setReady(true);
    });
    const { data } = client.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const user: User | null = session?.user ?? null;

  return {
    enabled: Boolean(supabase),
    ready,
    session,
    user,
  };
}
