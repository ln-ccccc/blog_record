"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { AuthButton } from "@/components/auth/auth-button";
import { cn } from "@/lib/cn";

export function TopBar() {
  return (
    <Suspense fallback={<TopBarFallback />}>
      <TopBarInner />
    </Suspense>
  );
}

function TopBarFallback() {
  return (
    <header className="flex items-center justify-between gap-3">
      <div className="min-w-0 flex-1">
        <div className="h-11 w-full animate-pulse rounded-2xl border border-border bg-surface shadow-[var(--shadow)]" />
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="hidden h-10 w-28 animate-pulse rounded-xl border border-border bg-surface shadow-[var(--shadow)] sm:block" />
      </div>
    </header>
  );
}

function TopBarInner() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const showSearch = useMemo(
    () => pathname === "/library" || pathname === "/commits",
    [pathname]
  );
  const initial = searchParams.get("q") ?? "";
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.value = initial;
  }, [initial]);

  return (
    <header className="flex items-center justify-between gap-3">
      <div className="min-w-0 flex-1">
        <form
          className={cn(
            "relative flex items-center",
            showSearch ? "opacity-100" : "opacity-60"
          )}
          onSubmit={(e) => {
            e.preventDefault();
            const params = new URLSearchParams(searchParams.toString());
            const raw = inputRef.current?.value ?? "";
            const next = raw.trim();
            if (next) params.set("q", next);
            else params.delete("q");
            router.push(`${pathname}?${params.toString()}`);
          }}
        >
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--color-muted)]">
            <Search className="h-4 w-4" />
          </div>
          <input
            ref={inputRef}
            defaultValue={initial}
            disabled={!showSearch}
            placeholder="搜索标题 / 来源 / 标签"
            className="h-11 w-full rounded-2xl border border-border bg-surface px-10 text-sm font-medium text-foreground shadow-[var(--shadow)] outline-none transition placeholder:text-[color:var(--color-muted)] focus:border-[color:var(--color-accent)]"
          />
        </form>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <AuthButton className="hidden sm:inline-flex" />
      </div>
    </header>
  );
}
