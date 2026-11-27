// features/service/ui/service-marquee/ServiceMarquee.tsx
//
// Cinta de palabras que se desplaza sola (section_type "marquee"). Cada palabra es un item
// (tipo "word", se usa su title).
//
// Truco de la animación: la lista se pinta DOS veces seguidas y la animación "il-marquee"
// (globals.css) mueve todo -50%. Justo cuando la primera copia sale, la segunda ocupa su
// lugar exacto, así el loop no se nota.

import MarqueeWord from "./MarqueeWord";
import { normalizeItems } from "@/shared/services/site_service/lib/normalizeSectionContent";
import type { SiteSectionDto } from "@/shared/services/site_service/model/siteget.dto";

type Props = {
    section: SiteSectionDto;
};

export default function ServiceMarquee({ section }: Props) {
    const words = normalizeItems(section.items ?? []).filter((item) => item.title);
    if (words.length === 0) return null;

    return (
        <div className="il-scope overflow-hidden border-y border-il-neutro-200 bg-white py-4">
            <div className="flex w-max animate-il-marquee">
                {/* Primera copia: la que leen los lectores de pantalla. */}
                <div className="flex">
                    {words.map((item) => (
                        <MarqueeWord key={item.id_section_item} item={item} withAnchor />
                    ))}
                </div>
                {/* Segunda copia: solo visual, para que el loop no tenga cortes. */}
                <div className="flex" aria-hidden="true">
                    {words.map((item) => (
                        <MarqueeWord key={item.id_section_item} item={item} withAnchor={false} />
                    ))}
                </div>
            </div>
        </div>
    );
}
