import { ContactInfo } from "@/widget/contacto/model/type";

type ContactInfoCardProps = {
    contact: ContactInfo;
};

export default function ContactInfoCard({
    contact,
}: ContactInfoCardProps) {
    const whatsappUrl = contact.whatsapp
        ? `https://wa.me/${contact.whatsapp.replace(
              /[^0-9]/g,
              ""
          )}`
        : null;

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


            {/* WHATSAPP */}
            {whatsappUrl && (
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-600"
                >
                    <i className="fab fa-whatsapp text-base" />

                    Escríbenos por WhatsApp
                </a>
            )}
        </div>
    );
}