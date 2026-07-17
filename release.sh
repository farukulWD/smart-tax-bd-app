#!/bin/bash

# chmod +x release.sh 

set -e

TARGET_REPO="shuvajitmaitra/apk"
FIXED_RELEASE_TAG="SmartTaxBD"
VERSION=".0.0"


echo "🚀 Starting automated upload"
echo "🎯 Target Release: https://github.com/$TARGET_REPO/releases/tag/$FIXED_RELEASE_TAG"

echo "🏗️  Cleaning and building production APK..."
cd android
# ./gradlew clean 
./gradlew assembleRelease
cd ..

ORIGINAL_APK="android/app/build/outputs/apk/release/app-release.apk"

if [ ! -f "$ORIGINAL_APK" ]; then
    echo "❌ Error: APK build failed. File not found at $ORIGINAL_APK"
    exit 1
fi

NEW_APK_NAME="android/app/build/outputs/apk/release/SmartTaxBD.apk"
mv "$ORIGINAL_APK" "$NEW_APK_NAME"

# Collect ProGuard mapping file (deobfuscation)
MAPPING_FILE="android/app/build/outputs/mapping/release/mapping.txt"
if [ -f "$MAPPING_FILE" ]; then
    echo "📄 ProGuard mapping file found, including in upload..."
    cp "$MAPPING_FILE" "android/app/build/outputs/apk/release/mapping.txt"
    UPLOAD_MAPPING="$MAPPING_FILE"
else
    UPLOAD_MAPPING=""
fi

# Collect Hermes source map (if generated)
HERMES_MAP="android/app/build/generated/sourcemaps/react/release/index.android.bundle.map"
if [ -f "$HERMES_MAP" ]; then
    echo "🗺️  Hermes source map found, including in upload..."
    cp "$HERMES_MAP" "android/app/build/outputs/apk/release/index.android.bundle.map"
    UPLOAD_SOURCE_MAP="$HERMES_MAP"
else
    UPLOAD_SOURCE_MAP=""
fi

echo "📦 Uploading APK and debug symbols to '$FIXED_RELEASE_TAG' release..."

gh release upload "$FIXED_RELEASE_TAG" \
  "$NEW_APK_NAME" \
  ${UPLOAD_MAPPING:+"$UPLOAD_MAPPING"} \
  ${UPLOAD_SOURCE_MAP:+"$UPLOAD_SOURCE_MAP"} \
  --repo "$TARGET_REPO" \
  --clobber

echo "🎉 Done! SmartTaxBD-$VERSION.apk"
echo "📥 Download: https://github.com/shuvajitmaitra/apk/releases/download/SmartTaxBD/SmartTaxBD.apk"
if [ -n "$UPLOAD_MAPPING" ]; then
    echo "📄 Mapping: https://github.com/shuvajitmaitra/apk/releases/download/SmartTaxBD/mapping.txt"
fi
if [ -n "$UPLOAD_SOURCE_MAP" ]; then
    echo "🗺️  Source Map: https://github.com/shuvajitmaitra/apk/releases/download/SmartTaxBD/index.android.bundle.map"
fi