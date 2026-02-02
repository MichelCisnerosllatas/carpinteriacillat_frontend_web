//feature/service/ui/serviciomain/ServicesMain.tsx
import Servicelabeltitle from "@/widget/services/mainzservicewidget/servicelabeltitle";
import ServicesGrid from "@/widget/services/mainzservicewidget/ServicesGrid";

const services = [
    {
        id: 1,
        title: "Muebles a Medida",
        description: "Diseño y fabricación personalizada",
        iconClass: "fa-solid fa-couch",
        iconBgClass: "bg-amber-50",
        iconColorClass: "text-amber-700",
    },
    {
        id: 2,
        title: "Cocinas Integrales",
        description: "Diseño moderno y funcional",
        iconClass: "fa-solid fa-kitchen-set",
        iconBgClass: "bg-orange-50",
        iconColorClass: "text-orange-600",
    },
    {
        id: 3,
        title: "Closets & Vestidores",
        description: "Organización inteligente",
        iconClass: "fa-solid fa-door-closed",
        iconBgClass: "bg-rose-50",
        iconColorClass: "text-rose-600",
    },
    {
        id: 4,
        title: "Puertas & Ventanas",
        description: "Instalación y fabricación",
        iconClass: "fa-solid fa-warehouse",
        iconBgClass: "bg-yellow-50",
        iconColorClass: "text-yellow-700",
    },
];

export  default function ServicesMain(){
    return(
        <section className="py-10  container mx-auto px-2">
            <Servicelabeltitle title="Servicios Principales"/>
            <ServicesGrid items={services} />
        </section>
    );
}