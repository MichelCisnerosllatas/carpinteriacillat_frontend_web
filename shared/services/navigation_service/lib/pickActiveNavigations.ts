// shared/services/navigation_service/lib/pickActiveNavigations.ts
//
// La API de navegacion puede devolver items desactivados (navigation_state
// !== 1) o desordenados. Esta funcion se usa en 2 lugares que necesitan
// filtrar y ordenar EXACTAMENTE igual:
//   1) app/layout.tsx     -> el fetch que se hace en el SERVIDOR
//   2) useNavigationStore -> el fetch que se hace en el NAVEGADOR (respaldo)
// Se separo en su propia funcion para no tener la misma logica copiada y
// pegada en los dos lugares (si un dia cambia el criterio de orden, se
// cambia aca una sola vez).

import type { NavigationApiItem } from '../model/navigationget.dto'

export function pickActiveNavigations(items: NavigationApiItem[]): NavigationApiItem[] {
  // No confiamos ciegamente en que el backend ya filtro por "state" (el
  // query param que le mandamos puede ser ignorado): se valida de nuevo
  // aca para que SOLO se muestren los links activos.
  const active = items.filter((item) => item.navigation_state === 1)

  // No mutamos el array original (items.sort() lo haria) porque a veces
  // React/Zustand esperan que los arrays no se modifiquen "in place".
  return [...active].sort((a, b) => a.navigation_order - b.navigation_order)
}
