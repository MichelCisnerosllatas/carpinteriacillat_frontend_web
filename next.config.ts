import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        // next/image exige que cada dominio EXTERNO de donde vengan
        // imagenes este autorizado aca a proposito (seguridad: evita que
        // el optimizador de imagenes de Next procese cualquier URL
        // arbitraria). Cada vez que el backend agregue una imagen alojada
        // en un dominio nuevo, hay que sumarlo aca o next/image tira
        // "Invalid src prop ... hostname X is not configured".
        remotePatterns: [
            { protocol: "https", hostname: "i.pinimg.com" },
            // Imagenes de muestra/placeholder que usa el seeder del
            // backend mientras no hay contenido real cargado.
            { protocol: "https", hostname: "demo.carpinteriacillat.com" },
            { protocol: "https", hostname: "placehold.co" },
            // Storage real del backend en desarrollo/produccion (para
            // cuando se empiecen a subir imagenes reales, no solo de
            // muestra).
            { protocol: "https", hostname: "api.dev.carpinteriacillat.com" },
            { protocol: "https", hostname: "api.carpinteriacillat.com" },
            // IP de red del backend en LOCAL (ver NEXT_PUBLIC_CORE_STORAGE_URL_LOCAL en .env) —
            // esta SÍ se hardcodea a propósito (era la excepción que pedía la nota vieja de
            // este archivo): en esta máquina de desarrollo es siempre la misma IP, pero el
            // PUERTO del backend varía según cómo se levante Laragon (se vio responder en 8000
            // y en 8001 en la misma sesión de pruebas) — por eso no se fija `port`, así
            // remotePatterns matchea esa IP sin importar el puerto. Si alguna vez cambia la IP
            // de red (otra red, otra máquina), hay que actualizar este hostname o, mejor, pedirle
            // al backend un hostname estable (ej. "carpinteriacillat.test" con Laragon).
            { protocol: "http", hostname: "192.168.18.32" },
        ],
    },
    output: 'standalone',
};

export default nextConfig;
