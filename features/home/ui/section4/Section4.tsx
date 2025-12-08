import Image from "next/image";

export default function Section4() {
    const data = [
        {
            title: "Soluciones Hechas a Medida",
            text: "Cada proyecto es único. Nos especializamos en crear piezas que se adaptan a tus necesidades, combinando funcionalidad y diseño.",
            img: "/img/solologocillat.png",
        },
        {
            title: "Calidad que se Ve y se Siente",
            text: "Cada detalle cuenta. Desde el corte hasta el acabado, garantizamos resultados impecables que superan expectativas.",
            img: "/img/solologocillat.png",
        },
        {
            title: "Construyendo Contigo",
            text: "Trabajamos de la mano contigo para materializar tus ideas, creando espacios y muebles que cuentan tu historia.",
            img: "/img/solologocillat.png",
        },
    ];

    return (
        <section className="py-16 bg-gray-100">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-2">

                {data.map((item, idx) => (
                    <div
                        key={idx}
                        className="bg-white px-8 py-2 shadow-lg rounded-xl border-b-4 border-red-500"
                    >
                        <Image src={item.img} alt={item.title} width={50} height={50} className="mb-4" />

                        <h1 className="text-xl font-semibold text-gray-800 mb-3">{item.title}</h1>

                        <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>
                    </div>
                ))}

            </div>
        </section>
    );
}
