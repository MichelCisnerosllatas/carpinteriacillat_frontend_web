// features/google-auth/lib/login-with-google.ts
import { signInWithGooglePopup } from '@/features/google-auth/api/google-auth.service'
import { setGoogleUserFromFirebase } from './set-google-user'

export async function loginWithGoogle() {
  const firebaseUser = await signInWithGooglePopup()
  return setGoogleUserFromFirebase(firebaseUser)
}