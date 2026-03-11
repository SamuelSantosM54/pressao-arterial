export type BPCategory =
  | "hypotension"
  | "normal"
  | "elevated"
  | "stage1"
  | "stage2"
  | "crisis";

export interface BPClassification {
  category: BPCategory;
  label: string;
  description: string;
  colorToken: "success" | "warning" | "error" | "primary" | "muted";
  hex: { light: string; dark: string };
}

export interface BloodPressureReading {
  id: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  timestamp: number; // ms since epoch
  note?: string;
}

export const BP_CLASSIFICATIONS: Record<BPCategory, BPClassification> = {
  hypotension: {
    category: "hypotension",
    label: "Hipotensão",
    description: "Pressão abaixo do normal",
    colorToken: "primary",
    hex: { light: "#2563EB", dark: "#60A5FA" },
  },
  normal: {
    category: "normal",
    label: "Normal",
    description: "Pressão arterial saudável",
    colorToken: "success",
    hex: { light: "#16A34A", dark: "#4ADE80" },
  },
  elevated: {
    category: "elevated",
    label: "Elevada",
    description: "Atenção: pressão levemente elevada",
    colorToken: "warning",
    hex: { light: "#D97706", dark: "#FBBF24" },
  },
  stage1: {
    category: "stage1",
    label: "Hipertensão Estágio 1",
    description: "Consulte um médico",
    colorToken: "error",
    hex: { light: "#EA580C", dark: "#FB923C" },
  },
  stage2: {
    category: "stage2",
    label: "Hipertensão Estágio 2",
    description: "Procure atendimento médico",
    colorToken: "error",
    hex: { light: "#DC2626", dark: "#F87171" },
  },
  crisis: {
    category: "crisis",
    label: "Crise Hipertensiva",
    description: "Procure emergência médica imediatamente",
    colorToken: "error",
    hex: { light: "#7F1D1D", dark: "#FCA5A5" },
  },
};

/**
 * Classifica a pressão arterial conforme diretrizes AHA/OMS.
 */
export function classifyBP(systolic: number, diastolic: number): BPClassification {
  if (systolic > 180 || diastolic > 120) return BP_CLASSIFICATIONS.crisis;
  if (systolic >= 140 || diastolic >= 90) return BP_CLASSIFICATIONS.stage2;
  if (systolic >= 130 || diastolic >= 80) return BP_CLASSIFICATIONS.stage1;
  if (systolic >= 120 && diastolic < 80)  return BP_CLASSIFICATIONS.elevated;
  if (systolic < 90 || diastolic < 60)    return BP_CLASSIFICATIONS.hypotension;
  return BP_CLASSIFICATIONS.normal;
}

/**
 * Formata data/hora de forma legível em pt-BR.
 */
export function formatDateTime(timestamp: number): string {
  const d = new Date(timestamp);
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

/**
 * Gera um ID único simples.
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Calcula a média de um array de números.
 */
export function average(nums: number[]): number {
  if (nums.length === 0) return 0;
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}
