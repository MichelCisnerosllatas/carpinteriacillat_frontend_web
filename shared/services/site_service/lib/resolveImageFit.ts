// shared/services/site_service/lib/resolveImageFit.ts
//
// El backend guarda en sections_images.fix como debe encajar la imagen
// dentro de su contenedor (equivalente a la propiedad CSS object-fit):
// "fill" | "cover" | "contain". Este helper lo traduce a la clase de
// Tailwind correspondiente. Si viene null o un valor que no reconocemos,
// cae en "object-cover" — el comportamiento que ya tenia todo el proyecto
// antes de que este campo existiera, y el default mas razonable para una
// foto (recorta pero no distorsiona la imagen).

const FIT_CLASS = {
  fill: "object-fill",
  cover: "object-cover",
  contain: "object-contain",
} as const;

type ImageFit = keyof typeof FIT_CLASS;

export function resolveImageFit(fix: string | null | undefined): string {
  if (fix && fix in FIT_CLASS) {
    return FIT_CLASS[fix as ImageFit];
  }

  return FIT_CLASS.cover;
}
