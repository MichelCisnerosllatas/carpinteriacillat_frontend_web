// features/testimony/ui/testimony-submit-form/steps/SubmitFormStep.tsx
//
// Paso 1 del formulario completo: estrellas + experiencia + cuenta de Google.
// Solo pinta: el estado y la lógica viven en TestimonySubmitForm.
"use client";

import { motion } from "framer-motion";
import TestimonialRatingInput from "../../shared/TestimonialRatingInput";
import type { GoogleUser } from "@/features/google-auth/store/google-auth.store";
import { loginWithGoogle } from "@/features/google-auth/lib/login-with-google";
import { SelectedEmailFieldGoogle } from "@/features/google-auth/ui/shared/SelectedEmailFieldGoogle";

type Props = {
    showRating: boolean;
    rating: number | null;
    onRatingChange: (rating: number) => void;
    message: string;
    onMessageChange: (message: string) => void;
    user: GoogleUser | null;
    isLoggedIn: boolean;
    busy: boolean;
    isConnecting: boolean;
    formError: string | null;
    onSubmit: () => void;
};

export default function SubmitFormStep({
    showRating,
    rating,
    onRatingChange,
    message,
    onMessageChange,
    user,
    isLoggedIn,
    busy,
    isConnecting,
    formError,
    onSubmit,
}: Props) {
    return (
        <motion.form
            onSubmit={(event) => {
                event.preventDefault();
                onSubmit();
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
        >
            {showRating && (
                <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                        Tu valoración<span className="ml-1 text-red-600">*</span>
                    </label>
                    <TestimonialRatingInput value={rating} onChange={onRatingChange} />
                </div>
            )}

            <div>
                <label htmlFor="t-message" className="mb-1.5 block text-xs font-semibold text-gray-700">
                    Cuéntanos tu experiencia<span className="ml-1 text-red-600">*</span>
                </label>
                <textarea
                    id="t-message" rows={5} required maxLength={2000} value={message} onChange={(e) => onMessageChange(e.target.value)}
                    placeholder="¿Cómo fue trabajar con nosotros? ¿Qué destacarías del resultado?"
                    className="w-full resize-none rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm leading-6 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
            </div>

            {isLoggedIn && (
                <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                        Cuenta de Google
                    </label>
                    <SelectedEmailFieldGoogle
                        name="email"
                        value={user?.email ?? ""}
                        imageUrl={user?.photoUrl}
                        onClick={loginWithGoogle}
                    />
                </div>
            )}

            {formError && <p className="text-sm font-medium text-red-600">{formError}</p>}

            <button
                type="submit"
                disabled={busy}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-gold px-5 py-3 text-sm font-semibold text-black shadow-sm transition-all duration-300 hover:bg-brand-gold-dark hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
                {busy ? (
                    <>
                        <i className="fas fa-circle-notch animate-spin text-xs" />
                        {isConnecting ? "Conectando con Google..." : "Enviando..."}
                    </>
                ) : isLoggedIn ? (
                    <>
                        Continuar
                        <i className="fas fa-arrow-right text-xs" />
                    </>
                ) : (
                    <>
                        <i className="fa-brands fa-google text-xs" />
                        Selecciona cuenta y enviar
                    </>
                )}
            </button>
        </motion.form>
    );
}
