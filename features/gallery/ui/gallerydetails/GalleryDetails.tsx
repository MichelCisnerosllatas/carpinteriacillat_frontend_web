import GalleryDetailsHeader from "@/widget/gallerywidget/gallerydetailswidget/GalleryDetailsHeader";
import GalleryDetailSection1 from "@/widget/gallerywidget/gallerydetailswidget/GalleryDetailSection1";

export default function GalleryDetails(){
    return (
        <main className="pt-40 bg-gray-100">
            <GalleryDetailsHeader />

            <GalleryDetailSection1/>

            {/* Card principal del producto */}
            {/*<div className="container mx-auto px-4 mt-4">*/}
            {/*    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 md:p-8 grid md:grid-cols-2 gap-8">*/}
            {/*        /!* IZQUIERDA: espacio para carrusel de imágenes *!/*/}
            {/*        <div className="bg-gray-100 rounded-2xl flex items-center justify-center relative min-h-[260px]">*/}
            {/*            <span className="text-gray-400 text-sm flex items-center gap-2">*/}
            {/*              <i className="fas fa-camera" />*/}
            {/*              Vista Principal del Mueble*/}
            {/*            </span>*/}

            {/*            /!* Botones anterior / siguiente (luego los conectas a tu carrusel real) *!/*/}
            {/*            <button className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-gray-700 text-white flex items-center justify-center shadow-md">*/}
            {/*                <i className="fas fa-chevron-left text-xs" />*/}
            {/*            </button>*/}
            {/*            <button className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-gray-700 text-white flex items-center justify-center shadow-md">*/}
            {/*                <i className="fas fa-chevron-right text-xs" />*/}
            {/*            </button>*/}

            {/*            /!* Badge “Más vendido” *!/*/}
            {/*            <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-md flex items-center gap-1">*/}
            {/*                <i className="fas fa-fire" />*/}
            {/*                Más vendido*/}
            {/*            </div>*/}
            {/*        </div>*/}

            {/*        /!* DERECHA: info del producto (título, chips, texto, features) *!/*/}
            {/*        <div className="space-y-5">*/}
            {/*            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">*/}
            {/*                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">*/}
            {/*                    En stock*/}
            {/*                </span>*/}

            {/*                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full">*/}
            {/*                    Popular*/}
            {/*                </span>*/}
            {/*            </div>*/}

            {/*            <div className="text-xs tracking-[0.2em] uppercase text-gray-500">*/}
            {/*                Mesas de centro*/}
            {/*            </div>*/}

            {/*            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">*/}
            {/*                Mesa de Centro Escandinava*/}
            {/*            </h1>*/}

            {/*            <div className="flex items-center gap-2 text-sm text-gray-600">*/}
            {/*                <div className="flex items-center text-amber-400">*/}
            {/*                    {Array.from({ length: 5 }).map((_, i) => (*/}
            {/*                        <i key={i} className="fas fa-star text-xs" />*/}
            {/*                    ))}*/}
            {/*                </div>*/}
            {/*                <span className="font-semibold text-gray-800">4.8</span>*/}
            {/*                <span className="text-gray-500">(23 opiniones)</span>*/}
            {/*            </div>*/}

            {/*            <p className="text-gray-700 text-sm md:text-base leading-relaxed">*/}
            {/*                Elegante mesa de centro de diseño escandinavo, perfecta para darle*/}
            {/*                un toque moderno y cálido a tu sala. Fabricada con madera de*/}
            {/*                primera calidad, esta pieza combina funcionalidad y estética,*/}
            {/*                ofreciendo un espacio ideal para tu hogar.*/}
            {/*            </p>*/}

            {/*            /!* Features tipo "cards" pequeños *!/*/}
            {/*            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">*/}
            {/*                <div className="bg-gray-50 rounded-xl p-3 flex items-start gap-3 text-sm">*/}
            {/*                    <span className="text-2xl">🚛</span>*/}
            {/*                    <div>*/}
            {/*                        <p className="font-semibold text-gray-900">Envío incluido</p>*/}
            {/*                        <p className="text-gray-500 text-xs">*/}
            {/*                            A toda la ciudad*/}
            {/*                        </p>*/}
            {/*                    </div>*/}
            {/*                </div>*/}

            {/*                <div className="bg-gray-50 rounded-xl p-3 flex items-start gap-3 text-sm">*/}
            {/*                    <span className="text-2xl">🛠️</span>*/}
            {/*                    <div>*/}
            {/*                        <p className="font-semibold text-gray-900">*/}
            {/*                            Instalación gratis*/}
            {/*                        </p>*/}
            {/*                        <p className="text-gray-500 text-xs">*/}
            {/*                            Por nuestros expertos*/}
            {/*                        </p>*/}
            {/*                    </div>*/}
            {/*                </div>*/}

            {/*                <div className="bg-gray-50 rounded-xl p-3 flex items-start gap-3 text-sm">*/}
            {/*                    <span className="text-2xl">✅</span>*/}
            {/*                    <div>*/}
            {/*                        <p className="font-semibold text-gray-900">*/}
            {/*                            Garantía 1 año*/}
            {/*                        </p>*/}
            {/*                        <p className="text-gray-500 text-xs">*/}
            {/*                            En estructura y acabados*/}
            {/*                        </p>*/}
            {/*                    </div>*/}
            {/*                </div>*/}

            {/*                <div className="bg-gray-50 rounded-xl p-3 flex items-start gap-3 text-sm">*/}
            {/*                    <span className="text-2xl">🎨</span>*/}
            {/*                    <div>*/}
            {/*                        <p className="font-semibold text-gray-900">*/}
            {/*                            Personalizable*/}
            {/*                        </p>*/}
            {/*                        <p className="text-gray-500 text-xs">*/}
            {/*                            Medidas y colores a tu gusto*/}
            {/*                        </p>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            </div>*/}

            {/*            /!* CTA *!/*/}
            {/*            <div className="flex flex-wrap items-center gap-4 pt-2">*/}
            {/*                <button className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-6 py-3 rounded-full flex items-center gap-2 shadow-md">*/}
            {/*                    <i className="fas fa-phone-alt" />*/}
            {/*                    Cotizar este modelo*/}
            {/*                </button>*/}
            {/*                <button className="text-sm font-semibold text-orange-600 hover:text-orange-700">*/}
            {/*                    Ver más modelos de mesas*/}
            {/*                </button>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </main>
    )
}