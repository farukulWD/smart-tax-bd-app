# React Native
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }

# Reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# Gesture Handler
-keep class com.swmansion.gesture.** { *; }

# React Navigation Screens
-keep class com.swmansion.rnscreens.** { *; }

# Safe Area Context
-keep class com.th3rdwave.safeareacontext.** { *; }

# SVG
-keep class com.horcrux.svg.** { *; }

# AsyncStorage
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# WebView
-keep class com.reactnativecommunity.webview.** { *; }

# Keyboard Controller
-keep class com.reactnativekeyboardcontroller.** { *; }

# Expo Modules
-keep class expo.modules.** { *; }

# Fresco image library (used by React Native)
-keep class com.facebook.fresco.** { *; }
-keep class com.facebook.imagepipeline.** { *; }
-keep class com.facebook.drawee.** { *; }

# OkHttp (used by Axios/fetch)
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.** { *; }
-keep class okio.** { *; }

# Keep source file names and line numbers for crash reporting
-keepattributes SourceFile, LineNumberTable
-keepattributes *Annotation*
-keepattributes Signature, InnerClasses, EnclosingMethod
