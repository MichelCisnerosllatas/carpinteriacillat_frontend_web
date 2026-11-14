// shared/store/preview/preview.types.ts
//
// El CONTRATO del mensaje que manda el intranet por postMessage() hacia /preview. Este es
// el único archivo que hay que mirar para saber "qué le tengo que mandar" — se documenta acá
// y se copia (a mano, como comentario) del lado del intranet, en
// src/widgets/landing-preview/landing-preview.types.ts, porque son dos proyectos separados
// y no pueden importarse un type el uno al otro.
//
// REGLA DE ORO: "fields" ya viene en el idioma del SITIO PÚBLICO (los mismos nombres de
// SiteSectionDto/SiteSectionButtonDto/etc. de site_service/model/siteget.dto.ts), no en el
// idioma interno del intranet (que usa nombres de columna como "sectionimage_fix"). Cada
// formulario del intranet ya sabe traducir sus propios campos (los usa a diario en su propio
// onSubmit) — ese conocimiento vive ahí, no acá. Este archivo (y todo shared/store/preview/)
// nunca necesita saber que existe una columna "sectionimage_fix": solo sabe que existe una
// clave pública "fix".
//
// "fields" es PARCIAL a propósito: un formulario solo manda lo que él edita. Lo que falta se
// completa con el nodo ya cargado en el store (si se está editando uno existente) o con
// valores por defecto razonables (si es un registro nuevo) — ver preview.resolve.ts.

export type PreviewEntity =
  | "navigation"
  | "section"
  | "section_button"
  | "section_image"
  | "section_item"
  | "section_item_detail"
  | "testimony"
  // Singleton, como "navigation" pero sin id — siempre existe una sola fila de
  // footer_settings, no hay "cuál" que resolver.
  | "footer";

export type PreviewPayload = {
  entity: PreviewEntity;
  // Ausente/null = registro nuevo, todavía sin guardar (o "footer", que no tiene id).
  id: number | null;
  // Cada formulario manda SOLO la clave que ya tiene a mano en su propio estado — nunca
  // tiene que ir a buscar ninguna otra (ver landing-preview.routes.ts del lado intranet):
  //   - entity "navigation"/"footer": ninguna
  //   - entity "section":                  id_navigation
  //   - entity "section_button"/"section_image"/"section_item"/"testimony": id_section
  //   - entity "section_item_detail":      id_section_item
  id_navigation?: number;
  id_section?: number;
  id_section_item?: number;
  // Entidad "section": además de sus columnas públicas (section_title, ...), puede traer
  //   - fields.display_settings: la "Apariencia" COMPLETA ya resuelta { "<clave>": valor } (la
  //     arma el intranet con display_settings_schema + los valores del formulario). Reemplaza a
  //     la vieja fields.card_settings. Se aplica a la sección (ver preview.resolve.ts).
  //   - section_title / section_subtitle / section_description en null cuando la Apariencia
  //     apaga header.show_title / header.show_subtitle / header.show_description.
  // Si la página montada ya pertenece a la navegación de la sección (ej. el detalle
  // /gallery/<id> y la sección es de /gallery), la web NO cambia de página al aplicarlo.
  fields: Record<string, unknown>;
};

// "Llevame a tal lugar" SIN ningún registro de por medio — lo manda el intranet al entrar a
// pantallas que no editan contenido del sitio (ej. Mensajes de Contacto → la sección
// #contacto del Home). Copia de `PreviewFocus` en landing-preview.types.ts del intranet.
//   - navigationUrl: página a montar (ausente = se queda en la que ya estaba). Puede ser
//                    "/gallery/<id_web_work>": monta el detalle de ese trabajo (si el id no
//                    existe usa el primer trabajo; sin trabajos, la galería).
//   - anchorId:      id del DOM al que hacer scroll (ausente = arriba de todo).
//   - label:         solo lo usa el header del panel del intranet — acá se ignora.
export type PreviewFocus = {
  navigationUrl?: string;
  anchorId?: string;
  label: string;
};

export type PreviewInboundMessage =
  | { source: "cillat-intranet-preview"; type: "preview"; payload: PreviewPayload }
  | { source: "cillat-intranet-preview"; type: "focus"; focus: PreviewFocus }
  // Resalta un elemento de la página montada: busca [data-el="<element>"] (el primero visible),
  // hace scroll hasta él y le pone un contorno con pulso ~1,6 s. element: null quita el
  // resaltado. Si no lo encuentra (ej. oculto por un toggle apagado), no hace nada. Las anclas
  // data-el salen del catálogo de la Apariencia (campo "element" de display_settings_schema).
  // sectionId: se busca primero dentro de #section-<id> (los data-el se repiten entre secciones);
  // si ahí no está (ej. detalle /gallery/<id>), en toda la página.
  | { source: "cillat-intranet-preview"; type: "highlight"; element: string | null; sectionId?: number | null }
  | { source: "cillat-intranet-preview"; type: "ping" };

export type PreviewOutboundMessage =
  | { source: "cillat-web-preview"; type: "ready" }
  // Avisa al intranet a qué página real quedó apuntando el preview (para el botón "Ver
  // original" y el label de "qué se está editando" — el intranet nunca resuelve esto por su
  // cuenta, solo manda claves crudas, ver PreviewPayload de arriba). Para el detalle de un
  // trabajo es la URL real montada ("/gallery/12"), ya con el id corregido si hizo falta.
  | { source: "cillat-web-preview"; type: "active-url"; navigationUrl: string };
