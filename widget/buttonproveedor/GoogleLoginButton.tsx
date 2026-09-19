// widget/buttonproveedor/GoogleLoginButton.tsx
'use client'

import { Button } from '@mantine/core'
import { loginWithGoogle } from '@/shared/lib/firebase/google/login-with-google'

export function GoogleLoginButton() {
  return (
    <Button
      type="button"
      variant="default"
      size="md"
      fullWidth
      leftSection={<GoogleIcon />}
      onClick={loginWithGoogle}
    >
      Continuar con Google
    </Button>
  )
}

function GoogleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.41Z"
      />

      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.97-.9 6.62-2.36l-3.24-2.54c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.07v2.62A10 10 0 0 0 12 22Z"
      />

      <path
        fill="#FBBC05"
        d="M6.41 13.94A6.02 6.02 0 0 1 6.1 12c0-.67.12-1.32.31-1.94V7.44H3.07A10 10 0 0 0 2 12c0 1.61.39 3.13 1.07 4.56l3.34-2.62Z"
      />

      <path
        fill="#EA4335"
        d="M12 5.94c1.47 0 2.79.51 3.83 1.5l2.87-2.87A9.65 9.65 0 0 0 12 2a10 10 0 0 0-8.93 5.44l3.34 2.62C7.2 7.7 9.4 5.94 12 5.94Z"
      />
    </svg>
  )
}




// 'use client'
// import { signInWithGoogle } from "@/shared/services/auth/services/google-auth.service"

// export function GoogleLoginButton() {
//   const handleLogin = async () => {
//     try {
//       const user = await signInWithGoogle()

//       console.log('UID:', user.uid)
//       console.log('Nombre:', user.displayName)
//       console.log('Correo:', user.email)
//       console.log('Foto:', user.photoURL)
//       console.log(
//         'Correo verificado:',
//         user.emailVerified,
//       )
//     } catch (error) {
//       console.error(
//         'Error iniciando sesión con Google:',
//         error,
//       )
//     }
//   }

//   return (
//     <button
//       type="button"
//       onClick={handleLogin}
//     >
//       Continuar con Google
//     </button>
//   )
// }



// 'use client'
// import { loginWithGoogle } from "@/shared/lib/login-with-google"
// // import { signInWithGooglePopup } from "@/shared/services/auth/services/google-auth.service"
// // import { useGoogleAuthStore } from "@/shared/services/auth/store/google-auth.store"

// export function GoogleLoginButton() {
//   // const setUser = useGoogleAuthStore(
//   //   (state) => state.setUser,
//   // )

//   // const handleLogin = async () => {
//   //   try {
//   //     const firebaseUser = await signInWithGooglePopup()

//   //     setUser({
//   //       uid: firebaseUser.uid,
//   //       name: firebaseUser.displayName,
//   //       email: firebaseUser.email,
//   //       photoUrl: firebaseUser.photoURL,
//   //       emailVerified: firebaseUser.emailVerified,
//   //     })
//   //   } catch (error) {
//   //     console.error('Error iniciando sesión con Google:', error)
//   //   }
//   // }

//   return (
//     <button
//       type="button"
//       onClick={loginWithGoogle}
//       // onClick={handleLogin}
//     >
//       Continuar con Google
//     </button>
//   )
// }
// // 'use client'
// // import { signInWithGoogle } from "@/shared/services/auth/services/google-auth.service"

// // export function GoogleLoginButton() {
// //   const handleLogin = async () => {
// //     try {
// //       const user = await signInWithGoogle()

// //       console.log('UID:', user.uid)
// //       console.log('Nombre:', user.displayName)
// //       console.log('Correo:', user.email)
// //       console.log('Foto:', user.photoURL)
// //       console.log(
// //         'Correo verificado:',
// //         user.emailVerified,
// //       )
// //     } catch (error) {
// //       console.error(
// //         'Error iniciando sesión con Google:',
// //         error,
// //       )
// //     }
// //   }

// //   return (
// //     <button
// //       type="button"
// //       onClick={handleLogin}
// //     >
// //       Continuar con Google
// //     </button>
// //   )
// // }