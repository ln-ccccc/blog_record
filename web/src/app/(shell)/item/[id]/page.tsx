"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import { useSession } from "@/components/auth/use-session";
import { getItem, isSupabaseEnabled } from "@/lib/data";
import type { Item } from "@/lib/types";
import { NoteEditor } from "@/components/item/note-editor";

export default function ItemPage({ params }: { params: { id: string } }) {
  const { user } = useSession();
  const supabaseEnabled = useMemo(() => isSupabaseEnabled(), []);
  const canEdit = supabaseEnabled ? Boolean(user) : true;

  const [item, setItem] = useState<Item | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getItem(params.id).then((x) => {
      setItem(x);
      setReady(true);
    });
  }, [params.id]);

  if (!ready) {
    return (
      <div className="grid gap-4">
        <div className="h-28 animate-pulse rounded-2xl border border-border bg-surface shadow-[var(--shadow)]" />
        <div className="h-[520px] animate-pulse rounded-2xl border border-border bg-surface shadow-[var(--shadow)]" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 text-sm font-semibold text-[color:var(--color-muted)] shadow-[var(--shadow)]">
        条目不存在
      </div>
    );
  }

  return (
    <div className="grid gap-4 pb-20 md:pb-0">
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow)]">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[color:var(--color-muted)]">
            <span className="rounded-full border border-border bg-background px-2 py-0.5">
              {item.type === "paper" ? "Paper" : "Blog"}
            </span>
            <span>{item.source}</span>
            <span>·</span>
            <span>{item.createdAt.slice(0, 10)}</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-lg font-semibold tracking-tight text-foreground">{item.title}</h1>
            <Link
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-foreground px-4 text-sm font-semibold text-background shadow-[var(--shadow)] transition hover:opacity-95"
            >
              <ExternalLink className="h-4 w-4" />
              打开原文
            </Link>
          </div>
          {item.tags.length ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {item.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold text-[color:var(--color-muted)]"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-border bg-surface shadow-[var(--shadow)]">
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
            <div className="text-sm font-semibold text-foreground">阅读快照</div>
            <button
              type="button"
              disabled
              className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-[color:var(--color-muted)] opacity-60"
            >
              生成快照（下一步）
            </button>
          </div>
          <div className="p-4 text-sm font-medium leading-7 text-[color:var(--color-muted)]">
            当前版本先提供结构与交互占位。接入 Supabase 后，可以在这里展示抓取后的正文快照（Markdown/HTML）
            或 PDF 预览。
          </div>
        </div>
        <div className="h-[520px]">
          <NoteEditor itemId={item.id} canEdit={canEdit} />
        </div>
      </div>
    </div>
  );
}

