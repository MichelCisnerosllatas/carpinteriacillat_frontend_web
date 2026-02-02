import {
    EspecialzadosServiceCardWidgetProps
} from "@/widget/services/especialzadosservicewidget/type/EspecialzadosServiceCardWidgetProps";

export default function EspecialzadosServiceCardWidget({
    title,
    iconClass,
    iconColorClass = "text-amber-700",
}: EspecialzadosServiceCardWidgetProps) {
    return (
        <div
            className={[
                "w-full text-center rounded-2xl border p-6 bg-white transition-all",
                "border-slate-200",
                "hover:border-yellow-300 hover:shadow-md hover:-translate-y-[1px]",
                "hover:ring-1 hover:ring-amber-200",
            ].join(" ")}
        >
            <div className={`w-full h-14 rounded-xl flex items-center justify-center`}>
                <i className={`${iconClass} text-[26px] ${iconColorClass}`} />
            </div>

            <h3 className="mt-5 text-[14px] font-bold text-slate-900">{title}</h3>
        </div>
    );
}