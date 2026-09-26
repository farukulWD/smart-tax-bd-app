package expo.modules.smsotp

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.content.pm.Signature
import android.os.Build
import android.util.Base64
import androidx.core.content.ContextCompat
import com.google.android.gms.auth.api.phone.SmsRetriever
import com.google.android.gms.common.api.CommonStatusCodes
import com.google.android.gms.common.api.Status
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.security.MessageDigest

/**
 * Reads the OTP SMS silently through the SMS Retriever API.
 *
 * Play Services hands the app an SMS only when the message ends with this
 * app's 11-character hash, so the app sends `getAppHash()` with each OTP
 * request and the server appends it. The hash comes from the signing
 * certificate the app is actually installed with, which keeps debug, release
 * and Play-signed builds right without any server config.
 *
 * `startListening` must run before the OTP is requested: the server sends the
 * SMS before it replies, and messages that arrive before listening are missed.
 * The message is held until JS takes it, because the verify screen may mount
 * after it arrives; `onSmsReceived` tells a mounted screen to take it.
 */
class SmsOtpModule : Module() {
  private var receiver: BroadcastReceiver? = null
  private var pendingMessage: String? = null

  private val context: Context?
    get() = appContext.reactContext

  override fun definition() = ModuleDefinition {
    Name("SmsOtp")

    Events("onSmsReceived")

    AsyncFunction("getAppHash") {
      context?.let { computeAppHash(it) }
    }

    AsyncFunction("startListening") {
      val ctx = context ?: return@AsyncFunction null
      unregister()
      pendingMessage = null

      val smsReceiver = object : BroadcastReceiver() {
        override fun onReceive(receiverContext: Context, intent: Intent) {
          if (intent.action != SmsRetriever.SMS_RETRIEVED_ACTION) return
          val extras = intent.extras ?: return
          @Suppress("DEPRECATION")
          val status = extras.get(SmsRetriever.EXTRA_STATUS) as? Status ?: return

          // One SMS per listen (or a 5-minute timeout): this session is over.
          unregister()

          if (status.statusCode != CommonStatusCodes.SUCCESS) return
          val message = extras.getString(SmsRetriever.EXTRA_SMS_MESSAGE) ?: return
          pendingMessage = message
          sendEvent("onSmsReceived")
        }
      }

      ContextCompat.registerReceiver(
        ctx,
        smsReceiver,
        IntentFilter(SmsRetriever.SMS_RETRIEVED_ACTION),
        SmsRetriever.SEND_PERMISSION,
        null,
        ContextCompat.RECEIVER_EXPORTED
      )
      receiver = smsReceiver

      SmsRetriever.getClient(ctx).startSmsRetriever()
      null
    }

    // Returns the received SMS once, then forgets it.
    AsyncFunction("takeMessage") {
      val message = pendingMessage
      pendingMessage = null
      message
    }

    AsyncFunction("stopListening") {
      unregister()
      pendingMessage = null
    }

    OnDestroy {
      unregister()
    }
  }

  private fun unregister() {
    val current = receiver ?: return
    receiver = null
    try {
      context?.unregisterReceiver(current)
    } catch (_: IllegalArgumentException) {
      // Already unregistered.
    }
  }

  // Same algorithm as Google's AppSignatureHelper sample.
  private fun computeAppHash(ctx: Context): String? {
    val signature = currentSignature(ctx) ?: return null
    val appInfo = "${ctx.packageName} ${signature.toCharsString()}"
    val digest = MessageDigest.getInstance("SHA-256").digest(appInfo.toByteArray(Charsets.UTF_8))
    return Base64.encodeToString(digest.copyOfRange(0, 9), Base64.NO_PADDING or Base64.NO_WRAP)
      .substring(0, 11)
  }

  private fun currentSignature(ctx: Context): Signature? = try {
    val pm = ctx.packageManager
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
      pm.getPackageInfo(ctx.packageName, PackageManager.GET_SIGNING_CERTIFICATES)
        .signingInfo?.apkContentsSigners?.firstOrNull()
    } else {
      @Suppress("DEPRECATION")
      pm.getPackageInfo(ctx.packageName, PackageManager.GET_SIGNATURES).signatures?.firstOrNull()
    }
  } catch (_: PackageManager.NameNotFoundException) {
    null
  }
}
