import { describe, expect, it } from "vitest";
import { average, classifyBP, formatDate, formatDateTime, generateId } from "../lib/bp-utils";

describe("classifyBP", () => {
  it("classifica como hipotensão quando sistólica < 90", () => {
    expect(classifyBP(85, 55).category).toBe("hypotension");
  });

  it("classifica como hipotensão quando diastólica < 60", () => {
    expect(classifyBP(100, 55).category).toBe("hypotension");
  });

  it("classifica como normal para 115/75", () => {
    expect(classifyBP(115, 75).category).toBe("normal");
  });

  it("classifica como normal para 119/79", () => {
    expect(classifyBP(119, 79).category).toBe("normal");
  });

  it("classifica como elevada para 125/75", () => {
    expect(classifyBP(125, 75).category).toBe("elevated");
  });

  it("classifica como hipertensão estágio 1 para 135/85", () => {
    expect(classifyBP(135, 85).category).toBe("stage1");
  });

  it("classifica como hipertensão estágio 2 para 145/95", () => {
    expect(classifyBP(145, 95).category).toBe("stage2");
  });

  it("classifica como crise hipertensiva para 185/125", () => {
    expect(classifyBP(185, 125).category).toBe("crisis");
  });

  it("classifica como crise quando apenas diastólica > 120", () => {
    expect(classifyBP(170, 125).category).toBe("crisis");
  });

  it("classifica como crise quando apenas sistólica > 180", () => {
    expect(classifyBP(185, 100).category).toBe("crisis");
  });
});

describe("average", () => {
  it("retorna 0 para array vazio", () => {
    expect(average([])).toBe(0);
  });

  it("calcula média corretamente", () => {
    expect(average([120, 130, 110])).toBe(120);
  });

  it("arredonda para inteiro", () => {
    expect(average([121, 122])).toBe(122);
  });
});

describe("generateId", () => {
  it("gera IDs únicos", () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });

  it("retorna string não vazia", () => {
    expect(generateId().length).toBeGreaterThan(0);
  });
});

describe("formatDateTime", () => {
  it("retorna string não vazia para timestamp válido", () => {
    const result = formatDateTime(Date.now());
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("formatDate", () => {
  it("retorna string não vazia para timestamp válido", () => {
    const result = formatDate(Date.now());
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});
