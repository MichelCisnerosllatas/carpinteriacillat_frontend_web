import type { WhyUsItem } from "../model/types";

type WhyUsCardProps = {
    item: WhyUsItem;
};

export default function WhyUsCard({ item }: WhyUsCardProps) {
    return (
        <div className="bg-white px-8 py-6 shadow-lg rounded-xl border-b-4 border-brand-red">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-brand-red/10 mb-4">
                <i className={`${item.icon} text-2xl text-brand-red`} />
            </div>

            <h1 className="text-xl font-semibold text-gray-800 mb-3">{item.title}</h1>

            <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>
        </div>
    );
}
