// features/gallery/ui/work-detail/work-reviews/ReviewItem.tsx
//
// Un comentario de la lista (sin tarjeta: se separan con una línea, estilo reseñas).
import { formatMonthYear } from "@/features/gallery/lib/formatMonthYear";
import type { SiteWorkTestimonyDto } from "@/shared/services/site_service/model/siteget.dto";
import { starsText } from "./work-reviews.utils";

type Props = {
    testimony: SiteWorkTestimonyDto;
};

export default function ReviewItem({ testimony }: Props) {
    const rating = Number(testimony.rating) || 0;
    const date = formatMonthYear(testimony.date);
    const initial = testimony.name.trim().charAt(0).toUpperCase();

    return (
        <li className="flex gap-4 py-6 first:pt-0 last:pb-0">
            <span
                aria-hidden="true"
                className="il-display inline-flex size-11 flex-none items-center justify-center rounded-full bg-il-amarillo-100 text-base font-extrabold text-il-neutro-900"
            >
                {initial}
            </span>

            <figure className="m-0 flex min-w-0 flex-1 flex-col gap-2">
                {/* Nombre y estrellas en la misma línea; la fecha debajo. */}
                <figcaption className="flex flex-col">
                    <span className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
                        <span className="il-display text-[15px] font-bold text-il-neutro-900">{testimony.name}</span>
                        {rating > 0 && (
                            <span
                                role="img"
                                aria-label={`${Math.round(rating)} de 5 estrellas`}
                                className="whitespace-nowrap text-sm tracking-[1px] text-brand-gold"
                            >
                                {starsText(rating)}
                            </span>
                        )}
                    </span>
                    {date && <span className="text-sm text-il-neutro-600">{date}</span>}
                </figcaption>
                <blockquote className="m-0 text-base leading-[1.65] text-il-neutro-900">{testimony.message}</blockquote>
            </figure>
        </li>
    );
}
