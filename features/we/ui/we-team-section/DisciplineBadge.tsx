import type { Discipline } from "./we-team-section.types";

type DisciplineBadgeProps = {
    discipline: Discipline;
    showIcon: boolean; // Apariencia: disciplines.show_icons
};

export default function DisciplineBadge({ discipline, showIcon }: DisciplineBadgeProps) {
    return (
        <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 px-4 py-3">
            {/* El icono solo se pinta si está activado y el item trae uno. */}
            {showIcon && discipline.icon && (
                <div className="w-9 h-9 rounded-lg bg-brand-red/10 flex items-center justify-center shrink-0">
                    <i className={`${discipline.icon} text-brand-red text-sm`} />
                </div>
            )}
            <span className="text-sm font-semibold text-gray-800">
                {discipline.label}
            </span>
        </div>
    );
}
