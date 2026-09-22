import MainServices from "@/features/service/ui/MainServices";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "CILLAT | Servicios",
};

// MainServices ya lee el sitio del store de Zustand (hidratado una sola vez
// desde app/layout.tsx, ver app/providers.tsx) — este archivo no vuelve a
// llamar getSite().
export default function ServicesPage() {
    return <MainServices />;
}
