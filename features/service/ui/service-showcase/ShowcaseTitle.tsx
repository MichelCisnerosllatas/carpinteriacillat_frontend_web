// features/service/ui/service-showcase/ShowcaseTitle.tsx
//
// Antetítulo con raya amarilla + título grande del hero de Servicios. Cada palabra "importante"
// del título se subraya en amarillo cuando su panel está activo: así "Creamos, restauramos e
// instalamos." va marcando el verbo del servicio que se está mostrando.
//
// Regla simple (para no tener que configurar nada en el intranet): las palabras de más de
// 2 letras se numeran 0, 1, 2… en orden, y se subraya la que tenga el número del panel activo.
// Las cortas ("e", "y", "de") nunca se subrayan.
// data-el: anclas del grupo "Encabezado" de la Apariencia (vista previa del intranet).

import { EASE_IL } from "@/shared/lib/ilDesign";
import { headingStyles as hs } from "@/shared/components/section_heading/sectionHeading.styles";

type Props = {
    kicker: string | null;
    title: string | null;
    activeIndex: number;
};

// Cuenta solo letras (sin comas ni puntos): "Creamos," tiene 7.
function countLetters(word: string): number {
    return (word.match(/[a-záéíóúüñ]/gi) ?? []).length;
}

export default function ShowcaseTitle({ kicker, title, activeIndex }: Props) {
    const words = (title ?? "").split(/\s+/).filter(Boolean);

    // Número de cada palabra (o -1 si es corta y no participa del subrayado).
    let counter = 0;
    const numbered = words.map((word) => ({
        word,
        number: countLetters(word) > 2 ? counter++ : -1,
    }));

    return (
        <div className="flex flex-col gap-[18px]">
            {kicker && (
                <span data-el="header-subtitle" className={`${hs.eyebrow} ${hs.eyebrowColor.light}`}>
                    <span aria-hidden="true" className={hs.eyebrowBar} />
                    {kicker}
                </span>
            )}
            {title && (
                <h1 data-el="header-title" className={`${hs.title} ${hs.pageTitleSize} ${hs.titleColor.light} flex flex-wrap gap-x-[.26em]`}>
                    {numbered.map(({ word, number }, k) => (
                        <span
                            key={`${word}-${k}`}
                            style={{
                                backgroundImage: "linear-gradient(#FFC300,#FFC300)",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "0 88%",
                                backgroundSize: number === activeIndex ? "100% 32%" : "0% 32%",
                                transition: `background-size 700ms ${EASE_IL}`,
                            }}
                        >
                            {word}
                        </span>
                    ))}
                </h1>
            )}
        </div>
    );
}
