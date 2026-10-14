import { isPushConfigured } from '../../Shared/firebase'
import { ensurePushToken } from '../../Shared/firebase'
import { registerPushToken } from './api'

export type EnablePushOutcome =
  | { ok: true }
  | { ok: false; reason: 'unconfigured' | 'denied' | 'unsupported' | 'failed' }

/**
 * Requests permission (needs a user tap), fetches the FCM token and saves
 * it to the profile. Shared by the feeds prompt, the notifications page
 * and the menu install row so behaviour stays identical everywhere.
 */
export async function enablePushOnThisDevice(): Promise<EnablePushOutcome> {
  if (!isPushConfigured) return { ok: false, reason: 'unconfigured' }
  if (!('Notification' in window) || !('serviceWorker' in navigator)) {
    return { ok: false, reason: 'unsupported' }
  }
  try {
    const token = await ensurePushToken()
    if (!token) {
      if (Notification.permission === 'denied') {
        return { ok: false, reason: 'denied' }
      }
      return { ok: false, reason: 'failed' }
    }
    await registerPushToken(token)
    return { ok: true }
  } catch {
    return { ok: false, reason: 'failed' }
  }
}

export function pushFailureMessage(reason: Exclude<EnablePushOutcome, { ok: true }>['reason']): string {
  switch (reason) {
    case 'unconfigured':
      return 'Push is not configured yet — contact support.'
    case 'denied':
      return 'Notifications are blocked — allow them in your browser site settings.'
    case 'unsupported':
      return 'Push is not supported on this browser.'
    case 'failed':
    default:
      return 'Could not enable push on this device.'
  }
}
