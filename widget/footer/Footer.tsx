// widget/footer/Footer.tsx
"use client";

import Link from "next/link";
import { NAVIGATION_FALLBACK_LINKS, type NavLink } from "@/shared/services/site_service/lib/site.fallback";
import type { FloatingWhatsappButton } from "@/shared/services/site_service/lib/findFloatingWhatsapp";
import type { FooterServiceLink } from "@/shared/services/site_service/lib/findFooterServiceLinks";
import type { SiteCompanyDto, SiteFooterSettingsDto, SiteNavigationDto, SiteSocialNetworkDto } from "@/shared/services/site_service/model/siteget.dto";
import Container from "@/shared/ui/container/Container";

type FooterProps = {
    // Navegacion ya resuelta por el servidor (ver app/layout.tsx -> getSite()),
    // pasada desde app/layout.tsx. Mismo mecanismo que usa Header/Navbar: es
    // la UNICA fuente de los links, ya no hay un segundo fetch desde el
    // navegador (antes existia useNavigationStore como "respaldo en segundo
    // plano" — se elimino a proposito).
    initialNavigations: SiteNavigationDto[] | null;
    // El boton flotante de WhatsApp ahora es administrable desde el intranet
    // (section_item item_type "whatsapp" de la seccion "contact") — ver
    // findFloatingWhatsapp.ts. `null` = el item no existe o el admin lo
    // desactivo: no se pinta nada, a proposito (sin fallback fijo).
    whatsappButton: FloatingWhatsappButton | null;
    // Logo — antes un archivo estatico hardcodeado, ahora viene de
    // `company_settings.logo` (backend). `null` = esa fila no existe todavia: cae al logo
    // estatico de siempre (ver LOGO_FALLBACK mas abajo), nunca se deja el footer sin logo.
    company: SiteCompanyDto | null;
    // Iconos de redes — de `company_social_networks`, ya filtrados a `show_on_website=true` y
    // `status=1` desde el backend. Array vacio = no se pinta ningun icono (antes eran 3 fijos
    // con href="#", ni siquiera apuntaban a las redes reales).
    socialNetworks: SiteSocialNetworkDto[];
    // Columna "Servicios" — reutiliza los section_items reales de la seccion "home-services"
    // (ver findFooterServiceLinks.ts) en vez de una lista escrita a mano que había que mantener
    // sincronizada a ojo con esa sección.
    serviceLinks: FooterServiceLink[];
    // Visibilidad administrable desde /footer (intranet) — `footer_state` ya se resuelve en
    // layout.tsx (ni siquiera se monta este componente si es false); acá solo importan los 4
    // flags por columna.
    footerSettings: SiteFooterSettingsDto;
};

const LOGO_FALLBACK = "/img/logocillat_sinfondoblanco.png";

// Nombre guardado en `company_social_networks.name` (texto libre, lo escribe el admin) -> icono
// de Font Awesome. Coincidencia por substring, sin distinguir mayusculas — "Sitio Web"/cualquier
// nombre no reconocido cae en el icono generico de enlace.
const SOCIAL_ICON_BY_NAME: [string, string][] = [
    ["facebook", "fab fa-facebook-f"],
    ["instagram", "fab fa-instagram"],
    ["whatsapp", "fab fa-whatsapp"],
    ["tiktok", "fab fa-tiktok"],
    ["youtube", "fab fa-youtube"],
    ["linkedin", "fab fa-linkedin-in"],
    ["twitter", "fab fa-x-twitter"],
    ["x", "fab fa-x-twitter"],
];

function resolveSocialIconClass(name: string): string {
    const lower = name.toLowerCase();
    const match = SOCIAL_ICON_BY_NAME.find(([key]) => lower.includes(key));
    return match ? match[1] : "fas fa-link";
}

// Posicion en pantalla -> clases de Tailwind. `sectionitem_variant` de ese item guarda uno de
// estos valores (ver findFloatingWhatsapp.ts); cualquier valor no reconocido (o ausente) cae en
// "bottom-right", la posicion de siempre.
const WHATSAPP_POSITION_CLASS: Record<string, string> = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "bottom-center": "bottom-6 left-1/2 -translate-x-1/2",
    "top-right": "top-24 right-6",
    "top-left": "top-24 left-6",
};

function resolveWhatsappPositionClass(position: string | null): string {
    return (position && WHATSAPP_POSITION_CLASS[position]) || WHATSAPP_POSITION_CLASS["bottom-right"];
}

// Cuantas columnas realmente van a pintarse (admin las oculto en /footer, o -solo para Accesos-
// no hay NEXT_PUBLIC_INTRANET_URL) -> clases de grid, en mobile y desktop. Sin esto, ocultar una
// columna dejaria un hueco en blanco en vez de que las demas se reacomoden.
const GRID_CLASS_BY_VISIBLE_COUNT: Record<number, string> = {
    4: "sm:grid-cols-2 lg:grid-cols-4",
    3: "sm:grid-cols-3",
    2: "sm:grid-cols-2",
    1: "sm:grid-cols-1",
    0: "",
};

