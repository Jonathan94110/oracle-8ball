import { useState } from "react";
import type { Category } from "../types";

type Props = {
  mode: "add" | "edit";
  initial?: Category;
  onSave: (name: string, phrases: string[]) => void;
  onCancel: () => void;
  onDelete?: () => void;
};

export function CategoryEditor({ mode, initial, onSave, onCancel, onDelete }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [text, setText] = useState((initial?.phrases ?? []).join("\n"));

  const phrases = text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const canSave = name.trim().length > 0 && phrases.length > 0;

  return (
    <div className="editor-overlay" onClick={onCancel}>
      <div className="editor" onClick={(e) => e.stopPropagation()}>
        <h2>{mode === "add" ? "New Category" : "Edit Category"}</h2>

        <label className="editor-field">
          <span>Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Should I buy this?"
            autoFocus
          />
        </label>

        <label className="editor-field">
          <span>Phrases — one per line ({phrases.length})</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={12}
            placeholder={"Yes, absolutely\nNo, never\nAsk again tomorrow"}
          />
        </label>

        <div className="editor-actions">
          {mode === "edit" && onDelete && (
            <button className="btn-danger" onClick={onDelete}>
              Delete
            </button>
          )}
          <div className="spacer" />
          <button onClick={onCancel}>Cancel</button>
          <button
            className="btn-primary"
            disabled={!canSave}
            onClick={() => onSave(name, phrases)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
