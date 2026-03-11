import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "./ui/icon-symbol";

interface Props {
  medication: string;
  onRemove: (medication: string) => void;
}

export function MedicationItem({ medication, onRemove }: Props) {
  const colors = useColors();

  return (
    <View style={[styles.item, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.content}>
        <IconSymbol name="drop.fill" size={16} color={colors.primary} />
        <Text style={[styles.text, { color: colors.foreground }]}>{medication}</Text>
      </View>
      <TouchableOpacity
        style={styles.removeBtn}
        onPress={() => onRemove(medication)}
        activeOpacity={0.7}
      >
        <IconSymbol name="xmark.circle.fill" size={20} color={colors.error} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  removeBtn: {
    padding: 4,
  },
});
