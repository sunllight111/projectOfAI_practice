import React, { memo } from "react";

export const PetLighting = memo(function PetLighting() {
  return (
    <>
      <ambientLight intensity={1.9} />
      <directionalLight intensity={2.2} position={[3.5, 5, 5]} />
      <pointLight color="#FDBA74" intensity={1.8} position={[-2.6, 1.2, 2.4]} />
    </>
  );
});
