import type { ServiceCarouselItem } from "../model/types";

type ServiceCarouselCardProps = {
    item: ServiceCarouselItem;
};

export default function ServiceCarouselCard({ item }: ServiceCarouselCardProps) {
    return (
        <div className="h-full bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4 categoria-card">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                <i className={`${item.iconClass} text-red-600 text-2xl`} />
            </div>
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {item.titulo}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                    {item.descripcion}
                </p>
            </div>
            <div className="mt-auto flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-100 text-amber-700 px-3 py-1 rounded-full uppercase tracking-wider">
                    <i className="fas fa-check-circle text-[10px]" />
                    {item.tag}
                </span>
                <a
                    href="#contacto"
                    className="text-sm font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                    Cotizar
                    <i className="fas fa-arrow-right text-xs" />
                </a>
            </div>
        </div>
    );
}
