import type { Item, ItemStatus, ItemType, Visibility } from "@/lib/types";
import * as local from "@/lib/local-store";
import { getSupabaseBrowser } from "@/lib/supabase/browser";

export function isSupabaseEnabled() {
  return Boolean(getSupabaseBrowser());
}

export async function listItems(): Promise<Item[]> {
  return local.listItems();
}

export async function listActivities() {
  return local.listActivities();
}

export async function getItem(id: string) {
  return local.getItem(id);
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
  return local.createItem(input);
}

export async function updateItem(
  id: string,
  patch: Partial<Pick<Item, "tags" | "status" | "visibility" | "title" | "source">>
) {
  return local.updateItem(id, patch);
}

export async function getNote(itemId: string) {
  return local.getNote(itemId);
}

export async function upsertNote(itemId: string, content: string) {
  return local.upsertNote(itemId, content);
}

