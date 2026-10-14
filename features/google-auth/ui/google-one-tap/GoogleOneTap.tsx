'use client'
import Script from 'next/script'
import { signInWithGoogleCredential } from '@/features/google-auth/api/google-auth.service'
import { useGoogleAuthStore } from '@/features/google-auth/store/google-auth.store'
import { setGoogleUserFromFirebase } from '@/features/google-auth/lib/set-google-user'

interface CredentialResponse {
  credential: string
  select_by: string
}

export function GoogleOneTap() {
  const user = useGoogleAuthStore((state) => state.user)

  const initializeGoogleOneTap = () => {
    // ¿Esta página está embebida en un <iframe> de OTRA página (sin importar el origen)?
    // `window.top` es siempre la ventana del navegador de más afuera (la pestaña real);
    // `window.self` es la ventana de ESTE documento en particular. Cuando la página se carga
    // normal (una pestaña, sin iframes), esta ES la ventana de más afuera, así que
    // `window.self === window.top`. Cuando la carga OTRA página dentro de un <iframe> (como
    // hace el LandingPreview del intranet, ver widgets/landing-preview en
    // carpinteriacillat_intranet_frontend: carga /preview en un <iframe> para mostrar
    // ediciones sin guardar), `window.top` apunta a la ventana de ESA página padre, distinta
    // de `window.self` — de ahí la comparación. No hace falta mirar la URL ni el dominio: es
    // una propiedad del DOM que el navegador ya resuelve solo, y funciona igual sin importar
    // de qué origen venga el iframe.
    //
    // Por qué importa acá puntualmente: Google bloquea el prompt de FedCM dentro de iframes
    // cross-origin (permission policy "identity-credentials-get") — intentarlo ahí no muestra
    // nada, solo deja un "NotAllowedError" pegado en la consola para siempre (y en desarrollo,
    // el overlay de errores de Next.js tapando todo el iframe). El LandingPreview nunca es un
    // lugar donde alguien deba iniciar sesión, así que ni vale la pena intentarlo.
    if (window.self !== window.top) {
      return
    }

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