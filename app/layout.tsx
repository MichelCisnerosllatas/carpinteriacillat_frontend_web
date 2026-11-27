// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins, Figtree } from "next/font/google";
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
import { findFooterServiceLinks, type FooterServiceLink } from "@/shared/services/site_service/lib/findFooterServiceLinks";
import type { SiteCompanyDto, SiteDataDto, SiteFooterSettingsDto, SiteNavigationDto, SiteSocialNetworkDto } from "@/shared/services/site_service/model/siteget.dto";

// Si falló la petición del sitio, se prefiere mostrar el footer con sus fallbacks fijos (mismo
// criterio que la navegación) antes que ocultarlo por completo — "todo visible" es el default
// seguro cuando no hay config real que consultar.
const DEFAULT_FOOTER_SETTINGS: SiteFooterSettingsDto = {
  logo_url: null,
  logo_height: 64,
  logo_width: null,
  logo_object_fit: "contain",
  footer_state: true,
  show_brand: true,
  show_quick_links: true,
  show_services: true,
  show_access: true,
};
import { GoogleOneTap } from "@/features/google-auth/ui/google-one-tap/GoogleOneTap";
import FloatingActions from "@/widget/floating-actions/FloatingActions";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Poppins: fuente de todo el sitio (globals.css la usa con var(--font-poppins)).
// next/font la descarga en el build y la sirve desde el propio sitio (sin pedirla a Google
// en cada visita). Solo se cargan los pesos que de verdad se usan.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

// Figtree: texto corrido de las secciones del rediseño (clase "il-scope", ver globals.css).
const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
  company: SiteCompanyDto | null;
  socialNetworks: SiteSocialNetworkDto[];
  serviceLinks: FooterServiceLink[];
  footerSettings: SiteFooterSettingsDto;
}> {
  const site = await getSite();
  console.info("Layout ======================");
  console.info(JSON.stringify(site));

  if (!site) {
    return {
      site: null, 
      navigations: null, 
      company: null, 
      socialNetworks: [], 
      serviceLinks: [],
      footerSettings: DEFAULT_FOOTER_SETTINGS,
    };
  }

  return {
    site,
    navigations: normalizeNavigations(site.navigations),
    company: site.company,
    socialNetworks: site.social_networks,
    serviceLinks: findFooterServiceLinks(site),
    footerSettings: site.footer_settings ?? DEFAULT_FOOTER_SETTINGS,
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
  const { site, navigations: initialNavigations, company, socialNetworks, serviceLinks, footerSettings } = await getLayoutData();

  // suppressHydrationWarning solo evita el aviso de mismatch causado por
  // extensiones de navegador (ej. Dark Reader) que inyectan atributos en
  // <html> antes de que React hidrate. No oculta errores reales de
  // hidratación del propio contenido.
  return (
    // Las variables de fuente van en <html> (y no en <body>) porque la regla "*" de globals.css
    // también alcanza a <html>, y ahí la variable tiene que existir.
    <html lang="en" className={`${poppins.variable} ${figtree.variable}`} suppressHydrationWarning>
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
          {/* Antes el "footer_state && " vivía acá — un Server Component que nunca se
              re-evalúa en el cliente, así que apagar/prender el footer desde /preview jamás
              se reflejaba. Ahora <Footer/> siempre se monta y ES ÉL quien decide (ya lee el
              store, ver widget/footer/Footer.tsx) — para un visitante normal no cambia nada,
              `footerSettings` (la prop) y el store arrancan con el mismo valor. */}
          <Footer
            initialNavigations={initialNavigations}
            company={company}
            socialNetworks={socialNetworks}
            serviceLinks={serviceLinks}
            footerSettings={footerSettings}
          />
          {/* Botones flotantes (chatbot + WhatsApp): leen useSiteStore (no reciben props) para
              que /preview los pueda cambiar en caliente. Se posicionan JUNTOS ahí adentro para
              que, si comparten esquina, queden apilados y alineados. */}
          <FloatingActions />
        </AppProviders>
      </body>
    </html>
  );
}
