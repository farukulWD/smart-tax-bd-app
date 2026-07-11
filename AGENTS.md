# Smart Tax BD — Agent Guide

## Stack
- React Native 0.81.5 + Expo SDK 54, TypeScript 5.9 (strict, `noUnusedLocals`, `noUnusedParameters`)
- NativeWind v4 (Tailwind CSS v3), `jsxImportSource: 'nativewind'` in Babel
- `@react-navigation/native` (native-stack + bottom-tabs) — **not** Expo Router
- Redux Toolkit + RTK Query + `redux-persist` (persists only `auth` slice)
- i18next (en / bn), set via `src/localization/i18n.ts`, persisted in AsyncStorage
- Axios wrapped as RTK Query base query (`src/services/axios/axiosBaseQuery.ts`)
- `react-hook-form` + `zod` for forms
- `lucide-react-native` icons, `react-native-reanimated` animations

## Commands
| Action | Command |
|---|---|
| Dev server (clears cache) | `pnpm start` |
| iOS | `pnpm ios` |
| Android | `pnpm android` |
| Web | `pnpm web` |
| Typecheck | `npx tsc --noEmit` |
| Format | `npx prettier --write .` |
| Clean (`.expo` + `node_modules`) | `pnpm clean` |
| Local APK | `pnpm apk` (`./gradlew assembleRelease`) |
| Local AAB | `pnpm abb` (`./gradlew bundleRelease`) |
| EAS APK | `pnpm expo-apk` |
| Release APK + upload | `pnpm release:apk` (runs `release.sh`) |

- **No test runner or ESLint configured** — only Prettier for formatting.
- APK release uploads via `gh` CLI to `shuvajitmaitra/apk` under fixed tag `SmartTaxBD`.

## Config & Quirks
- **Path alias `@/` maps to project root**, not `src/` — `@/components` = `./components/`, `@/lib` = `./lib/`.
- `components/ui/` is at root level, not under `src/`.
- `components.json` (shadcn-style) used by `@react-native-reusables/cli` for adding UI primitives.
- `.npmrc` hoists `react-native-css-interop` (required by NativeWind + Metro).
- `nativewind-env.d.ts` required at root for TypeScript recognition.
- Three API profiles in `src/env.ts`: flip `ENV` between `'production'`, `'dev'`, `'local'`.
- Prettier: 100 printWidth, single quotes, trailingComma es5, bracketSameLine, `prettier-plugin-tailwindcss`.
- Navigation is hand-wired in `src/navigation/` (AppStack > BottomTabNavigator + per-tab stacks).
- No CI workflows exist.

## Architecture
```
index.ts                   → registerRootComponent(App)
src/App.tsx                → providers: Keyboard > Theme > Redux+PersistGate > Navigation+PortalHost+ThemeSync+Toast
src/navigation/            → all routing (no Expo Router)
src/redux/                 → store, rootReducer, typed hooks, authSlice only
src/services/              → RTK Query API defs + Axios instance/interceptors
src/screen/                → feature-based screens (auth, home, document, faq, notification, order, profile)
src/components/            → feature-specific components (common, faq, global, home, order, package, profile)
components/ui/             → low-level UI primitives (button, input, text, checkbox, collapsible, icon)
src/localization/          → i18n setup + en/bn translations
```
