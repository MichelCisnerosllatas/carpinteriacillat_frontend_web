// shared/ui/cover-image/CoverImage.tsx
//
// Una foto que llena todo su contenedor (object-cover), como el <image-slot> del diseño.
// El contenedor debe tener "position: relative" (o absolute) y un tamaño propio.
//
// Por qué <img> normal y no next/image: estas fotos se apilan en "capas" que se cruzan con
// opacidad (PhotoLayers, abanicos, libro 3D) y vienen de dominios que cambian (storage del
// backend, placehold.co). Con <img> no hay que registrar cada dominio en next.config.ts ni
// pelear con el wrapper de next/image en las transiciones. Si no hay URL no se pinta nada y
// se ve el color de fondo ("tono") del contenedor.

type Props = {
    url: string | null | undefined;
    alt: string;
    id?: string;
    style?: React.CSSProperties;
    // "eager" para la foto principal que se ve apenas carga la página.
    loading?: "lazy" | "eager";
};

export default function CoverImage({ url, alt, id, style, loading = "lazy" }: Props) {
    if (!url) return null;

    return (
        // eslint-disable-next-line @next/next/no-img-element -- ver comentario de arriba
        <img
            id={id}
            src={url}
            alt={alt}
            loading={loading}
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
            style={style}
        />
    );
}
