// shared/lib/imageOptimization.ts
//
// ¿Puede next/image OPTIMIZAR esta foto (redimensionarla y servirla en webp desde el propio
// sitio)? Se usa como `unoptimized={!canOptimizeImage(url)}` en cada <Image> cuya URL viene
// del backend (fotos que sube el admin desde la intranet).
//
// Por qué hace falta: next/image solo optimiza fotos de dominios autorizados en next.config.ts
// (remotePatterns), no optimiza SVG, y en Next 16 tampoco optimiza fotos servidas desde una IP
// privada (el backend local, ej. http://192.168.18.5:8000) por seguridad. En esos casos la foto
// NO se veía. Con `unoptimized` la foto se muestra tal cual (como un <img> normal), así funciona
// venga de donde venga: storage local del backend, Unsplash, Pinterest u otro servicio externo.
//
// Se optimizan solo:
//   - archivos propios de /public ("/img/logo.png"),
//   - los dominios públicos conocidos (OPTIMIZABLE_HOSTS; deben estar también en next.config.ts).
// Todo lo demás se muestra sin optimizar.

// Dominios públicos que next/image sí puede optimizar (los mismos de next.config.ts → remotePatterns).
const OPTIMIZABLE_HOSTS = [
    "demo.carpinteriacillat.com",
    "api.dev.carpinteriacillat.com",
    "api.carpinteriacillat.com",
];

// localhost o IP privada (red local): Next 16 no optimiza fotos que vienen de ahí.
function isPrivateHost(hostname: string): boolean {
    if (hostname === "localhost" || hostname.endsWith(".local") || hostname.endsWith(".test")) return true;
    const parts = hostname.split(".").map(Number);
    if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return false;
    const [a, b] = parts;
    return a === 10 || a === 127 || (a === 192 && b === 168) || (a === 172 && b >= 16 && b <= 31);
}

export function canOptimizeImage(url: string | null | undefined): boolean {
    if (!url) return false;

    // Archivo propio de la carpeta /public del sitio
    if (url.startsWith("/") && !url.startsWith("//")) return !url.toLowerCase().split("?")[0].endsWith(".svg");

    let parsed: URL;
    try {
        parsed = new URL(url);
    } catch {
        return false;
    }

    if (parsed.pathname.toLowerCase().endsWith(".svg")) return false;
    if (isPrivateHost(parsed.hostname)) return false;
    return OPTIMIZABLE_HOSTS.includes(parsed.hostname);
}
