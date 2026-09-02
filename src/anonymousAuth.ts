import { signInAnonymously } from 'firebase/auth'
import { auth } from './firebase'

// Gives an anonymous trainee a stable Firebase-issued uid, persisted in the
// browser, so repeat visits to the same training link don't count as new
// unique starters/finishers. If the browser already holds a session
// (including an admin logged into the Control Panel), that uid is reused.
export async function ensureAnonymousUser(): Promise<string | null> {
  if (!auth) return null
  if (auth.currentUser) return auth.currentUser.uid
  const credential = await signInAnonymously(auth)
  return credential.user.uid
}
