//widget/services/houseservicewidget/ServiceGridHouseWidget.tsx
import ServiceCardHouseWidget from "@/widget/services/houseservicewidget/ServiceCardHouseWidget";
import {ServiceCardHouseWidgetProps} from "@/widget/services/houseservicewidget/type/ServiceCardHouseWidgetProps";

type ServiceGridHouseWidgetProps = {
    items: ServiceCardHouseWidgetProps[];
}

export default function ServiceGridHouseWidget({ items }: ServiceGridHouseWidgetProps){
    return(
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 my-4">
            {items.map((i, index) => {
                return <ServiceCardHouseWidget
                    key={index}
                    title={i.title}
                    listadescripcion={i.listadescripcion}
                    icono={i.icono}
                />
            })}
        </div>
    );
}