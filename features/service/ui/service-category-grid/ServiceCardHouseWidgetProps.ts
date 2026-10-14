// features/service/ui/service-category-grid/ServiceCardHouseWidgetProps.ts
import {DescripcionType} from "@/features/service/ui/service-category-grid/DescripcionType";

export type ServiceCardHouseWidgetProps = {
    id?: number;
    title: string;
    listadescripcion?: DescripcionType[],
    icono?: string
}