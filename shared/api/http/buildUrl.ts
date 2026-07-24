import { getBackendUrl, type BackendName, type UrlKind } from "@/shared/config/environments";

// La version va incluida en el "path" (ej. "/v1/intranet/category"), no como
// parametro aparte: cada archivo *.endpoint.ts organiza sus rutas agrupadas
// por version (v1, v2, ...) y el service elige explicitamente cual usar.
export function buildUrl(backend: BackendName, path: string, urlKind: UrlKind = "api"): string {
  return `${getBackendUrl(backend, urlKind)}${path}`;
}
