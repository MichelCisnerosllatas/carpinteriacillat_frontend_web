import WorkDetail from "@/features/gallery/ui/work-detail/WorkDetail";
import { getSite } from "@/shared/services/site_service/lib/getSite";
import { getWorkTitle } from "@/shared/services/site_service/lib/workPhotos";
import { notFound } from "next/navigation";

import type { Metadata } from "next";
import type { SiteWorkDto } from "@/shared/services/site_service/model/siteget.dto";

type GalleryDetailsPageProps = {
    params: Promise<{ id: string }>;
    // ?foto=2 -> abre el detalle mostrando esa foto (lo usan las miniaturas de la galería).
    searchParams: Promise<{ foto?: string }>;
};

// Server Component: usa el mismo getSite() que app/layout.tsx (Next lo dedupea dentro del
// mismo render, no es otra petición). Busca el trabajo en site.works por id_furniture.
// Antes buscaba una imagen de la sección "gallery_grid"; desde el rediseño el detalle es de un
// TRABAJO (mueble) con varias fotos, ficha técnica y comentarios.
async function findWork(id: string): Promise<{ work: SiteWorkDto | undefined; works: SiteWorkDto[] }> {
    const site = await getSite();
    const works = site?.works ?? [];
    const work = works.find((w) => String(w.id_furniture) === id);
    return { work, works };
}

export default async function GalleryDetailsPage({ params, searchParams }: GalleryDetailsPageProps) {
    const { id } = await params;
    const { foto } = await searchParams;
    const { work, works } = await findWork(id);

    if (!work) {
        notFound();
    }

    // key: al pasar de un trabajo a otro (Siguiente trabajo, relacionados) Next reutiliza el
    // mismo componente; con una key distinta por trabajo, su estado (foto elegida, modo)
    // vuelve a empezar de cero.
    return <WorkDetail key={work.id_furniture} work={work} works={works} initialPhoto={Number(foto) || 0} />;
}

export async function generateMetadata({ params }: GalleryDetailsPageProps): Promise<Metadata> {
    const { id } = await params;
    const { work } = await findWork(id);

    return {
        title: work ? `CILLAT | ${getWorkTitle(work)}` : "Detalle Galería",
    };
}
