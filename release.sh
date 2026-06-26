#!/bin/bash

# chmod +x release.sh 

set -e

TARGET_REPO="shuvajitmaitra/apk"
FIXED_RELEASE_TAG="SmartTaxBD"
VERSION="0.0.2"


echo "🚀 Starting automated upload for version: $VERSION..."
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

NEW_APK_NAME="android/app/build/outputs/apk/release/SmartTaxBD-$VERSION.apk"
mv "$ORIGINAL_APK" "$NEW_APK_NAME"

echo "📦 Uploading $NEW_APK_NAME to '$FIXED_RELEASE_TAG' release..."

gh release upload "$FIXED_RELEASE_TAG" "$NEW_APK_NAME" \
  --repo "$TARGET_REPO" \
  --clobber

echo "🎉 Done! SmartTaxBD-$VERSION.apk সফলভাবে আপলোড হয়েছে।" 
echo "Download Link: https://github.com/shuvajitmaitra/apk/releases/download/SmartTaxBD/SmartTaxBD-$VERSION.apk"