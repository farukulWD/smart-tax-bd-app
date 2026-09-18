// Imported from `expo` rather than `expo-modules-core`: pnpm's strict layout
// keeps the latter out of the app's own node_modules, so Metro cannot resolve it.
import { requireOptionalNativeModule } from 'expo';

type AutofillControlModule = {
  cancelAutofillSession: () => Promise<void>;
};

// Android-only module, so it is absent on iOS and in Expo Go.
const AutofillControl = requireOptionalNativeModule<AutofillControlModule>('AutofillControl');

/**
 * Ends the Android autofill session so the system does not offer to save what
 * was just typed. Call it as a form is submitted; a no-op everywhere else.
 */
export const cancelAutofillSession = () => {
  AutofillControl?.cancelAutofillSession().catch(() => {
    // Nothing to do: failing to cancel only means the system may offer to save.
  });
};
