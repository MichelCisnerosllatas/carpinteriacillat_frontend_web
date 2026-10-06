//widget/services/houseservicewidget/ServiceGridHouseWidget.tsx
import ServiceCardHouseWidget from "@/widget/services/houseservicewidget/ServiceCardHouseWidget";
import {ServiceCardHouseWidgetProps} from "@/widget/services/houseservicewidget/type/ServiceCardHouseWidgetProps";
import { previewAnchorId, PREVIEW_ANCHOR_STYLE } from "@/shared/lib/previewAnchor";

type ServiceGridHouseWidgetProps = {
    items: ServiceCardHouseWidgetProps[];
}

export default function ServiceGridHouseWidget({ items }: ServiceGridHouseWidgetProps){
    return(
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 my-4">
            {items.map((i, index) => {
                return (
                    <div key={index} id={previewAnchorId("section-item", i.id)} style={PREVIEW_ANCHOR_STYLE}>
                        <ServiceCardHouseWidget
                            title={i.title}
                            listadescripcion={i.listadescripcion}
                            icono={i.icono}
                        />
                    </div>
                );
            })}
        </div>
    );
}