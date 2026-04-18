import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { CaveScene } from "./CaveScene";
import { Magic8Ball } from "./Magic8Ball";
import { Tabs } from "./Tabs";
import { CategoryEditor } from "./CategoryEditor";
import { useCategories } from "../hooks/useCategories";
import { pickPhrase } from "../data/categories";

type EditorState =
  | { mode: "add" }
  | { mode: "edit"; id: string }
  | null;

const IDLE_TEXT = "Ask the Oracle";

export function Oracle() {
  const {
    categories,
    active,
    activeId,
    setActiveId,
    addCategory,
    updateCategory,
    removeCategory
  } = useCategories();

  const [phrase, setPhrase] = useState(IDLE_TEXT);
  const [shaking, setShaking] = useState(false);
  const [editor, setEditor] = useState<EditorState>(null);

  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    setPhrase(IDLE_TEXT);
  }, [activeId]);

  const handleClick = useCallback(() => {
    if (shaking) return;
    setShaking(true);
  }, [shaking]);

  const handleShakeComplete = useCallback(() => {
    setPhrase((prev) => pickPhrase(activeRef.current.phrases, prev));
    setShaking(false);
  }, []);

  const openAdd = useCallback(() => setEditor({ mode: "add" }), []);
  const openEdit = useCallback(
    (id: string) => setEditor({ mode: "edit", id }),
    []
  );
  const closeEditor = useCallback(() => setEditor(null), []);

  const editingCategory =
    editor?.mode === "edit"
      ? categories.find((c) => c.id === editor.id)
      : undefined;

  return (
    <div className="oracle-root">
      <Tabs
        categories={categories}
        activeId={activeId}
        onSelect={setActiveId}
        onAdd={openAdd}
        onEdit={openEdit}
      />

      <Canvas
        shadows
        camera={{ position: [0, 0.4, 5], fov: 50 }}
        dpr={[1, 2]}
      >
        <CaveScene />
        <Magic8Ball
          phrase={phrase}
          shaking={shaking}
          onShakeComplete={handleShakeComplete}
          onClick={handleClick}
        />
      </Canvas>

      <div className="ui-overlay">
        <p className="category-hint">{active.name}</p>
        <p className="click-hint">
          {shaking ? "The spark stirs..." : "Click the sphere to consult"}
        </p>
      </div>

      {editor?.mode === "add" && (
        <CategoryEditor
          mode="add"
          onSave={(name, phrases) => {
            addCategory(name, phrases);
            closeEditor();
          }}
          onCancel={closeEditor}
        />
      )}

      {editor?.mode === "edit" && editingCategory && (
        <CategoryEditor
          mode="edit"
          initial={editingCategory}
          onSave={(name, phrases) => {
            updateCategory(editingCategory.id, name, phrases);
            closeEditor();
          }}
          onDelete={
            categories.length > 1
              ? () => {
                  removeCategory(editingCategory.id);
                  closeEditor();
                }
              : undefined
          }
          onCancel={closeEditor}
        />
      )}
    </div>
  );
}
