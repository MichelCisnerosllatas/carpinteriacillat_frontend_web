// home/ui/section1/Section1.tsx
import Container from "@/shared/ui/container/Container";
import HeroSlideshow from "@/widget/homehero/ui/HeroSlideshow";
import Counter from "@/widget/homehero/ui/Counter";
import { heroSlides, heroStats } from "@/widget/homehero/model/mock";

export default function Section1() {
    return (
        <section id="inicio" className="relative py-20 overflow-hidden flex items-center min-h-screen">
            {/* Carrusel de fondo */}
            <HeroSlideshow slides={heroSlides} />

            {/* Contenido Hero */}
            {/* padding-top dinámico: el header fijo (banners + navbar) puede
                medir bastante más en mobile que en desktop, ver Header.tsx */}
            <Container
                className="relative z-10 w-full"
                style={{ paddingTop: "calc(var(--app-header-height, 6rem) + 1.5rem)" }}
            >
                <div className="max-w-3xl">
                    <h2 className="text-4xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
                        Creamos <span className="text-amber-400">Espacios</span>
                        <br />
                        Extraordinarios
                    </h2>
                    <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                        Fabricación de muebles a medida con diseños únicos y calidad
                        premium. Transformamos tus ideas en realidad con más de 15 años de
                        experiencia.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <a
                            href="#contacto"
                            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-2xl hover:shadow-red-500/50 hover:scale-105"
                        >
                            <i className="fas fa-phone-alt mr-2" />
                            Cotizar Ahora
                        </a>
                        <a
                            href="#galeria"
                            className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold text-lg transition-all border-2 border-white/30"
                        >
                            <i className="fas fa-images mr-2" />
                            Ver Trabajos
                        </a>
                    </div>

                    {/* Stats con contadores */}
                    <div className="grid grid-cols-3 gap-6 mt-5">
                        {heroStats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-4xl font-bold text-amber-400 mb-1">
                                    <Counter target={stat.target} suffix={stat.suffix} />
                                </div>
                                <div className="text-gray-300 text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
}
