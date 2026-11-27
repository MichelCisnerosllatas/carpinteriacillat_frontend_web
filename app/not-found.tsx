import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CILLAT | Página no encontrada",
};

/**
 * Página 404 del sitio: se muestra en cualquier URL que no existe (ej. /loquesea).
 * Se dibuja dentro del layout, así que el header y el footer del sitio siguen visibles.
 *
 * El fondo es oscuro a propósito: el header es transparente arriba de la página y
 * sus textos son claros, así se leen bien.
 */
export default function NotFound() {
  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-stone-950 px-6 pt-[var(--app-header-height)] pb-20 text-white">
      {/* Fondo: vetas de madera suaves + brillo dorado */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07] [background:repeating-linear-gradient(100deg,#fff_0px,#fff_1px,transparent_1px,transparent_22px)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 left-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-gold/20 blur-3xl"
      />

      <div className="relative flex max-w-2xl flex-col items-center gap-8 text-center">
        {/* 404 grande con el martillo */}
        <div className="relative">
          <span className="block bg-gradient-to-b from-brand-gold to-brand-gold-dark/30 bg-clip-text text-[8rem] leading-none font-extrabold tracking-tighter text-transparent select-none sm:text-[12rem]">
            404
          </span>
          <span className="absolute -top-3 -right-6 flex size-16 rotate-12 items-center justify-center rounded-2xl bg-brand-red text-2xl shadow-xl shadow-brand-red/30 sm:size-20 sm:text-3xl">
            <i className="fa-solid fa-hammer" aria-hidden />
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold sm:text-4xl">Esta página no existe</h1>
          <p className="text-base text-white/70 sm:text-lg">
            Parece que este mueble todavía no lo fabricamos. Revisa el enlace o sigue explorando nuestro trabajo.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-red px-7 py-3 font-semibold transition-colors hover:bg-brand-red-dark"
          >
            <i className="fa-solid fa-house" aria-hidden />
            Ir al inicio
          </Link>
          <Link
            href="/gallery"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-7 py-3 font-semibold transition-colors hover:border-brand-gold hover:text-brand-gold"
          >
            <i className="fa-solid fa-images" aria-hidden />
            Ver galería
          </Link>
          <Link
            href="/#contacto"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-7 py-3 font-semibold transition-colors hover:border-brand-gold hover:text-brand-gold"
          >
            <i className="fa-solid fa-envelope" aria-hidden />
            Contáctanos
          </Link>
        </div>
      </div>
    </main>
  );
}
