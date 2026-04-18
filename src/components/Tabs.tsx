import type { Category } from "../types";

type Props = {
  categories: Category[];
  activeId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onEdit: (id: string) => void;
};

export function Tabs({ categories, activeId, onSelect, onAdd, onEdit }: Props) {
  return (
    <div className="tab-bar">
      <div className="tab-brand">ORACLE</div>
      <div className="tabs">
        {categories.map((cat) => {
          const active = cat.id === activeId;
          return (
            <div key={cat.id} className={`tab-wrap ${active ? "active" : ""}`}>
              <button
                className="tab-main"
                onClick={() => onSelect(cat.id)}
                aria-pressed={active}
              >
                {cat.name}
              </button>
              {!cat.builtin && (
                <button
                  className="tab-edit"
                  onClick={() => onEdit(cat.id)}
                  aria-label={`Edit ${cat.name}`}
                  title="Edit"
                >
                  ✎
                </button>
              )}
            </div>
          );
        })}
        <button className="tab-add" onClick={onAdd} aria-label="Add category" title="Add category">
          +
        </button>
      </div>
    </div>
  );
}
