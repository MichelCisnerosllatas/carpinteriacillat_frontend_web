import {
    EspecialzadosServiceCardWidgetProps
} from "@/widget/services/especialzadosservicewidget/type/EspecialzadosServiceCardWidgetProps";

export default function EspecialzadosServiceCardWidget({
    title,
    iconClass,
    iconColorClass = "text-brand-gold-dark",
}: EspecialzadosServiceCardWidgetProps) {
    return (
        <div
            className={[
                "w-full text-center rounded-2xl border p-6 bg-white transition-all",
                "border-slate-200",
                "hover:border-brand-gold hover:shadow-md hover:-translate-y-[1px]",
                "hover:ring-1 hover:ring-brand-gold/30",
            ].join(" ")}
        >
            <div className={`w-full h-14 rounded-xl flex items-center justify-center`}>
                <i className={`${iconClass} text-[26px] ${iconColorClass}`} />
            </div>

            <h3 className="mt-5 text-[14px] font-bold text-slate-900">{title}</h3>
        </div>
    );
}