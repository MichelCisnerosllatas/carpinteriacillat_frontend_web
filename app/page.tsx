//app/page.tsx
import { getSite } from "@/shared/services/site_service/lib/getSite";
import { findSiteNavigationByUrl } from "@/shared/services/site_service/lib/findSiteNavigation";
import MainHome from "@/features/home/ui/MainHome";

// Server Component: llama a getSite() (el MISMO fetch cacheado que ya usa
// app/layout.tsx para Header/Footer — Next lo dedupea dentro del mismo
// render, no se duplica la peticion de red) y de ese mismo JSON selecciona
// solo la navegacion "/" para pasarsela a MainHome.
export default async function HomePage() {
    const site = await getSite(); 
    if (!site) {
        return <MainHome navigation={null} />;
    }

    const navigation = findSiteNavigationByUrl(site.navigations, "/") ?? null;

    return <MainHome navigation={navigation} />;
}
