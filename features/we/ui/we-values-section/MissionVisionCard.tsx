import type { ValueAccent } from "./we-values-section.types";

type MissionVisionCardProps = {
    title: string;
    text: string | null; // si viene vacío, no se pinta el párrafo
    icon: string | null;
    accent: ValueAccent;
    showIcon: boolean; // Apariencia: missionvision.show_icons
};

export default function MissionVisionCard({
    title,
    text,
    icon,
    accent,
    showIcon,
}: MissionVisionCardProps) {
    return (
        <div className="h-full bg-gray-50 rounded-2xl border border-gray-200 p-8">
            {/* El icono solo se pinta si está activado y el item trae uno. */}
            {showIcon && icon && (
                <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                        accent === "gold" ? "bg-brand-gold/10" : "bg-brand-red/10"
                    }`}
                >
                    <i
                        className={`${icon} text-xl ${
                            accent === "gold" ? "text-brand-gold-dark" : "text-brand-red"
                        }`}
                    />
                </div>
            )}
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            {text && <p className="text-gray-600 text-sm leading-relaxed">{text}</p>}
        </div>
    );
}
