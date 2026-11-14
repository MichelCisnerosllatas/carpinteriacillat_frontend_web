import WorkDetail from "@/features/gallery/ui/work-detail/WorkDetail";
import { getSite } from "@/shared/services/site_service/lib/getSite";
import { getWorkTitle } from "@/shared/services/site_service/lib/workPhotos";
import { getWorkDetailContext } from "@/features/gallery/lib/getWorkDetailContext";
import { notFound } from "next/navigation";

import type { Metadata } from "next";
import type { SiteDataDto, SiteWorkDto } from "@/shared/services/site_service/model/siteget.dto";

type GalleryDetailsPageProps = {
    params: Promise<{ id: string }>;
    // ?foto=2 -> abre el detalle mostrando esa foto (lo usan las miniaturas de la galería).
    searchParams: Promise<{ foto?: string }>;
};

// Server Component: usa el mismo getSite() que app/layout.tsx (Next lo dedupea dentro del
// mismo render, no es otra petición). Busca el trabajo en site.works por id_web_work
// (la URL es /gallery/<id_web_work>).
// Antes buscaba una imagen de la sección "gallery_grid"; desde el rediseño el detalle es de un
// TRABAJO del portafolio (web_works) con varias fotos, ficha técnica y comentarios.
// Lo demás que necesita el detalle (Apariencia de la sección "work_gallery" de /gallery, lista
// de trabajos, enlace de contacto) lo arma getWorkDetailContext(), igual que la vista previa.
async function findWork(id: string): Promise<{ site: SiteDataDto | null; work: SiteWorkDto | undefined }> {
    const site = await getSite();
    const work = site?.works?.find((w) => String(w.id_web_work) === id);
    return { site, work };
}

export default async function GalleryDetailsPage({ params, searchParams }: GalleryDetailsPageProps) {
    const { id } = await params;
    const { foto } = await searchParams;
    const { site, work } = await findWork(id);

    if (!work) {
        notFound();
    }

    const { works, settings, contactHref } = getWorkDetailContext(site, work);

    // key: al pasar de un trabajo a otro (Siguiente trabajo, relacionados) Next reutiliza el
    // mismo componente; con una key distinta por trabajo, su estado (foto elegida, modo)
    // vuelve a empezar de cero.
    return (
        <WorkDetail
            key={work.id_web_work}
            work={work}
            works={works}
            initialPhoto={Number(foto) || 0}
            settings={settings}
            contactHref={contactHref}
        />
    );
}

export async function generateMetadata({ params }: GalleryDetailsPageProps): Promise<Metadata> {
    const { id } = await params;
    const { work } = await findWork(id);

    return {
        title: work ? `CILLAT | ${getWorkTitle(work)}` : "Detalle Galería",
    };
}
