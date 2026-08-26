//widget/contacto/ui/ContactForm.tsx
"use client";

import { FormEvent, useState } from "react";
import { buildMailtoUrl } from "../lib/buildMailtoUrl";
import { projectTypeOptions } from "../model/constants";

type ContactFormProps = {
    recipientEmail: string;
};

export default function ContactForm({
    recipientEmail,
}: ContactFormProps) {
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);

        const data = {
            name: String(
                formData.get("name") ?? ""
            ),
            email: String(
                formData.get("email") ?? ""
            ),
            phone: String(
                formData.get("phone") ?? ""
            ),
            projectType: String(
                formData.get("projectType") ?? ""
            ),
            message: String(
                formData.get("message") ?? ""
            ),
        };

        const mailtoUrl = buildMailtoUrl({
            to: recipientEmail,
            data,
        });

        setSending(true);

        setTimeout(() => {
            setSending(false);
            setSent(true);

            window.location.href = mailtoUrl;

            form.reset();

            setTimeout(() => {
                setSent(false);
            }, 3500);
        }, 800);
    };

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
                        <span className="ml-1 text-red-600">
                            *
                        </span>
                    </label>

                    <input
                        id="contact-name"
                        type="text"
                        name="name"
                        required
                        autoComplete="name"
                        placeholder="Ej. Juan Pérez"
                        className="
                            w-full
                            rounded-xl
                            border
                            border-gray-300
                            bg-gray-50
                            px-3.5
                            py-2.5
                            text-sm
                            text-gray-900
                            outline-none
                            transition-all
                            placeholder:text-gray-400
                            focus:border-red-500
                            focus:bg-white
                            focus:ring-2
                            focus:ring-red-500/20
                        "
                    />
                </div>


                {/* CORREO */}
                <div>
                    <label
                        htmlFor="contact-email"
                        className="
                            mb-1.5
                            block
                            text-xs
                            font-semibold
                            text-gray-700
                        "
                    >
                        Correo electrónico
                        <span className="ml-1 text-red-600">
                            *
                        </span>
                    </label>

                    <input
                        id="contact-email"
                        type="email"
                        name="email"
                        required
                        autoComplete="email"
                        placeholder="ejemplo@correo.com"
                        className="
                            w-full
                            rounded-xl
                            border
                            border-gray-300
                            bg-gray-50
                            px-3.5
                            py-2.5
                            text-sm
                            text-gray-900
                            outline-none
                            transition-all
                            placeholder:text-gray-400
                            focus:border-red-500
                            focus:bg-white
                            focus:ring-2
                            focus:ring-red-500/20
                        "
                    />
                </div>


                {/* TELÉFONO */}
                <div>
                    <label
                        htmlFor="contact-phone"
                        className="
                            mb-1.5
                            block
                            text-xs
                            font-semibold
                            text-gray-700
                        "
                    >
                        Teléfono / WhatsApp
                    </label>

                    <input
                        id="contact-phone"
                        type="tel"
                        name="phone"
                        autoComplete="tel"
                        placeholder="+51 999 999 999"
                        className="
                            w-full
                            rounded-xl
                            border
                            border-gray-300
                            bg-gray-50
                            px-3.5
                            py-2.5
                            text-sm
                            text-gray-900
                            outline-none
                            transition-all
                            placeholder:text-gray-400
                            focus:border-red-500
                            focus:bg-white
                            focus:ring-2
                            focus:ring-red-500/20
                        "
                    />
                </div>


                {/* TIPO DE PROYECTO */}
                <div>
                    <label
                        htmlFor="contact-project-type"
                        className="
                            mb-1.5
                            block
                            text-xs
                            font-semibold
                            text-gray-700
                        "
                    >
                        Tipo de proyecto
                    </label>

                    <select
                        id="contact-project-type"
                        name="projectType"
                        defaultValue=""
                        className="
                            w-full
                            cursor-pointer
                            rounded-xl
                            border
                            border-gray-300
                            bg-gray-50
                            px-3.5
                            py-2.5
                            text-sm
                            text-gray-900
                            outline-none
                            transition-all
                            focus:border-red-500
                            focus:bg-white
                            focus:ring-2
                            focus:ring-red-500/20
                        "
                    >
                        <option value="">
                            Selecciona una opción
                        </option>

                        {projectTypeOptions.map(
                            (option) => (
                                <option
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </option>
                            )
                        )}
                    </select>
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
                        bg-gray-50
                        px-3.5
                        py-2.5
                        text-sm
                        leading-6
                        text-gray-900
                        outline-none
                        transition-all
                        placeholder:text-gray-400
                        focus:border-red-500
                        focus:bg-white
                        focus:ring-2
                        focus:ring-red-500/20
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
                {/* BOTÓN ENVIAR */}
                <button
                    type="submit"
                    disabled={sending}
                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-full
                        bg-red-600
                        px-5
                        py-2.5
                        text-sm
                        font-semibold
                        text-white
                        shadow-sm
                        transition-all
                        duration-300
                        hover:bg-red-700
                        hover:shadow-md
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                    "
                >
                    {sending ? (
                        <>
                            <i className="fas fa-circle-notch animate-spin text-xs" />

                            Enviando...
                        </>
                    ) : (
                        <>
                            <i className="fas fa-paper-plane text-xs" />

                            Enviar mensaje
                        </>
                    )}
                </button>


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