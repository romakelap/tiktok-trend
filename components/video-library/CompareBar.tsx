import React from 'react';
import { GitCompareArrows, ArrowUpRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CompareBarProps {
  count: number;
  onOpenCompare: () => void;
  onClear: () => void;
}

export function CompareBar({ count, onOpenCompare, onClear }: CompareBarProps) {
  if (count === 0) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 rounded-2xl bg-stone-900/90 dark:bg-neutral-900/95 backdrop-blur-md border border-stone-700/60 dark:border-neutral-700 shadow-2xl flex items-center gap-3 px-4 py-2.5 min-w-[320px]">
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center flex-shrink-0">
          <GitCompareArrows className="w-4 h-4" strokeWidth={2.2} />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-xs text-white leading-tight">
            {count} video dipilih
          </p>
          <p className="text-[10px] text-stone-400 font-medium">
            {count < 2 ? 'Pilih minimal 2 video' : 'Siap dikomparasikan'}
          </p>
        </div>
      </div>
      <Button
        onClick={onClear}
        size="sm"
        variant="ghost"
        className="h-8 px-2.5 rounded-lg text-xs font-semibold text-stone-400 hover:text-white hover:bg-stone-800"
      >
        <X className="w-3.5 h-3.5 mr-1" />
        Reset
      </Button>
      <Button
        onClick={onOpenCompare}
        disabled={count < 2}
        size="sm"
        className="h-8 px-3 rounded-lg text-xs font-bold bg-sky-500 hover:bg-sky-400 text-white shadow-sm disabled:opacity-40"
      >
        Bandingkan
        <ArrowUpRight className="w-3.5 h-3.5 ml-1" strokeWidth={2.2} />
      </Button>
    </div>
  );
}
