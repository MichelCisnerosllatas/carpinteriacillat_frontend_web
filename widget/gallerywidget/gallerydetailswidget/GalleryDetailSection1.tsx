import Image from "next/image";
import Link from "next/link";
import { GALLERY_CATEGORIES, type GalleryItem } from "@/features/gallery/data/galleryItems";
import Container from "@/shared/ui/container/Container";

type GalleryDetailSection1Props = {
    item: GalleryItem;
};

export default function GalleryDetailSection1({ item }: GalleryDetailSection1Props){
    return(
        <Container as="section">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 md:p-8 grid md:grid-cols-2 gap-8">
                {/* IZQUIERDA: imagen principal del mueble */}
                <div className="bg-gray-100 rounded-2xl relative min-h-[260px] overflow-hidden">
                    <Image
                        src={item.url}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                    />

                    {/* Badge “Más vendido” */}
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-md flex items-center gap-1">
                        <i className="fas fa-fire" />
                        Más vendido
                    </div>
                </div>

                {/* DERECHA: info del producto (título, chips, texto, features) */}
                <div className="space-y-5">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                                En stock
                            </span>

                        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                                Popular
                            </span>
                    </div>

                    <div className="text-xs tracking-[0.2em] uppercase text-gray-500">
                        {GALLERY_CATEGORIES[item.category] ?? item.category}
                    </div>

                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                        {item.title}
                    </h1>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="flex items-center text-amber-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <i key={i} className="fas fa-star text-xs" />
                            ))}
                        </div>
                        <span className="font-semibold text-gray-800">{item.rating}</span>
                        <span className="text-gray-500">({item.reviews} opiniones)</span>
                    </div>

                    <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                        {item.description}
                    </p>

                    {/* Features tipo "cards" pequeños */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                        <div className="bg-gray-50 rounded-xl p-3 flex items-start gap-3 text-sm">
                            <span className="text-2xl">🚛</span>
                            <div>
                                <p className="font-semibold text-gray-900">Envío incluido</p>
                                <p className="text-gray-500 text-xs">
                                    A toda la ciudad
                                </p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-3 flex items-start gap-3 text-sm">
                            <span className="text-2xl">🛠️</span>
                            <div>
                                <p className="font-semibold text-gray-900">
                                    Instalación gratis
                                </p>
                                <p className="text-gray-500 text-xs">
                                    Por nuestros expertos
                                </p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-3 flex items-start gap-3 text-sm">
                            <span className="text-2xl">✅</span>
                            <div>
                                <p className="font-semibold text-gray-900">
                                    Garantía 1 año
                                </p>
                                <p className="text-gray-500 text-xs">
                                    En estructura y acabados
                                </p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-3 flex items-start gap-3 text-sm">
                            <span className="text-2xl">🎨</span>
                            <div>
                                <p className="font-semibold text-gray-900">
                                    Personalizable
                                </p>
                                <p className="text-gray-500 text-xs">
                                    Medidas y colores a tu gusto
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="flex flex-wrap items-center gap-4 pt-2">
                        <Link
                            href="/#contacto"
                            className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-6 py-3 rounded-full flex items-center gap-2 shadow-md"
                        >
                            <i className="fas fa-phone-alt" />
                            Cotizar este modelo
                        </Link>
                        <Link
                            href="/gallery"
                            className="text-sm font-semibold text-orange-600 hover:text-orange-700"
                        >
                            Ver más modelos
                        </Link>
                    </div>
                </div>
            </div>
        </Container>
    );
}
