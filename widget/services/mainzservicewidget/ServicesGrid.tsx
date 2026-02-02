import ServiceCard from "./ServiceCard";

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
                <ServiceCard
                    key={it.id}
                    title={it.title}
                    description={it.description}
                    iconClass={it.iconClass}
                    iconBgClass={it.iconBgClass}
                    iconColorClass={it.iconColorClass}
                />
            ))}
        </div>
    );
}
