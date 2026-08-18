// features/we/ui/wevaluessection/WeValuesSection.tsx

const values = [
    { label: "Calidad", icon: "fa-solid fa-medal", accent: "gold" },
    { label: "Compromiso", icon: "fa-solid fa-handshake", accent: "red" },
    { label: "Innovación", icon: "fa-solid fa-lightbulb", accent: "gold" },
    { label: "Confianza", icon: "fa-solid fa-shield-heart", accent: "red" },
] as const;

export default function WeValuesSection() {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8">
                        <div className="w-12 h-12 rounded-xl bg-brand-red/10 flex items-center justify-center mb-4">
                            <i className="fa-solid fa-bullseye text-brand-red text-xl" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Misión</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Fabricar muebles y soluciones de carpintería a medida, con
                            materiales de calidad y acabados cuidados, acompañando a cada
                            cliente desde la idea hasta la instalación final.
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8">
                        <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center mb-4">
                            <i className="fa-solid fa-eye text-brand-gold-dark text-xl" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Visión</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Ser la carpintería de referencia de la región, reconocida por
                            la calidad de su trabajo, la puntualidad de sus entregas y la
                            confianza que construye con cada proyecto.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                    {values.map((value) => (
                        <div
                            key={value.label}
                            className="text-center rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-all"
                        >
                            <div
                                className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center ${
                                    value.accent === "gold" ? "bg-brand-gold/10" : "bg-brand-red/10"
                                }`}
                            >
                                <i
                                    className={`${value.icon} text-lg ${
                                        value.accent === "gold" ? "text-brand-gold-dark" : "text-brand-red"
                                    }`}
                                />
                            </div>
                            <p className="mt-3 text-sm font-semibold text-slate-900">
                                {value.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
