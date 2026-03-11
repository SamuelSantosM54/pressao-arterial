import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BloodPressureReading, classifyBP, formatDateTime } from "@/lib/bp-utils";
import { ClassificationBadge } from "./ClassificationBadge";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "./ui/icon-symbol";

interface Props {
  reading: BloodPressureReading;
  onDelete?: (id: string) => void;
}

export function ReadingCard({ reading, onDelete }: Props) {
  const colors = useColors();
  const classification = classifyBP(reading.systolic, reading.diastolic);

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {/* Header: data + badge */}
      <View style={styles.header}>
        <View style={styles.dateRow}>
          <IconSymbol name="clock.fill" size={13} color={colors.muted} />
          <Text style={[styles.dateText, { color: colors.muted }]}>
            {formatDateTime(reading.timestamp)}
          </Text>
        </View>
        <ClassificationBadge classification={classification} size="sm" />
      </View>

      {/* Values */}
      <View style={styles.values}>
        <View style={styles.valueItem}>
          <Text style={[styles.valueNumber, { color: colors.foreground }]}>
            {reading.systolic}
          </Text>
          <Text style={[styles.valueLabel, { color: colors.muted }]}>Sistólica</Text>
          <Text style={[styles.valueUnit, { color: colors.muted }]}>mmHg</Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.valueItem}>
          <Text style={[styles.valueNumber, { color: colors.foreground }]}>
            {reading.diastolic}
          </Text>
          <Text style={[styles.valueLabel, { color: colors.muted }]}>Diastólica</Text>
          <Text style={[styles.valueUnit, { color: colors.muted }]}>mmHg</Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.valueItem}>
          <Text style={[styles.valueNumber, { color: colors.foreground }]}>
            {reading.pulse}
          </Text>
          <Text style={[styles.valueLabel, { color: colors.muted }]}>Pulso</Text>
          <Text style={[styles.valueUnit, { color: colors.muted }]}>bpm</Text>
        </View>
      </View>

      {/* Note */}
      {reading.note ? (
        <Text style={[styles.note, { color: colors.muted }]}>{reading.note}</Text>
      ) : null}

      {/* Delete button */}
      {onDelete ? (
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => onDelete(reading.id)}
          activeOpacity={0.7}
        >
          <IconSymbol name="trash.fill" size={16} color={colors.error} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    position: "relative",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    fontWeight: "500",
  },
  values: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  valueItem: {
    alignItems: "center",
    flex: 1,
  },
  valueNumber: {
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 34,
  },
  valueLabel: {
    fontSize: 11,
    fontWeight: "500",
    marginTop: 2,
    lineHeight: 16,
  },
  valueUnit: {
    fontSize: 10,
    lineHeight: 14,
  },
  divider: {
    width: 1,
    height: 48,
    marginHorizontal: 8,
  },
  note: {
    fontSize: 12,
    marginTop: 10,
    fontStyle: "italic",
    lineHeight: 18,
  },
  deleteBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 4,
  },
});
