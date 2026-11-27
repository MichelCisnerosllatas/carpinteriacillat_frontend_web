import { ContactFormData } from "../model/type";

type BuildMailtoUrlParams = {
    to: string;
    data: ContactFormData;
};

export function buildMailtoUrl({
    to,
    data,
}: BuildMailtoUrlParams) {
    const subject = `Solicitud de proyecto - CILLAT (${data.name})`;

    const bodyLines = [
        `Nombre: ${data.name}`,
        `Correo: ${data.email}`,
        `Teléfono: ${data.phone}`,
        `Tipo de proyecto: ${
            data.projectType || "No especificado"
        }`,
        "",
        "Mensaje:",
        data.message,
    ];

    return `mailto:${encodeURIComponent(
        to
    )}?subject=${encodeURIComponent(
        subject
    )}&body=${encodeURIComponent(
        bodyLines.join("\n")
    )}`;
}