// home/ui/sectionContact/SectionContact.tsx
"use client";

import { motion } from "framer-motion";
import Container from "@/shared/ui/container/Container";
import type { ContactInfo } from "@/widget/contacto/model/type";
import { defaultContactInfo } from "@/widget/contacto/model/constants";
import { getContactItem } from "@/widget/contacto/lib/getContactItem";
import { buildGoogleMapsEmbedUrl } from "@/widget/contacto/lib/buildGoogleMapsEmbedUrl";
import { normalizeButtons } from "@/shared/services/site_service/lib/normalizeSectionContent";
import ContactForm from "@/widget/contacto/ui/ContactForm";
import ContactHeader from "@/widget/contacto/ui/ContactHeader";
import ContactInfoCard from "@/widget/contacto/ui/ContactInfoCard";
import ContactMap from "@/widget/contacto/ui/ContactMap";
import type { SiteSectionDto } from "@/shared/services/site_service/model/siteget.dto";

type Props = {
    // section_type === "contact". No existe un objeto "info" separado: el
    // contenido viaja como items normales de la seccion, identificados por
    // item_type ("phone", "email", "branch", "whatsapp"). Ver
    // FRONTEND_NEXTJS_SITE_V3.md #28-30.
    section: SiteSectionDto;
};

export default function SectionContact({ section }: Props) {    
    const phone = getContactItem(section, "phone");
    const email = getContactItem(section, "email");
    const branch = getContactItem(section, "branch");

    // Se mezcla campo por campo con defaultContactInfo: si el backend
    // todavia no cargo, por ejemplo, el telefono, esa parte de la tarjeta
    // no desaparece, solo muestra el valor de ejemplo (fallback temporal,
    // ver FRONTEND_NEXTJS_SITE_V3.md #41).
    const contact: ContactInfo = {
        phone: phone?.value ?? defaultContactInfo.phone,
        email: email?.value ?? defaultContactInfo.email,
        address: branch?.value ?? defaultContactInfo.address,
        schedule: branch?.label ?? defaultContactInfo.schedule,
    };

    // El boton de WhatsApp (y cualquier otro CTA de esta seccion) es un
    // section_button real, igual que en el Hero — el admin lo edita/activa
    // desde el intranet (tab "Botones", tipo "contact" viene con
    // `typesection_buttons_fixed`: solo edita texto/visibilidad de este,
    // no puede crear otro ni eliminarlo). Ya no se arma a mano desde el
    // VALOR de un item "whatsapp".
    //
    // El botón "Enviar mensaje" (submit del form) TAMBIÉN es un section_button real, con
    // `action_key: "contact-form-submit"` — no navega a una URL, ejecuta el submit ya cableado
    // en ContactForm.tsx, por eso se separa del resto ("botones enlace") y se busca en
    // `section.buttons` SIN normalizar: a diferencia del resto, este viaja siempre desde el
    // backend sin importar su estado (ver WebSiteRepository), así que su ausencia real
    // (`undefined`) sí significa "no está sembrado todavía" y distinto de "está oculto"
    // (`state: false`, pero presente) — esa distinción es la que permite a ContactForm decidir
    // si pintar su propio botón por defecto o respetar que el admin lo ocultó.
    const linkButtons = normalizeButtons(section.buttons).filter((b) => !b.action_key);
    const submitButton = section.buttons.find((b) => b.action_key === "contact-form-submit") ?? null;

    // El mapa se arma con coordenadas reales (branch.latitude/longitude).
    // Si no hay item "branch" activo (el admin lo desactivo, o el backend
    // todavia no lo cargo) el mapa NO se pinta — nada de un mapa de
    // relleno mostrando una ubicacion que no es la real.
    const mapUrl =
        branch?.latitude != null && branch?.longitude != null
            ? buildGoogleMapsEmbedUrl(branch.latitude, branch.longitude)
            : null;

    return (
        <section id="contacto" className="relative bg-gray-100 py-16">
            <Container>
                <ContactHeader/>

                <div className={`grid gap-8 ${mapUrl ? "md:grid-cols-2" : ""}`}>

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

                        <ContactInfoCard contact={contact} buttons={linkButtons}/>
                        {/* ContactForm sigue enviando por mailto: (ver el
                            TODO dentro de ese archivo) — no depende de esta
                            seccion, solo necesita a donde llega el correo. */}
                        <ContactForm
                            recipientEmail={contact.email}
                            submitButton={submitButton}
                        />
                    </motion.div>


                    {/* COLUMNA DERECHA — no se pinta si no hay coordenadas reales (branch
                        inactivo/ausente): antes caia siempre a un mapa de relleno. */}
                    {mapUrl && <ContactMap mapUrl={mapUrl}/>}
                </div>
            </Container>
        </section>
    );
}
