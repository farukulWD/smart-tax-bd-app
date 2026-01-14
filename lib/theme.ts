import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';
import { getMode } from './utils';

export const THEME = {
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

    // extras from the CSS palette
    sidebar: 'hsl(0 0% 98.8235%)',
    sidebarForeground: 'hsl(0 0% 43.9216%)',
    sidebarPrimary: 'hsl(151.3274 66.8639% 66.8627%)',
    sidebarPrimaryForeground: 'hsl(153.3333 13.0435% 13.5294%)',
    sidebarAccent: 'hsl(0 0% 92.9412%)',
    sidebarAccentForeground: 'hsl(0 0% 12.5490%)',
    sidebarBorder: 'hsl(0 0% 87.4510%)',
    sidebarRing: 'hsl(151.3274 66.8639% 66.8627%)',

    fontSans: 'Outfit, sans-serif',
    fontSerif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    fontMono: 'monospace',

    shadowX: '0px',
    shadowY: '1px',
    shadowBlur: '3px',
    shadowSpread: '0px',
    shadowOpacity: '0.17',
    shadowColor: '#000000',
    shadow2xs: '0px 1px 3px 0px hsl(0 0% 0% / 0.09)',
    shadowXs: '0px 1px 3px 0px hsl(0 0% 0% / 0.09)',
    shadowSm: '0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 1px 2px -1px hsl(0 0% 0% / 0.17)',
    shadow: '0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 1px 2px -1px hsl(0 0% 0% / 0.17)',
    shadowMd: '0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 2px 4px -1px hsl(0 0% 0% / 0.17)',
    shadowLg: '0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 4px 6px -1px hsl(0 0% 0% / 0.17)',
    shadowXl: '0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 8px 10px -1px hsl(0 0% 0% / 0.17)',
    shadow2xl: '0px 1px 3px 0px hsl(0 0% 0% / 0.43)',

    trackingNormal: '0.025em',
    spacing: '0.25rem',
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

    // extras from the CSS palette
    sidebar: 'hsl(0 0% 7.0588%)',
    sidebarForeground: 'hsl(0 0% 53.7255%)',
    sidebarPrimary: 'hsl(154.8980 100.0000% 19.2157%)',
    sidebarPrimaryForeground: 'hsl(152.7273 19.2982% 88.8235%)',
    sidebarAccent: 'hsl(0 0% 19.2157%)',
    sidebarAccentForeground: 'hsl(0 0% 98.0392%)',
    sidebarBorder: 'hsl(0 0% 16.0784%)',
    sidebarRing: 'hsl(141.8919 69.1589% 58.0392%)',

    fontSans: 'Outfit, sans-serif',
    fontSerif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    fontMono: 'monospace',

    shadowX: '0px',
    shadowY: '1px',
    shadowBlur: '3px',
    shadowSpread: '0px',
    shadowOpacity: '0.17',
    shadowColor: '#000000',
    shadow2xs: '0px 1px 3px 0px hsl(0 0% 0% / 0.09)',
    shadowXs: '0px 1px 3px 0px hsl(0 0% 0% / 0.09)',
    shadowSm: '0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 1px 2px -1px hsl(0 0% 0% / 0.17)',
    shadow: '0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 1px 2px -1px hsl(0 0% 0% / 0.17)',
    shadowMd: '0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 2px 4px -1px hsl(0 0% 0% / 0.17)',
    shadowLg: '0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 4px 6px -1px hsl(0 0% 0% / 0.17)',
    shadowXl: '0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 8px 10px -1px hsl(0 0% 0% / 0.17)',
    shadow2xl: '0px 1px 3px 0px hsl(0 0% 0% / 0.43)',
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
    return (THEME as any)[getMode() ?? 'light'][prop];
  },
}) as (typeof THEME)['light'];
