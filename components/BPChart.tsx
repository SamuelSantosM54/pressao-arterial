import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Line, Path, Text as SvgText } from "react-native-svg";
import { BloodPressureReading, formatDate } from "@/lib/bp-utils";
import { useColors } from "@/hooks/use-colors";

interface Props {
  readings: BloodPressureReading[];
  width: number;
  height?: number;
}

const PADDING = { top: 16, right: 16, bottom: 36, left: 40 };

function buildPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
}

export function BPChart({ readings, width, height = 200 }: Props) {
  const colors = useColors();

  const chartW = width - PADDING.left - PADDING.right;
  const chartH = height - PADDING.top - PADDING.bottom;

  const { sysPoints, diaPoints, xLabels, yMin, yMax } = useMemo(() => {
    if (readings.length === 0) {
      return { sysPoints: [], diaPoints: [], xLabels: [], yMin: 60, yMax: 180 };
    }

    const sorted = [...readings].sort((a, b) => a.timestamp - b.timestamp);
    const allValues = sorted.flatMap((r) => [r.systolic, r.diastolic]);
    const rawMin = Math.min(...allValues);
    const rawMax = Math.max(...allValues);
    const pad = 15;
    const yMin = Math.max(40, rawMin - pad);
    const yMax = Math.min(220, rawMax + pad);

    const toX = (i: number) =>
      PADDING.left + (sorted.length === 1 ? chartW / 2 : (i / (sorted.length - 1)) * chartW);
    const toY = (v: number) =>
      PADDING.top + chartH - ((v - yMin) / (yMax - yMin)) * chartH;

    const sysPoints = sorted.map((r, i) => ({ x: toX(i), y: toY(r.systolic) }));
    const diaPoints = sorted.map((r, i) => ({ x: toX(i), y: toY(r.diastolic) }));

    // Show up to 5 x-axis labels
    const step = Math.max(1, Math.floor(sorted.length / 5));
    const xLabels = sorted
      .map((r, i) => ({ label: formatDate(r.timestamp), x: toX(i), show: i % step === 0 || i === sorted.length - 1 }))
      .filter((l) => l.show);

    return { sysPoints, diaPoints, xLabels, yMin, yMax };
  }, [readings, chartW, chartH]);

  if (readings.length === 0) {
    return (
      <View style={[styles.empty, { height }]}>
        <Text style={[styles.emptyText, { color: colors.muted }]}>
          Sem dados para exibir
        </Text>
      </View>
    );
  }

  const yTicks = [yMin, Math.round((yMin + yMax) / 2), yMax];

  return (
    <Svg width={width} height={height}>
      {/* Y-axis grid lines and labels */}
      {yTicks.map((v) => {
        const y = PADDING.top + chartH - ((v - yMin) / (yMax - yMin)) * chartH;
        return (
          <React.Fragment key={v}>
            <Line
              x1={PADDING.left}
              y1={y}
              x2={PADDING.left + chartW}
              y2={y}
              stroke={colors.border}
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            <SvgText
              x={PADDING.left - 6}
              y={y + 4}
              fontSize={10}
              fill={colors.muted}
              textAnchor="end"
            >
              {v}
            </SvgText>
          </React.Fragment>
        );
      })}

      {/* X-axis labels */}
      {xLabels.map((l) => (
        <SvgText
          key={l.x}
          x={l.x}
          y={height - 6}
          fontSize={9}
          fill={colors.muted}
          textAnchor="middle"
        >
          {l.label}
        </SvgText>
      ))}

      {/* Diastolic line */}
      <Path
        d={buildPath(diaPoints)}
        stroke="#2563EB"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {diaPoints.map((p, i) => (
        <Circle key={i} cx={p.x} cy={p.y} r={3.5} fill="#2563EB" />
      ))}

      {/* Systolic line */}
      <Path
        d={buildPath(sysPoints)}
        stroke={colors.primary}
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {sysPoints.map((p, i) => (
        <Circle key={i} cx={p.x} cy={p.y} r={4} fill={colors.primary} />
      ))}
    </Svg>
  );
}

const styles = StyleSheet.create({
  empty: {
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 14,
  },
});