// Numero de siempre (wa.me/51999999999) — SOLO como ultimo recurso si el numero que trae el
// item no sirve para armar el link (ver buildWhatsappHref). No es un fallback de VISIBILIDAD:
// si el item no existe o esta desactivado, `whatsappButton` ya llega `null` y no se pinta nada.
const WHATSAPP_PHONE_FALLBACK = "51999999999";

function buildWhatsappHref(phone: string): string {
    const digits = phone.replace(/\D/g, "");
    return `https://wa.me/${digits || WHATSAPP_PHONE_FALLBACK}`;
}

// "Contacto" no es parte de la navegacion que devuelve la API (en el
// header es un boton aparte, no un link mas). Acá el footer SI lo agrega
// como un link mas, asi que se define aparte de NAVIGATION_FALLBACK_LINKS.
// El href es "/#contacto" (con barra al inicio) y no solo "#contacto":
// la seccion de contacto solo existe en la pagina de inicio ("/"), asi que
// si el usuario esta en otra pagina (ej. "/services"), "/#contacto" primero
// lo lleva al inicio y despues salta a esa seccion. Con solo "#contacto"
// el link no hace nada si no estas ya en el inicio.
const FOOTER_CONTACT_LINK: NavLink = { href: "/#contacto", label: "Contacto" };

// Respaldo si la sección "home-services" no devolvió items (desactivada, sin items activos, o
// falló la petición al backend) — los mismos 5 que antes estaban hardcodeados a fuego.
const SERVICES_FALLBACK_LINKS: FooterServiceLink[] = [
    { href: "/#servicios", label: "Cocinas Integrales" },
    { href: "/#servicios", label: "Closets & Dormitorios" },
    { href: "/#servicios", label: "Muebles de Oficina" },
    { href: "/#servicios", label: "Puertas & Ventanas" },
    { href: "/#servicios", label: "Restauración" },
];

