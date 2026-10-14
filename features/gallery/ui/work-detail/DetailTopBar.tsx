// features/gallery/ui/work-detail/DetailTopBar.tsx
//
// Barra de arriba del detalle: botón "Volver a la galería" + migas de pan
// ("Galería / Cocinas / Cocina en L con isla central").

import Link from "next/link";
import Container from "@/shared/ui/container/Container";

type Props = {
    categoryName: string | null;
    title: string;
};

export default function DetailTopBar({ categoryName, title }: Props) {
    const breadcrumb = ["Galería", categoryName, title].filter(Boolean).join(" / ");

    return (
        <Container className="flex flex-wrap items-center gap-3.5 pt-5">
            <Link
                href="/gallery"
                className="il-display inline-flex min-h-11 flex-none items-center gap-2.5 whitespace-nowrap rounded-full border-[1.5px] border-il-neutro-200 bg-white py-0 pl-2 pr-[18px] text-[15px] font-bold text-il-neutro-900 transition-colors hover:border-brand-gold"
            >
                <span aria-hidden="true" className="inline-flex size-[30px] items-center justify-center rounded-full bg-brand-gold text-black">
                    ←
                </span>
                Volver a la galería
            </Link>
            <span className="min-w-0 flex-[1_1_200px] overflow-hidden text-ellipsis whitespace-nowrap text-[15px] text-il-neutro-600">
                {breadcrumb}
            </span>
        </Container>
    );
}
