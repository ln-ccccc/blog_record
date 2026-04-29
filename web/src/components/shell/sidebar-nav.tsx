"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, GitCommitHorizontal, PlusCircle, Settings } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "side" | "bottom";

const items = [
  { href: "/library", label: "阅读库", icon: BookOpen },
  { href: "/commits", label: "提交", icon: GitCommitHorizontal },
  { href: "/new", label: "新增", icon: PlusCircle },
  { href: "/settings", label: "设置", icon: Settings },
] as const;

export function SidebarNav({ variant = "side" }: { variant?: Variant }) {
  const pathname = usePathname();

  if (variant === "bottom") {
    return (
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] items-center justify-around px-4 py-3">
          {items.map((it) => {
            const active = pathname === it.href || pathname.startsWith(`${it.href}/`);
            const Icon = it.icon;
            return (
              <Link
                key={it.href}
                href={it.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold transition",
                  active ? "text-foreground" : "text-[color:var(--color-muted)]"
                )}
              >
                <Icon className={cn("h-5 w-5", active ? "opacity-100" : "opacity-80")} />
                <span>{it.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-6 hidden h-fit rounded-2xl border border-border bg-surface shadow-[var(--shadow)] md:block">
      <div className="flex flex-col items-center gap-1 p-2">
        {items.map((it) => {
          const active = pathname === it.href || pathname.startsWith(`${it.href}/`);
          const Icon = it.icon;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "group flex h-14 w-14 items-center justify-center rounded-2xl transition",
                active
                  ? "bg-surface-2 text-foreground"
                  : "text-[color:var(--color-muted)] hover:bg-surface-2 hover:text-foreground"
              )}
              aria-label={it.label}
              title={it.label}
            >
              <Icon className="h-5 w-5" />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

