import ServiceHeader from "@/features/service/ui/seriviceheader/ServiceHeader";
import type { Metadata } from "next";
import ServicesMain from "@/features/service/ui/serviciomain/ServicesMain";
import ServiceHouse from "@/features/service/ui/servicehouse/ServiceHouse";
import ServiceComercial from "@/features/service/ui/servicecomercial/ServiceComercial";
import ServiceEspecializados from "@/features/service/ui/serviceespecializados/ServiceEspecializados";

export const metadata: Metadata = {
    title: "CILLAT | Servicios",
};

export default function ServicesPage () {
    return(
        <>
            <ServiceHeader/>
            <ServicesMain/>
            <ServiceHouse/>
            <ServiceComercial/>
            <ServiceEspecializados/>
        </>
    )
}