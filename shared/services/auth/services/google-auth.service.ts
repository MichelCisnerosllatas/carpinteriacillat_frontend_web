// shared/services/auth/services/google-auth.service.ts
import {GoogleAuthProvider, signInWithCredential, signInWithPopup} from 'firebase/auth'
import { firebaseAuth } from '@/shared/lib/firebase/firebase'

export async function signInWithGooglePopup() {
  const provider = new GoogleAuthProvider()

  // Hace que Google permita escoger cuenta
  provider.setCustomParameters({
    prompt: 'select_account',
  })

  const result = await signInWithPopup(firebaseAuth, provider)
  return result.user
}

export async function signInWithGoogleCredential(googleIdToken: string) {
  const credential = GoogleAuthProvider.credential(googleIdToken)
  const result = await signInWithCredential(
    firebaseAuth,
    credential,
  )

  return result.user
}


// import {GoogleAuthProvider, signInWithPopup} from 'firebase/auth'
// import { firebaseAuth } from '@/shared/lib/firebase/firebase'

// export async function signInWithGoogle() {
//   const provider = new GoogleAuthProvider()
//   const result = await signInWithPopup(firebaseAuth, provider)
  
//   return result.user
// }