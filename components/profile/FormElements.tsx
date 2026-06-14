import React, { useState } from 'react';
import { TOKENS } from '@/lib/design-tokens';

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  hint?: string;
}

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  hint,
}: FieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label
        className="block text-xs font-black uppercase tracking-widest mb-1.5"
        style={{ color: TOKENS.textMuted }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all duration-150"
        style={{
          background: disabled ? TOKENS.barBg : TOKENS.input,
          border: `1.5px solid ${focused ? TOKENS.accent : TOKENS.inputBorder}`,
          color: disabled ? TOKENS.textMuted : TOKENS.text,
          boxShadow: focused ? `0 0 0 3px ${TOKENS.inputFocus}` : 'none',
          cursor: disabled ? 'not-allowed' : 'text',
        }}
      />
      {hint && (
        <p className="mt-1 text-xs" style={{ color: TOKENS.textMuted }}>
          {hint}
        </p>
      )}
    </div>
  );
}

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  hint?: string;
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  hint,
}: TextAreaProps) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label
        className="block text-xs font-black uppercase tracking-widest mb-1.5"
        style={{ color: TOKENS.textMuted }}
      >
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all duration-150 resize-none"
        style={{
          background: TOKENS.input,
          border: `1.5px solid ${focused ? TOKENS.accent : TOKENS.inputBorder}`,
          color: TOKENS.text,
          boxShadow: focused ? `0 0 0 3px ${TOKENS.inputFocus}` : 'none',
        }}
      />
      <div className="flex items-center justify-between mt-1">
        {hint && (
          <p className="text-xs" style={{ color: TOKENS.textMuted }}>
            {hint}
          </p>
        )}
        <p
          className="ml-auto text-xs"
          style={{ color: value.length > 140 ? TOKENS.negative : TOKENS.textMuted }}
        >
          {value.length}/160
        </p>
      </div>
    </div>
  );
}

interface ToggleProps {
  enabled: boolean;
  onChange: (v: boolean) => void;
}

export function Toggle({ enabled, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className="relative flex-shrink-0 transition-all duration-200"
      style={{ width: 40, height: 22 }}
    >
      <div
        className="absolute inset-0 rounded-full transition-all duration-200"
        style={{
          background: enabled ? TOKENS.accent : TOKENS.barBg,
          border: `1.5px solid ${enabled ? TOKENS.accent : TOKENS.inputBorder}`,
        }}
      />
      <div
        className="absolute top-0.5 rounded-full transition-all duration-200"
        style={{
          width: 18,
          height: 18,
          background: '#fff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
          left: enabled ? 20 : 2,
        }}
      />
    </button>
  );
}
