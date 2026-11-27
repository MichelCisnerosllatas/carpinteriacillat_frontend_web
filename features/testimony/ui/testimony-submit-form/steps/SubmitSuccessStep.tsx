// features/testimony/ui/testimony-submit-form/steps/SubmitSuccessStep.tsx
//
// Paso 3 del formulario completo: mensaje de "¡Gracias!" después de enviar.
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function SubmitSuccessStep() {
    return (
        <motion.div
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
    );
}
