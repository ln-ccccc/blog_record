export type ItemType = "blog" | "paper";
export type ItemStatus = "unread" | "reading" | "done";
export type Visibility = "public" | "private";

export type Item = {
  id: string;
  url: string;
  type: ItemType;
  title: string;
  source: string;
  tags: string[];
  status: ItemStatus;
  visibility: Visibility;
  createdAt: string;
};

export type Activity = {
  id: string;
  itemId: string;
  action: "add" | "update" | "note" | "snapshot";
  message: string;
  type: ItemType;
  createdAt: string;
};

export type Note = {
  itemId: string;
  content: string;
  updatedAt: string;
};

