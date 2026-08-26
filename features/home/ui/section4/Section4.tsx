// home/ui/section4/Section4.tsx
import Container from "@/shared/ui/container/Container";
import { defaultWhyUsItems } from "@/widget/whyus/model/mock";
import WhyUsCard from "@/widget/whyus/ui/WhyUsCard";

export default function Section4() {
    return (
        <section className="py-16 bg-gray-100">
            <Container className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {defaultWhyUsItems.map((item) => (
                    <WhyUsCard key={item.title} item={item} />
                ))}
            </Container>
        </section>
    );
}
