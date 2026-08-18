import WeSection2 from "@/features/we/ui/wesection2/WeSection2";
import WeSection1 from "@/features/we/ui/wesection1/WeSection1";
import WeHistorySection from "@/features/we/ui/wehostorysection/WeHistorySection";
import TestimonialsSection from "@/features/we/ui/wetestimonialscection/WeTestimonialsSection";
import WeValuesSection from "@/features/we/ui/wevaluessection/WeValuesSection";
import WeTeamSection from "@/features/we/ui/weteamsection/WeTeamSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "CILLAT | Nosotros",
};

export default function WePage() {
    return (
        <>
            <WeSection1/>
            <WeSection2/>
            <WeValuesSection/>
            <WeTeamSection/>
            <WeHistorySection/>
            <TestimonialsSection/>
        </>
    );
}


