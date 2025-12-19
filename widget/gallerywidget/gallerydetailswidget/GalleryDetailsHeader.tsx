// widget/gallery/GalleryDetailsHeader.tsx
import Link from "next/link";

export default function GalleryDetailsHeader() {
    return (
        <section className="pb-4 bg-gray-100">
            {/* pt-28 = deja espacio bajo el header fijo */}
            <div className="container mx-auto px-4">
                <nav
                    aria-label="Breadcrumb"
                    className="text-sm text-gray-500 flex flex-wrap gap-1"
                >
                    <Link href="/" className="hover:text-red-600">
                        Inicio
                    </Link>
                    <span>/</span>
                    <Link href="/muebles" className="hover:text-red-600">
                        Muebles
                    </Link>
                    <span>/</span>
                    <Link href="/muebles/mesas" className="hover:text-red-600">
                        Mesas
                    </Link>
                    <span>/</span>
                    <span className="text-gray-700 font-medium">
                        Mesa de Centro Escandinava
                    </span>
                </nav>
            </div>
        </section>
    );
}
