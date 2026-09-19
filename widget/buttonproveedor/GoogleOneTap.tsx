'use client'
import Script from 'next/script'
import { signInWithGoogleCredential } from '@/shared/services/auth/services/google-auth.service'
import { useGoogleAuthStore } from '@/shared/services/auth/store/google-auth.store'
import { setGoogleUserFromFirebase } from '@/shared/lib/firebase/google/set-google-user'

interface CredentialResponse {
  credential: string
  select_by: string
}

export function GoogleOneTap() {
  const user = useGoogleAuthStore((state) => state.user)

  const initializeGoogleOneTap = () => {
    // Si ya tenemos un usuario en nuestro estado,
    // no intentamos mostrar One Tap otra vez.
    if (user) {
      return
    }

    const google = window.google
    if (!google) {
      return
    }

    google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,

      callback: async (response: CredentialResponse) => {
        try {
          const firebaseUser = await signInWithGoogleCredential(response.credential)
          setGoogleUserFromFirebase(firebaseUser)
          console.log('Usuario autenticado con One Tap:', firebaseUser)
        } catch (error) {
          console.error('Error con Google One Tap:', error)
        }
      },


      // true:
      // Google puede iniciar sesión automáticamente
      // si existe UNA sola cuenta elegible que ya autorizó la app.
      //
      // false:
      // Google espera que el usuario pulse/seleccione la cuenta.
      auto_select: false,



      // Durante pruebas evita que un clic fuera
      // cierre One Tap accidentalmente.
      cancel_on_tap_outside: false,
    })

    google.accounts.id.prompt((notification) => {
      if (notification.isSkippedMoment() || notification.isDismissedMoment()) {
        // El usuario no quiso iniciar sesión.
        // No hacemos nada.
        // La web continúa normalmente.
        return
      }
      // Google no pudo o no quiso completar One Tap.
      // NO es un error de nuestra aplicación.
      // Simplemente dejamos al usuario continuar normalmente.

      // if (notification.isSkippedMoment()) {
      //   return
      // }

      // if (notification.isDismissedMoment()) {
      //   return
      // }
    })

    // google.accounts.id.prompt()
  }

  return (
    <Script
      src="https://accounts.google.com/gsi/client"
      strategy="afterInteractive"
      onReady={initializeGoogleOneTap}
    />
  )
}