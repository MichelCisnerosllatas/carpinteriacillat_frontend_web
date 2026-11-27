// features/testimony/ui/testimony-submit-form/steps/SubmitPreviewStep.tsx
//
// Paso 2 del formulario completo: "así se vería tu testimonio" + Editar / Enviar.
// Usa la misma TestimonialCard que pinta el carrusel real del Home.
"use client";

import { motion } from "framer-motion";
import TestimonialCard from "../../shared/testimonial-card/TestimonialCard";
import type { Testimonial, TestimonySettings } from "../../../model/types";

type Props = {
    preview: Testimonial;
    settings: TestimonySettings;
    isSubmitting: boolean;
    onEdit: () => void;
    onConfirm: () => void;
};

export default function SubmitPreviewStep({ preview, settings, isSubmitting, onEdit, onConfirm }: Props) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
        >
            <p className="text-center text-sm text-gray-500">Así se vería tu testimonio. Un miembro de nuestro equipo lo revisará antes de publicarlo.</p>

            <TestimonialCard item={preview} settings={settings} />

            <div className="flex flex-col gap-3 sm:flex-row">
                <button
                    type="button"
                    onClick={onEdit}
                    disabled={isSubmitting}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <i className="fas fa-pen text-xs" />
                    Editar
                </button>
                <button
                    type="button"
                    onClick={onConfirm}
                    disabled={isSubmitting}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-gold px-5 py-3 text-sm font-semibold text-black shadow-sm transition-all duration-300 hover:bg-brand-gold-dark hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSubmitting ? (
                        <><i className="fas fa-circle-notch animate-spin text-xs" />Enviando...</>
                    ) : (
                        <><i className="fas fa-paper-plane text-xs" />Enviar testimonio</>
                    )}
                </button>
            </div>
        </motion.div>
    );
}
