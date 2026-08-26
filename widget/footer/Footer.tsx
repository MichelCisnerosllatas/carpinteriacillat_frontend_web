// widget/footer/Footer.tsx
"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useNavigationStore } from "@/shared/services/navigation_service/store/useNavigationStore";
import { NAVIGATION_FALLBACK_LINKS, type NavLink } from "@/shared/services/navigation_service/lib/navigation.fallback";
import type { NavigationApiItem } from "@/shared/services/navigation_service/model/navigationget.dto";
import Container from "@/shared/ui/container/Container";

type FooterProps = {
    // Navegacion ya resuelta por el servidor (ver app/layout.tsx), pasada
    // desde app/layout.tsx. Mismo mecanismo que usa Header/Navbar.
    initialNavigations: NavigationApiItem[] | null;
};

// "Contacto" no es parte de la navegacion que devuelve la API (en el
// header es un boton aparte, no un link mas). Acá el footer SI lo agrega
// como un link mas, asi que se define aparte de NAVIGATION_FALLBACK_LINKS.
// El href es "/#contacto" (con barra al inicio) y no solo "#contacto":
// la seccion de contacto solo existe en la pagina de inicio ("/"), asi que
// si el usuario esta en otra pagina (ej. "/services"), "/#contacto" primero
// lo lleva al inicio y despues salta a esa seccion. Con solo "#contacto"
// el link no hace nada si no estas ya en el inicio.
const FOOTER_CONTACT_LINK: NavLink = { href: "/#contacto", label: "Contacto" };

export default function Footer({ initialNavigations }: FooterProps) {
    const { navigations, fetchNavigations, hasLoaded } = useNavigationStore();

    // Misma logica de prioridad que usa Navbar.tsx: primero el store (fetch
    // del navegador), despues lo que ya trajo el servidor, y recien al
    // final el fallback fijo — y solo una vez que ya se termino de intentar
    // (hasLoaded). Antes el footer mostraba el fallback de entrada, sin
    // esperar nada, por eso se notaba distinto al header.
    const resolvedNavigations = navigations.length > 0 ? navigations : (initialNavigations ?? []);
    const quickLinks: NavLink[] = resolvedNavigations.length > 0
        ? [...resolvedNavigations.map((item) => ({ href: item.navigation_url, label: item.navigation_name })), FOOTER_CONTACT_LINK]
        : hasLoaded ? [...NAVIGATION_FALLBACK_LINKS, FOOTER_CONTACT_LINK] : [];

    useEffect(() => {
        // Respaldo/actualizacion en segundo plano (ver comentario igual en
        // Navbar.tsx) — el primer render ya no depende de esto.
        fetchNavigations();
    }, [fetchNavigations]);

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
                                    <a href="#servicios" className="text-gray-400 hover:text-amber-400 transition-colors">
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

            {/* Botón WhatsApp flotante */}
            <a
                href="https://wa.me/51999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all z-50 animate-bounce"
            >
                <i className="fab fa-whatsapp text-3xl" />
            </a>
        </>
    );
}
