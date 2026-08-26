// shared/store/navbar/navbar.styles.ts
//
// Este archivo SOLO define colores. No decide cuándo se usa cada paleta
// (eso lo hace navbar.routes.ts) ni cómo se aplica (eso lo hace
// useNavbarStore.ts). Aquí adentro solo hay clases de Tailwind agrupadas
// por "paleta".
//
// ¿Por qué cada paleta tiene versión "Transparent" y "Solid"?
// El header empieza transparente (se ve la imagen de fondo de la página
// detrás) y cuando el usuario hace scroll pasa a un fondo sólido (ver
// "navbarSolid" en widget/header/Navbar.tsx). Cada paleta necesita un
// color de texto/fondo para CADA uno de esos 2 estados, porque un texto
// blanco que se ve bien sobre una foto (transparente) puede desaparecer
// sobre un fondo blanco sólido.

export type NavbarFixedStyle = {
    // Fondo del <nav> completo
    bgTransparent: string; // arriba del todo (sin scroll)
    bgSolid: string;       // con scroll (navbarSolid === true)

    // Color de los links del menú, según el mismo estado de scroll
    linkTransparent: string;
    linkTransparentHover: string;
    linkSolid: string;
    linkSolidHover: string;

    // Botón "Contacto" (siempre visible, no cambia con el scroll)
    buttonBg: string;
    buttonText: string;

    // Menú mobile (el panel a pantalla completa que se abre con el botón ☰)
    mobileBg: string;
    ring?: string; // borde sutil cuando el header está sólido

    mobileLink: string;
    mobileLinkHover: string;
    mobileLinkBorder: string;
    mobileCtaBg: string;
    mobileCtaText: string;

    // Botón hamburguesa (☰ / ✕) en mobile
    mobileMenuBtn: string;          // color normal (menú cerrado)
    mobileMenuBtnOpen: string;      // color cuando el menú está abierto (ícono X)
    mobileMenuBtnHover?: string;
};

// Las 3 paletas disponibles. El nombre de cada una (base, detalle, inner)
// es el mismo "style" que se usa en navbar.routes.ts para elegir cuál
// aplica en cada página.
export const NAVBAR_STYLES = {
    // "base": paginas con un hero grande de fondo oscuro (home, servicios,
    // galeria, nosotros). Texto blanco porque va sobre foto/fondo oscuro.
    base: {
        bgTransparent: "bg-transparent",
        bgSolid: "bg-brand-red backdrop-blur-md",

        linkTransparent: "text-white",
        linkTransparentHover: "hover:text-brand-gold",
        linkSolid: "text-white",
        linkSolidHover: "hover:text-brand-gold",

        buttonBg: "bg-brand-gold hover:bg-brand-gold-dark",
        buttonText: "text-black",

        ring: "ring-1 ring-black/10",
        mobileBg: "bg-gray-900",
        mobileLink: "text-white",
        mobileLinkHover: "hover:text-brand-gold",
        mobileLinkBorder: "border-gray-800",
        mobileCtaBg: "bg-brand-gold hover:bg-brand-gold-dark",
        mobileCtaText: "text-black",

        mobileMenuBtn: "text-white",
        mobileMenuBtnOpen: "text-brand-gold",
        mobileMenuBtnHover: "hover:text-brand-gold",
    },

    // "detalle": paginas internas con fondo claro desde el inicio (ej. el
    // detalle de una foto de galeria). Texto negro porque va sobre fondo
    // claro incluso antes de hacer scroll.
    detalle: {
        bgTransparent: "bg-transparent",
        bgSolid: "bg-white/95 backdrop-blur-md",

        linkTransparent: "text-black",
        linkTransparentHover: "hover:text-brand-gold",
        linkSolid: "text-black",
        linkSolidHover: "hover:text-brand-gold",

        buttonBg: "bg-brand-gold hover:bg-brand-gold-dark",
        buttonText: "text-black",

        ring: "ring-1 ring-black/10",
        mobileBg: "bg-gray-900",
        mobileLink: "text-white",
        mobileLinkHover: "hover:text-brand-gold",
        mobileLinkBorder: "border-gray-800",
        mobileCtaBg: "bg-brand-gold hover:bg-brand-gold-dark",
        mobileCtaText: "text-black",

        mobileMenuBtn: "text-black",
        mobileMenuBtnOpen: "text-brand-gold",
        mobileMenuBtnHover: "hover:text-brand-gold",
    },

    // "inner": estilo por defecto para cualquier pagina que NO este listada
    // en navbar.routes.ts (ver resolveConfig en useNavbarStore.ts). Fondo
    // blanco incluso transparente, pensado para paginas "de contenido"
    // sin hero de foto grande.
    inner: {
        bgTransparent: "bg-white/85 backdrop-blur-md",
        bgSolid: "bg-white/95 backdrop-blur-md",

        linkTransparent: "text-black",
        linkTransparentHover: "hover:text-brand-gold",
        linkSolid: "text-black",
        linkSolidHover: "hover:text-brand-gold",

        buttonBg: "bg-brand-gold hover:bg-brand-gold-dark",
        buttonText: "text-black",

        ring: "ring-1 ring-black/10",
        mobileBg: "bg-gray-900",
        mobileLink: "text-white",
        mobileLinkHover: "hover:text-brand-gold",
        mobileLinkBorder: "border-gray-800",
        mobileCtaBg: "bg-brand-gold hover:bg-brand-gold-dark",
        mobileCtaText: "text-black",

        mobileMenuBtn: "text-black",
        mobileMenuBtnOpen: "text-brand-gold",
        mobileMenuBtnHover: "hover:text-brand-gold",
    },
} as const;

// "base" | "detalle" | "inner" — se calcula automaticamente a partir de las
// keys del objeto de arriba, asi que si agregas una paleta nueva este tipo
// se actualiza solo (no hay que tocarlo a mano).
export type NavbarStyleKey = keyof typeof NAVBAR_STYLES;
