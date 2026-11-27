// features/gallery/ui/work-detail/work-reviews/ReviewsSummary.tsx
//
// Columna izquierda de los comentarios: promedio grande, barras de cuántos comentarios hay
// de cada estrella y el botón "Agregar comentario". En desktop queda fija (sticky) mientras
// se recorre la lista de la derecha.
import { commentsLabel, starsText } from "./work-reviews.utils";

type Props = {
    average: number; // 0 = todavía sin calificaciones
    averageLabel: string | null; // "4,7"
    total: number;
    counts: Record<number, number>;
    formOpen: boolean;
    formId: string;
    onAddComment: () => void;
    // false = el intranet apagó el formulario «Agregar comentario» (reviews.show_form; no se pinta el botón).
    showAddButton?: boolean;
};

export default function ReviewsSummary({ average, averageLabel, total, counts, formOpen, formId, onAddComment, showAddButton = true }: Props) {
    return (
        <aside className="flex flex-col gap-6 rounded-[24px] border border-il-neutro-200 bg-white p-6 lg:sticky lg:top-[calc(var(--app-header-height,0px)+24px)]">
            {averageLabel ? (
                <div className="flex items-end gap-4">
                    <span className="il-display text-[56px] font-extrabold leading-none tracking-[-0.04em]">{averageLabel}</span>
                    <div className="flex flex-col gap-1 pb-1">
                        <span
                            role="img"
                            aria-label={`${averageLabel} de 5 estrellas`}
                            className="text-lg leading-none tracking-[2px] text-brand-gold"
                        >
                            {starsText(average)}
                        </span>
                        <span className="text-sm text-il-neutro-600">{commentsLabel(total)}</span>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-1">
                    <span className="il-display text-xl font-extrabold">Sin calificaciones aún</span>
                    <span className="text-sm text-il-neutro-600">Este trabajo todavía no tiene comentarios.</span>
                </div>
            )}

            {/* Barras 5★ a 1★: el ancho es el % de comentarios con esa calificación. */}
            {total > 0 && (
                <ul className="m-0 flex list-none flex-col gap-2 p-0">
                    {[5, 4, 3, 2, 1].map((star) => {
                        const count = counts[star] ?? 0;
                        const percent = total > 0 ? Math.round((count / total) * 100) : 0;
                        return (
                            <li
                                key={star}
                                aria-label={`${star} estrellas: ${commentsLabel(count)}`}
                                className="flex items-center gap-3 text-sm text-il-neutro-600"
                            >
                                <span aria-hidden="true" className="w-7 flex-none whitespace-nowrap">
                                    {star} <span className="text-brand-gold">★</span>
                                </span>
                                <span aria-hidden="true" className="h-2 flex-1 overflow-hidden rounded-full bg-il-neutro-100">
                                    <span className="block h-full rounded-full bg-brand-gold" style={{ width: `${percent}%` }} />
                                </span>
                                <span aria-hidden="true" className="w-5 flex-none text-right tabular-nums">
                                    {count}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            )}

            {showAddButton && (
                <button
                    type="button"
                    data-el="detail-review-form"
                    onClick={onAddComment}
                    disabled={formOpen}
                    aria-expanded={formOpen}
                    aria-controls={formId}
                    className="il-display inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded-full border-0 bg-brand-gold px-5 text-[15px] font-bold text-black transition-colors hover:bg-brand-gold-dark disabled:cursor-default disabled:opacity-60"
                >
                    <i className="fas fa-pen text-xs" aria-hidden="true" />
                    {total > 0 ? "Agregar comentario" : "Sé el primero en comentar"}
                </button>
            )}
        </aside>
    );
}
