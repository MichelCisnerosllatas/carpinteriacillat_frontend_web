import MainServices from "@/features/service/ui/MainServices";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "CILLAT | Servicios",
};

export default function ServicesPage() {
    return <MainServices/>;
}
