// shared/lib/login-with-google.ts
import { signInWithGooglePopup } from '@/shared/services/auth/services/google-auth.service'
import { setGoogleUserFromFirebase } from './set-google-user'

export async function loginWithGoogle() {
  const firebaseUser = await signInWithGooglePopup()
  return setGoogleUserFromFirebase(firebaseUser)
}