import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  age: string;
  weight: string;
  goalWeight: string;
  dietary: 'veg' | 'non-veg';
  goal: 'weight-loss' | 'muscle-gain';
  profileImage?: string;
}

export interface ChartFormData {
  age: string;
  height: string;
  weight: string;
  goalWeight: string;
  activityLevel: string;
  dietary: 'veg' | 'non-veg';
  cuisine: string;
  difficulty: 'easy' | 'moderate' | 'strict';
  budgetFriendly: boolean;
}

interface AppContextType {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
  chartForm: ChartFormData;
  setChartForm: (f: ChartFormData) => void;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  drawerOpen: boolean;
  setDrawerOpen: (v: boolean) => void;
}

/* ── Safe defaults ──────────────────────────────────────────────────
   Used both as the context's initial value AND as the fallback when
   a component is rendered outside AppProvider (e.g. during Figma Make's
   React Fast Refresh isolated component preview).
─────────────────────────────────────────────────────────────────── */
export const defaultProfile: UserProfile = {
  name: 'Priya Sharma',
  email: 'priya.sharma@gmail.com',
  age: '28',
  weight: '65',
  goalWeight: '58',
  dietary: 'veg',
  goal: 'weight-loss',
  profileImage: undefined,
};

export const defaultChartForm: ChartFormData = {
  age: '28',
  height: '163',
  weight: '65',
  goalWeight: '58',
  activityLevel: 'moderate',
  dietary: 'veg',
  cuisine: 'Indian',
  difficulty: 'moderate',
  budgetFriendly: false,
};

const defaultContextValue: AppContextType = {
  profile: defaultProfile,
  setProfile: () => {},
  chartForm: defaultChartForm,
  setChartForm: () => {},
  darkMode: false,
  setDarkMode: () => {},
  drawerOpen: false,
  setDrawerOpen: () => {},
};

/* ── Context (nullable so TypeScript knows it can be absent) ──── */
const AppContext = createContext<AppContextType | null>(null);

/* ── Storage helpers ─────────────────────────────────────────── */
const PROFILE_KEY  = 'eatwell_profile';
const IMAGE_KEY    = 'eatwell_profile_image';
const CHART_KEY    = 'eatwell_chart';
const DARKMODE_KEY = 'eatwell_dark_mode';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {}
  return fallback;
}

function saveToStorage<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function loadProfile(): UserProfile {
  const base = loadFromStorage<UserProfile>(PROFILE_KEY, defaultProfile);
  try {
    const img = localStorage.getItem(IMAGE_KEY);
    if (img) base.profileImage = img;
  } catch {}
  return base;
}

function persistProfile(p: UserProfile) {
  const { profileImage, ...rest } = p;
  saveToStorage(PROFILE_KEY, rest);
  if (profileImage) {
    const ok = saveToStorage(IMAGE_KEY, profileImage);
    if (!ok) {
      try { localStorage.removeItem(IMAGE_KEY); } catch {}
    }
  } else {
    try { localStorage.removeItem(IMAGE_KEY); } catch {}
  }
}

/* ── Provider ────────────────────────────────────────────────── */
export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState]     = useState<UserProfile>(loadProfile);
  const [chartForm, setChartFormState] = useState<ChartFormData>(() =>
    loadFromStorage(CHART_KEY, defaultChartForm)
  );
  const [darkMode, setDarkModeState]   = useState<boolean>(() =>
    loadFromStorage(DARKMODE_KEY, false)
  );
  const [drawerOpen, setDrawerOpen]    = useState(false);

  const setProfile = useCallback((p: UserProfile) => {
    setProfileState(p);
    persistProfile(p);
  }, []);

  const setChartForm = useCallback((f: ChartFormData) => {
    setChartFormState(f);
    saveToStorage(CHART_KEY, f);
  }, []);

  const setDarkMode = useCallback((v: boolean) => {
    setDarkModeState(v);
    saveToStorage(DARKMODE_KEY, v);
  }, []);

  return (
    <AppContext.Provider value={{
      profile, setProfile,
      chartForm, setChartForm,
      darkMode, setDarkMode,
      drawerOpen, setDrawerOpen,
    }}>
      {children}
    </AppContext.Provider>
  );
}

/* ── useAppContext ────────────────────────────────────────────────
   NEVER throws. When rendered outside AppProvider (e.g. during
   Figma Make's React Fast Refresh isolated preview), it returns
   safe default values so the component can still render without
   crashing the preview iframe.
─────────────────────────────────────────────────────────────────── */
export function useAppContext(): AppContextType {
  const ctx = useContext(AppContext);
  // Return safe defaults when there is no provider in the tree.
  // In the real app AppProvider always wraps everything, so real
  // state is always returned. During isolated preview/HMR refresh
  // this prevents the "must be inside AppProvider" crash.
  return ctx ?? defaultContextValue;
}

/** Returns true when viewport width < 768 px */
export function useIsMobile() {
  const [mobile, setMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return mobile;
}

/* ── Colour tokens ───────────────────────────────────────────── */
export const lightColors = {
  bg:      '#F6F8F6',
  card:    '#FFFFFF',
  text:    '#1A1A1A',
  muted:   '#9E9E9E',
  border:  '#EBEBEB',
  inputBg: '#F8F9FA',
  subText: '#555',
};

export const darkColors = {
  bg:      '#111111',
  card:    '#1E1E1E',
  text:    '#EFEFEF',
  muted:   '#777777',
  border:  '#2C2C2C',
  inputBg: '#2A2A2A',
  subText: '#AAAAAA',
};

export function useColors() {
  const { darkMode } = useAppContext();
  return darkMode ? darkColors : lightColors;
}
