import { useState } from "react";
import type { Category } from "../types";
import {
  exportCategoriesJSON,
  parseCategoriesJSON,
  pickFile,
  readFileText
} from "../utils/importExport";

type Props = {
  categories: Category[];
  muted: boolean;
  historyCount: number;
  onToggleMute: () => void;
  onOpenHistory: () => void;
  onReplaceAll: (categories: Category[]) => void;
  onMergeIn: (categories: Category[]) => void;
};

export function TopBar({
  categories,
  muted,
  historyCount,
  onToggleMute,
  onOpenHistory,
  onReplaceAll,
  onMergeIn
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleExport = () => {
    exportCategoriesJSON(categories);
    setMenuOpen(false);
  };

  const handleImport = async (mode: "replace" | "merge") => {
    setMenuOpen(false);
    try {
      const file = await pickFile();
      if (!file) return;
      const text = await readFileText(file);
      const incoming = parseCategoriesJSON(text);
      if (mode === "replace") {
        if (
          !window.confirm(
            `Replace all ${categories.length} categories with ${incoming.length} imported ones?`
          )
        ) {
          return;
        }
        onReplaceAll(incoming);
      } else {
        onMergeIn(incoming);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Import failed.";
      window.alert(`Import failed: ${msg}`);
    }
  };

  return (
    <div className="top-bar">
      <div className="brand">
        <img
          src="/tfm-logo.png"
          alt="TF Marauders"
          className="brand-logo"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="brand-text">
          <span className="brand-title">TF MARAUDERS</span>
          <span className="brand-subtitle">Oracle of Cybertron</span>
        </div>
      </div>

      <div className="top-actions">
        <button
          className="icon-btn"
          onClick={onOpenHistory}
          aria-label="Open history"
          title="History"
        >
          <span className="icon-btn-glyph">⌘</span>
          {historyCount > 0 && (
            <span className="icon-btn-badge">{historyCount}</span>
          )}
        </button>

        <button
          className="icon-btn"
          onClick={onToggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
          title={muted ? "Unmute" : "Mute"}
        >
          <span className="icon-btn-glyph">{muted ? "🔇" : "🔊"}</span>
        </button>

        <div className="menu-wrap">
          <button
            className="icon-btn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Settings menu"
            aria-expanded={menuOpen}
            title="More"
          >
            <span className="icon-btn-glyph">⋯</span>
          </button>
          {menuOpen && (
            <>
              <div
                className="menu-backdrop"
                onClick={() => setMenuOpen(false)}
              />
              <div className="menu" role="menu">
                <button onClick={handleExport}>Export categories…</button>
                <button onClick={() => handleImport("merge")}>
                  Import & merge…
                </button>
                <button onClick={() => handleImport("replace")}>
                  Import & replace…
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
