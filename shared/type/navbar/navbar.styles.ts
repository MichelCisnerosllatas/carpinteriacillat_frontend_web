export type NavbarFixedStyle = {
    // fondo del navbar
    bgTransparent: string;
    bgSolid: string;

    // links cuando navbar está transparente
    linkTransparent: string;
    linkTransparentHover: string;

    // links cuando navbar está sólido (scroll)
    linkSolid: string;
    linkSolidHover: string;

    // CTA
    buttonBg: string;
    buttonText: string;

    mobileBg: string;
    ring?: string;

    mobileLink: string;
    mobileLinkHover: string;
    mobileLinkBorder: string;
    mobileCtaBg: string;
    mobileCtaText: string;

    mobileMenuBtn: string;          // color/base del botón
    mobileMenuBtnOpen: string;      // color cuando está abierto (X)
    mobileMenuBtnHover?: string;    // opcional hover
};

export const NAVBAR_STYLES = {
    base: {
        bgTransparent: "bg-transparent",
        bgSolid: "bg-brand-red backdrop-blur-md",

        // ✅ aquí defines el color de links según scroll
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
        mobileMenuBtnOpen: "text-brand-gold", // X amarilla marca
        mobileMenuBtnHover: "hover:text-brand-gold",
    },

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

export type NavbarStyleKey = keyof typeof NAVBAR_STYLES;
