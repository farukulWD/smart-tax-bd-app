const { FONT_SIZES, SPACING, varName } = require('./design-tokens');

// Every size becomes a runtime CSS variable so it can scale per device (see
// src/utils/scale.ts). The `${px}px` fallback matters: if a subtree ever
// renders outside the `vars()` provider, an unresolved var drops the style
// entirely — a missing color is survivable, a missing padding is not.
const scaledVars = (prefix, table) =>
  Object.fromEntries(
    Object.entries(table).map(([key, px]) => [key, `var(--${varName(prefix, key)}, ${px}px)`])
  );

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.ts',
    './src/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        okra: ['Okra-Regular', 'Okra-Medium', 'Okra-ExtraBold', 'Okra-Bold', 'Okra-MediumLight'],
      },
      fontSize: scaledVars('fs', FONT_SIZES),
      spacing: scaledVars('sp', SPACING),
      colors: {
        background: 'rgb(var(--color-background) / <alpha-value>)',
        foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
        card: 'rgb(var(--color-card) / <alpha-value>)',
        cardForeground: 'rgb(var(--color-cardForeground) / <alpha-value>)',
        popover: 'rgb(var(--color-popover) / <alpha-value>)',
        popoverForeground: 'rgb(var(--color-popoverForeground) / <alpha-value>)',
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        primaryForeground: 'rgb(var(--color-primaryForeground) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        secondaryForeground: 'rgb(var(--color-secondaryForeground) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        mutedForeground: 'rgb(var(--color-mutedForeground) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        accentForeground: 'rgb(var(--color-accentForeground) / <alpha-value>)',
        destructive: 'rgb(var(--color-destructive) / <alpha-value>)',
        destructiveForeground: 'rgb(var(--color-destructiveForeground) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        successForeground: 'rgb(var(--color-successForeground) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        warningForeground: 'rgb(var(--color-warningForeground) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        input: 'rgb(var(--color-input) / <alpha-value>)',
        ring: 'rgb(var(--color-ring) / <alpha-value>)',
        radius: 'var(--color-radius)',
        chart1: 'rgb(var(--color-chart1) / <alpha-value>)',
        chart2: 'rgb(var(--color-chart2) / <alpha-value>)',
        chart3: 'rgb(var(--color-chart3) / <alpha-value>)',
        chart4: 'rgb(var(--color-chart4) / <alpha-value>)',
        chart5: 'rgb(var(--color-chart5) / <alpha-value>)',
        sidebar: 'rgb(var(--color-sidebar) / <alpha-value>)',
        sidebarForeground: 'rgb(var(--color-sidebarForeground) / <alpha-value>)',
        sidebarPrimary: 'rgb(var(--color-sidebarPrimary) / <alpha-value>)',
        sidebarPrimaryForeground: 'rgb(var(--color-sidebarPrimaryForeground) / <alpha-value>)',
        sidebarAccent: 'rgb(var(--color-sidebarAccent) / <alpha-value>)',
        sidebarAccentForeground: 'rgb(var(--color-sidebarAccentForeground) / <alpha-value>)',
        sidebarBorder: 'rgb(var(--color-sidebarBorder) / <alpha-value>)',
        sidebarRing: 'rgb(var(--color-sidebarRing) / <alpha-value>)',
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [require('tailwindcss-animate')],
};
