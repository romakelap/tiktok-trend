import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { TOKENS } from '@/lib/design-tokens';

interface ToastItem {
  id: number;
  title: string;
  message: string;
  success: boolean;
}

interface ToastProps {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
}

export const Toast = ({ toasts, onDismiss }: ToastProps) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className="flex items-center gap-3 px-4 py-3 rounded-xl pointer-events-auto transition-all"
          style={{
            background: '#fff',
            border: `1px solid ${TOKENS.cardBorder}`,
            boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
            minWidth: 280,
          }}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: t.success ? 'rgba(4,120,87,0.1)' : 'rgba(185,28,28,0.1)' }}
          >
            {t.success ? (
              <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#047857' }} strokeWidth={2.5} />
            ) : (
              <AlertCircle className="w-3.5 h-3.5" style={{ color: '#b91c1c' }} strokeWidth={2.5} />
            )}
          </div>
          <div className="flex-1">
            <p className="text-xs font-black" style={{ color: TOKENS.text }}>{t.title}</p>
            <p className="text-[10px] font-bold" style={{ color: TOKENS.textMuted }}>{t.message}</p>
          </div>
          <button
            onClick={() => onDismiss(t.id)}
            className="w-5 h-5 flex items-center justify-center transition-all hover:opacity-60"
            style={{ color: TOKENS.textMuted }}
          >
            <X className="w-3 h-3" strokeWidth={2.5} />
          </button>
        </div>
      ))}
    </div>
  );
};
