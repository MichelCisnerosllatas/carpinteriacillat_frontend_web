// features/we/ui/wevaluessection/WeValuesSection.tsx
import Container from "@/shared/ui/container/Container";
import { defaultCoreValues } from "@/widget/we/values/model/mock";
import CoreValueCard from "@/widget/we/values/ui/CoreValueCard";
import MissionVisionCard from "@/widget/we/values/ui/MissionVisionCard";

export default function WeValuesSection() {
    return (
        <section className="py-16 bg-white">
            <Container>
                <div className="grid md:grid-cols-2 gap-6">
                    <MissionVisionCard
                        title="Misión"
                        icon="fa-solid fa-bullseye"
                        accent="red"
                        text="Fabricar muebles y soluciones de carpintería a medida, con materiales de calidad y acabados cuidados, acompañando a cada cliente desde la idea hasta la instalación final."
                    />

                    <MissionVisionCard
                        title="Visión"
                        icon="fa-solid fa-eye"
                        accent="gold"
                        text="Ser la carpintería de referencia de la región, reconocida por la calidad de su trabajo, la puntualidad de sus entregas y la confianza que construye con cada proyecto."
                    />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                    {defaultCoreValues.map((value) => (
                        <CoreValueCard key={value.label} value={value} />
                    ))}
                </div>
            </Container>
        </section>
    );
}
