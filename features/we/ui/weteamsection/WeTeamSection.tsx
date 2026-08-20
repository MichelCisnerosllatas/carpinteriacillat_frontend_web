"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Container from "@/shared/ui/container/Container";

const disciplines = [
    { label: "Carpintería", icon: "fa-solid fa-hammer" },
    { label: "Ebanistería", icon: "fa-solid fa-ruler-combined" },
    { label: "Acabados", icon: "fa-solid fa-paint-roller" },
    { label: "Instalación", icon: "fa-solid fa-screwdriver-wrench" },
];

export default function WeTeamSection() {
    return (
        <section className="relative py-16 bg-gray-100 overflow-x-hidden">
            <Container>
                <div className="flex flex-col md:flex-row gap-10 items-center">
                    {/* Columna IMAGEN */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.4 }}
                        className="w-full flex justify-center md:justify-start"
                    >
                        <div className="relative w-full max-w-md md:max-w-lg rounded-3xl shadow-2xl bg-white overflow-hidden border border-gray-200">
                            <Image
                                src="/img/sistema/fotogrupalcillat.jpg"
                                alt="Equipo de Carpintería CILLAT"
                                width={800}
                                height={600}
                                className="w-full h-72 md:h-80 object-cover"
                            />
                        </div>
                    </motion.div>

                    {/* Columna TEXTO */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.4 }}
                        className="w-full"
                    >
                        <span className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
                            Carpintería CILLAT
                        </span>

                        <h3 className="text-3xl md:text-4xl font-bold text-black leading-tight mt-2 mb-4">
                            Nuestro{" "}
                            <span className="bg-gradient-to-r from-red-600 via-red-500 to-yellow-400 bg-clip-text text-transparent">
                                Equipo
                            </span>
                        </h3>

                        <p className="text-gray-700 text-base leading-relaxed mb-6">
                            Detrás de cada mueble hay un equipo de carpinteros, ebanistas
                            e instaladores que trabaja de la mano en cada etapa del
                            proyecto, desde el corte de la madera hasta el acabado final
                            en tu hogar o negocio.
                        </p>

                        <div className="grid grid-cols-2 gap-3">
                            {disciplines.map((d) => (
                                <div
                                    key={d.label}
                                    className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 px-4 py-3"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-brand-red/10 flex items-center justify-center shrink-0">
                                        <i className={`${d.icon} text-brand-red text-sm`} />
                                    </div>
                                    <span className="text-sm font-semibold text-gray-800">
                                        {d.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </Container>
        </section>
    );
}
