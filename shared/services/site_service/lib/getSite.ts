// shared/services/site_service/lib/getSite.ts
//
// UNICO punto de entrada HTTP para leer el sitio. Esta funcion corre en el
// SERVIDOR de Next.js (se llama desde Server Components: app/layout.tsx,
// app/page.tsx, etc — nunca desde "use client"). Hace una sola peticion a
//
//   GET /v1/public/site
//
// en Laravel, y devuelve el JSON crudo (SiteDataDto) tal cual: navegacion +
// secciones + botones + items + detalles + imagenes de TODO el sitio en un
// solo payload. A partir de aca, cada consumidor (layout, una pagina, un
// SectionRenderer en fases siguientes) se encarga de "repartir"/serializar
// ese mismo JSON en la parte que necesita — no vuelve a pedirlo.
//
// IMPORTANTE: layout.tsx y cualquier page.tsx que necesite el sitio deben
// llamar a ESTA MISMA funcion (no crear variantes tipo getSiteForLayout(),
// getSiteForHome(), etc). Next.js dedupea automaticamente fetch() con las
// mismas opciones DENTRO DE UN MISMO RENDER (esto sigue pasando aunque no
// haya cache de por medio, ver mas abajo), asi que aunque layout.tsx y una
// page.tsx la llamen por separado, en la practica es UNA sola peticion de
// red por carga de pagina — pero solo si ambas usan exactamente las mismas
// opciones, por eso no se debe duplicar esta funcion.
//
// CACHE: "force-cache" EXPLICITO. Desde Next.js 15, fetch() ya NO cachea
// por defecto (se comporta como "no-store" salvo que se pida lo
// contrario), asi que omitir la opcion no alcanza — hay que pedirlo a
// mano. Un cambio en el intranet se refleja recien en el proximo
// build/redeploy o reinicio del server — por ahora eso es aceptable (la
// sincronizacion en vivo llegara mas adelante via WebSocket). A cambio,
// esta es la UNICA peticion real que le pega a Laravel: layout.tsx la
// dispara una vez y Next sirve esa misma respuesta desde su Data Cache a
// cualquier otro llamador (otras paginas, generateMetadata, otros
// visitantes) sin volver a tocar el backend en cada navegacion.
import { siteService } from "../services/site.service";
import type { SiteDataDto } from "../model/siteget.dto";

export async function getSite(): Promise<SiteDataDto | null> {
  try {
    const response = await siteService.get({
      cache: "force-cache",
    });

    return response.data;
  } catch (error) {
    // Sin este log, si esto falla no hay forma de saber por que (el catch
    // se "tragaria" el error en silencio). Aparece en la consola de donde
    // corre "npm run dev" / el servidor de produccion, NO en la consola
    // del navegador (esto corre en el servidor).
    console.error("[site] No se pudo cargar /v1/public/site:", error);

    // null = la peticion FALLO. Se distingue a proposito de "vino vacio"
    // (array []): los consumidores (Header/Footer) necesitan saber si
    // "no hay datos porque fallo" para poder mostrar su fallback fijo.
    return null;
  }
}
