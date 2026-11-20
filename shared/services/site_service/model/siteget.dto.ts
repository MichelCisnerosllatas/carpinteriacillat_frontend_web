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

import type { SiteAlertDto } from "./siteAlert.dto";

export type SiteResponseDto = {
  success: boolean;
  status: number;
  message: string;
  data: SiteDataDto;
};

export type SiteDataDto = {
  company: SiteCompanyDto | null;
  social_networks: SiteSocialNetworkDto[];
  footer_settings: SiteFooterSettingsDto;
  navigations: SiteNavigationDto[];
  // Trabajos del portafolio web (web_works, state 1) — viene al mismo nivel que navigations.
  // Un backend viejo puede no mandarlo todavía: quien lo lea debe usar `site.works ?? []`
  // (ver shared/store/site/useSiteWorks.ts).
  works: SiteWorkDto[];
  // Barras de aviso arriba del header (web_alerts): solo las que se están mostrando, ya
  // ordenadas. Opcional porque un backend viejo puede no mandarlo. Las pinta
  // features/site-alerts/ui/SiteAlerts.tsx.
  alerts?: SiteAlertDto[];
  // ChatBot flotante (chatbot_setting singleton + chatbot_option) — se administra desde el
  // intranet en Sitio Web → ChatBot. Opcional porque un backend viejo puede no mandarlo: quien
  // lo lea debe caer a DEFAULT_CHATBOT_SETTINGS (ver lib/chatbotDefaults.ts).
  chatbot?: SiteChatbotDto;
};

// Un trabajo del portafolio web (tabla web_works en el backend, con su tipo en type_works).
// NO es un mueble del catálogo: puede relacionarse opcionalmente con uno (id_furniture), pero
// la web lo identifica SIEMPRE por id_web_work (ruta /gallery/<id_web_work>, reseñas, keys).
// Lo usan la galería (/gallery), el detalle (/gallery/[id]) y las secciones de Servicios que
// se calculan solas (category_coverflow → fotos automáticas; restoration_compare → trabajos
// de tipo "restoration" con pares Antes/Después). Casi todo puede venir null: el admin
// completa los datos de a poco.
export type SiteWorkDto = {
  id_web_work: number;
  // Mueble del catálogo relacionado (opcional). La web no lo usa para navegar.
  id_furniture: number | null;
  // Tipo del trabajo: key "manufacture" (Fabricación) o "restoration" (Restauración). Las
  // claves las usa el código (ver lib/workTypes.ts); el nombre es el texto a mostrar.
  // Siempre viene (es obligatorio en el backend); igual se lee con getWorkTypeKey().
  type: SiteWorkTypeDto;
  title: string | null;
  description: string | null;
  category: { id_category: number; name: string } | null;
  wood: { id_typewood: number; name: string } | null;
  style: string | null;
  measures: string | null;
  finish: string | null;
  build_time: string | null;
  location: string | null;
  delivered_at: string | null; // "2026-05-10"
  price_approx: number | null;
  order: number | null;
  // Fotos de GALERÍA: la primera es la portada; después las demás ya ordenadas por el
  // backend. No incluyen las fotos de los pares Antes/Después.
  photos: SiteWorkPhotoDto[];
  // Pares Antes/Después (solo restauraciones; [] en los demás tipos), ya ordenados.
  pairs: SiteWorkPairDto[];
  rating_avg: number | null;
  testimonies: SiteWorkTestimonyDto[];
};

export type SiteWorkTypeDto = {
  key: string; // "manufacture" | "restoration" (puede haber otros en el futuro)
  name: string; // "Fabricación" | "Restauración"
};

export type SiteWorkPhotoDto = {
  // null = es la portada del trabajo (web_works.id_image) y no coincide con ninguna fila de
  // web_work_images (entra con order 0).
  id_web_work_image: number | null;
  url: string;
  alt: string | null;
  caption: string | null;
  order: number;
};

// Un par Antes/Después de una restauración (tabla web_work_pairs): 1 foto antes + 1 después.
export type SiteWorkPairDto = {
  id_web_work_pair: number;
  caption: string | null; // "Frente", "Detalle del tirador"…
  order: number | null;
  before: SiteWorkPairPhotoDto;
  after: SiteWorkPairPhotoDto;
};

export type SiteWorkPairPhotoDto = {
  url: string;
  alt: string | null;
};

