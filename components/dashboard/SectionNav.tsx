"use client";

import { Activity, BarChart2, Layers, Target, Hash, Flame } from "lucide-react";

import { TOKENS } from "@/lib/design-tokens";

const SECTIONS = [
  { id: "kpi",             label: "Global Info",     Ico: Activity  },
  { id: "category",        label: "Comparison",      Ico: Layers    },
  { id: "radar",           label: "Radar",           Ico: BarChart2 },
  { id: "trending-hash",   label: "Trending Tags",   Ico: Hash      },
  { id: "top-videos",      label: "Top Videos",      Ico: Flame     },
  { id: "category-detail", label: "Category Detail", Ico: Target    },
] as const;

/**
 * Sticky in-page anchor nav sitting just below the toolbar. Each link jumps
 * to a `section[id="…"]` via the browser's native scroll behaviour
 * (CSS `scroll-margin-top` keeps the scroll offset correct under the
 * sticky headers).
 */
export function SectionNav() {
  return (
    <div
      className="sticky top-[60px] z-20 px-6 py-2.5 border-b"
      style={{
        background: TOKENS.header,
        backdropFilter: "blur(20px)",
        borderColor: TOKENS.divider,
      }}
    >
      <div className="flex items-center gap-0.5 overflow-x-auto">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all hover:bg-black/[0.05]"
            style={{ color: TOKENS.textMuted }}
          >
            <s.Ico className="w-3.5 h-3.5" strokeWidth={2.4} />
            {s.label}
          </a>
        ))}
      </div>
    </div>
  );
}
