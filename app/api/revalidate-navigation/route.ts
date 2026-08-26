// app/api/revalidate-navigation/route.ts
//
// Que es esto: un "Route Handler" de Next.js — una URL propia de ESTE
// proyecto (no del backend) que, al visitarla, le dice a Next "la
// navegacion que tenias guardada en cache ya no vale, la proxima vez que
// alguien entre al sitio, traela de nuevo".
//
// Para que sirve: en app/layout.tsx, el fetch de la navegacion quedo
// guardado en cache SIN vencimiento (ver el comentario de
// getInitialNavigations en ese archivo) — nunca se vuelve a pedir solo.
// Esta es la unica forma de que un cambio real (editaste un link en el
// backend) se vea reflejado sin esperar al proximo deploy.
//
// Como se usa: despues de crear/editar/borrar un link de navegacion en el
// backend, hay que visitar (o hacer un fetch/curl a) esta URL UNA vez:
//
//   https://tu-dominio.com/api/revalidate-navigation?secret=EL_SECRETO
//
// Lo ideal a futuro es que el backend llame esta URL automaticamente
// despues de guardar un cambio (asi nadie se tiene que acordar de
// hacerlo a mano) — pero como el backend es otro proyecto, por ahora
// queda como un paso manual.
//
// El "secret" evita que cualquiera en internet pueda estar
// invalidando tu cache a cada rato (eso obligaria a tu servidor a
// pedirle datos al backend en cada visita, como si el cache no
// existiera). Se define en .env como REVALIDATE_SECRET (NO lleva el
// prefijo NEXT_PUBLIC_ a proposito: esas variables se filtran al
// navegador, y esta tiene que quedar SOLO en el servidor).

import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const secret = new URL(request.url).searchParams.get("secret");

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ success: false, message: "Secret invalido" }, { status: 401 });
  }

  // El segundo argumento ("max") es un requisito nuevo de esta version de
  // Next.js: le dice "invalida el cache de mayor duracion posible para
  // esta etiqueta" (coherente con que en app/layout.tsx no le pusimos
  // fecha de vencimiento al fetch — queda cacheado "para siempre" hasta
  // que esto se llame).
  revalidateTag("navigation", "max");

  return NextResponse.json({ success: true, revalidated: "navigation" });
}
