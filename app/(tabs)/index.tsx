import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ClassificationBadge } from "@/components/ClassificationBadge";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { classifyBP } from "@/lib/bp-utils";
import { useReadings } from "@/lib/readings-context";

export default function HomeScreen() {
  const colors = useColors();
  const { addReading, readings } = useReadings();

  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [pulse, setPulse] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const diastolicRef = useRef<TextInput>(null);
  const pulseRef = useRef<TextInput>(null);
  const noteRef = useRef<TextInput>(null);

  const lastReading = readings[0] ?? null;
  const lastClassification = lastReading
    ? classifyBP(lastReading.systolic, lastReading.diastolic)
    : null;

  // Live preview classification
  const sysNum = parseInt(systolic, 10);
  const diaNum = parseInt(diastolic, 10);
  const liveClassification =
    !isNaN(sysNum) && !isNaN(diaNum) && sysNum > 0 && diaNum > 0
      ? classifyBP(sysNum, diaNum)
      : null;

  async function handleSave() {
    const sys = parseInt(systolic, 10);
    const dia = parseInt(diastolic, 10);
    const pul = parseInt(pulse, 10);

    if (isNaN(sys) || sys < 40 || sys > 300) {
      Alert.alert("Valor inválido", "Sistólica deve estar entre 40 e 300 mmHg.");
      return;
    }
    if (isNaN(dia) || dia < 20 || dia > 200) {
      Alert.alert("Valor inválido", "Diastólica deve estar entre 20 e 200 mmHg.");
      return;
    }
    if (isNaN(pul) || pul < 20 || pul > 300) {
      Alert.alert("Valor inválido", "Pulso deve estar entre 20 e 300 bpm.");
      return;
    }

    setSaving(true);
    try {
      await addReading(sys, dia, pul, note.trim() || undefined);
      const classification = classifyBP(sys, dia);
      if (classification.category === "crisis") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else if (classification.category === "normal") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      setSystolic("");
      setDiastolic("");
      setPulse("");
      setNote("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <IconSymbol name="heart.fill" size={22} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.title, { color: colors.foreground }]}>
                PressãoApp
              </Text>
              <Text style={[styles.subtitle, { color: colors.muted }]}>
                Registre sua pressão arterial
              </Text>
            </View>
          </View>

          {/* Última leitura */}
          {lastReading && lastClassification && (
            <View style={[styles.lastCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.lastTitle, { color: colors.muted }]}>
                Última medição
              </Text>
              <View style={styles.lastValues}>
                <Text style={[styles.lastBP, { color: colors.foreground }]}>
                  {lastReading.systolic}/{lastReading.diastolic}
                </Text>
                <Text style={[styles.lastUnit, { color: colors.muted }]}>mmHg</Text>
                <View style={styles.lastPulse}>
                  <IconSymbol name="heart.fill" size={12} color={colors.primary} />
                  <Text style={[styles.lastPulseText, { color: colors.muted }]}>
                    {lastReading.pulse} bpm
                  </Text>
                </View>
              </View>
              <ClassificationBadge classification={lastClassification} size="sm" />
            </View>
          )}

          {/* Formulário */}
          <View style={[styles.form, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.formTitle, { color: colors.foreground }]}>
              Nova Medição
            </Text>

            {/* Live classification preview */}
            {liveClassification && (
              <View style={styles.livePreview}>
                <ClassificationBadge classification={liveClassification} size="md" />
                <Text style={[styles.liveDesc, { color: colors.muted }]}>
                  {liveClassification.description}
                </Text>
              </View>
            )}

            {/* Inputs */}
            <View style={styles.inputsRow}>
              <BPInput
                label="Sistólica"
                unit="mmHg"
                value={systolic}
                onChangeText={setSystolic}
                placeholder="120"
                onSubmitEditing={() => diastolicRef.current?.focus()}
                colors={colors}
              />
              <View style={styles.inputSep}>
                <Text style={[styles.slash, { color: colors.muted }]}>/</Text>
              </View>
              <BPInput
                label="Diastólica"
                unit="mmHg"
                value={diastolic}
                onChangeText={setDiastolic}
                placeholder="80"
                ref={diastolicRef}
                onSubmitEditing={() => pulseRef.current?.focus()}
                colors={colors}
              />
            </View>

            <View style={styles.pulseRow}>
              <BPInput
                label="Pulso"
                unit="bpm"
                value={pulse}
                onChangeText={setPulse}
                placeholder="72"
                ref={pulseRef}
                onSubmitEditing={() => noteRef.current?.focus()}
                colors={colors}
              />
            </View>

            {/* Nota opcional */}
            <View style={styles.noteContainer}>
              <Text style={[styles.noteLabel, { color: colors.muted }]}>
                Observação (opcional)
              </Text>
              <TextInput
                ref={noteRef}
                style={[
                  styles.noteInput,
                  { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background },
                ]}
                value={note}
                onChangeText={setNote}
                placeholder="Ex: após exercício, em repouso..."
                placeholderTextColor={colors.muted}
                returnKeyType="done"
                multiline
                numberOfLines={2}
              />
            </View>

            {/* Botão Registrar */}
            <TouchableOpacity
              style={[
                styles.saveBtn,
                { backgroundColor: colors.primary },
                saving && { opacity: 0.7 },
              ]}
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.85}
            >
              <IconSymbol name="checkmark.circle.fill" size={20} color="#fff" />
              <Text style={styles.saveBtnText}>
                {saving ? "Salvando..." : "Registrar Medição"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Legenda de classificação */}
          <View style={[styles.legend, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.legendTitle, { color: colors.foreground }]}>
              Referência de Classificação
            </Text>
            {LEGEND_ITEMS.map((item) => (
              <View key={item.label} style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Text style={[styles.legendLabel, { color: colors.foreground }]}>
                  {item.label}
                </Text>
                <Text style={[styles.legendRange, { color: colors.muted }]}>
                  {item.range}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

// ─── BPInput ──────────────────────────────────────────────────────────────────

interface BPInputProps {
  label: string;
  unit: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  onSubmitEditing?: () => void;
  colors: ReturnType<typeof useColors>;
  fullWidth?: boolean;
}

const BPInput = React.forwardRef<TextInput, BPInputProps>(
  ({ label, unit, value, onChangeText, placeholder, onSubmitEditing, colors, fullWidth }, ref) => (
    <View style={[styles.inputWrapper, fullWidth && styles.inputWrapperFull]}>
      <Text style={[styles.inputLabel, { color: colors.muted }]}>{label}</Text>
      <View style={[styles.inputBox, { borderColor: colors.border, backgroundColor: colors.background }]}>
        <TextInput
          ref={ref}
          style={[styles.inputField, { color: colors.foreground }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          keyboardType="number-pad"
          returnKeyType="next"
          onSubmitEditing={onSubmitEditing}
          maxLength={3}
          textAlign="center"
        />
        <Text style={[styles.inputUnit, { color: colors.muted }]}>{unit}</Text>
      </View>
    </View>
  )
);
BPInput.displayName = "BPInput";

// ─── Legend data ──────────────────────────────────────────────────────────────

const LEGEND_ITEMS = [
  { label: "Hipotensão", color: "#2563EB", range: "< 90/60" },
  { label: "Normal", color: "#16A34A", range: "< 120/80" },
  { label: "Elevada", color: "#D97706", range: "120–129 / < 80" },
  { label: "Hipertensão Est. 1", color: "#EA580C", range: "130–139 / 80–89" },
  { label: "Hipertensão Est. 2", color: "#DC2626", range: "≥ 140 / ≥ 90" },
  { label: "Crise Hipertensiva", color: "#7F1D1D", range: "> 180 / > 120" },
];

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 4,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E5393522",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  lastCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 6,
  },
  lastTitle: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  lastValues: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
  },
  lastBP: {
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 38,
  },
  lastUnit: {
    fontSize: 13,
    marginBottom: 4,
    lineHeight: 18,
  },
  lastPulse: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginLeft: 8,
    marginBottom: 4,
  },
  lastPulseText: {
    fontSize: 13,
    lineHeight: 18,
  },
  form: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    gap: 16,
  },
  formTitle: {
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 22,
  },
  livePreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  liveDesc: {
    fontSize: 12,
    flex: 1,
    lineHeight: 18,
  },
  inputsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 0,
  },
  inputWrapper: {
    flex: 1,
    gap: 6,
  },
  inputWrapperFull: {
    flex: 0,
    width: "100%",
  },
  pulseRow: {
    flexDirection: "row",
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    lineHeight: 16,
  },
  inputBox: {
    borderRadius: 12,
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 56,
  },
  inputField: {
    flex: 1,
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 34,
  },
  inputUnit: {
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 18,
  },
  inputSep: {
    paddingBottom: 8,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  slash: {
    fontSize: 28,
    fontWeight: "300",
    lineHeight: 56,
  },
  noteContainer: {
    gap: 6,
  },
  noteLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    lineHeight: 16,
  },
  noteInput: {
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 12,
    fontSize: 14,
    lineHeight: 20,
    minHeight: 56,
  },
  saveBtn: {
    borderRadius: 14,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 22,
  },
  legend: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
    lineHeight: 20,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  legendRange: {
    fontSize: 12,
    lineHeight: 18,
  },
});
