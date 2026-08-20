//widget/main/Main.tsx
import Section1 from "@/features/home/ui/section1/Section1";
import Section2 from "@/features/home/ui/section2/Section2";
import Section3 from "@/features/home/ui/section3/Section3";
import Section4 from "@/features/home/ui/section4/Section4";
import SectionTestimonial from "@/features/home/ui/SectionTestimonial/SectionTestimonial";
import SectionContact from "@/features/home/ui/SectionContact/SectionContact";
import SectionProcess from "@/features/home/ui/SectionProcess/SectionProcess";

export default function MainHome(){
    return(
        <main>
            <Section1/>
            <Section4/>
            <SectionProcess/>
            <Section2 />
            <Section3/>
            <SectionTestimonial/>
            <SectionContact/>
        </main>
    );
}