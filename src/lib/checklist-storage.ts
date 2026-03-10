export type ChecklistItem = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
};

export function parseChecklist(raw: string | null): ChecklistItem[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as ChecklistItem[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item) =>
        typeof item?.id === "string" &&
        typeof item?.text === "string" &&
        typeof item?.completed === "boolean" &&
        typeof item?.createdAt === "string",
    );
  } catch {
    return [];
  }
}

export function normalizeChecklistText(value: string) {
  return value.trim();
}

export function createChecklistItem(text: string): ChecklistItem {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    text,
    completed: false,
    createdAt: new Date().toISOString(),
  };
}

export function toggleChecklistItem(items: ChecklistItem[], id: string): ChecklistItem[] {
  return items.map((item) =>
    item.id === id
      ? {
          ...item,
          completed: !item.completed,
        }
      : item,
  );
}

export function removeChecklistItem(items: ChecklistItem[], id: string): ChecklistItem[] {
  return items.filter((item) => item.id !== id);
}

export function sortChecklistItems(items: ChecklistItem[]): ChecklistItem[] {
  return [...items].sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}
