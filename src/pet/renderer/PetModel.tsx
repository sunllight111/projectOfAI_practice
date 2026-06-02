import React, { memo, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber/native";
import type { Group, Mesh } from "three";

import type { PetSnapshot } from "../engine/petTypes";

declare const require: <T>(id: string) => T;

const { MathUtils } = require<typeof import("three")>("three");

type PetModelProps = {
  snapshot: PetSnapshot;
};

export const PetModel = memo(function PetModel({ snapshot }: PetModelProps) {
  const rootRef = useRef<Group>(null);
  const headRef = useRef<Group>(null);
  const bodyRef = useRef<Mesh>(null);
  const flameRef = useRef<Group>(null);
  const leftEyeRef = useRef<Mesh>(null);
  const rightEyeRef = useRef<Mesh>(null);
  const mouthRef = useRef<Mesh>(null);
  const eyeScale = useRef(1);
  const colors = useMemo(
    () => ({
      belly: "#FED7AA",
      dark: "#7C2D12",
      eye: "#111827",
      flame: "#F97316",
      flameCore: "#FEF3C7",
      skin: "#E4572E",
      skinLight: "#FB923C"
    }),
    []
  );

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    const root = rootRef.current;
    const head = headRef.current;
    const body = bodyRef.current;
    const flame = flameRef.current;
    const leftEye = leftEyeRef.current;
    const mouth = mouthRef.current;
    const rightEye = rightEyeRef.current;

    if (!root || !head || !body || !flame || !leftEye || !rightEye || !mouth) {
      return;
    }

    const state = snapshot.state;
    const idleWave = Math.sin(elapsed * 2.1);
    const targetX = snapshot.pose.dragX;
    const targetY = snapshot.pose.dragY;
    const isDragged = state === "dragged";
    const isHappy = state === "happy" || state === "active";
    const isSleep = state === "sleep";

    root.position.x = MathUtils.lerp(root.position.x, targetX, isDragged ? 0.26 : 0.12);
    root.position.y = MathUtils.lerp(
      root.position.y,
      -0.1 + targetY + (isDragged ? 0 : idleWave * 0.045),
      0.16
    );
    root.rotation.y = MathUtils.lerp(
      root.rotation.y,
      isDragged ? targetX * 0.42 : snapshot.pose.touchX * 0.15 + idleWave * 0.035,
      0.12
    );
    root.rotation.z = MathUtils.lerp(
      root.rotation.z,
      isDragged ? -targetX * 0.18 : 0,
      0.12
    );

    const jump = isHappy ? Math.max(0, Math.sin(elapsed * 7.5)) * 0.18 : 0;
    body.scale.y = MathUtils.lerp(body.scale.y, isSleep ? 0.92 : 1 + idleWave * 0.025, 0.08);
    body.position.y = jump;
    head.rotation.x = MathUtils.lerp(
      head.rotation.x,
      isSleep ? 0.32 : -snapshot.pose.touchY * 0.12,
      0.1
    );
    head.rotation.y = MathUtils.lerp(head.rotation.y, snapshot.pose.touchX * 0.22, 0.1);

    flame.scale.setScalar((isHappy ? 1.15 : 1) + Math.sin(elapsed * 7) * 0.08);
    flame.rotation.z = Math.sin(elapsed * 5.2) * 0.16 + (isDragged ? targetX * 0.18 : 0);

    const blinkGate = isSleep ? 0.12 : Math.sin(elapsed * 2.4) > 0.965 ? 0.16 : 1;
    eyeScale.current = MathUtils.lerp(eyeScale.current, blinkGate, 0.35);
    leftEye.scale.y = eyeScale.current;
    rightEye.scale.y = eyeScale.current;
    mouth.position.y = isHappy ? -0.15 : -0.19;
    mouth.scale.x = MathUtils.lerp(mouth.scale.x, isHappy ? 0.42 : 0.32, 0.16);
  });

  return (
    <group ref={rootRef} position={[0, -0.1, 0]}>
      <mesh position={[0.95, -0.24, -0.04]} rotation={[0, 0, -0.5]}>
        <capsuleGeometry args={[0.13, 1.25, 6, 12]} />
        <meshStandardMaterial color={colors.skin} roughness={0.72} />
      </mesh>

      <group ref={flameRef} position={[1.62, 0.13, -0.02]} rotation={[0, 0, -0.45]}>
        <mesh>
          <coneGeometry args={[0.28, 0.72, 16]} />
          <meshStandardMaterial color={colors.flame} emissive="#EA580C" emissiveIntensity={0.65} />
        </mesh>
        <mesh position={[0, -0.05, 0.04]} scale={[0.58, 0.62, 0.58]}>
          <coneGeometry args={[0.22, 0.58, 14]} />
          <meshStandardMaterial color={colors.flameCore} emissive="#FDE68A" emissiveIntensity={0.7} />
        </mesh>
      </group>

      <mesh ref={bodyRef} position={[0, -0.62, 0]}>
        <sphereGeometry args={[0.92, 28, 20]} />
        <meshStandardMaterial color={colors.skin} roughness={0.64} />
      </mesh>
      <mesh position={[0, -0.7, 0.68]} scale={[0.72, 0.84, 0.18]}>
        <sphereGeometry args={[0.7, 24, 16]} />
        <meshStandardMaterial color={colors.belly} roughness={0.72} />
      </mesh>

      <group ref={headRef} position={[0, 0.58, 0]}>
        <mesh>
          <sphereGeometry args={[0.78, 30, 22]} />
          <meshStandardMaterial color={colors.skinLight} roughness={0.6} />
        </mesh>
        <mesh position={[-0.4, 0.56, -0.05]} rotation={[0.2, 0, -0.55]}>
          <coneGeometry args={[0.17, 0.56, 10]} />
          <meshStandardMaterial color={colors.dark} roughness={0.68} />
        </mesh>
        <mesh position={[0.4, 0.56, -0.05]} rotation={[0.2, 0, 0.55]}>
          <coneGeometry args={[0.17, 0.56, 10]} />
          <meshStandardMaterial color={colors.dark} roughness={0.68} />
        </mesh>
        <mesh position={[0, 0.24, 0.64]} scale={[0.55, 0.28, 0.12]}>
          <sphereGeometry args={[0.45, 20, 12]} />
          <meshStandardMaterial color={colors.belly} roughness={0.72} />
        </mesh>
        <mesh ref={leftEyeRef} position={[-0.25, 0.02, 0.72]}>
          <sphereGeometry args={[0.105, 12, 8]} />
          <meshStandardMaterial color={colors.eye} roughness={0.55} />
        </mesh>
        <mesh ref={rightEyeRef} position={[0.25, 0.02, 0.72]}>
          <sphereGeometry args={[0.105, 12, 8]} />
          <meshStandardMaterial color={colors.eye} roughness={0.55} />
        </mesh>
        <mesh ref={mouthRef} position={[0, -0.19, 0.74]} scale={[0.32, 0.035, 0.025]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={colors.dark} roughness={0.8} />
        </mesh>
      </group>

      <mesh position={[-0.86, -0.45, 0.18]} rotation={[0, 0, 0.48]}>
        <capsuleGeometry args={[0.12, 0.62, 6, 10]} />
        <meshStandardMaterial color={colors.skinLight} roughness={0.68} />
      </mesh>
      <mesh position={[0.86, -0.45, 0.18]} rotation={[0, 0, -0.48]}>
        <capsuleGeometry args={[0.12, 0.62, 6, 10]} />
        <meshStandardMaterial color={colors.skinLight} roughness={0.68} />
      </mesh>
      <mesh position={[-0.36, -1.38, 0.15]} scale={[0.38, 0.16, 0.24]}>
        <sphereGeometry args={[1, 16, 10]} />
        <meshStandardMaterial color={colors.dark} roughness={0.7} />
      </mesh>
      <mesh position={[0.36, -1.38, 0.15]} scale={[0.38, 0.16, 0.24]}>
        <sphereGeometry args={[1, 16, 10]} />
        <meshStandardMaterial color={colors.dark} roughness={0.7} />
      </mesh>
    </group>
  );
});
