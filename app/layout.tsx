// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@fortawesome/fontawesome-free/css/all.min.css"; // ⬅️ AQUÍ
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "yet-another-react-lightbox/styles.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./globals.css";
import Header from "@/widget/header/Header";
import Footer from "@/widget/footer/Footer";
import NextTopLoader from "nextjs-toploader";
import AppProviders from "./providers";
import { navigationsService } from "@/shared/services/navigation_service/services/navigations.service";
import { pickActiveNavigations } from "@/shared/services/navigation_service/lib/pickActiveNavigations";
import type { NavigationApiItem } from "@/shared/services/navigation_service/model/navigationget.dto";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: {
    default: "Carpintería CILLAT",
    template: "%s",
  },
  description: "Carpintería CILLAT landing",
};


// Trae la navegacion ANTES de renderizar nada, corriendo en el servidor de
// Next (no en el navegador del usuario). Por eso este archivo puede usar
// "await" directo sin useEffect ni loading: layout.tsx es un Server
// Component (no tiene "use client" arriba), asi que Next lo espera a que
// termine y recien ahi arma el HTML que le manda al navegador.
//
// Devuelve:
//   - un array (puede venir vacío si de verdad no hay links configurados)
//     cuando la peticion salio bien.
//   - null cuando la peticion FALLO (sin internet, backend caido, etc.).
//     Se distingue de "array vacío" a proposito: Header y Footer necesitan
//     saber si "no hay datos porque fallo" para poder mostrar su fallback.
//
// CACHE: en vez de volver a pedir esto cada tanto tiempo (lo que hacia
// antes con "revalidate: 300"), ahora se guarda con la etiqueta
// "navigation" y se queda cacheado INDEFINIDAMENTE — cero peticiones de
// fondo — hasta que alguien la invalide a propósito llamando a
// app/api/revalidate-navigation/route.ts (eso es lo que hay que hacer
// despues de editar un link en el backend/admin, para que se refresque al
// instante en vez de esperar el proximo deploy).
async function getInitialNavigations(): Promise<NavigationApiItem[] | null> {
  try {
    const response = await navigationsService.get(
      { state: 1, per_page: 50 },
      { next: { tags: ["navigation"] } }
    );
    return pickActiveNavigations(response.data);
  } catch (err) {
    // Sin este log, si esto vuelve a fallar no hay forma de saber por que
    // (el catch se "tragaba" el error en silencio). Aparece en la consola
    // de donde corre "npm run dev" / el servidor de produccion, NO en la
    // consola del navegador (esto corre en el servidor).
    console.error("[layout] No se pudo traer la navegacion en el servidor:", err);
    return null;
  }
}

// Server Component: es "async function" (no puede tener "use client"),
// asi que TODO lo que hay adentro corre en el servidor de Next, antes de
// que el navegador reciba una sola linea de HTML.
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialNavigations = await getInitialNavigations();

  // suppressHydrationWarning solo evita el aviso de mismatch causado por
  // extensiones de navegador (ej. Dark Reader) que inyectan atributos en
  // <html> antes de que React hidrate. No oculta errores reales de
  // hidratación del propio contenido.
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppProviders>
          <NextTopLoader
            color="#F5C400"   // tu amarillo marca
            height={3}
            showSpinner={false}
          />
          {/* Header y Footer siguen siendo Client Components (interactividad:
              scroll, menu mobile, etc.), pero ya no tienen que ESPERAR a
              pedir la navegacion ellos mismos: se las pasamos ya resueltas
              desde aca. */}
          <Header initialNavigations={initialNavigations} />
          {children}
          <Footer initialNavigations={initialNavigations} />
        </AppProviders>
      </body>
    </html>
  );
}
