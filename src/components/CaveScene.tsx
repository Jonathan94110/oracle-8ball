import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Torch({ position }: { position: [number, number, number] }) {
  const light = useRef<THREE.PointLight>(null);
  const flame = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const flicker = 1.4 + Math.sin(t * 9 + position[0]) * 0.25 + Math.random() * 0.15;
    if (light.current) light.current.intensity = flicker;
    if (flame.current) {
      const s = 1 + Math.sin(t * 12 + position[0]) * 0.08;
      flame.current.scale.set(s, s * 1.2, s);
    }
  });

  return (
    <group position={position}>
      <mesh ref={flame} position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#ff7b2e" />
      </mesh>
      <pointLight
        ref={light}
        color="#ff8a3c"
        intensity={1.4}
        distance={6}
        decay={2}
      />
    </group>
  );
}

export function CaveScene() {
  return (
    <>
      <fog attach="fog" args={["#0a0612", 4, 14]} />
      <color attach="background" args={["#060410"]} />

      <ambientLight intensity={0.12} color="#3a2a6b" />
      <hemisphereLight args={["#2a1a4a", "#050308", 0.25]} />

      <Torch position={[-3.5, 1.4, -1.5]} />
      <Torch position={[3.5, 1.4, -1.5]} />
      <Torch position={[0, 2, -4]} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#15101f" roughness={1} />
      </mesh>

      <mesh position={[0, 4, -6]}>
        <boxGeometry args={[20, 10, 0.5]} />
        <meshStandardMaterial color="#120a20" roughness={1} />
      </mesh>

      <mesh position={[-6, 1, -3]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[3, 8, 0.5]} />
        <meshStandardMaterial color="#0e0818" roughness={1} />
      </mesh>
      <mesh position={[6, 1, -3]} rotation={[0, -0.3, 0]}>
        <boxGeometry args={[3, 8, 0.5]} />
        <meshStandardMaterial color="#0e0818" roughness={1} />
      </mesh>

      <mesh position={[0, -1.85, 0]}>
        <cylinderGeometry args={[1.9, 2.1, 0.3, 32]} />
        <meshStandardMaterial
          color="#1c0f36"
          emissive="#3a1e7a"
          emissiveIntensity={0.35}
          roughness={0.6}
        />
      </mesh>
    </>
  );
}
