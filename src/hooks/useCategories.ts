import { useCallback, useEffect, useState } from "react";
import type { Category } from "../types";
import { BUILTIN_CATEGORIES } from "../data/categories";

const STORAGE_KEY = "oracle-8ball:custom-categories:v1";
const ACTIVE_KEY = "oracle-8ball:active-category:v1";

function loadCustom(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (c): c is Category =>
          !!c &&
          typeof c.id === "string" &&
          typeof c.name === "string" &&
          Array.isArray(c.phrases)
      )
      .map((c) => ({ ...c, builtin: false }));
  } catch {
    return [];
  }
}

function loadActiveId(): string {
  const raw = localStorage.getItem(ACTIVE_KEY);
  return raw ?? BUILTIN_CATEGORIES[0].id;
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `cat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function sanitizePhrases(phrases: string[]): string[] {
  return phrases.map((p) => p.trim()).filter((p) => p.length > 0);
}

export function useCategories() {
  const [custom, setCustom] = useState<Category[]>(() => loadCustom());
  const [activeId, setActiveIdState] = useState<string>(() => loadActiveId());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));
  }, [custom]);

  useEffect(() => {
    localStorage.setItem(ACTIVE_KEY, activeId);
  }, [activeId]);

  const categories: Category[] = [...BUILTIN_CATEGORIES, ...custom];
  const active =
    categories.find((c) => c.id === activeId) ?? BUILTIN_CATEGORIES[0];

  const setActiveId = useCallback((id: string) => setActiveIdState(id), []);

  const addCategory = useCallback((name: string, phrases: string[]) => {
    const cat: Category = {
      id: newId(),
      name: name.trim(),
      phrases: sanitizePhrases(phrases),
      builtin: false
    };
    setCustom((prev) => [...prev, cat]);
    setActiveIdState(cat.id);
    return cat.id;
  }, []);

  const updateCategory = useCallback(
    (id: string, name: string, phrases: string[]) => {
      setCustom((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, name: name.trim(), phrases: sanitizePhrases(phrases) }
            : c
        )
      );
    },
    []
  );

  const removeCategory = useCallback(
    (id: string) => {
      setCustom((prev) => prev.filter((c) => c.id !== id));
      if (activeId === id) setActiveIdState(BUILTIN_CATEGORIES[0].id);
    },
    [activeId]
  );

  return {
    categories,
    active,
    activeId,
    setActiveId,
    addCategory,
    updateCategory,
    removeCategory
  };
}
