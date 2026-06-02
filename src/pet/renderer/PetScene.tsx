import React, { memo } from "react";

import type { PetSnapshot } from "../engine/petTypes";
import { PetLighting } from "./PetLighting";
import { PetModel } from "./PetModel";

type PetSceneProps = {
  snapshot: PetSnapshot;
};

export const PetScene = memo(function PetScene({ snapshot }: PetSceneProps) {
  return (
    <>
      <color args={["#FFF7ED"]} attach="background" />
      <PetLighting />
      <mesh position={[0, -1.58, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.1, 48]} />
        <meshStandardMaterial color="#FDBA74" opacity={0.28} transparent />
      </mesh>
      <PetModel snapshot={snapshot} />
    </>
  );
});