export default function Footer({ initialNavigations, whatsappButton, company, socialNetworks, serviceLinks, footerSettings }: FooterProps) {
    // Misma logica de prioridad que usa Navbar.tsx: lo que trajo el
    // servidor (getSite()) y, si vino null/vacio, el fallback fijo.
    const resolvedNavigations = initialNavigations ?? [];
    const quickLinks: NavLink[] = resolvedNavigations.length > 0
        ? [...resolvedNavigations.map((item) => ({ href: item.navigation_url, label: item.navigation_name })), FOOTER_CONTACT_LINK]
        : [...NAVIGATION_FALLBACK_LINKS, FOOTER_CONTACT_LINK];
    // Antes era una URL de dev hardcodeada acá mismo — ahora vive en .env (ver .env.example),
    // porque es la URL de OTRA app y cambia por entorno. Vacía/no seteada = no se pinta el link
    // (a propósito, en vez de caer a una URL de dev en producción).
    const intranetUrl = process.env.NEXT_PUBLIC_INTRANET_URL;
    const currentYear = new Date().getFullYear();

    // Cada columna se oculta por 2 motivos posibles, combinados acá: el admin la apagó desde
    // /footer (intranet), o -solo para Accesos- no hay contenido real (sin
    // NEXT_PUBLIC_INTRANET_URL). Marca/Enlaces Rápidos/Servicios siempre tienen contenido
    // garantizado (logo fijo, fallback de nav, SERVICES_FALLBACK_LINKS), así que ahí solo pesa
    // el flag del admin.
    const showBrandColumn = footerSettings.show_brand;
    const showQuickLinksColumn = footerSettings.show_quick_links;
    const showServicesColumn = footerSettings.show_services;
    const showAccessColumn = footerSettings.show_access && Boolean(intranetUrl);

    const visibleColumnCount = [showBrandColumn, showQuickLinksColumn, showServicesColumn, showAccessColumn]
        .filter(Boolean).length;
    const footerGridClass = `grid grid-cols-1 gap-8 mb-8 ${GRID_CLASS_BY_VISIBLE_COUNT[visibleColumnCount]}`;

    return (
        <>
            <footer className="bg-gray-900 text-white py-12">
                <Container>
                    <div className={footerGridClass}>
                        {/* Col 1 - Marca + redes — apagable desde /footer (intranet) */}
                        {showBrandColumn && (
                        <div className="space-y-4">
                            {/* Logo clickeable al home (#inicio) — `<img>` normal (no next/image):
                                `footerSettings.logo_url` es una URL absoluta ya resuelta por el
                                backend (prioriza el logo PROPIO del footer y cae al de
                                `company` si no se subió uno — ver WebSiteResource::toArray()),
                                igual criterio que TestimonialCard con las fotos de testimonios. */}
                            <Link href="/" className="block w-fit">
                                {/* Tamaño y object-fit configurables desde /footer (intranet) —
                                    `logo_width` viene `null` cuando debe calcularse automático
                                    según la proporción real de la imagen (no forzarse), por eso
                                    va por `style` (inline) y no por clases fijas de Tailwind. */}
                                <img
                                    src={footerSettings.logo_url ?? LOGO_FALLBACK}
                                    alt={company?.name ?? "CILLAT - Fabricación de Muebles"}
                                    style={{
                                        height: footerSettings.logo_height,
                                        width: footerSettings.logo_width ?? "auto",
                                        objectFit: footerSettings.logo_object_fit,
                                        maxWidth: footerSettings.logo_width ? undefined : 220,
                                    }}
                                />
                            </Link>

                            <p className="text-gray-400 text-sm md:text-base">
                                Servicios Generales y Fabricación de Muebles de Alta Calidad
                            </p>

                            {socialNetworks.length > 0 && (
                                <div className="flex gap-3">
                                    {socialNetworks.map((network) => (
                                        <a
                                            key={network.name}
                                            href={network.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title={network.name}
                                            className="bg-gray-800 hover:bg-red-600 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                                        >
                                            <i className={resolveSocialIconClass(network.name)} />
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                        )}



                        {/* Col 2 - Enlaces rápidos — apagable desde /footer (intranet) */}
                        {showQuickLinksColumn && (
                        <div>
                            <h4 className="text-lg font-bold mb-4">Enlaces Rápidos</h4>
                            <ul className="space-y-2">
                                {quickLinks.map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className="text-gray-400 hover:text-amber-400 transition-colors"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        )}

                        {/* Col 3 - Servicios — reutiliza los items reales de la sección
                            "home-services" (ver findFooterServiceLinks.ts); si viene vacío
                            (sección desactivada, sin items activos), cae al fallback fijo para
                            no dejar la columna en blanco. Apagable desde /footer (intranet). */}
                        {showServicesColumn && (
                        <div>
                            <h4 className="text-lg font-bold mb-4">Servicios</h4>
                            <ul className="space-y-2">
                                {(serviceLinks.length > 0 ? serviceLinks : SERVICES_FALLBACK_LINKS).map((service) => (
                                    <li key={service.label}>
                                        <a
                                            href={service.href}
                                            className="text-gray-400 hover:text-amber-400 transition-colors"
                                        >
                                            {service.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        )}

                        {/* Col 4 - Accesos — columna entera condicionada (no solo el <li>): sin
                            intranetUrl, o si el admin la apagó desde /footer, no se renderiza
                            nada acá, así el grid recalcula cuántas columnas mostrar (ver
                            footerGridClass) en vez de dejar esta celda en blanco. */}
                        {showAccessColumn && (
                        <div>
                            <h4 className="text-lg font-bold mb-4">Accesos</h4>
                            <ul className="space-y-2">
                                <li>
                                    <a href={intranetUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-amber-400 transition-colors">
                                        Intranet
                                    </a>
                                </li>
                            </ul>
                            {/*<h4 className="text-lg font-bold mb-4">Accesos</h4>*/}
                            {/*<p className="text-gray-400 mb-4">*/}
                            {/*    Suscríbete para recibir ofertas especiales*/}
                            {/*</p>*/}
                            {/*<div className="flex gap-2">*/}
                            {/*    <input*/}
                            {/*        type="email"*/}
                            {/*        placeholder="Tu email"*/}
                            {/*        className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-amber-500 focus:outline-none text-white"*/}
                            {/*    />*/}
                            {/*    <button*/}
                            {/*        type="button"*/}
                            {/*        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-4 py-2 rounded-lg transition-all"*/}
                            {/*    >*/}
                            {/*        <i className="fas fa-paper-plane" />*/}
                            {/*    </button>*/}
                            {/*</div>*/}
                        </div>
                        )}
                    </div>

                    {/* Línea final */}
                    <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
                        <p>
                            &copy; {currentYear} CILLAT - Todos los derechos reservados | Diseñado con{" "}
                            <i className="fas fa-heart text-red-600" /> en Perú
                        </p>
                    </div>
                </Container>
            </footer>

            {/* Botón WhatsApp flotante — administrable desde el intranet (ver whatsappButton
                arriba); si el admin lo desactivó, `whatsappButton` es `null` y no se pinta nada. */}
            {whatsappButton && (
                <a
                    href={buildWhatsappHref(whatsappButton.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`fixed ${resolveWhatsappPositionClass(whatsappButton.position)} bg-green-500 hover:bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all z-50 animate-bounce`}
                >
                    <i className="fab fa-whatsapp text-3xl" />
                </a>
            )}
        </>
    );
}
