import { getSite } from "@/shared/services/site_service/lib/getSite";
import { findSiteNavigationByUrl } from "@/shared/services/site_service/lib/findSiteNavigation";
import MainServices from "@/features/service/ui/MainServices";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "CILLAT | Servicios",
};

// Server Component: mismo patron que app/page.tsx — llama a getSite() (el
// mismo fetch cacheado que ya usa app/layout.tsx, Next lo dedupea dentro
// del mismo render) y selecciona solo la navegacion "/services".
export default async function ServicesPage() {
    const site = await getSite();   
    if (!site) {
        return <MainServices navigation={null} />;
    }

    const navigation = findSiteNavigationByUrl(site.navigations, "/services") ?? null;

    return <MainServices navigation={navigation} />;
}
