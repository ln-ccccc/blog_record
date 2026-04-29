"use client";

import Link from "next/link";
import { GitBranch } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase/browser";

export default function LoginPage() {
  const enabled = Boolean(getSupabaseBrowser());

  return (
    <div className="min-h-full bg-background px-4 py-10 text-foreground">
      <div className="mx-auto max-w-[520px] rounded-3xl border border-border bg-surface p-8 shadow-[var(--shadow)]">
        <div className="text-lg font-semibold tracking-tight">登录</div>
        <div className="mt-2 text-sm font-medium leading-7 text-[color:var(--color-muted)]">
          使用 GitHub 登录后可以新增条目、写笔记与生成快照；访客默认可公开浏览。
        </div>

        <button
          type="button"
          disabled={!enabled}
          className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-foreground text-sm font-semibold text-background shadow-[var(--shadow)] transition hover:opacity-95 disabled:opacity-50"
          onClick={async () => {
            const supabase = getSupabaseBrowser();
            if (!supabase) return;
            await supabase.auth.signInWithOAuth({
              provider: "github",
              options: { redirectTo: `${window.location.origin}/library` },
            });
          }}
        >
          <GitBranch className="h-4 w-4" />
          GitHub 登录
        </button>

        {!enabled ? (
          <div className="mt-4 rounded-2xl border border-border bg-background p-4 text-xs font-semibold text-[color:var(--color-muted)]">
            未检测到 Supabase 环境变量。请在本地或 Vercel 配置：
            <div className="mt-2 font-mono text-[11px] text-foreground">
              NEXT_PUBLIC_SUPABASE_URL
              <br />
              NEXT_PUBLIC_SUPABASE_ANON_KEY
            </div>
          </div>
        ) : null}

        <div className="mt-6 text-sm font-semibold">
          <Link href="/library" className="text-[color:var(--color-accent)] hover:underline">
            返回阅读库
          </Link>
        </div>
      </div>
    </div>
  );
}
