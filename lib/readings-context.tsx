import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { BloodPressureReading, generateId } from "./bp-utils";

const STORAGE_KEY = "@pressaoapp_readings";

// ─── State ────────────────────────────────────────────────────────────────────

interface ReadingsState {
  readings: BloodPressureReading[];
  loaded: boolean;
}

type ReadingsAction =
  | { type: "LOAD"; payload: BloodPressureReading[] }
  | { type: "ADD"; payload: BloodPressureReading }
  | { type: "DELETE"; payload: string };

function reducer(state: ReadingsState, action: ReadingsAction): ReadingsState {
  switch (action.type) {
    case "LOAD":
      return { readings: action.payload, loaded: true };
    case "ADD":
      return { ...state, readings: [action.payload, ...state.readings] };
    case "DELETE":
      return {
        ...state,
        readings: state.readings.filter((r) => r.id !== action.payload),
      };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface ReadingsContextValue {
  readings: BloodPressureReading[];
  loaded: boolean;
  addReading: (systolic: number, diastolic: number, pulse: number, note?: string) => Promise<void>;
  deleteReading: (id: string) => Promise<void>;
}

const ReadingsContext = createContext<ReadingsContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ReadingsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { readings: [], loaded: false });

  // Load from AsyncStorage on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        const parsed: BloodPressureReading[] = raw ? JSON.parse(raw) : [];
        dispatch({ type: "LOAD", payload: parsed });
      })
      .catch(() => dispatch({ type: "LOAD", payload: [] }));
  }, []);

  // Persist whenever readings change (after initial load)
  useEffect(() => {
    if (!state.loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.readings)).catch(
      () => {}
    );
  }, [state.readings, state.loaded]);

  const addReading = useCallback(
    async (systolic: number, diastolic: number, pulse: number, note?: string) => {
      const reading: BloodPressureReading = {
        id: generateId(),
        systolic,
        diastolic,
        pulse,
        timestamp: Date.now(),
        note,
      };
      dispatch({ type: "ADD", payload: reading });
    },
    []
  );

  const deleteReading = useCallback(async (id: string) => {
    dispatch({ type: "DELETE", payload: id });
  }, []);

  return (
    <ReadingsContext.Provider
      value={{ readings: state.readings, loaded: state.loaded, addReading, deleteReading }}
    >
      {children}
    </ReadingsContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useReadings() {
  const ctx = useContext(ReadingsContext);
  if (!ctx) throw new Error("useReadings must be used inside ReadingsProvider");
  return ctx;
}
