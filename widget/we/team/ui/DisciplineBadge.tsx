import type { Discipline } from "../model/mock";

type DisciplineBadgeProps = {
    discipline: Discipline;
};

export default function DisciplineBadge({ discipline }: DisciplineBadgeProps) {
    return (
        <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 px-4 py-3">
            <div className="w-9 h-9 rounded-lg bg-brand-red/10 flex items-center justify-center shrink-0">
                <i className={`${discipline.icon} text-brand-red text-sm`} />
            </div>
            <span className="text-sm font-semibold text-gray-800">
                {discipline.label}
            </span>
        </div>
    );
}
