// features/service/ui/service-marquee/MarqueeWord.tsx
//
// Una palabra de la cinta de Servicios, seguida de un puntito amarillo.

import { previewAnchorId, PREVIEW_ANCHOR_STYLE } from "@/shared/lib/previewAnchor";
import type { SiteSectionItemDto } from "@/shared/services/site_service/model/siteget.dto";

type Props = {
    item: SiteSectionItemDto;
    // Solo la primera copia lleva el ancla de la vista previa (un id no se puede repetir).
    withAnchor: boolean;
};

export default function MarqueeWord({ item, withAnchor }: Props) {
    return (
        <span
            id={withAnchor ? previewAnchorId("section-item", item.id_section_item) : undefined}
            style={PREVIEW_ANCHOR_STYLE}
            className="il-display inline-flex items-center gap-7 whitespace-nowrap pr-7 text-[clamp(1.05rem,2vw,1.4rem)] font-bold tracking-[-0.02em] text-il-neutro-900"
        >
            {item.title}
            <span aria-hidden="true" className="size-2.5 rounded-full bg-il-amarillo-500" />
        </span>
    );
}
