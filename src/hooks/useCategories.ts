import { useCallback, useEffect, useState } from "react";
import type { Category } from "../types";
import { SEED_CATEGORIES } from "../data/categories";

const STORAGE_KEY = "oracle-8ball:categories:v2";
const ACTIVE_KEY = "oracle-8ball:active-category:v1";

function isCategory(c: unknown): c is Category {
  return (
    !!c &&
    typeof (c as Category).id === "string" &&
    typeof (c as Category).name === "string" &&
    Array.isArray((c as Category).phrases)
  );
}

function loadCategories(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_CATEGORIES.map((c) => ({ ...c }));
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return SEED_CATEGORIES.map((c) => ({ ...c }));
    }
    const valid = parsed.filter(isCategory);
    return valid.length > 0 ? valid : SEED_CATEGORIES.map((c) => ({ ...c }));
  } catch {
    return SEED_CATEGORIES.map((c) => ({ ...c }));
  }
}

function loadActiveId(fallback: string): string {
  return localStorage.getItem(ACTIVE_KEY) ?? fallback;
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
  const [categories, setCategories] = useState<Category[]>(() => loadCategories());
  const [activeId, setActiveIdState] = useState<string>(() =>
    loadActiveId(SEED_CATEGORIES[0].id)
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(ACTIVE_KEY, activeId);
  }, [activeId]);

  const active =
    categories.find((c) => c.id === activeId) ?? categories[0];

  const setActiveId = useCallback((id: string) => setActiveIdState(id), []);

  const addCategory = useCallback((name: string, phrases: string[]) => {
    const cat: Category = {
      id: newId(),
      name: name.trim(),
      phrases: sanitizePhrases(phrases)
    };
    setCategories((prev) => [...prev, cat]);
    setActiveIdState(cat.id);
    return cat.id;
  }, []);

  const updateCategory = useCallback(
    (id: string, name: string, phrases: string[]) => {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, name: name.trim(), phrases: sanitizePhrases(phrases) }
            : c
        )
      );
    },
    []
  );

  const removeCategory = useCallback((id: string) => {
    setCategories((prev) => {
      if (prev.length <= 1) return prev;
      const next = prev.filter((c) => c.id !== id);
      setActiveIdState((currentActive) =>
        currentActive === id ? next[0].id : currentActive
      );
      return next;
    });
  }, []);

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
