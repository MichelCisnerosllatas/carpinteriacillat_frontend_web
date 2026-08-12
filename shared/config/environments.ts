export const APP_ENVS = ["local", "development", "production"] as const;
export type AppEnv = (typeof APP_ENVS)[number];

function isAppEnv(value: string | undefined): value is AppEnv {
  return (APP_ENVS as readonly string[]).includes(value ?? "");
}

type UrlsByEnv = Record<AppEnv, string | undefined>;

// Un backend puede exponer mas de una URL base (la API en si, y ademas
// dominios de apoyo que comparten el mismo entorno: storage de imagenes,
// documentos, etc). Por eso cada backend es un mapa de "grupo de URL" -> urls.
type BackendConfig = Record<string, UrlsByEnv>;

// Las URLs NO se hardcodean aca: viven en .env (ver .env.example) como
// NEXT_PUBLIC_<BACKEND>_<GRUPO>_URL_<ENTORNO>. Esto es lo unico que hay que
// tocar en este archivo al sumar un backend, grupo de URL, o entorno nuevo.
// El acceso a process.env tiene que ser literal (Next.js solo puede inlinear
// en el bundle del cliente las variables que encuentra escritas asi, de
// forma estatica en el codigo, no dinamico) -- por eso no se arma con un loop.
//
// 3 backends de ejemplo, cada uno con sus propios grupos de URL:
// - core: backend real, en uso (api + storage)
// - billing: ejemplo (api + webhooks)
// - media: ejemplo (api + cdn)
const backends = {
  core: {
    // SOLO el host, sin version. La version va en cada endpoint
    // (features/<feature>/endpoints/<nombre>/*.endpoint.ts), porque un mismo
    // backend puede tener endpoints en distintas versiones al mismo tiempo.
    api: {
      local: process.env.NEXT_PUBLIC_CORE_API_URL_LOCAL,
      development: process.env.NEXT_PUBLIC_CORE_API_URL_DEVELOPMENT,
      production: process.env.NEXT_PUBLIC_CORE_API_URL_PRODUCTION,
    },
    // Otro grupo de URL del MISMO backend "core" (imagenes, documentos, etc).
    // Usa el mismo interruptor NEXT_PUBLIC_CORE_ENV que "api", porque vive
    // en el mismo dominio/servidor, solo que en otra ruta o subdominio.
    storage: {
      local: process.env.NEXT_PUBLIC_CORE_STORAGE_URL_LOCAL,
      development: process.env.NEXT_PUBLIC_CORE_STORAGE_URL_DEVELOPMENT,
      production: process.env.NEXT_PUBLIC_CORE_STORAGE_URL_PRODUCTION,
    },
  },
  billing: {
    api: {
      local: process.env.NEXT_PUBLIC_BILLING_API_URL_LOCAL,
      development: process.env.NEXT_PUBLIC_BILLING_API_URL_DEVELOPMENT,
      production: process.env.NEXT_PUBLIC_BILLING_API_URL_PRODUCTION,
    },
    webhooks: {
      local: process.env.NEXT_PUBLIC_BILLING_WEBHOOKS_URL_LOCAL,
      development: process.env.NEXT_PUBLIC_BILLING_WEBHOOKS_URL_DEVELOPMENT,
      production: process.env.NEXT_PUBLIC_BILLING_WEBHOOKS_URL_PRODUCTION,
    },
  },
  media: {
    api: {
      local: process.env.NEXT_PUBLIC_MEDIA_API_URL_LOCAL,
      development: process.env.NEXT_PUBLIC_MEDIA_API_URL_DEVELOPMENT,
      production: process.env.NEXT_PUBLIC_MEDIA_API_URL_PRODUCTION,
    },
    cdn: {
      local: process.env.NEXT_PUBLIC_MEDIA_CDN_URL_LOCAL,
      development: process.env.NEXT_PUBLIC_MEDIA_CDN_URL_DEVELOPMENT,
      production: process.env.NEXT_PUBLIC_MEDIA_CDN_URL_PRODUCTION,
    },
  },
  // Para agregar un backend nuevo: sumar otra entrada aca con sus grupos de
  // URL, otra linea en `rawEnvByBackend` mas abajo con su propia variable
  // NEXT_PUBLIC_<NOMBRE>_ENV, y las variables correspondientes en .env.example.
  // Nada mas que tocar.
} satisfies Record<string, BackendConfig>;

export type BackendName = keyof typeof backends;
export type UrlKind = "api" | "storage" | "webhooks" | "cdn";

// Cada backend lee SU PROPIA variable de entorno (interruptor independiente).
// El acceso tiene que ser literal (process.env.NEXT_PUBLIC_X, no dinamico)
// porque Next.js solo puede inlinear en el bundle del cliente las variables
// que encuentra escritas asi, de forma estatica, en el codigo.
const rawEnvByBackend: Record<BackendName, string | undefined> = {
  core: process.env.NEXT_PUBLIC_CORE_ENV,
  billing: process.env.NEXT_PUBLIC_BILLING_ENV,
  media: process.env.NEXT_PUBLIC_MEDIA_ENV,
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
    const varName = `NEXT_PUBLIC_${backend.toUpperCase()}_${kind.toUpperCase()}_URL_${env.toUpperCase()}`;
    throw new Error(
      `No hay URL "${kind}" configurada para el backend "${backend}" en el entorno "${env}". ` +
        `Definila en .env como ${varName} (ver .env.example).`
    );
  }

  return url;
}
