"use client";

import { motion } from "framer-motion";

type ContactMapProps = {
    mapUrl: string;
};

export default function ContactMap({
    mapUrl,
}: ContactMapProps) {
    return (
        <motion.div
            className="flex flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
            initial={{
                opacity: 0,
                x: 25,
            }}
            whileInView={{
                opacity: 1,
                x: 0,
            }}
            viewport={{
                once: true,
                amount: 0.3,
            }}
            transition={{
                duration: 0.4,
                delay: 0.1,
            }}
        >
            <h3 className="mb-4 text-lg font-bold text-gray-900">
                Estamos aquí
            </h3>

            <p className="mb-4 text-sm text-gray-600">
                Visítanos en nuestro taller/oficina o
                coordina una visita técnica previa cita.
                Atendemos proyectos en Iquitos y
                alrededores.
            </p>

            <div className="relative min-h-[260px] flex-1 overflow-hidden rounded-xl border border-gray-200">

                <iframe
                    src={mapUrl}
                    title="Ubicación de CILLAT"
                    style={{
                        border: 0,
                    }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 h-full w-full"
                />

            </div>
        </motion.div>
    );
}