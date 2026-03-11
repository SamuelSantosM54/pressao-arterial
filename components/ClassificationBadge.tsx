import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { BPClassification } from "@/lib/bp-utils";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface Props {
  classification: BPClassification;
  size?: "sm" | "md" | "lg";
}

export function ClassificationBadge({ classification, size = "md" }: Props) {
  const scheme = useColorScheme() ?? "light";
  const color = classification.hex[scheme];

  const paddingH = size === "sm" ? 8 : size === "lg" ? 16 : 12;
  const paddingV = size === "sm" ? 3 : size === "lg" ? 8 : 5;
  const fontSize = size === "sm" ? 11 : size === "lg" ? 15 : 13;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: color + "22",
          borderColor: color + "66",
          paddingHorizontal: paddingH,
          paddingVertical: paddingV,
        },
      ]}
    >
      <Text style={[styles.text, { color, fontSize }]}>
        {classification.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  text: {
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});
