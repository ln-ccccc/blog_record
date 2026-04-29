"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ReadingCard } from "@/components/library/reading-card";
import type { Item, ItemStatus, ItemType } from "@/lib/types";
import { listItems } from "@/lib/data";
import { cn } from "@/lib/cn";

type FilterType = ItemType | "all";
type FilterStatus = ItemStatus | "all";

const chipsType: Array<{ key: FilterType; label: string }> = [
  { key: "all", label: "全部" },
  { key: "blog", label: "Blog" },
  { key: "paper", label: "Paper" },
];

const chipsStatus: Array<{ key: FilterStatus; label: string }> = [
  { key: "all", label: "全部状态" },
  { key: "unread", label: "未读" },
  { key: "reading", label: "在读" },
  { key: "done", label: "已读" },
];

export default function LibraryPage() {
  return (
    <Suspense fallback={<LibraryFallback />}>
      <LibraryInner />
    </Suspense>
  );
}

function LibraryFallback() {
  return (
    <div className="grid gap-4">
      {Array.from({ length: 5 }).map((_, idx) => (
        <div
          key={idx}
          className="h-24 animate-pulse rounded-2xl border border-border bg-surface shadow-[var(--shadow)]"
        />
      ))}
    </div>
  );
}

function LibraryInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const q = (sp.get("q") ?? "").trim().toLowerCase();
  const type = (sp.get("type") ?? "all") as FilterType;
  const status = (sp.get("status") ?? "all") as FilterStatus;

  const [items, setItems] = useState<Item[] | null>(null);

  useEffect(() => {
    listItems().then((data) => setItems(data));
  }, []);

  const filtered = useMemo(() => {
    const base = items ?? [];
    return base.filter((it) => {
      if (type !== "all" && it.type !== type) return false;
      if (status !== "all" && it.status !== status) return false;
      if (!q) return true;
      const hay = `${it.title} ${it.source} ${it.tags.join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, q, status, type]);

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(sp.toString());
    if (!value || value === "all") params.delete(key);
    else params.set(key, value);
    router.push(`/library?${params.toString()}`);
  }

  return (
    <div className="min-w-0">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {chipsType.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setParam("type", c.key === "all" ? null : c.key)}
              className={cn(
                "rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold shadow-[var(--shadow)] transition hover:bg-surface-2",
                (type === c.key || (c.key === "all" && type === "all")) &&
                  "border-[color:var(--color-accent)]"
              )}
            >
              {c.label}
            </button>
          ))}
          <div className="mx-1 h-5 w-px bg-border" />
          {chipsStatus.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setParam("status", c.key === "all" ? null : c.key)}
              className={cn(
                "rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold shadow-[var(--shadow)] transition hover:bg-surface-2",
                (status === c.key || (c.key === "all" && status === "all")) &&
                  "border-[color:var(--color-accent)]"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        {items === null ? (
          <div className="grid gap-4">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="h-24 animate-pulse rounded-2xl border border-border bg-surface shadow-[var(--shadow)]"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 pb-20 md:pb-0">
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-border bg-surface p-6 text-sm font-semibold text-[color:var(--color-muted)] shadow-[var(--shadow)]">
                没有匹配的条目
              </div>
            ) : (
              filtered.map((it) => <ReadingCard key={it.id} item={it} />)
            )}
          </div>
        )}
      </div>
    </div>
  );
}
