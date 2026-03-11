import * as Haptics from "expo-haptics";
import React, { useCallback } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ReadingCard } from "@/components/ReadingCard";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useReadings } from "@/lib/readings-context";

export default function HistoricoScreen() {
  const colors = useColors();
  const { readings, deleteReading } = useReadings();

  const handleDelete = useCallback(
    (id: string) => {
      Alert.alert(
        "Excluir leitura",
        "Deseja remover esta medição do histórico?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Excluir",
            style: "destructive",
            onPress: () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              deleteReading(id);
            },
          },
        ]
      );
    },
    [deleteReading]
  );

  return (
    <ScreenContainer>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          <IconSymbol name="list.bullet" size={22} color={colors.primary} />
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            Histórico
          </Text>
        </View>
        <View style={[styles.countBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.countText, { color: colors.muted }]}>
            {readings.length} {readings.length === 1 ? "registro" : "registros"}
          </Text>
        </View>
      </View>

      {readings.length === 0 ? (
        <View style={styles.empty}>
          <IconSymbol name="heart.fill" size={48} color={colors.border} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
            Nenhuma medição ainda
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.muted }]}>
            Registre sua primeira medição na aba Início
          </Text>
        </View>
      ) : (
        <FlatList
          data={readings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ReadingCard reading={item} onDelete={handleDelete} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 26,
  },
  countBadge: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countText: {
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 18,
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 24,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
