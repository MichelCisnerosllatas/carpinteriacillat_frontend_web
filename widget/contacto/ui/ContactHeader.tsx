"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/shared/components/section_heading/SectionHeading";
import type { SiteSectionDto } from "@/shared/services/site_service/model/siteget.dto";

type Props = {
    // Antes este componente ni siquiera recibia la seccion: title/
    // subtitle/description estaban fijos en el JSX, sin importar lo que
    // hubiera en el backend.
    section: SiteSectionDto;
};

export default function ContactHeader({ section }: Props) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 20,
            }}
            whileInView={{
                opacity: 1,
                y: 0,
            }}
            viewport={{
                once: true,
                amount: 0.3,
            }}
            transition={{
                duration: 0.4,
            }}
        >
            <SectionHeading
                subtitle={section.section_subtitle}
                title={section.section_title}
                description={section.section_description}
                className="mb-10 text-center"
                subtitleClassName="text-sm font-semibold uppercase tracking-[0.2em] text-red-600"
                titleClassName="mt-2 text-3xl font-extrabold text-gray-900 md:text-4xl"
                descriptionClassName="mx-auto mt-3 max-w-2xl text-sm text-gray-600 md:text-base"
            />
        </motion.div>
    );
}
