"use client";

import { useEffect, useState } from "react";
import { upsertNote, getNote } from "@/lib/data";
import { cn } from "@/lib/cn";

export function NoteEditor({ itemId, canEdit }: { itemId: string; canEdit: boolean }) {
  const [ready, setReady] = useState(false);
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getNote(itemId).then((n) => {
      setValue(n?.content ?? "");
      setReady(true);
    });
  }, [itemId]);

  if (!ready) {
    return (
      <div className="h-full animate-pulse rounded-2xl border border-border bg-surface shadow-[var(--shadow)]" />
    );
  }

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-surface shadow-[var(--shadow)]">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="text-sm font-semibold text-foreground">笔记</div>
        <button
          type="button"
          disabled={!canEdit || saving}
          className={cn(
            "rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-surface-2 disabled:opacity-50"
          )}
          onClick={async () => {
            if (!canEdit) return;
            setSaving(true);
            try {
              await upsertNote(itemId, value);
            } finally {
              setSaving(false);
            }
          }}
        >
          {canEdit ? (saving ? "保存中…" : "保存") : "仅作者可编辑"}
        </button>
      </div>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        readOnly={!canEdit}
        placeholder="写下 Summary / Key ideas / Questions…"
        className="min-h-0 flex-1 resize-none bg-transparent p-4 text-sm font-medium text-foreground outline-none placeholder:text-[color:var(--color-muted)]"
      />
    </div>
  );
}

