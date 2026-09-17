import { ContactInfo } from "@/widget/contacto/model/type";

export const defaultContactInfo: ContactInfo = {
    phone: "+51 999 999 999",
    email: "contacto@cillat.com",
    address: "Iquitos, Loreto - Perú",
    schedule: "Lunes a Sábado, 8:00 AM - 6:00 PM",
};

// Estos "value" deben coincidir EXACTAMENTE con el enum
// ContactMessageProjectType del backend (ver
// shared/services/contactmessages_service/model/contactmessagespost.dto.ts
// y ContactMessage::PROJECT_TYPES en el modelo de Laravel). Antes tenian
// "closet" y "comercial", que no existen en ese enum — se alinearon aca
// aunque ContactForm todavia no llame al backend real (sigue mandando por
// mailto: por ahora, ver el TODO en ContactForm.tsx), para que cuando se
// conecte el POST real no haya que volver a tocar esto.
export const projectTypeOptions = [
    {
        value: "cocina",
        label: "Cocina integral",
    },
    {
        value: "closet_dormitorio",
        label: "Closet / dormitorio",
    },
    {
        value: "oficina",
        label: "Muebles de oficina",
    },
    {
        value: "puertas_ventanas",
        label: "Puertas / ventanas",
    },
    {
        value: "restauracion",
        label: "Restauración",
    },
    {
        value: "otro",
        label: "Otro",
    },
];