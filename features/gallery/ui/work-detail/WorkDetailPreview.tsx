// features/gallery/ui/work-detail/WorkDetailPreview.tsx
//
// El detalle de un trabajo DENTRO de la vista previa del intranet (/preview, ver
// shared/store/preview/preview.routes.ts). La página real (app/gallery/[id]/page.tsx) lee el
// sitio en el servidor; aquí se lee del store, que es lo que la vista previa va modificando en
// vivo (ej. la Apariencia de la sección Galería mientras el admin la edita).
//
// - Si el id no existe en site.works, muestra el primer trabajo; sin trabajos, la galería.
// - key con la vista inicial: si el admin cambia viewer.default_view, el visor arranca de nuevo
//   en esa vista (el estado del modo solo se inicializa al montar).
"use client";

import WorkDetail from "./WorkDetail";
import MainGallery from "@/features/gallery/ui/main-gallery/MainGallery";
import { getWorkDetailContext } from "@/features/gallery/lib/getWorkDetailContext";
import { useSiteStore } from "@/shared/store/site/useSiteStore";

type Props = {
    idWebWork: number;
};

export default function WorkDetailPreview({ idWebWork }: Props) {
    const site = useSiteStore((s) => s.site);
    const works = site?.works ?? [];
    const work = works.find((w) => w.id_web_work === idWebWork) ?? works[0];

    if (!site) return null;
    if (!work) return <MainGallery />;

    const { settings, contactHref } = getWorkDetailContext(site, work);

    return (
        <WorkDetail
            key={`${work.id_web_work}-${settings.viewer.defaultView}`}
            work={work}
            works={works}
            initialPhoto={0}
            settings={settings}
            contactHref={contactHref}
        />
    );
}
