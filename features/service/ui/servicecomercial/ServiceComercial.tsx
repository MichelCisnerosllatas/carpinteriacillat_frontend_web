import Servicelabeltitle from "@/widget/services/mainzservicewidget/servicelabeltitle";
import ServicesGrid from "@/widget/services/mainzservicewidget/ServicesGrid";

const services = [
    {
        id: 1,
        title: "Locales Comerciales",
        description: "Mostradores, vitrinas, displays",
        iconClass: "fa-solid fa-store",
        iconBgClass: "bg-rose-50",
        iconColorClass: "text-red-600",
    },
    {
        id: 2,
        title: "Oficinas",
        description: "Escritorios, recepción, salas",
        iconClass: "fa-solid fa-building",
        iconBgClass: "bg-rose-50",
        iconColorClass: "text-red-600",
    },
    {
        id: 3,
        title: "Hoteles & Restaurantes",
        description: "Mobiliario a gran escala",
        iconClass: "fa-solid fa-hotel",
        iconBgClass: "bg-rose-50",
        iconColorClass: "text-red-600",
    },
    {
        id: 4,
        title: "Proyectos Corporativos",
        description: "Ambientación completa",
        iconClass: "fa-solid fa-briefcase",
        iconBgClass: "bg-rose-50",
        iconColorClass: "text-red-600",
    },
];

export default function ServiceComercial(){
    return(
        <section className="py-10 container mx-auto px-2">
            <Servicelabeltitle title="Carpintería Comercial" barColor="bg-red-500"/>
            <ServicesGrid items={services} />
        </section>
    );
}