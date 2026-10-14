// features/gallery/ui/work-gallery/WorkGallery.tsx
//
// Página Galería (section_type "work_gallery"): cabecera, buscador, fila de categorías,
// filtros de Madera y Estilo, fichas de filtros activos y la grilla de trabajos.
//
// - Textos de cabecera: section_subtitle / section_title / section_description (intranet).
// - Trabajos: site.works (los muebles publicados en la galería desde el intranet).
// - Filtros: guardados en la URL (?q=&cat=&mad=&est=, ver useGalleryFilters.ts). Por usar
//   useSearchParams, este componente va dentro de un <Suspense> (ver SectionRenderer.tsx).
"use client";

import { useState } from "react";
import Container from "@/shared/ui/container/Container";
import { headingStyles as hs } from "@/shared/components/section_heading/sectionHeading.styles";
import GallerySearch from "./GallerySearch";
import CategoryTiles, { type CategoryTile } from "./category-tiles/CategoryTiles";
import FilterDropdown, { type FilterOption } from "./FilterDropdown";
import ActiveFilterChips from "./ActiveFilterChips";
import WorkCard from "./WorkCard";
import GalleryEmptyState from "./GalleryEmptyState";
import { useSiteWorks } from "@/shared/store/site/useSiteWorks";
import { getWorkPhotos } from "@/shared/services/site_service/lib/workPhotos";
import { useGalleryFilters } from "@/features/gallery/lib/useGalleryFilters";
import { countWorksWith, filterWorks, getOptions, getWorkCategory, type FilterListKey } from "@/features/gallery/lib/filterWorks";
import type { SiteSectionDto, SiteWorkDto } from "@/shared/services/site_service/model/siteget.dto";

type Props = {
    section: SiteSectionDto;
};

// Los dos filtros desplegables (las categorías tienen su propia fila de botones con foto).
type PanelKey = Extract<FilterListKey, "woods" | "styles">;

const PANELS: { key: PanelKey; label: string; title: string }[] = [
    { key: "woods", label: "Madera", title: "Tipo de madera" },
    { key: "styles", label: "Estilo", title: "Estilo del mueble" },
];

function firstPhotoUrl(works: SiteWorkDto[]): string | null {
    for (const work of works) {
        const url = getWorkPhotos(work)[0]?.url;
        if (url) return url;
    }
    return null;
}

export default function WorkGallery({ section }: Props) {
    const works = useSiteWorks();
    const { filters, setQuery, toggle, clear, resetAll } = useGalleryFilters();
    const [openPanel, setOpenPanel] = useState<PanelKey | null>(null);

    const results = filterWorks(works, filters);

    // Conteo de cada categoría = cuántos habría con la búsqueda y los otros filtros, ignorando
    // el filtro de categoría (así el número no cambia al marcar la propia categoría).
    const categoryPool = filterWorks(works, filters, "categories");
    const categoryTiles: CategoryTile[] = getOptions(works, "categories").map((name) => ({
        name,
        count: countWorksWith(categoryPool, "categories", name),
        photoUrl: firstPhotoUrl(works.filter((work) => getWorkCategory(work) === name)),
    }));

    function optionsFor(key: PanelKey): FilterOption[] {
        const pool = filterWorks(works, filters, key);
        return getOptions(works, key).map((value) => ({ value, count: countWorksWith(pool, key, value) }));
    }

    return (
        <div className="il-scope bg-white">
            <section style={{ padding: "calc(var(--app-header-height, 0px) + clamp(2.5rem,6vw,4.5rem)) 0 20px" }}>
                <Container className="flex flex-col gap-6">
                    {/* Cabecera */}
                    <div className="flex flex-wrap items-end justify-between gap-6">
                        <div className="flex flex-col gap-3.5">
                            {section.section_subtitle && (
                                <span className={`${hs.eyebrow} ${hs.eyebrowColor.light}`}>
                                    <span aria-hidden="true" className={hs.eyebrowBar} />
                                    {section.section_subtitle}
                                </span>
                            )}
                            {section.section_title && (
                                <h1 className={`${hs.title} ${hs.pageTitleSize} ${hs.titleColor.light}`}>
                                    {section.section_title}
                                </h1>
                            )}
                        </div>
                        {section.section_description && (
                            <p className={`m-0 max-w-[38ch] text-sm leading-relaxed md:text-base ${hs.descriptionColor.light}`}>{section.section_description}</p>
                        )}
                    </div>

                    <GallerySearch value={filters.query} onChange={setQuery} />

                    {categoryTiles.length > 0 && (
                        <CategoryTiles
                            allCount={categoryPool.length}
                            allPhotoUrl={firstPhotoUrl(works)}
                            tiles={categoryTiles}
                            selected={filters.categories}
                            onToggle={(name) => toggle("categories", name)}
                            onShowAll={() => clear("categories")}
                        />
                    )}

                    {/* "relative": los paneles de Madera/Estilo se ubican debajo de esta fila. */}
                    <div className="relative flex flex-wrap items-center gap-2.5">
                        {PANELS.map((panel) => {
                            const options = optionsFor(panel.key);
                            if (options.length === 0) return null; // nada que filtrar todavía
                            return (
                                <FilterDropdown
                                    key={panel.key}
                                    label={panel.label}
                                    panelTitle={panel.title}
                                    options={options}
                                    selected={filters[panel.key]}
                                    isOpen={openPanel === panel.key}
                                    resultsCount={results.length}
                                    onToggleOpen={() => setOpenPanel(openPanel === panel.key ? null : panel.key)}
                                    onToggleValue={(value) => toggle(panel.key, value)}
                                    onClear={() => clear(panel.key)}
                                    onClose={() => setOpenPanel(null)}
                                />
                            );
                        })}
                        <span aria-hidden="true" className="mx-1 h-6 w-px bg-il-neutro-200" />
                        <ActiveFilterChips
                            filters={filters}
                            resultsCount={results.length}
                            totalCount={works.length}
                            onRemove={toggle}
                            onClearQuery={() => setQuery("")}
                            onResetAll={() => {
                                setOpenPanel(null);
                                resetAll();
                            }}
                        />
                    </div>
                </Container>
            </section>

            <section className="pb-[clamp(3.5rem,8vw,6.5rem)] pt-2">
                <Container>
                    {results.length === 0 ? (
                        <GalleryEmptyState onReset={resetAll} />
                    ) : (
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-x-6 gap-y-7">
                            {results.map((work, i) => (
                                <WorkCard key={work.id_furniture} work={work} index={i} />
                            ))}
                        </div>
                    )}
                </Container>
            </section>
        </div>
    );
}
