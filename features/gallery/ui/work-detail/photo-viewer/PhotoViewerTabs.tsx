// features/gallery/ui/work-detail/photo-viewer/PhotoViewerTabs.tsx
//
// Selector "Abanico | Libro": dos formas de recorrer las fotos del trabajo.

export type PhotoViewMode = "abanico" | "libro";

type Props = {
    mode: PhotoViewMode;
    onChange: (mode: PhotoViewMode) => void;
};

const MODES: { key: PhotoViewMode; label: string }[] = [
    { key: "abanico", label: "Abanico" },
    { key: "libro", label: "Libro" },
];

export default function PhotoViewerTabs({ mode, onChange }: Props) {
    return (
        <div role="tablist" aria-label="Forma de ver las fotos" className="inline-flex gap-1 rounded-full bg-il-neutro-100 p-1">
            {MODES.map((item) => {
                const isActive = item.key === mode;
                return (
                    <button
                        key={item.key}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => onChange(item.key)}
                        className="il-display min-h-10 cursor-pointer rounded-full border-0 px-4 text-sm font-bold text-il-neutro-900"
                        style={{
                            background: isActive ? "#fff" : "transparent",
                            boxShadow: isActive ? "0 2px 8px rgba(20,24,31,.12)" : "none",
                        }}
                    >
                        {item.label}
                    </button>
                );
            })}
        </div>
    );
}
