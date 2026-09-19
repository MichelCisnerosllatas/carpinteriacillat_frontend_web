"use client";

import { FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import TestimonialCard from "./TestimonialCard";
import TestimonialRatingInput from "./TestimonialRatingInput";
import { getTestimonySettings } from "../lib/getTestimonySettings";
import type { Testimonial } from "../model/types";
import type { SiteTestimonySettingsDto } from "@/shared/services/site_service/model/siteget.dto";
import { useTestimonySubmitStore } from "@/shared/services/testimony_service/store/useTestimonySubmitStore";
import { SelectedEmailFieldGoogle } from "@/widget/buttonproveedor/SelectedEmailFieldGoogle";
import { useGoogleAuthStore } from "@/shared/services/auth/store/google-auth.store";
import { loginWithGoogle } from "@/shared/lib/firebase/google/login-with-google";

type Step = "form" | "preview" | "success";

type TestimonySubmitFormProps = {
    // Misma config que ya usa el carrusel real (`GET /v1/public/site`) — oculta los campos que
    // el admin desactivó desde `/testimony/settings` (ver TestimonyWebSettingForm en el
    // intranet). `null` = todavía no se guardó nada, se usan los defaults de
    // `getTestimonySettings` (todo visible salvo el correo, que de cualquier forma es
    // SIEMPRE obligatorio acá — ver más abajo).
    settings: SiteTestimonySettingsDto | null;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Vista previa con TestimonialCard/getTestimonySettings (los mismos que pinta el carrusel real)
// para que "así se vería tu testimonio" sea literal, no una aproximación. isDelivered/isVerified
// quedan en `false` a propósito — esos badges los otorga el staff, nunca el propio visitante
// (ver app/Docs/V1/md/public/testimony.md en el backend).
export default function TestimonySubmitForm({ settings }: TestimonySubmitFormProps) {
    const resolvedSettings = getTestimonySettings(settings);

    const [step, setStep] = useState<Step>("form");
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [city, setCity] = useState("");
    const [email, setEmail] = useState("");
    const [rating, setRating] = useState<number | null>(null);
    const [message, setMessage] = useState("");
    const [formError, setFormError] = useState<string | null>(null);

    const { submitTestimony, isSubmitting } = useTestimonySubmitStore();
    const user = useGoogleAuthStore((state) => state.user)

    // El correo ya no se escribe a mano: viene del proveedor de Google (ver
    // SelectedEmailFieldGoogle más abajo) — es la clave que el backend usa para actualizar el
    // testimonio de este mismo visitante en reenvíos en vez de duplicarlo, así que SIEMPRE es
    // obligatorio, sin importar `settings.showEmail` (esa config solo decide si el correo se
    // MUESTRA en la tarjeta pública, no si se pide acá).
    useEffect(() => {
        setName(user?.name ?? '')
        setEmail(user?.email ?? '')
    }, [user?.uid])

    const preview: Testimonial = {
        id: "preview",
        name: name.trim() || "Tu nombre",
        role: role.trim() || "Cliente",
        city: city.trim() || undefined,
        email: email.trim() || undefined,
        rating: rating ?? undefined,
        message: message.trim() || "Tu testimonio aparecerá aquí...",
        isDelivered: false,
        isVerified: false,
    };

    const handleContinue = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!name.trim()) return setFormError("Cuéntanos tu nombre.");
        if (!email.trim()) return setFormError("Selecciona tu correo de Google para continuar.");
        if (!EMAIL_RE.test(email.trim())) return setFormError("El correo no tiene un formato válido.");
        if (!message.trim()) return setFormError("Cuéntanos tu experiencia.");

        setFormError(null);
        setStep("preview");
    };

    const handleConfirmSend = async () => {
        const success = await submitTestimony({ name, role, city, email, rating, message });
        if (success) setStep("success");
    };

    return (
        <div className="mx-auto max-w-xl">
            <AnimatePresence mode="wait">
                {step === "form" && (
                    <motion.form
                        key="form"
                        onSubmit={handleContinue}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
                    >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label htmlFor="t-name" className="mb-1.5 block text-xs font-semibold text-gray-700">
                                    Nombre completo<span className="ml-1 text-red-600">*</span>
                                </label>
                                <input
                                    id="t-name" type="text" required value={name} onChange={(e) => setName(e.target.value)}
                                    placeholder="Ej. María Gómez"
                                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20"
                                />
                            </div>

                            <div>
                                <label htmlFor="t-role" className="mb-1.5 block text-xs font-semibold text-gray-700">Rol / ocupación</label>
                                <input
                                    id="t-role" type="text" value={role} onChange={(e) => setRole(e.target.value)}
                                    placeholder="Ej. Cliente"
                                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20"
                                />
                            </div>

                            {resolvedSettings.showCity && (
                                <div>
                                    <label htmlFor="t-city" className="mb-1.5 block text-xs font-semibold text-gray-700">Ciudad</label>
                                    <input
                                        id="t-city" type="text" value={city} onChange={(e) => setCity(e.target.value)}
                                        placeholder="Ej. Lima"
                                        className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20"
                                    />
                                </div>
                            )}


                            <div>
                                {/* <label htmlFor="t-email" className="mb-1.5 block text-xs font-semibold text-gray-700">Correo (opcional)</label> */}
                                <label htmlFor="t-name" className="mb-1.5 block text-xs font-semibold text-gray-700">
                                    Correo Electronico<span className="ml-1 text-red-600">*</span>
                                </label>

                                <input
                                    type="hidden"
                                    name="email"
                                    value={user?.email ?? ''}
                                />

                                <SelectedEmailFieldGoogle
                                    name="email"
                                    value={user?.email ?? ''}
                                    imageUrl={user?.photoUrl}
                                    onClick={loginWithGoogle}
                                    required
                                    // onClick={() => {
                                    //     console.log('Cambiar cuenta')
                                    // }}
                                />

                                {/* <input
                                    id="t-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                    placeholder="ejemplo@correo.com"
                                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20"
                                /> */}
                            </div>
                        </div>

                        {resolvedSettings.showRating && (
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-gray-700">Tu valoración</label>
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
                                className="w-full resize-none rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm leading-6 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20"
                            />
                        </div>

                        {formError && <p className="text-sm font-medium text-red-600">{formError}</p>}

                        <button
                            type="submit"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-red-700 hover:shadow-md"
                        >
                            Ver vista previa
                            <i className="fas fa-arrow-right text-xs" />
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
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-red-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
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
                            className="mt-2 inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-red-700 hover:shadow-md"
                        >
                            Volver al inicio
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
