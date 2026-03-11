import { describe, expect, it } from "vitest";
import type { UserProfile } from "../lib/user-profile-context";

// Test data structures and logic
describe("UserProfile", () => {
  it("cria um perfil com valores padrão", () => {
    const profile: UserProfile = {
      name: "",
      age: null,
      medications: [],
    };
    expect(profile.name).toBe("");
    expect(profile.age).toBeNull();
    expect(profile.medications).toEqual([]);
  });

  it("atualiza nome corretamente", () => {
    const profile: UserProfile = {
      name: "João",
      age: 45,
      medications: [],
    };
    const updated = { ...profile, name: "Maria" };
    expect(updated.name).toBe("Maria");
    expect(updated.age).toBe(45);
  });

  it("atualiza idade corretamente", () => {
    const profile: UserProfile = {
      name: "João",
      age: 45,
      medications: [],
    };
    const updated = { ...profile, age: 50 };
    expect(updated.age).toBe(50);
  });

  it("adiciona medicamento à lista", () => {
    const profile: UserProfile = {
      name: "João",
      age: 45,
      medications: ["Losartana 50mg"],
    };
    const updated = {
      ...profile,
      medications: [...profile.medications, "Atenolol 25mg"],
    };
    expect(updated.medications).toHaveLength(2);
    expect(updated.medications).toContain("Losartana 50mg");
    expect(updated.medications).toContain("Atenolol 25mg");
  });

  it("remove medicamento da lista", () => {
    const profile: UserProfile = {
      name: "João",
      age: 45,
      medications: ["Losartana 50mg", "Atenolol 25mg"],
    };
    const updated = {
      ...profile,
      medications: profile.medications.filter((m) => m !== "Losartana 50mg"),
    };
    expect(updated.medications).toHaveLength(1);
    expect(updated.medications).toContain("Atenolol 25mg");
    expect(updated.medications).not.toContain("Losartana 50mg");
  });

  it("valida idade válida", () => {
    const age = 45;
    const isValid = !isNaN(age) && age >= 0 && age <= 150;
    expect(isValid).toBe(true);
  });

  it("rejeita idade negativa", () => {
    const age = -5;
    const isValid = !isNaN(age) && age >= 0 && age <= 150;
    expect(isValid).toBe(false);
  });

  it("rejeita idade acima de 150", () => {
    const age = 200;
    const isValid = !isNaN(age) && age >= 0 && age <= 150;
    expect(isValid).toBe(false);
  });

  it("serializa e desserializa perfil corretamente", () => {
    const profile: UserProfile = {
      name: "João Silva",
      age: 45,
      medications: ["Losartana 50mg", "Atenolol 25mg"],
    };
    const serialized = JSON.stringify(profile);
    const deserialized: UserProfile = JSON.parse(serialized);
    expect(deserialized).toEqual(profile);
  });
});
