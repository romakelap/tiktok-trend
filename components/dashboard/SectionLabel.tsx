import type { ElementType, ReactNode } from "react";
import { TOKENS } from "@/lib/design-tokens";

type SectionLabelProps = {
  icon: ElementType;
  title: string;
  subtitle?: string;
  action?: ReactNode;
};

/**
 * Header row used above each dashboard section: icon badge + title + optional
 * subtitle + right-aligned action slot.
 */
export function SectionLabel({
  icon: Ico,
  title,
  subtitle,
  action,
}: SectionLabelProps) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: "#111" }}
        >
          <Ico className="w-3.5 h-3.5 text-white" strokeWidth={2.4} />
        </div>
        <div>
          <h2
            className="font-black text-sm tracking-tight"
            style={{ color: TOKENS.text }}
          >
            {title}
          </h2>
          {subtitle ? (
            <p
              className="text-[11px]"
              style={{ color: TOKENS.textMuted }}
            >
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
      {action}
    </div>
  );
}
