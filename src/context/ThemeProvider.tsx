import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Appearance, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useNWColorScheme, vars } from 'nativewind';

export const COLOR_TOKENS = {
  light: {
    background: 'hsl(0 0% 98.8235%)',
    foreground: 'hsl(0 0% 9.0196%)',
    card: 'hsl(0 0% 98.8235%)',
    cardForeground: 'hsl(0 0% 9.0196%)',
    popover: 'hsl(0 0% 98.8235%)',
    popoverForeground: 'hsl(0 0% 32.1569%)',
    primary: 'hsl(151.3274 66.8639% 66.8627%)',
    primaryForeground: 'hsl(153.3333 13.0435% 13.5294%)',
    secondary: 'hsl(0 0% 99.2157%)',
    secondaryForeground: 'hsl(0 0% 9.0196%)',
    muted: 'hsl(0 0% 92.9412%)',
    mutedForeground: 'hsl(0 0% 12.5490%)',
    accent: 'hsl(0 0% 92.9412%)',
    accentForeground: 'hsl(0 0% 12.5490%)',
    destructive: 'hsl(9.8901 81.9820% 43.5294%)',
    destructiveForeground: 'hsl(0 100% 99.4118%)',
    border: 'hsl(0 0% 87.4510%)',
    input: 'hsl(0 0% 96.4706%)',
    ring: 'hsl(151.3274 66.8639% 66.8627%)',
    radius: '0.5rem',
    chart1: 'hsl(151.3274 66.8639% 66.8627%)',
    chart2: 'hsl(217.2193 91.2195% 59.8039%)',
    chart3: 'hsl(258.3117 89.5349% 66.2745%)',
    chart4: 'hsl(37.6923 92.1260% 50.1961%)',
    chart5: 'hsl(160.1183 84.0796% 39.4118%)',
    sidebar: 'hsl(0 0% 98.8235%)',
    sidebarForeground: 'hsl(0 0% 43.9216%)',
    sidebarPrimary: 'hsl(151.3274 66.8639% 66.8627%)',
    sidebarPrimaryForeground: 'hsl(153.3333 13.0435% 13.5294%)',
    sidebarAccent: 'hsl(0 0% 92.9412%)',
    sidebarAccentForeground: 'hsl(0 0% 12.5490%)',
    sidebarBorder: 'hsl(0 0% 87.4510%)',
    sidebarRing: 'hsl(151.3274 66.8639% 66.8627%)',
  },
  dark: {
    background: 'hsl(0 0% 7.0588%)',
    foreground: 'hsl(214.2857 31.8182% 91.3725%)',
    card: 'hsl(0 0% 9.0196%)',
    cardForeground: 'hsl(214.2857 31.8182% 91.3725%)',
    popover: 'hsl(0 0% 14.1176%)',
    popoverForeground: 'hsl(0 0% 66.2745%)',
    primary: 'hsl(154.8980 100.0000% 19.2157%)',
    primaryForeground: 'hsl(152.7273 19.2982% 88.8235%)',
    secondary: 'hsl(0 0% 14.1176%)',
    secondaryForeground: 'hsl(0 0% 98.0392%)',
    muted: 'hsl(0 0% 12.1569%)',
    mutedForeground: 'hsl(0 0% 63.5294%)',
    accent: 'hsl(0 0% 19.2157%)',
    accentForeground: 'hsl(0 0% 98.0392%)',
    destructive: 'hsl(6.6667 60.0000% 20.5882%)',
    destructiveForeground: 'hsl(12.0000 12.1951% 91.9608%)',
    border: 'hsl(0 0% 16.0784%)',
    input: 'hsl(0 0% 14.1176%)',
    ring: 'hsl(141.8919 69.1589% 58.0392%)',
    radius: '0.5rem',
    chart1: 'hsl(141.8919 69.1589% 58.0392%)',
    chart2: 'hsl(213.1169 93.9024% 67.8431%)',
    chart3: 'hsl(255.1351 91.7355% 76.2745%)',
    chart4: 'hsl(43.2558 96.4126% 56.2745%)',
    chart5: 'hsl(172.4551 66.0079% 50.3922%)',
    sidebar: 'hsl(9.8901 81.9820% 43.5294%)',
    sidebarForeground: 'hsl(0 0% 53.7255%)',
    sidebarPrimary: 'hsl(154.8980 100.0000% 19.2157%)',
    sidebarPrimaryForeground: 'hsl(152.7273 19.2982% 88.8235%)',
    sidebarAccent: 'hsl(0 0% 19.2157%)',
    sidebarAccentForeground: 'hsl(0 0% 98.0392%)',
    sidebarBorder: 'hsl(0 0% 16.0784%)',
    sidebarRing: 'hsl(141.8919 69.1589% 58.0392%)',
  },
} as const;

export type ThemeName = keyof typeof COLOR_TOKENS;
export type ThemePreference = ThemeName | 'system';

let currentTheme: ThemeName = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
const setGlobalTheme = (t: ThemeName) => {
  currentTheme = t;
};

export const Colors = new Proxy({} as (typeof COLOR_TOKENS)['light'], {
  get(_target, prop: string) {
    return (COLOR_TOKENS as any)[currentTheme][prop];
  },
}) as (typeof COLOR_TOKENS)['light'];

const toVars = (t: (typeof COLOR_TOKENS)[ThemeName]) =>
  vars(
    Object.fromEntries(Object.entries(t).map(([k, v]) => [`--color-${k}`, v])) as Record<
      string,
      string
    >
  );

const themeVars = {
  light: toVars(COLOR_TOKENS.light),
  dark: toVars(COLOR_TOKENS.dark),
} satisfies Record<ThemeName, ReturnType<typeof vars>>;

type ThemeContextType = {
  theme: ThemeName;
  preference: ThemePreference;
  setPreference: (p: ThemePreference) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  preference: 'system',
  setPreference: () => {},
  toggleTheme: () => {},
});

const STORAGE_KEY = 'theme_preference';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setColorScheme } = useNWColorScheme() as {
    setColorScheme: (t: ThemeName | 'system') => void;
  };

  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [theme, setTheme] = useState<ThemeName>(currentTheme);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved === 'light' || saved === 'dark' || saved === 'system') {
          setPreferenceState(saved);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      if (preference !== 'system') return;
      const next: ThemeName = colorScheme === 'dark' ? 'dark' : 'light';
      setTheme(next);
    });
    return () => sub.remove();
  }, [preference]);

  useEffect(() => {
    if (preference === 'system') {
      const sys = Appearance.getColorScheme();
      const effective: ThemeName = sys === 'dark' ? 'dark' : 'light';
      setTheme(effective);
      setColorScheme('system');
      setGlobalTheme(effective);
    } else {
      setTheme(preference);
      setColorScheme(preference);
      setGlobalTheme(preference);
    }
  }, [preference, setColorScheme]);

  const setPreference = React.useCallback((p: ThemePreference) => {
    setPreferenceState(p);
    AsyncStorage.setItem(STORAGE_KEY, p).catch(() => {});
  }, []);

  const toggleTheme = React.useCallback(() => {
    const next: ThemeName = theme === 'light' ? 'dark' : 'light';
    setPreference(next);
  }, [theme, setPreference]);

  const value = useMemo(
    () => ({ theme, preference, setPreference, toggleTheme }),
    [theme, preference, setPreference, toggleTheme]
  );

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <ThemeContext.Provider value={value}>
      <View style={[themeVars[theme], { flex: 1 }]}>{children}</View>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
