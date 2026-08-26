// features/we/ui/weteamsection/WeTeamSection.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Container from "@/shared/ui/container/Container";
import { defaultDisciplines } from "@/widget/we/team/model/mock";
import DisciplineBadge from "@/widget/we/team/ui/DisciplineBadge";

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
                            {defaultDisciplines.map((discipline) => (
                                <DisciplineBadge key={discipline.label} discipline={discipline} />
                            ))}
                        </div>
                    </motion.div>
                </div>
            </Container>
        </section>
    );
}
