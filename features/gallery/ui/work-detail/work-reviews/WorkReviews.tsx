// features/gallery/ui/work-detail/work-reviews/WorkReviews.tsx
//
// "Lo que dicen de este trabajo": comentarios de los clientes ligados a este trabajo
// (testimony_web.id_web_work, cargado en el intranet). Estilo "reseñas":
//   - Izquierda (ReviewsSummary): promedio, barras por estrella y botón "Agregar comentario".
//   - Derecha: lista vertical de comentarios (ReviewItem), con "Ver más" si son muchos.
// Es distinto a propósito del carrusel de testimonios del Home.
//
// "Agregar comentario" despliega aquí mismo (no es un modal) el formulario RÁPIDO
// (TestimonyQuickForm), que manda el id_web_work. El comentario queda pendiente hasta que
// el staff lo apruebe en el intranet.
//
// Textos (eyebrow, título, mensaje sin comentarios, "gracias"), cuántos se ven antes de "Ver más"
// y si hay formulario salen de la Apariencia (grupo "reviews"). Anclas data-el="detail-reviews"
// (la sección) y "detail-review-form" (botón, formulario y "gracias").
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReviewsSummary from "./ReviewsSummary";
import ReviewItem from "./ReviewItem";
import { averageRatingLabel, averageRatingValue, commentsLabel, ratingCounts } from "./work-reviews.utils";
import TestimonyQuickForm from "@/features/testimony/ui/testimony-quick-form/TestimonyQuickForm";
import type { SiteWorkDto } from "@/shared/services/site_service/model/siteget.dto";
import Container from "@/shared/ui/container/Container";
import SectionHeading from "@/shared/components/section_heading/SectionHeading";
import { DEFAULT_DETAIL_SETTINGS, type DetailReviewsSettings } from "@/features/gallery/lib/workGallerySettings";

type Props = {
    work: SiteWorkDto;
    // Apariencia del bloque (grupo "reviews"). Con showForm en false no hay botón
    // "Agregar comentario" ni formulario (solo se leen los comentarios).
    settings?: DetailReviewsSettings;
};

const FORM_ID = "work-review-form";

export default function WorkReviews({ work, settings = DEFAULT_DETAIL_SETTINGS.reviews }: Props) {
    const { showForm } = settings;
    // Comentarios visibles antes de "Ver más" (reviews.initial_visible).
    const initialVisible = settings.initialVisible;
    const testimonies = work.testimonies ?? [];
    const total = testimonies.length;

    const [formOpen, setFormOpen] = useState(false);
    const [thanks, setThanks] = useState(false); // se envió un comentario con éxito
    const [showAll, setShowAll] = useState(false);

    const visible = showAll ? testimonies : testimonies.slice(0, initialVisible);
    const hiddenCount = total - visible.length;

    function openForm() {
        setFormOpen(true);
        setThanks(false);
    }

    function handleSent() {
        setFormOpen(false);
        setThanks(true);
    }

    return (
        <section data-el="detail-reviews" className="mb-[clamp(3.5rem,8vw,6rem)] bg-il-neutro-050 py-[clamp(3.5rem,8vw,6rem)]">
            <Container className="flex flex-col gap-8">
                {/* markElements={false}: estos textos son del grupo "reviews", no del Encabezado de la sección. */}
                <SectionHeading subtitle={settings.eyebrow} title={settings.title} align="left" markElements={false} />

                {/* Desktop: resumen (izq.) + lista (der.). Mobile: uno debajo del otro. */}
                <div className="grid items-start gap-8 lg:grid-cols-[minmax(280px,340px)_1fr] lg:gap-14">
                    <ReviewsSummary
                        average={averageRatingValue(work, testimonies)}
                        averageLabel={averageRatingLabel(work, testimonies)}
                        total={total}
                        counts={ratingCounts(testimonies)}
                        formOpen={formOpen}
                        formId={FORM_ID}
                        onAddComment={openForm}
                        showAddButton={showForm}
                    />

                    {/* Columna derecha: "gracias" y formulario (cuando está abierto) ENCIMA de la lista. */}
                    <div className="flex min-w-0 flex-col gap-6">
                        {/* Mensaje después de enviar (role="status": lo anuncia el lector de pantalla). */}
                        {thanks && (
                            <p
                                role="status"
                                data-el="detail-review-form"
                                className="m-0 flex items-center gap-3 rounded-[16px] border border-brand-gold bg-il-amarillo-100 px-5 py-3.5 text-[15px] font-semibold text-il-neutro-900"
                            >
                                <i className="fas fa-check" aria-hidden="true" />
                                {settings.thanksText}
                            </p>
                        )}

                        {/* Formulario rápido desplegable (animación de alto + opacidad). */}
                        <AnimatePresence initial={false}>
                            {showForm && formOpen && (
                                <motion.div
                                    key="form"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                    className="overflow-hidden"
                                    data-el="detail-review-form"
                                >
                                    <TestimonyQuickForm
                                        id={FORM_ID}
                                        idWebWork={work.id_web_work}
                                        onClose={() => setFormOpen(false)}
                                        onSuccess={handleSent}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {total > 0 ? (
                            <>
                                <ul className="m-0 list-none divide-y divide-il-neutro-200 p-0">
                                    {visible.map((testimony) => (
                                        <ReviewItem key={testimony.id_testimony_web} testimony={testimony} />
                                    ))}
                                </ul>

                                {(hiddenCount > 0 || showAll) && total > initialVisible && (
                                    <button
                                        type="button"
                                        onClick={() => setShowAll(!showAll)}
                                        className="il-display inline-flex min-h-11 cursor-pointer items-center gap-2 self-start rounded-full border-[1.5px] border-il-neutro-300 bg-white px-5 text-[15px] font-bold text-il-neutro-900 transition-colors hover:border-brand-gold"
                                    >
                                        {showAll ? "Ver menos" : `Ver ${commentsLabel(hiddenCount)} más`}
                                        <i className={`fas ${showAll ? "fa-chevron-up" : "fa-chevron-down"} text-xs`} aria-hidden="true" />
                                    </button>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-3 rounded-[24px] border border-dashed border-il-neutro-300 px-6 py-12 text-center">
                                <i className="far fa-comment-dots text-3xl text-il-neutro-400" aria-hidden="true" />
                                <p className="m-0 text-base text-il-neutro-600">{settings.emptyText}</p>
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </section>
    );
}
