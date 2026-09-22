import type { Metadata } from "next";
import Container from "@/shared/ui/container/Container";
import TestimonySubmitForm from "@/widget/testimonial/ui/TestimonySubmitForm";

export const metadata: Metadata = {
    title: "CILLAT | Deja tu testimonio",
};

// TestimonySubmitForm ya lee `testimony_settings` del store de Zustand
// (hidratado una sola vez desde app/layout.tsx) para ocultar los campos que
// el admin desactivó (show_city/show_rating) — el correo es la única
// excepción, siempre obligatorio, sin importar `show_email` (ver
// TestimonySubmitForm.tsx). Este archivo no vuelve a llamar getSite().
export default function TestimonySubmitPage() {
    return (
        <section
            className="relative bg-gray-100 pb-16 md:pb-20"
            style={{ paddingTop: "calc(var(--app-header-height, 10rem) + 2rem)" }}
        >
            <Container>
                <div className="mx-auto mb-10 max-w-xl text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-red-600 md:text-sm">
                        Comparte tu experiencia
                    </p>
                    <h1 className="mx-auto mt-3 max-w-xl text-3xl font-extrabold leading-[1.12] tracking-tight text-slate-950 md:text-4xl">
                        Deja tu testimonio
                    </h1>
                    <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-500 md:text-base">
                        Cuéntanos cómo fue tu experiencia trabajando con nosotros. Tu testimonio será revisado antes de publicarse.
                    </p>
                </div>

                <TestimonySubmitForm />
            </Container>
        </section>
    );
}
