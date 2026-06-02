import { useMemo, useRef, useState } from "react";
import { PanResponder } from "react-native";

import type { PetEvent } from "../engine/petTypes";
import { getPetHitRegion } from "./petHitTest";

type Size = {
  height: number;
  width: number;
};

export function usePetGestures(dispatch: (event: PetEvent) => void) {
  const [size, setSize] = useState<Size>({ height: 1, width: 1 });
  const dragStarted = useRef(false);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dx) > 7 || Math.abs(gestureState.dy) > 7,
        onPanResponderGrant: (_, gestureState) => {
          dragStarted.current = false;
          dispatch({
            type: "tap",
            region: getPetHitRegion(
              gestureState.x0,
              gestureState.y0,
              size.width,
              size.height
            ),
            x: normalizeScreenX(gestureState.x0, size.width),
            y: normalizeScreenY(gestureState.y0, size.height)
          });
        },
        onPanResponderMove: (_, gestureState) => {
          if (!dragStarted.current) {
            dragStarted.current = true;
            dispatch({
              type: "dragStart",
              x: normalizeScreenX(gestureState.x0, size.width),
              y: normalizeScreenY(gestureState.y0, size.height)
            });
          }

          dispatch({
            type: "dragMove",
            x: clamp(gestureState.dx / 85, -1.15, 1.15),
            y: clamp(-gestureState.dy / 95, -0.95, 0.95)
          });
        },
        onPanResponderRelease: () => {
          if (dragStarted.current) {
            dispatch({ type: "dragEnd" });
          }
          dragStarted.current = false;
        },
        onPanResponderTerminate: () => {
          if (dragStarted.current) {
            dispatch({ type: "dragEnd" });
          }
          dragStarted.current = false;
        }
      }),
    [dispatch, size.height, size.width]
  );

  return {
    onLayout: (width: number, height: number) => setSize({ height, width }),
    panHandlers: panResponder.panHandlers
  };
}

function normalizeScreenX(value: number, width: number) {
  return clamp((value / Math.max(width, 1) - 0.5) * 2, -1, 1);
}

function normalizeScreenY(value: number, height: number) {
  return clamp((value / Math.max(height, 1) - 0.5) * -2, -1, 1);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
