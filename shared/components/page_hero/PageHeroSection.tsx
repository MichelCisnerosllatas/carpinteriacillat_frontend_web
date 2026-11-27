// shared/components/page_hero/PageHeroSection.tsx
//
// Header generico (1+ imagenes de fondo + titulo + subtitulo) para
// paginas internas. El backend usa UN SOLO section_type ("page_hero")
// para Servicios, Nosotros y Galeria por igual — confirmado contra
// /v1/public/site real, cada uno con su propio section_title/
// section_description/images ya cargados. Por eso ya no hace falta un
// wrapper por pagina (ServiceHeader/WeSection1/GallerySection1 se
// eliminaron): SectionRenderer llama a este componente directo para
// cualquier section_type === "page_hero".
//
// title/subtitle van directo a HeroHeader SIN texto inventado de respaldo:
// si section_title/section_description vienen null, HeroHeader ya sabe
// ocultar esa linea. Las imagenes van TODAS (no solo la primera): el admin
// del intranet puede subir 1 sola o varias para cualquiera de estos 3
// headers — HeroHeader ya sabe mostrar un carrusel o una imagen fija segun
// cuantas reciba (ver BackgroundCarousel). El "fallback" de aca es solo
// para cuando la seccion todavia no tiene NINGUNA imagen cargada (un
// header siempre necesita algo de fondo).

import HeroHeader from "@/widget/heroheader/ui/HeroHeader";
import { normalizeImages } from "@/shared/services/site_service/lib/normalizeSectionContent";
import { resolveImageFit } from "@/shared/services/site_service/lib/resolveImageFit";
import type { BackgroundCarouselSlide } from "@/shared/components/background_carousel/BackgroundCarousel";
import type { SiteSectionDto } from "@/shared/services/site_service/model/siteget.dto";

type ImageFallback = {
    imageSrc?: string;
    imageAlt?: string;
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
    const apiImages = normalizeImages(section.images).map((image) => ({
        src: image.url,
        alt: image.alt ?? "",
        fit: resolveImageFit(image.fix),
    }));

    // Fallback temporal: un header siempre necesita algo de fondo, aunque
    // la seccion todavia no tenga ninguna imagen cargada en el backend.
    const images: BackgroundCarouselSlide[] = apiImages.length > 0
        ? apiImages
        : [{ src: fallback?.imageSrc ?? GENERIC_IMAGE_FALLBACK.imageSrc, alt: fallback?.imageAlt ?? GENERIC_IMAGE_FALLBACK.imageAlt }];

    return (
        <HeroHeader
            title={section.section_title}
            subtitle={section.section_description}
            images={images}
            sectionClassName={fallback?.sectionClassName}
        />
    );
}
