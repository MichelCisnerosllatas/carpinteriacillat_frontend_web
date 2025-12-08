// widget/header/Alert1.tsx
export default function Alert1() {
    return (
        <div
            id="fixedAlert"
            className="bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 text-center alert-slide transition-all duration-300"
        >
            <div className="container mx-auto flex items-center justify-center gap-3">
                <i className="fas fa-star animate-spin" />
                <span className="font-semibold">
          ¡PROMOCIÓN ESPECIAL! 15% de descuento en cocinas integrales
        </span>
                <i className="fas fa-star animate-spin" />
            </div>
        </div>
    );
}
