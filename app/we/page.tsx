import MainWe from "@/features/we/ui/MainWe";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "CILLAT | Nosotros",
};

// MainWe ya lee el sitio del store de Zustand (hidratado una sola vez
// desde app/layout.tsx, ver app/providers.tsx) — este archivo no vuelve a
// llamar getSite().
export default function WePage() {
    return <MainWe />;
}
