import type { Activity, Item, ItemStatus, ItemType, Note, Visibility } from "@/lib/types";

type Store = {
  items: Item[];
  activities: Activity[];
  notes: Record<string, Note>;
};

const KEY = "readlog.v1";

function uid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `id_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function seed(): Store {
  const a = nowIso();
  const b = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const item1: Item = {
    id: uid(),
    url: "https://arxiv.org/",
    type: "paper",
    title: "Understanding Diffusion Transformers",
    source: "arXiv",
    tags: ["LLM", "Diffusion"],
    status: "unread",
    visibility: "public",
    createdAt: a,
  };

  const item2: Item = {
    id: uid(),
    url: "https://supabase.com/docs",
    type: "blog",
    title: "A Practical Guide to RLS in Postgres",
    source: "Blog",
    tags: ["DB", "Auth"],
    status: "done",
    visibility: "public",
    createdAt: b,
  };

  const activities: Activity[] = [
    {
      id: uid(),
      itemId: item1.id,
      action: "add",
      type: item1.type,
      message: `Paper: ${item1.title}`,
      createdAt: a,
    },
    {
      id: uid(),
      itemId: item2.id,
      action: "add",
      type: item2.type,
      message: `Blog: ${item2.title}`,
      createdAt: b,
    },
  ];

  return { items: [item1, item2], activities, notes: {} };
}

function readRaw(): Store | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Store;
    if (!parsed?.items || !parsed?.activities || !parsed?.notes) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeRaw(store: Store) {
  localStorage.setItem(KEY, JSON.stringify(store));
}

function load(): Store {
  const existing = readRaw();
  if (existing) return existing;
  const s = seed();
  writeRaw(s);
  return s;
}

export async function listItems() {
  const s = load();
  return [...s.items].sort((x, y) => (x.createdAt < y.createdAt ? 1 : -1));
}

export async function listActivities() {
  const s = load();
  return [...s.activities].sort((x, y) => (x.createdAt < y.createdAt ? 1 : -1));
}

export async function getItem(id: string) {
  const s = load();
  return s.items.find((it) => it.id === id) ?? null;
}

export async function createItem(input: {
  url: string;
  type: ItemType;
  title: string;
  source: string;
  tags: string[];
  status: ItemStatus;
  visibility: Visibility;
}) {
  const s = load();
  const createdAt = nowIso();
  const item: Item = { id: uid(), createdAt, ...input };
  s.items.unshift(item);
  s.activities.unshift({
    id: uid(),
    itemId: item.id,
    action: "add",
    type: item.type,
    message: `${item.type === "paper" ? "Paper" : "Blog"}: ${item.title}`,
    createdAt,
  });
  writeRaw(s);
  return item;
}

export async function updateItem(
  id: string,
  patch: Partial<Pick<Item, "tags" | "status" | "visibility" | "title" | "source">>
) {
  const s = load();
  const idx = s.items.findIndex((x) => x.id === id);
  if (idx < 0) return null;
  const next: Item = { ...s.items[idx], ...patch };
  s.items[idx] = next;
  writeRaw(s);
  return next;
}

export async function getNote(itemId: string) {
  const s = load();
  return s.notes[itemId] ?? null;
}

export async function upsertNote(itemId: string, content: string) {
  const s = load();
  const note: Note = { itemId, content, updatedAt: nowIso() };
  s.notes[itemId] = note;
  s.activities.unshift({
    id: uid(),
    itemId,
    action: "note",
    type: (s.items.find((x) => x.id === itemId)?.type ?? "blog") as ItemType,
    message: `Update: 笔记`,
    createdAt: note.updatedAt,
  });
  writeRaw(s);
  return note;
}

