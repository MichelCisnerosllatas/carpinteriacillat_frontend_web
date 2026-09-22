//widget/contacto/ui/ContactForm.tsx
"use client";

import { useEffect, useState, FormEvent} from "react";
import { contactButtonVariantClass } from "../lib/contactButtonVariant";
import type { SiteSectionButtonDto } from "@/shared/services/site_service/model/siteget.dto";
import { useContactMessageStore } from "@/shared/services/contactmessages_service/store/useContactMessageStore";
import { ContactMessageProjectType } from "@/shared/services/contactmessages_service/model/contactmessagespost.dto";
import { useGoogleAuthStore } from "@/shared/services/auth/store/google-auth.store";
import { SelectedEmailFieldGoogle } from "@/widget/buttonproveedor/SelectedEmailFieldGoogle";
import { loginWithGoogle } from "@/shared/lib/firebase/google/login-with-google";
import { notify } from "@/shared/lib/notify";

// TODO(contacto-real): el backend retiro POST /v1/public/contact-messages
// (ver FRONTEND_NEXTJS_SITE_V3.md #31-34) — hoy no existe forma publica de
// guardar el mensaje en Laravel, por eso este formulario sigue mandando
// por mailto: como unico flujo real. Ya existe el service listo para
// cuando el backend lo restaure:
//
//   import { contactMessagesService } from "@/shared/services/contactmessages_service/services/contactmessages.service";
//
//   await contactMessagesService.post({
//     name: data.name,
//     email: data.email,
//     phone: data.phone,
//     project_type: data.projectType as ContactMessageProjectType, // ya alineado, ver model/constants.ts
//     message: data.message,
//   });
//
// Cuando ese endpoint vuelva a existir: reemplazar el bloque de
// buildMailtoUrl/window.location.href de handleSubmit por esta llamada
// (con su try/catch y manejo de 429/errores via el "notify" del proyecto),
// y esta prop ya no necesitaria "recipientEmail" (ver #36).

type ContactFormProps = {
    recipientEmail: string;
    // El botón "Enviar mensaje" es un section_button real (`action_key: "contact-form-submit"`,
    // ver SectionContact.tsx) — administrable desde el intranet (label/icono/variante/estado),
    // pero su submit sigue siendo lógica propia de este componente, no depende de `url`.
    // `null` = el registro todavia no existe en el backend (defensivo, cae al texto por
    // defecto de siempre); `state: false` = el admin lo ocultó a propósito.
    submitButton?: SiteSectionButtonDto | null;
};

