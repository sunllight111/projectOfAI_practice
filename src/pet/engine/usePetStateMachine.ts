import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { TranslationKey } from "../../i18n/language";
import type { PetEvent, PetModelPose, PetSnapshot, PetState, PetStats } from "./petTypes";

const IDLE_DELAY_MS = 3000;
const MAX_STAT = 100;

const MOOD_KEYS: Record<PetState, TranslationKey> = {
  active: "pet.moods.playful",
  curious: "pet.moods.happy",
  dragged: "pet.moods.playful",
  happy: "pet.moods.happy",
  idle: "pet.moods.idle",
  sleep: "pet.moods.sleepy"
};

export function usePetStateMachine() {
  const [state, setState] = useState<PetState>("idle");
  const [stats, setStats] = useState<PetStats>({
    bond: 34,
    energy: 68,
    hunger: 72
  });
  const [messageKey, setMessageKey] =
    useState<TranslationKey>("pet.messages.idle");
  const [pose, setPose] = useState<PetModelPose>({
    dragX: 0,
    dragY: 0,
    touchX: 0,
    touchY: 0
  });
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interactionCount = useRef(0);

  const clearIdleTimer = useCallback(() => {
    if (idleTimer.current) {
      clearTimeout(idleTimer.current);
      idleTimer.current = null;
    }
  }, []);

  const startIdleTimer = useCallback(() => {
    clearIdleTimer();
    idleTimer.current = setTimeout(() => {
      setState("idle");
      setMessageKey("pet.messages.idle");
      setPose((current) => ({
        ...current,
        dragX: 0,
        dragY: 0
      }));
    }, IDLE_DELAY_MS);
  }, [clearIdleTimer]);

  useEffect(() => {
    startIdleTimer();
    return clearIdleTimer;
  }, [clearIdleTimer, startIdleTimer]);

  const dispatch = useCallback(
    (event: PetEvent) => {
      interactionCount.current += event.type === "idleTimeout" ? 0 : 1;

      if (event.type !== "idleTimeout") {
        startIdleTimer();
      }

      if (event.type === "tap") {
        setPose((current) => ({
          ...current,
          touchX: event.x,
          touchY: event.y
        }));
        setStats((current) => ({
          ...current,
          bond: clampStat(current.bond + (event.region === "head" ? 5 : 3))
        }));
        setState(event.region === "space" ? "curious" : "happy");
        setMessageKey("pet.messages.touch");
        return;
      }

      if (event.type === "dragStart") {
        setState("dragged");
        setPose((current) => ({
          ...current,
          touchX: event.x,
          touchY: event.y
        }));
        setMessageKey("pet.messages.drag");
        return;
      }

      if (event.type === "dragMove") {
        setPose((current) => ({
          ...current,
          dragX: event.x,
          dragY: event.y,
          touchX: event.x,
          touchY: event.y
        }));
        return;
      }

      if (event.type === "dragEnd") {
        setState("happy");
        setStats((current) => ({
          ...current,
          bond: clampStat(current.bond + 4)
        }));
        setPose((current) => ({
          ...current,
          dragX: 0,
          dragY: 0
        }));
        return;
      }

      if (event.type === "feed") {
        setState("active");
        setMessageKey("pet.messages.feed");
        setStats((current) => ({
          ...current,
          energy: clampStat(current.energy + 3),
          hunger: clampStat(current.hunger + 15)
        }));
        return;
      }

      if (event.type === "play") {
        setState("active");
        setMessageKey("pet.messages.play");
        setStats((current) => ({
          ...current,
          bond: clampStat(current.bond + 7),
          energy: clampStat(current.energy - 10),
          hunger: clampStat(current.hunger - 5)
        }));
        return;
      }

      if (event.type === "rest") {
        setState("sleep");
        setMessageKey("pet.messages.rest");
        setStats((current) => ({
          ...current,
          energy: clampStat(current.energy + 18)
        }));
        return;
      }

      setState("idle");
      setMessageKey("pet.messages.idle");
    },
    [startIdleTimer]
  );

  const snapshot = useMemo<PetSnapshot>(
    () => ({
      messageKey,
      moodKey: MOOD_KEYS[state],
      pose,
      state,
      stats
    }),
    [messageKey, pose, state, stats]
  );

  return {
    dispatch,
    snapshot
  };
}

function clampStat(value: number) {
  return Math.max(0, Math.min(MAX_STAT, value));
}
