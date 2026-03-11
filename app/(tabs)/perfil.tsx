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

import { MedicationItem } from "@/components/MedicationItem";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useUserProfile } from "@/lib/user-profile-context";

export default function PerfilScreen() {
  const colors = useColors();
  const { profile, updateProfile, addMedication, removeMedication } = useUserProfile();

  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(profile.age ? String(profile.age) : "");
  const [medicationInput, setMedicationInput] = useState("");
  const [saving, setSaving] = useState(false);

  const ageRef = useRef<TextInput>(null);
  const medicationRef = useRef<TextInput>(null);

  async function handleSaveName() {
    if (name.trim()) {
      setSaving(true);
      try {
        await updateProfile({ name: name.trim() });
      } finally {
        setSaving(false);
      }
    }
  }

  async function handleSaveAge() {
    const ageNum = age ? parseInt(age, 10) : null;
    if (ageNum !== null && (isNaN(ageNum) || ageNum < 0 || ageNum > 150)) {
      Alert.alert("Valor inválido", "Idade deve estar entre 0 e 150 anos.");
      return;
    }
    setSaving(true);
    try {
      await updateProfile({ age: ageNum });
    } finally {
      setSaving(false);
    }
  }

  async function handleAddMedication() {
    if (medicationInput.trim()) {
      setSaving(true);
      try {
        await addMedication(medicationInput);
        setMedicationInput("");
      } finally {
        setSaving(false);
      }
    }
  }

  async function handleRemoveMedication(medication: string) {
    Alert.alert(
      "Remover medicamento",
      `Deseja remover "${medication}" da lista?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => removeMedication(medication),
        },
      ]
    );
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
              <IconSymbol name="person.fill" size={24} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.title, { color: colors.foreground }]}>
                Perfil
              </Text>
              <Text style={[styles.subtitle, { color: colors.muted }]}>
                Suas informações pessoais
              </Text>
            </View>
          </View>

          {/* Nome */}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>
              Nome Completo
            </Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[
                  styles.input,
                  { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background },
                ]}
                value={name}
                onChangeText={setName}
                placeholder="Digite seu nome"
                placeholderTextColor={colors.muted}
                returnKeyType="next"
                onSubmitEditing={() => ageRef.current?.focus()}
              />
              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: colors.primary }]}
                onPress={handleSaveName}
                disabled={saving || name === profile.name}
                activeOpacity={0.8}
              >
                <IconSymbol name="checkmark.circle.fill" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
            {profile.name && (
              <Text style={[styles.savedText, { color: colors.success }]}>
                ✓ Salvo: {profile.name}
              </Text>
            )}
          </View>

          {/* Idade */}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>
              Idade
            </Text>
            <View style={styles.inputRow}>
              <TextInput
                ref={ageRef}
                style={[
                  styles.input,
                  { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background },
                ]}
                value={age}
                onChangeText={setAge}
                placeholder="Ex: 45"
                placeholderTextColor={colors.muted}
                keyboardType="number-pad"
                returnKeyType="next"
                onSubmitEditing={() => medicationRef.current?.focus()}
                maxLength={3}
              />
              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: colors.primary }]}
                onPress={handleSaveAge}
                disabled={saving || age === (profile.age ? String(profile.age) : "")}
                activeOpacity={0.8}
              >
                <IconSymbol name="checkmark.circle.fill" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
            {profile.age !== null && (
              <Text style={[styles.savedText, { color: colors.success }]}>
                ✓ Salvo: {profile.age} anos
              </Text>
            )}
          </View>

          {/* Medicamentos */}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>
              Medicamentos em Uso
            </Text>
            <View style={styles.medicationInput}>
              <TextInput
                ref={medicationRef}
                style={[
                  styles.input,
                  { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background },
                ]}
                value={medicationInput}
                onChangeText={setMedicationInput}
                placeholder="Ex: Losartana 50mg"
                placeholderTextColor={colors.muted}
                returnKeyType="done"
                onSubmitEditing={handleAddMedication}
              />
              <TouchableOpacity
                style={[styles.addBtn, { backgroundColor: colors.primary }]}
                onPress={handleAddMedication}
                disabled={saving || !medicationInput.trim()}
                activeOpacity={0.8}
              >
                <IconSymbol name="plus.circle.fill" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Lista de medicamentos */}
            {profile.medications.length > 0 ? (
              <View style={styles.medicationList}>
                <Text style={[styles.listTitle, { color: colors.muted }]}>
                  {profile.medications.length} {profile.medications.length === 1 ? "medicamento" : "medicamentos"}
                </Text>
                {profile.medications.map((med) => (
                  <MedicationItem
                    key={med}
                    medication={med}
                    onRemove={handleRemoveMedication}
                  />
                ))}
              </View>
            ) : (
              <Text style={[styles.emptyMeds, { color: colors.muted }]}>
                Nenhum medicamento registrado
              </Text>
            )}
          </View>

          {/* Info card */}
          <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <IconSymbol name="info.circle.fill" size={18} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.muted }]}>
              Essas informações ajudam a personalizar suas recomendações e alertas de pressão arterial.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

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
    width: 48,
    height: 48,
    borderRadius: 24,
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
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 20,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    lineHeight: 20,
  },
  saveBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  savedText: {
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 18,
  },
  medicationInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  medicationList: {
    gap: 8,
  },
  listTitle: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    lineHeight: 16,
  },
  emptyMeds: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
    paddingVertical: 12,
  },
  infoCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  infoText: {
    fontSize: 12,
    flex: 1,
    lineHeight: 18,
  },
});
