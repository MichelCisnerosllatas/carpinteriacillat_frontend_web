"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Error inesperado en cualquier página del sitio.
 * Next.js muestra esta pantalla cuando algo falla al dibujar la página.
 * "Reintentar" vuelve a dibujar la página sin recargar todo el sitio.
 */
export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-stone-950 px-6 pt-[var(--app-header-height)] pb-20 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 left-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-red/20 blur-3xl"
      />

      <div className="relative flex max-w-xl flex-col items-center gap-8 text-center">
        <span className="flex size-20 items-center justify-center rounded-2xl bg-brand-red text-3xl shadow-xl shadow-brand-red/30">
          <i className="fa-solid fa-screwdriver-wrench" aria-hidden />
        </span>

        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold sm:text-4xl">Algo salió mal</h1>
          <p className="text-base text-white/70 sm:text-lg">
            Tuvimos un problema al mostrar esta página. Intenta de nuevo en unos segundos.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-red px-7 py-3 font-semibold transition-colors hover:bg-brand-red-dark"
          >
            <i className="fa-solid fa-rotate-right" aria-hidden />
            Reintentar
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-7 py-3 font-semibold transition-colors hover:border-brand-gold hover:text-brand-gold"
          >
            <i className="fa-solid fa-house" aria-hidden />
            Ir al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
