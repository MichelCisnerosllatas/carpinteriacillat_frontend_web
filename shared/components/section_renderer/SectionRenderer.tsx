// shared/components/section_renderer/SectionRenderer.tsx
//
// Este componente NO pide datos: recibe una seccion que ya viene adentro
// del JSON de getSite() (ver features/home/ui/MainHome.tsx) y decide QUE
// componente de UI pintar segun section.section_type. La POSICION de la
// seccion (section_order) ya la resolvio quien arma la lista (ver
// normalizeSections en shared/services/site_service/lib/
// normalizeSectionContent.ts) — aca solo importa el tipo.
//
// IMPORTANTE: los section_type de abajo estan verificados contra la
// respuesta REAL de /v1/public/site (no son una suposicion del .md), y
// siguen la convencion estandarizada del backend (ver el docblock de
// TypeSectionSeeder.php en carpinteriacillat_backend): el SUFIJO del
// section_type dice la FORMA visual a simple vista —
//
//   *_hero     -> encabezado con imagen de fondo
//   *_grid     -> grid de tarjetas
//   *_carousel -> carrusel swiper
//   (sin sufijo) -> forma de contenido unica, no repetida en otro lado
//
// Dos secciones solo comparten section_type cuando pintan EXACTAMENTE la
// misma UI (ej. "page_hero" en Servicios/Galería/Nosotros, o "service_grid"
// en "Servicios Principales" y "Servicios Especializados"). Si una seccion
// necesita una UI distinta, tiene su PROPIO section_type (ver
// "category_grid", separado a proposito de "service_carousel") — este
// componente nunca deberia tener que "adivinar" la UI mirando item_type u
// otro campo del contenido.

import type { SiteSectionDto } from "@/shared/services/site_service/model/siteget.dto";
// *_hero
import PageHeroSection from "@/shared/components/page_hero/PageHeroSection";
import Section1 from "@/features/home/ui/section1/Section1";
// *_grid
import Section4 from "@/features/home/ui/section4/Section4";
import ServiceGrid from "@/features/service/ui/servicegrid/ServiceGrid";
import ServiceCategoryGrid from "@/features/service/ui/servicecategorygrid/ServiceCategoryGrid";
import GalleryPhoto from "@/features/gallery/ui/galleryphotos/GalleryPhoto";
import WeValuesSection from "@/features/we/ui/wevaluessection/WeValuesSection";
import WeTeamSection from "@/features/we/ui/weteamsection/WeTeamSection";
// *_carousel
import Section2 from "@/features/home/ui/section2/Section2";
import SectionTestimonial from "@/features/home/ui/SectionTestimonial/SectionTestimonial";
import WeHistorySection from "@/features/we/ui/wehostorysection/WeHistorySection";
// sin sufijo (forma unica)
import SectionProcess from "@/features/home/ui/SectionProcess/SectionProcess";
import SectionContact from "@/features/home/ui/SectionContact/SectionContact";
import WeSection2 from "@/features/we/ui/wesection2/WeSection2";
import Section3 from "@/features/home/ui/section3/Section3";

type Props = {
  section: SiteSectionDto;
};

export default function SectionRenderer({ section }: Props) {
  // Defensivo: /v1/public/site ya llega filtrado por section_state, pero
  // si algun dia esta lista se arma con datos que no pasaron por
  // normalizeSections() (tests, storybook, etc.) esto evita pintar una
  // seccion desactivada.
  if (!section.section_state) {
    return null;
  }

  switch (section.section_type) {
    // --- *_hero ---
    case "hero":
      return <Section1 section={section} />;

    case "page_hero":
      // Header generico de pagina interna: Servicios, Galería, Nosotros.
      return <PageHeroSection section={section} />;

    // --- *_grid ---
    case "feature_grid":
      return <Section4 section={section} />;

    case "service_grid":
      // Usado por "services-main" (con description) y
      // "services-specialized" (sin description) — ServiceGrid ya
      // omite el parrafo cuando no hay description.
      return <ServiceGrid section={section} />;

    case "category_grid":
      return <ServiceCategoryGrid section={section} />;

    case "gallery_grid":
      return <GalleryPhoto section={section} />;

    case "value_grid":
      return <WeValuesSection section={section} />;

    case "team_grid":
      return <WeTeamSection section={section} />;

    // --- *_carousel ---
    case "service_carousel":
      // Usado por Home ("Nuestros Servicios") y por Services
      // ("Carpintería Comercial") — en ambos casos son items sueltos
      // (item_type "service") con description: misma forma, mismo
      // carrusel swiper.
      return <Section2 section={section} />;

    case "testimonial_carousel":
      return <SectionTestimonial section={section} />;

    case "history_carousel":
      return <WeHistorySection section={section} />;

    // --- Sin sufijo: forma de contenido unica ---
    case "process":
      return <SectionProcess section={section} />;

    case "contact":
      return <SectionContact section={section} />;

    case "text_media":
      return <WeSection2 section={section} />;

    case "gallery_preview":
      return <Section3 section={section} />;

    default:
      // No rompe la pagina: si el backend agrega un section_type nuevo
      // que este componente todavia no sabe pintar, simplemente se
      // omite (y queda este aviso en la consola del servidor para
      // notar que falta implementarlo).
      console.warn("[SectionRenderer] Tipo de sección no implementado:", section.section_type);
      return null;
  }
}
