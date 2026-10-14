export type Testimonial = {
    id: string;
    name: string;
    role: string;
    message: string;
    city?: string;
    rating?: number;
    email?: string;
    photoUrl?: string | null;
    isDelivered?: boolean;
    isVerified?: boolean;
};

// Qué columnas de la tarjeta se muestran — 1 por SECCIÓN (todos los testimonios de la misma
// sección comparten el mismo diseño), no por testimonio individual. Ver
// `lib/getTestimonySettings.ts` para los defaults cuando el backend todavía no tiene fila
// propia de configuración.
export type TestimonySettings = {
    showPhoto: boolean;
    showRating: boolean;
    showCity: boolean;
    showEmail: boolean;
    showDelivered: boolean;
    showVerified: boolean;
};
