// widget/footer/Footer.tsx
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <>
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        {/* Col 1 - Marca + redes */}
                        <div className="space-y-4">
                            {/* Logo clickeable al home (#inicio) */}
                            <Link href="#inicio" className="block w-fit">
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
                                <li>
                                    <a
                                        href="#inicio"
                                        className="text-gray-400 hover:text-amber-400 transition-colors"
                                    >
                                        Inicio
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#servicios"
                                        className="text-gray-400 hover:text-amber-400 transition-colors"
                                    >
                                        Servicios
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#galeria"
                                        className="text-gray-400 hover:text-amber-400 transition-colors"
                                    >
                                        Galería
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#nosotros"
                                        className="text-gray-400 hover:text-amber-400 transition-colors"
                                    >
                                        Nosotros
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#contacto"
                                        className="text-gray-400 hover:text-amber-400 transition-colors"
                                    >
                                        Contacto
                                    </a>
                                </li>
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
                </div>
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
