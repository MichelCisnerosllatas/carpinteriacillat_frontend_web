//widget/services/houseservicewidget/ServiceCardHouseWidget.tsx
import {ServiceCardHouseWidgetProps} from "@/widget/services/houseservicewidget/type/ServiceCardHouseWidgetProps";

export default function ServiceCardHouseWidget({
   title = "titulo",
   listadescripcion,
   icono
} : ServiceCardHouseWidgetProps){
    return(
        <div className={[
            "w-full text-left rounded-2xl border p-6 bg-white transition-all",
            "border-slate-200",
            "hover:border-amber-400 hover:shadow-md hover:-translate-y-[1px]",
            "hover:ring-1 hover:ring-amber-200",
        ].join(" ")}>
            <i className={`${icono} text-[26px] text-orange-400`} />
            <h3 className="mt-5 text-xl font-bold text-slate-900">{title}</h3>
            <ul className="mt-4 list-disc list-inside space-y-2">
                {listadescripcion?.map((item, index) => (
                    <li key={index} className="text-slate-600">
                        {item.title}
                    </li>
                ))}
            </ul>
        </div>
    );
}
