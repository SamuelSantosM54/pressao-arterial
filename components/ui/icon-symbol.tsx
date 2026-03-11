// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<string, ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * SF Symbols → Material Icons mappings for PressãoApp
 */
const MAPPING = {
  // Navigation
  "house.fill":                             "home",
  "list.bullet":                            "list",
  "chart.bar.fill":                         "bar-chart",
  "chart.line.uptrend.xyaxis":              "show-chart",
  "gear":                                   "settings",
  // Actions
  "paperplane.fill":                        "send",
  "plus.circle.fill":                       "add-circle",
  "trash.fill":                             "delete",
  "checkmark.circle.fill":                  "check-circle",
  "xmark.circle.fill":                      "cancel",
  "arrow.left":                             "arrow-back",
  "chevron.right":                          "chevron-right",
  "chevron.left.forwardslash.chevron.right":"code",
  // Health
  "heart.fill":                             "favorite",
  "waveform.path.ecg":                      "monitor-heart",
  "drop.fill":                              "water-drop",
  "clock.fill":                             "access-time",
  "calendar":                               "calendar-today",
  "info.circle.fill":                       "info",
  "exclamationmark.triangle.fill":          "warning",
  "bell.fill":                              "notifications",
  "person.fill":                            "person",
  "square.and.arrow.up":                    "share",
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={MAPPING[name] ?? "help-outline"}
      style={style}
    />
  );
}
