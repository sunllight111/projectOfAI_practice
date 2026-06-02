import React, { memo } from "react";
import { Canvas } from "@react-three/fiber/native";
import { StyleSheet, View } from "react-native";

import type { PetEvent, PetSnapshot } from "../engine/petTypes";
import { usePetGestures } from "../interaction/usePetGestures";
import { PetScene } from "./PetScene";

type PetCanvasProps = {
  dispatch: (event: PetEvent) => void;
  snapshot: PetSnapshot;
};

export const PetCanvas = memo(function PetCanvas({
  dispatch,
  snapshot
}: PetCanvasProps) {
  const gestures = usePetGestures(dispatch);

  return (
    <View
      {...gestures.panHandlers}
      onLayout={(event) => {
        const { height, width } = event.nativeEvent.layout;
        gestures.onLayout(width, height);
      }}
      style={styles.container}
    >
      <Canvas
        camera={{ fov: 45, position: [0, 1.2, 7] }}
        shadows={false}
      >
        <PetScene snapshot={snapshot} />
      </Canvas>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 320,
    width: "100%"
  }
});
