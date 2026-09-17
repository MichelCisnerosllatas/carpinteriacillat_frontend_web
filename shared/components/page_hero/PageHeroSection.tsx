// shared/components/page_hero/PageHeroSection.tsx
//
// Header generico (imagen + titulo + subtitulo) para paginas internas.
// El backend usa UN SOLO section_type ("page_hero") para Servicios,
// Nosotros y Galeria por igual — confirmado contra /v1/public/site real,
// cada uno con su propio section_title/section_description/images ya
// cargados. Por eso ya no hace falta un wrapper por pagina (ServiceHeader/
// WeSection1/GallerySection1 se eliminaron): SectionRenderer llama a este
// componente directo para cualquier section_type === "page_hero".
//
// El "fallback" solo se usa si alguna vez esa seccion puntual viene sin
// title/description/imagen (backend recien creado, sin contenido aun).

import HeroHeader from "@/widget/heroheader/ui/HeroHeader";
import { normalizeImages } from "@/shared/services/site_service/lib/normalizeSectionContent";
import { resolveImageFit } from "@/shared/services/site_service/lib/resolveImageFit";
import type { SiteSectionDto } from "@/shared/services/site_service/model/siteget.dto";

type Fallback = {
    title?: string;
    subtitle?: string;
    imageSrc?: string;
    imageAlt?: string;
    imageClassName?: string;
    sectionClassName?: string;
};

type Props = {
    section: SiteSectionDto;
    fallback?: Fallback;
};

const GENERIC_FALLBACK: Required<Pick<Fallback, "title" | "subtitle" | "imageSrc" | "imageAlt">> = {
    title: "Carpintería CILLAT",
    subtitle: "Fabricación de muebles a medida.",
    imageSrc: "/img/logo.png",
    imageAlt: "Carpintería CILLAT",
};

export default function PageHeroSection({ section, fallback }: Props) {
    const images = normalizeImages(section.images);
    const heroImage = images[0];

    // El "fix" de la imagen (object-fit) manda; fallback.imageClassName
    // queda solo para un ajuste de POSICION puntual de una pagina (ej.
    // "object-top"), no para el fit — ambas clases conviven bien juntas.
    const imageClassName = [resolveImageFit(heroImage?.fix), fallback?.imageClassName]
        .filter(Boolean)
        .join(" ");

    return (
        <HeroHeader
            title={section.section_title ?? fallback?.title ?? GENERIC_FALLBACK.title}
            subtitle={section.section_description ?? fallback?.subtitle ?? GENERIC_FALLBACK.subtitle}
            imageSrc={heroImage?.url ?? fallback?.imageSrc ?? GENERIC_FALLBACK.imageSrc}
            imageAlt={heroImage?.alt ?? fallback?.imageAlt ?? GENERIC_FALLBACK.imageAlt}
            imageClassName={imageClassName}
            sectionClassName={fallback?.sectionClassName}
        />
    );
}
