// features/testimony/ui/testimony-quick-form/TestimonyQuickForm.tsx
//
// DISEÑO 2: formulario RÁPIDO de comentarios para el detalle de un trabajo (/gallery/[id]).
// Pensado para calificar y enviar al toque: estrellas + comentario corto + enviar, todo
// en una fila en desktop (en mobile se apila). Sin vista previa ni pantalla de éxito:
// avisa con onSuccess y quien lo usa (WorkReviews) muestra el "gracias".
//
// El formulario completo (Home / /testimonials) sigue siendo TestimonySubmitForm.
// El estado vive en useTestimonyQuickStore (store propio de este formulario).
"use client";

import { useEffect } from "react";
import QuickFormAccountButton from "./QuickFormAccountButton";
import TestimonialRatingInput from "../shared/TestimonialRatingInput";
import { useTestimonyQuickStore } from "../../store/useTestimonyQuickStore";
import { useGoogleAuthStore } from "@/features/google-auth/store/google-auth.store";

type Props = {
    id?: string;
    // Trabajo de la galería (id_web_work) al que queda ligado el comentario.
    idWebWork: number;
    onClose: () => void;
    onSuccess: () => void;
};

export default function TestimonyQuickForm({ id, idWebWork, onClose, onSuccess }: Props) {
    const { rating, message, formError, isConnecting, isSubmitting, setRating, setMessage, submit, reset } =
        useTestimonyQuickStore();
    const user = useGoogleAuthStore((state) => state.user);
    const isLoggedIn = Boolean(user?.email);
    const busy = isConnecting || isSubmitting;

    // Al salir del detalle (o cambiar de trabajo) el store queda limpio para el próximo.
    useEffect(() => {
        return () => reset();
    }, [reset]);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        const success = await submit(idWebWork);
        if (success) onSuccess();
    }

    function handleClose() {
        reset();
        onClose();
    }

    return (
        <form
            id={id}
            onSubmit={handleSubmit}
            className="@container mx-auto w-full max-w-4xl rounded-[20px] border border-il-neutro-200 bg-white p-3 sm:p-4"
        >
            {/* Depende del ANCHO DEL FORMULARIO (@container), no de la pantalla:
                Angosto (< 672px): [estrellas ........ X] / [comentario] / [cuenta + enviar]
                Ancho (@2xl):      [estrellas] [comentario ........] [cuenta + enviar] [X] */}
            <div className="flex flex-wrap items-center gap-3 @2xl:flex-nowrap">
                <div className="order-1 flex-1 @2xl:flex-none @2xl:pl-1">
                    <TestimonialRatingInput value={rating} onChange={setRating} compact />
                </div>

                <button
                    type="button"
                    onClick={handleClose}
                    aria-label="Cerrar formulario"
                    className="order-2 inline-flex size-9 flex-none cursor-pointer items-center justify-center rounded-full text-il-neutro-600 transition-colors hover:bg-il-neutro-100 hover:text-il-neutro-900 @2xl:order-5"
                >
                    <i className="fas fa-xmark" aria-hidden="true" />
                </button>

                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={500}
                    aria-label="Tu comentario"
                    placeholder="¿Qué le pareció este trabajo?"
                    className="order-3 h-11 min-w-0 basis-full rounded-full border border-il-neutro-300 bg-white px-4 text-[15px] text-il-neutro-900 outline-none transition-all placeholder:text-il-neutro-400 focus:border-il-amarillo-500 focus:ring-2 focus:ring-il-amarillo-500/25 @2xl:basis-auto @2xl:flex-1"
                />

                <div className="order-4 flex basis-full items-center gap-2 @2xl:basis-auto">
                    {/* Cuenta de Google ya elegida: click para cambiarla. */}
                    {user && isLoggedIn && <QuickFormAccountButton user={user} disabled={busy} />}

                    <button
                        type="submit"
                        disabled={busy}
                        className="il-display inline-flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full bg-brand-gold text-black hover:bg-brand-gold-dark px-5 text-[15px] font-bold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60 @2xl:flex-none"
                    >
                        {busy ? (
                            <>
                                <i className="fas fa-circle-notch animate-spin text-xs" aria-hidden="true" />
                                {isConnecting ? "Conectando..." : "Enviando..."}
                            </>
                        ) : isLoggedIn ? (
                            <>
                                <i className="fas fa-paper-plane text-xs" aria-hidden="true" />
                                Enviar
                            </>
                        ) : (
                            <>
                                <i className="fa-brands fa-google text-xs" aria-hidden="true" />
                                Enviar con Google
                            </>
                        )}
                    </button>
                </div>
            </div>

            {formError && (
                <p role="alert" className="m-0 mt-2 px-1 text-sm font-medium text-red-600">
                    {formError}
                </p>
            )}
        </form>
    );
}
