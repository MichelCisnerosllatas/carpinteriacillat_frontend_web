// shared/services/site_service/model/siteget.dto.ts
//
// DTO de GET /v1/public/site — verificado campo por campo contra los
// Resources reales del backend (app/Http/Resources/v1/Public/Site/Web*.php
// en carpinteriacillat_backend), no solo contra la documentacion.
//
// Esta es la UNICA lectura principal del sitio: navegacion + secciones +
// botones + items + detalles + imagenes llegan todos en esta misma
// respuesta. El backend ya filtra lo inactivo y entrega los arrays
// ordenados en cada nivel (navegaciones, secciones, botones, items,
// detalles, imagenes) — el frontend NO es la fuente de verdad de
// visibilidad ni de orden, solo puede aplicar chequeos defensivos (ver
// lib/normalizeNavigations.ts).
//
// IMPORTANTE sobre "state": aca SIEMPRE es boolean (true/false). Esto es
// distinto al resto de la API (intranet), donde "state" es un entero
// 0-5. No confundir ambos contratos.

export type SiteResponseDto = {
  success: boolean;
  status: number;
  message: string;
  data: SiteDataDto;
};

export type SiteDataDto = {
  navigations: SiteNavigationDto[];
};

export type SiteNavigationDto = {
  id_navigation: number;
  navigation_name: string;
  navigation_description: string | null;
  navigation_url: string;
  navigation_order: number;
  navigation_state: boolean;
  sections: SiteSectionDto[];
};

// "sections" es el payload que en la siguiente fase alimentara un
// SectionRenderer (Home/Services/Gallery/We) para pintar cada tipo de
// seccion (hero, process, testimonials, contact, etc). En esta fase
// todavia no se consume — solo viaja adentro del DTO porque el backend
// ya lo entrega junto con la navegacion.
export type SiteSectionDto = {
  id_section: number;
  id_type_section: number;

  section_type: string;

  section_key: string;
  section_name: string;

  section_title: string | null;
  section_subtitle: string | null;
  section_description: string | null;
  section_content: string | null;

  section_variant: string | null;

  section_order: number;
  section_state: boolean;

  buttons: SiteSectionButtonDto[];
  items: SiteSectionItemDto[];
  images: SiteSectionImageDto[];
  testimonies: SiteTestimonyDto[];
  // `null` cuando la sección todavía no tiene fila propia en `testimony_web_setting` (el
  // admin nunca guardó nada ahí) — tratar igual que "todo en true, salvo el correo" (ver
  // widget/testimonial/lib/getTestimonySettings.ts).
  testimony_settings: SiteTestimonySettingsDto | null;
};

// Un testimonio de cliente (sección "testimonial_carousel", ej. "home-testimonials") — tabla
// propia `testimony_web` en el backend, ya NO vive dentro de `items` (ver
// TestimonyWebSeeder.php / create_testimony_web_tables migration).
export type SiteTestimonyDto = {
  id_testimony_web: number;
  name: string;
  role: string | null;
  city: string | null;
  email: string | null;
  rating: number | null;
  message: string;
  photo_url: string | null;
  is_delivered: boolean;
  is_verified: boolean;
  order: number | null;
  state: boolean;
};

// Qué columnas de la tarjeta de testimonio se muestran — 1 por SECCIÓN, no por testimonio.
export type SiteTestimonySettingsDto = {
  show_photo: boolean;
  show_rating: boolean;
  show_city: boolean;
  show_email: boolean;
  show_delivered: boolean;
  show_verified: boolean;
};

export type SiteSectionButtonDto = {
  id_section_button: number;
  label: string;
  url: string | null;
  icon: string | null;
  variant: string | null;
  // Discriminador estable (ej. "contact-form-submit") para botones que ejecutan lógica propia
  // del frontend en vez de navegar a `url` — ver ContactForm.tsx. A diferencia del resto de
  // campos de este arreglo, un botón CON action_key no viene pre-filtrado por estado: `state`
  // puede ser `false` y es el frontend quien decide si pinta su propio control.
  action_key: string | null;
  order: number;
  state: boolean;
};

export type SiteSectionItemDetailDto = {
  id_section_item_detail: number;
  title: string | null;
  description: string | null;
  order: number;
  state: boolean;
};

export type SiteSectionItemDto = {
  id_section_item: number;
  item_type: string | null;
  key: string | null;

  title: string | null;
  subtitle: string | null;
  description: string | null;
  label: string | null;

  value: string | null;
  suffix: string | null;

  icon: string | null;
  link: string | null;

  rating: number | null;
  variant: string | null;

  latitude: number | null;
  longitude: number | null;

  order: number;
  state: boolean;

  details: SiteSectionItemDetailDto[];
};

export type SiteSectionImageDto = {
  id_section_image: number;
  id_image: number;

  name: string | null;
  url: string;
  alt: string | null;

  title: string | null;
  description: string | null;
  label: string | null;

  link: string | null;
  link_label: string | null;

  variant: string | null;

  // Como debe encajar la imagen dentro de su contenedor (equivalente a la
  // propiedad CSS object-fit): "fill" | "cover" | "contain". Ver
  // shared/services/site_service/lib/resolveImageFit.ts — ahi se traduce
  // a la clase de Tailwind real, nunca se usa este string crudo en un
  // className.
  fix: string | null;

  order: number;
  state: boolean;
};
