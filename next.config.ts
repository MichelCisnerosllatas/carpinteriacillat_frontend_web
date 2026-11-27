import type { NextConfig } from "next";

// Hosts del backend tomados del .env (storage y api de cada entorno), en vez de escribir una IP
// a mano: antes estaba fija "192.168.18.32" y, al cambiar la IP del backend, las fotos dejaban de
// verse. Ahora basta con cambiar el .env (y reiniciar `npm run dev`: este archivo se lee al arrancar).
// Nota: las fotos que vienen de una IP privada (backend local) igual se muestran SIN optimizar
// (ver shared/lib/imageOptimization.ts): Next 16 no optimiza imágenes de IPs privadas.
const backendUrls = [
    process.env.NEXT_PUBLIC_CORE_STORAGE_URL_LOCAL,
    process.env.NEXT_PUBLIC_CORE_STORAGE_URL_DEVELOPMENT,
    process.env.NEXT_PUBLIC_CORE_STORAGE_URL_PRODUCTION,
    process.env.NEXT_PUBLIC_CORE_API_URL_LOCAL,
    process.env.NEXT_PUBLIC_CORE_API_URL_DEVELOPMENT,
    process.env.NEXT_PUBLIC_CORE_API_URL_PRODUCTION,
];

// URL del .env → patrón de next/image (sin fijar puerto: el backend local cambia de puerto)
function toRemotePattern(url: string | undefined) {
    if (!url) return null;
    try {
        const { protocol, hostname } = new URL(url);
        return { protocol: protocol.replace(":", "") as "http" | "https", hostname };
    } catch {
        return null;
    }
}

const envPatterns = backendUrls
    .map(toRemotePattern)
    .filter((p): p is { protocol: "http" | "https"; hostname: string } => p !== null);

const nextConfig: NextConfig = {
    images: {
        // next/image exige que cada dominio EXTERNO de donde vengan imagenes este autorizado aca
        // (seguridad: evita que el optimizador de imagenes procese cualquier URL arbitraria).
        // Las fotos de dominios que NO estan aca igual se ven: los componentes usan
        // `unoptimized={!canOptimizeImage(url)}` (shared/lib/imageOptimization.ts) y en ese caso
        // la foto se muestra tal cual, sin pasar por el optimizador.
        remotePatterns: [
            { protocol: "https", hostname: "i.pinimg.com" },
            // Fotos reales del sitio ya alojadas (las usa el seeder del backend)
            { protocol: "https", hostname: "demo.carpinteriacillat.com" },
            { protocol: "https", hostname: "placehold.co" },
            // Storage del backend en desarrollo/produccion
            { protocol: "https", hostname: "api.dev.carpinteriacillat.com" },
            { protocol: "https", hostname: "api.carpinteriacillat.com" },
            // Hosts del backend definidos en el .env (local, desarrollo y produccion)
            ...envPatterns,
        ],
    },
    output: 'standalone',
};

export default nextConfig;
