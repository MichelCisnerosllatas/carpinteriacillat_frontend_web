//app/page.tsx
import MainHome from "@/features/home/ui/MainHome";

// MainHome ya lee el sitio del store de Zustand (hidratado una sola vez
// desde app/layout.tsx, ver app/providers.tsx) — este archivo no vuelve a
// llamar getSite().
export default function HomePage() {
    return <MainHome />;
}
