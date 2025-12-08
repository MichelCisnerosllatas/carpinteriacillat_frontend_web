// widget/header/Alert2.tsx
type Alert2Props = {
    onClose?: () => void;
};

export default function Alert2({ onClose }: Alert2Props) {
    return (
        <div
            id="temporaryAlert"
            className="bg-gradient-to-r from-yellow-500 to-amber-600 text-gray-900 py-2.5 px-4 text-center transition-all duration-300"
        >
            <div className="container mx-auto flex items-center justify-center gap-2">
                <i className="fas fa-info-circle" />
                <span className="text-sm font-medium">
          Atención: Nuevos horarios de atención - Lunes a Sábado 8:00 AM - 6:00
          PM
        </span>
                <button
                    type="button"
                    className="ml-4 hover:bg-white/20 rounded-full p-1"
                    onClick={onClose}
                    aria-label="Cerrar aviso"
                >
                    <i className="fas fa-times text-sm" />
                </button>
            </div>
        </div>
    );
}
