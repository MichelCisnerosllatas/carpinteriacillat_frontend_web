type MissionVisionCardProps = {
    title: string;
    text: string;
    icon: string;
    accent: "gold" | "red";
};

export default function MissionVisionCard({
    title,
    text,
    icon,
    accent,
}: MissionVisionCardProps) {
    return (
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8">
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
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{text}</p>
        </div>
    );
}
