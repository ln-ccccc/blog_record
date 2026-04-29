"use client";

import Link from "next/link";
import type { Item } from "@/lib/types";
import { cn } from "@/lib/cn";

const statusLabel: Record<Item["status"], string> = {
  unread: "未读",
  reading: "在读",
  done: "已读",
};

export function ReadingCard({ item }: { item: Item }) {
  return (
    <Link
      href={`/item/${item.id}`}
      className={cn(
        "group block rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow)] transition hover:-translate-y-0.5 hover:bg-surface-2"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-[color:var(--color-muted)]">
            <span className="rounded-full border border-border bg-background px-2 py-0.5">
              {item.type === "paper" ? "Paper" : "Blog"}
            </span>
            <span className="truncate">{item.source}</span>
            <span>·</span>
            <span>{item.createdAt.slice(0, 10)}</span>
          </div>
          <h3 className="mt-2 max-h-[3.25rem] overflow-hidden text-base font-semibold tracking-tight text-foreground">
            {item.title}
          </h3>
        </div>
        <div className="shrink-0">
          <span
            className={cn(
              "inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold",
              item.status === "unread" && "text-[color:var(--color-accent)]",
              item.status === "reading" && "text-[color:var(--color-accent-2)]",
              item.status === "done" && "text-[color:var(--color-muted)]"
            )}
          >
            {statusLabel[item.status]}
          </span>
        </div>
      </div>
      {item.tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags.slice(0, 6).map((t) => (
            <span
              key={t}
              className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold text-[color:var(--color-muted)]"
            >
              {t}
            </span>
          ))}
        </div>
      ) : null}
    </Link>
  );
}
