//widget/services/houseservicewidget/type/ServiceCardHouseWidgetProps.ts
import {DescripcionType} from "@/widget/services/houseservicewidget/type/DescripcionType";

export type ServiceCardHouseWidgetProps = {
    title: string;
    listadescripcion?: DescripcionType[],
    icono?: string
}