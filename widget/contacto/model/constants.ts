import { ContactInfo } from "@/widget/contacto/model/type";

export const defaultContactInfo: ContactInfo = {
    phone: "+51 999 999 999",
    email: "contacto@cillat.com",
    address: "Iquitos, Loreto - Perú",
    whatsapp: "+51 999 999 999",
    schedule: "Lunes a Sábado, 8:00 AM - 6:00 PM",
};

export const defaultMapUrl = "https://www.google.com/maps?q=-3.777157,-73.305000&z=16&output=embed";

export const projectTypeOptions = [
    {
        value: "cocina",
        label: "Cocina integral",
    },
    {
        value: "closet",
        label: "Closet / dormitorio",
    },
    {
        value: "oficina",
        label: "Muebles de oficina",
    },
    {
        value: "comercial",
        label: "Proyecto comercial",
    },
    {
        value: "otro",
        label: "Otro",
    },
];