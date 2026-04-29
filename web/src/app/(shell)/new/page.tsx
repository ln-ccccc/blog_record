"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createItem, isSupabaseEnabled } from "@/lib/data";
import type { ItemStatus, ItemType, Visibility } from "@/lib/types";
import { useSession } from "@/components/auth/use-session";

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export default function NewPage() {
  const router = useRouter();
  const { user, enabled } = useSession();
  const supabaseEnabled = useMemo(() => isSupabaseEnabled(), []);

  const allowWrite = supabaseEnabled ? Boolean(user) : true;

  const [url, setUrl] = useState("");
  const [type, setType] = useState<ItemType>("blog");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState<ItemStatus>("unread");
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-[760px] pb-20 md:pb-0">
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow)]">
        <div className="flex flex-col gap-2">
          <div className="text-sm font-semibold text-foreground">新增条目</div>
          <div className="text-xs font-semibold text-[color:var(--color-muted)]">
            {supabaseEnabled
              ? "登录后可新增；默认公开展示"
              : "本地演示模式：未配置 Supabase，也可以新增（仅保存在浏览器）"}
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          <Field label="URL">
            <input
              value={url}
              onChange={(e) => {
                const next = e.target.value;
                setUrl(next);
                if (!title.trim()) setTitle("");
              }}
              placeholder="https://..."
              className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm font-semibold outline-none focus:border-[color:var(--color-accent)]"
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="类型">
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ItemType)}
                className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm font-semibold outline-none focus:border-[color:var(--color-accent)]"
              >
                <option value="blog">Blog</option>
                <option value="paper">Paper</option>
              </select>
            </Field>
            <Field label="状态">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ItemStatus)}
                className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm font-semibold outline-none focus:border-[color:var(--color-accent)]"
              >
                <option value="unread">未读</option>
                <option value="reading">在读</option>
                <option value="done">已读</option>
              </select>
            </Field>
          </div>

          <Field label="标题">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：Paper: xxx"
              className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm font-semibold outline-none focus:border-[color:var(--color-accent)]"
            />
          </Field>

          <Field label="标签（逗号分隔）">
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="LLM, Diffusion, DB"
              className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm font-semibold outline-none focus:border-[color:var(--color-accent)]"
            />
          </Field>

          <Field label="可见性">
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as Visibility)}
              className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm font-semibold outline-none focus:border-[color:var(--color-accent)]"
            >
              <option value="public">公开</option>
              <option value="private">私密</option>
            </select>
          </Field>

          {error ? (
            <div className="rounded-2xl border border-border bg-background p-4 text-sm font-semibold text-[color:var(--color-muted)]">
              {error}
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-3">
            <div className="text-xs font-semibold text-[color:var(--color-muted)]">
              来源：{hostname(url) || "—"}
            </div>
            <button
              type="button"
              disabled={!allowWrite || saving}
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-foreground px-5 text-sm font-semibold text-background shadow-[var(--shadow)] transition hover:opacity-95 disabled:opacity-50"
              onClick={async () => {
                setError(null);
                const u = url.trim();
                if (!u) return setError("请输入 URL");
                const t = title.trim() || u;
                const src = hostname(u) || "Link";
                const parsedTags = tags
                  .split(",")
                  .map((x) => x.trim())
                  .filter(Boolean)
                  .slice(0, 10);

                if (!allowWrite) return setError("请先登录");

                setSaving(true);
                try {
                  const item = await createItem({
                    url: u,
                    type,
                    title: t,
                    source: src,
                    tags: parsedTags,
                    status,
                    visibility,
                  });
                  router.push(`/item/${item.id}`);
                } catch {
                  setError("保存失败");
                } finally {
                  setSaving(false);
                }
              }}
            >
              {allowWrite ? (saving ? "保存中…" : "保存并生成提交") : enabled ? "登录后可保存" : "未配置登录"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-semibold text-[color:var(--color-muted)]">{label}</span>
      {children}
    </label>
  );
}