export default function ContactForm({
    recipientEmail,
    submitButton,
}: ContactFormProps) {
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    // Distinto de isSubmitting (llamada al backend): cubre el tiempo en que el
    // popup de cuenta de Google está abierto, antes de llegar a enviar nada.
    const [isConnecting, setIsConnecting] = useState(false);

    const submitLabel = submitButton?.label || "Enviar mensaje";
    const submitIcon = submitButton?.icon || "fas fa-paper-plane";
    const showSubmitButton = submitButton?.state !== false;

    const {submitContactMessage, isSubmitting} = useContactMessageStore();
    const user = useGoogleAuthStore((state) => state.user)
    const isLoggedIn = Boolean(user?.email)
    const busy = isConnecting || isSubmitting
    const [name, setName] = useState('');

    useEffect(() => {
        setName(user?.name ?? '')
    }, [user?.uid])

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const form = event.currentTarget
        const formData = new FormData(form)
        const nameValue = String(formData.get('name') ?? '')
        const message = String(formData.get('message') ?? '')

        // El correo sale de la cuenta de Google. Si todavía no hay sesión, el
        // click en "Selecciona cuenta y enviar" primero abre el selector de
        // Google y, apenas devuelve la cuenta, sigue con el envío — sin pedir
        // un segundo click (mismo criterio que TestimonySubmitForm.tsx).
        let email = user?.email ?? ''
        if (!email) {
            setIsConnecting(true)
            try {
                const googleUser = await loginWithGoogle()
                email = googleUser.email ?? ''
            } catch {
                notify.error('No se pudo conectar con tu cuenta de Google. Intenta nuevamente.')
                return
            } finally {
                setIsConnecting(false)
            }
        }

        // El formulario visible ya no pide teléfono ni tipo de proyecto (ver
        // pedido: solo Nombre, Correo y Mensaje) — el backend igual los exige
        // en el DTO, así que van con un valor neutro fijo en vez de un input.
        const success = await submitContactMessage({
            name: nameValue,
            email,
            phone: '',
            projectType: 'otro' as ContactMessageProjectType,
            message,
        })
        if (!success) return

        form.reset()
        setSent(true)

        setTimeout(() => {
            setSent(false)
        }, 3500)
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="
                space-y-5
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-6
                shadow-sm
            "
        >
            {/* =====================================================
                ENCABEZADO
            ===================================================== */}

            <div>
                <h3 className="text-lg font-bold text-gray-900">
                    Envíanos un mensaje
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                    Completa tus datos y cuéntanos brevemente
                    sobre el proyecto que tienes en mente.
                </p>
            </div>


            {/* =====================================================
                CAMPOS PRINCIPALES
            ===================================================== */}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                {/* NOMBRE */}
                <div>
                    <label
                    htmlFor="contact-name"
                    className="
                        mb-1.5
                        block
                        text-xs
                        font-semibold
                        text-gray-700
                    "
                    >
                    Nombre completo
                    <span className="ml-1 text-red-600">*</span>
                    </label>

                    <input
                    id="contact-name"
                    type="text"
                    name="name"
                    required
                    autoComplete="name"
                    placeholder="Ej. Juan Pérez"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="
                        w-full
                        rounded-xl
                        border
                        border-gray-300
                        bg-white
                        px-3.5
                        py-2.5
                        text-sm
                        text-gray-900
                        outline-none
                        transition-all
                        placeholder:text-gray-400
                        focus:border-amber-500
                        focus:bg-white
                        focus:ring-2
                        focus:ring-amber-500/20
                    "
                    />
                </div>


                {/* CORREO / CUENTA GOOGLE */}
                <div>
                    <label
                        className="
                        mb-1.5
                        block
                        text-xs
                        font-semibold
                        text-gray-700
                        "
                    >
                        Correo electrónico
                        <span className="ml-1 text-red-600">*</span>
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
                </div>
            </div>


            {/* =====================================================
                MENSAJE
            ===================================================== */}

            <div>
                <label
                    htmlFor="contact-message"
                    className="
                        mb-1.5
                        block
                        text-xs
                        font-semibold
                        text-gray-700
                    "
                >
                    Cuéntanos sobre tu proyecto
                    <span className="ml-1 text-red-600">
                        *
                    </span>
                </label>

                <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    required
                    placeholder="Describe el ambiente, medidas aproximadas o la idea que tienes en mente..."
                    className="
                        w-full
                        resize-none
                        rounded-xl
                        border
                        border-gray-300
                        bg-white
                        px-3.5
                        py-2.5
                        text-sm
                        leading-6
                        text-gray-900
                        outline-none
                        transition-all
                        placeholder:text-gray-400
                        focus:border-amber-500
                        focus:bg-white
                        focus:ring-2
                        focus:ring-amber-500/20
                    "
                />
            </div>


            {/* =====================================================
                FOOTER
            ===================================================== */}

            <div
                className="
                    flex
                    flex-col
                    gap-3
                    border-t
                    border-gray-100
                    pt-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >
                {/* BOTÓN ENVIAR — administrable desde el intranet (label/icono/variante/
                    estado) via el section_button "contact-form-submit"; oculto solo si el
                    admin lo desactivó a propósito (ver `showSubmitButton` arriba). */}
                {showSubmitButton && (
                    <button
                        type="submit"
                        disabled={busy}
                        className={`
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-full
                            px-5
                            py-2.5
                            text-sm
                            font-semibold
                            shadow-sm
                            transition-all
                            duration-300
                            hover:shadow-md
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                            ${contactButtonVariantClass(submitButton?.variant)}
                        `}
                    >
                        {busy ? (
                            <>
                                <i className="fas fa-circle-notch animate-spin text-xs" />
                                {isConnecting ? "Conectando con Google..." : "Enviando..."}
                            </>
                        ) : isLoggedIn ? (
                            <>
                                <i className={`${submitIcon} text-xs`} />
                                {submitLabel}
                            </>
                        ) : (
                            <>
                                <i className="fa-brands fa-google text-xs" />
                                Selecciona cuenta y enviar
                            </>
                        )}
                    </button>
                )}


                {/* MENSAJE DE ÉXITO */}
                {sent && (
                    <span
                        className="
                            flex
                            items-center
                            gap-1.5
                            text-xs
                            font-medium
                            text-emerald-600
                        "
                    >
                        <i className="fas fa-check-circle" />

                        Mensaje preparado en tu correo
                    </span>
                )}
            </div>
        </form>
    );
}

// function useEffect(arg0: () => void, arg1: (string | undefined)[]) {
//     throw new Error("Function not implemented.");
// }
