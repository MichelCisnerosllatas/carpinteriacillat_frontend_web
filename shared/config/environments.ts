export const APP_ENVS = ["local", "development", "production"] as const;
export type AppEnv = (typeof APP_ENVS)[number];

function isAppEnv(value: string | undefined): value is AppEnv {
  return (APP_ENVS as readonly string[]).includes(value ?? "");
}

type UrlsByEnv = Record<AppEnv, string>;

// Un backend puede exponer mas de una URL base (la API en si, y ademas
// dominios de apoyo que comparten el mismo entorno: storage de imagenes,
// documentos, etc). Por eso cada backend es un mapa de "grupo de URL" -> urls.
type BackendConfig = Record<string, UrlsByEnv>;

const backends = {
  core: {
    // SOLO el host, sin version. La version va en cada endpoint
    // (features/<feature>/endpoints/<nombre>/*.endpoint.ts), porque un mismo
    // backend puede tener endpoints en distintas versiones al mismo tiempo.
    api: {
      local: "http://10.36.102.211:8000",
      development: "", // TODO: URL del entorno development del backend "core"
      production: "", // TODO: URL del entorno production del backend "core"
    },
    // Otro grupo de URL del MISMO backend "core" (imagenes, documentos, etc).
    // Usa el mismo interruptor NEXT_PUBLIC_CORE_ENV que "api", porque vive
    // en el mismo dominio/servidor, solo que en otra ruta o subdominio.
    storage: {
      local: "http://10.36.102.211:8000/storage",
      development: "",
      production: "",
    },
  },
  // Para agregar un nuevo backend (ej. "billing"), sumar otra entrada aca
  // con sus grupos de URL, y otra linea en `rawEnvByBackend` mas abajo
  // con su propia variable NEXT_PUBLIC_<NOMBRE>_ENV. Nada mas que tocar.
  // billing: {
  //   api: {
  //     local: "http://10.36.102.212:8001/api/v1",
  //     development: "",
  //     production: "",
  //   },
  // },
} satisfies Record<string, BackendConfig>;

export type BackendName = keyof typeof backends;
export type UrlKind = "api" | "storage";

// Cada backend lee SU PROPIA variable de entorno (interruptor independiente).
// El acceso tiene que ser literal (process.env.NEXT_PUBLIC_X, no dinamico)
// porque Next.js solo puede inlinear en el bundle del cliente las variables
// que encuentra escritas asi, de forma estatica, en el codigo.
const rawEnvByBackend: Record<BackendName, string | undefined> = {
  core: process.env.NEXT_PUBLIC_CORE_ENV,
  // billing: process.env.NEXT_PUBLIC_BILLING_ENV,
};

function resolveEnv(backend: BackendName): AppEnv {
  const raw = rawEnvByBackend[backend];

  if (isAppEnv(raw)) {
    return raw;
  }

  throw new Error(
    `Variable de entorno invalida o no definida para el backend "${backend}": "${raw}". ` +
      `Valores permitidos: ${APP_ENVS.join(", ")}. Corre "npm run env:select" para configurarlo.`
  );
}

export function getBackendUrl(backend: BackendName, kind: UrlKind = "api"): string {
  const env = resolveEnv(backend);
  const group = (backends[backend] as Record<UrlKind, UrlsByEnv | undefined>)[kind];
  const url = group?.[env];

  if (!url) {
    throw new Error(
      `No hay URL "${kind}" configurada para el backend "${backend}" en el entorno "${env}". ` +
        `Revisa shared/config/environments.ts`
    );
  }

  return url;
}
