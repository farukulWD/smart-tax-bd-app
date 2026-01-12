import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { getMode } from './utils';

export const THEME = {
  light: {
    // Clean “finance” light
    background: 'hsl(210 33% 98%)',
    foreground: 'hsl(222 47% 11%)',

    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(222 47% 11%)',

    popover: 'hsl(0 0% 100%)',
    popoverForeground: 'hsl(222 47% 11%)',

    // Trusty blue as primary (tax/finance friendly)
    primary: 'hsl(217 91% 60%)',
    primaryForeground: 'hsl(0 0% 100%)',

    // Subtle cool grays for UI
    secondary: 'hsl(220 22% 95%)',
    secondaryForeground: 'hsl(222 47% 11%)',

    muted: 'hsl(220 22% 95%)',
    mutedForeground: 'hsl(215 16% 47%)',

    // Soft blue-tint highlight (not loud)
    accent: 'hsl(213 100% 96%)',
    accentForeground: 'hsl(217 91% 35%)',

    // Status colors
    destructive: 'hsl(0 84% 60%)',

    // Lines / inputs
    border: 'hsl(214 32% 91%)',
    input: 'hsl(214 32% 91%)',
    ring: 'hsl(217 91% 60%)',

    // Shape
    radius: '0.75rem',

    // Charts (clear + businessy)
    chart1: 'hsl(217 91% 60%)', // blue
    chart2: 'hsl(158 64% 42%)', // green
    chart3: 'hsl(199 89% 48%)', // cyan
    chart4: 'hsl(43 96% 56%)', // amber
    chart5: 'hsl(0 84% 60%)', // red
  },

  dark: {
    // Deep navy for “serious” finance dark mode
    background: 'hsl(222 47% 7%)',
    foreground: 'hsl(210 40% 98%)',

    card: 'hsl(222 47% 10%)',
    cardForeground: 'hsl(210 40% 98%)',

    popover: 'hsl(222 47% 10%)',
    popoverForeground: 'hsl(210 40% 98%)',

    // Brighter blue for dark mode contrast
    primary: 'hsl(217 92% 65%)',
    primaryForeground: 'hsl(222 47% 7%)',

    secondary: 'hsl(217 33% 14%)',
    secondaryForeground: 'hsl(210 40% 98%)',

    muted: 'hsl(217 33% 14%)',
    mutedForeground: 'hsl(215 20% 65%)',

    // Dark accent with blue tint
    accent: 'hsl(217 60% 16%)',
    accentForeground: 'hsl(210 40% 98%)',

    destructive: 'hsl(0 72% 58%)',

    border: 'hsl(217 33% 18%)',
    input: 'hsl(217 33% 18%)',
    ring: 'hsl(217 92% 65%)',

    radius: '0.75rem',

    chart1: 'hsl(217 92% 65%)',
    chart2: 'hsl(158 64% 50%)',
    chart3: 'hsl(199 89% 55%)',
    chart4: 'hsl(43 96% 60%)',
    chart5: 'hsl(0 84% 65%)',
  },
};

export const NAV_THEME: Record<'light' | 'dark', Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
};

/** Proxy that always reads from the CURRENT theme */
export const Colors = new Proxy({} as (typeof THEME)['light'], {
  get(_target, prop: string) {
    // TypeScript: we trust keys match the palette
    return (THEME as any)[getMode() ?? 'light'][prop];
  },
}) as (typeof THEME)['light'];
