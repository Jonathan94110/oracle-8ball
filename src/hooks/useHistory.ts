import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "oracle-8ball:history:v1";
const MAX_ENTRIES = 100;

export type HistoryEntry = {
  id: string;
  categoryId: string;
  categoryName: string;
  question: string;
  answer: string;
  timestamp: number;
};

function load(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `h-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>(() => load());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const record = useCallback(
    (entry: Omit<HistoryEntry, "id" | "timestamp">) => {
      setEntries((prev) =>
        [
          {
            ...entry,
            id: newId(),
            timestamp: Date.now()
          },
          ...prev
        ].slice(0, MAX_ENTRIES)
      );
    },
    []
  );

  const clear = useCallback(() => setEntries([]), []);

  const clearForCategory = useCallback((categoryId: string) => {
    setEntries((prev) => prev.filter((e) => e.categoryId !== categoryId));
  }, []);

  return { entries, record, clear, clearForCategory };
}
