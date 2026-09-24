import type { ElementType, ReactNode } from "react";

type SectionLabelProps = {
  icon: ElementType;
  title: string;
  subtitle?: string;
  action?: ReactNode;
};

export function SectionLabel({
  icon: Ico,
  title,
  subtitle,
  action,
}: SectionLabelProps) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3 mb-3.5">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center flex-shrink-0">
          <Ico className="w-3.5 h-3.5" strokeWidth={2.2} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}
