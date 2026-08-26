"use client";

import { motion } from "framer-motion";

export default function ContactHeader() {
    return (
        <motion.div
            className="mb-10 text-center"
            initial={{
                opacity: 0,
                y: 20,
            }}
            whileInView={{
                opacity: 1,
                y: 0,
            }}
            viewport={{
                once: true,
                amount: 0.3,
            }}
            transition={{
                duration: 0.4,
            }}
        >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">
                Contáctanos
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-gray-900 md:text-4xl">
                ¿Listo para empezar tu proyecto?
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600 md:text-base">
                Cuéntanos qué necesitas y nuestro equipo
                te ayudará a diseñar el mueble o ambiente
                ideal para tu hogar o negocio.
            </p>
        </motion.div>
    );
}