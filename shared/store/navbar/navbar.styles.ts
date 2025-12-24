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
};

export const NAVBAR_STYLES = {
    base: {
        bgTransparent: "bg-transparent",
        bgSolid: "bg-red-700 backdrop-blur-md",

        // ✅ aquí defines el color de links según scroll
        linkTransparent: "text-white",
        linkTransparentHover: "hover:text-[#f5c400]",
        linkSolid: "text-white",
        linkSolidHover: "hover:text-[#f5c400]",

        buttonBg: "bg-[#f5c400] hover:bg-[#e7b700]",
        buttonText: "text-black",
        mobileBg: "bg-white",
        ring: "ring-1 ring-black/10",
    },

    inner: {
        bgTransparent: "bg-white/85 backdrop-blur-md",
        bgSolid: "bg-white/95 backdrop-blur-md",

        linkTransparent: "text-black",
        linkTransparentHover: "hover:text-[#f5c400]",
        linkSolid: "text-black",
        linkSolidHover: "hover:text-[#f5c400]",

        buttonBg: "bg-[#f5c400] hover:bg-[#e7b700]",
        buttonText: "text-black",
        mobileBg: "bg-white",
        ring: "ring-1 ring-black/10",
    },
} as const;

export type NavbarStyleKey = keyof typeof NAVBAR_STYLES;
