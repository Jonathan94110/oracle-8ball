import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { CaveScene, CameraShake } from "./CaveScene";
import { Magic8Ball } from "./Magic8Ball";
import { Tabs } from "./Tabs";
import { CategoryEditor } from "./CategoryEditor";
import { TopBar } from "./TopBar";
import { QuestionInput } from "./QuestionInput";
import { HistoryDrawer } from "./HistoryDrawer";
import { useCategories } from "../hooks/useCategories";
import { useHistory } from "../hooks/useHistory";
import { pickPhrase } from "../data/categories";
import {
  isMuted,
  playReveal,
  playShake,
  startAmbient,
  toggleMuted
} from "../sound";

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
    removeCategory,
    replaceAll,
    mergeIn
  } = useCategories();

  const history = useHistory();

  const [phrase, setPhrase] = useState(IDLE_TEXT);
  const [question, setQuestion] = useState("");
  const [shaking, setShaking] = useState(false);
  const [editor, setEditor] = useState<EditorState>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [muted, setMutedState] = useState(() => isMuted());
  const gestureStartedRef = useRef(false);

  const activeRef = useRef(active);
  activeRef.current = active;
  const phraseRef = useRef(phrase);
  phraseRef.current = phrase;
  const questionRef = useRef(question);
  questionRef.current = question;

  useEffect(() => {
    setPhrase(IDLE_TEXT);
  }, [activeId]);

  const ensureGesture = useCallback(() => {
    if (gestureStartedRef.current) return;
    gestureStartedRef.current = true;
    startAmbient();
  }, []);

  const handleClick = useCallback(() => {
    if (shaking) return;
    ensureGesture();
    setShaking(true);
    playShake();
  }, [shaking, ensureGesture]);

  const handleShakeComplete = useCallback(() => {
    const cat = activeRef.current;
    const newPhrase = pickPhrase(cat.phrases, phraseRef.current);
    setPhrase(newPhrase);
    playReveal();
    history.record({
      categoryId: cat.id,
      categoryName: cat.name,
      question: questionRef.current.trim(),
      answer: newPhrase
    });
    setShaking(false);
  }, [history]);

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

  const handleToggleMute = useCallback(() => {
    ensureGesture();
    const nowMuted = toggleMuted();
    setMutedState(nowMuted);
  }, [ensureGesture]);

  return (
    <div className="oracle-root">
      <TopBar
        categories={categories}
        muted={muted}
        historyCount={history.entries.length}
        onToggleMute={handleToggleMute}
        onOpenHistory={() => setDrawerOpen(true)}
        onReplaceAll={replaceAll}
        onMergeIn={mergeIn}
      />

      <Tabs
        categories={categories}
        activeId={activeId}
        onSelect={setActiveId}
        onAdd={openAdd}
        onEdit={openEdit}
      />

      <QuestionInput
        value={question}
        onChange={setQuestion}
        disabled={shaking}
      />

      <Canvas
        shadows
        camera={{ position: [0, 0.4, 5], fov: 50 }}
        dpr={[1, 2]}
      >
        <CaveScene />
        <CameraShake active={shaking} />
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

      <HistoryDrawer
        entries={history.entries}
        open={drawerOpen}
        activeCategoryId={activeId}
        onClose={() => setDrawerOpen(false)}
        onClear={history.clear}
        onClearCategory={history.clearForCategory}
      />

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
