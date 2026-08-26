import type { Testimonial } from "../model/types";
import { getInitials } from "../lib/getInitials";

import TestimonialStars from "./TestimonialStars";

type TestimonialCardProps = {
    item: Testimonial;
};

export default function TestimonialCard({
    item,
}: TestimonialCardProps) {
    return (
        <article className="group flex h-full min-h-[290px] flex-col rounded-2xl border border-slate-700/40 bg-gray-100 p-6 shadow-[0_8px_25px_rgba(15,23,42,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(15,23,42,0.16)]">

            {/* CLIENTE */}
            <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-amber-400/70 bg-amber-400/10 text-base font-bold text-amber-400">
                    {getInitials(item.name)}
                </div>

                <div className="min-w-0">
                    <h3 className="truncate text-base font-bold leading-tight">
                        {item.name}
                    </h3>

                    <p className="mt-1 text-[13px] leading-5 text-slate-400">
                        {item.role}

                        {item.city && (
                            <>
                                <span className="mx-1 text-slate-600">
                                    ·
                                </span>

                                {item.city}
                            </>
                        )}
                    </p>

                    <TestimonialStars
                        rating={item.rating}
                    />

                </div>

            </div>

            {/* MENSAJE */}
            <div className="flex flex-1 items-center py-6">

                <p className="text-[15px] font-medium leading-7 text-slate-500">
                    “{item.message}”
                </p>

            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-between gap-4 border-t border-slate-700 pt-4 text-xs">
                <div className="flex min-w-0 items-center gap-2 text-slate-400">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                        ✓
                    </span>

                    <span className="truncate">
                        Proyecto entregado
                    </span>
                </div>

                <span className="shrink-0 whitespace-nowrap text-[11px] italic text-slate-500">
                    Cliente verificado
                </span>

            </div>
        </article>
    );
}