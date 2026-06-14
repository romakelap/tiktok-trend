import React from 'react';
import { TOKENS } from '@/lib/design-tokens';
import { CheckCircle2, X } from 'lucide-react';

export interface ToastType {
  id: number;
  message: string;
}

interface ToastProps {
  toasts: ToastType[];
  onDismiss: (id: number) => void;
}

export function Toast({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-3 px-4 py-3 rounded-xl pointer-events-auto transition-all duration-300 transform translate-y-0 opacity-100"
          style={{
            background: '#fff',
            border: `1px solid ${TOKENS.cardBorder}`,
            boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
            minWidth: 280,
          }}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(4,120,87,0.1)' }}
          >
            <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#047857' }} strokeWidth={2.5} />
          </div>
          <p className="flex-1 text-xs font-black" style={{ color: TOKENS.text }}>
            {t.message}
          </p>
          <button
            onClick={() => onDismiss(t.id)}
            className="hover:opacity-60 transition-all"
            style={{ color: TOKENS.textMuted }}
          >
            <X className="w-3 h-3" strokeWidth={2.5} />
          </button>
        </div>
      ))}
    </div>
  );
}
