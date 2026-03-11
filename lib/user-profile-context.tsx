import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

const STORAGE_KEY = "@pressaoapp_userprofile";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserProfile {
  name: string;
  age: number | null;
  medications: string[];
}

interface ProfileState {
  profile: UserProfile;
  loaded: boolean;
}

type ProfileAction =
  | { type: "LOAD"; payload: UserProfile }
  | { type: "UPDATE"; payload: Partial<UserProfile> }
  | { type: "ADD_MEDICATION"; payload: string }
  | { type: "REMOVE_MEDICATION"; payload: string };

// ─── Reducer ──────────────────────────────────────────────────────────────────

const DEFAULT_PROFILE: UserProfile = {
  name: "",
  age: null,
  medications: [],
};

function reducer(state: ProfileState, action: ProfileAction): ProfileState {
  switch (action.type) {
    case "LOAD":
      return { profile: action.payload, loaded: true };
    case "UPDATE":
      return {
        ...state,
        profile: { ...state.profile, ...action.payload },
      };
    case "ADD_MEDICATION":
      return {
        ...state,
        profile: {
          ...state.profile,
          medications: [...state.profile.medications, action.payload],
        },
      };
    case "REMOVE_MEDICATION":
      return {
        ...state,
        profile: {
          ...state.profile,
          medications: state.profile.medications.filter(
            (m) => m !== action.payload
          ),
        },
      };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface UserProfileContextValue {
  profile: UserProfile;
  loaded: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  addMedication: (medication: string) => Promise<void>;
  removeMedication: (medication: string) => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    profile: DEFAULT_PROFILE,
    loaded: false,
  });

  // Load from AsyncStorage on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        const parsed: UserProfile = raw ? JSON.parse(raw) : DEFAULT_PROFILE;
        dispatch({ type: "LOAD", payload: parsed });
      })
      .catch(() => dispatch({ type: "LOAD", payload: DEFAULT_PROFILE }));
  }, []);

  // Persist whenever profile changes (after initial load)
  useEffect(() => {
    if (!state.loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.profile)).catch(
      () => {}
    );
  }, [state.profile, state.loaded]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    dispatch({ type: "UPDATE", payload: updates });
  }, []);

  const addMedication = useCallback(async (medication: string) => {
    if (medication.trim()) {
      dispatch({ type: "ADD_MEDICATION", payload: medication.trim() });
    }
  }, []);

  const removeMedication = useCallback(async (medication: string) => {
    dispatch({ type: "REMOVE_MEDICATION", payload: medication });
  }, []);

  return (
    <UserProfileContext.Provider
      value={{
        profile: state.profile,
        loaded: state.loaded,
        updateProfile,
        addMedication,
        removeMedication,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error("useUserProfile must be used inside UserProfileProvider");
  return ctx;
}
