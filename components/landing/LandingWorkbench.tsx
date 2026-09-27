"use client";

import { useState } from "react";
import { CategoryComparison, BasicInformation } from "@/components/dashboard";
import { CATEGORIES } from "@/lib/dashboard/mock-data";
import type { CategoryId } from "@/lib/dashboard/types";

export default function LandingWorkbench() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>("lifestyle");

  return (
    <section id="workbench" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-stone-50/60 dark:bg-neutral-950 border-t border-stone-200/80 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
              Global Analysis Dashboard Interface
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-neutral-400 mt-1">
              Inspeksi langsung performa lintas klaster, kurva dual-axis, dan segmentasi analitik.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
          </div>
        </div>

        {/* Dashboard Workbench Frame (matching reference screenshot) */}
        <div className="rounded-xl overflow-hidden border border-stone-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-lg">
          {/* Browser Window Bar */}
          <div className="px-4 py-2.5 bg-stone-100 dark:bg-neutral-800/80 border-b border-stone-200 dark:border-neutral-800 flex items-center justify-between text-xs text-stone-500 dark:text-neutral-400 font-mono">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-stone-300 dark:bg-neutral-600" />
                <span className="w-2.5 h-2.5 rounded-full bg-stone-300 dark:bg-neutral-600" />
                <span className="w-2.5 h-2.5 rounded-full bg-stone-300 dark:bg-neutral-600" />
              </div>
              <span className="text-[11px] text-stone-400 dark:text-neutral-500">
                tt-bi.analytics.app / global-matrix / cluster-01
              </span>
            </div>

            <div className="flex items-center gap-4 text-[10.5px]">
              <span>Aggregated at ISO 8601: 2026-09-27T08:07:01Z</span>
            </div>
          </div>

          {/* Embedded Interactive Dashboard Components */}
          <div className="p-5 space-y-6">
            {/* KPI Row */}
            <BasicInformation summaryData={null} loading={false} />

            {/* Dual-axis Category Matrix & Focused Segment */}
            <CategoryComparison
              onSelectCategory={(id) => setSelectedCategory(id)}
              selectedCategory={selectedCategory}
              categories={CATEGORIES}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
