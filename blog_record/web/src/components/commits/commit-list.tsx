"use client";

import Link from "next/link";
import type { Activity } from "@/lib/types";
import { formatDay, formatTime } from "@/lib/date";

export function CommitList({ activities }: { activities: Activity[] }) {
  const groups = groupByDay(activities);
  return (
    <div className="grid gap-6 pb-20 md:pb-0">
      {Object.entries(groups).map(([day, list]) => (
        <section key={day} className="grid gap-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold text-foreground">{day}</h2>
            <div className="text-xs font-semibold text-[color:var(--color-muted)]">
              {list.length} 次
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-surface shadow-[var(--shadow)]">
            <ul className="divide-y divide-[color:var(--color-border)]">
              {list.map((a) => (
                <li key={a.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-[color:var(--color-muted)]">
                        {a.type === "paper" ? "Paper" : "Blog"} · {formatTime(a.createdAt)}
                      </div>
                      <Link
                        href={`/item/${a.itemId}`}
                        className="mt-1 block truncate text-sm font-semibold text-foreground hover:underline"
                        title={a.message}
                      >
                        {a.message}
                      </Link>
                    </div>
                    <span className="shrink-0 rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold text-[color:var(--color-muted)]">
                      {a.action}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}
    </div>
  );
}

function groupByDay(activities: Activity[]) {
  const sorted = [...activities].sort((x, y) => (x.createdAt < y.createdAt ? 1 : -1));
  const map: Record<string, Activity[]> = {};
  for (const a of sorted) {
    const day = formatDay(a.createdAt);
    map[day] ||= [];
    map[day].push(a);
  }
  return map;
}

