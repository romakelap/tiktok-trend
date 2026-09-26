import React from 'react';

interface HashtagPillProps {
  tag: string;
  muted?: boolean;
}

export function HashtagPill({ tag, muted = false }: HashtagPillProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md font-medium text-[11px] transition-colors ${
        muted
          ? 'bg-stone-100 text-stone-600 border border-stone-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700'
          : 'bg-sky-50 text-sky-700 border border-sky-200/80 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/80'
      }`}>
      {tag}
    </span>
  );
}
