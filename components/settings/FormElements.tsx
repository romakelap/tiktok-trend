import React, { useState } from 'react';
import { TOKENS } from '@/lib/design-tokens';
import { LucideIcon } from 'lucide-react';

interface LabelProps {
  children: React.ReactNode;
  required?: boolean;
}

export function Label({ children, required }: LabelProps) {
  return (
    <label
      className="block text-[10px] font-black uppercase tracking-widest mb-1.5"
      style={{ color: TOKENS.textMuted }}
    >
      {children}
      {required && <span style={{ color: '#b91c1c' }}> *</span>}
    </label>
  );
}

interface TextInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  icon?: LucideIcon;
  disabled?: boolean;
  maxLength?: number;
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  icon: Ico,
  disabled = false,
  maxLength,
}: TextInputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative">
      {Ico && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Ico className="w-4 h-4" style={{ color: TOKENS.textMuted }} strokeWidth={2} />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full h-11 rounded-xl text-sm font-semibold outline-none transition-all"
        style={{
          padding: Ico ? '0 12px 0 40px' : '0 12px',
          background: disabled ? 'rgba(0,0,0,0.03)' : TOKENS.card,
          border: `1px solid ${focused ? TOKENS.inputFocus : TOKENS.inputBorder}`,
          color: disabled ? TOKENS.textMuted : TOKENS.text,
          boxShadow: focused ? '0 0 0 3px rgba(0,0,0,0.06)' : 'none',
        }}
      />
    </div>
  );
}

interface TextAreaProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}

export function TextArea({ value, onChange, placeholder, rows = 3 }: TextAreaProps) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className="w-full rounded-xl text-sm font-semibold outline-none transition-all resize-none"
      style={{
        padding: '10px 12px',
        background: TOKENS.card,
        border: `1px solid ${focused ? TOKENS.inputFocus : TOKENS.inputBorder}`,
        color: TOKENS.text,
        boxShadow: focused ? '0 0 0 3px rgba(0,0,0,0.06)' : 'none',
        fontFamily: "'DM Sans', sans-serif",
      }}
    />
  );
}
