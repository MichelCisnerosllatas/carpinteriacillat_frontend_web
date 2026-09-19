import type { User } from 'firebase/auth'
import { useGoogleAuthStore } from '@/shared/services/auth/store/google-auth.store'

export function setGoogleUserFromFirebase(firebaseUser: User) {
  const user = {
    uid: firebaseUser.uid,
    name: firebaseUser.displayName,
    email: firebaseUser.email,
    photoUrl: firebaseUser.photoURL,
    emailVerified: firebaseUser.emailVerified,
  }

  useGoogleAuthStore.getState().setUser(user)
  return user
}