// features/service/ui/MainServices.tsx
//
// Nota: no confundir con ./serviciomain/ServicesMain.tsx — ese es una
// sección puntual ("Servicios Principales"), este es el archivo que
// compone TODAS las secciones de la página /services (mismo rol que
// features/home/ui/MainHome.tsx para la home).
import ServiceHeader from "@/features/service/ui/seriviceheader/ServiceHeader";
import ServicesMain from "@/features/service/ui/serviciomain/ServicesMain";
import ServiceHouse from "@/features/service/ui/servicehouse/ServiceHouse";
import ServiceComercial from "@/features/service/ui/servicecomercial/ServiceComercial";
import ServiceEspecializados from "@/features/service/ui/serviceespecializados/ServiceEspecializados";

export default function MainServices() {
    return (
        <main>
            <ServiceHeader/>
            <ServicesMain/>
            <ServiceHouse/>
            <ServiceComercial/>
            <ServiceEspecializados/>
        </main>
    );
}
