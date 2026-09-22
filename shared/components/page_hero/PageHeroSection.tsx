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
// title/subtitle van directo a HeroHeader SIN texto inventado de respaldo:
// si section_title/section_description vienen null, HeroHeader ya sabe
// ocultar esa linea (ver widget/heroheader/ui/HeroHeader.tsx). El
// "fallback" de aca es solo para la IMAGEN — un <Image> siempre necesita
// un "src" valido, asi que si la seccion todavia no tiene ninguna imagen
// cargada, se usa el logo como placeholder minimo.

import HeroHeader from "@/widget/heroheader/ui/HeroHeader";
import { normalizeImages } from "@/shared/services/site_service/lib/normalizeSectionContent";
import { resolveImageFit } from "@/shared/services/site_service/lib/resolveImageFit";
import type { SiteSectionDto } from "@/shared/services/site_service/model/siteget.dto";

type ImageFallback = {
    imageSrc?: string;
    imageAlt?: string;
    imageClassName?: string;
    sectionClassName?: string;
};

type Props = {
    section: SiteSectionDto;
    fallback?: ImageFallback;
};

const GENERIC_IMAGE_FALLBACK = {
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
            title={section.section_title}
            subtitle={section.section_description}
            imageSrc={heroImage?.url ?? fallback?.imageSrc ?? GENERIC_IMAGE_FALLBACK.imageSrc}
            imageAlt={heroImage?.alt ?? fallback?.imageAlt ?? GENERIC_IMAGE_FALLBACK.imageAlt}
            imageClassName={imageClassName}
            sectionClassName={fallback?.sectionClassName}
        />
    );
}
