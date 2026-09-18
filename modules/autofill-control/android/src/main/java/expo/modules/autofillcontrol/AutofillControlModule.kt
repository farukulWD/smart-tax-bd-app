package expo.modules.autofillcontrol

import android.os.Build
import android.view.autofill.AutofillManager
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

/**
 * Lets a screen end the Android autofill session it is part of.
 *
 * Marking fields `importantForAutofill="no"` stops autofill from filling them,
 * but the "Save password?" dialog belongs to the session, not the fields: it
 * fires when the session ends. `AutofillManager.cancel()` ends the session
 * without that dialog, which is what the sign-up screen calls on submit.
 *
 * Only affects the session that is open at the time, so autofill still works
 * everywhere else — sign-in included.
 */
class AutofillControlModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("AutofillControl")

    AsyncFunction("cancelAutofillSession") {
      // AutofillManager arrived in API 26; the app supports older devices,
      // which have no autofill framework to cancel.
      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
        return@AsyncFunction null
      }

      val activity = appContext.activityProvider?.currentActivity ?: return@AsyncFunction null
      activity.runOnUiThread {
        activity.getSystemService(AutofillManager::class.java)?.cancel()
      }
    }
  }
}
