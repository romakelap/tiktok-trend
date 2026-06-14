import React from 'react';
import { GitCompareArrows, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CompareBarProps {
  count: number;
  onOpenCompare: () => void;
  onClear: () => void;
}

export function CompareBar({ count, onOpenCompare, onClear }: CompareBarProps) {
  if (count === 0) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 rounded-2xl overflow-hidden flex items-center gap-2 px-3 py-2.5"
      style={{
        background: '#111',
        boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
        border: '1px solid rgba(255,255,255,0.1)',
        minWidth: 320,
      }}>
      <div className="flex items-center gap-2 px-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.1)' }}>
          <GitCompareArrows className="w-4 h-4 text-white" strokeWidth={2.2} />
        </div>
        <div>
          <p className="font-black text-sm text-white leading-tight">{count} video dipilih</p>
          <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {count < 2 ? 'Pilih minimal 2 untuk compare' : 'Siap dibandingkan'}
          </p>
        </div>
      </div>
      <Button onClick={onClear}
        size="sm" variant="ghost" className="h-9 rounded-xl text-xs font-black"
        style={{ color: 'rgba(255,255,255,0.7)' }}>
        Reset
      </Button>
      <Button onClick={onOpenCompare} disabled={count < 2}
        size="sm" className="h-9 rounded-xl text-xs font-black disabled:opacity-40"
        style={{ background: '#fff', color: '#111' }}>
        Compare
        <ArrowUpRight className="w-3.5 h-3.5 ml-1" strokeWidth={2.5} />
      </Button>
    </div>
  );
}
