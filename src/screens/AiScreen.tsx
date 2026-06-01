import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function AiScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI 22</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24
  },
  title: {
    color: "#111827",
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: 0
  }
});
