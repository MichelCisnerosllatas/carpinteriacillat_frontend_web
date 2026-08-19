//feature/service/ui/servicehouse/ServiceHouse.tsx
import Servicelabeltitle from "@/widget/services/mainzservicewidget/servicelabeltitle";
import ServiceGridHouseWidget from "@/widget/services/houseservicewidget/ServiceGridHouseWidget";
import Container from "@/shared/ui/container/Container";

const servicesHouse = [
    {
        title: "Muebles de Dormitorio",
        listadescripcion: [
            { title: "Camas y cabeceras" },
            { title: "Mesas de noche" },
            { title: "Cómodas y cajoneras" },
        ],
        icono: "fa-solid fa-bed",
    },
    {
        title: "Sala de Estar",
        listadescripcion: [
            { title: "Muebles para TV" },
            { title: "Estanterías y libreros" },
            { title: "Mesas de centro" },
        ],
        icono: "fa-solid fa-tv",
    },
    {
        title: "Comedor",
        listadescripcion: [
            { title: "Mesas de comedor" },
            { title: "Sillas y bancos" },
            { title: "Vitrinas y buffets" },
        ],
        icono: "fa-solid fa-utensils",
    },
    {
        title: "Baño",
        listadescripcion: [
            { title: "Muebles de baño" },
            { title: "Gabinetes y vanitorios" },
            { title: "Repisas y organizadores" },
        ],
        icono: "fa-solid fa-bath",
    },
    {
        title: "Espacios Exteriores",
        listadescripcion: [
            { title: "Pérgolas y decks" },
            { title: "Muebles de jardín" },
            { title: "Cercas y portones" },
        ],
        icono: "fa-solid fa-warehouse",
    },
    {
        title: "Habitación Infantil",
        listadescripcion: [
            { title: "Camas infantiles" },
            { title: "Escritorios y sillas" },
            { title: "Jugueteros" },
        ],
        icono: "fa-solid fa-child",
    },
];

export default function ServiceHouse(){
    return(
        <section className="py-10">
            <Container>
                <Servicelabeltitle title="Carpintería para el Hogar"/>
                <ServiceGridHouseWidget items={servicesHouse}/>
            </Container>
        </section>
    );
}