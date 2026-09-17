// widget/footer/Footer.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { NAVIGATION_FALLBACK_LINKS, type NavLink } from "@/shared/services/site_service/lib/site.fallback";
import type { FloatingWhatsappButton } from "@/shared/services/site_service/lib/findFloatingWhatsapp";
import type { SiteNavigationDto } from "@/shared/services/site_service/model/siteget.dto";
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
};

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

export default function Footer({ initialNavigations, whatsappButton }: FooterProps) {
    // Misma logica de prioridad que usa Navbar.tsx: lo que trajo el
    // servidor (getSite()) y, si vino null/vacio, el fallback fijo.
    const resolvedNavigations = initialNavigations ?? [];
    const quickLinks: NavLink[] = resolvedNavigations.length > 0
        ? [...resolvedNavigations.map((item) => ({ href: item.navigation_url, label: item.navigation_name })), FOOTER_CONTACT_LINK]
        : [...NAVIGATION_FALLBACK_LINKS, FOOTER_CONTACT_LINK];

    return (
        <>
            <footer className="bg-gray-900 text-white py-12">
                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        {/* Col 1 - Marca + redes */}
                        <div className="space-y-4">
                            {/* Logo clickeable al home (#inicio) */}
                            <Link href="/" className="block w-fit">
                                <Image
                                    src="/img/logocillat_sinfondoblanco.png"
                                    alt="CILLAT - Fabricación de Muebles"
                                    width={190}         // ajusta si quieres más grande
                                    height={190}         // relación aproximada horizontal
                                    className="h-auto w-auto"
                                    priority
                                />
                            </Link>

                            <p className="text-gray-400 text-sm md:text-base">
                                Servicios Generales y Fabricación de Muebles de Alta Calidad
                            </p>

                            <div className="flex gap-3">
                                <a
                                    href="#"
                                    className="bg-gray-800 hover:bg-red-600 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                                >
                                    <i className="fab fa-facebook-f" />
                                </a>
                                <a
                                    href="#"
                                    className="bg-gray-800 hover:bg-red-600 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                                >
                                    <i className="fab fa-instagram" />
                                </a>
                                <a
                                    href="#"
                                    className="bg-gray-800 hover:bg-red-600 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                                >
                                    <i className="fab fa-whatsapp" />
                                </a>
                            </div>
                        </div>



                        {/* Col 2 - Enlaces rápidos */}
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

                        {/* Col 3 - Servicios */}
                        <div>
                            <h4 className="text-lg font-bold mb-4">Servicios</h4>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="#servicios"
                                        className="text-gray-400 hover:text-amber-400 transition-colors"
                                    >
                                        Cocinas Integrales
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#servicios"
                                        className="text-gray-400 hover:text-amber-400 transition-colors"
                                    >
                                        Closets &amp; Dormitorios
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#servicios"
                                        className="text-gray-400 hover:text-amber-400 transition-colors"
                                    >
                                        Muebles de Oficina
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#servicios"
                                        className="text-gray-400 hover:text-amber-400 transition-colors"
                                    >
                                        Puertas &amp; Ventanas
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#servicios"
                                        className="text-gray-400 hover:text-amber-400 transition-colors"
                                    >
                                        Restauración
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Col 4 - Newsletter */}
                        <div>
                            <h4 className="text-lg font-bold mb-4">Accesos</h4>
                            <ul className="space-y-2">
                                <li>
                                    <a href="https://intranet-dev.carpinteriacillat.yacudev.com/" target="blank" className="text-gray-400 hover:text-amber-400 transition-colors">
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
                    </div>

                    {/* Línea final */}
                    <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
                        <p>
                            &copy; 2024 CILLAT - Todos los derechos reservados | Diseñado con{" "}
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
