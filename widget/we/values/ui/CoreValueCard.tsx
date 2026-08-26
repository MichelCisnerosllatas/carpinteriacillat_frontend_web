import type { CoreValue } from "../model/mock";

type CoreValueCardProps = {
    value: CoreValue;
};

export default function CoreValueCard({ value }: CoreValueCardProps) {
    return (
        <div className="text-center rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-all">
            <div
                className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center ${
                    value.accent === "gold" ? "bg-brand-gold/10" : "bg-brand-red/10"
                }`}
            >
                <i
                    className={`${value.icon} text-lg ${
                        value.accent === "gold" ? "text-brand-gold-dark" : "text-brand-red"
                    }`}
                />
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-900">
                {value.label}
            </p>
        </div>
    );
}
