import type { TranslationKey } from "../../i18n/language";

export type PetState = "idle" | "happy" | "curious" | "dragged" | "active" | "sleep";

export type PetEvent =
  | { type: "tap"; region: PetHitRegion; x: number; y: number }
  | { type: "dragStart"; x: number; y: number }
  | { type: "dragMove"; x: number; y: number }
  | { type: "dragEnd" }
  | { type: "feed" }
  | { type: "play" }
  | { type: "rest" }
  | { type: "idleTimeout" };

export type PetHitRegion = "head" | "body" | "tail" | "space";

export type PetStats = {
  bond: number;
  energy: number;
  hunger: number;
};

export type PetModelPose = {
  dragX: number;
  dragY: number;
  touchX: number;
  touchY: number;
};

export type PetSnapshot = {
  messageKey: TranslationKey;
  moodKey: TranslationKey;
  pose: PetModelPose;
  state: PetState;
  stats: PetStats;
};
