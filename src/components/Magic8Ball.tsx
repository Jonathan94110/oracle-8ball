import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import gsap from "gsap";
import * as THREE from "three";

type Props = {
  phrase: string;
  shaking: boolean;
  onShakeComplete: () => void;
  onClick: () => void;
};

export function Magic8Ball({ phrase, shaking, onShakeComplete, onClick }: Props) {
  const group = useRef<THREE.Group>(null);
  const windowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!group.current || shaking) return;
    const t = clock.getElapsedTime();
    group.current.position.y = Math.sin(t * 0.8) * 0.05;
    group.current.rotation.y = Math.sin(t * 0.3) * 0.15;
  });

  useEffect(() => {
    if (!shaking || !group.current) return;
    const tl = gsap.timeline({
      onComplete: () => {
        if (group.current) {
          group.current.rotation.set(0, 0, 0);
          group.current.position.set(0, 0, 0);
        }
        onShakeComplete();
      }
    });
    tl.to(group.current.rotation, {
      x: "+=0.6",
      z: "-=0.6",
      duration: 0.08,
      repeat: 8,
      yoyo: true,
      ease: "power1.inOut"
    });
    tl.to(
      group.current.position,
      {
        x: 0.1,
        duration: 0.05,
        repeat: 16,
        yoyo: true,
        ease: "power1.inOut"
      },
      0
    );
    return () => {
      tl.kill();
    };
  }, [shaking, onShakeComplete]);

  return (
    <group ref={group} onClick={onClick}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshPhysicalMaterial
          color="#050505"
          roughness={0.25}
          metalness={0.35}
          clearcoat={0.9}
          clearcoatRoughness={0.1}
          reflectivity={0.8}
        />
      </mesh>

      <mesh position={[0, 0, 1.5]} ref={windowRef}>
        <circleGeometry args={[0.6, 48]} />
        <meshStandardMaterial
          color="#0a0618"
          emissive="#4b2d8a"
          emissiveIntensity={0.45}
          roughness={0.3}
        />
      </mesh>

      <mesh position={[0, 0, 1.505]}>
        <circleGeometry args={[0.55, 3]} />
        <meshBasicMaterial color="#1a1040" />
      </mesh>

      {!shaking && (
        <Text
          position={[0, 0, 1.51]}
          fontSize={0.11}
          maxWidth={0.9}
          textAlign="center"
          color="#c9b6ff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.004}
          outlineColor="#2a1655"
        >
          {phrase}
        </Text>
      )}

      <pointLight position={[0, 0, 1.8]} color="#7a4df0" intensity={0.8} distance={3} />
    </group>
  );
}
