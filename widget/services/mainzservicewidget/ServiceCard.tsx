type ServiceCardProps = {
    title: string;
    description: string;
    iconClass: string;
    iconBgClass?: string;
    iconColorClass?: string;
};

export default function ServiceCard({
    title,
    description,
    iconClass,
    iconBgClass = "bg-amber-50",
    iconColorClass = "text-amber-700",
}: ServiceCardProps) {
    return (
        <div
            className={[
                "w-full text-left rounded-2xl border p-6 bg-white transition-all",
                "border-slate-200",
                "hover:border-amber-400 hover:shadow-md hover:-translate-y-[1px]",
                "hover:ring-1 hover:ring-amber-200",
            ].join(" ")}
        >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${iconBgClass}`}>
                <i className={`${iconClass} text-[26px] ${iconColorClass}`} />
            </div>

            <h3 className="mt-5 text-[16px] font-bold text-slate-900">{title}</h3>
            <p className="mt-2  text-sm text-slate-600">{description}</p>
        </div>
    );
}
