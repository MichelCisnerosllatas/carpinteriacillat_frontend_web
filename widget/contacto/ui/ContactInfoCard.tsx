import { ContactInfo } from "@/widget/contacto/model/type";
import type { SiteSectionButtonDto } from "@/shared/services/site_service/model/siteget.dto";
import { contactButtonVariantClass } from "@/widget/contacto/lib/contactButtonVariant";

type ContactInfoCardProps = {
    contact: ContactInfo;
    // Ya filtrados/ordenados (normalizeButtons) y sin el botón de acción (submit del form, ver
    // SectionContact.tsx) — solo botones tipo "enlace" (hoy: WhatsApp), recorridos como lista
    // para no volver a hardcodear uno solo si mañana se necesita otro.
    buttons: SiteSectionButtonDto[];
};

export default function ContactInfoCard({
    contact,
    buttons,
}: ContactInfoCardProps) {
    return (
        <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-bold text-gray-900">
                Información de contacto
            </h3>

            <div className="space-y-3 text-sm text-gray-700">

                {/* TELÉFONO */}
                <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50">
                        <i className="fas fa-phone text-xs text-red-600" />
                    </div>

                    <div>
                        <p className="font-semibold text-gray-900">
                            Teléfono
                        </p>

                        <p>{contact.phone}</p>
                    </div>
                </div>


                {/* CORREO */}
                <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50">
                        <i className="fas fa-envelope text-xs text-orange-500" />
                    </div>

                    <div>
                        <p className="font-semibold text-gray-900">
                            Correo
                        </p>

                        <a
                            href={`mailto:${contact.email}`}
                            className="font-medium text-red-600 underline-offset-2 hover:text-orange-500 hover:underline"
                        >
                            {contact.email}
                        </a>
                    </div>
                </div>


                {/* DIRECCIÓN */}
                <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                        <i className="fas fa-map-marker-alt text-xs text-gray-700" />
                    </div>

                    <div>
                        <p className="font-semibold text-gray-900">
                            Dirección
                        </p>

                        <p>{contact.address}</p>
                    </div>
                </div>


                {/* HORARIO */}
                {contact.schedule && (
                    <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                            <i className="fas fa-clock text-xs text-gray-700" />
                        </div>

                        <div>
                            <p className="font-semibold text-gray-900">
                                Horario de atención
                            </p>

                            <p>{contact.schedule}</p>
                        </div>
                    </div>
                )}
            </div>


            {/* BOTONES (ej. WhatsApp) — section_buttons real, ver ContactInfoCardProps */}
            {buttons.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                    {buttons.map((button) => (
                        <a
                            key={button.id_section_button}
                            href={button.url ?? "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${contactButtonVariantClass(button.variant)}`}
                        >
                            {button.icon && <i className={`${button.icon} text-base`} />}
                            {button.label}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}