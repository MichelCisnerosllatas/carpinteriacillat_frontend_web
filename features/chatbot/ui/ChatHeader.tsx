"use client";

interface ChatHeaderProps {
  title: string;
  subtitle?: string | null;
  primaryColor: string;
  // Solo se pasa cuando tiene sentido volver (vista chat y la pantalla inicial tiene más de una
  // opción) — si no viene, el botón no se pinta y el título queda pegado a la izquierda.
  onBack?: () => void;
  onClose: () => void;
}

// Header estilo AppBar: [← volver (condicional)] [título pegado a la izquierda] ........ [✕]
export default function ChatHeader({ title, subtitle, primaryColor, onBack, onClose }: ChatHeaderProps) {
  return (
    <header className="flex shrink-0 items-center gap-2 px-3 py-3 text-white" style={{ backgroundColor: primaryColor }}>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Volver al inicio del chat"
          title="Volver"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/20"
        >
          <i className="fa-solid fa-arrow-left text-base" aria-hidden />
        </button>
      )}

      <div className={`min-w-0 flex-1 text-left ${onBack ? "" : "pl-1"}`}>
        <h3 className="truncate text-sm font-semibold leading-tight">{title}</h3>
        {subtitle && <p className="truncate text-xs text-white/80">{subtitle}</p>}
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar chat"
        title="Cerrar"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/20"
      >
        <i className="fa-solid fa-xmark text-lg" aria-hidden />
      </button>
    </header>
  );
}
