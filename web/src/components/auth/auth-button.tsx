"use client";

import Link from "next/link";
import { LogIn, LogOut } from "lucide-react";
import { cn } from "@/lib/cn";
import { useSession } from "@/components/auth/use-session";
import { getSupabaseBrowser } from "@/lib/supabase/browser";

export function AuthButton({ className }: { className?: string }) {
  const { enabled, ready, user } = useSession();

  if (!ready) {
    return (
      <div
        className={cn(
          "h-10 w-28 animate-pulse rounded-xl border border-border bg-surface shadow-[var(--shadow)]",
          className
        )}
      />
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className={cn(
          "inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-surface px-3 text-sm font-semibold text-foreground shadow-[var(--shadow)] transition hover:bg-surface-2",
          className
        )}
      >
        <LogIn className="h-4 w-4" />
        <span>{enabled ? "登录" : "登录（未配置）"}</span>
      </Link>
    );
  }

  const label =
    (user.user_metadata?.user_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    user.email ??
    "已登录";

  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-surface px-3 text-sm font-semibold text-foreground shadow-[var(--shadow)] transition hover:bg-surface-2",
        className
      )}
      onClick={async () => {
        const supabase = getSupabaseBrowser();
        if (!supabase) return;
        await supabase.auth.signOut();
      }}
      aria-label="退出登录"
      title={label}
    >
      <span className="max-w-32 truncate">{label}</span>
      <LogOut className="h-4 w-4 opacity-80" />
    </button>
  );
}

