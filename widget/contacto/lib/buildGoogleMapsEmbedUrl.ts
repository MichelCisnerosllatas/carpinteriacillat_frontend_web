// widget/contacto/lib/buildGoogleMapsEmbedUrl.ts
//
// El backend guarda coordenadas (latitude/longitude de company_branches),
// no un iframe completo. El mapa embebido se arma aca, en el frontend.
// Ver FRONTEND_NEXTJS_SITE_V3.md #30.

export function buildGoogleMapsEmbedUrl(latitude: number, longitude: number): string {
  return `https://www.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`;
}
