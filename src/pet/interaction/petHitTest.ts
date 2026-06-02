import type { PetHitRegion } from "../engine/petTypes";

export function getPetHitRegion(x: number, y: number, width: number, height: number): PetHitRegion {
  const centerX = width / 2;
  const centerY = height * 0.55;
  const normalizedX = (x - centerX) / Math.max(width, 1);
  const normalizedY = (y - centerY) / Math.max(height, 1);

  if (Math.abs(normalizedX) > 0.32 || Math.abs(normalizedY) > 0.36) {
    return "space";
  }

  if (normalizedY < -0.11) {
    return "head";
  }

  if (normalizedX > 0.18) {
    return "tail";
  }

  return "body";
}
