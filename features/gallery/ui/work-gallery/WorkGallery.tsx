// features/gallery/ui/work-gallery/WorkGallery.tsx
//
// Página Galería (section_type "work_gallery"): cabecera, buscador, fila de categorías,
// filtros de Tipo, Madera y Estilo, fichas de filtros activos y la grilla de trabajos.
//
// - Textos de cabecera: section_subtitle / section_title / section_description (intranet).
// - Trabajos: site.works (los trabajos del portafolio publicados desde el intranet, de
//   cualquier tipo: Fabricación y Restauración).
// - Filtro «Tipo»: solo si entre los trabajos hay más de un tipo (con uno solo no filtra
//   nada) y el intranet no lo apagó (search.show_filter_type). Guarda la CLAVE del tipo en la URL
//   (?type=restoration) y muestra su nombre (work.type.name).
// - Filtros: guardados en la URL (?q=&type=&cat=&mad=&est=, ver useGalleryFilters.ts). Por usar
//   useSearchParams, este componente va dentro de un <Suspense> (ver SectionRenderer.tsx).
// - Paginación: se muestran los primeros pagination.page_size (12) y «Ver más» agrega otros
//   tantos (LoadMoreButton). La cantidad queda en la URL (?ver=24) y se reinicia al filtrar.
// - Apariencia (display_settings de la sección, ver workGallerySettings.ts): qué se muestra del
//   buscador, filtros, tarjetas y mensaje sin resultados, y sus textos. Se arma UNA vez por
//   render y se pasa a cada parte. Cada elemento lleva su ancla data-el (vista previa).
"use client";

import { useEffect, useRef, useState } from "react";
import Container from "@/shared/ui/container/Container";
import { headingStyles as hs } from "@/shared/components/section_heading/sectionHeading.styles";
import GallerySearch from "./GallerySearch";
import CategoryTiles, { type CategoryTile } from "./category-tiles/CategoryTiles";
import FilterDropdown, { type FilterOption } from "./FilterDropdown";
import ActiveFilterChips from "./ActiveFilterChips";
import WorkCard from "./WorkCard";
import GalleryEmptyState from "./GalleryEmptyState";
import LoadMoreButton from "./LoadMoreButton";
import { useSiteWorks } from "@/shared/store/site/useSiteWorks";
import { getWorkPhotos } from "@/shared/services/site_service/lib/workPhotos";
import { useGalleryFilters } from "@/features/gallery/lib/useGalleryFilters";
import {
    countWorksWith,
    filterWorks,
    getOptions,
    getTypeLabel,
    getWorkCategory,
    type FilterListKey,
    type WorkFilters,
} from "@/features/gallery/lib/filterWorks";
import { getWorkGalleryListingSettings, type GallerySearchSettings } from "@/features/gallery/lib/workGallerySettings";
import type { SiteSectionDto, SiteWorkDto } from "@/shared/services/site_service/model/siteget.dto";

type Props = {
    section: SiteSectionDto;
};

// Los filtros desplegables (las categorías tienen su propia fila de botones con foto).
type PanelKey = Extract<FilterListKey, "types" | "woods" | "styles">;

// Por cada filtro: qué interruptor de la Apariencia lo muestra, de dónde sale el texto del
// botón y su ancla data-el.
type PanelConfig = {
    key: PanelKey;
    title: string;
    showKey: "showFilterType" | "showFilterWood" | "showFilterStyle";
    labelKey: "filterTypeLabel" | "filterWoodLabel" | "filterStyleLabel";
    dataEl: string;
};

const PANELS: PanelConfig[] = [
    { key: "types", title: "Tipo de trabajo", showKey: "showFilterType", labelKey: "filterTypeLabel", dataEl: "gallery-filter-type" },
    { key: "woods", title: "Tipo de madera", showKey: "showFilterWood", labelKey: "filterWoodLabel", dataEl: "gallery-filter-wood" },
    { key: "styles", title: "Estilo del mueble", showKey: "showFilterStyle", labelKey: "filterStyleLabel", dataEl: "gallery-filter-style" },
];

function isPanelOn(search: GallerySearchSettings, panel: PanelConfig): boolean {
    return search[panel.showKey];
}

function firstPhotoUrl(works: SiteWorkDto[]): string | null {
    for (const work of works) {
        const url = getWorkPhotos(work)[0]?.url;
        if (url) return url;
    }
    return null;
}

