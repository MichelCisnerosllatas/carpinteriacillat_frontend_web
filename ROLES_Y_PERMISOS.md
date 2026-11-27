# Roles y permisos en la web pública (landing)

> Resumen: **esta aplicación no tiene roles ni permisos**, y está bien así.
> Los roles y permisos viven en el **backend** y se usan en el **intranet** y en la **app móvil**.

## ¿Por qué la web no tiene permisos?

La web es el sitio público de la carpintería. Cualquier visitante la puede ver y no hay
un "usuario" que inicie sesión para entrar a una zona privada.

Todo lo que consume del backend son rutas **públicas** (sin token):

| Endpoint | Para qué |
|---|---|
| `GET /v1/public/site` | Contenido del sitio (navegación, secciones, footer, alertas…) |
| `POST /v1/public/contact_message` | Formulario de contacto (límite 5 por minuto) |
| `POST /v1/public/testimony` | Dejar un testimonio (queda pendiente de moderación) |
| `/v1/public/chatbot/*` | ChatBot (límite 30 por minuto) |

Como estas rutas no piden token, el backend **no** les aplica el middleware `permission:`.

## ¿Y el login con Google?

El botón de Google (Firebase) que aparece en la web **no da acceso a nada**:
solo sirve para rellenar el nombre y el correo del formulario de contacto.
No se envía ningún token al backend.

## ¿Y el modo Preview (`/preview`)?

La página `/preview` se carga dentro de un `iframe` del **intranet** para ver los cambios
antes de guardarlos. No usa token: solo acepta mensajes (`postMessage`) que vengan del
dominio del intranet (`NEXT_PUBLIC_INTRANET_URL`) y no guarda nada.

Quién puede **editar y guardar** ese contenido lo controla el intranet y el backend con
sus permisos (por ejemplo `sections.update`, `footer.update`). La web solo muestra.

## ¿Dónde está la documentación de permisos?

- Backend: `carpinteriacillat_backend/ROLES_Y_PERMISOS.md` (middleware `permission:`, tablas, cómo proteger una ruta).
- Intranet: `carpinteriacillat_intranet_frontend/ROLES_Y_PERMISOS.md` (`useCan`, `<Can>`, sidebar, pantalla de permisos).
- Móvil: `carpinteriacillat_mobile/ROLES_Y_PERMISOS.md` (`PermissionService`, pestañas y menú).

## ¿Qué hago si algún día la web necesita login?

1. Crear en el backend una plataforma nueva (por ejemplo `web`) en `config/permissions.php`
   y su scope en `AppServiceProvider` (`Passport::tokensCan`).
2. Crear rutas protegidas con `auth:api` + `permission:...`.
3. Seguir el mismo patrón que el intranet (`useCan` / `<Can>`).
