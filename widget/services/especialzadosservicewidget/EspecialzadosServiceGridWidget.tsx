import EspecialzadosServiceCardWidget from "@/widget/services/especialzadosservicewidget/EspecialzadosServiceCardWidget";
import {
    EspecialzadosServiceCardWidgetProps
} from "@/widget/services/especialzadosservicewidget/type/EspecialzadosServiceCardWidgetProps";

type EspecialzadosServiceGridWidgetProps = {
    items: EspecialzadosServiceCardWidgetProps[];
};

export default function EspecialzadosServiceGridWidget({ items }: EspecialzadosServiceGridWidgetProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-4">
            {items.map((it, index) => {
                return(
                    <EspecialzadosServiceCardWidget
                        key={index}
                        title={it.title}
                        iconClass={it.iconClass}
                        iconColorClass={it.iconColorClass}
                    />
                );
            })}
        </div>
    );
}
