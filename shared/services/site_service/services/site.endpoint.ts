// shared/services/site_service/services/site.endpoint.ts
//
// /v1/public/site es SOLO lectura. A proposito no existen post/put/patch/
// delete aca: administrar navegacion/secciones/botones/items/imagenes es
// responsabilidad de un panel de intranet aparte (rutas /v1/intranet/...),
// no de este proyecto web publico.

export const SITE_ENDPOINTS = {
  v1: {
    get: "/v1/public/site",
  },
};
