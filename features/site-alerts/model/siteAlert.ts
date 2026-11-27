// features/site-alerts/model/siteAlert.ts
//
// Los tipos de una alerta viven en shared (siteAlert.dto.ts) porque también los usa
// el DTO del sitio, y shared no debe importar de features. Este archivo solo los
// reexporta para que el feature los siga importando desde "../model/siteAlert".
export type {
    SiteAlertDto,
    SiteAlertStyle,
    SiteAlertAlign,
    SiteAlertTrailing,
    SiteAlertScrollBehavior,
} from "@/shared/services/site_service/model/siteAlert.dto";
