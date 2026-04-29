"use client";

import { useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseBrowser } from "@/lib/supabase/browser";

export function useSession() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [ready, setReady] = useState(() => !supabase);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  const user: User | null = session?.user ?? null;

  return {
    enabled: Boolean(supabase),
    ready,
    session,
    user,
  };
}
