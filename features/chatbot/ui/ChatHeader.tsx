"use client";

interface ChatHeaderProps {
  onClose: () => void;
}

export default function ChatHeader({onClose}: ChatHeaderProps) {
  return (
    <header className="flex shrink-0 items-center justify-between bg-blue-600 px-4 py-3 text-white">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
          <i className="fa-solid fa-robot text-lg" />
        </div>

        <div>
          <h3 className="text-sm font-semibold">
            Asistente virtual
          </h3>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            <span className="text-xs text-blue-100">
              Modo de prueba
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar asistente"
        title="Cerrar"
        className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-white/20"
      >
        <i className="fa-solid fa-xmark text-lg" />
      </button>
    </header>
  );
}
