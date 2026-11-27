import type { CoreValue } from "./we-values-section.types";

type CoreValueCardProps = {
    value: CoreValue;
    showIcon: boolean; // Apariencia: values.show_icons
};

export default function CoreValueCard({ value, showIcon }: CoreValueCardProps) {
    return (
        <div className="text-center rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-all">
            {/* El icono solo se pinta si está activado y el item trae uno. */}
            {showIcon && value.icon && (
                <div
                    className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center ${
                        value.accent === "gold" ? "bg-brand-gold/10" : "bg-brand-red/10"
                    }`}
                >
                    <i
                        className={`${value.icon} text-lg ${
                            value.accent === "gold" ? "text-brand-gold-dark" : "text-brand-red"
                        }`}
                    />
                </div>
            )}
            <p className="text-sm font-semibold text-slate-900">
                {value.label}
            </p>
        </div>
    );
}
