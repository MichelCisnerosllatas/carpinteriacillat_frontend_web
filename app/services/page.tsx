import ServiceSection1 from "@/features/service/ui/servicesection1/ServiceSection1";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "CILLAT | Servicios",
};

export default function ServicesPage () {
    return(
        <>
            <ServiceSection1/>
        </>
    )
}