export default function WorkGallery({ section }: Props) {
    const works = useSiteWorks();
    const { filters: urlFilters, setQuery, toggle, clear, resetAll, shown, setShown } = useGalleryFilters();
    const [openPanel, setOpenPanel] = useState<PanelKey | null>(null);

    // Qué se muestra según el intranet (Configuración → Apariencia).
    const settings = getWorkGalleryListingSettings(section);
    const search = settings.search;

    // El filtro de tipo solo tiene sentido si hay más de un tipo entre los trabajos.
    const typeOptions = getOptions(works, "types");
    const canFilterType = search.showFilterType && typeOptions.length > 1;

    // Si un filtro está apagado, se ignora lo que traiga la URL para él (ej. ?cat=Cocinas con
    // los botones de categorías ocultos): así nunca queda un filtro aplicado sin forma de quitarlo.
    const filters: WorkFilters = {
        query: search.show ? urlFilters.query : "",
        types: canFilterType ? urlFilters.types : [],
        categories: search.showCategoryTiles ? urlFilters.categories : [],
        woods: search.showFilterWood ? urlFilters.woods : [],
        styles: search.showFilterStyle ? urlFilters.styles : [],
    };

    const results = filterWorks(works, filters);

    // Paginación: se ven los primeros `pageSize` y el botón «Ver más» agrega otros tantos.
    // `shown` (de la URL, ?ver=24) se respeta al volver desde el detalle; nunca menos de un bloque.
    const pageSize = settings.pagination.pageSize;
    const visibleCount = Math.min(results.length, Math.max(shown ?? pageSize, pageSize));
    const visibleWorks = results.slice(0, visibleCount);

    // Al cargar más, el foco del teclado pasa al primer trabajo nuevo (para no perder el lugar).
    const gridRef = useRef<HTMLDivElement>(null);
    const focusIndexRef = useRef<number | null>(null);
    useEffect(() => {
        const index = focusIndexRef.current;
        if (index === null) return;
        focusIndexRef.current = null;
        const card = gridRef.current?.children[index];
        card?.querySelector<HTMLElement>("a, button")?.focus({ preventScroll: true });
    }, [visibleCount]);

    function handleLoadMore() {
        focusIndexRef.current = visibleCount;
        setShown(visibleCount + pageSize);
    }

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
        return getOptions(works, key).map((value) => ({
            value,
            // Los tipos se guardan por clave; se muestra su nombre ("Restauración").
            label: key === "types" ? getTypeLabel(works, value) : undefined,
            count: countWorksWith(pool, key, value),
        }));
    }

    // Texto de una ficha de filtro activo (solo los tipos necesitan traducir clave → nombre).
    function chipLabel(key: FilterListKey, value: string): string {
        return key === "types" ? getTypeLabel(works, value) : value;
    }

    return (
        <div className="il-scope bg-white">
            <section style={{ padding: "calc(var(--app-header-height, 0px) + clamp(2.5rem,6vw,4.5rem)) 0 20px" }}>
                <Container className="flex flex-col gap-6">
                    {/* Cabecera */}
                    <div className="flex flex-wrap items-end justify-between gap-6">
                        <div className="flex flex-col gap-3.5">
                            {section.section_subtitle && (
                                <span data-el="header-subtitle" className={`${hs.eyebrow} ${hs.eyebrowColor.light}`}>
                                    <span aria-hidden="true" className={hs.eyebrowBar} />
                                    {section.section_subtitle}
                                </span>
                            )}
                            {section.section_title && (
                                <h1 data-el="header-title" className={`${hs.title} ${hs.pageTitleSize} ${hs.titleColor.light}`}>
                                    {section.section_title}
                                </h1>
                            )}
                        </div>
                        {section.section_description && (
                            <p data-el="header-description" className={`m-0 max-w-[38ch] text-sm leading-relaxed md:text-base ${hs.descriptionColor.light}`}>{section.section_description}</p>
                        )}
                    </div>

                    {search.show && <GallerySearch value={filters.query} onChange={setQuery} placeholder={search.placeholder} />}

                    {search.showCategoryTiles && categoryTiles.length > 0 && (
                        <CategoryTiles
                            allCount={categoryPool.length}
                            allPhotoUrl={firstPhotoUrl(works)}
                            allLabel={search.allLabel}
                            tiles={categoryTiles}
                            selected={filters.categories}
                            onToggle={(name) => toggle("categories", name)}
                            onShowAll={() => clear("categories")}
                        />
                    )}

                    {/* "relative": los paneles de Madera/Estilo se ubican debajo de esta fila. */}
                    <div className="relative flex flex-wrap items-center gap-2.5">
                        {PANELS.map((panel) => {
                            if (!isPanelOn(search, panel)) return null; // filtro apagado en el intranet
                            if (panel.key === "types" && !canFilterType) return null; // un solo tipo: no filtra nada
                            const options = optionsFor(panel.key);
                            if (options.length === 0) return null; // nada que filtrar todavía
                            return (
                                <FilterDropdown
                                    key={panel.key}
                                    label={search[panel.labelKey]}
                                    dataEl={panel.dataEl}
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
                        {/* Rayita separadora: solo si hay algún filtro desplegable a su izquierda. */}
                        {(canFilterType || search.showFilterWood || search.showFilterStyle) && <span aria-hidden="true" className="mx-1 h-6 w-px bg-il-neutro-200" />}
                        <ActiveFilterChips
                            filters={filters}
                            resultsCount={results.length}
                            totalCount={works.length}
                            showSummary={search.showResultsSummary}
                            labelFor={chipLabel}
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
                        <GalleryEmptyState onReset={resetAll} texts={settings.empty} />
                    ) : (
                        <>
                            <div ref={gridRef} className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-x-6 gap-y-7">
                                {visibleWorks.map((work, i) => (
                                    <WorkCard key={work.id_web_work} work={work} index={i} settings={settings.card} />
                                ))}
                            </div>
                            <LoadMoreButton
                                shown={visibleWorks.length}
                                total={results.length}
                                buttonLabel={settings.pagination.buttonLabel}
                                showCounter={settings.pagination.showCounter}
                                onLoadMore={handleLoadMore}
                            />
                        </>
                    )}
                </Container>
            </section>
        </div>
    );
}
