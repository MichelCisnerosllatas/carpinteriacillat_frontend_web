// features/we/ui/MainWe.tsx
import WeSection1 from "@/features/we/ui/wesection1/WeSection1";
import WeSection2 from "@/features/we/ui/wesection2/WeSection2";
import WeValuesSection from "@/features/we/ui/wevaluessection/WeValuesSection";
import WeTeamSection from "@/features/we/ui/weteamsection/WeTeamSection";
import WeHistorySection from "@/features/we/ui/wehostorysection/WeHistorySection";
import TestimonialsSection from "@/features/we/ui/wetestimonialscection/WeTestimonialsSection";

export default function MainWe() {
    return (
        <main>
            <WeSection1/>
            <WeSection2/>
            <WeValuesSection/>
            <WeTeamSection/>
            <WeHistorySection/>
            <TestimonialsSection/>
        </main>
    );
}
