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
            // NOTA: el backend en LOCAL corre en una IP de red (ver
            // NEXT_PUBLIC_CORE_STORAGE_URL_LOCAL en .env) que cambia segun
            // a que red te conectes — por eso NO se hardcodea aca. Si en
            // local empiezas a ver este mismo error con una imagen que
            // viene de esa IP (ej. "192.168.x.x"), agrega esa IP puntual
            // aca temporalmente, o mejor: pedile al backend un hostname
            // estable (ej. "carpinteriacillat.test" con Laragon) en vez
            // de la IP.
        ],
    },
    output: 'standalone',
};

export default nextConfig;
