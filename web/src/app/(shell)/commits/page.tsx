"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Activity } from "@/lib/types";
import { listActivities } from "@/lib/data";
import { CommitList } from "@/components/commits/commit-list";

export default function CommitsPage() {
  return (
    <Suspense fallback={<CommitsFallback />}>
      <CommitsInner />
    </Suspense>
  );
}

function CommitsFallback() {
  return (
    <div className="grid gap-4">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={idx}
          className="h-14 animate-pulse rounded-2xl border border-border bg-surface shadow-[var(--shadow)]"
        />
      ))}
    </div>
  );
}

function CommitsInner() {
  const sp = useSearchParams();
  const q = (sp.get("q") ?? "").trim().toLowerCase();
  const [activities, setActivities] = useState<Activity[] | null>(null);

  useEffect(() => {
    listActivities().then((data) => setActivities(data));
  }, []);

  const filtered = useMemo(() => {
    const base = activities ?? [];
    if (!q) return base;
    return base.filter((a) => a.message.toLowerCase().includes(q));
  }, [activities, q]);

  if (activities === null) {
    return (
      <div className="grid gap-4">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="h-14 animate-pulse rounded-2xl border border-border bg-surface shadow-[var(--shadow)]"
          />
        ))}
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 text-sm font-semibold text-[color:var(--color-muted)] shadow-[var(--shadow)]">
        没有匹配的提交
      </div>
    );
  }

  return <CommitList activities={filtered} />;
}