export type SiteWorkTestimonyDto = {
  id_testimony_web: number;
  name: string;
  rating: number | null;
  message: string;
  date: string | null; // "2026-05-12"
};

// De `footer_setting` (backend, singleton) — visibilidad del footer completo y de cada una de
// sus columnas. `footer_state` en false = no se renderiza el footer en ninguna página.
export type SiteFooterSettingsDto = {
  // URL ya resuelta por el backend: prioriza el logo propio del footer (`footer_setting.logo`)
  // y cae al de `company` si no se subió uno — el frontend no necesita repetir esa prioridad.
  logo_url: string | null;
  // Configurables desde /footer (intranet) — `logo_width` en null = automático (según la
  // proporción real de la imagen a `logo_height`, sin forzar ningún ancho).
  logo_height: number;
  logo_width: number | null;
  logo_object_fit: "contain" | "cover";
  footer_state: boolean;
  show_brand: boolean;
  show_quick_links: boolean;
  show_services: boolean;
  show_access: boolean;
};

// De `chatbot_setting` (backend, singleton) — diseño, comportamiento, visibilidad y posición
// del chatbot. Todo se edita en el intranet: Sitio Web → ChatBot → Configuración.
export type SiteChatbotSettingsDto = {
  // false = el chatbot no se pinta en ninguna página (en /preview sí, con una marca).
  chatbot_state: boolean;
  show_on_mobile: boolean;
  position: "bottom-right" | "bottom-left";
  // Distancia en px al borde lateral (offset_x) y al borde inferior (offset_y).
  offset_x: number;
  offset_y: number;
  primary_color: string;
  header_title: string;
  header_subtitle: string | null;
  // Clase de Font Awesome (ej. "fa-solid fa-comments").
  launcher_icon: string;
  // Animación del botón flotante: "none" | "pulse" | "bounce" | "wiggle" | "float"
  // (ver shared/lib/floatingAnimation.ts). Opcional por si el backend aún no la manda.
  launcher_animation?: string;
  welcome_message: string;
  input_placeholder: string;
  allow_voice: boolean;
  // null = nunca se abre solo; N = se abre solo a los N segundos (una vez por sesión).
  auto_open_seconds: number | null;
  // true = antes de chatear se pide nombre + teléfono (ver features/chatbot/ui/ChatContactForm.tsx).
  require_contact_data: boolean;
};

// De `chatbot_option` — cada ListTile de la pantalla inicial del chatbot. Ya vienen solo las
// activas y ordenadas por el backend.
export type SiteChatbotOptionDto = {
  id: number;
  key: string;
  title: string;
  subtitle: string | null;
  icon: string;
  // "chat" abre la conversación; "whatsapp" abre wa.me con `value` (número); "url" abre `value`.
  action: "chat" | "whatsapp" | "url";
  value: string | null;
  order: number;
};

export type SiteChatbotDto = {
  settings: SiteChatbotSettingsDto;
  options: SiteChatbotOptionDto[];
};

// De `company_settings`/`company_social_networks` (backend) — hasta ahora solo usadas en el
// intranet para facturacion/proformas, reutilizadas aca para el logo y los iconos de redes del
// footer. `company` es null si esa fila nunca se guardo. `social_networks` ya viene filtrado a
// `show_on_website=true` y `status=1` y ordenado — no hay nada que filtrar/ordenar en el cliente.
export type SiteCompanyDto = {
  name: string;
  logo_url: string | null;
};

export type SiteSocialNetworkDto = {
  name: string;
  link: string;
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
  // features/testimony/lib/getTestimonySettings.ts).
  testimony_settings: SiteTestimonySettingsDto | null;
  // "Apariencia" de la sección: qué muestra la web (ej. { "card.show_price": false,
  // "card.price_prefix": "Aprox." }). Viene de la tabla section_display_setting, ya resuelto
  // con TODAS las claves del catálogo del backend (config/section_display/*.php).
  // Leerlo SIEMPRE con los getters de shared/services/site_service/lib/displaySettings.ts.
  display_settings?: Record<string, unknown>;
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

  // Item de la misma sección al que pertenece la foto (ej. cada servicio del hero
  // "service_showcase" tiene sus propias fotos). null = foto de la sección en general.
  id_section_item: number | null;

  order: number;
  state: boolean;
};
