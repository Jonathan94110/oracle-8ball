import { useMemo, useState } from "react";
import type { HistoryEntry } from "../hooks/useHistory";

type Props = {
  entries: HistoryEntry[];
  open: boolean;
  activeCategoryId: string;
  onClose: () => void;
  onClear: () => void;
  onClearCategory: (categoryId: string) => void;
};

function formatTime(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) {
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  return d.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

export function HistoryDrawer({
  entries,
  open,
  activeCategoryId,
  onClose,
  onClear,
  onClearCategory
}: Props) {
  const [filter, setFilter] = useState<"all" | "current">("all");

  const visible = useMemo(() => {
    if (filter === "current") {
      return entries.filter((e) => e.categoryId === activeCategoryId);
    }
    return entries;
  }, [entries, filter, activeCategoryId]);

  const handleClear = () => {
    if (filter === "current") {
      if (window.confirm("Clear history for the current category?")) {
        onClearCategory(activeCategoryId);
      }
    } else {
      if (window.confirm("Clear all consultation history? This cannot be undone.")) {
        onClear();
      }
    }
  };

  return (
    <div className={`drawer ${open ? "open" : ""}`} aria-hidden={!open}>
      <div className="drawer-header">
        <h2>Consultations</h2>
        <button className="drawer-close" onClick={onClose} aria-label="Close history">
          ✕
        </button>
      </div>

      <div className="drawer-filters">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={filter === "current" ? "active" : ""}
          onClick={() => setFilter("current")}
        >
          This category
        </button>
      </div>

      <div className="drawer-body">
        {visible.length === 0 ? (
          <p className="drawer-empty">
            No consultations yet.
            <br />
            Shake the sphere to begin.
          </p>
        ) : (
          <ul className="history-list">
            {visible.map((entry) => (
              <li key={entry.id} className="history-entry">
                {entry.question && (
                  <p className="history-q">“{entry.question}”</p>
                )}
                <p className="history-a">{entry.answer}</p>
                <p className="history-meta">
                  {entry.categoryName} · {formatTime(entry.timestamp)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {visible.length > 0 && (
        <div className="drawer-footer">
          <button className="btn-danger" onClick={handleClear}>
            Clear {filter === "current" ? "this category" : "all"}
          </button>
        </div>
      )}
    </div>
  );
}
