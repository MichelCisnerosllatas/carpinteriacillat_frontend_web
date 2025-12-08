// widget/main/sectionContact/SectionContact.tsx
"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";

export type ContactInfo = {
    phone: string;
    email: string;
    address: string;
    whatsapp?: string;
    schedule?: string;
};

type SectionContactProps = {
    info?: ContactInfo;
    mapEmbedUrl?: string;
};

const defaultInfo: ContactInfo = {
    phone: "+51 999 999 999",
    email: "contacto@cillat.com",
    address: "Iquitos, Loreto - Perú",
    whatsapp: "+51 999 999 999",
    schedule: "Lunes a Sábado, 8:00 AM - 6:00 PM",
};

const defaultMap =
    "https://www.google.com/maps?q=-3.777157,-73.305000&z=16&output=embed"
export default function SectionContact({
                                           info,
                                           mapEmbedUrl,
                                       }: SectionContactProps) {
    const contact = { ...defaultInfo, ...info };
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const name = String(formData.get("name") ?? "");
        const email = String(formData.get("email") ?? "");
        const phone = String(formData.get("phone") ?? "");
        const projectType = String(formData.get("projectType") ?? "");
        const message = String(formData.get("message") ?? "");

        // acción: preparar correo
        const to = contact.email;
        const subject = `Solicitud de proyecto - CILLAT (${name})`;
        const bodyLines = [
            `Nombre: ${name}`,
            `Correo: ${email}`,
            `Teléfono: ${phone}`,
            `Tipo de proyecto: ${projectType || "No especificado"}`,
            "",
            "Mensaje:",
            message,
        ];

        const mailtoUrl = `mailto:${encodeURIComponent(
            to
        )}?subject=${encodeURIComponent(
            subject
        )}&body=${encodeURIComponent(bodyLines.join("\n"))}`;

        setSending(true);

        // Simula envío y abre cliente de correo
        setTimeout(() => {
            setSending(false);
            setSent(true);
            window.location.href = mailtoUrl;
            form.reset();
            setTimeout(() => setSent(false), 3500);
        }, 800);
    };

    return (
        <section id="contacto" className="relative py-16 bg-gray-100">
            <div className="container mx-auto px-4">
                {/* TÍTULO animado */}
                <motion.div
                    className="text-center mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.4 }}
                >
                    <p className="text-sm uppercase tracking-[0.2em] text-red-600  font-semibold">
                        Contáctanos
                    </p>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
                        ¿Listo para empezar tu proyecto?
                    </h2>
                    <p className="text-gray-600 mt-3 max-w-2xl mx-auto text-sm md:text-base">
                        Cuéntanos qué necesitas y nuestro equipo te ayudará a diseñar el
                        mueble o ambiente ideal para tu hogar o negocio.
                    </p>
                </motion.div>

                {/* GRID: contacto + formulario | mapa */}
                <div className="grid gap-8 md:grid-cols-2">
                    {/* Columna izquierda: info + form */}
                    <motion.div
                        className="space-y-6"
                        initial={{ opacity: 0, x: -25 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.4 }}
                    >
                        {/* INFO DE CONTACTO */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                Información de contacto
                            </h3>

                            <div className="space-y-3 text-sm text-gray-700">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                                        <i className="fas fa-phone text-red-600 text-xs" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Teléfono</p>
                                        <p>{contact.phone}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
                                        <i className="fas fa-envelope text-orange-500 text-xs" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Correo</p>
                                        <p>
                                            <a
                                                href={`mailto:${contact.email}`}
                                                className="text-red-600 hover:text-orange-500 font-medium underline-offset-2 hover:underline"
                                            >
                                                {contact.email}
                                            </a>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                        <i className="fas fa-map-marker-alt text-gray-700 text-xs" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Dirección</p>
                                        <p>{contact.address}</p>
                                    </div>
                                </div>

                                {contact.schedule && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                            <i className="fas fa-clock text-gray-700 text-xs" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                Horario de atención
                                            </p>
                                            <p>{contact.schedule}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {contact.whatsapp && (
                                <a
                                    href={`https://wa.me/${contact.whatsapp.replace(
                                        /[^0-9]/g,
                                        ""
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 px-4 py-2.5 rounded-full transition-all"
                                >
                                    <i className="fab fa-whatsapp text-base" />
                                    Escríbenos por WhatsApp
                                </a>
                            )}
                        </div>

                        {/* FORMULARIO */}
                        <form
                            onSubmit={handleSubmit}
                            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4"
                        >
                            <h3 className="text-lg font-bold text-gray-900">
                                Envíanos un mensaje
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                                        Nombre completo
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        placeholder="Ej. Juan Pérez"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                                        Correo electrónico
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        placeholder="ejemplo@correo.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                                        Teléfono / WhatsApp
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        placeholder="+51 999 999 999"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                                        Tipo de proyecto
                                    </label>
                                    <select
                                        name="projectType"
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    >
                                        <option value="">Selecciona una opción</option>
                                        <option value="cocina">Cocina integral</option>
                                        <option value="closet">Closet / dormitorio</option>
                                        <option value="oficina">Muebles de oficina</option>
                                        <option value="comercial">Proyecto comercial</option>
                                        <option value="otro">Otro</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    Cuéntanos sobre tu proyecto
                                </label>
                                <textarea
                                    name="message"
                                    rows={4}
                                    required
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                                    placeholder="Describe el ambiente, medidas aproximadas o idea que tienes en mente..."
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-3 justify-between pt-2">
                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-red-600 via-orange-500 to-red-500 hover:from-red-700 hover:via-orange-600 hover:to-red-600 px-5 py-2.5 rounded-full transition-all disabled:opacity-70"
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

                                {sent && (
                                    <span className="text-xs text-emerald-600 flex items-center gap-1">
                    <i className="fas fa-check-circle" />
                    Mensaje preparado en tu correo (demo)
                  </span>
                                )}
                            </div>
                        </form>
                    </motion.div>

                    {/* Columna derecha: MAPA animado */}
                    <motion.div
                        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex flex-col"
                        initial={{ opacity: 0, x: 25 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                    >
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            Estamos aquí
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                            Visítanos en nuestro taller/oficina o coordina una visita técnica
                            previa cita. Atendemos proyectos en Iquitos y alrededores.
                        </p>
                        <div className="relative flex-1 min-h-[260px] rounded-xl overflow-hidden border border-gray-200">
                            <iframe
                                src={mapEmbedUrl || defaultMap}
                                style={{ border: 0 }}
                                loading="lazy"
                                allowFullScreen
                                referrerPolicy="no-referrer-when-downgrade"
                                className="absolute inset-0 w-full h-full"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
