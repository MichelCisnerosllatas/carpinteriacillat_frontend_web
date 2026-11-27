"use client";

import type { RefObject } from "react";
import { motion } from "framer-motion";

export type GalleryTab = {
    value: string;
    label: string;
};

type GalleryTabsProps = {
    tabRef: RefObject<HTMLDivElement | null>;
    tabs: GalleryTab[];
    activeTab: string;
    onSelectTab: (value: string) => void;
    isStuck: boolean;
    topOffset: number;
};

export default function GalleryTabs({
    tabRef,
    tabs,
    activeTab,
    onSelectTab,
    isStuck,
    topOffset,
}: GalleryTabsProps) {
    return (
        <motion.div
            ref={tabRef}
            className="sticky z-30 w-full flex justify-center mb-6"
            style={{ top: topOffset }}
            initial={{ y: -20, opacity: 0 }}
            animate={{
                y: 0,
                opacity: 1,
                boxShadow: isStuck
                    ? "0 10px 25px rgba(15,23,42,0.15)"
                    : "0 0 0 rgba(0,0,0,0)",
                scale: isStuck ? 1.01 : 1,
            }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
        >
            <div className="flex flex-wrap justify-center border-b border-gray-200 bg-white/90 backdrop-blur-md rounded-b-2xl px-3 pt-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => onSelectTab(tab.value)}
                        className={`
                            py-2 px-4 border-b-2 focus:outline-none transition-colors whitespace-nowrap
                            ${activeTab === tab.value
                                ? "border-brand-red text-brand-red"
                                : "border-transparent text-gray-600 hover:text-brand-red hover:border-brand-red"
                            }
                        `}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </motion.div>
    );
}
