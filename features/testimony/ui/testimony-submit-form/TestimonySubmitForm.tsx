// features/testimony/ui/testimony-submit-form/TestimonySubmitForm.tsx
//
// DISEÑO 1: formulario completo de testimonios (página /testimonials).
// Este archivo tiene el estado y la lógica; lo visual de cada paso está en steps/:
//   SubmitFormStep (1. escribir) -> SubmitPreviewStep (2. vista previa) -> SubmitSuccessStep (3. gracias)
"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import SubmitFormStep from "./steps/SubmitFormStep";
import SubmitPreviewStep from "./steps/SubmitPreviewStep";
import SubmitSuccessStep from "./steps/SubmitSuccessStep";
import { findTestimonySettingsInSite, getTestimonySettings } from "../../lib/getTestimonySettings";
import type { Testimonial } from "../../model/types";
import { useSiteStore } from "@/shared/store/site/useSiteStore";
import { useTestimonySubmitStore } from "@/features/testimony/store/useTestimonySubmitStore";
import { useGoogleAuthStore, type GoogleUser } from "@/features/google-auth/store/google-auth.store";
import { loginWithGoogle } from "@/features/google-auth/lib/login-with-google";

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

    // Cada paso es un componente aparte (carpeta steps/); aquí solo se decide cuál se muestra.
    return (
        <div className="mx-auto max-w-xl">
            <AnimatePresence mode="wait">
                {step === "form" && (
                    <SubmitFormStep
                        key="form"
                        showRating={resolvedSettings.showRating}
                        rating={rating}
                        onRatingChange={setRating}
                        message={message}
                        onMessageChange={setMessage}
                        user={user}
                        isLoggedIn={isLoggedIn}
                        busy={busy}
                        isConnecting={isConnecting}
                        formError={formError}
                        onSubmit={handlePrimaryAction}
                    />
                )}

                {step === "preview" && (
                    <SubmitPreviewStep
                        key="preview"
                        preview={preview}
                        settings={resolvedSettings}
                        isSubmitting={isSubmitting}
                        onEdit={() => setStep("form")}
                        onConfirm={handleConfirmSend}
                    />
                )}

                {step === "success" && <SubmitSuccessStep key="success" />}
            </AnimatePresence>
        </div>
    );
}
