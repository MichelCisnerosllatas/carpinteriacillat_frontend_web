import MainWe from "@/features/we/ui/MainWe";
import { getSite } from "@/shared/services/site_service/lib/getSite";
import { findSiteNavigationByUrl } from "@/shared/services/site_service/lib/findSiteNavigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "CILLAT | Nosotros",
};

export default async function WePage() {
    const site = await getSite();
    if (!site) {
        return <MainWe navigation={null} />;
    }

    const navigation = findSiteNavigationByUrl(site.navigations, "/we") ?? null;

    return <MainWe navigation={navigation} />;
}
