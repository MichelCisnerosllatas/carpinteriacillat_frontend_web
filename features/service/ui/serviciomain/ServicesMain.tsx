//feature/service/ui/serviciomain/ServicesMain.tsx
import Servicelabeltitle from "@/widget/services/mainzservicewidget/servicelabeltitle";
import ServicesGrid from "@/widget/services/mainzservicewidget/ServicesGrid";
import Container from "@/shared/ui/container/Container";

const services = [
    {
        id: 1,
        title: "Muebles a Medida",
        description: "Diseño y fabricación personalizada",
        iconClass: "fa-solid fa-couch",
        iconBgClass: "bg-brand-gold/10",
        iconColorClass: "text-brand-gold-dark",
    },
    {
        id: 2,
        title: "Cocinas Integrales",
        description: "Diseño moderno y funcional",
        iconClass: "fa-solid fa-kitchen-set",
        iconBgClass: "bg-brand-gold/10",
        iconColorClass: "text-brand-gold-dark",
    },
    {
        id: 3,
        title: "Closets & Vestidores",
        description: "Organización inteligente",
        iconClass: "fa-solid fa-door-closed",
        iconBgClass: "bg-brand-gold/10",
        iconColorClass: "text-brand-gold-dark",
    },
    {
        id: 4,
        title: "Puertas & Ventanas",
        description: "Instalación y fabricación",
        iconClass: "fa-solid fa-warehouse",
        iconBgClass: "bg-brand-gold/10",
        iconColorClass: "text-brand-gold-dark",
    },
];

export  default function ServicesMain(){
    return(
        <section className="py-10">
            <Container>
                <Servicelabeltitle title="Servicios Principales"/>
                <ServicesGrid items={services} />
            </Container>
        </section>
    );
}