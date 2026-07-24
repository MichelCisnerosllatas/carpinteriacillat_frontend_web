import { buildUrl } from "@/shared/api/http/buildUrl";
import type { UrlKind } from "@/shared/config/environments";

// Unico lugar donde aparece el string "core". Los services nunca lo
// vuelven a escribir: importan esta funcion y listo.
export function coreUrl(path: string, urlKind: UrlKind = "api"): string {
  return buildUrl("core", path, urlKind);
}
