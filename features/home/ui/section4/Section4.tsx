import Container from "@/shared/ui/container/Container";

export default function Section4() {
    const data = [
        {
            title: "Soluciones Hechas a Medida",
            text: "Cada proyecto es único. Nos especializamos en crear piezas que se adaptan a tus necesidades, combinando funcionalidad y diseño.",
            icon: "fa-solid fa-ruler-combined",
        },
        {
            title: "Calidad que se Ve y se Siente",
            text: "Cada detalle cuenta. Desde el corte hasta el acabado, garantizamos resultados impecables que superan expectativas.",
            icon: "fa-solid fa-gem",
        },
        {
            title: "Construyendo Contigo",
            text: "Trabajamos de la mano contigo para materializar tus ideas, creando espacios y muebles que cuentan tu historia.",
            icon: "fa-solid fa-handshake",
        },
    ];

    return (
        <section className="py-16 bg-gray-100">
            <Container className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {data.map((item, idx) => (
                    <div
                        key={idx}
                        className="bg-white px-8 py-6 shadow-lg rounded-xl border-b-4 border-brand-red"
                    >
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-brand-red/10 mb-4">
                            <i className={`${item.icon} text-2xl text-brand-red`} />
                        </div>

                        <h1 className="text-xl font-semibold text-gray-800 mb-3">{item.title}</h1>

                        <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>
                    </div>
                ))}

            </Container>
        </section>
    );
}
