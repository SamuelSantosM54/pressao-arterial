import React, { useMemo, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { BPChart } from "@/components/BPChart";
import { ClassificationBadge } from "@/components/ClassificationBadge";
import { StatCard } from "@/components/StatCard";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { average, BP_CLASSIFICATIONS, BPCategory, classifyBP } from "@/lib/bp-utils";
import { useReadings } from "@/lib/readings-context";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CHART_WIDTH = SCREEN_WIDTH - 40;

type Period = "7d" | "30d" | "all";

const PERIOD_LABELS: Record<Period, string> = {
  "7d": "7 dias",
  "30d": "30 dias",
  all: "Todos",
};

export default function EstatisticasScreen() {
  const colors = useColors();
  const { readings } = useReadings();
  const [period, setPeriod] = useState<Period>("30d");

  const filteredReadings = useMemo(() => {
    const now = Date.now();
    if (period === "7d") return readings.filter((r) => now - r.timestamp <= 7 * 86400000);
    if (period === "30d") return readings.filter((r) => now - r.timestamp <= 30 * 86400000);
    return readings;
  }, [readings, period]);

  const stats = useMemo(() => {
    if (filteredReadings.length === 0) return null;
    const avgSys = average(filteredReadings.map((r) => r.systolic));
    const avgDia = average(filteredReadings.map((r) => r.diastolic));
    const avgPulse = average(filteredReadings.map((r) => r.pulse));
    const maxSys = Math.max(...filteredReadings.map((r) => r.systolic));
    const minSys = Math.min(...filteredReadings.map((r) => r.systolic));
    const avgClassification = classifyBP(avgSys, avgDia);

    // Distribution by category
    const dist: Partial<Record<BPCategory, number>> = {};
    for (const r of filteredReadings) {
      const cat = classifyBP(r.systolic, r.diastolic).category;
      dist[cat] = (dist[cat] ?? 0) + 1;
    }

    return { avgSys, avgDia, avgPulse, maxSys, minSys, avgClassification, dist };
  }, [filteredReadings]);

  const chartReadings = useMemo(
    () => [...filteredReadings].sort((a, b) => a.timestamp - b.timestamp).slice(-20),
    [filteredReadings]
  );

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <IconSymbol name="chart.line.uptrend.xyaxis" size={22} color={colors.primary} />
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>
              Estatísticas
            </Text>
          </View>
        </View>

        {/* Period filter */}
        <View style={[styles.periodRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {(["7d", "30d", "all"] as Period[]).map((p) => (
            <TouchableOpacity
              key={p}
              style={[
                styles.periodBtn,
                period === p && { backgroundColor: colors.primary },
              ]}
              onPress={() => setPeriod(p)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.periodText,
                  { color: period === p ? "#fff" : colors.muted },
                ]}
              >
                {PERIOD_LABELS[p]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filteredReadings.length === 0 ? (
          <View style={styles.empty}>
            <IconSymbol name="chart.bar.fill" size={48} color={colors.border} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              Sem dados no período
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.muted }]}>
              Registre medições para ver as estatísticas
            </Text>
          </View>
        ) : (
          <>
            {/* Summary cards */}
            {stats && (
              <>
                <View style={styles.statsRow}>
                  <StatCard
                    label="Sistólica Média"
                    value={stats.avgSys}
                    unit="mmHg"
                    accentColor={colors.primary}
                  />
                  <StatCard
                    label="Diastólica Média"
                    value={stats.avgDia}
                    unit="mmHg"
                    accentColor="#2563EB"
                  />
                </View>
                <View style={styles.statsRow}>
                  <StatCard
                    label="Pulso Médio"
                    value={stats.avgPulse}
                    unit="bpm"
                    accentColor={colors.success}
                  />
                  <StatCard
                    label="Total de Medições"
                    value={filteredReadings.length}
                    accentColor={colors.warning}
                  />
                </View>
                <View style={styles.statsRow}>
                  <StatCard
                    label="Sistólica Máx."
                    value={stats.maxSys}
                    unit="mmHg"
                    accentColor={colors.error}
                    subtitle="pico registrado"
                  />
                  <StatCard
                    label="Sistólica Mín."
                    value={stats.minSys}
                    unit="mmHg"
                    accentColor={colors.success}
                    subtitle="menor registro"
                  />
                </View>

                {/* Average classification */}
                <View style={[styles.avgClassCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Text style={[styles.avgClassLabel, { color: colors.muted }]}>
                    Classificação Média
                  </Text>
                  <View style={styles.avgClassRow}>
                    <ClassificationBadge classification={stats.avgClassification} size="lg" />
                    <Text style={[styles.avgClassDesc, { color: colors.muted }]}>
                      {stats.avgClassification.description}
                    </Text>
                  </View>
                </View>
              </>
            )}

            {/* Chart */}
            <View style={[styles.chartCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.chartTitle, { color: colors.foreground }]}>
                Evolução da Pressão
              </Text>
              <View style={styles.chartLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
                  <Text style={[styles.legendText, { color: colors.muted }]}>Sistólica</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: "#2563EB" }]} />
                  <Text style={[styles.legendText, { color: colors.muted }]}>Diastólica</Text>
                </View>
              </View>
              <BPChart
                readings={chartReadings}
                width={CHART_WIDTH - 32}
                height={200}
              />
            </View>

            {/* Distribution */}
            {stats && (
              <View style={[styles.distCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.distTitle, { color: colors.foreground }]}>
                  Distribuição por Classificação
                </Text>
                {Object.entries(stats.dist).map(([cat, count]) => {
                  const cls = BP_CLASSIFICATIONS[cat as BPCategory];
                  const pct = Math.round(((count ?? 0) / filteredReadings.length) * 100);
                  return (
                    <View key={cat} style={styles.distRow}>
                      <View style={styles.distLabel}>
                        <View style={[styles.distDot, { backgroundColor: cls.hex.light }]} />
                        <Text style={[styles.distText, { color: colors.foreground }]}>
                          {cls.label}
                        </Text>
                      </View>
                      <View style={styles.distBarWrapper}>
                        <View
                          style={[
                            styles.distBar,
                            { backgroundColor: cls.hex.light + "33", width: `${pct}%` },
                          ]}
                        />
                        <View
                          style={[
                            styles.distBarFill,
                            { backgroundColor: cls.hex.light, width: `${pct}%` },
                          ]}
                        />
                      </View>
                      <Text style={[styles.distPct, { color: colors.muted }]}>
                        {count} ({pct}%)
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          </>
        )}
      </ScrollView>
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
    justifyContent: "space-between",
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
  periodRow: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    gap: 4,
  },
  periodBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9,
    alignItems: "center",
  },
  periodText: {
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  avgClassCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  avgClassLabel: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  avgClassRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avgClassDesc: {
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  chartCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 20,
  },
  chartLegend: {
    flexDirection: "row",
    gap: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    lineHeight: 18,
  },
  distCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  distTitle: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 20,
  },
  distRow: {
    gap: 6,
  },
  distLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  distDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  distText: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
  },
  distBarWrapper: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  distBar: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    borderRadius: 4,
  },
  distBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  distPct: {
    fontSize: 11,
    lineHeight: 16,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 60,
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
