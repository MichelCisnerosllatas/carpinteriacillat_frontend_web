import ServiceCard from "./ServiceCard";
import { previewAnchorId, PREVIEW_ANCHOR_STYLE } from "@/shared/lib/previewAnchor";

type Service = {
    id: number | string;
    title: string;
    description: string;
    iconClass: string;
    iconBgClass?: string;
    iconColorClass?: string;
};

type ServicesGridProps = {
    items: Service[];
};

export default function ServicesGrid({ items }: ServicesGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-4">
            {items.map((it) => (
                <div
                    key={it.id}
                    id={typeof it.id === "number" ? previewAnchorId("section-item", it.id) : undefined}
                    style={PREVIEW_ANCHOR_STYLE}
                >
                    <ServiceCard
                        title={it.title}
                        description={it.description}
                        iconClass={it.iconClass}
                        iconBgClass={it.iconBgClass}
                        iconColorClass={it.iconColorClass}
                    />
                </div>
            ))}
        </div>
    );
}
