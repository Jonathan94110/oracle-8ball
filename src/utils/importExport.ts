import type { Category } from "../types";

export function exportCategoriesJSON(categories: Category[]): void {
  const payload = {
    app: "oracle-8ball",
    version: 1,
    exportedAt: new Date().toISOString(),
    categories
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `oracle-8ball-categories-${new Date()
    .toISOString()
    .slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function parseCategoriesJSON(text: string): Category[] {
  const parsed: unknown = JSON.parse(text);
  const raw = (parsed as { categories?: unknown })?.categories ?? parsed;
  if (!Array.isArray(raw)) {
    throw new Error("JSON must contain a 'categories' array or be one itself.");
  }
  const categories: Category[] = [];
  for (const item of raw) {
    if (
      !item ||
      typeof item !== "object" ||
      typeof (item as Category).id !== "string" ||
      typeof (item as Category).name !== "string" ||
      !Array.isArray((item as Category).phrases)
    ) {
      throw new Error("Each category needs id, name, and phrases array.");
    }
    const cat = item as Category;
    categories.push({
      id: cat.id,
      name: cat.name,
      phrases: cat.phrases.filter((p) => typeof p === "string")
    });
  }
  if (categories.length === 0) {
    throw new Error("Import contained no valid categories.");
  }
  return categories;
}

export function pickFile(): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json,.json";
    input.onchange = () => {
      const file = input.files?.[0] ?? null;
      resolve(file);
    };
    input.click();
  });
}

export async function readFileText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
