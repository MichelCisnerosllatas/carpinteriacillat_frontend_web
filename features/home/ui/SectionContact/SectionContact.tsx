// home/ui/sectionContact/SectionContact.tsx
"use client";

import { motion } from "framer-motion";
import Container from "@/shared/ui/container/Container";
import { SectionContactProps } from "@/widget/contacto/model/type";
import { defaultContactInfo, defaultMapUrl } from "@/widget/contacto/model/constants";
import ContactForm from "@/widget/contacto/ui/ContactForm";
import ContactHeader from "@/widget/contacto/ui/ContactHeader";
import ContactInfoCard from "@/widget/contacto/ui/ContactInfoCard";
import ContactMap from "@/widget/contacto/ui/ContactMap";

export default function SectionContact({
    info,
    mapEmbedUrl,
}: SectionContactProps) {
    const contact = {
        ...defaultContactInfo,
        ...info,
    };

    const mapUrl = mapEmbedUrl ?? defaultMapUrl;

    return (
        <section id="contacto" className="relative bg-gray-100 py-16">
            <Container>
                <ContactHeader/>

                <div className="grid gap-8 md:grid-cols-2">

                    {/* COLUMNA IZQUIERDA */}
                    <motion.div
                        className="space-y-6"
                        initial={{
                            opacity: 0,
                            x: -25,
                        }}
                        whileInView={{
                            opacity: 1,
                            x: 0,
                        }}
                        viewport={{
                            once: true,
                            amount: 0.3,
                        }}
                        transition={{
                            duration: 0.4,
                        }}
                    >

                        <ContactInfoCard contact={contact}/>
                        <ContactForm
                            recipientEmail={
                                contact.email
                            }
                        />
                    </motion.div>


                    {/* COLUMNA DERECHA */}
                    <ContactMap mapUrl={mapUrl}/>
                </div>
            </Container>
        </section>
    );
}
