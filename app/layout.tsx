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
import { getSite } from "@/shared/services/site_service/lib/getSite";
import { normalizeNavigations } from "@/shared/services/site_service/lib/normalizeNavigations";
import { findFloatingWhatsapp, type FloatingWhatsappButton } from "@/shared/services/site_service/lib/findFloatingWhatsapp";
import type { SiteDataDto, SiteNavigationDto } from "@/shared/services/site_service/model/siteget.dto";
import { GoogleOneTap } from "@/widget/buttonproveedor/GoogleOneTap";

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


// Trae TODO el sitio (navegacion + secciones + botones + items + imagenes)
// ANTES de renderizar nada, corriendo en el servidor de Next (no en el
// navegador del usuario). Por eso este archivo puede usar "await" directo
// sin useEffect ni loading: layout.tsx es un Server Component (no tiene
// "use client" arriba), asi que Next lo espera a que termine y recien ahi
// arma el HTML que le manda al navegador.
//
// getSite() ya hace la unica peticion HTTP real (GET /v1/public/site,
// cacheada con la etiqueta "site" — ver shared/services/site_service/lib/
// getSite.ts). Aca solo se "reparte" ese mismo JSON: Header/Footer
// necesitan site.navigations, y Footer ademas necesita el boton flotante
// de WhatsApp (ver findFloatingWhatsapp.ts).
//
// navigations:
//   - un array (puede venir vacío si de verdad no hay links configurados)
//     cuando la peticion salio bien.
//   - null cuando la peticion FALLO (sin internet, backend caido, etc.) o
//     el sitio no vino. Se distingue de "array vacío" a proposito: Header
//     y Footer necesitan saber si "no hay datos porque fallo" para poder
//     mostrar su fallback.
async function getLayoutData(): Promise<{
  site: SiteDataDto | null;
  navigations: SiteNavigationDto[] | null;
  whatsappButton: FloatingWhatsappButton | null;
}> {
  const site = await getSite();
  console.info("Layout ======================");
    console.info(JSON.stringify(site));

  if (!site) return { site: null, navigations: null, whatsappButton: null };

  return {
    site,
    navigations: normalizeNavigations(site.navigations),
    whatsappButton: findFloatingWhatsapp(site),
  };
}

// Server Component: es "async function" (no puede tener "use client"),
// asi que TODO lo que hay adentro corre en el servidor de Next, antes de
// que el navegador reciba una sola linea de HTML.
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { site, navigations: initialNavigations, whatsappButton } = await getLayoutData();

  // suppressHydrationWarning solo evita el aviso de mismatch causado por
  // extensiones de navegador (ej. Dark Reader) que inyectan atributos en
  // <html> antes de que React hidrate. No oculta errores reales de
  // hidratación del propio contenido.
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <GoogleOneTap />
        
        <AppProviders site={site}>
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
          <Footer initialNavigations={initialNavigations} whatsappButton={whatsappButton} />
        </AppProviders>
      </body>
    </html>
  );
}
