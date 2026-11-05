# Mandatory App Update (Android)

The app blocks itself whenever Google Play reports a newer build for the installed
`versionCode`, and drives Google Play's **native immediate in-app update** flow.
If the native flow cannot be used, a full-screen, non-dismissible fallback screen
opens the app's Play Store listing instead.

No backend, API, or remote policy file is involved.

## How it works

| Piece                                     | Responsibility                                                                                                                                                                            |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/services/appUpdate.ts`               | Lazily loads `sp-react-native-in-app-updates`, reads Play's `updateAvailability` / `availableVersionCode`, starts the immediate flow, opens the Play Store listing.                       |
| `src/hook/useAppUpdate.ts`                | State machine. Checks on launch and on every background → foreground transition, de-dupes checks/starts, keeps a required update sticky for the session, and handles Play/network errors. |
| `src/screen/update/ForceUpdateScreen.tsx` | Blocking UI with no close/skip/later action. Intercepts the Android hardware back button.                                                                                                 |
| `src/theme/ThemedApp.tsx`                 | Renders `ForceUpdateScreen` **instead of** `Navigation` while an update is required, so no route can be reached.                                                                          |

- Checks run when the app launches, when it returns to the foreground, and after
  the user comes back from the Play Store.
- `updateAvailability === UPDATE_AVAILABLE` (2) or
  `DEVELOPER_TRIGGERED_UPDATE_IN_PROGRESS` (3) is treated as mandatory.
- Errors while checking do **not** block the app. Once an update has been
  positively identified, later check errors keep the block and offer the Play
  Store fallback.
- Only a fresh process (after the update installs and Play restarts the app) can
  clear a confirmed required update.

## Why these libraries

- `sp-react-native-in-app-updates@2.0.0` is already a dependency of the project.
  It wraps Google Play Core `app-update` (2.1.0), supports the New Architecture
  used by this project (`newArchEnabled: true`), and works with RN 0.81 / Expo
  SDK 54.
- `upwell` (0.2.x) was evaluated but is a pre-release orchestration layer that
  requires a hosted policy JSON; it does not fit this app's zero-backend
  requirement and adds risk on SDK 54.
- No package was added or upgraded for this feature.

> `expo-updates` / OTA updates are unrelated. This feature updates the native
> Android app through Google Play and cannot be used to ship native modules over
> the air.

## Play Store listing

The listing is derived from a single constant:

```ts
// src/services/appUpdate.ts
export const ANDROID_PACKAGE_NAME = 'com.smarttaxbd';
```

Keep it in sync with:

- `expo.android.package` in `app.json`
- `applicationId` in `android/app/build.gradle`

`market://details?id=com.smarttaxbd` is tried first, with
`https://play.google.com/store/apps/details?id=com.smarttaxbd` as a fallback.
No `<queries>` entry is needed because the app opens the URL directly instead of
calling `Linking.canOpenURL`.

## Native build requirements

The native module is autolinked from the existing `android/` project, and its
Gradle file adds `com.google.android.play:app-update:2.1.0`. No Expo config
plugin or manual native edit is required.

A **release build distributed through Google Play** is required. Debug builds,
local `pnpm apk` APKs and Expo Go cannot run Play's update flow. Ship the JS
changes with a normal build:

```sh
# Local AAB (bumps versionCode first)
pnpm abb

# or EAS production build
eas build --platform android --profile production
```

If the native project is ever regenerated (CNG), run `npx expo prebuild` from a
clean checkout and rebuild; OTA updates cannot add native modules.

## Testing with Google Play Internal App Sharing

You need a real Android device signed into a Google account that owns the app,
and two release builds with different `versionCode` values (for example 23 and 24) signed with the same key.

1. Build release A with `versionCode 23` and release B with `versionCode 24`.
   `pnpm abb` increments the version code automatically.
2. Upload both builds to **Play Console → Testing → Internal app sharing**.
3. Install release A on the device from its Internal App Sharing link.
4. Open release B's link on the same device **but do not install it**. The button
   must say **Update** — that confirms Play knows an update exists.
5. Launch release A. Play's full-screen immediate update prompt should appear.
6. Verify the blocking behavior: press back / try to leave the update, and
   confirm the app cannot be used on the old build.
7. Put the app in the background during the update and return; Play's update
   continues/resumes.
8. Let the update finish. The app restarts on build 24 and opens normally.
9. To test the fallback screen, use a build where the immediate flow is not
   allowed (or temporarily simulate a `startUpdate` failure) and confirm the
   Update Now screen appears and opens the correct Play listing.

Troubleshooting: close the Play Store app, open it, refresh **Manage apps &
devices**, and make sure the test build in step 4 shows **Update** before
debugging the app code. In-app updates only appear for accounts that installed
the app from Play and for a higher `versionCode` on the same track.

## Making every future release mandatory

There is nothing to toggle. Every new release that is published to the Play track
the user installed from has a higher `versionCode`, so Play reports it as
available and this feature blocks the old build automatically.

Checklist for each release:

1. Increment `versionCode` (already done by `pnpm abb`; EAS `autoIncrement` also
   does this).
2. Build and upload the AAB to Play.
3. Roll out to the same track(s) users are on.

Because **any** available update is mandatory, do not publish a build to a track
unless you intend every older install on that track to be blocked. During a
staged rollout, only users included in the rollout see the update and the block.

## Limitations

- In-app updates require the Google Play Store and an install that came from
  Play. Sideloaded builds get no availability signal, so they continue normally.
- `sp-react-native-in-app-updates@2.0.0` refuses to call Play's
  `startUpdateFlowForResult` when availability is
  `DEVELOPER_TRIGGERED_UPDATE_IN_PROGRESS`. Normally Play's update activity stays
  in the task and resumes by itself. If Android destroyed it, the custom screen
  keeps the app blocked and Update Now opens the Play Store listing; the download
  Play already started continues and installs.
- iOS behavior is unchanged; no Android-specific code runs on iOS.
- The fallback screen's Play link must match the `applicationId`; changing the
  package name requires updating `ANDROID_PACKAGE_NAME`.
