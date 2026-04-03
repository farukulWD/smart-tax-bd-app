import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Appearance, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useNWColorScheme, vars } from 'nativewind';

export const COLOR_TOKENS = {
  light: {
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(0 0% 0.3%)',
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(0 0% 0.3%)',
    popover: 'hsl(0 0% 100%)',
    popoverForeground: 'hsl(0 0% 0.3%)',
    primary: 'hsl(125 94% 18%)',
    primaryForeground: 'hsl(0 0% 96%)',
    secondary: 'hsl(121 38% 87%)',
    secondaryForeground: 'hsl(0 0% 1%)',
    muted: 'hsl(0 0% 91%)',
    mutedForeground: 'hsl(0 0% 17%)',
    accent: 'hsl(0 0% 91%)',
    accentForeground: 'hsl(0 0% 1%)',
    destructive: 'hsl(0 100% 40%)',
    destructiveForeground: 'hsl(0 0% 96%)',
    border: 'hsl(0 0% 78%)',
    input: 'hsl(0 0% 78%)',
    ring: 'hsl(125 94% 18%)',
    radius: '0.625rem',
    chart1: 'hsl(4 100% 46%)',
    chart2: 'hsl(169 100% 15%)',
    chart3: 'hsl(205 92% 7%)',
    chart4: 'hsl(29 100% 50%)',
    chart5: 'hsl(20 100% 49%)',
    sidebar: 'hsl(0 0% 96%)',
    sidebarForeground: 'hsl(0 0% 0.3%)',
    sidebarPrimary: 'hsl(0 0% 1%)',
    sidebarPrimaryForeground: 'hsl(0 0% 96%)',
    sidebarAccent: 'hsl(0 0% 91%)',
    sidebarAccentForeground: 'hsl(0 0% 1%)',
    sidebarBorder: 'hsl(0 0% 78%)',
    sidebarRing: 'hsl(0 0% 36%)',
  },
  dark: {
    background: 'hsl(0 0% 0.3%)',
    foreground: 'hsl(0 0% 96%)',
    card: 'hsl(0 0% 1%)',
    cardForeground: 'hsl(0 0% 96%)',
    popover: 'hsl(0 0% 1%)',
    popoverForeground: 'hsl(0 0% 96%)',
    primary: 'hsl(125 70% 33%)',
    primaryForeground: 'hsl(0 0% 1%)',
    secondary: 'hsl(0 0% 4%)',
    secondaryForeground: 'hsl(0 0% 96%)',
    muted: 'hsl(0 0% 4%)',
    mutedForeground: 'hsl(0 0% 36%)',
    accent: 'hsl(0 0% 4%)',
    accentForeground: 'hsl(0 0% 96%)',
    destructive: 'hsl(0 83% 49%)',
    destructiveForeground: 'hsl(0 0% 96%)',
    border: 'hsla(0 0% 100% / 0.1)',
    input: 'hsla(0 0% 100% / 0.15)',
    ring: 'hsl(125 70% 33%)',
    radius: '0.625rem',
    chart1: 'hsl(264 100% 31%)',
    chart2: 'hsl(161 100% 34%)',
    chart3: 'hsl(20 100% 49%)',
    chart4: 'hsl(304 100% 36%)',
    chart5: 'hsl(16 100% 41%)',
    sidebar: 'hsl(0 0% 1%)',
    sidebarForeground: 'hsl(0 0% 96%)',
    sidebarPrimary: 'hsl(264 100% 31%)',
    sidebarPrimaryForeground: 'hsl(0 0% 96%)',
    sidebarAccent: 'hsl(0 0% 4%)',
    sidebarAccentForeground: 'hsl(0 0% 96%)',
    sidebarBorder: 'hsla(0 0% 100% / 0.1)',
    sidebarRing: 'hsl(0 0% 17%)',
  },
} as const;

export type ThemeName = keyof typeof COLOR_TOKENS;
export type ThemePreference = ThemeName | 'system';
export type AppColors = typeof COLOR_TOKENS.light;

const STORAGE_KEY = 'theme_preference';

let activeTheme: ThemeName = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';

export const Colors = new Proxy({} as AppColors, {
  get(_target, prop: string) {
    return COLOR_TOKENS[activeTheme][prop as keyof AppColors];
  },
});

const themeVars = {
  light: vars(
    Object.fromEntries(
      Object.entries(COLOR_TOKENS.light).map(([k, v]) => [`--color-${k}`, v])
    ) as Record<string, string>
  ),
  dark: vars(
    Object.fromEntries(
      Object.entries(COLOR_TOKENS.dark).map(([k, v]) => [`--color-${k}`, v])
    ) as Record<string, string>
  ),
};

type ThemeContextType = {
  theme: ThemeName;
  preference: ThemePreference;
  setPreference: (value: ThemePreference) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  preference: 'system',
  setPreference: () => {},
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { setColorScheme } = useNWColorScheme() as {
    setColorScheme: (theme: ThemePreference) => void;
  };

  const [theme, setTheme] = useState<ThemeName>(activeTheme);
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
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

      const nextTheme: ThemeName = colorScheme === 'dark' ? 'dark' : 'light';
      activeTheme = nextTheme;
      setTheme(nextTheme);
      setColorScheme('system');
    });

    return () => sub.remove();
  }, [preference, setColorScheme]);

  useEffect(() => {
    const nextTheme: ThemeName =
      preference === 'system'
        ? Appearance.getColorScheme() === 'dark'
          ? 'dark'
          : 'light'
        : preference;

    activeTheme = nextTheme;
    setTheme(nextTheme);
    setColorScheme(preference === 'system' ? 'system' : nextTheme);
  }, [preference, setColorScheme]);

  const setPreference = useCallback((value: ThemePreference) => {
    setPreferenceState(value);
    AsyncStorage.setItem(STORAGE_KEY, value).catch(() => {});
  }, []);

  const toggleTheme = useCallback(() => {
    const nextTheme: ThemeName = theme === 'dark' ? 'light' : 'dark';
    activeTheme = nextTheme;
    setTheme(nextTheme);
    setPreferenceState(nextTheme);
    setColorScheme(nextTheme);
    AsyncStorage.setItem(STORAGE_KEY, nextTheme).catch(() => {});
  }, [theme, setColorScheme]);

  const value = useMemo(
    () => ({
      theme,
      preference,
      setPreference,
      toggleTheme,
    }),
    [theme, preference, setPreference, toggleTheme]
  );

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <ThemeContext.Provider value={value}>
      <View style={[themeVars[theme], { flex: 1 }]}>{children}</View>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
