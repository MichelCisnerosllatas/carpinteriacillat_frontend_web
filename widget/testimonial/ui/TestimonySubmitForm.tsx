"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import TestimonialCard from "./TestimonialCard";
import TestimonialRatingInput from "./TestimonialRatingInput";
import { findTestimonySettingsInSite, getTestimonySettings } from "../lib/getTestimonySettings";
import type { Testimonial } from "../model/types";
import { useSiteStore } from "@/shared/store/site/useSiteStore";
import { useTestimonySubmitStore } from "@/shared/services/testimony_service/store/useTestimonySubmitStore";
import { useGoogleAuthStore, type GoogleUser } from "@/shared/services/auth/store/google-auth.store";
import { loginWithGoogle } from "@/shared/lib/firebase/google/login-with-google";
import { SelectedEmailFieldGoogle } from "@/widget/buttonproveedor/SelectedEmailFieldGoogle";

type Step = "form" | "preview" | "success";

// Vista previa con TestimonialCard/getTestimonySettings (los mismos que pinta el carrusel real)
// para que "así se vería tu testimonio" sea literal, no una aproximación. isDelivered/isVerified
// quedan en `false` a propósito — esos badges los otorga el staff, nunca el propio visitante
// (ver app/Docs/V1/md/public/testimony.md en el backend).
//
// La config (`testimony_settings`) sale del store del sitio (useSiteStore,
// hidratado una sola vez desde app/layout.tsx) en vez de venir como prop
// desde el servidor — así app/testimonials/page.tsx no necesita volver a
// llamar getSite().
export default function TestimonySubmitForm() {
    const site = useSiteStore((s) => s.site);
    const resolvedSettings = getTestimonySettings(findTestimonySettingsInSite(site));

    const [step, setStep] = useState<Step>("form");
    const [rating, setRating] = useState<number | null>(null);
    const [message, setMessage] = useState("");
    const [formError, setFormError] = useState<string | null>(null);
    // Distinto de isSubmitting (llamada al backend): esto cubre el tiempo en que
    // el popup de Google está abierto, antes de llegar siquiera a enviar nada.
    const [isConnecting, setIsConnecting] = useState(false);

    const { submitTestimony, isSubmitting } = useTestimonySubmitStore();
    const user = useGoogleAuthStore((state) => state.user);
    const isLoggedIn = Boolean(user?.email);
    const busy = isConnecting || isSubmitting;

    const preview: Testimonial = {
        id: "preview",
        name: user?.name?.trim() || "Tu nombre",
        role: "Cliente",
        city: undefined,
        email: user?.email ?? undefined,
        rating: rating ?? undefined,
        message: message.trim() || "Tu testimonio aparecerá aquí...",
        isDelivered: false,
        isVerified: false,
    };

    // El proveedor (Google) entrega name/email directo — nunca se piden a mano
    // ni se muestran en la web, solo viajan al backend en el POST.
    const sendTestimony = async (googleUser: Pick<GoogleUser, "name" | "email">) => {
        const success = await submitTestimony({
            name: googleUser.name ?? "",
            role: "",
            city: "",
            email: googleUser.email ?? "",
            rating,
            message,
        });
        if (success) setStep("success");
        return success;
    };

    // Botón único del paso 1:
    // - Si ya hay sesión de Google (de este visitante o de un envío previo en la misma
    //   sesión del navegador): solo pasa a la vista previa; el envío real ocurre ahí
    //   ("Enviar testimonio").
    // - Si NO hay sesión: pide la cuenta de Google y, apenas la obtiene, envía directo —
    //   pedir un segundo click para "confirmar" después del popup de Google sería
    //   redundante, por eso "Selecciona cuenta y enviar" es UNA sola acción.
    const handlePrimaryAction = async () => {
        if (resolvedSettings.showRating && !rating) {
            setFormError("Selecciona una valoración.");
            return;
        }
        if (!message.trim()) {
            setFormError("Cuéntanos tu experiencia.");
            return;
        }
        setFormError(null);

        if (isLoggedIn) {
            setStep("preview");
            return;
        }

        setIsConnecting(true);
        try {
            const googleUser = await loginWithGoogle();
            await sendTestimony(googleUser);
        } catch {
            setFormError("No se pudo conectar con tu cuenta de Google. Intenta nuevamente.");
        } finally {
            setIsConnecting(false);
        }
    };

    const handleConfirmSend = () => sendTestimony(user ?? { name: null, email: null });

    return (
        <div className="mx-auto max-w-xl">
            <AnimatePresence mode="wait">
                {step === "form" && (
                    <motion.form
                        key="form"
                        onSubmit={(event) => {
                            event.preventDefault();
                            handlePrimaryAction();
                        }}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
                    >
                        {resolvedSettings.showRating && (
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                                    Tu valoración<span className="ml-1 text-red-600">*</span>
                                </label>
                                <TestimonialRatingInput value={rating} onChange={setRating} />
                            </div>
                        )}

                        <div>
                            <label htmlFor="t-message" className="mb-1.5 block text-xs font-semibold text-gray-700">
                                Cuéntanos tu experiencia<span className="ml-1 text-red-600">*</span>
                            </label>
                            <textarea
                                id="t-message" rows={5} required maxLength={2000} value={message} onChange={(e) => setMessage(e.target.value)}
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
                )}

                {step === "preview" && (
                    <motion.div
                        key="preview"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-5"
                    >
                        <p className="text-center text-sm text-gray-500">Así se vería tu testimonio. Un miembro de nuestro equipo lo revisará antes de publicarlo.</p>

                        <TestimonialCard item={preview} settings={resolvedSettings} />

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <button
                                type="button"
                                onClick={() => setStep("form")}
                                disabled={isSubmitting}
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <i className="fas fa-pen text-xs" />
                                Editar
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmSend}
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
                )}

                {step === "success" && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm"
                    >
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
                            <i className="fas fa-check" />
                        </span>
                        <h2 className="text-lg font-bold text-gray-900">¡Gracias por tu testimonio!</h2>
                        <p className="max-w-sm text-sm text-gray-500">
                            Lo revisaremos y, una vez aprobado, se publicará en nuestro sitio junto a los demás testimonios de clientes.
                        </p>
                        <Link
                            href="/"
                            className="mt-2 inline-flex items-center gap-2 rounded-full bg-brand-gold px-5 py-2.5 text-sm font-semibold text-black shadow-sm transition-all duration-300 hover:bg-brand-gold-dark hover:shadow-md"
                        >
                            Volver al inicio
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
