import Servicelabeltitle from "@/widget/services/mainzservicewidget/servicelabeltitle";
import EspecialzadosServiceGridWidget
    from "@/widget/services/especialzadosservicewidget/EspecialzadosServiceGridWidget";

const services = [
    {
        id: 1,
        title: "Restauración de Muebles",
        iconClass: "fa-solid fa-wrench",
        iconColorClass: "text-brand-gold-dark",
    },
    {
        id: 2,
        title: "Escaleras de Madera",
        iconClass: "fa-solid fa-stairs",
        iconColorClass: "text-brand-gold-dark",
    },
    {
        id: 3,
        title: "Acabados y Lacados",
        iconClass: "fa-solid fa-paint-roller",
        iconColorClass: "text-brand-gold-dark",
    },
    {
        id: 4,
        title: "Instalación y Montaje",
        iconClass: "fa-solid fa-tools",
        iconColorClass: "text-brand-gold-dark",
    },
];

export default function ServiceEspecializados(){
    return(
        <section className="py-10 container mx-auto px-2">
            <Servicelabeltitle title="Servicios Especializados" barColor="bg-brand-gold"/>
            <EspecialzadosServiceGridWidget items={services}/>
        </section>
    );
}