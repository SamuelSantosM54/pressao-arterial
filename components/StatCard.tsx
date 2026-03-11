import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/use-colors";

interface Props {
  label: string;
  value: string | number;
  unit?: string;
  accentColor?: string;
  subtitle?: string;
}

export function StatCard({ label, value, unit, accentColor, subtitle }: Props) {
  const colors = useColors();
  const accent = accentColor ?? colors.primary;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.accent, { backgroundColor: accent }]} />
      <Text style={[styles.label, { color: colors.muted }]}>{label}</Text>
      <View style={styles.valueRow}>
        <Text style={[styles.value, { color: colors.foreground }]}>{value}</Text>
        {unit ? (
          <Text style={[styles.unit, { color: colors.muted }]}>{unit}</Text>
        ) : null}
      </View>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: colors.muted }]}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    overflow: "hidden",
    position: "relative",
  },
  accent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 6,
    lineHeight: 16,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 4,
    gap: 3,
  },
  value: {
    fontSize: 26,
    fontWeight: "700",
    lineHeight: 32,
  },
  unit: {
    fontSize: 12,
    marginBottom: 4,
    lineHeight: 18,
  },
  subtitle: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 16,
  },
});
