import { useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { CaveScene } from "./CaveScene";
import { Magic8Ball } from "./Magic8Ball";
import { pickPhrase } from "../data/phrases";

export function Oracle() {
  const [phrase, setPhrase] = useState("Ask the Oracle");
  const [shaking, setShaking] = useState(false);

  const handleClick = useCallback(() => {
    if (shaking) return;
    setShaking(true);
  }, [shaking]);

  const handleShakeComplete = useCallback(() => {
    setPhrase((prev) => pickPhrase(prev));
    setShaking(false);
  }, []);

  return (
    <div className="oracle-root">
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
        <h1>The Oracle of Cybertron</h1>
        <p>{shaking ? "The spark stirs..." : "Click the sphere to consult"}</p>
      </div>
    </div>
  );
}
