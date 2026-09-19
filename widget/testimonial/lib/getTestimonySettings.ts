import type { SiteTestimonySettingsDto } from "@/shared/services/site_service/model/siteget.dto";
import type { TestimonySettings } from "../model/types";

// Mismos defaults que `Testimony_web_setting` (backend) — ver docblock de esa clase / de la
// migración `create_testimony_web_tables`. Se usan cuando la sección todavía no tiene fila
// propia de configuración (`testimony_settings: null` en la respuesta de /v1/public/site).
const DEFAULT_SETTINGS: TestimonySettings = {
    showPhoto: true,
    showRating: true,
    showCity: true,
    showEmail: false,
    showDelivered: true,
    showVerified: true,
};

export function getTestimonySettings(
    dto: SiteTestimonySettingsDto | null | undefined
): TestimonySettings {
    if (!dto) return DEFAULT_SETTINGS;

    return {
        showPhoto: dto.show_photo,
        showRating: dto.show_rating,
        showCity: dto.show_city,
        showEmail: dto.show_email,
        showDelivered: dto.show_delivered,
        showVerified: dto.show_verified,
    };
}
